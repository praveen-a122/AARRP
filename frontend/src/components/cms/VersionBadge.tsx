'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import type { ExperimentVersion } from '@/types/api';

export interface VersionBadgeProps {
  version?: ExperimentVersion | null;
  defaultVersionNumber?: number;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({ version, defaultVersionNumber = 1 }) => {
  const versionNum = version?.version_number || defaultVersionNumber;
  const status = version?.status || 'draft';

  const variant =
    status === 'published' ? 'success' : status === 'archived' ? 'warning' : 'default';

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs">
      <span className="text-slate-400 font-bold">v{versionNum}.0</span>
      <Badge variant={variant}>{status.toUpperCase()}</Badge>
    </div>
  );
};
