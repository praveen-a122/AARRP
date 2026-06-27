'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { SystemMetricsData } from '@/hooks/usePlatformHealth';

export interface SystemMetricsProps {
  metrics: SystemMetricsData | undefined;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
  if (!metrics) return null;

  const memPct = Math.round((metrics.memoryUsageMb / metrics.memoryTotalMb) * 100);

  const stats = [
    { label: 'CPU Load Avg', val: `${metrics.cpuUsagePct}%`, sub: `${metrics.activeThreads} active threads`, color: 'text-emerald-400' },
    { label: 'Memory Allocation', val: `${memPct}%`, sub: `${metrics.memoryUsageMb}MB / ${metrics.memoryTotalMb}MB`, color: 'text-primary-light' },
    { label: 'Telemetry Queue Depth', val: `${metrics.eventQueueDepth} batches`, sub: 'Buffered raw paragraph events', color: 'text-purple-400' },
    { label: 'System Error Rate (1h)', val: `${metrics.errorRateLastHourPct}%`, sub: `Uptime: ${metrics.uptimeHours} hrs`, color: metrics.errorRateLastHourPct > 1 ? 'text-error' : 'text-emerald-400' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
        Host Server Resources & Ingestion Throughput
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card key={idx} className="p-4 bg-slate-900/90 border-slate-800 shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{s.label}</span>
            <div className={`text-2xl font-bold font-mono my-2 ${s.color}`}>{s.val}</div>
            <span className="text-[11px] text-slate-400 font-sans">{s.sub}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};
