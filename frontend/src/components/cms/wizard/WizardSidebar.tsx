'use client';

import React from 'react';
import { useWizardStore, WizardStepId } from '@/store/wizardStore';
import { StepValidationBadge } from '@/components/cms/wizard/StepValidationBadge';

interface WizardStepConfig {
  id: WizardStepId;
  label: string;
  description: string;
}

export const WizardSidebar: React.FC = () => {
  const { currentStep, setCurrentStep, validation, conditions, readingSections, questions, promptTemplates } =
    useWizardStore();

  const steps: WizardStepConfig[] = [
    { id: 'general', label: 'General Information', description: 'Title, metadata & parameters' },
    { id: 'conditions', label: 'Conditions', description: 'Experimental cohorts' },
    { id: 'reading', label: 'Reading Content', description: 'Sections & paragraphs' },
    { id: 'quiz', label: 'Assessment Quizzes', description: 'Comprehension evaluations' },
    { id: 'prompts', label: 'AI Prompt Templates', description: 'LLM intervention rules' },
    { id: 'preview', label: 'Preview & Publish', description: 'Readiness report & deploy' },
  ];

  const getStepStatus = (id: WizardStepId) => {
    const issues = validation.filter((v) => v.fieldId && v.fieldId.startsWith(id));
    const criticalCount = issues.filter((v) => v.severity === 'critical').length;
    const warningCount = issues.filter((v) => v.severity === 'warning').length;

    let isCompleted = false;
    if (id === 'general') isCompleted = true;
    if (id === 'conditions') isCompleted = conditions.length > 0;
    if (id === 'reading') isCompleted = readingSections.length > 0;
    if (id === 'quiz') isCompleted = questions.length > 0;
    if (id === 'prompts') isCompleted = promptTemplates.length > 0;
    if (id === 'preview') isCompleted = criticalCount === 0;

    return { criticalCount, warningCount, isCompleted };
  };

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-2 select-none">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
        Configuration Workflow
      </div>

      <nav className="space-y-1">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const { criticalCount, warningCount, isCompleted } = getStepStatus(step.id);

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                isActive
                  ? 'bg-primary/15 border-primary/40 shadow-md text-white'
                  : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className={`text-xs font-mono font-bold mt-0.5 ${isActive ? 'text-primary-light' : 'text-slate-500'}`}>
                  {idx + 1}.
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{step.label}</div>
                  <div className="text-[11px] text-slate-500 truncate">{step.description}</div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-0.5">
                <StepValidationBadge
                  criticalCount={criticalCount}
                  warningCount={warningCount}
                  isCompleted={isCompleted}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
