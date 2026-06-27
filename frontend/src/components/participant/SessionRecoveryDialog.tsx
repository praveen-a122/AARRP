'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface SessionRecoveryDialogProps {
  isOpen: boolean;
  lastSectionTitle?: string;
  elapsedSeconds?: number;
  onResume: () => void;
  onRestart: () => void;
}

export const SessionRecoveryDialog: React.FC<SessionRecoveryDialogProps> = ({
  isOpen,
  lastSectionTitle,
  elapsedSeconds = 0,
  onResume,
  onRestart,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    return `${m} minute${m === 1 ? '' : 's'}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full p-6 sm:p-8 bg-slate-900 border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg mb-2 font-bold">
            🔄
          </div>
          <h2 className="text-lg font-bold text-white">Unfinished Session Detected</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            We recovered an active experimental session previously interrupted. You made progress up to{' '}
            <strong className="text-slate-200">{lastSectionTitle || 'Module 1'}</strong> ({formatTime(elapsedSeconds)} elapsed).
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onRestart} className="flex-1 text-xs border-slate-700 hover:bg-error/20 hover:text-error">
            Restart From Beginning
          </Button>
          <Button variant="default" onClick={onResume} className="flex-1 text-xs bg-primary hover:bg-primary-dark font-bold shadow-md">
            Resume Where I Left Off
          </Button>
        </div>
      </Card>
    </div>
  );
};
