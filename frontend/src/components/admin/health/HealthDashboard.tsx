'use client';

import React from 'react';
import { usePlatformHealth } from '@/hooks/usePlatformHealth';
import { SystemMetrics } from '@/components/admin/health/SystemMetrics';
import { DatabaseStatus } from '@/components/admin/health/DatabaseStatus';
import { AIProviderStatus } from '@/components/admin/health/AIProviderStatus';
import { StorageStatus } from '@/components/admin/health/StorageStatus';
import { QueueStatus } from '@/components/admin/health/QueueStatus';
import { ServiceStatusGrid } from '@/components/admin/health/ServiceStatusGrid';
import { CorrelationTraceViewer } from '@/components/admin/health/CorrelationTraceViewer';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const HealthDashboard: React.FC = () => {
  const { services, metrics, traces, isLoading, globalStatus, pollingIntervalMs, setPollingIntervalMs, refetchAll } =
    usePlatformHealth();

  const getGlobalBadge = () => {
    switch (globalStatus) {
      case 'operational':
        return <Badge variant="success" className="font-mono text-xs px-3 py-1">● ALL SYSTEMS OPERATIONAL</Badge>;
      case 'degraded':
        return <Badge variant="warning" className="font-mono text-xs px-3 py-1">▲ PLATFORM DEGRADED</Badge>;
      default:
        return <Badge variant="error" className="font-mono text-xs px-3 py-1">✖ SUBSYSTEM OUTAGE</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Status & Polling Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          {getGlobalBadge()}
          <span className="text-xs font-mono text-slate-400">
            Last successful poll: <strong className="text-white">Just now</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Poll Interval:</label>
          <select
            value={pollingIntervalMs}
            onChange={(e) => setPollingIntervalMs(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
          >
            <option value={5000}>Every 5s</option>
            <option value={10000}>Every 10s</option>
            <option value={30000}>Every 30s</option>
            <option value={60000}>Every 60s</option>
          </select>

          <Button variant="outline" size="sm" onClick={() => refetchAll()} className="text-xs font-mono">
            🔄 Refresh Now
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 text-slate-400">
          <Spinner size="lg" />
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
            Probing Platform Microservices & AI Providers...
          </p>
        </div>
      ) : (
        <>
          {/* Host Resources */}
          <SystemMetrics metrics={metrics} />

          {/* Core Research Platform Specialized Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
              Primary Research Architecture Subsystems
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DatabaseStatus service={services.find((s) => s.category === 'database')} />
              <AIProviderStatus service={services.find((s) => s.category === 'ai')} />
              <StorageStatus service={services.find((s) => s.id === 'sub_exp')} />
              <QueueStatus service={services.find((s) => s.category === 'workers')} />
            </div>
          </div>

          {/* Full Grid */}
          <ServiceStatusGrid services={services} />

          {/* Distributed Traces */}
          <CorrelationTraceViewer traces={traces} />
        </>
      )}
    </div>
  );
};
