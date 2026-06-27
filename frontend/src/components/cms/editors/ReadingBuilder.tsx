'use client';

import React, { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { SectionEditor } from '@/components/cms/editors/SectionEditor';
import { SlideBreakEditor, ExtendedParagraph } from '@/components/cms/editors/SlideBreakEditor';
import { ReadingSettingsPanel, ReadingSettings } from '@/components/cms/editors/ReadingSettingsPanel';
import { ReadingPreview } from '@/components/cms/editors/ReadingPreview';
import { Button } from '@/components/ui/Button';
import type { ReadingSection } from '@/types/api';
import type { ValidationIssue } from '@/components/cms/ValidationPanel';

export const ReadingBuilder: React.FC = () => {
  const {
    readingSections,
    paragraphs,
    addItem,
    removeItem,
    duplicateItem,
    reorderItems,
    setValidation,
    validation,
  } = useWizardStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'pagination' | 'settings' | 'preview'>('editor');
  const [settings, setSettings] = useState<ReadingSettings>({
    scrollingMode: 'paginated',
    readingDirection: 'ltr',
    fontScaling: 'normal',
    paragraphSpacing: 'comfortable',
    interventionThreshold: 0.65,
  });

  const extParagraphs = (paragraphs as unknown as ExtendedParagraph[]) || [];

  // Validate on changes
  useEffect(() => {
    const issues: ValidationIssue[] = [];
    if (readingSections.length === 0) {
      issues.push({
        id: 'reading-no-sections',
        fieldId: 'reading',
        message: 'At least one reading section must be configured.',
        severity: 'critical',
      });
    }

    extParagraphs.forEach((p, idx) => {
      if (!p.content || !p.content.trim()) {
        issues.push({
          id: `para-empty-${p.id || idx}`,
          fieldId: 'reading',
          message: `Paragraph #${idx + 1} is empty. Add text content or remove it.`,
          severity: 'warning',
        });
      }
      if (p.word_count > 500) {
        issues.push({
          id: `para-long-${p.id || idx}`,
          fieldId: 'reading',
          message: `Paragraph #${idx + 1} exceeds 500 words (${p.word_count} words). Consider splitting into smaller sections.`,
          severity: 'info',
        });
      }
    });

    // Keep non-reading validation issues and update reading ones
    const otherIssues = validation.filter((v) => !v.fieldId || !v.fieldId.startsWith('reading'));
    setValidation([...otherIssues, ...issues]);
  }, [readingSections, extParagraphs, setValidation]);

  const handleAddSection = () => {
    const newSec: ReadingSection = {
      id: `sec_${Date.now()}`,
      condition_id: 'default',
      title: `Reading Module ${readingSections.length + 1}`,
      content: '',
      order: readingSections.length + 1,
    };
    addItem('readingSections', newSec);
  };

  const handleAddParagraph = (sectionId: string) => {
    const sectionParas = extParagraphs.filter((p) => p.section_id === sectionId);
    const newPara: ExtendedParagraph = {
      id: `para_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      section_id: sectionId,
      content: '',
      order: sectionParas.length + 1,
      word_count: 0,
      difficulty: 'medium',
    };
    addItem('paragraphs', newPara);
  };

  const handleToggleBreak = (paraId: string) => {
    const updated = extParagraphs.map((p) =>
      p.id === paraId ? { ...p, is_slide_break: !p.is_slide_break } : p
    );
    reorderItems('paragraphs', updated);
  };

  const handleSectionChange = (updated: ReadingSection) => {
    const copy = readingSections.map((s) => (s.id === updated.id ? updated : s));
    reorderItems('readingSections', copy);
  };

  const handleMoveSection = (secIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? secIdx - 1 : secIdx + 1;
    if (targetIdx < 0 || targetIdx >= readingSections.length) return;

    const copy = [...readingSections];
    const temp = copy[secIdx];
    copy[secIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    reorderItems('readingSections', reordered);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'editor', label: '1. Content Editor' },
            { id: 'pagination', label: '2. Slide Boundaries' },
            { id: 'settings', label: '3. Display Settings' },
            { id: 'preview', label: '4. Live Preview' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'editor' && (
          <Button variant="default" size="md" onClick={handleAddSection} className="text-xs">
            + Add Reading Section
          </Button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {readingSections.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-slate-900/20">
              <h3 className="text-base font-bold text-white">No Reading Modules Configured</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Begin structuring experimental reading materials by creating coherent chapters or sections.
              </p>
              <Button variant="default" size="md" onClick={handleAddSection}>
                + Initialize First Section
              </Button>
            </div>
          ) : (
            readingSections
              .sort((a, b) => a.order - b.order)
              .map((sec, sIdx) => (
                <SectionEditor
                  key={sec.id}
                  section={sec}
                  paragraphs={extParagraphs}
                  index={sIdx}
                  totalSections={readingSections.length}
                  onSectionChange={handleSectionChange}
                  onDeleteSection={() => removeItem('readingSections', sec.id)}
                  onDuplicateSection={() => duplicateItem('readingSections', sec.id)}
                  onMoveSectionUp={() => handleMoveSection(sIdx, 'up')}
                  onMoveSectionDown={() => handleMoveSection(sIdx, 'down')}
                  onParagraphChange={(updated) => {
                    const copy = extParagraphs.map((p) => (p.id === updated.id ? updated : p));
                    reorderItems('paragraphs', copy);
                  }}
                  onAddParagraph={handleAddParagraph}
                  onDeleteParagraph={(id) => removeItem('paragraphs', id)}
                  onDuplicateParagraph={(id) => duplicateItem('paragraphs', id)}
                  onReorderParagraphs={(newParas) => {
                    const otherParas = extParagraphs.filter((p) => p.section_id !== sec.id);
                    reorderItems('paragraphs', [...otherParas, ...newParas]);
                  }}
                />
              ))
          )}
        </div>
      )}

      {activeTab === 'pagination' && (
        <SlideBreakEditor paragraphs={extParagraphs} onToggleBreak={handleToggleBreak} />
      )}

      {activeTab === 'settings' && (
        <ReadingSettingsPanel settings={settings} onChange={setSettings} />
      )}

      {activeTab === 'preview' && (
        <ReadingPreview paragraphs={extParagraphs} settings={settings} />
      )}
    </div>
  );
};
