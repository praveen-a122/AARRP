'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface QuizSettings {
  passingScore?: number; // percentage e.g. 70
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowRetry?: boolean;
  maxRetries?: number;
  timerMinutes?: number; // 0 = unlimited
  mandatoryCompletion?: boolean;
  feedbackVisibility?: 'immediate' | 'on_submit' | 'never';
}

export interface QuestionSettingsPanelProps {
  settings: QuizSettings;
  onChange: (updated: QuizSettings) => void;
}

export const QuestionSettingsPanel: React.FC<QuestionSettingsPanelProps> = ({
  settings,
  onChange,
}) => {
  const handleChange = (field: keyof QuizSettings, value: unknown) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-sm font-bold text-white">Quiz Runtime & Evaluation Rules</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure timing, shuffling constraints, passing criteria, and feedback timing.
        </p>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Passing Score Threshold (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={settings.passingScore ?? 70}
            onChange={(e) => handleChange('passingScore', parseInt(e.target.value, 10) || 0)}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Session Timer Limit (Minutes)</label>
          <input
            type="number"
            min={0}
            max={180}
            value={settings.timerMinutes ?? 0}
            onChange={(e) => handleChange('timerMinutes', parseInt(e.target.value, 10) || 0)}
            placeholder="0 = Unlimited time"
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Feedback Visibility</label>
          <select
            value={settings.feedbackVisibility || 'on_submit'}
            onChange={(e) => handleChange('feedbackVisibility', e.target.value)}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="immediate">Immediate (After each question)</option>
            <option value="on_submit">On Submit (End of assessment)</option>
            <option value="never">Never (Hidden from participant)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div>
            <span className="font-semibold text-slate-200 block">Shuffle Questions</span>
            <span className="text-[10px] text-slate-500">Randomize item presentation order</span>
          </div>
          <input
            type="checkbox"
            checked={!!settings.shuffleQuestions}
            onChange={(e) => handleChange('shuffleQuestions', e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-primary w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div>
            <span className="font-semibold text-slate-200 block">Shuffle Options</span>
            <span className="text-[10px] text-slate-500">Randomize MCQ answer sequence</span>
          </div>
          <input
            type="checkbox"
            checked={!!settings.shuffleOptions}
            onChange={(e) => handleChange('shuffleOptions', e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-primary w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div>
            <span className="font-semibold text-slate-200 block">Mandatory Completion</span>
            <span className="text-[10px] text-slate-500">Prevent skipping or quitting early</span>
          </div>
          <input
            type="checkbox"
            checked={settings.mandatoryCompletion ?? true}
            onChange={(e) => handleChange('mandatoryCompletion', e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-primary w-4 h-4"
          />
        </div>
      </CardContent>
    </Card>
  );
};
