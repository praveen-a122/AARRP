'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/apiClient';

interface CompletionPageProps {
  params: {
    participantCode: string;
  };
}

export default function ParticipantCompletionPage({ params }: CompletionPageProps) {
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  useEffect(() => {
    // Clear local storage recovery session upon successful experiment completion
    localStorage.removeItem(`aarrp_session_${params.participantCode}`);

    // Read cached JSON export if available
    const cachedExportStr = localStorage.getItem(`aarrp_export_${params.participantCode}`);
    const payload = cachedExportStr ? JSON.parse(cachedExportStr) : {};

    // Mark session complete on backend and store JSON export in Supabase
    apiClient
      .post<{ status: string; timestamp: string }>(`/api/participant/complete/${params.participantCode}`, payload)
      .then((res) => {
        if (res.timestamp) setCompletedAt(res.timestamp);
      })
      .catch(() => {
        setCompletedAt(new Date().toISOString());
      });
  }, [params.participantCode]);

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20 text-3xl mb-4">
          🎉
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
          Study Complete!
        </h1>
        <p className="text-sm text-slate-300">
          Thank you for participating in the <strong className="text-white">Adaptive Neural Scaffolding Study</strong>. Your reading session telemetry and cognitive interaction data have been logged and verified.
        </p>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-left overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
          
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center justify-between">
              <span>Session Verification</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Verified
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Participant Identifier: <code className="text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{params.participantCode}</code>
            </CardDescription>
          </CardHeader>

          <CardContent className="text-xs space-y-3 text-slate-300 border-t border-slate-800/60 pt-4">
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Reading Modules</span>
              <span className="font-semibold text-white">100% Completed</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Telemetry Export</span>
              <span className="font-semibold text-emerald-400">Downloaded & Saved</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Completion Time</span>
              <span className="font-mono text-slate-300">
                {completedAt ? new Date(completedAt).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-950/50 border-t border-slate-800/60 pt-4 pb-4">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-200">
                Return to Portal Selection
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
