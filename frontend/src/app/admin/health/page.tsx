'use client';

import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { HealthDashboard } from '@/components/admin/health/HealthDashboard';

export default function PlatformHealthPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Platform Health & Observability
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live observability across FastAPI core, Supabase database, Groq AI scaffolding engine, and async queues
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-slate-300">Background Polling Active</span>
          </div>
        </div>

        <HealthDashboard />
      </div>
    </DashboardLayout>
  );
}
