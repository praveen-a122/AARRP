'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { DashboardChartCard } from '@/components/admin/DashboardChartCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import type { Experiment } from '@/types/api';

export default function AdminHomePage() {
  const { data: recentExperiments, isLoading } = useQuery<Experiment[], Error>({
    queryKey: ['admin', 'experiments', 'recent'],
    queryFn: () => apiClient.get<Experiment[]>('/api/cms/experiment'),
    retry: 1,
  });

  const columns: Column<Experiment>[] = [
    {
      header: 'Experiment Title',
      accessorKey: 'title',
      sortable: true,
      cell: (exp) => (
        <div className="font-semibold text-white truncate max-w-xs">{exp.title}</div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (exp) => {
        const status = exp.current_version?.status || 'draft';
        const variant = status === 'published' ? 'success' : status === 'archived' ? 'warning' : 'default';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      header: 'Version',
      accessorKey: 'version',
      cell: (exp) => (
        <span className="font-mono text-xs text-slate-400">
          v{exp.current_version?.version_number || 1}.0
        </span>
      ),
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
      sortable: true,
      cell: (exp) => (
        <span className="text-slate-400 text-xs">
          {new Date(exp.updated_at || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry and cohort intervention analytics.
          </p>
        </div>
      </div>

      {/* KPI Stats Suite */}
      <section>
        <DashboardStats />
      </section>

      {/* Analytics Charts Suite */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChartCard
          title="Cohort Comprehension Distribution"
          endpoint="/api/admin/analytics/comprehension"
          chartType="bar"
        />
        <DashboardChartCard
          title="Daily Intervention Trigger Frequency"
          endpoint="/api/admin/analytics/interventions"
          chartType="line"
        />
      </section>

      {/* Recent Experiments Configuration Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Active Research Experiments
          </h2>
        </div>
        <DataTable<Experiment>
          data={recentExperiments || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No active experiments found in database cluster."
        />
      </section>
    </div>
  );
}
