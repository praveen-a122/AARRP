'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VersionBadge } from '@/components/cms/VersionBadge';
import type { Experiment } from '@/types/api';

export interface ExperimentCardProps {
  experiment: Experiment;
  onEdit?: (experiment: Experiment) => void;
  onDuplicate?: (experiment: Experiment) => void;
  onArchive?: (experiment: Experiment) => void;
  onDelete?: (experiment: Experiment) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  const conditionsCount = experiment.current_version?.conditions?.length || 0;
  const updatedDate = new Date(experiment.updated_at || Date.now()).toLocaleDateString();

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base font-bold text-white truncate">
              {experiment.title}
            </CardTitle>
            <CardDescription className="text-xs line-clamp-2">
              {experiment.description || 'No experimental description provided.'}
            </CardDescription>
          </div>
          <VersionBadge version={experiment.current_version} />
        </CardHeader>

        <CardContent className="py-4 grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
          <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
            <span className="text-slate-500 block">Conditions</span>
            <strong className="text-slate-200 text-sm">{conditionsCount}</strong>
          </div>
          <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
            <span className="text-slate-500 block">Modified</span>
            <strong className="text-slate-200 text-sm">{updatedDate}</strong>
          </div>
        </CardContent>
      </div>

      <CardFooter className="bg-slate-950/40 border-t border-slate-800/60 pt-3 pb-3 flex items-center justify-between gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onEdit && onEdit(experiment)}
          className="flex-1"
        >
          Configure
        </Button>
        {onDuplicate && (
          <Button variant="outline" size="sm" onClick={() => onDuplicate(experiment)} title="Duplicate">
            Copy
          </Button>
        )}
        {onArchive && (
          <Button variant="outline" size="sm" onClick={() => onArchive(experiment)} title="Archive">
            Archive
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(experiment)} title="Delete">
            Del
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
