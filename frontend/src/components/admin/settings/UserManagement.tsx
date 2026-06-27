'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { AdminUserItem } from '@/hooks/useSystemSettings';

export interface UserManagementProps {
  users: AdminUserItem[];
}

export const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const columns: Column<AdminUserItem>[] = [
    {
      accessorKey: 'name',
      header: 'Researcher Name',
      sortable: true,
      cell: (row) => (
        <div>
          <strong className="text-white block text-xs">{row.name}</strong>
          <span className="text-[11px] font-mono text-slate-400">{row.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Access Role',
      sortable: true,
      cell: (row) => {
        const color =
          row.role === 'Principal Investigator'
            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            : row.role === 'System Admin'
            ? 'bg-primary/10 text-primary-light border-primary/30'
            : 'bg-slate-800 text-slate-300 border-slate-700';
        return <span className={`px-2.5 py-1 rounded-full border font-mono text-[10px] ${color}`}>{row.role}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) =>
        row.status === 'active' ? (
          <Badge variant="success" className="text-[10px]">Active</Badge>
        ) : (
          <Badge variant="error" className="text-[10px]">Suspended</Badge>
        ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Active',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.lastLogin}</span>,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: () => (
        <Button variant="outline" size="sm" onClick={() => alert('Opening Role & Permission editor modal')} className="text-[11px] h-auto py-1">
          ⚙️ Edit Access
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Research Team Access Roster
          </h3>
          <p className="text-xs text-slate-400">Manage principal investigators, research associates, and RBAC policies</p>
        </div>
        <Button onClick={() => alert('Opening Invite New Researcher dialog')} className="bg-primary hover:bg-primary-dark text-xs font-bold self-start sm:self-auto">
          + Invite Researcher
        </Button>
      </div>

      <DataTable data={users} columns={columns} />
    </Card>
  );
};
