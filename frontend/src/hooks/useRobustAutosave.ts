'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface UseRobustAutosaveOptions<TData, TResult> {
  data: TData;
  onSave: (data: TData) => Promise<TResult>;
  queryKeyToInvalidate?: unknown[];
  intervalMs?: number;
  enabled?: boolean;
}

export function useRobustAutosave<TData, TResult>({
  data,
  onSave,
  queryKeyToInvalidate,
  intervalMs = 3000,
  enabled = true,
}: UseRobustAutosaveOptions<TData, TResult>) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const queryClient = useQueryClient();
  const latestDataRef = useRef<TData>(data);
  const lastSavedDataRef = useRef<string>(JSON.stringify(data));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  const mutation = useMutation<TResult, Error, TData>({
    mutationFn: onSave,
    retry: 2,
    onMutate: () => {
      setStatus('saving');
    },
    onSuccess: (result) => {
      setStatus('saved');
      lastSavedDataRef.current = JSON.stringify(latestDataRef.current);
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
      return result;
    },
    onError: () => {
      setStatus('error');
    },
  });

  const triggerSave = useCallback(() => {
    const currentString = JSON.stringify(latestDataRef.current);
    if (currentString !== lastSavedDataRef.current && !mutation.isPending) {
      mutation.mutate(latestDataRef.current);
    }
  }, [mutation]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const currentString = JSON.stringify(data);
    if (currentString !== lastSavedDataRef.current) {
      setStatus('idle');
      timeoutRef.current = setTimeout(() => {
        triggerSave();
      }, intervalMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, intervalMs, triggerSave]);

  return {
    status,
    isSaving: status === 'saving' || mutation.isPending,
    isError: status === 'error',
    forceSave: triggerSave,
  };
}
