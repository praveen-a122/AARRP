'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ParticipantPortalPage() {
  const router = useRouter();
  const [participantCode, setParticipantCode] = useState('rc2-demo');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantCode.trim()) return;
    setIsLoading(true);
    router.push(`/participant/${participantCode.trim()}`);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portal Selection
          </Link>
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            AARRP Research Platform
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Participant Portal
          </h1>
          <p className="text-sm text-slate-400">
            Enter your assigned participant code to begin or resume your adaptive reading comprehension module.
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-lg text-white">Experimental Cohort Access</CardTitle>
            <CardDescription className="text-slate-400">
              Your session progress, dwell metrics, and comprehension responses are saved automatically.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Participant Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="e.g. rc2-demo or P00001"
                  value={participantCode}
                  onChange={(e) => setParticipantCode(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 text-base py-6"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  Tip: Use <code className="text-indigo-400">rc2-demo</code> for validation verification.
                </p>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isLoading || !participantCode.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-6 shadow-lg shadow-indigo-600/20 transition-all duration-200"
              >
                {isLoading ? 'Loading Study Module...' : 'Enter Reading Study →'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-950/50 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 py-4">
            <span>Secure Telemetry Enabled</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
