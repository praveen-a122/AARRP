import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#0b0f19] text-slate-100">
      {/* Ambient background glow & grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold tracking-wider uppercase shadow-inner mx-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          Experimental Study Module v2.0
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Adaptive AI Reading <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Research Platform
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          State-of-the-art reading comprehension analytics powered by real-time telemetry tracking and dynamic AI scaffolding interventions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 max-w-3xl mx-auto">
          {/* Participant Card */}
          <Link
            href="/participant"
            className="group relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-start text-left border border-slate-800 hover:border-teal-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/15 hover:-translate-y-1.5"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
              Participant Study Portal
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Register your demographic profile, engage in vertical reading experiments, complete quick MCQs, and receive real-time AI vocabulary & summary scaffolding.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
              Enter Study Module →
            </div>
          </Link>

          {/* Researcher Card */}
          <Link
            href="/login"
            className="group relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-start text-left border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-1.5"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Researcher & Admin CMS
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Design study protocols, manage experimental cohorts, analyze live reading telemetry data, and export comprehensive research analytics.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Access Admin Console →
            </div>
          </Link>
        </div>

        <div className="pt-8 text-xs font-mono text-slate-500 flex items-center justify-center gap-6">
          <span>🔒 IRB & HIPAA Compliant Telemetry</span>
          <span>•</span>
          <span>⚡ Supabase Database Sync</span>
        </div>
      </div>
    </main>
  );
}
