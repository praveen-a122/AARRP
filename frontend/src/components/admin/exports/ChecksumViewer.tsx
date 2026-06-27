'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ExportHistoryItem } from '@/hooks/useExportModule';

export interface ChecksumViewerProps {
  item: ExportHistoryItem | null;
  onClose: () => void;
}

export const ChecksumViewer: React.FC<ChecksumViewerProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.sha256_checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-lg w-full p-6 sm:p-8 bg-slate-900 border-primary/50 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="text-base font-bold text-white">Cryptographic Checksum Verification</h3>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs">{item.filename}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
            SHA-256 Digest:
          </label>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-primary-light break-all select-all flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{item.sha256_checksum}</span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-[11px] flex-shrink-0">
              {copied ? '✓ Copied!' : 'Copy Hash'}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <strong className="text-white block font-sans">Why verify checksums?</strong>
          <p>
            Cryptographic SHA-256 verification guarantees that research datasets have not been altered or corrupted after synthesis. To verify locally, run <code className="text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">sha256sum {item.filename}</code> in your command shell and confirm output matches this exact digest.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="default" onClick={onClose} className="text-xs bg-primary hover:bg-primary-dark font-bold px-6">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};
