'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Spinner } from '@/components/ui/Spinner';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
        <Spinner size="lg" label="Verifying researcher authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // AuthProvider or redirect handles navigation
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
