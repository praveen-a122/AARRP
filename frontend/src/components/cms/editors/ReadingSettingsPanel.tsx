'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface ReadingSettings {
  readingDirection?: 'ltr' | 'rtl';
  fontScaling?: 'normal' | 'large' | 'xlarge';
  paragraphSpacing?: 'compact' | 'comfortable' | 'relaxed';
  interventionThreshold?: number;
  scrollingMode?: 'paginated' | 'continuous';
}

export interface ReadingSettingsPanelProps {
  settings: ReadingSettings;
  onChange: (updated: ReadingSettings) => void;
}

export const ReadingSettingsPanel: React.FC<ReadingSettingsPanelProps> = ({
  settings,
  onChange,
}) => {
  const handleChange = (field: keyof ReadingSettings, value: unknown) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-sm font-bold text-white">Runtime Display & Intervention Settings</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure visual rendering and AI prompt intervention sensitivity for this study.
        </p>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Scrolling & Pagination Mode</label>
          <select
            value={settings.scrollingMode || 'paginated'}
            onChange={(e) => handleChange('scrollingMode', e.target.value as 'paginated' | 'continuous')}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="paginated">Paginated Slides (Slide Break Boundaries)</option>
            <option value="continuous">Continuous Vertical Scrolling</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Reading Direction</label>
          <select
            value={settings.readingDirection || 'ltr'}
            onChange={(e) => handleChange('readingDirection', e.target.value as 'ltr' | 'rtl')}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ltr">Left-to-Right (LTR)</option>
            <option value="rtl">Right-to-Left (RTL)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Typography Scale Recommendation</label>
          <select
            value={settings.fontScaling || 'normal'}
            onChange={(e) => handleChange('fontScaling', e.target.value as 'normal' | 'large' | 'xlarge')}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="normal">Standard / Default (16px base)</option>
            <option value="large">Large Accessibility (18px base)</option>
            <option value="xlarge">Extra Large (20px base)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Paragraph Vertical Spacing</label>
          <select
            value={settings.paragraphSpacing || 'comfortable'}
            onChange={(e) => handleChange('paragraphSpacing', e.target.value as 'compact' | 'comfortable' | 'relaxed')}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="compact">Compact (1.25 line height)</option>
            <option value="comfortable">Comfortable (1.6 line height)</option>
            <option value="relaxed">Relaxed (1.8 line height)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Default Intervention Trigger Threshold</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0.1}
              max={1.0}
              step={0.05}
              value={settings.interventionThreshold ?? 0.65}
              onChange={(e) => handleChange('interventionThreshold', parseFloat(e.target.value) || 0.65)}
              className="w-24 h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
            <span className="text-slate-500">(0.1 - 1.0 Confidence Score)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
