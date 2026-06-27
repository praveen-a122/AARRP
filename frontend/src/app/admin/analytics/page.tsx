'use client';

import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { useResearchAnalytics } from '@/hooks/useResearchAnalytics';
import { AnalyticsFilters } from '@/components/admin/analytics/AnalyticsFilters';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import { InterventionChart } from '@/components/admin/analytics/InterventionChart';
import { CompletionChart } from '@/components/admin/analytics/CompletionChart';
import { ParticipantTable } from '@/components/admin/analytics/ParticipantTable';
import { Spinner } from '@/components/ui/Spinner';

export default function AnalyticsDashboardPage() {
  const { filters, setFilters, overview, interventions, completionTrends, participants, isLoading } =
    useResearchAnalytics();

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-fade-in">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Research Analytics & Telemetry Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Reproducible evaluation of RQ1 (Scaffolding Efficacy) and RQ2 (Reading Flow Continuity)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Telemetry Pipeline: Active</span>
          </div>
        </div>

        {/* Global Multi-Axis Filters */}
        <AnalyticsFilters filters={filters} onChange={setFilters} />

        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 text-slate-400">
            <Spinner size="lg" />
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
              Aggregating Telemetry Cohorts...
            </p>
          </div>
        ) : (
          <>
            {/* Core Research Overview Metrics */}
            <AnalyticsOverview data={overview} />

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InterventionChart items={interventions} />
              <CompletionChart trends={completionTrends} />
            </div>

            {/* Granular Participant Table */}
            <ParticipantTable participants={participants} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
