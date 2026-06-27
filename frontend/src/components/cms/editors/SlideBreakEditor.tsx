'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface ExtendedParagraph {
  id: string;
  section_id: string;
  content: string;
  order: number;
  word_count: number;
  title?: string;
  notes?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimated_time?: number;
  is_slide_break?: boolean;
}

export interface SlideBreakEditorProps {
  paragraphs: ExtendedParagraph[];
  onToggleBreak: (paragraphId: string) => void;
}

export const SlideBreakEditor: React.FC<SlideBreakEditorProps> = ({
  paragraphs,
  onToggleBreak,
}) => {
  // Validate slide breaks
  const sorted = [...paragraphs].sort((a, b) => a.order - b.order);
  const totalBreaks = sorted.filter((p) => p.is_slide_break).length;

  // Check for empty slides (e.g. first paragraph is a break or two consecutive breaks)
  let hasEmptySlide = false;
  if (sorted.length > 0 && sorted[0].is_slide_break) {
    hasEmptySlide = true;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].is_slide_break && sorted[i + 1].is_slide_break) {
      hasEmptySlide = true;
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">Slide & Page Boundary Manager</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Define pagination breaks for the participant reading runtime.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={hasEmptySlide ? 'warning' : 'success'}>
            {totalBreaks + 1} {totalBreaks + 1 === 1 ? 'Slide' : 'Slides'} Total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {hasEmptySlide && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Warning: Consecutive or leading slide boundaries create empty slides in runtime.</span>
          </div>
        )}

        {sorted.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No paragraphs available to paginate.</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((para, idx) => (
              <React.Fragment key={para.id}>
                {idx === 0 && (
                  <div className="text-[10px] font-mono uppercase tracking-wider text-primary px-2 py-1 bg-primary/10 rounded border border-primary/20">
                    Slide 1 Start
                  </div>
                )}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="font-semibold text-slate-300 block truncate">
                      {para.title || `Paragraph ${idx + 1}`}
                    </span>
                    <span className="text-slate-500 line-clamp-1 mt-0.5">{para.content}</span>
                  </div>
                  <Button
                    variant={para.is_slide_break ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => onToggleBreak(para.id)}
                    className="flex-shrink-0 text-[11px] h-7 px-2.5"
                  >
                    {para.is_slide_break ? 'Remove Page Break' : '+ Insert Break After'}
                  </Button>
                </div>
                {para.is_slide_break && (
                  <div className="flex items-center gap-2 py-1 px-2 my-1">
                    <div className="h-px bg-accent/40 flex-1" />
                    <span className="text-[10px] font-mono text-accent font-bold uppercase bg-slate-900 px-2 py-0.5 rounded border border-accent/30">
                      Slide Boundary → Next Slide
                    </span>
                    <div className="h-px bg-accent/40 flex-1" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
