import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/admin/DashboardLayout';

export const metadata: Metadata = {
  title: 'Admin Portal | AARRP Experiment CMS',
  description: 'Manage reading cohorts, configure adaptive AI prompts, and analyze real-time intervention metrics.',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
