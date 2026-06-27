'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface FormToolbarProps {
  onSave?: () => void;
  onCancel?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
  canDelete?: boolean;
  canDuplicate?: boolean;
  saveLabel?: string;
}

export const FormToolbar: React.FC<FormToolbarProps> = ({
  onSave,
  onCancel,
  onDuplicate,
  onDelete,
  onPreview,
  isSaving = false,
  isDirty = true,
  canDelete = false,
  canDuplicate = false,
  saveLabel = 'Save Changes',
}) => {
  return (
    <div className="sticky bottom-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {onCancel && (
          <Button variant="outline" size="md" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        )}
        {onPreview && (
          <Button variant="secondary" size="md" onClick={onPreview} disabled={isSaving}>
            Preview
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {canDuplicate && onDuplicate && (
          <Button variant="outline" size="md" onClick={onDuplicate} disabled={isSaving}>
            Duplicate
          </Button>
        )}
        {canDelete && onDelete && (
          <Button variant="destructive" size="md" onClick={onDelete} disabled={isSaving}>
            Delete
          </Button>
        )}
        {onSave && (
          <Button
            variant="default"
            size="md"
            onClick={onSave}
            isLoading={isSaving}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? 'Saving...' : saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
