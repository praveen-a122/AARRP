import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-background text-center">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-primary font-mono font-extrabold text-3xl mb-2">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mx-auto">
          The requested experiment resource or dashboard route could not be found. It may have been moved, archived, or requires different access permissions.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="default" size="lg">
              Return to Portal
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
