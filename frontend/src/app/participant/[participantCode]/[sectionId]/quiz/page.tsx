'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QuizRuntime } from '@/components/participant/QuizRuntime';
import { useReadingSession } from '@/hooks/useReadingSession';

interface ParticipantQuizPageProps {
  params: {
    participantCode: string;
    sectionId: string;
  };
}

export default function ParticipantQuizPage({ params }: ParticipantQuizPageProps) {
  const router = useRouter();
  const { sections } = useReadingSession(params.participantCode);

  const handleComplete = () => {
    const secIndex = sections.findIndex((s) => s.id === params.sectionId);
    if (secIndex >= 0 && secIndex < sections.length - 1) {
      const nextSec = sections[secIndex + 1];
      router.push(`/participant/${params.participantCode}/${nextSec.id}`);
    } else {
      router.push(`/participant/${params.participantCode}/complete`);
    }
  };

  return (
    <QuizRuntime
      sessionId={params.participantCode}
      sectionId={params.sectionId}
      onComplete={handleComplete}
    />
  );
}
