'use client';

import React from 'react';
import { Column } from '@/components/ui/DataTable';
import { VersionBadge } from '@/components/cms/VersionBadge';
import { Button } from '@/components/ui/Button';
import type { Experiment } from '@/types/api';

export interface ExperimentColumnActions {
  onConfigure: (exp: Experiment) => void;
  onDuplicate?: (exp: Experiment) => void;
  onDelete?: (exp: Experiment) => void;
}

export const getExperimentColumns = (actions?: ExperimentColumnActions): Column<Experiment>[] => [
  {
    header: 'Experiment Title',
    accessorKey: 'title',
    sortable: true,
    cell: (exp) => (
      <div>
        <div className="font-bold text-white truncate max-w-xs">{exp.title}</div>
        {exp.description && (
          <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{exp.description}</div>
        )}
      </div>
    ),
  },
  {
    header: 'Active Version & Status',
    accessorKey: 'status',
    cell: (exp) => <VersionBadge version={exp.current_version} />,
  },
  {
    header: 'Conditions',
    accessorKey: 'conditions',
    cell: (exp) => (
      <span className="font-mono text-xs text-slate-300 font-semibold">
        {exp.current_version?.conditions?.length || 0}
      </span>
    ),
  },
  {
    header: 'Reading Sections',
    accessorKey: 'reading_sections',
    cell: (exp) => {
      const totalSections =
        exp.current_version?.conditions?.reduce(
          (acc, cond) => acc + (cond.reading_sections?.length || 0),
          0
        ) || 0;
      return <span className="font-mono text-xs text-slate-300 font-semibold">{totalSections}</span>;
    },
  },
  {
    header: 'Last Updated',
    accessorKey: 'updated_at',
    sortable: true,
    cell: (exp) => (
      <span className="text-xs text-slate-400 font-mono">
        {new Date(exp.updated_at || Date.now()).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: 'Actions',
    accessorKey: 'id',
    cell: (exp) => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            actions?.onConfigure(exp);
          }}
        >
          Configure
        </Button>
        {actions?.onDuplicate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              actions.onDuplicate!(exp);
            }}
            title="Duplicate"
          >
            Copy
          </Button>
        )}
        {actions?.onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-error hover:text-error-light hover:bg-error/10"
            onClick={(e) => {
              e.stopPropagation();
              actions.onDelete!(exp);
            }}
            title="Delete"
          >
            Del
          </Button>
        )}
      </div>
    ),
  },
];
