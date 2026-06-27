'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

export interface StepValidationBadgeProps {
  criticalCount?: number;
  warningCount?: number;
  isCompleted?: boolean;
}

export const StepValidationBadge: React.FC<StepValidationBadgeProps> = ({
  criticalCount = 0,
  warningCount = 0,
  isCompleted = false,
}) => {
  if (criticalCount > 0) {
    return <Badge variant="warning">{criticalCount} Critical</Badge>;
  }

  if (warningCount > 0) {
    return <Badge variant="default">{warningCount} Warning</Badge>;
  }

  if (isCompleted) {
    return <Badge variant="success">Passed</Badge>;
  }

  return <span className="text-[10px] font-mono text-slate-500 uppercase">Pending</span>;
};
