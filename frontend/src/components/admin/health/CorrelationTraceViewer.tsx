'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { TraceLogItem } from '@/hooks/usePlatformHealth';

export interface CorrelationTraceViewerProps {
  traces: TraceLogItem[];
}

export const CorrelationTraceViewer: React.FC<CorrelationTraceViewerProps> = ({ traces }) => {
  const columns: Column<TraceLogItem>[] = [
    {
      accessorKey: 'correlationId',
      header: 'X-Correlation-ID',
      sortable: true,
      cell: (row) => (
        <code className="px-2 py-0.5 rounded bg-slate-950 border border-primary/30 text-primary-light font-mono text-xs select-all">
          {row.correlationId}
        </code>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.timestamp}</span>,
    },
    {
      accessorKey: 'service',
      header: 'Subsystem',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-200 text-xs">{row.service}</span>,
    },
    {
      accessorKey: 'endpoint',
      header: 'Target Route',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-300 text-xs">{row.endpoint}</span>,
    },
    {
      accessorKey: 'status',
      header: 'HTTP Code',
      sortable: true,
      cell: (row) => (
        <Badge variant={row.status >= 500 ? 'error' : 'warning'} className="font-mono text-[10px]">
          {row.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'errorSnippet',
      header: 'Error Diagnostic',
      cell: (row) => (
        <span className="text-xs font-mono text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-800/40 block truncate max-w-xs">
          {row.errorSnippet || 'No additional context'}
        </span>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Error Diagnostic Traces & Correlation IDs
          </h3>
          <p className="text-xs text-slate-400">
            Surface <code className="text-primary font-mono">X-Correlation-ID</code> logs from distributed telemetry failures
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">Captured: {traces.length} traces</span>
      </div>

      <DataTable data={traces} columns={columns} />
    </Card>
  );
};
