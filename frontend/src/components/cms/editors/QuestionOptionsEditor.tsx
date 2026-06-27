'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface QuestionOptionsEditorProps {
  options: string[];
  correctIndex: number;
  correctIndices?: number[];
  questionType?: 'mcq' | 'multi_select' | 'boolean' | 'likert' | 'short_answer' | 'long_answer';
  onOptionsChange: (newOptions: string[]) => void;
  onCorrectIndexChange: (index: number) => void;
  onCorrectIndicesChange?: (indices: number[]) => void;
}

export const QuestionOptionsEditor: React.FC<QuestionOptionsEditorProps> = ({
  options,
  correctIndex,
  correctIndices = [],
  questionType = 'mcq',
  onOptionsChange,
  onCorrectIndexChange,
  onCorrectIndicesChange,
}) => {
  if (questionType === 'short_answer' || questionType === 'long_answer') {
    return (
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 italic text-center">
        Open-text input question. Options are not required for free-response runtime evaluation.
      </div>
    );
  }

  const handleAddOption = () => {
    onOptionsChange([...options, `Option ${options.length + 1}`]);
  };

  const handleDeleteOption = (idx: number) => {
    if (options.length <= 2) return; // keep minimum 2
    const next = options.filter((_, i) => i !== idx);
    onOptionsChange(next);
    if (correctIndex === idx) {
      onCorrectIndexChange(0);
    } else if (correctIndex > idx) {
      onCorrectIndexChange(correctIndex - 1);
    }
    if (onCorrectIndicesChange) {
      onCorrectIndicesChange(
        correctIndices.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i))
      );
    }
  };

  const handleDuplicateOption = (idx: number) => {
    const copy = [...options];
    copy.splice(idx + 1, 0, `${options[idx]} (Copy)`);
    onOptionsChange(copy);
  };

  const handleMoveOption = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= options.length) return;

    const copy = [...options];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    onOptionsChange(copy);

    if (correctIndex === idx) onCorrectIndexChange(targetIdx);
    else if (correctIndex === targetIdx) onCorrectIndexChange(idx);

    if (onCorrectIndicesChange) {
      const updated = correctIndices.map((i) => (i === idx ? targetIdx : i === targetIdx ? idx : i));
      onCorrectIndicesChange(updated);
    }
  };

  const handleToggleMultiCorrect = (idx: number) => {
    if (!onCorrectIndicesChange) return;
    const exists = correctIndices.includes(idx);
    if (exists) {
      onCorrectIndicesChange(correctIndices.filter((i) => i !== idx));
    } else {
      onCorrectIndicesChange([...correctIndices, idx]);
    }
  };

  const isMulti = questionType === 'multi_select';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">
          Answer Options & Correctness Key ({isMulti ? 'Select all valid' : 'Select one valid'})
        </label>
        {questionType !== 'boolean' && questionType !== 'likert' && (
          <Button variant="secondary" size="sm" onClick={handleAddOption} className="text-xs h-7 px-2.5">
            + Add Option
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isCorrect = isMulti ? correctIndices.includes(idx) : correctIndex === idx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              {/* Correct Radio/Checkbox */}
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={`correct_opt_${questionType}`}
                checked={isCorrect}
                onChange={() => (isMulti ? handleToggleMultiCorrect(idx) : onCorrectIndexChange(idx))}
                className={`w-4 h-4 rounded-${isMulti ? 'md' : 'full'} bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer`}
                title="Mark as correct answer"
              />

              {/* Option Text Input */}
              <input
                type="text"
                value={opt}
                disabled={questionType === 'boolean' || questionType === 'likert'}
                onChange={(e) => {
                  const copy = [...options];
                  copy[idx] = e.target.value;
                  onOptionsChange(copy);
                }}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 disabled:opacity-75 font-medium"
              />

              {/* Option Reorder & Actions */}
              {questionType !== 'boolean' && questionType !== 'likert' && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveOption(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveOption(idx, 'down')}
                    disabled={idx === options.length - 1}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateOption(idx)}
                    className="p-1 text-slate-500 hover:text-white text-xs"
                    title="Duplicate Option"
                  >
                    ©
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(idx)}
                    disabled={options.length <= 2}
                    className="p-1 text-slate-500 hover:text-error disabled:opacity-30 text-xs font-bold"
                    title="Delete Option"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
