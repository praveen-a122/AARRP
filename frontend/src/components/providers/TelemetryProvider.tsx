'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

export interface TelemetryEvent {
  event_type: 'click' | 'scroll' | 'pause' | 'highlight' | 'navigation';
  participant_id?: string;
  session_id?: string;
  section_id?: string;
  paragraph_id?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface TelemetryContextType {
  logEvent: (event: Omit<TelemetryEvent, 'timestamp'>) => void;
  setSessionContext: (participantId: string, sessionId: string, sectionId?: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType>({
  logEvent: () => {},
  setSessionContext: () => {},
});

export const useTelemetry = () => useContext(TelemetryContext);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextRef = useRef<{ participantId?: string; sessionId?: string; sectionId?: string }>({});
  const bufferRef = useRef<TelemetryEvent[]>([]);

  const flushTelemetry = useCallback(async () => {
    if (bufferRef.current.length === 0) return;
    const eventsToSend = [...bufferRef.current];
    bufferRef.current = [];
    try {
      await apiClient.post('/api/analytics/telemetry/batch', { events: eventsToSend });
    } catch {
      // Silently discard or queue if offline
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(flushTelemetry, 10000); // Flush every 10s
    return () => clearInterval(interval);
  }, [flushTelemetry]);

  const logEvent = useCallback((event: Omit<TelemetryEvent, 'timestamp'>) => {
    const fullEvent: TelemetryEvent = {
      ...event,
      participant_id: event.participant_id || contextRef.current.participantId,
      session_id: event.session_id || contextRef.current.sessionId,
      section_id: event.section_id || contextRef.current.sectionId,
      timestamp: new Date().toISOString(),
    };
    bufferRef.current.push(fullEvent);
    if (bufferRef.current.length >= 20) {
      flushTelemetry();
    }
  }, [flushTelemetry]);

  const setSessionContext = useCallback((participantId: string, sessionId: string, sectionId?: string) => {
    contextRef.current = { participantId, sessionId, sectionId };
  }, []);

  return (
    <TelemetryContext.Provider value={{ logEvent, setSessionContext }}>
      {children}
    </TelemetryContext.Provider>
  );
};
