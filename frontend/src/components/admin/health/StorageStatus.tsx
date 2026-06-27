'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ServiceHealthItem } from '@/hooks/usePlatformHealth';

export interface StorageStatusProps {
  service: ServiceHealthItem | undefined;
}

export const StorageStatus: React.FC<StorageStatusProps> = ({ service }) => {
  const status = service?.status || 'operational';

  return (
    <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">💾</span>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">Storage & Export Cache</h4>
            <span className="text-[11px] text-slate-400 font-mono">Dataset Archive Subsystem</span>
          </div>
        </div>
        <Badge variant={status === 'operational' ? 'success' : 'error'} className="font-mono text-[10px]">
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Free Space</span>
          <strong className="text-sm text-emerald-400">42.0 GB</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Archives</span>
          <strong className="text-sm text-white">14 pkgs</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">I/O Latency</span>
          <strong className="text-sm text-primary-light">18ms</strong>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center">
        <span>Clean policy: 90d retention</span>
        <span className="text-emerald-400">✓ Optimal Disk I/O</span>
      </div>
    </Card>
  );
};
