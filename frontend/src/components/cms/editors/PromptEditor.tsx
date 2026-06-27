'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PromptVariableEditor } from '@/components/cms/editors/PromptVariableEditor';
import { VariableCatalog } from '@/components/cms/editors/VariableCatalog';
import { TokenEstimator } from '@/components/cms/editors/TokenEstimator';
import { ModelSettingsPanel, ModelSettings } from '@/components/cms/editors/ModelSettingsPanel';
import { PromptPreview } from '@/components/cms/editors/PromptPreview';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { ExtendedPromptTemplate } from '@/components/cms/editors/PromptLibraryPanel';

export interface PromptEditorProps {
  template: ExtendedPromptTemplate;
  index: number;
  totalCount: number;
  onChange: (updated: ExtendedPromptTemplate) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave?: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  template,
  index,
  totalCount,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onSave,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'prompt' | 'variables' | 'model' | 'preview'>('prompt');
  const [activeField, setActiveField] = useState<'systemPrompt' | 'userPromptTemplate'>('systemPrompt');

  useKeyboardShortcuts({
    onSave,
    onDuplicate,
    onDelete,
  });

  const handleChange = (field: keyof ExtendedPromptTemplate, value: unknown) => {
    onChange({ ...template, [field]: value });
  };

  const handleInsertVariable = (varKey: string) => {
    const currentText = (template[activeField] as string) || '';
    handleChange(activeField, `${currentText} ${varKey}`.trim());
  };

  const handleRenameVar = (oldName: string, newName: string) => {
    const sys = (template.systemPrompt || '').replace(new RegExp(`\\{\\{${oldName}\\}\\}`, 'g'), `{{${newName}}}`);
    const usr = (template.userPromptTemplate || '').replace(new RegExp(`\\{\\{${oldName}\\}\\}`, 'g'), `{{${newName}}}`);
    const vars = (template.variables || []).map((v) => (v === oldName ? newName : v));
    onChange({ ...template, systemPrompt: sys, userPromptTemplate: usr, variables: vars });
  };

  const modelSettings: ModelSettings = {
    provider: template.provider || 'openai',
    model: template.model || 'gpt-4o',
    temperature: template.temperature ?? 0.7,
    top_p: template.top_p ?? 1.0,
    max_tokens: template.max_tokens ?? 500,
    frequency_penalty: template.frequency_penalty ?? 0.0,
    presence_penalty: template.presence_penalty ?? 0.0,
    fallbackProvider: template.fallbackProvider,
  };

  const handleModelChange = (updated: ModelSettings) => {
    onChange({
      ...template,
      provider: updated.provider,
      model: updated.model,
      temperature: updated.temperature,
      top_p: updated.top_p,
      max_tokens: updated.max_tokens,
      frequency_penalty: updated.frequency_penalty,
      presence_penalty: updated.presence_penalty,
      fallbackProvider: updated.fallbackProvider,
    });
  };

  return (
    <div className="space-y-6 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 transition-all hover:border-slate-700">
      {/* Top Header & Reorder Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 bg-primary/10 rounded border border-primary/20">
            Prompt Rule #{index + 1}
          </span>
          <Input
            label=""
            value={template.name || `Prompt Template ${index + 1}`}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Template identification rule name..."
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={index === 0} title="Move Up">
            ↑
          </Button>
          <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={index === totalCount - 1} title="Move Down">
            ↓
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate} className="text-xs">
            Duplicate
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs">
            Delete
          </Button>
        </div>
      </div>

      {/* Trigger & Intervention Type Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Intervention Category Type</label>
          <select
            value={template.interventionType || 'scaffolding'}
            onChange={(e) => handleChange('interventionType', e.target.value)}
            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="scaffolding">Scaffolding Assistance (Help on complex text)</option>
            <option value="comprehension_check">Socratic Comprehension Check</option>
            <option value="summary">Automated Section Summarization</option>
            <option value="reflection">Critical Reflection Prompt</option>
            <option value="custom">Custom Behavioral Rule</option>
          </select>
        </div>

        <Input
          label="Trigger Condition Reason / Threshold"
          value={template.triggerReason || ''}
          onChange={(e) => handleChange('triggerReason', e.target.value)}
          placeholder="e.g. Participant dwell time > 90s or Quiz score < 60%"
        />
      </div>

      {/* Editor Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'prompt', label: 'Instruction Composer' },
          { id: 'variables', label: 'Variables & Catalog' },
          { id: 'model', label: 'Model Parameters' },
          { id: 'preview', label: 'Simulation & Tokens' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-primary/20 text-primary-light border border-primary/40'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subtab Views */}
      {activeSubTab === 'prompt' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">System Prompt (Base AI Persona & Guardrails)</label>
              <button
                type="button"
                onClick={() => setActiveField('systemPrompt')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeField === 'systemPrompt' ? 'bg-primary text-white font-bold' : 'bg-slate-950 text-slate-500'}`}
              >
                {activeField === 'systemPrompt' ? 'Targeting Insertion Here' : 'Click to Target Catalog Insertion'}
              </button>
            </div>
            <textarea
              value={template.systemPrompt || ''}
              onFocus={() => setActiveField('systemPrompt')}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              placeholder="You are an expert tutor guiding research study participants through complex academic readings..."
              rows={4}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">User Prompt Template (Dynamic Runtime Query)</label>
              <button
                type="button"
                onClick={() => setActiveField('userPromptTemplate')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeField === 'userPromptTemplate' ? 'bg-primary text-white font-bold' : 'bg-slate-950 text-slate-500'}`}
              >
                {activeField === 'userPromptTemplate' ? 'Targeting Insertion Here' : 'Click to Target Catalog Insertion'}
              </button>
            </div>
            <textarea
              value={template.userPromptTemplate || ''}
              onFocus={() => setActiveField('userPromptTemplate')}
              onChange={(e) => handleChange('userPromptTemplate', e.target.value)}
              placeholder="The participant is struggling with paragraph: {{paragraph.content}}. Generate a supportive hint."
              rows={4}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Researcher Notes</label>
            <input
              type="text"
              value={template.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Internal justification for this prompt specification..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {activeSubTab === 'variables' && (
        <div className="space-y-6">
          <PromptVariableEditor
            systemPrompt={template.systemPrompt || ''}
            userPrompt={template.userPromptTemplate || ''}
            variables={template.variables || []}
            onVariablesChange={(vars) => handleChange('variables', vars)}
            onRenameVariable={handleRenameVar}
          />
          <VariableCatalog onInsertVariable={handleInsertVariable} />
        </div>
      )}

      {activeSubTab === 'model' && (
        <ModelSettingsPanel settings={modelSettings} onChange={handleModelChange} />
      )}

      {activeSubTab === 'preview' && (
        <div className="space-y-6">
          <TokenEstimator
            systemPrompt={template.systemPrompt || ''}
            userPrompt={template.userPromptTemplate || ''}
            maxTokens={template.max_tokens ?? 500}
            model={template.model || 'gpt-4o'}
          />
          <PromptPreview
            systemPrompt={template.systemPrompt || ''}
            userPromptTemplate={template.userPromptTemplate || ''}
            variables={template.variables || []}
          />
        </div>
      )}
    </div>
  );
};
