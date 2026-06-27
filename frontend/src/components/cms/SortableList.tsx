'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface SortableItem {
  id: string;
}

export interface SortableListProps<T extends SortableItem> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  disabled?: boolean;
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  disabled = false,
}: SortableListProps<T>) {
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onReorder(newItems);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="p-6 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
          No sequence items configured. Add elements to populate the list.
        </div>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl transition-all hover:border-slate-700"
          >
            {/* Keyboard & Click Reordering Controls */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled || index === 0}
                onClick={() => moveItem(index, 'up')}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                title="Move Up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled || index === items.length - 1}
                onClick={() => moveItem(index, 'down')}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                title="Move Down"
              >
                ↓
              </Button>
            </div>

            {/* Item Content Render */}
            <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
          </div>
        ))
      )}
    </div>
  );
}
