'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ServiceHealthItem } from '@/hooks/usePlatformHealth';

export interface QueueStatusProps {
  service: ServiceHealthItem | undefined;
}

export const QueueStatus: React.FC<QueueStatusProps> = ({ service }) => {
  const status = service?.status || 'degraded';
  const pending = service?.details?.pendingJobs || 14;

  return (
    <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚙️</span>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">Background Worker Queue</h4>
            <span className="text-[11px] text-slate-400 font-mono">Async Batch Processing</span>
          </div>
        </div>
        <Badge variant={status === 'operational' ? 'success' : 'warning'} className="font-mono text-[10px]">
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Pending Jobs</span>
          <strong className={`text-sm ${Number(pending) > 10 ? 'text-amber-400' : 'text-white'}`}>{pending}</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Workers</span>
          <strong className="text-sm text-primary-light">2 active</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Avg Wait</span>
          <strong className="text-sm text-slate-300">1.4s</strong>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center">
        <span className="truncate max-w-[150px]">Task: ZIP Synthesis</span>
        <span className="text-amber-400">⚡ High Load</span>
      </div>
    </Card>
  );
};
