'use client';

import React, { ReactNode } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { WizardHeader } from '@/components/cms/wizard/WizardHeader';
import { WizardSidebar } from '@/components/cms/wizard/WizardSidebar';
import { WizardFooter, WizardFooterProps } from '@/components/cms/wizard/WizardFooter';
import { ValidationPanel } from '@/components/cms/ValidationPanel';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { Spinner } from '@/components/ui/Spinner';

export interface WizardLayoutProps extends WizardFooterProps {
  children: ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  onSaveDraft,
  onPreview,
  onPublish,
  isSaving = false,
}) => {
  const { loading, dirty, validation } = useWizardStore();

  useUnsavedChangesWarning({ isDirty: dirty });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Spinner size="lg" label="Hydrating experimental configuration from database cluster..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <WizardHeader />

      <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
        <WizardSidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto w-full">
          <ValidationPanel issues={validation} />
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl min-h-[500px]">
            {children}
          </div>
        </main>
      </div>

      <WizardFooter
        onSaveDraft={onSaveDraft}
        onPreview={onPreview}
        onPublish={onPublish}
        isSaving={isSaving}
      />
    </div>
  );
};
