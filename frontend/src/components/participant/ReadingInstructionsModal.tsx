'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ReadingInstructionsModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const ReadingInstructionsModal: React.FC<ReadingInstructionsModalProps> = ({ isOpen, onStart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <Card className="max-w-2xl w-full p-6 sm:p-8 bg-slate-900 border-primary/40 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top ambient accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[11px] font-bold uppercase tracking-wider">
              <span>Dynamic Session Instructions</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Smart Reading Tracker Study
            </h2>
            <p className="text-xs text-slate-400">
              Please review how this adaptive session operates before beginning.
            </p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Instruction rules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <span className="text-lg">🖱️</span>
              <span>1. Track with Mouse Cursor</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use your mouse cursor as a visual pointer to trace words across the screen as you read. Our telemetry adapter monitors your flow, rereads, and backtracks in real-time.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <span className="text-lg">📊</span>
              <span>2. Rate Difficulty (1 to 5)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              After reading each paragraph, rate how difficult it was to understand using the 1 to 5 scale (<strong className="text-white">1 = Very easy</strong> to <strong className="text-white">5 = Very difficult</strong>).
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="text-lg">❓</span>
              <span>3. Answer Quick MCQs</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Each paragraph has a brief multiple-choice comprehension check. You must answer all questions before submitting your session data.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="text-lg">🤖</span>
              <span>4. Adaptive AI Pop-ups</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If struggle or slowdown is detected, our AI engine dynamically pops up vocabulary help, summaries, rephrasing, or analogies. Please provide feedback (<strong className="text-white">This helped</strong> / <strong className="text-white">Not helpful</strong>).
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 italic">
            Scroll vertically to read at your normal pace.
          </span>
          <Button
            variant="default"
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 shadow-lg shadow-indigo-600/25"
          >
            Start Reading Session →
          </Button>
        </div>
      </Card>
    </div>
  );
};
