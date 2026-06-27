'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export const RolesPermissions: React.FC = () => {
  const roles = ['Principal Investigator', 'Research Associate', 'System Admin', 'Viewer'];
  const permissions = [
    { name: 'Create & Edit Research Experiments', access: [true, true, true, false] },
    { name: 'Publish Module to Participant Runtime', access: [true, false, true, false] },
    { name: 'Synthesize & Download Dataset Archives', access: [true, true, true, false] },
    { name: 'Modify AI Scaffolding Prompt Templates', access: [true, false, true, false] },
    { name: 'Configure Platform RBAC & Security API', access: [false, false, true, false] },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Role-Based Access Control (RBAC) Matrix
        </h3>
        <p className="text-xs text-slate-400">Granular permission enforcement across experimental design and export workflows</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
              <th className="p-3 font-bold">Policy Domain</th>
              {roles.map((r) => (
                <th key={r} className="p-3 text-center font-bold text-slate-200">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-sans text-white font-medium">{p.name}</td>
                {p.access.map((allowed, rIdx) => (
                  <td key={rIdx} className="p-3 text-center">
                    {allowed ? (
                      <span className="inline-block w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 leading-6 border border-emerald-500/30">✓</span>
                    ) : (
                      <span className="inline-block w-6 h-6 rounded-full bg-slate-950 text-slate-600 leading-6 border border-slate-800">✕</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
