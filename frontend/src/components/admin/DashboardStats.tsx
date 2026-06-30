'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import type { DashboardSummary } from '@/types/api';

export const DashboardStats: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<DashboardSummary, Error>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => apiClient.get<DashboardSummary>('/api/analytics/dashboard'),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 flex items-center justify-center border-slate-800">
            <Spinner size="sm" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="warning" title="Metrics Sync Delayed">
        {error.message || 'Unable to fetch latest cohort analytics from the database cluster.'}
      </Alert>
    );
  }

  const stats = data || {
    total_participants: 0,
    completed_participants: 0,
    active_participants: 0,
    interrupted_sessions: 0,
    avg_experiment_duration: 0,
  };

  const cards = [
    {
      label: 'Total Participants',
      value: stats.total_participants,
      change: '+12% this month',
      color: 'text-primary-light',
    },
    {
      label: 'Active Reading Sessions',
      value: stats.active_participants,
      change: 'Real-time cohort',
      color: 'text-accent',
    },
    {
      label: 'Completed Experiments',
      value: stats.completed_participants,
      change: `${stats.total_participants ? Math.round((stats.completed_participants / stats.total_participants) * 100) : 0}% completion rate`,
      color: 'text-emerald-400',
    },
    {
      label: 'Interrupted / Flagged',
      value: stats.interrupted_sessions,
      change: 'AI Intervention Triggered',
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, idx) => (
        <Card key={idx} className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-extrabold tracking-tight ${item.color}`}>
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
