'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => Promise<void> | void;
  isPublishing?: boolean;
  experimentTitle: string;
  versionNumber?: number;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing = false,
  experimentTitle,
  versionNumber = 1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-lg">
            ⚠️
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg font-bold text-white tracking-tight">Confirm Immutable Publication</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are about to publish <strong className="text-white">{experimentTitle}</strong> (v{versionNumber}.0) to the production participant runtime cluster.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2 text-slate-300 font-mono">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <span>🔒 Immutable Release Guarantee</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-normal font-sans">
            Once published, active participant cohorts will begin reading and interacting with this exact configuration snapshot. Subsequent edits will automatically branch into v{versionNumber + 1}.0 Draft to preserve longitudinal telemetry integrity.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
          <Button variant="outline" size="md" onClick={onClose} disabled={isPublishing}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="md"
            onClick={onConfirmPublish}
            disabled={isPublishing}
            isLoading={isPublishing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Deploy v{versionNumber}.0 to Runtime
          </Button>
        </div>
      </div>
    </div>
  );
};
