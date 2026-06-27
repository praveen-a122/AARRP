'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface ExtendedQuestion {
  id: string;
  quiz_id: string;
  prompt: string;
  options: string[];
  correct_option_index: number;
  correct_option_indices?: number[];
  explanation?: string;
  order: number;
  title?: string;
  type?: 'mcq' | 'multi_select' | 'boolean' | 'likert' | 'short_answer' | 'long_answer';
  points?: number;
  required?: boolean;
  randomizeOptions?: boolean;
  feedback?: string;
}

export interface QuizStatisticsPanelProps {
  questions: ExtendedQuestion[];
  isValid: boolean;
}

export const QuizStatisticsPanel: React.FC<QuizStatisticsPanelProps> = ({ questions, isValid }) => {
  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 10), 0);
  const estTimeSeconds = Math.max(30, totalQuestions * 45); // ~45s per item

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Assessment Telemetry & Diagnostics
        </CardTitle>
        <Badge variant={isValid ? 'success' : 'warning'}>
          {isValid ? 'Ready for Runtime' : 'Action Required'}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Total Items</span>
          <span className="text-white font-bold text-sm">{totalQuestions} questions</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Total Score Weight</span>
          <span className="text-primary-light font-bold text-sm">{totalPoints} pts</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Est. Completion Time</span>
          <span className="text-emerald-400 font-bold text-sm">
            {Math.round(estTimeSeconds / 60)}m {estTimeSeconds % 60}s
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Validation Status</span>
          <span className={isValid ? 'text-success font-bold text-sm' : 'text-amber-400 font-bold text-sm'}>
            {isValid ? 'Pass' : 'Review Errors'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
