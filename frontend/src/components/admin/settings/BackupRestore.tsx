'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const BackupRestore: React.FC = () => {
  const snapshots = [
    { id: 'snap_01', date: '2026-06-27 00:00 UTC', size: '240 MB', type: 'Daily Automated SQL Dump' },
    { id: 'snap_02', date: '2026-06-26 00:00 UTC', size: '235 MB', type: 'Daily Automated SQL Dump' },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Database Backup & Point-in-Time Restore
          </h3>
          <p className="text-xs text-slate-400">Automated Supabase SQL snapshots ensuring disaster recovery resilience</p>
        </div>
        <Button onClick={() => alert('Initiating manual database snapshot generation...')} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold">
          + Trigger Snapshot Now
        </Button>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-mono text-slate-300 block font-bold uppercase tracking-wider">Available Recovery Snapshots:</label>
        {snapshots.map((s) => (
          <div key={s.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <strong className="text-white block">{s.date}</strong>
              <span className="text-[11px] text-slate-400">{s.type} ({s.size})</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => alert(`Downloading snapshot ${s.id}`)} className="text-[11px] py-1 h-auto">
                ⬇ Download SQL
              </Button>
              <Button variant="outline" size="sm" onClick={() => confirm(`Are you sure you want to restore from ${s.date}?`)} className="text-[11px] py-1 h-auto text-amber-400 border-amber-500/40">
                🔄 Restore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
