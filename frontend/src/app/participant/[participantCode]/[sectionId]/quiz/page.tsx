import React from 'react';
import { QuizRuntime } from '@/components/participant/QuizRuntime';

interface ParticipantQuizPageProps {
  params: {
    participantCode: string;
    sectionId: string;
  };
}

export default function ParticipantQuizPage({ params }: ParticipantQuizPageProps) {
  return <QuizRuntime sessionId={`sess_${params.participantCode}`} sectionId={params.sectionId} />;
}
