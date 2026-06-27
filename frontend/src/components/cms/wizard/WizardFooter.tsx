'use client';

import React from 'react';
import { useWizardStore, WizardStepId } from '@/store/wizardStore';
import { Button } from '@/components/ui/Button';

const stepOrder: WizardStepId[] = ['general', 'conditions', 'reading', 'quiz', 'prompts', 'preview'];

export interface WizardFooterProps {
  onSaveDraft?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  isSaving?: boolean;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  onSaveDraft,
  onPreview,
  onPublish,
  isSaving = false,
}) => {
  const { currentStep, setCurrentStep, validation, dirty } = useWizardStore();

  const currentIndex = stepOrder.indexOf(currentStep);
  const criticalIssues = validation.filter((v) => v.severity === 'critical');
  const hasCriticals = criticalIssues.length > 0;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < stepOrder.length - 1 && !hasCriticals) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  return (
    <footer className="sticky bottom-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" size="md" onClick={handlePrev} disabled={currentIndex === 0 || isSaving}>
          ← Previous
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleNext}
          disabled={currentIndex === stepOrder.length - 1 || hasCriticals || isSaving}
        >
          Next →
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {onSaveDraft && (
          <Button variant="secondary" size="md" onClick={onSaveDraft} disabled={!dirty || isSaving} isLoading={isSaving}>
            Save Draft
          </Button>
        )}
        {onPreview && (
          <Button variant="outline" size="md" onClick={onPreview} disabled={isSaving}>
            Preview
          </Button>
        )}
        {onPublish && (
          <Button
            variant="default"
            size="md"
            onClick={onPublish}
            disabled={hasCriticals || isSaving}
            isLoading={isSaving}
          >
            Publish Experiment
          </Button>
        )}
      </div>
    </footer>
  );
};
