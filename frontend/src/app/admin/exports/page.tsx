'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { useExportModule, type ExportHistoryItem } from '@/hooks/useExportModule';
import { ExportInterface } from '@/components/admin/exports/ExportInterface';
import { ExportHistory } from '@/components/admin/exports/ExportHistory';
import { ChecksumViewer } from '@/components/admin/exports/ChecksumViewer';
import { ManifestViewer } from '@/components/admin/exports/ManifestViewer';
import { Spinner } from '@/components/ui/Spinner';

export default function ExportCenterPage() {
  const { history, isLoading, generateExport, isGenerating } = useExportModule();
  const [activeManifest, setActiveManifest] = useState<ExportHistoryItem | null>(null);
  const [activeChecksum, setActiveChecksum] = useState<ExportHistoryItem | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-fade-in">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Research Dataset Export Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Synthesize, verify, and download cryptographic ZIP archives for statistical RQ1/RQ2 evaluation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Archive Cryptography: SHA-256</span>
          </div>
        </div>

        {/* Generator Form */}
        <ExportInterface onGenerate={generateExport} isGenerating={isGenerating} />

        {/* Historical Archives List */}
        {isLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 text-slate-400">
            <Spinner size="lg" />
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
              Retrieving Export Archives Catalog...
            </p>
          </div>
        ) : (
          <ExportHistory
            history={history}
            onSelectManifest={setActiveManifest}
            onSelectChecksum={setActiveChecksum}
          />
        )}

        {/* Modals */}
        <ManifestViewer item={activeManifest} onClose={() => setActiveManifest(null)} />
        <ChecksumViewer item={activeChecksum} onClose={() => setActiveChecksum(null)} />
      </div>
    </DashboardLayout>
  );
}
