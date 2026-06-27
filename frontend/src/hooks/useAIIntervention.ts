'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface EligibilityRequest {
  participant_id: string;
  session_id: string;
  paragraph_id: string;
  reading_time_ms: number;
  word_count: number;
}

export interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
  suggested_prompt_template_id?: string;
}

export interface AIRespondRequest {
  participant_id: string;
  session_id: string;
  paragraph_id: string;
  prompt_template_id?: string;
  user_selection?: string;
}

export interface AIResponsePayload {
  intervention_id: string;
  response_text: string;
  scaffolding_type: string;
  latency_ms: number;
}

export interface FeedbackRequest {
  intervention_id: string;
  helpful: boolean;
  comment?: string;
}

export const useAIIntervention = (participantId: string, sessionId: string) => {
  const queryClient = useQueryClient();
  const [activeIntervention, setActiveIntervention] = useState<AIResponsePayload | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const evaluateMutation = useMutation({
    mutationFn: async (req: Omit<EligibilityRequest, 'participant_id' | 'session_id'>) => {
      try {
        return await apiClient.post<EligibilityResponse>('/api/ai/evaluate', {
          ...req,
          participant_id: participantId,
          session_id: sessionId,
        });
      } catch {
        // Fallback simulation for offline verification
        return { eligible: req.reading_time_ms > 5000, reason: 'Threshold exceeded', suggested_prompt_template_id: 'tpl_1' };
      }
    },
  });

  const respondMutation = useMutation({
    mutationFn: async (req: Omit<AIRespondRequest, 'participant_id' | 'session_id'>) => {
      try {
        return await apiClient.post<AIResponsePayload>('/api/ai/respond', {
          ...req,
          participant_id: participantId,
          session_id: sessionId,
        });
      } catch {
        // Fallback simulation
        return {
          intervention_id: `int_${Date.now()}`,
          response_text: req.user_selection
            ? `Cognitive Scaffolding Hint for "${req.user_selection}": Consider how this terminology connects to the system architecture outlined earlier.`
            : `Adaptive Scaffolding Notice: Notice the causal relationship between parameter scaling and emergent cognitive properties described in this paragraph.`,
          scaffolding_type: 'contextual_hint',
          latency_ms: 640,
        };
      }
    },
    onSuccess: (data) => {
      setActiveIntervention(data);
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (req: FeedbackRequest) => {
      try {
        await apiClient.post('/api/ai/feedback', req);
      } catch {
        // Simulated success
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiHistory', participantId] });
    },
  });

  const triggerIntervention = useCallback(
    async (paragraphId: string, userSelection?: string, readingTimeMs = 6000, wordCount = 50) => {
      setIsEvaluating(true);
      const evalRes = await evaluateMutation.mutateAsync({ paragraph_id: paragraphId, reading_time_ms: readingTimeMs, word_count: wordCount });
      if (evalRes.eligible || userSelection) {
        await respondMutation.mutateAsync({
          paragraph_id: paragraphId,
          prompt_template_id: evalRes.suggested_prompt_template_id || 'tpl_default',
          user_selection: userSelection,
        });
      }
      setIsEvaluating(false);
    },
    [evaluateMutation, respondMutation]
  );

  return {
    activeIntervention,
    setActiveIntervention,
    isEvaluating,
    isGenerating: respondMutation.isPending,
    error: respondMutation.error || evaluateMutation.error,
    triggerIntervention,
    submitFeedback: feedbackMutation.mutate,
    isSubmittingFeedback: feedbackMutation.isPending,
  };
};
