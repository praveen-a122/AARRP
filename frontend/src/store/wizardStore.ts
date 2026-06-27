import { create } from 'zustand';
import type { Experiment, Condition, ReadingSection, Paragraph, Question } from '@/types/api';
import type { ValidationIssue } from '@/components/cms/ValidationPanel';

export type WizardStepId = 'general' | 'conditions' | 'reading' | 'quiz' | 'prompts' | 'preview';

export interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  model: string;
  temperature?: number;
}

export interface WizardState {
  experiment: Partial<Experiment> | null;
  conditions: Condition[];
  readingSections: ReadingSection[];
  paragraphs: Paragraph[];
  questions: Question[];
  promptTemplates: PromptTemplate[];
  validation: ValidationIssue[];
  currentStep: WizardStepId;
  loading: boolean;
  dirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSavedAt: string | null;

  // Actions
  initExperiment: (exp: Partial<Experiment>) => void;
  updateField: (field: string, value: unknown) => void;
  addItem: (
    collection: 'conditions' | 'readingSections' | 'paragraphs' | 'questions' | 'promptTemplates',
    item: unknown
  ) => void;
  removeItem: (
    collection: 'conditions' | 'readingSections' | 'paragraphs' | 'questions' | 'promptTemplates',
    id: string
  ) => void;
  duplicateItem: (
    collection: 'conditions' | 'readingSections' | 'paragraphs' | 'questions' | 'promptTemplates',
    id: string
  ) => void;
  reorderItems: (
    collection: 'conditions' | 'readingSections' | 'paragraphs' | 'questions' | 'promptTemplates',
    newItems: unknown[]
  ) => void;
  setCurrentStep: (step: WizardStepId) => void;
  setValidation: (issues: ValidationIssue[]) => void;
  setSaveStatus: (
    status: 'idle' | 'saving' | 'saved' | 'error' | 'offline',
    timestamp?: string
  ) => void;
  resetWizard: () => void;
}

const initialState = {
  experiment: {
    title: 'Untitled Research Experiment',
    description: '',
  },
  conditions: [],
  readingSections: [],
  paragraphs: [],
  questions: [],
  promptTemplates: [],
  validation: [],
  currentStep: 'general' as WizardStepId,
  loading: false,
  dirty: false,
  saveStatus: 'idle' as const,
  lastSavedAt: null,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,

  initExperiment: (exp) =>
    set({
      experiment: exp,
      conditions: exp.current_version?.conditions || [],
      dirty: false,
      saveStatus: 'saved',
      lastSavedAt: new Date().toLocaleTimeString(),
    }),

  updateField: (field, value) =>
    set((state) => ({
      experiment: state.experiment ? { ...state.experiment, [field]: value } : { [field]: value },
      dirty: true,
      saveStatus: 'idle',
    })),

  addItem: (collection, item) =>
    set((state) => {
      const currentList = (state[collection] as unknown[]) || [];
      return {
        [collection]: [...currentList, item],
        dirty: true,
        saveStatus: 'idle',
      };
    }),

  removeItem: (collection, id) =>
    set((state) => {
      const currentList = (state[collection] as Array<{ id?: string }>) || [];
      return {
        [collection]: currentList.filter((item) => item.id !== id),
        dirty: true,
        saveStatus: 'idle',
      };
    }),

  duplicateItem: (collection, id) =>
    set((state) => {
      const currentList = (state[collection] as Array<{ id?: string }>) || [];
      const index = currentList.findIndex((item) => item.id === id);
      if (index === -1) return state;
      const original = currentList[index];
      const copy = { ...original, id: `${original.id || 'item'}_copy_${Date.now()}` };
      const newList = [...currentList];
      newList.splice(index + 1, 0, copy);
      return {
        [collection]: newList,
        dirty: true,
        saveStatus: 'idle',
      };
    }),

  reorderItems: (collection, newItems) =>
    set(() => ({
      [collection]: newItems,
      dirty: true,
      saveStatus: 'idle',
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setValidation: (issues) => set({ validation: issues }),

  setSaveStatus: (status, timestamp) =>
    set((state) => ({
      saveStatus: status,
      dirty: status === 'saved' ? false : state.dirty,
      lastSavedAt: timestamp || (status === 'saved' ? new Date().toLocaleTimeString() : state.lastSavedAt),
    })),

  resetWizard: () => set({ ...initialState }),
}));
