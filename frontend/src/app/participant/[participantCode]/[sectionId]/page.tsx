import React from 'react';
import { ReadingLayout } from '@/components/participant/ReadingLayout';

interface ParticipantSectionPageProps {
  params: {
    participantCode: string;
    sectionId: string;
  };
}

export default function ParticipantSectionPage({ params }: ParticipantSectionPageProps) {
  return <ReadingLayout participantCode={params.participantCode} initialSectionId={params.sectionId} />;
}
