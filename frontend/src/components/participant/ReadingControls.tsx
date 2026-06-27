'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export interface ReadingControlsProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  onExit?: () => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({
  onNext,
  onPrev,
  isFirstSlide,
  isLastSlide,
  fontSize,
  onFontSizeChange,
  onExit,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];

  return (
    <div className="sticky bottom-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Font & Fullscreen Tools */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
          <span className="text-[10px] font-mono text-slate-500 px-2 uppercase">Text</span>
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onFontSizeChange(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                fontSize === s ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? '⊙ Exit Fullscreen' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-3">
        {onExit && (
          <Button variant="ghost" size="md" onClick={onExit} className="text-xs text-slate-400">
            Suspend / Resume Later
          </Button>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={isFirstSlide}
          className="text-xs px-5"
        >
          ← Previous
        </Button>

        <Button
          variant="default"
          size="md"
          onClick={onNext}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 shadow-lg shadow-primary/20 text-xs"
        >
          {isLastSlide ? 'Complete Section →' : 'Next Slide →'}
        </Button>
      </div>
    </div>
  );
};
