'use client';

import React, { useState } from 'react';
import type { Paragraph } from '@/types/api';

export interface ParagraphRendererProps {
  paragraph: Paragraph;
  index: number;
  totalCount: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  onRequestAIHelp?: (paragraph: Paragraph, queryText?: string) => void;
}

export const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({
  paragraph,
  index,
  totalCount,
  fontSize = 'md',
  onRequestAIHelp,
}) => {
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setHighlightedText(selection.toString().trim());
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseUp={handleMouseUp}
      className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 border ${
        isHovered
          ? 'bg-slate-900/90 border-slate-700 shadow-xl'
          : 'bg-slate-900/60 border-slate-800/80 shadow-md'
      }`}
    >
      {/* Top Metadata Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/60 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">Paragraph #{index + 1}</span>
          <span>of {totalCount}</span>
        </div>
        <span>{paragraph.word_count || paragraph.content?.split(/\s+/).length || 0} words</span>
      </div>

      {/* Main Paragraph Content */}
      <div className={`font-sans text-slate-100 ${fontClasses[fontSize]} select-text`}>
        {paragraph.content || <span className="italic text-slate-600">[Paragraph content empty]</span>}
      </div>

      {/* AI Intervention Anchor Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
        {highlightedText ? (
          <div className="flex items-center gap-2 bg-primary/15 border border-primary/30 px-3 py-1.5 rounded-xl text-xs max-w-full">
            <span className="text-primary-light font-bold truncate max-w-xs">&quot;{highlightedText}&quot;</span>
            <button
              type="button"
              onClick={() => onRequestAIHelp && onRequestAIHelp(paragraph, highlightedText)}
              className="px-2.5 py-1 rounded bg-primary text-white font-bold hover:bg-primary/90 flex-shrink-0"
            >
              💡 Ask AI Hint on Selection
            </button>
            <button
              type="button"
              onClick={() => setHighlightedText('')}
              className="text-slate-400 hover:text-white px-1"
            >
              ✕
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 italic">
            Highlight text or click right button to invoke adaptive AI scaffolding.
          </span>
        )}

        <button
          type="button"
          onClick={() => onRequestAIHelp && onRequestAIHelp(paragraph)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-primary/20 text-slate-300 hover:text-primary-light border border-slate-800 hover:border-primary/40 transition-all text-xs font-semibold flex items-center gap-2"
        >
          <span>🤖 Request Scaffolding Help</span>
        </button>
      </div>
    </div>
  );
};
