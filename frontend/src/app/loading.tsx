import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 min-h-screen w-full bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-50">
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner size="lg" label="Loading application content..." />
        <p className="text-sm font-medium text-slate-400 animate-pulse">
          Loading platform resources...
        </p>
      </div>
    </div>
  );
}
