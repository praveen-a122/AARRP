import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | AARRP Research Portal',
  description: 'Authenticate to access the AARRP Experiment CMS and real-time comprehension analytics dashboard.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-background">
      {/* Background radial gradients for ambient glassmorphism lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Researcher Sign In
          </h1>
          <p className="text-sm text-slate-400">
            Enter your administrative credentials to manage reading cohorts and experimental configurations.
          </p>
        </div>

        <Card className="border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-accent" />
          
          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-lg">Account Authentication</CardTitle>
            <CardDescription>
              Protected session via secure HttpOnly proxying.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <LoginForm />
          </CardContent>

          <CardFooter className="bg-slate-950/40 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 py-4 gap-2">
            <span>AARRP Version 2.0</span>
            <span>Security & Compliance Active</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
