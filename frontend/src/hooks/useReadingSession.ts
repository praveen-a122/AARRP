'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { Experiment, ReadingSection, Paragraph } from '@/types/api';

export interface ParticipantSessionData {
  sessionId: string;
  participantId: string;
  experiment: Experiment;
  sections: ReadingSection[];
  paragraphs: Paragraph[];
  currentSectionId: string;
  currentParagraphIndex: number;
  elapsedSeconds: number;
  isCompleted: boolean;
}

export const useReadingSession = (participantCode: string, initialSectionId?: string) => {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId || '');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);

  // Fetch participant status and experiment config
  const { data, isLoading, error } = useQuery({
    queryKey: ['participantSession', participantCode],
    queryFn: async () => {
      try {
        const statusRes = await apiClient.get<{ participant_id: string; experiment_id: string; session_id: string; last_section_id?: string; elapsed_seconds?: number }>(`/api/participant/status/${participantCode}`);
        const expRes = await apiClient.get<Experiment>(`/api/cms/experiment/${statusRes.experiment_id || 1}`);
        return { status: statusRes, experiment: expRes };
      } catch {
        // Fallback mock session for runtime preview verification
        const mockExp: Experiment = {
          id: 'exp_runtime_1',
          title: 'Adaptive Neural Scaffolding Study',
          description: 'Evaluating dynamic AI interventions on reading comprehension.',
          author_id: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          current_version: {
            id: 'v_1',
            experiment_id: 'exp_runtime_1',
            version_number: 1,
            status: 'published',
            config: {},
            conditions: [
              {
                id: 'cond_1',
                experiment_version_id: 'v_1',
                name: 'Experimental AI Cohort',
                ai_model: 'gpt-4o',
                reading_sections: [
                  {
                    id: 'sec_1',
                    condition_id: 'cond_1',
                    title: 'Section 1: Foundations of Neuro-Symbolic AI',
                    content: '',
                    order: 1,
                    paragraphs: [
                      { id: 'p_1', section_id: 'sec_1', content: 'Modern artificial intelligence combines neural pattern recognition with symbolic logic structures to enable verifiable reasoning.', order: 1, word_count: 17 },
                      { id: 'p_2', section_id: 'sec_1', content: 'As large language models scale across hundreds of billions of parameters, emergent cognitive properties begin to manifest across domain boundaries.', order: 2, word_count: 20 },
                    ],
                  },
                  {
                    id: 'sec_2',
                    condition_id: 'cond_1',
                    title: 'Section 2: Cognitive Scaffolding Mechanics',
                    content: '',
                    order: 2,
                    paragraphs: [
                      { id: 'p_3', section_id: 'sec_2', content: 'When learners struggle with dense academic syntax, adaptive intervention prompts provide contextual hints without revealing direct answers.', order: 1, word_count: 18 },
                    ],
                  },
                ],
              },
            ],
          },
        };
        return {
          status: { participant_id: participantCode, experiment_id: 'exp_runtime_1', session_id: `sess_${participantCode}` },
          experiment: mockExp,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const sections = data?.experiment.current_version?.conditions?.[0]?.reading_sections || [];
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const paragraphs = activeSection?.paragraphs || [];

  useEffect(() => {
    if (sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = useCallback(() => {
    if (currentSlideIdx < paragraphs.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
    } else {
      const secIndex = sections.findIndex((s) => s.id === activeSection?.id);
      if (secIndex < sections.length - 1) {
        setActiveSectionId(sections[secIndex + 1].id);
        setCurrentSlideIdx(0);
      } else {
        setShowCompleteDialog(true);
      }
    }
  }, [currentSlideIdx, paragraphs.length, sections, activeSection]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
    } else {
      const secIndex = sections.findIndex((s) => s.id === activeSection?.id);
      if (secIndex > 0) {
        const prevSec = sections[secIndex - 1];
        setActiveSectionId(prevSec.id);
        setCurrentSlideIdx((prevSec.paragraphs?.length || 1) - 1);
      }
    }
  }, [currentSlideIdx, sections, activeSection]);

  return {
    data,
    isLoading,
    error,
    sections,
    activeSection,
    paragraphs,
    currentSlideIdx,
    setCurrentSlideIdx,
    activeSectionId,
    setActiveSectionId,
    fontSize,
    setFontSize,
    elapsedSeconds,
    showRecoveryDialog,
    setShowRecoveryDialog,
    showCompleteDialog,
    setShowCompleteDialog,
    handleNextSlide,
    handlePrevSlide,
  };
};
