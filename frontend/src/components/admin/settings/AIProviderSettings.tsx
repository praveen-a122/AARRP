'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const AIProviderSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('gsk_************************************');
  const [model, setModel] = useState('llama3-70b-8192');
  const [maxTokens, setMaxTokens] = useState(512);

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          AI Provider API Configuration
        </h3>
        <p className="text-xs text-slate-400">Configure Groq Llama-3 endpoints and cognitive generation boundaries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="text-xs font-mono text-slate-300 block mb-1">Groq API Secret Key</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-slate-950 border-slate-800 font-mono text-xs flex-1"
            />
            <Button variant="outline" size="sm" onClick={() => alert('Testing API Key validity against Groq servers...')} className="text-xs font-mono">
              ⚡ Test Key
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Primary Scaffolding Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          >
            <option value="llama3-70b-8192">Llama 3 70B (High Reasoning Quality)</option>
            <option value="llama3-8b-8192">Llama 3 8B (Ultra Fast Latency)</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B (Large Context)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Max Generation Tokens / Intervention</label>
          <Input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button onClick={() => alert('AI Provider settings updated!')} className="bg-primary hover:bg-primary-dark text-xs font-bold px-8">
          Save AI Credentials
        </Button>
      </div>
    </Card>
  );
};
