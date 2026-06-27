import React from 'react';
import { ReadingLayout } from '@/components/participant/ReadingLayout';

interface ParticipantPageProps {
  params: {
    participantCode: string;
  };
}

export default function ParticipantReadingPage({ params }: ParticipantPageProps) {
  return <ReadingLayout participantCode={params.participantCode} />;
}
