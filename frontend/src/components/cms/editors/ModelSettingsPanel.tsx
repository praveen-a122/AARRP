'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface ModelSettings {
  provider?: 'openai' | 'anthropic' | 'google' | 'local';
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  fallbackProvider?: string;
}

export interface ModelSettingsPanelProps {
  settings: ModelSettings;
  onChange: (updated: ModelSettings) => void;
}

export const ModelSettingsPanel: React.FC<ModelSettingsPanelProps> = ({ settings, onChange }) => {
  const handleChange = (field: keyof ModelSettings, value: unknown) => {
    onChange({ ...settings, [field]: value });
  };

  const availableModels =
    settings.provider === 'anthropic'
      ? ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
      : settings.provider === 'google'
      ? ['gemini-1.5-pro', 'gemini-1.5-flash']
      : ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-sm font-bold text-white">Inference Engine Hyperparameters</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Fine-tune neural generation temperature, sampling bounds, and redundancy fallbacks.
        </p>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Primary Provider</label>
          <select
            value={settings.provider || 'openai'}
            onChange={(e) => {
              const prov = e.target.value as ModelSettings['provider'];
              const defModel = prov === 'anthropic' ? 'claude-3-5-sonnet-20241022' : prov === 'google' ? 'gemini-1.5-pro' : 'gpt-4o';
              onChange({ ...settings, provider: prov, model: defModel });
            }}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
            <option value="google">Google DeepMind (Gemini)</option>
            <option value="local">Local vLLM / Ollama</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Target Model Identifier</label>
          <select
            value={settings.model || availableModels[0]}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            {availableModels.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Fallback Provider</label>
          <select
            value={settings.fallbackProvider || 'none'}
            onChange={(e) => handleChange('fallbackProvider', e.target.value === 'none' ? undefined : e.target.value)}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            <option value="none">None (Strict Failure)</option>
            <option value="openai">OpenAI Backup Cluster</option>
            <option value="anthropic">Anthropic Backup Cluster</option>
            <option value="google">Google DeepMind Backup</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Max Token Budget</label>
          <input
            type="number"
            min={50}
            max={4096}
            step={50}
            value={settings.max_tokens ?? 500}
            onChange={(e) => handleChange('max_tokens', parseInt(e.target.value, 10) || 500)}
            className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="font-semibold text-slate-300">Temperature</label>
            <span className="font-mono text-primary">{settings.temperature ?? 0.7}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={settings.temperature ?? 0.7}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value) || 0.7)}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="font-semibold text-slate-300">Top P (Nucleus)</label>
            <span className="font-mono text-primary">{settings.top_p ?? 1.0}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={settings.top_p ?? 1.0}
            onChange={(e) => handleChange('top_p', parseFloat(e.target.value) || 1.0)}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="font-semibold text-slate-300">Frequency Penalty</label>
            <span className="font-mono text-primary">{settings.frequency_penalty ?? 0.0}</span>
          </div>
          <input
            type="range"
            min={-2.0}
            max={2.0}
            step={0.1}
            value={settings.frequency_penalty ?? 0.0}
            onChange={(e) => handleChange('frequency_penalty', parseFloat(e.target.value) || 0.0)}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="font-semibold text-slate-300">Presence Penalty</label>
            <span className="font-mono text-primary">{settings.presence_penalty ?? 0.0}</span>
          </div>
          <input
            type="range"
            min={-2.0}
            max={2.0}
            step={0.1}
            value={settings.presence_penalty ?? 0.0}
            onChange={(e) => handleChange('presence_penalty', parseFloat(e.target.value) || 0.0)}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );
};
