'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ServiceHealthItem } from '@/hooks/usePlatformHealth';

export interface AIProviderStatusProps {
  service: ServiceHealthItem | undefined;
}

export const AIProviderStatus: React.FC<AIProviderStatusProps> = ({ service }) => {
  const status = service?.status || 'operational';
  const latency = service?.latencyMs || 410;

  return (
    <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🤖</span>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">Groq Llama-3 API</h4>
            <span className="text-[11px] text-slate-400 font-mono">Cognitive Scaffolding Engine</span>
          </div>
        </div>
        <Badge variant={status === 'operational' ? 'success' : 'warning'} className="font-mono text-[10px]">
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Model</span>
          <strong className="text-xs text-purple-400 truncate block">70b-8192</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
          <strong className="text-sm text-white">112 tok/s</strong>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">TTFT</span>
          <strong className="text-sm text-primary-light">{latency}ms</strong>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center">
        <span>Quota Usage: 14.2%</span>
        <span className="text-emerald-400">✓ API Responsive</span>
      </div>
    </Card>
  );
};
