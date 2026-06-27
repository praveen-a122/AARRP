'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { SystemConfigState } from '@/hooks/useSystemSettings';

export interface ResearchConfigurationProps {
  config: SystemConfigState;
  onUpdate: (newCfg: SystemConfigState) => Promise<unknown>;
}

export const ResearchConfiguration: React.FC<ResearchConfigurationProps> = ({ config, onUpdate }) => {
  const [enableAutosave, setEnableAutosave] = useState(config.enableAutosave);
  const [intervalSec, setIntervalSec] = useState(config.autosaveIntervalSec);

  const handleSave = async () => {
    await onUpdate({ ...config, enableAutosave, autosaveIntervalSec: intervalSec });
    alert('Research parameters updated!');
  };

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Experimental Research Protocols
        </h3>
        <p className="text-xs text-slate-400">Controls affecting RQ1 scaffolding triggers and RQ2 participant runtime telemetry logging</p>
      </div>

      <div className="space-y-4">
        <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${enableAutosave ? 'bg-primary/10 border-primary text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
          <div className="space-y-0.5">
            <strong className="block text-xs text-slate-200">Participant Runtime Autosave Pulse</strong>
            <span className="text-[11px] text-slate-400">Periodically buffer reading slide progress and paragraph focus events</span>
          </div>
          <input type="checkbox" checked={enableAutosave} onChange={(e) => setEnableAutosave(e.target.checked)} className="w-4 h-4" />
        </label>

        {enableAutosave && (
          <div className="max-w-xs">
            <label className="text-xs font-mono text-slate-300 block mb-1">Autosave Interval (Seconds)</label>
            <Input
              type="number"
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              className="bg-slate-950 border-slate-800 text-xs font-mono"
            />
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 space-y-1">
        <strong className="text-purple-300 block font-mono">Enforce Deterministic Quiz Scoring</strong>
        <p className="text-[11px]">Assessment evaluation uses strict JSON schema grading without AI hallucination variance.</p>
      </div>

      <div className="pt-2 flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-xs font-bold px-8">
          Update Research Protocol
        </Button>
      </div>
    </Card>
  );
};
