'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { AnalyticsOverviewData } from '@/hooks/useResearchAnalytics';

export interface AnalyticsOverviewProps {
  data: AnalyticsOverviewData | undefined;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      label: 'Enrolled Participants',
      value: data.totalParticipants,
      sub: `${data.activeSessions} currently active sessions`,
      icon: '👥',
      color: 'border-l-4 border-l-primary',
    },
    {
      label: 'Cohort Completion Rate',
      value: `${data.completionRatePct}%`,
      sub: `Avg reading time: ${data.avgReadingDurationMin}m`,
      icon: '🎯',
      color: 'border-l-4 border-l-emerald-500',
    },
    {
      label: 'AI Scaffolding Triggered',
      value: data.totalInterventionsTriggered,
      sub: `${data.interventionHelpfulnessPct}% helpful rating feedback`,
      icon: '🤖',
      color: 'border-l-4 border-l-purple-500',
    },
    {
      label: 'RQ1: Scaffolding Efficacy',
      value: `${data.rq1EffectivenessScore} / 5.0`,
      sub: 'Measured via post-reading comprehension boost',
      icon: '📈',
      color: 'border-l-4 border-l-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
      {stats.map((item, idx) => (
        <Card key={idx} className={`p-5 bg-slate-900/90 border-slate-800 shadow-lg space-y-2 ${item.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{item.label}</span>
            <span className="text-xl">{item.icon}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">{item.value}</div>
          <p className="text-[11px] text-slate-400 font-sans">{item.sub}</p>
        </Card>
      ))}
    </div>
  );
};
