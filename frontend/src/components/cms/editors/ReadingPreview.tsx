'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ExtendedParagraph } from '@/components/cms/editors/SlideBreakEditor';
import type { ReadingSettings } from '@/components/cms/editors/ReadingSettingsPanel';

export interface ReadingPreviewProps {
  paragraphs: ExtendedParagraph[];
  settings?: ReadingSettings;
}

export const ReadingPreview: React.FC<ReadingPreviewProps> = ({
  paragraphs,
  settings = {},
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const sorted = [...paragraphs].sort((a, b) => a.order - b.order);

  // Split into slides if paginated
  const slides: ExtendedParagraph[][] = [];
  let currentSlide: ExtendedParagraph[] = [];

  sorted.forEach((para) => {
    currentSlide.push(para);
    if (para.is_slide_break) {
      slides.push(currentSlide);
      currentSlide = [];
    }
  });
  if (currentSlide.length > 0) {
    slides.push(currentSlide);
  }

  const isPaginated = settings.scrollingMode === 'paginated';
  const activeSlideParas = isPaginated ? slides[currentSlideIdx] || [] : sorted;

  const fontClass =
    settings.fontScaling === 'xlarge'
      ? 'text-xl leading-loose'
      : settings.fontScaling === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-base leading-normal';

  return (
    <Card className="border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
      <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <CardTitle className="text-sm font-bold text-white">Live Participant Runtime Preview</CardTitle>
        </div>
        {isPaginated && slides.length > 1 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
              disabled={currentSlideIdx === 0}
              className="h-7 px-2"
            >
              ← Prev Slide
            </Button>
            <span className="text-slate-400 px-2">
              Slide <strong className="text-white">{currentSlideIdx + 1}</strong> of {slides.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
              disabled={currentSlideIdx === slides.length - 1}
              className="h-7 px-2"
            >
              Next Slide →
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent
        dir={settings.readingDirection || 'ltr'}
        className={`p-8 min-h-[300px] max-h-[500px] overflow-y-auto space-y-6 ${fontClass} text-slate-200 font-serif`}
      >
        {activeSlideParas.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-center text-slate-600 font-sans text-xs">
            No paragraph content rendered for this slide sequence.
          </div>
        ) : (
          activeSlideParas.map((para, idx) => (
            <div key={para.id || idx} className="space-y-2 animate-fade-in group">
              {para.title && (
                <h3 className="font-sans font-bold text-white tracking-tight text-lg border-b border-slate-800/40 pb-1">
                  {para.title}
                </h3>
              )}
              <p className="whitespace-pre-wrap">{para.content || <span className="italic text-slate-600">[Empty paragraph body]</span>}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
