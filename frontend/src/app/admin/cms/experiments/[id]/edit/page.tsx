'use client';

import React, { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useWizardStore } from '@/store/wizardStore';
import { WizardLayout } from '@/components/cms/wizard/WizardLayout';
import { FormSection } from '@/components/cms/FormSection';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { apiClient } from '@/lib/apiClient';
import { useRobustAutosave } from '@/hooks/useRobustAutosave';
import { ReadingBuilder } from '@/components/cms/editors/ReadingBuilder';
import { QuizBuilder } from '@/components/cms/editors/QuizBuilder';
import { PromptBuilder } from '@/components/cms/editors/PromptBuilder';
import { PublishDashboard } from '@/components/cms/wizard/PublishDashboard';
import type { Experiment } from '@/types/api';

export default function EditExperimentWizardPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || '';

  const {
    experiment,
    initExperiment,
    updateField,
    currentStep,
    setSaveStatus,
    dirty,
  } = useWizardStore();

  const { data: fetchedExp, isLoading, isError, error } = useQuery<Experiment, Error>({
    queryKey: ['cms', 'experiment', id],
    queryFn: () => apiClient.get<Experiment>(`/api/cms/experiment/${id}`),
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (fetchedExp) {
      initExperiment(fetchedExp);
    }
  }, [fetchedExp, initExperiment]);

  const handleSave = useCallback(async (data: Partial<Experiment> | null) => {
    if (!data || !id) return null;
    setSaveStatus('saving');
    try {
      const updated = await apiClient.put<Experiment>(`/api/cms/experiment/${id}`, data);
      setSaveStatus('saved');
      return updated;
    } catch (err) {
      setSaveStatus('error');
      throw err;
    }
  }, [id, setSaveStatus]);

  useRobustAutosave({
    data: experiment,
    onSave: handleSave,
    queryKeyToInvalidate: ['cms', 'experiment', id],
    intervalMs: 3000,
    enabled: dirty && !!id && !!experiment,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Spinner size="lg" label="Loading experiment configuration..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Alert variant="error" title="Experiment Unreachable">
          {error?.message || 'Could not load requested experiment record.'}
        </Alert>
        <button
          onClick={() => router.push('/admin/cms')}
          className="text-xs font-mono text-primary hover:underline"
        >
          ← Return to CMS Overview
        </button>
      </div>
    );
  }

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
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Abstract Description</label>
                <textarea
                  value={experiment?.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
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
            <h3 className="text-base font-bold text-white uppercase tracking-wider">{currentStep} Editor Shell</h3>
            <p className="text-xs text-slate-500">
              Sub-editors for {currentStep} will be mounted here in upcoming builder batches.
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
      onPreview={() => window.open(`/participant/preview-${id}`, '_blank')}
      onPublish={() => alert('Publish workflow will validate all sub-modules.')}
    >
      {renderStepContent()}
    </WizardLayout>
  );
}
