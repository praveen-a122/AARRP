'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to permanently delete this resource? This action cannot be undone.',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape' && !isLoading) {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <Card className="max-w-md w-full border-error/40 bg-slate-900 shadow-2xl overflow-hidden animate-scale-up">
        <CardHeader className="bg-error/10 border-b border-error/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/20 text-error flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <CardTitle id="delete-dialog-title" className="text-lg font-bold text-white">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-error-light mt-0.5">
                Destructive Action Required
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-6 text-sm text-slate-300 leading-relaxed">
          {message}
        </CardContent>

        <CardFooter className="bg-slate-950/60 border-t border-slate-800 flex justify-end gap-3 py-4">
          <Button variant="outline" size="md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" size="md" onClick={onConfirm} isLoading={isLoading}>
            {isLoading ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
