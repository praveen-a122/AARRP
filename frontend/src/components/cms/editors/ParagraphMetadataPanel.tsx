'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ExtendedParagraph } from '@/components/cms/editors/SlideBreakEditor';

export interface ParagraphMetadataPanelProps {
  paragraph: ExtendedParagraph;
  slideNumber: number;
  isValid: boolean;
}

export const ParagraphMetadataPanel: React.FC<ParagraphMetadataPanelProps> = ({
  paragraph,
  slideNumber,
  isValid,
}) => {
  const charCount = paragraph.content ? paragraph.content.length : 0;
  const wordCount = paragraph.content
    ? paragraph.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const estTimeSeconds = Math.max(5, Math.round((wordCount / 200) * 60));

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Telemetry & Diagnostics
        </CardTitle>
        <Badge variant={isValid ? 'success' : 'warning'}>
          {isValid ? 'Valid Spec' : 'Requires Attention'}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Paragraph ID</span>
          <span className="text-slate-200 font-bold truncate block" title={paragraph.id}>
            {paragraph.id}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Word Count</span>
          <span className="text-primary-light font-bold text-sm">{wordCount} words</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Char Count</span>
          <span className="text-slate-200 font-bold text-sm">{charCount} chars</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Est. Reading Time</span>
          <span className="text-emerald-400 font-bold text-sm">{estTimeSeconds}s</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Assigned Slide</span>
          <span className="text-accent font-bold text-sm">Slide #{slideNumber}</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Difficulty Rating</span>
          <span className="text-amber-400 font-bold text-sm uppercase">
            {paragraph.difficulty || 'Medium'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
