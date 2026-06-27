import React, { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiment CMS | AARRP Administration',
  description: 'Orchestrate adaptive reading conditions, AI prompt templates, and assessment quizzes.',
};

export default function CMSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Content Management System
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure experimental reading cohorts, real-time LLM prompt interventions, and quiz evaluations.
        </p>
      </div>
      {children}
    </div>
  );
}
