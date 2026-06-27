'use client';

import React from 'react';
import { HealthStatusCard } from '@/components/admin/health/HealthStatusCard';
import type { ServiceHealthItem } from '@/hooks/usePlatformHealth';

export interface ServiceStatusGridProps {
  services: ServiceHealthItem[];
}

export const ServiceStatusGrid: React.FC<ServiceStatusGridProps> = ({ services }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Platform Subsystems Health Grid
        </h3>
        <span className="text-xs font-mono text-slate-400">{services.length} endpoints monitored</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <HealthStatusCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
