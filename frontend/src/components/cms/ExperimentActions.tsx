'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export interface ExperimentActionsProps {
  onNew?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  selectedCount?: number;
  isLoading?: boolean;
}

export const ExperimentActions: React.FC<ExperimentActionsProps> = ({
  onNew,
  onDuplicate,
  onArchive,
  onDelete,
  onPreview,
  onPublish,
  selectedCount = 0,
  isLoading = false,
}) => {
  const router = useRouter();

  const handleNew = () => {
    if (onNew) {
      onNew();
    } else {
      router.push('/admin/cms/experiments/new');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-2">
        <Button variant="default" size="md" onClick={handleNew} isLoading={isLoading}>
          + New Experiment
        </Button>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 animate-fade-in">
          <span className="text-xs font-mono text-slate-400 mr-2">
            <strong className="text-white">{selectedCount}</strong> selected
          </span>
          {onPreview && (
            <Button variant="secondary" size="sm" onClick={onPreview} disabled={isLoading}>
              Preview
            </Button>
          )}
          {onDuplicate && (
            <Button variant="outline" size="sm" onClick={onDuplicate} disabled={isLoading}>
              Duplicate
            </Button>
          )}
          {onPublish && (
            <Button variant="outline" size="sm" onClick={onPublish} disabled={isLoading}>
              Publish
            </Button>
          )}
          {onArchive && (
            <Button variant="outline" size="sm" onClick={onArchive} disabled={isLoading}>
              Archive
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete} disabled={isLoading}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
