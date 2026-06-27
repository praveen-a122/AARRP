'use client';

import React from 'react';
import { useWizardStore, WizardStepId } from '@/store/wizardStore';
import { Button } from '@/components/ui/Button';

const stepOrder: WizardStepId[] = ['general', 'conditions', 'reading', 'quiz', 'prompts', 'preview'];

export const WizardStepper: React.FC = () => {
  const { currentStep, setCurrentStep, validation } = useWizardStore();

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
    <div className="flex items-center justify-between py-4 border-t border-slate-800 bg-slate-950/60 px-6 rounded-b-xl">
      <Button variant="outline" size="md" onClick={handlePrev} disabled={currentIndex === 0}>
        ← Previous Step
      </Button>

      <div className="flex items-center gap-2">
        {stepOrder.map((step, idx) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            title={`Jump to step ${idx + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentStep === step ? 'bg-primary scale-125' : idx <= currentIndex ? 'bg-slate-600' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      <Button
        variant="default"
        size="md"
        onClick={handleNext}
        disabled={currentIndex === stepOrder.length - 1 || hasCriticals}
        title={hasCriticals ? 'Fix critical validation errors before proceeding' : undefined}
      >
        Next Step →
      </Button>
    </div>
  );
};
