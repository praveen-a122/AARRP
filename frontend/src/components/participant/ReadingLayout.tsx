'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingSession } from '@/hooks/useReadingSession';
import { ReadingHeader } from '@/components/participant/ReadingHeader';
import { ReadingProgress } from '@/components/participant/ReadingProgress';
import { SectionNavigator } from '@/components/participant/SectionNavigator';
import { SlideRenderer } from '@/components/participant/SlideRenderer';
import { ReadingControls } from '@/components/participant/ReadingControls';
import { SessionRecoveryDialog } from '@/components/participant/SessionRecoveryDialog';
import { ReadingCompleteDialog } from '@/components/participant/ReadingCompleteDialog';
import { TelemetryProvider, useTelemetry } from '@/components/providers/TelemetryProvider';
import { AIInterventionManager } from '@/components/participant/AIInterventionManager';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/apiClient';
import type { Paragraph } from '@/types/api';

export interface ReadingLayoutProps {
  participantCode: string;
  initialSectionId?: string;
}

// ─── Inner component ────────────────────────────────────────────────────────
// Separated so it can safely call useTelemetry(), which requires
// being rendered *inside* <TelemetryProvider>.
const ReadingLayoutInner: React.FC<ReadingLayoutProps> = ({ participantCode, initialSectionId }) => {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    sections,
    activeSection,
    paragraphs,
    currentSlideIdx,
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
  } = useReadingSession(participantCode, initialSectionId);

  // AI scaffolding modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetText, setAiTargetText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const { logEvent } = useTelemetry();

  // Prevent the initial mount from being logged as a navigation event
  const firstRender = useRef(true);

  // Flush dwell + backtrack + visit analytics to backend on every slide/section transition.
  // Uses ref values (always-current) so the closure never reads stale state.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const currentP = paragraphs[currentSlideIdx];
    if (!currentP) return;

    flushAnalyticsRef.current?.(logEvent, {
      paragraphId: currentP.id,
      sectionId: activeSectionId,
      slideIndex: currentSlideIdx,
    });
  // logEvent and refs are stable; only re-run on actual navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIdx, activeSectionId]);

  // Flush on tab hide or browser close — captures the last dwell seconds
  // even if the participant never pressed Next.
  useEffect(() => {
    const flushOnHide = () => {
      const currentP = paragraphs[currentSlideIdx];
      flushAnalyticsRef.current?.(logEvent, {
        paragraphId: currentP?.id,
        sectionId: activeSectionId,
        slideIndex: currentSlideIdx,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushOnHide();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', flushOnHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', flushOnHide);
    };
  // Re-attach whenever the active paragraph/section changes so flushOnHide
  // always captures the right context without a stale closure.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIdx, activeSectionId]);

  // Derived: reread count per paragraph (total visits minus the first)
  const paragraphRereadCounts = Object.fromEntries(
    Object.entries(paragraphVisits).map(([id, visits]) => [id, Math.max(0, visits - 1)])
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400 space-y-4">
        <Spinner size="lg" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
          Initializing Adaptive Reading Environment...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-slate-900 border-error/40 text-center space-y-4">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-bold text-white">Failed to Load Session</h2>
          <p className="text-xs text-slate-400">
            We encountered an issue loading experimental reading configuration for participant{' '}
            <code className="text-white bg-slate-950 px-2 py-0.5 rounded">{participantCode}</code>.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()} className="w-full text-xs">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  const expTitle = data.experiment.title || 'Adaptive AI Reading Research';
  const secIndex = sections.findIndex((s) => s.id === activeSection?.id);

  const handleRequestAIHelp = async (paragraph: Paragraph, queryText?: string) => {
    setAiTargetText(queryText || paragraph.content);
    setAiResponse('');
    setAiModalOpen(true);
    setAiLoading(true);

    // Build a telemetry snapshot for THIS paragraph only
    const pid = paragraph.id || '';
    const telemetrySnapshot = {
      dwell_seconds:        dwellTimesRef.current[pid]         ?? null,
      visit_count:          paragraphVisits[pid]               ?? null,
      backtrack_count:      backtrackCount,
      cursor_idle_seconds:  cursorIdleSeconds,
      cursor_idle_episodes: cursorIdleEpisodes,
      longest_idle_s:       longestIdleDuration,
      word_count:           paragraph.word_count               ?? null,
    };

    try {
      const res = await apiClient.post<{ response_text: string }>('/api/ai/respond', {
        session_id:     1,           // resolved from real session once auth is wired
        participant_id: 1,
        paragraph_id:   pid,
        context:        queryText || paragraph.content,
        telemetry:      telemetrySnapshot,
      });
      setAiResponse(res.response_text);
    } catch {
      // Graceful degradation: show a static fallback hint
      setAiResponse(
        queryText
          ? `Hint for "${queryText}": Consider how this concept connects to what you've read before. Focus on the key relationship described.`
          : `This paragraph introduces a key mechanism. Pay attention to how its components interact with each other.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary/30 selection:text-white">
      {/* Top Header */}
      <ReadingHeader
        experimentTitle={expTitle}
        sectionTitle={activeSection?.title || 'General Module'}
        sectionIndex={Math.max(0, secIndex)}
        totalSections={Math.max(1, sections.length)}
        elapsedSeconds={elapsedSeconds}
        onExit={() => router.push('/login')}
      />

      {/* Progress Bar */}
      <ReadingProgress
        currentSlideIndex={currentSlideIdx}
        totalSlidesInSection={Math.max(1, paragraphs.length)}
        currentSectionIndex={Math.max(0, secIndex)}
        totalSections={Math.max(1, sections.length)}
        totalWordCount={650}
        wordsRead={Math.min(650, (currentSlideIdx + 1) * 85)}
      />

      {/* Section Tabs Navigator */}
      <SectionNavigator
        sections={sections}
        activeSectionId={activeSectionId}
        maxUnlockedOrder={sections.length} // unlocked for demo verification
        onSelectSection={(id) => {
          setActiveSectionId(id);
          router.push(`/participant/${participantCode}/${id}`);
        }}
      />

      {/* Main Slide Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 flex flex-col justify-center max-w-5xl mx-auto w-full">
        <SlideRenderer
          paragraphs={paragraphs}
          currentSlideIndex={currentSlideIdx}
          fontSize={fontSize}
          onRequestAIHelp={handleRequestAIHelp}
        />
      </main>

      {/* Sticky Controls Footer */}
      <ReadingControls
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
        isFirstSlide={currentSlideIdx === 0 && secIndex <= 0}
        isLastSlide={currentSlideIdx === paragraphs.length - 1}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onExit={() => router.push('/participant')}
      />

      {/* AI Intervention Scaffolding Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-6 sm:p-8 bg-slate-900 border-primary/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-base font-bold text-white">AI Cognitive Scaffolding</h3>
              </div>
              <button type="button" onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300 max-h-32 overflow-y-auto">
              <span className="text-slate-500 block text-[10px] uppercase mb-1">Target Context</span>
              &quot;{aiTargetText}&quot;
            </div>

            <div className="min-h-[80px] flex items-center justify-center">
              {aiLoading ? (
                <div className="flex items-center gap-3 text-xs text-primary-light font-mono animate-pulse">
                  <Spinner size="sm" /> Generating adaptive cognitive scaffolding...
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-100 leading-relaxed font-sans">
                  {aiResponse}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="default" size="sm" onClick={() => setAiModalOpen(false)} className="text-xs bg-primary hover:bg-primary-dark">
                Got It, Resume Reading
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Session Recovery Dialog */}
      <SessionRecoveryDialog
        isOpen={showRecoveryDialog}
        lastSectionTitle={activeSection?.title}
        elapsedSeconds={elapsedSeconds}
        onResume={() => setShowRecoveryDialog(false)}
        onRestart={restartSession}
      />

      {/* Reading Complete Dialog */}
      <ReadingCompleteDialog
        isOpen={showCompleteDialog}
        experimentTitle={expTitle}
        totalElapsedSeconds={elapsedSeconds}
        onContinueToAssessment={() => {
          setShowCompleteDialog(false);
          router.push(`/participant/${participantCode}/${activeSection?.id || 'sec_1'}/quiz`);
        }}
        onReturnHome={() => router.push('/participant')}
      />

      <AIInterventionManager participantId={participantCode} sessionId={`sess_${participantCode}`} />
    </div>
  );
};

// ─── Public export ───────────────────────────────────────────────────────────
// Thin shell: owns TelemetryProvider so ReadingLayoutInner can call useTelemetry()
export const ReadingLayout: React.FC<ReadingLayoutProps> = (props) => (
  <TelemetryProvider>
    <ReadingLayoutInner {...props} />
  </TelemetryProvider>
);
