'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { SystemConfigState } from '@/hooks/useSystemSettings';

export interface SystemConfigurationProps {
  config: SystemConfigState;
  onUpdate: (newCfg: SystemConfigState) => Promise<unknown>;
  isUpdating?: boolean;
}

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ config, onUpdate, isUpdating = false }) => {
  const [formData, setFormData] = useState<SystemConfigState>(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    alert('System configuration updated successfully!');
  };

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Host System Configuration
        </h3>
        <p className="text-xs text-slate-400">Global environment limits and data cleanup retention rules</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Deployment Environment</label>
          <select
            value={formData.environment}
            onChange={(e) => setFormData({ ...formData, environment: e.target.value as SystemConfigState['environment'] })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
          >
            <option value="production">Production (Strict Verification)</option>
            <option value="staging">Staging (Sandbox Testing)</option>
            <option value="development">Development (Debug Logging)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Max Active Sessions / User</label>
          <Input
            type="number"
            value={formData.maxSessionsPerUser}
            onChange={(e) => setFormData({ ...formData, maxSessionsPerUser: Number(e.target.value) })}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Telemetry Retention Horizon (Days)</label>
          <Input
            type="number"
            value={formData.telemetryRetentionDays}
            onChange={(e) => setFormData({ ...formData, telemetryRetentionDays: Number(e.target.value) })}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">AI Request Timeout (Sec)</label>
          <Input
            type="number"
            value={formData.aiTimeoutSec}
            onChange={(e) => setFormData({ ...formData, aiTimeoutSec: Number(e.target.value) })}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <Button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary-dark text-xs font-bold px-8">
            {isUpdating ? 'Saving Changes...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
