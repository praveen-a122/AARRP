'use client';

import React from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { AutosaveIndicator } from '@/components/cms/wizard/AutosaveIndicator';
import { Badge } from '@/components/ui/Badge';

export const WizardHeader: React.FC = () => {
  const { experiment, saveStatus, lastSavedAt, dirty } = useWizardStore();

  const title = experiment?.title || 'Untitled Research Experiment';
  const status = experiment?.current_version?.status || 'draft';
  const versionNum = experiment?.current_version?.version_number || 1;

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-white truncate tracking-tight">{title}</h1>
          <span className="font-mono text-xs text-slate-400 font-bold">v{versionNum}.0</span>
          <Badge variant={status === 'published' ? 'success' : 'warning'}>{status.toUpperCase()}</Badge>
          {dirty && (
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Unsaved
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">
          Experiment Wizard Configuration Orchestrator
        </p>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        <AutosaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
      </div>
    </header>
  );
};
