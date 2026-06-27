'use client';

import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export interface AutosaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSavedAt?: string | null;
}

export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({ status, lastSavedAt }) => {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
        <Spinner size="sm" />
        <span>Saving changes...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-mono text-error">
        <span className="w-2 h-2 rounded-full bg-error animate-ping" />
        <span>Sync Failed (Retrying)</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
        <span className="w-2 h-2 rounded-full bg-slate-500" />
        <span>Offline (Cached Locally)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      <span>All saved {lastSavedAt ? `at ${lastSavedAt}` : ''}</span>
    </div>
  );
};
