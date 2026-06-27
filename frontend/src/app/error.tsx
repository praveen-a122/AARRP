'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

interface ErrorBoundaryProps {
  error: Error & { digest?: string; correlationId?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  const correlationId = error.digest || error.correlationId;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-error/30 shadow-2xl">
        <CardHeader className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <CardTitle className="text-xl text-white font-extrabold tracking-tight">
            Something went wrong
          </CardTitle>
          <CardDescription>
            An unexpected runtime error occurred while processing your request.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono break-words">
            {error.message || 'Unknown runtime error occurred.'}
          </div>

          {correlationId && (
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
              <span className="font-semibold uppercase tracking-wider">Correlation ID:</span>
              <span className="font-mono text-slate-400 select-all">{correlationId}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={() => reset()}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
