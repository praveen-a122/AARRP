'use client';

import React, { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available.',
  onRowClick,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSortChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    if (onSortChange) {
      onSortChange(key, newDir);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.accessorKey as string, col.sortable)}
                  className={`p-4 select-none ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.accessorKey && (
                      <span className="text-primary font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-slate-400">
                  <Spinner size="md" label="Loading data..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id ? String(row.id) : rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-800/40' : 'hover:bg-slate-800/20'}`}
                >
                  {columns.map((col, colIdx) => {
                    const value = (row as Record<string, unknown>)[col.accessorKey as string];
                    return (
                      <td key={colIdx} className="p-4 text-slate-200 whitespace-nowrap">
                        {col.cell ? col.cell(row) : (value !== undefined && value !== null ? String(value) : '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange && onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange && onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
