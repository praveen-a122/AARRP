'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface TokenEstimatorProps {
  systemPrompt?: string;
  userPrompt?: string;
  maxTokens?: number;
  model?: string;
}

export const TokenEstimator: React.FC<TokenEstimatorProps> = ({
  systemPrompt = '',
  userPrompt = '',
  maxTokens = 500,
  model = 'gpt-4o',
}) => {
  // Simple heuristic: ~4 chars per token in English text
  const promptChars = systemPrompt.length + userPrompt.length;
  const estPromptTokens = Math.max(10, Math.round(promptChars / 3.8));
  const estCompletionTokens = maxTokens || 500;
  const totalTokens = estPromptTokens + estCompletionTokens;

  // Approximate cost per 1k tokens (e.g. $0.005 input, $0.015 output for gpt-4o)
  let inputRate = 0.005;
  let outputRate = 0.015;
  if (model && model.includes('3.5')) {
    inputRate = 0.0005;
    outputRate = 0.0015;
  } else if (model && model.includes('claude')) {
    inputRate = 0.003;
    outputRate = 0.015;
  }

  const estCost = ((estPromptTokens / 1000) * inputRate + (estCompletionTokens / 1000) * outputRate).toFixed(4);
  const estLatencyMs = Math.round(300 + estCompletionTokens * 15); // ~15ms per output token

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          LLM Telemetry & Resource Estimator
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Est. Prompt Tokens</span>
          <span className="text-primary-light font-bold text-sm">{estPromptTokens} tokens</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Max Output Budget</span>
          <span className="text-slate-200 font-bold text-sm">{estCompletionTokens} tokens</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Est. API Cost / Request</span>
          <span className="text-emerald-400 font-bold text-sm">${estCost} USD</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Expected Latency</span>
          <span className="text-amber-400 font-bold text-sm">~{(estLatencyMs / 1000).toFixed(1)}s</span>
        </div>
      </CardContent>
    </Card>
  );
};
