'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface ValidationIssue {
  id: string;
  fieldId?: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ValidationPanelProps {
  issues: ValidationIssue[];
  onIssueClick?: (issue: ValidationIssue) => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ issues, onIssueClick }) => {
  if (issues.length === 0) return null;

  const criticals = issues.filter((i) => i.severity === 'critical');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  const scrollToField = (fieldId?: string) => {
    if (!fieldId) return;
    const elem = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (elem instanceof HTMLElement) {
        elem.focus({ preventScroll: true });
      }
    }
  };

  const handleAction = (issue: ValidationIssue) => {
    if (onIssueClick) {
      onIssueClick(issue);
    } else {
      scrollToField(issue.fieldId);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold text-white">Validation Diagnostics</CardTitle>
          <Badge variant={criticals.length > 0 ? 'warning' : 'default'}>
            {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {criticals.length > 0 && <span className="text-error">{criticals.length} Critical</span>}
          {warnings.length > 0 && <span className="text-amber-400">{warnings.length} Warning</span>}
          {infos.length > 0 && <span className="text-primary-light">{infos.length} Info</span>}
        </div>
      </CardHeader>

      <CardContent className="pt-3 divide-y divide-slate-800/60 max-h-60 overflow-y-auto space-y-2">
        {issues.map((issue) => {
          const badgeVariant =
            issue.severity === 'critical' ? 'warning' : issue.severity === 'warning' ? 'default' : 'success';
          return (
            <div
              key={issue.id}
              onClick={() => handleAction(issue)}
              className={`pt-2 flex items-start justify-between gap-3 text-xs transition-colors p-2 rounded ${
                issue.fieldId || onIssueClick ? 'cursor-pointer hover:bg-slate-800/60' : ''
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <Badge variant={badgeVariant}>{issue.severity.toUpperCase()}</Badge>
                <span className="text-slate-300 font-medium break-words leading-relaxed">
                  {issue.message}
                </span>
              </div>
              {(issue.fieldId || onIssueClick) && (
                <span className="text-[10px] text-primary flex-shrink-0 font-mono underline">
                  Locate →
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
