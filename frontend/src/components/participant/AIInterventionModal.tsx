'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { AIResponsePayload } from '@/hooks/useAIIntervention';

export interface AIInterventionModalProps {
  isOpen: boolean;
  intervention: AIResponsePayload | null;
  onClose: () => void;
  onRequestFollowUp: (queryText: string) => Promise<void>;
  isGenerating?: boolean;
}

export const AIInterventionModal: React.FC<AIInterventionModalProps> = ({
  isOpen,
  intervention,
  onClose,
  onRequestFollowUp,
  isGenerating = false,
}) => {
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);

  if (!isOpen || !intervention) return null;

  const handleSubmitFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isGenerating) return;

    const query = followUpQuery.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: query }]);
    setFollowUpQuery('');

    await onRequestFollowUp(query);
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `Adaptive Expansion for "${query}": Notice how this element reinforces the conceptual framework established earlier in the section. Can you identify the governing rule?`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-6 sm:p-8 bg-slate-900 border-primary/50 shadow-2xl flex flex-col max-h-[85vh] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="text-base font-bold text-white">Adaptive Scaffolding Dialogue</h3>
              <p className="text-[11px] font-mono text-slate-400">
                Intervention ID: <code className="text-primary-light">{intervention.intervention_id}</code> ({intervention.latency_ms}ms)
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-2 text-sm">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Initial Intervention Message */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-xs sm:text-sm text-slate-100 leading-relaxed font-sans space-y-1">
            <span className="text-[10px] font-mono uppercase text-primary-light font-bold block">Primary Hint</span>
            <p>{intervention.response_text}</p>
          </div>

          {/* Follow-up Dialogue History */}
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white ml-auto border border-slate-700'
                  : 'bg-primary/10 text-slate-100 mr-auto border border-primary/30'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 font-bold">
                {msg.sender === 'user' ? 'You' : 'Adaptive AI Scaffolding'}
              </span>
              <p>{msg.text}</p>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-primary-light font-mono animate-pulse p-2">
              <Spinner size="sm" /> Synthesizing contextual scaffolding response...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitFollowUp} className="pt-3 border-t border-slate-800 flex items-center gap-3 flex-shrink-0">
          <Input
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Ask clarifying question on this concept..."
            disabled={isGenerating}
            className="flex-1 text-xs"
          />
          <Button type="submit" disabled={isGenerating || !followUpQuery.trim()} className="bg-primary hover:bg-primary-dark text-xs font-bold px-5">
            Ask AI →
          </Button>
        </form>
      </Card>
    </div>
  );
};
