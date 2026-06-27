'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormSection } from '@/components/cms/FormSection';
import { ParagraphEditor } from '@/components/cms/editors/ParagraphEditor';
import type { ReadingSection } from '@/types/api';
import type { ExtendedParagraph } from '@/components/cms/editors/SlideBreakEditor';

export interface SectionEditorProps {
  section: ReadingSection;
  paragraphs: ExtendedParagraph[];
  index: number;
  totalSections: number;
  onSectionChange: (updated: ReadingSection) => void;
  onDeleteSection: () => void;
  onDuplicateSection: () => void;
  onMoveSectionUp: () => void;
  onMoveSectionDown: () => void;
  onParagraphChange: (updated: ExtendedParagraph) => void;
  onAddParagraph: (sectionId: string, insertIndex?: number) => void;
  onDeleteParagraph: (id: string) => void;
  onDuplicateParagraph: (id: string) => void;
  onReorderParagraphs: (newParas: ExtendedParagraph[]) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  paragraphs,
  index,
  totalSections,
  onSectionChange,
  onDeleteSection,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onParagraphChange,
  onAddParagraph,
  onDeleteParagraph,
  onDuplicateParagraph,
  onReorderParagraphs,
}) => {
  const sectionParas = paragraphs
    .filter((p) => p.section_id === section.id)
    .sort((a, b) => a.order - b.order);

  // Calculate slide numbers
  let currentSlide = 1;
  const paraSlideMap: Record<string, number> = {};
  sectionParas.forEach((p) => {
    paraSlideMap[p.id] = currentSlide;
    if (p.is_slide_break) {
      currentSlide++;
    }
  });

  const handleMovePara = (paraIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? paraIdx - 1 : paraIdx + 1;
    if (targetIdx < 0 || targetIdx >= sectionParas.length) return;

    const copy = [...sectionParas];
    const temp = copy[paraIdx];
    copy[paraIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((p, idx) => ({ ...p, order: idx + 1 }));
    onReorderParagraphs(reordered);
  };

  return (
    <FormSection
      title={`${section.title || `Reading Section ${index + 1}`}`}
      badge={`${sectionParas.length} Paragraphs`}
      description="Organize coherent reading modules and sequence paragraphs."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex-1 min-w-0 pr-4">
            <Input
              label="Section Heading"
              value={section.title || ''}
              onChange={(e) => onSectionChange({ ...section, title: e.target.value })}
              placeholder="e.g. Chapter 1: Foundations of Neuro-symbolic AI"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveSectionUp}
              disabled={index === 0}
              className="h-8 px-2 text-slate-400 hover:text-white"
              title="Move Section Up"
            >
              ↑ Section
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveSectionDown}
              disabled={index === totalSections - 1}
              className="h-8 px-2 text-slate-400 hover:text-white"
              title="Move Section Down"
            >
              ↓ Section
            </Button>
            <Button variant="outline" size="sm" onClick={onDuplicateSection} className="text-xs">
              Duplicate Section
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeleteSection} className="text-xs">
              Delete Section
            </Button>
          </div>
        </div>

        <div className="space-y-4 pl-0 sm:pl-4 border-l-2 border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configured Paragraphs ({sectionParas.length})
            </h4>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAddParagraph(section.id)}
              className="text-xs"
            >
              + Append Paragraph
            </Button>
          </div>

          {sectionParas.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No reading paragraphs in this section. Click &quot;+ Append Paragraph&quot; to start composing.
            </div>
          ) : (
            <div className="space-y-4">
              {sectionParas.map((para, pIdx) => (
                <ParagraphEditor
                  key={para.id}
                  paragraph={para}
                  index={pIdx}
                  totalCount={sectionParas.length}
                  slideNumber={paraSlideMap[para.id] || 1}
                  onChange={onParagraphChange}
                  onDelete={() => onDeleteParagraph(para.id)}
                  onDuplicate={() => onDuplicateParagraph(para.id)}
                  onMoveUp={() => handleMovePara(pIdx, 'up')}
                  onMoveDown={() => handleMovePara(pIdx, 'down')}
                  onInsertAbove={() => onAddParagraph(section.id, pIdx)}
                  onInsertBelow={() => onAddParagraph(section.id, pIdx + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};
