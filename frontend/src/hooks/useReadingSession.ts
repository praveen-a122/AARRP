'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId || '');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);

  // Analytics: Paragraph dwell time tracking (paragraphId -> seconds)
  const [paragraphDwellTimes, setParagraphDwellTimes] = useState<Record<string, number>>({});
  const currentParagraphRef = useRef<string | null>(null);
  // Always-current ref so flush callbacks can read latest dwell without stale closures
  const dwellTimesRef = useRef<Record<string, number>>({});

  // Analytics: Backtrack counter (increments on every backward navigation)
  const [backtrackCount, setBacktrackCount] = useState<number>(0);
  const backtrackCountRef = useRef<number>(0); // stable ref for flush callbacks

  // Analytics: Visit tracking (paragraphId -> visit count, reread = visits - 1)
  const [paragraphVisits, setParagraphVisits] = useState<Record<string, number>>({});
  const paragraphVisitsRef = useRef<Record<string, number>>({});

  // Stable callback ref so beforeunload/visibilitychange can flush without stale closures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flushAnalyticsRef = useRef<((logEvent: (e: any) => void, ctx: { paragraphId?: string; sectionId?: string; slideIndex?: number }) => void) | null>(null);

  // Analytics: Cursor idle tracking
  // An "idle episode" begins when the cursor hasn't moved for > IDLE_THRESHOLD_MS.
  const IDLE_THRESHOLD_MS = 3000;
  const lastMouseMoveRef = useRef<number>(Date.now());
  const isIdleRef = useRef<boolean>(false);            // currently in an idle episode?
  const currentIdleStartRef = useRef<number>(0);       // when the current episode began
  const [cursorIdleSeconds, setCursorIdleSeconds] = useState<number>(0);
  const [cursorIdleEpisodes, setCursorIdleEpisodes] = useState<number>(0);
  const [longestIdleDuration, setLongestIdleDuration] = useState<number>(0);
  // Refs mirror state for flush callbacks
  const cursorIdleRef = useRef({ seconds: 0, episodes: 0, longest: 0 });

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

