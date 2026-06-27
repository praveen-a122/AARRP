'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { AuditLogEntry } from '@/hooks/useSystemSettings';

export interface AuditLogViewerProps {
  logs: AuditLogEntry[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const columns: Column<AuditLogEntry>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.timestamp}</span>,
    },
    {
      accessorKey: 'actor',
      header: 'Actor',
      sortable: true,
      cell: (row) => <strong className="text-white text-xs">{row.actor}</strong>,
    },
    {
      accessorKey: 'action',
      header: 'Event Action',
      sortable: true,
      cell: (row) => (
        <Badge variant="secondary" className="font-mono text-[10px] tracking-wider">
          {row.action}
        </Badge>
      ),
    },
    {
      accessorKey: 'target',
      header: 'Target Entity',
      sortable: true,
      cell: (row) => <code className="text-primary-light font-mono text-xs truncate block max-w-xs">{row.target}</code>,
    },
    {
      accessorKey: 'ipAddress',
      header: 'Source IP',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-500 text-xs">{row.ipAddress}</span>,
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Platform Audit Security Logs
          </h3>
          <p className="text-xs text-slate-400">Chronological trail of sensitive data modifications and dataset exports</p>
        </div>
        <span className="text-xs font-mono text-slate-400">Records: {logs.length}</span>
      </div>

      <DataTable data={logs} columns={columns} />
    </Card>
  );
};
