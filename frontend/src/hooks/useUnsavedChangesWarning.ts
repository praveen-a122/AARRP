'use client';

import { useEffect } from 'react';

export interface UseUnsavedChangesWarningOptions {
  isDirty: boolean;
  message?: string;
}

export const useUnsavedChangesWarning = ({
  isDirty,
  message = 'You have unsaved changes. Are you sure you want to leave?',
}: UseUnsavedChangesWarningOptions) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
};
