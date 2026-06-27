'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Badge } from '@/components/ui/Badge';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname() || '/admin';

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Breadcrumb Support */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="font-semibold text-slate-200">AARRP</span>
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <span className="text-slate-600">/</span>
            <span className={idx === segments.length - 1 ? 'text-white font-bold' : ''}>{seg}</span>
          </React.Fragment>
        ))}
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        {/* Notification placeholder */}
        <button
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User Identity */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">
              {user?.username || user?.email || 'Researcher Admin'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">
              {user?.role || 'Administrator'}
            </div>
          </div>
          <Badge variant="default">{user?.role || 'Admin'}</Badge>
        </div>

        {/* Quick Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-error hover:border-error/30 transition-colors focus:outline-none ml-1"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};
