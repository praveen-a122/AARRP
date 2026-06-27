'use client';

import React, { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { PromptEditor } from '@/components/cms/editors/PromptEditor';
import { PromptLibraryPanel, ExtendedPromptTemplate } from '@/components/cms/editors/PromptLibraryPanel';
import { Button } from '@/components/ui/Button';
import type { ValidationIssue } from '@/components/cms/ValidationPanel';

export const PromptBuilder: React.FC = () => {
  const {
    promptTemplates,
    addItem,
    removeItem,
    duplicateItem,
    reorderItems,
    setValidation,
    validation,
  } = useWizardStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'library'>('editor');
  const [libraryPresets, setLibraryPresets] = useState<ExtendedPromptTemplate[]>([
    {
      id: 'lib_1',
      name: 'Socratic Scaffolding Hint',
      systemPrompt: 'You are an adaptive research tutor. Guide the participant without giving direct answers.',
      model: 'gpt-4o',
      temperature: 0.6,
      interventionType: 'scaffolding',
      userPromptTemplate: 'Participant is reading {{paragraph.content}} and requested hint.',
    },
    {
      id: 'lib_2',
      name: 'Comprehension Check Evaluator',
      systemPrompt: 'Evaluate participant answer strictly according to scoring key.',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.2,
      interventionType: 'comprehension_check',
      userPromptTemplate: 'Evaluate answer against target threshold.',
    },
  ]);

  const extTemplates = (promptTemplates as unknown as ExtendedPromptTemplate[]) || [];

  // Validate prompt configurations
  useEffect(() => {
    const issues: ValidationIssue[] = [];
    if (extTemplates.length === 0) {
      issues.push({
        id: 'prompts-no-items',
        fieldId: 'prompts',
        message: 'At least one AI intervention prompt template must be defined.',
        severity: 'critical',
      });
    }

    extTemplates.forEach((tpl, idx) => {
      if (!tpl.systemPrompt || !tpl.systemPrompt.trim()) {
        issues.push({
          id: `tpl-sys-${tpl.id || idx}`,
          fieldId: 'prompts',
          message: `Prompt Rule #${idx + 1} (${tpl.name}) is missing a system prompt body.`,
          severity: 'critical',
        });
      }
      if (!tpl.model) {
        issues.push({
          id: `tpl-mod-${tpl.id || idx}`,
          fieldId: 'prompts',
          message: `Prompt Rule #${idx + 1} has invalid target model configuration.`,
          severity: 'critical',
        });
      }
    });

    const otherIssues = validation.filter((v) => !v.fieldId || !v.fieldId.startsWith('prompts'));
    setValidation([...otherIssues, ...issues]);
  }, [extTemplates, setValidation]);

  const handleAddTemplate = () => {
    const newTpl: ExtendedPromptTemplate = {
      id: `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `AI Intervention Rule ${extTemplates.length + 1}`,
      systemPrompt: 'You are a helpful academic study assistant.',
      model: 'gpt-4o',
      temperature: 0.7,
      userPromptTemplate: 'Participant query regarding: {{paragraph.title}}',
      interventionType: 'scaffolding',
      variables: ['paragraph.title'],
    };
    addItem('promptTemplates', newTpl);
  };

  const handleSelectFromLibrary = (preset: ExtendedPromptTemplate) => {
    const copy: ExtendedPromptTemplate = {
      ...preset,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${preset.name} (Imported)`,
    };
    addItem('promptTemplates', copy);
    setActiveTab('editor');
  };

  const handleImportJson = (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr) as ExtendedPromptTemplate;
    if (!parsed.name || !parsed.model) {
      throw new Error('Invalid schema');
    }
    setLibraryPresets([...libraryPresets, { ...parsed, id: `lib_${Date.now()}` }]);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'editor', label: `1. Active Prompt Rules (${extTemplates.length})` },
            { id: 'library', label: `2. Template Library (${libraryPresets.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'editor' && (
          <Button variant="default" size="md" onClick={handleAddTemplate} className="text-xs">
            + Define Prompt Rule
          </Button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {extTemplates.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-slate-900/20">
              <h3 className="text-base font-bold text-white">No AI Prompt Intervention Rules Configured</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Define adaptive LLM scaffolding instructions or load presets from the template repository.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="default" size="md" onClick={handleAddTemplate}>
                  + Create Blank Rule
                </Button>
                <Button variant="outline" size="md" onClick={() => setActiveTab('library')}>
                  Browse Preset Library
                </Button>
              </div>
            </div>
          ) : (
            extTemplates.map((tpl, tIdx) => (
              <PromptEditor
                key={tpl.id}
                template={tpl}
                index={tIdx}
                totalCount={extTemplates.length}
                onChange={(updated) => {
                  const copy = extTemplates.map((item) => (item.id === updated.id ? updated : item));
                  reorderItems('promptTemplates', copy);
                }}
                onDelete={() => removeItem('promptTemplates', tpl.id)}
                onDuplicate={() => duplicateItem('promptTemplates', tpl.id)}
                onMoveUp={() => {
                  if (tIdx > 0) {
                    const copy = [...extTemplates];
                    const temp = copy[tIdx];
                    copy[tIdx] = copy[tIdx - 1];
                    copy[tIdx - 1] = temp;
                    reorderItems('promptTemplates', copy);
                  }
                }}
                onMoveDown={() => {
                  if (tIdx < extTemplates.length - 1) {
                    const copy = [...extTemplates];
                    const temp = copy[tIdx];
                    copy[tIdx] = copy[tIdx + 1];
                    copy[tIdx + 1] = temp;
                    reorderItems('promptTemplates', copy);
                  }
                }}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'library' && (
        <PromptLibraryPanel
          templates={libraryPresets}
          onSelectTemplate={handleSelectFromLibrary}
          onDuplicateTemplate={(id) => {
            const found = libraryPresets.find((item) => item.id === id);
            if (found) setLibraryPresets([...libraryPresets, { ...found, id: `lib_${Date.now()}`, name: `${found.name} (Copy)` }]);
          }}
          onArchiveTemplate={(id) => setLibraryPresets(libraryPresets.filter((item) => item.id !== id))}
          onImportTemplate={handleImportJson}
          onExportTemplate={(tpl) => {
            const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tpl.name.toLowerCase().replace(/\s+/g, '_')}_prompt_spec.json`;
            a.click();
          }}
        />
      )}
    </div>
  );
};
