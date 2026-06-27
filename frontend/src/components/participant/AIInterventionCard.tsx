'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { AIResponsePayload } from '@/hooks/useAIIntervention';

export interface AIInterventionCardProps {
  intervention: AIResponsePayload;
  onClose: () => void;
  onExpand?: () => void;
  onFeedback: (interventionId: string, helpful: boolean, comment?: string) => void;
}

export const AIInterventionCard: React.FC<AIInterventionCardProps> = ({
  intervention,
  onClose,
  onExpand,
  onFeedback,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [comment, setComment] = useState('');

  const handleThumb = (helpful: boolean) => {
    setFeedbackGiven(helpful ? 'yes' : 'no');
    onFeedback(intervention.intervention_id, helpful);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackGiven !== null) {
      onFeedback(intervention.intervention_id, feedbackGiven === 'yes', comment);
      setComment('');
    }
  };

  return (
    <Card className="max-w-md w-full p-5 bg-slate-900/95 border-primary/40 shadow-2xl backdrop-blur-md animate-fade-in space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-xs font-bold font-mono text-primary-light uppercase tracking-wider">
            Adaptive AI Scaffolding
          </span>
          <Badge variant="secondary" className="text-[10px]">
            {intervention.scaffolding_type || 'Hint'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="text-slate-400 hover:text-white p-1 text-xs"
              title="Expand Scaffolding Dialog"
            >
              ⛶
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-xs"
            title="Dismiss Intervention"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-100 font-sans leading-relaxed p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        {intervention.response_text}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Was this cognitive scaffolding helpful?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={feedbackGiven !== null}
              onClick={() => handleThumb(true)}
              className={`px-2 py-1 rounded border text-xs transition-all ${
                feedbackGiven === 'yes'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              👍 Yes
            </button>
            <button
              type="button"
              disabled={feedbackGiven !== null}
              onClick={() => handleThumb(false)}
              className={`px-2 py-1 rounded border text-xs transition-all ${
                feedbackGiven === 'no'
                  ? 'bg-error/20 text-error border-error font-bold'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              👎 No
            </button>
          </div>
        </div>

        {feedbackGiven !== null && (
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-1 animate-fade-in">
            <input
              type="text"
              placeholder="Optional feedback note..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-primary"
            />
            <Button type="submit" size="sm" variant="outline" className="text-[11px] px-2 py-1 h-auto">
              Send
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};