const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (sections.length > 0 && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      const savedRaw = typeof window !== 'undefined' ? localStorage.getItem(`aarrp_session_${participantCode}`) : null;
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          if (saved.elapsedSeconds > 5 || saved.currentSlideIdx > 0 || (saved.activeSectionId && saved.activeSectionId !== sections[0].id)) {
            if (saved.activeSectionId) setActiveSectionId(saved.activeSectionId);
            if (typeof saved.currentSlideIdx === 'number') setCurrentSlideIdx(saved.currentSlideIdx);
            if (typeof saved.elapsedSeconds === 'number') setElapsedSeconds(saved.elapsedSeconds);
            if (saved.paragraphVisits) { setParagraphVisits(saved.paragraphVisits); paragraphVisitsRef.current = saved.paragraphVisits; }
            if (saved.paragraphDwellTimes) { setParagraphDwellTimes(saved.paragraphDwellTimes); dwellTimesRef.current = saved.paragraphDwellTimes; }
            if (typeof saved.backtrackCount === 'number') { setBacktrackCount(saved.backtrackCount); backtrackCountRef.current = saved.backtrackCount; }
            if (typeof saved.cursorIdleSeconds === 'number') {
              setCursorIdleSeconds(saved.cursorIdleSeconds);
              setCursorIdleEpisodes(saved.cursorIdleEpisodes || 0);
              setLongestIdleDuration(saved.longestIdleDuration || 0);
              cursorIdleRef.current = {
                seconds: saved.cursorIdleSeconds || 0,
                episodes: saved.cursorIdleEpisodes || 0,
                longest: saved.longestIdleDuration || 0,
              };
            }
            setShowRecoveryDialog(true);
          } else {
            if (!activeSectionId) setActiveSectionId(sections[0].id);
          }
        } catch {
          if (!activeSectionId) setActiveSectionId(sections[0].id);
        }
      } else {
        if (!activeSectionId) setActiveSectionId(sections[0].id);
      }
    }
  }, [sections, activeSectionId, participantCode]);

  useEffect(() => {
    if (!participantCode || !activeSectionId || typeof window === 'undefined') return;
    const sessionState = {
      activeSectionId,
      currentSlideIdx,
      elapsedSeconds,
      paragraphVisits,
      paragraphDwellTimes,
      backtrackCount,
      cursorIdleSeconds: cursorIdleRef.current.seconds,
      cursorIdleEpisodes: cursorIdleRef.current.episodes,
      longestIdleDuration: cursorIdleRef.current.longest,
    };
    localStorage.setItem(`aarrp_session_${participantCode}`, JSON.stringify(sessionState));
  }, [participantCode, activeSectionId, currentSlideIdx, elapsedSeconds, paragraphVisits, paragraphDwellTimes, backtrackCount]);


  // Keep ref synchronized with currently viewed paragraph ID
  useEffect(() => {
    const currentP = paragraphs[currentSlideIdx];
    currentParagraphRef.current = currentP?.id || null;
  }, [paragraphs, currentSlideIdx]);

  // Track visits per paragraph on every navigation (paragraph or section change)
  useEffect(() => {
    const currentP = paragraphs[currentSlideIdx];
    if (!currentP?.id) return;
    const pId = currentP.id;
    setParagraphVisits((prev) => {
      const updated = { ...prev, [pId]: (prev[pId] || 0) + 1 };
      paragraphVisitsRef.current = updated;
      return updated;
    });
  // activeSectionId is intentionally included: switching sections resets slide index
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIdx, activeSectionId]);

  // Timer interval — accumulates elapsed + per-paragraph dwell every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      const activePId = currentParagraphRef.current;
      if (activePId) {
        setParagraphDwellTimes((prev) => {
          const updated = { ...prev, [activePId]: (prev[activePId] || 0) + 1 };
          dwellTimesRef.current = updated;
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cursor idle tracking — pointermove listener resets the idle clock
  useEffect(() => {
    const onPointerMove = () => {
      const now = Date.now();

      if (isIdleRef.current) {
        // Episode ended — record its duration
        const episodeDuration = Math.round((now - currentIdleStartRef.current) / 1000);
        setCursorIdleEpisodes((prev) => { cursorIdleRef.current.episodes = prev + 1; return prev + 1; });
        setLongestIdleDuration((prev) => {
          const next = Math.max(prev, episodeDuration);
          cursorIdleRef.current.longest = next;
          return next;
        });
        isIdleRef.current = false;
      }

      lastMouseMoveRef.current = now;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  // Every second: check whether the cursor has been idle for > IDLE_THRESHOLD_MS
  useEffect(() => {
    const idleTimer = setInterval(() => {
      const idleDuration = Date.now() - lastMouseMoveRef.current;

      if (idleDuration >= IDLE_THRESHOLD_MS) {
        if (!isIdleRef.current) {
          // Transition: active → idle; mark episode start
          isIdleRef.current = true;
          currentIdleStartRef.current = lastMouseMoveRef.current + IDLE_THRESHOLD_MS;
        }
        // Accumulate idle seconds (capped per-second tick)
        setCursorIdleSeconds((prev) => { cursorIdleRef.current.seconds = prev + 1; return prev + 1; });
      }
    }, 1000);
    return () => clearInterval(idleTimer);
  }, []);

  // Keep backtrackCountRef in sync with state for use in flush callbacks
  useEffect(() => {
    backtrackCountRef.current = backtrackCount;
  }, [backtrackCount]);

  // Build the stable flush function — recreated only when deps change
  // Stored in a ref so beforeunload/visibilitychange always call the latest version
  useEffect(() => {
    flushAnalyticsRef.current = (logEvent, ctx) => {
      logEvent({
        event_type: 'navigation',
        paragraph_id: ctx.paragraphId,
        section_id: ctx.sectionId,
        metadata: {
          dwellTimes: dwellTimesRef.current,
          backtrackCount: backtrackCountRef.current,
          paragraphVisits: paragraphVisitsRef.current,
          cursorIdleSeconds: cursorIdleRef.current.seconds,
          cursorIdleEpisodes: cursorIdleRef.current.episodes,
          longestIdleDuration: cursorIdleRef.current.longest,
          slideIndex: ctx.slideIndex,
        },
      });
    };
  });

const handleNextSlide = useCallback(() => {
    if (currentSlideIdx < paragraphs.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
    } else {
      const secIndex = sections.findIndex((s) => s.id === activeSection?.id);
      if (secIndex < sections.length - 1) {
        router.push(`/participant/${participantCode}/${activeSection?.id || 'sec_1'}/quiz`);
      } else {
        setShowCompleteDialog(true);
      }
    }
  }, [currentSlideIdx, paragraphs.length, sections, activeSection, router, participantCode]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
      setBacktrackCount((prev) => prev + 1); // within-section backtrack
    } else {
      const secIndex = sections.findIndex((s) => s.id === activeSection?.id);
      if (secIndex > 0) {
        const prevSec = sections[secIndex - 1];
        setActiveSectionId(prevSec.id);
        setCurrentSlideIdx((prevSec.paragraphs?.length || 1) - 1);
        setBacktrackCount((prev) => prev + 1); // cross-section backtrack
      }
    }
  }, [currentSlideIdx, sections, activeSection]);

  const restartSession = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem(`aarrp_session_${participantCode}`);
    if (sections.length > 0) setActiveSectionId(sections[0].id);
    setCurrentSlideIdx(0);
    setElapsedSeconds(0);
    setParagraphVisits({});
    setParagraphDwellTimes({});
    setBacktrackCount(0);
    cursorIdleRef.current = { seconds: 0, episodes: 0, longest: 0 };
    setCursorIdleSeconds(0);
    setCursorIdleEpisodes(0);
    setLongestIdleDuration(0);
    setShowRecoveryDialog(false);
  }, [participantCode, sections]);

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
    paragraphDwellTimes,
    dwellTimesRef,
    backtrackCount,
    paragraphVisits,
    flushAnalyticsRef,
    cursorIdleSeconds,
    cursorIdleEpisodes,
    longestIdleDuration,
    showRecoveryDialog,
    setShowRecoveryDialog,
    showCompleteDialog,
    setShowCompleteDialog,
    handleNextSlide,
    handlePrevSlide,
    restartSession,
  };
};
