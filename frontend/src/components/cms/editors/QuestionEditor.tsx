'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { QuestionOptionsEditor } from '@/components/cms/editors/QuestionOptionsEditor';
import { QuestionPreview } from '@/components/cms/editors/QuestionPreview';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { ExtendedQuestion } from '@/components/cms/editors/QuizStatisticsPanel';

export interface QuestionEditorProps {
  question: ExtendedQuestion;
  index: number;
  totalCount: number;
  onChange: (updated: ExtendedQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave?: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  totalCount,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onSave,
}) => {
  useKeyboardShortcuts({
    onSave,
    onDuplicate,
    onDelete,
  });

  const handleChange = (field: keyof ExtendedQuestion, value: unknown) => {
    onChange({ ...question, [field]: value });
  };

  return (
    <div className="space-y-6 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 transition-all hover:border-slate-700">
      {/* Top Header & Reorder Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 bg-accent/10 rounded border border-accent/20">
            Item #{index + 1}
          </span>
          <Input
            label=""
            value={question.title || `Question ${index + 1}`}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Question internal title..."
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={index === 0} title="Move Up">
            ↑
          </Button>
          <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={index === totalCount - 1} title="Move Down">
            ↓
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate} className="text-xs">
            Duplicate
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs">
            Delete
          </Button>
        </div>
      </div>

      {/* Main Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Question Format Type</label>
          <select
            value={question.type || 'mcq'}
            onChange={(e) => {
              const type = e.target.value as ExtendedQuestion['type'];
              let opts = question.options;
              if (type === 'boolean') opts = ['True', 'False'];
              else if (type === 'likert') opts = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
              else if (!opts || opts.length === 0) opts = ['Option 1', 'Option 2'];
              onChange({ ...question, type, options: opts });
            }}
            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="mcq">Multiple Choice (Single Answer)</option>
            <option value="multi_select">Multiple Select (Checkboxes)</option>
            <option value="boolean">True / False</option>
            <option value="likert">Likert Scale (5-Point)</option>
            <option value="short_answer">Short Answer (Text)</option>
            <option value="long_answer">Long Answer (Essay)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Score Weight (Points)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={question.points ?? 10}
            onChange={(e) => handleChange('points', parseInt(e.target.value, 10) || 0)}
            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 h-10 self-end">
          <span className="text-xs font-semibold text-slate-300">Mandatory Item</span>
          <input
            type="checkbox"
            checked={question.required !== false}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-primary w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Prompt Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Participant Question Prompt</label>
        <textarea
          value={question.prompt || ''}
          onChange={(e) => handleChange('prompt', e.target.value)}
          placeholder="State the comprehension question clearly..."
          rows={3}
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
        />
      </div>

      {/* Options Editor */}
      <QuestionOptionsEditor
        options={question.options || []}
        correctIndex={question.correct_option_index || 0}
        correctIndices={question.correct_option_indices || [0]}
        questionType={question.type || 'mcq'}
        onOptionsChange={(opts) => handleChange('options', opts)}
        onCorrectIndexChange={(idx) => handleChange('correct_option_index', idx)}
        onCorrectIndicesChange={(indices) => handleChange('correct_option_indices', indices)}
      />

      {/* Explanation & Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Post-Submission Explanation</label>
          <input
            type="text"
            value={question.explanation || ''}
            onChange={(e) => handleChange('explanation', e.target.value)}
            placeholder="Explain why the correct answer is right..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Custom Guidance Feedback</label>
          <input
            type="text"
            value={question.feedback || ''}
            onChange={(e) => handleChange('feedback', e.target.value)}
            placeholder="Encouragement or corrective hint..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Live Preview Accordion/Container */}
      <div className="pt-2">
        <QuestionPreview question={question} index={index} />
      </div>
    </div>
  );
};
