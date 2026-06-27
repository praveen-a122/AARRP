'use client';

import React, { useState } from 'react';
import { useAIIntervention } from '@/hooks/useAIIntervention';
import { AIInterventionCard } from '@/components/participant/AIInterventionCard';
import { AIInterventionModal } from '@/components/participant/AIInterventionModal';

export interface AIInterventionManagerProps {
  participantId: string;
  sessionId: string;
}

export const AIInterventionManager: React.FC<AIInterventionManagerProps> = ({ participantId, sessionId }) => {
  const { activeIntervention, setActiveIntervention, isGenerating, triggerIntervention, submitFeedback } =
    useAIIntervention(participantId, sessionId);

  const [modalOpen, setModalOpen] = useState(false);

  if (!activeIntervention) return null;

  const handleFeedback = (interventionId: string, helpful: boolean, comment?: string) => {
    submitFeedback({ intervention_id: interventionId, helpful, comment });
  };

  const handleFollowUp = async (queryText: string) => {
    await triggerIntervention('p_current', queryText);
  };

  return (
    <>
      {/* Floating Card Overlay */}
      {!modalOpen && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 animate-bounce-in max-w-sm w-full">
          <AIInterventionCard
            intervention={activeIntervention}
            onClose={() => setActiveIntervention(null)}
            onExpand={() => setModalOpen(true)}
            onFeedback={handleFeedback}
          />
        </div>
      )}

      {/* Expanded Modal Dialogue */}
      <AIInterventionModal
        isOpen={modalOpen}
        intervention={activeIntervention}
        onClose={() => {
          setModalOpen(false);
          setActiveIntervention(null);
        }}
        onRequestFollowUp={handleFollowUp}
        isGenerating={isGenerating}
      />
    </>
  );
};
