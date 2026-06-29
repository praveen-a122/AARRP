'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingSession } from '@/hooks/useReadingSession';
import { ReadingHeader } from '@/components/participant/ReadingHeader';
import { SectionNavigator } from '@/components/participant/SectionNavigator';
import { SessionRecoveryDialog } from '@/components/participant/SessionRecoveryDialog';
import { ReadingCompleteDialog } from '@/components/participant/ReadingCompleteDialog';
import { TelemetryProvider, useTelemetry } from '@/components/providers/TelemetryProvider';
import { AIInterventionManager } from '@/components/participant/AIInterventionManager';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReadingInstructionsModal } from '@/components/participant/ReadingInstructionsModal';
import { VerticalParagraphCard } from '@/components/participant/VerticalParagraphCard';

export interface ReadingLayoutProps {
  participantCode: string;
  initialSectionId?: string;
}

const ReadingLayoutInner: React.FC<ReadingLayoutProps> = ({ participantCode, initialSectionId }) => {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    sections,
    activeSection,
    paragraphs,
    activeSectionId,
    setActiveSectionId,
    fontSize,
    elapsedSeconds,
    showRecoveryDialog,
    setShowRecoveryDialog,
    showCompleteDialog,
    setShowCompleteDialog,
    restartSession,
    // Vertical layout & v1 parity telemetry exports
    activeParaId,
    paraStats,
    interventionLog,
    setInterventionLog,
    computeFeatures,
    logEvent,
  } = useReadingSession(participantCode, initialSectionId);

  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [diffRatings, setDiffRatings] = useState<Record<string, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const { logEvent: telemetryLogEvent } = useTelemetry();

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

  const expTitle = data.experiment.title || 'Smart Reading Tracker — Dynamic Session';
  const secIndex = sections.findIndex((s) => s.id === activeSection?.id);

  // Check form validation (all paragraphs must have both difficulty rating and MCQ answered)
  const allAnswered = paragraphs.length > 0 && paragraphs.every(p => {
    return diffRatings[p.id] !== undefined && quizAnswers[p.id] !== undefined;
  });

  const handleFinishAndDownload = () => {
    // Validate AI intervention feedback
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const log = interventionLog[p.id];
      if (log && log.accepted === null && log.arm !== 'control') {
        alert(`Please provide feedback on the AI help banner for Paragraph #${i + 1} before finishing!`);
        document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    logEvent('session_completed', {
      diffRatings,
      quizAnswers,
      elapsedSeconds,
    });
    setShowCompleteDialog(true);
  };

  // Active paragraph telemetry metrics for status bar
  const currentPIndex = paragraphs.findIndex(p => p.id === activeParaId);
  const displayPNum = currentPIndex >= 0 ? `P${currentPIndex + 1}` : '—';
  const activeStats = activeParaId ? paraStats[activeParaId] : null;
  const activeFeatures = activeParaId ? computeFeatures(activeParaId) : { dwellSec: 0, score: 0 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white pb-32">
      {/* Instructions Modal */}
      <ReadingInstructionsModal
        isOpen={instructionsOpen}
        onStart={() => {
          setInstructionsOpen(false);
          logEvent('session_started');
        }}
      />

      {/* Top Header */}
      <ReadingHeader
        experimentTitle={expTitle}
        sectionTitle={activeSection?.title || 'General Module'}
        sectionIndex={Math.max(0, secIndex)}
        totalSections={Math.max(1, sections.length)}
        elapsedSeconds={elapsedSeconds}
        onExit={() => router.push('/login')}
      />

      {/* Section Tabs Navigator */}
      <SectionNavigator
        sections={sections}
        activeSectionId={activeSectionId}
        maxUnlockedOrder={sections.length}
        onSelectSection={(id) => {
          setActiveSectionId(id);
          router.push(`/participant/${participantCode}/${id}`);
        }}
      />

      {/* Main Vertical Scrolling Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full">
        {/* Important rule guidance banner matching v1 */}
        <div className="mb-8 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 border-l-4 border-l-indigo-500 flex items-start gap-3 text-sm text-indigo-200">
          <span className="text-lg">💡</span>
          <div>
            <strong className="text-white">Important Reading Rule:</strong> Please use your mouse cursor as a visual pointer/guide to track words across the screen as you read. This lets our background adapter accurately monitor your reading flow!
          </div>
        </div>

        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <VerticalParagraphCard
              key={p.id}
              paragraph={p}
              index={i}
              totalCount={paragraphs.length}
              isActive={activeParaId === p.id}
              fontSize={fontSize}
              diffRating={diffRatings[p.id]}
              onDiffChange={(val) => setDiffRatings(prev => ({ ...prev, [p.id]: val }))}
              quizAnswer={quizAnswers[p.id]}
              onQuizChange={(val) => setQuizAnswers(prev => ({ ...prev, [p.id]: val }))}
              intervention={interventionLog[p.id]}
              onInterventionFeedback={(helpful) => {
                setInterventionLog(prev => {
                  const cur = prev[p.id];
                  if (!cur) return prev;
                  return { ...prev, [p.id]: { ...cur, accepted: helpful } };
                });
                logEvent('intervention_feedback', { paragraph_id: p.id, helpful });
              }}
            />
          ))}
        </div>
      </main>
      {/* Fixed Bottom Status Panel matching v1 */}
      <div id="status-panel" className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t-2 border-indigo-500 px-6 py-3.5 flex flex-wrap items-center justify-between gap-6 z-40 shadow-2xl">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Current Paragraph</span>
            <span className="text-base font-extrabold text-white font-mono">{displayPNum}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Dwell Time (s)</span>
            <span className="text-base font-extrabold text-indigo-400 font-mono">{activeFeatures.dwellSec.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Reread Count</span>
            <span className="text-base font-extrabold text-purple-400 font-mono">{activeStats?.rereadCount || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Struggle Score</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">{activeFeatures.score.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="button"
          disabled={!allAnswered}
          onClick={handleFinishAndDownload}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ml-auto ${
            allAnswered
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed'
          }`}
        >
          Finish & Download Data
        </Button>
      </div>

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

export const ReadingLayout: React.FC<ReadingLayoutProps> = (props) => (
  <TelemetryProvider>
    <ReadingLayoutInner {...props} />
  </TelemetryProvider>
);
