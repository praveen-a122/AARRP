'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface PublicationTimelineProps {
  createdAt?: string;
  updatedAt?: string;
  lastSavedAt?: string | null;
  publishedAt?: string;
  archivedAt?: string;
  versionNumber?: number;
}

export const PublicationTimeline: React.FC<PublicationTimelineProps> = ({
  createdAt,
  updatedAt,
  lastSavedAt,
  publishedAt,
  archivedAt,
  versionNumber = 1,
}) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not yet recorded';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const events = [
    { label: 'Initialization Created', time: formatDate(createdAt || new Date().toISOString()), status: 'completed' },
    { label: 'Last Autosave Sync', time: formatDate(lastSavedAt || updatedAt), status: lastSavedAt ? 'active' : 'completed' },
    { label: `v${versionNumber}.0 Publication`, time: formatDate(publishedAt), status: publishedAt ? 'completed' : 'pending' },
    { label: 'Archival Lifecycle', time: formatDate(archivedAt), status: archivedAt ? 'completed' : 'pending' },
  ];

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Study Lifecycle & Version Chronology
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
          {events.map((evt, idx) => (
            <div key={idx} className="relative group">
              <span
                className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  evt.status === 'completed'
                    ? 'bg-emerald-500 border-slate-950'
                    : evt.status === 'active'
                    ? 'bg-primary border-slate-950 animate-pulse'
                    : 'bg-slate-800 border-slate-900'
                }`}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className={`font-semibold ${evt.status !== 'pending' ? 'text-slate-200' : 'text-slate-500'}`}>
                  {evt.label}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{evt.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
