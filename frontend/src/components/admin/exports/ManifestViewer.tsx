'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ExportHistoryItem } from '@/hooks/useExportModule';

export interface ManifestViewerProps {
  item: ExportHistoryItem | null;
  onClose: () => void;
}

export const ManifestViewer: React.FC<ManifestViewerProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const manifestJson = JSON.stringify(
    {
      archive_id: item.id,
      filename: item.filename,
      generated_at: item.created_at,
      sha256_checksum: item.sha256_checksum,
      schema_version: item.manifest_summary.schema_version || '2.0.0-rc1',
      included_tables: item.manifest_summary.tables || ['raw_events', 'paragraph_events'],
      anonymization_applied: item.manifest_summary.anonymized ?? true,
      total_records: item.row_count,
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-6 sm:p-8 bg-slate-900 border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <div>
              <h3 className="text-base font-bold text-white">Dataset Archive Manifest</h3>
              <p className="text-[11px] font-mono text-slate-400">Schema configuration & telemetry metadata summary</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 selection:bg-emerald-500/30 selection:text-white">
          <pre className="whitespace-pre-wrap">{manifestJson}</pre>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-between items-center flex-shrink-0">
          <span className="text-[11px] font-mono text-slate-500">JSON specification v2.0</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
              {copied ? '✓ Copied Manifest' : 'Copy JSON'}
            </Button>
            <Button variant="default" size="sm" onClick={onClose} className="text-xs bg-primary hover:bg-primary-dark font-bold px-6">
              Close Viewer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
