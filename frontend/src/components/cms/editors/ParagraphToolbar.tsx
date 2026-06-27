'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface ParagraphToolbarProps {
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  disabled?: boolean;
}

export const ParagraphToolbar: React.FC<ParagraphToolbarProps> = ({
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertAbove,
  onInsertBelow,
  canMoveUp = true,
  canMoveDown = true,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onInsertAbove}
          disabled={disabled}
          className="text-xs h-7 px-2.5"
          title="Insert a new blank paragraph before this one"
        >
          + Insert Above
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onInsertBelow}
          disabled={disabled}
          className="text-xs h-7 px-2.5"
          title="Insert a new blank paragraph after this one"
        >
          + Insert Below
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveUp}
          disabled={disabled || !canMoveUp}
          className="h-7 px-2 text-slate-400 hover:text-white"
          title="Move Paragraph Up"
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveDown}
          disabled={disabled || !canMoveDown}
          className="h-7 px-2 text-slate-400 hover:text-white"
          title="Move Paragraph Down"
        >
          ↓
        </Button>
        <div className="w-px h-4 bg-slate-800 mx-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicate}
          disabled={disabled}
          className="text-xs h-7 px-2.5"
          title="Duplicate Paragraph (Ctrl+D)"
        >
          Duplicate
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={disabled}
          className="text-xs h-7 px-2.5"
          title="Delete Paragraph (Ctrl+Del)"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
