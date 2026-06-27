'use client';

import React from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { getExperimentColumns, ExperimentColumnActions } from '@/app/admin/cms/columns';
import type { Experiment } from '@/types/api';

export interface ExperimentTableProps {
  experiments: Experiment[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  actions: ExperimentColumnActions;
}

export const ExperimentTable: React.FC<ExperimentTableProps> = ({
  experiments,
  isLoading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSortChange,
  actions,
}) => {
  const columns = getExperimentColumns(actions);

  return (
    <DataTable<Experiment>
      data={experiments}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No research experiments configured matching filter criteria."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
    />
  );
};
