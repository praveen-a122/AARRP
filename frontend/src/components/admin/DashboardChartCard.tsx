'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardChartCardProps {
  title: string;
  endpoint: string;
  chartType?: 'bar' | 'line' | 'pie';
}

export const DashboardChartCard: React.FC<DashboardChartCardProps> = ({
  title,
  endpoint,
  chartType = 'bar',
}) => {
  const { data, isLoading, isError } = useQuery<ChartDataPoint[], Error>({
    queryKey: ['admin', 'chart', endpoint],
    queryFn: () => apiClient.get<ChartDataPoint[]>(endpoint),
    retry: 1,
  });

  const chartItems = Array.isArray(data) ? data : [];
  const maxValue = chartItems.reduce((max, item) => Math.max(max, item.value || 0), 10);

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg flex flex-col h-80">
      <CardHeader className="pb-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-200">{title}</CardTitle>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {chartType}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="md" label="Loading telemetry data..." />
          </div>
        ) : isError || chartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs gap-2">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>No telemetry series recorded for this time range.</span>
          </div>
        ) : (
          <div className="h-full flex items-end gap-3 pt-4">
            {chartItems.map((item, idx) => {
              const heightPct = Math.max(10, Math.min(100, Math.round((item.value / maxValue) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {item.value}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-primary/80 to-accent rounded-t transition-all duration-500 group-hover:brightness-125"
                  />
                  <span className="text-[10px] text-slate-500 truncate max-w-full font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
