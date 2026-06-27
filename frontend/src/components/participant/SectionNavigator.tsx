'use client';

import React from 'react';
import type { ReadingSection } from '@/types/api';

export interface SectionNavigatorProps {
  sections: ReadingSection[];
  activeSectionId: string;
  maxUnlockedOrder: number;
  onSelectSection: (sectionId: string) => void;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  activeSectionId,
  maxUnlockedOrder = 1,
  onSelectSection,
}) => {
  return (
    <nav className="w-full bg-slate-950 border-b border-slate-800/80 overflow-x-auto py-2 px-4 sm:px-8 flex items-center gap-2 select-none">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold pr-2 border-r border-slate-800 flex-shrink-0">
        Modules
      </span>

      <div className="flex items-center gap-2">
        {sections.map((sec, idx) => {
          const isLocked = sec.order > maxUnlockedOrder;
          const isActive = sec.id === activeSectionId;

          return (
            <button
              key={sec.id}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary/40 font-bold'
                  : isLocked
                  ? 'bg-slate-900/40 text-slate-600 border border-slate-900 cursor-not-allowed opacity-60'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
              title={isLocked ? 'Complete active assessment or slide sequence to unlock' : sec.title}
            >
              <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
              <span className="truncate max-w-[140px]">{sec.title || `Module ${idx + 1}`}</span>
              {isLocked ? <span className="text-slate-500 text-[10px]">🔒</span> : isActive ? <span className="text-emerald-400 text-[10px]">●</span> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
