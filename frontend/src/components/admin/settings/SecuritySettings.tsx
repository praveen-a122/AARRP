'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const SecuritySettings: React.FC = () => {
  const [jwtExpiryMinutes, setJwtExpiryMinutes] = useState(60);
  const [enforceMFA, setEnforceMFA] = useState(true);
  const [allowedIPs, setAllowedIPs] = useState('0.0.0.0/0 (All Networks)');

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Security & Session Governance
        </h3>
        <p className="text-xs text-slate-400">JWT token expiration rules, multi-factor authentication, and network whitelists</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">JWT Session Expiry (Minutes)</label>
          <Input
            type="number"
            value={jwtExpiryMinutes}
            onChange={(e) => setJwtExpiryMinutes(Number(e.target.value))}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">Allowed IP CIDR Ranges</label>
          <Input
            type="text"
            value={allowedIPs}
            onChange={(e) => setAllowedIPs(e.target.value)}
            className="bg-slate-950 border-slate-800 text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${enforceMFA ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <div className="space-y-0.5">
              <strong className="block text-xs text-slate-200">Enforce Multi-Factor Authentication (MFA)</strong>
              <span className="text-[11px] text-slate-400">Require TOTP authenticator passcodes for principal investigators accessing raw telemetry</span>
            </div>
            <input type="checkbox" checked={enforceMFA} onChange={(e) => setEnforceMFA(e.target.checked)} className="w-4 h-4" />
          </label>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button onClick={() => alert('Security governance policies applied!')} className="bg-primary hover:bg-primary-dark text-xs font-bold px-8">
          Save Security Policy
        </Button>
      </div>
    </Card>
  );
};
