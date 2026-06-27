'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { ParagraphToolbar } from '@/components/cms/editors/ParagraphToolbar';
import { ParagraphMetadataPanel } from '@/components/cms/editors/ParagraphMetadataPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { ExtendedParagraph } from '@/components/cms/editors/SlideBreakEditor';

export interface ParagraphEditorProps {
  paragraph: ExtendedParagraph;
  index: number;
  totalCount: number;
  slideNumber: number;
  onChange: (updated: ExtendedParagraph) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  onSave?: () => void;
}

export const ParagraphEditor: React.FC<ParagraphEditorProps> = ({
  paragraph,
  index,
  totalCount,
  slideNumber,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertAbove,
  onInsertBelow,
  onSave,
}) => {
  useKeyboardShortcuts({
    onSave,
    onDuplicate,
    onDelete,
  });

  const handleChange = (field: keyof ExtendedParagraph, value: unknown) => {
    onChange({ ...paragraph, [field]: value });
  };

  const isValid = !!paragraph.content.trim() && paragraph.word_count <= 500;

  return (
    <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 transition-all hover:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
            #{index + 1}
          </span>
          <h4 className="text-sm font-bold text-white">
            {paragraph.title || `Reading Paragraph ${index + 1}`}
          </h4>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!paragraph.is_slide_break}
            onChange={(e) => handleChange('is_slide_break', e.target.checked)}
            className="rounded bg-slate-950 border-slate-800 text-accent focus:ring-accent w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-300">End Slide Here</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Paragraph Heading / Title"
          value={paragraph.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Optional subsection heading..."
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Difficulty Rating</label>
          <select
            value={paragraph.difficulty || 'medium'}
            onChange={(e) => handleChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
            className="h-10 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="easy">Easy (Introductory)</option>
            <option value="medium">Medium (Standard Academic)</option>
            <option value="hard">Hard (Dense Technical)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Paragraph Content Body</label>
        <textarea
          value={paragraph.content || ''}
          onChange={(e) => {
            const val = e.target.value;
            const words = val.trim().split(/\s+/).filter(Boolean).length;
            onChange({ ...paragraph, content: val, word_count: words });
          }}
          placeholder="Enter rich text reading material for participant display..."
          rows={5}
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-sans"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400">Researcher Notes (Hidden from participants)</label>
        <input
          type="text"
          value={paragraph.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Internal notes regarding AI trigger thresholds or comprehension goals..."
          className="w-full rounded-xl bg-slate-900/60 border border-slate-800/80 px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <ParagraphMetadataPanel paragraph={paragraph} slideNumber={slideNumber} isValid={isValid} />

      <ParagraphToolbar
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onInsertAbove={onInsertAbove}
        onInsertBelow={onInsertBelow}
        canMoveUp={index > 0}
        canMoveDown={index < totalCount - 1}
      />
    </div>
  );
};
