'use client';

import React from 'react';
import { ParagraphRenderer } from '@/components/participant/ParagraphRenderer';
import type { Paragraph } from '@/types/api';

export interface SlideRendererProps {
  paragraphs: Paragraph[];
  currentSlideIndex: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  onRequestAIHelp?: (paragraph: Paragraph, queryText?: string) => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  paragraphs,
  currentSlideIndex,
  fontSize = 'md',
  onRequestAIHelp,
}) => {
  if (paragraphs.length === 0) {
    return (
      <div className="p-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
        No reading paragraphs configured inside this experimental module.
      </div>
    );
  }

  const safeIdx = Math.max(0, Math.min(currentSlideIndex, paragraphs.length - 1));
  const activeParagraph = paragraphs[safeIdx];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto py-6">
      <ParagraphRenderer
        key={activeParagraph.id || safeIdx}
        paragraph={activeParagraph}
        index={safeIdx}
        totalCount={paragraphs.length}
        fontSize={fontSize}
        onRequestAIHelp={onRequestAIHelp}
      />
    </div>
  );
};
