'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/store/wizardStore';
import { WizardLayout } from '@/components/cms/wizard/WizardLayout';
import { FormSection } from '@/components/cms/FormSection';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/apiClient';
import { useRobustAutosave } from '@/hooks/useRobustAutosave';
import { ReadingBuilder } from '@/components/cms/editors/ReadingBuilder';
import { QuizBuilder } from '@/components/cms/editors/QuizBuilder';
import { PromptBuilder } from '@/components/cms/editors/PromptBuilder';
import { PublishDashboard } from '@/components/cms/wizard/PublishDashboard';
import type { Experiment } from '@/types/api';

export default function NewExperimentWizardPage() {
  const router = useRouter();
  const {
    experiment,
    initExperiment,
    updateField,
    currentStep,
    setSaveStatus,
    dirty,
  } = useWizardStore();

  useEffect(() => {
    initExperiment({
      title: 'New Research Experiment',
      description: 'Enter an abstract or summary for this reading cohort study.',
    });
  }, [initExperiment]);

  const handleSave = useCallback(async (data: Partial<Experiment> | null) => {
    if (!data) return null;
    setSaveStatus('saving');
    try {
      if (data.id) {
        const updated = await apiClient.put<Experiment>(`/api/cms/experiment/${data.id}`, data);
        setSaveStatus('saved');
        return updated;
      } else {
        const created = await apiClient.post<Experiment>('/api/cms/experiment', {
          title: data.title || 'Untitled Experiment',
          description: data.description || '',
        });
        updateField('id', created.id);
        setSaveStatus('saved');
        router.replace(`/admin/cms/experiments/${created.id}/edit`);
        return created;
      }
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  }, [router, setSaveStatus, updateField]);

  useRobustAutosave({
    data: experiment,
    onSave: handleSave,
    intervalMs: 3000,
    enabled: dirty && !!experiment?.title,
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 'general':
        return (
          <FormSection title="Experiment Abstract & Metadata" description="Core identification parameters.">
            <div className="space-y-4">
              <Input
                label="Experiment Title"
                required
                value={experiment?.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Longitudinal Adaptive Prompting Study"
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Abstract Description</label>
                <textarea
                  value={experiment?.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Summarize cohort reading goals and intervention thresholds..."
                  rows={4}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </FormSection>
        );
      case 'reading':
        return <ReadingBuilder />;
      case 'quiz':
        return <QuizBuilder />;
      case 'prompts':
        return <PromptBuilder />;
      case 'conditions':
        return (
          <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl space-y-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">{currentStep} Module</h3>
            <p className="text-xs text-slate-500">
              Save general parameters to unlock sub-editors for {currentStep} configuration.
            </p>
          </div>
        );
      case 'preview':
        return <PublishDashboard />;
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      onSaveDraft={() => handleSave(experiment)}
      onPreview={() => alert('Save draft to initialize preview container.')}
      onPublish={() => alert('Cannot publish incomplete experiment.')}
    >
      {renderStepContent()}
    </WizardLayout>
  );
}
