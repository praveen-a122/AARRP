'use client';

import React from 'react';
import type { AnalyticsFilterState } from '@/hooks/useResearchAnalytics';

export interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onChange: (newFilters: AnalyticsFilterState) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ filters, onChange }) => {
  const handleRangeChange = (range: '7d' | '30d' | '90d' | 'all') => {
    onChange({ ...filters, dateRange: range });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl animate-fade-in">
      {/* Experiment Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Experiment Cohort:</label>
        <select
          value={filters.experimentId}
          onChange={(e) => onChange({ ...filters, experimentId: e.target.value })}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary font-medium"
        >
          <option value="all">All Active Research Cohorts</option>
          <option value="exp_1">Neuro-Symbolic AI Cohort A</option>
          <option value="exp_2">Adaptive Scaffolding Beta</option>
        </select>
      </div>

      {/* Date Range Selector Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-1">Timeframe:</span>
        {(['7d', '30d', '90d', 'all'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRangeChange(r)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all font-bold ${
              filters.dateRange === r
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {r === 'all' ? 'ALL TIME' : r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Scaffolding Type Filter */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scaffolding:</label>
        <select
          value={filters.scaffoldingType}
          onChange={(e) => onChange({ ...filters, scaffoldingType: e.target.value })}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary font-medium"
        >
          <option value="all">All Scaffolding Types</option>
          <option value="Contextual Hint">Contextual Hints</option>
          <option value="Vocabulary Expansion">Vocabulary Expansion</option>
          <option value="Causal Summary">Causal Summaries</option>
        </select>
      </div>
    </div>
  );
};
