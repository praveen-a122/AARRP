'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface ExperimentSummaryProps {
  title: string;
  description?: string;
  versionNumber?: number;
  conditionsCount: number;
  sectionsCount: number;
  paragraphsCount: number;
  questionsCount: number;
  promptsCount: number;
  estimatedDurationMinutes?: number;
  estimatedTokens?: number;
}

export const ExperimentSummary: React.FC<ExperimentSummaryProps> = ({
  title,
  description,
  versionNumber = 1,
  conditionsCount,
  sectionsCount,
  paragraphsCount,
  questionsCount,
  promptsCount,
  estimatedDurationMinutes = 15,
  estimatedTokens = 1250,
}) => {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">Configured Payload Summary</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">High-level architectural parameters for this release.</p>
        </div>
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
          Target: v{versionNumber}.0
        </span>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-slate-500 font-mono text-[10px] uppercase">Study Identification Title</span>
          <h3 className="text-base font-bold text-white tracking-tight">{title || 'Untitled Experiment'}</h3>
          {description && <p className="text-slate-400 text-xs line-clamp-2 mt-1">{description}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Conditions</span>
            <span className="text-white font-bold text-base">{conditionsCount} Cohorts</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Reading Sections</span>
            <span className="text-primary-light font-bold text-base">{sectionsCount} Modules</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Paragraphs</span>
            <span className="text-slate-200 font-bold text-base">{paragraphsCount} Blocks</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Quiz Items</span>
            <span className="text-emerald-400 font-bold text-base">{questionsCount} Questions</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">AI Prompt Rules</span>
            <span className="text-accent font-bold text-base">{promptsCount} Rules</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono pt-1">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Est. Participant Duration</span>
            <span className="text-emerald-400 font-bold text-sm">~{estimatedDurationMinutes} Minutes</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Est. Token Budget / User</span>
            <span className="text-accent font-bold text-sm">~{estimatedTokens} Tokens</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
