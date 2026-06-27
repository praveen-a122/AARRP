'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { ExportHistoryItem } from '@/hooks/useExportModule';

export interface ExportHistoryProps {
  history: ExportHistoryItem[];
  onSelectManifest: (item: ExportHistoryItem) => void;
  onSelectChecksum: (item: ExportHistoryItem) => void;
}

export const ExportHistory: React.FC<ExportHistoryProps> = ({ history, onSelectManifest, onSelectChecksum }) => {
  const columns: Column<ExportHistoryItem>[] = [
    {
      accessorKey: 'filename',
      header: 'Archive Filename',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">📦</span>
          <span className="font-mono font-bold text-slate-200 text-xs truncate max-w-[200px] sm:max-w-xs">{row.filename}</span>
        </div>
      ),
    },
    {
      accessorKey: 'row_count',
      header: 'Telemetry Records',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-300 text-xs">{row.row_count.toLocaleString()} rows</span>,
    },
    {
      accessorKey: 'size_mb',
      header: 'File Size',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.size_mb} MB</span>,
    },
    {
      accessorKey: 'created_at',
      header: 'Generated At',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-400 text-[11px]">{row.created_at}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => {
        switch (row.status) {
          case 'completed':
            return <Badge variant="success">Ready</Badge>;
          case 'generating':
            return <Badge variant="warning">Synthesizing...</Badge>;
          default:
            return <Badge variant="error">Failed</Badge>;
        }
      },
    },
    {
      accessorKey: 'actions',
      header: 'Verification & Download',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectManifest(row)} className="text-[11px] px-2.5 py-1 h-auto">
            📄 Manifest
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelectChecksum(row)} className="text-[11px] px-2.5 py-1 h-auto text-primary border-primary/30">
            🔒 Checksum
          </Button>
          <a
            href={row.download_url}
            onClick={(e) => {
              e.preventDefault();
              alert(`Initiating download of archive: ${row.filename}`);
            }}
            className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all"
          >
            ⬇ Download
          </a>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Generated Research Archives
          </h3>
          <p className="text-xs text-slate-400">Historical dataset packages available for statistical evaluation</p>
        </div>
        <span className="text-xs font-mono text-slate-400">Archives: {history.length}</span>
      </div>

      <DataTable data={history} columns={columns} />
    </Card>
  );
};
