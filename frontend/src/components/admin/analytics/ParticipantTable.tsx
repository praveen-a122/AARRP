'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { apiClient } from '@/lib/apiClient';
import type { ParticipantTelemetrySummary } from '@/hooks/useResearchAnalytics';

export interface ParticipantTableProps {
  participants: ParticipantTelemetrySummary[];
}

export const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants }) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const handleDownloadExport = async (participantId: string) => {
    try {
      const data = await apiClient.get<Record<string, unknown>>(`/api/participant/export/${participantId}`);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Supabase_Export_${participantId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert(`Could not retrieve Supabase export JSON for ${participantId}: ${err}`);
    }
  };

  const columns: Column<ParticipantTelemetrySummary>[] = [
    {
      accessorKey: 'participantId',
      header: 'Participant Code',
      sortable: true,
      cell: (row) => <code className="font-mono text-primary font-bold">{row.participantId}</code>,
    },
    {
      accessorKey: 'experimentTitle',
      header: 'Cohort / Module',
      sortable: true,
      cell: (row) => <span className="text-slate-200 font-medium">{row.experimentTitle}</span>,
    },
    {
      accessorKey: 'progressPct',
      header: 'Reading Progress',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-primary" style={{ width: `${row.progressPct}%` }} />
          </div>
          <span className="font-mono text-xs">{row.progressPct}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'timeSpentSec',
      header: 'Duration',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-300">{formatTime(row.timeSpentSec)}</span>,
    },
    {
      accessorKey: 'interventionsCount',
      header: 'AI Scaffolding',
      sortable: true,
      cell: (row) => (
        <Badge variant="secondary" className="font-mono">
          🤖 {row.interventionsCount} hints
        </Badge>
      ),
    },
    {
      accessorKey: 'quizScorePct',
      header: 'Assessment Score',
      sortable: true,
      cell: (row) =>
        row.quizScorePct !== undefined ? (
          <span className={`font-mono font-bold ${row.quizScorePct >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {row.quizScorePct}%
          </span>
        ) : (
          <span className="text-slate-600 font-mono">—</span>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => {
        switch (row.status) {
          case 'completed':
            return <Badge variant="success">Completed</Badge>;
          case 'active':
            return <Badge variant="warning">In Progress</Badge>;
          default:
            return <Badge variant="error">Dropped Out</Badge>;
        }
      },
    },
    {
      accessorKey: 'participantId' as unknown as keyof ParticipantTelemetrySummary,
      header: 'Export Data',
      sortable: false,
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadExport(row.participantId)}
          className="text-[11px] py-1 px-2.5 h-auto bg-slate-800/80 hover:bg-indigo-600 hover:text-white border-slate-700 font-mono transition-all"
        >
          📥 Download JSON
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Participant Telemetry Logs
          </h3>
          <p className="text-xs text-slate-400">Granular session metrics recorded from active reading runtimes</p>
        </div>
        <span className="text-xs font-mono text-slate-400">Total Records: {participants.length}</span>
      </div>

      <DataTable data={participants} columns={columns} />
    </Card>
  );
};
