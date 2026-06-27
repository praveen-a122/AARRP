'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface AccessibilityAuditItem {
  category: 'Heading Hierarchy' | 'Color Contrast' | 'Reading Order' | 'Keyboard Nav' | 'ARIA Labels' | 'Alt Text';
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

export interface AccessibilityReportProps {
  items: AccessibilityAuditItem[];
}

export const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ items }) => {
  const failedCount = items.filter((i) => i.status === 'failed').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">WCAG 2.1 AA Accessibility Audit</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated compliance evaluation for neuro-diverse participant accessibility.
          </p>
        </div>
        <Badge variant={failedCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success'}>
          {failedCount > 0 ? `${failedCount} Violations` : warningCount > 0 ? `${warningCount} Advisories` : 'AA Compliant'}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">{item.category}</span>
              <span
                className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  item.status === 'passed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : item.status === 'warning'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-error/10 text-error-light border border-error/30'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-normal">{item.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
