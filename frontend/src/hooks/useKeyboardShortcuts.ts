'use client';

import { useEffect } from 'react';

export interface KeyboardShortcutCallbacks {
  onSave?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (callbacks: KeyboardShortcutCallbacks) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape
      if (event.key === 'Escape' && callbacks.onEscape) {
        event.preventDefault();
        callbacks.onEscape();
        return;
      }

      // Check Ctrl or Meta (Command on Mac)
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;

      if (isCtrlOrMeta) {
        // Ctrl+S (Save)
        if (event.key.toLowerCase() === 's' && callbacks.onSave) {
          event.preventDefault();
          callbacks.onSave();
          return;
        }

        // Ctrl+D (Duplicate)
        if (event.key.toLowerCase() === 'd' && callbacks.onDuplicate) {
          event.preventDefault();
          callbacks.onDuplicate();
          return;
        }

        // Ctrl+Delete or Ctrl+Backspace
        if ((event.key === 'Delete' || event.key === 'Backspace') && callbacks.onDelete) {
          event.preventDefault();
          callbacks.onDelete();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks]);
};
