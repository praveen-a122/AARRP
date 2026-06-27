'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { FeatureFlagItem } from '@/hooks/useSystemSettings';

export interface FeatureFlagsProps {
  flags: FeatureFlagItem[];
  onToggle: (key: string, current: boolean) => Promise<unknown>;
}

export const FeatureFlags: React.FC<FeatureFlagsProps> = ({ flags, onToggle }) => {
  const columns: Column<FeatureFlagItem>[] = [
    {
      accessorKey: 'name',
      header: 'Feature Flag Name',
      sortable: true,
      cell: (row) => (
        <div>
          <strong className="text-white block text-xs">{row.name}</strong>
          <code className="text-[10px] text-primary-light font-mono">{row.key}</code>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      sortable: true,
      cell: (row) => <Badge variant="secondary" className="font-mono text-[10px] uppercase">{row.category}</Badge>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (row) => <span className="text-xs text-slate-400 block max-w-sm truncate">{row.description}</span>,
    },
    {
      accessorKey: 'enabled',
      header: 'Status & Toggle',
      cell: (row) => (
        <button
          type="button"
          onClick={() => onToggle(row.key, row.enabled)}
          className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold transition-all border ${
            row.enabled
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
        >
          {row.enabled ? '● ENABLED' : '○ DISABLED'}
        </button>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Platform Feature Flags & Toggles
          </h3>
          <p className="text-xs text-slate-400">Safely enable experimental AI streaming or strict telemetry rules without deploying</p>
        </div>
        <span className="text-xs font-mono text-slate-400">Flags: {flags.length}</span>
      </div>

      <DataTable data={flags} columns={columns} />
    </Card>
  );
};
