'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  status: string;
  author: string;
  sortOrder: string;
}

export interface ExperimentFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset?: () => void;
}

export const ExperimentFilters: React.FC<ExperimentFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Status:</span>
        <select
          value={filters.status}
          onChange={(e) => handleSelectChange('status', e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort:</span>
        <select
          value={filters.sortOrder}
          onChange={(e) => handleSelectChange('sortOrder', e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="updated_desc">Recently Modified</option>
          <option value="created_desc">Newly Created</option>
          <option value="title_asc">Title (A-Z)</option>
        </select>
      </div>

      {(filters.status !== 'all' || filters.sortOrder !== 'updated_desc') && onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 px-2 text-xs text-slate-400 hover:text-white">
          Reset Filters
        </Button>
      )}
    </div>
  );
};
