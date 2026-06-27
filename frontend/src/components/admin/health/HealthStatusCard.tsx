'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ServiceHealthItem, ServiceState } from '@/hooks/usePlatformHealth';

export interface HealthStatusCardProps {
  service: ServiceHealthItem;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ service }) => {
  const getStatusBadge = (status: ServiceState) => {
    switch (status) {
      case 'operational':
        return (
          <Badge variant="success" className="font-mono text-[10px]">
            ● OPERATIONAL
          </Badge>
        );
      case 'degraded':
        return (
          <Badge variant="warning" className="font-mono text-[10px]">
            ▲ DEGRADED
          </Badge>
        );
      default:
        return (
          <Badge variant="error" className="font-mono text-[10px]">
            ✖ UNAVAILABLE
          </Badge>
        );
    }
  };

  const getBorderColor = (status: ServiceState) => {
    switch (status) {
      case 'operational':
        return 'border-slate-800 hover:border-emerald-500/50';
      case 'degraded':
        return 'border-amber-500/50 bg-amber-500/5';
      default:
        return 'border-error/60 bg-error/5';
    }
  };

  return (
    <Card className={`p-5 bg-slate-900/90 transition-all duration-300 shadow-lg space-y-3 ${getBorderColor(service.status)} animate-fade-in`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            {service.category} subsystem
          </span>
          <h4 className="text-sm font-bold text-white font-mono mt-0.5">{service.name}</h4>
        </div>
        {getStatusBadge(service.status)}
      </div>

      {service.message && (
        <p className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/60 font-sans">
          ⚠️ {service.message}
        </p>
      )}

      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80 text-slate-400">
        <span className="flex items-center gap-1">
          Latency: <strong className={service.latencyMs > 300 ? 'text-amber-400' : 'text-slate-200'}>{service.latencyMs}ms</strong>
        </span>
        <span>Last checked: {service.lastChecked}</span>
      </div>

      {service.details && (
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-300">
          {Object.entries(service.details).map(([key, val]) => (
            <div key={key} className="truncate">
              <span className="text-slate-500">{key}: </span>
              <strong>{String(val)}</strong>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
