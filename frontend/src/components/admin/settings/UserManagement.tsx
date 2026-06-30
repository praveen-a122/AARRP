import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { AdminUserItem } from '@/hooks/useSystemSettings';

export interface UserManagementProps {
  users: AdminUserItem[];
  onCreateAdmin: (data: any) => Promise<any>;
  onDeleteAdmin: (adminId: number) => Promise<any>;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onCreateAdmin, onDeleteAdmin }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('System Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (adminId: number) => {
    if (confirm("Are you sure you want to remove this administrator's access to the system?")) {
      try {
        await onDeleteAdmin(adminId);
        alert("Administrator removed successfully.");
      } catch (err: any) {
        alert(err.detail || `Failed to delete admin: ${err}`);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      alert("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreateAdmin({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      alert("Administrator created successfully.");
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setShowAddForm(false);
    } catch (err: any) {
      alert(err.detail || `Failed to create admin: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<AdminUserItem>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
      sortable: true,
      cell: (row) => (
        <div>
          <strong className="text-white block text-xs">{row.username || row.name}</strong>
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
      cell: (row) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.admin_id || Number(row.id))}
          className="text-[11px] h-auto py-1 px-2.5 bg-red-950/40 hover:bg-red-900 border-red-500/30 font-mono"
        >
          🗑️ Delete
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
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary-dark text-xs font-bold self-start sm:self-auto"
        >
          {showAddForm ? 'Close Form' : '+ Create Administrator'}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-4 max-w-lg animate-fade-in">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Create New Admin Account</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Username</label>
              <Input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. jdoe"
                className="bg-slate-900 border-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Address</label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. john@aarrp.org"
                className="bg-slate-900 border-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Password</label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-900 border-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Access Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono h-[36px]"
              >
                <option value="System Admin">System Admin</option>
                <option value="Principal Investigator">Principal Investigator</option>
                <option value="Research Associate">Research Associate</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-xs font-mono"
            >
              {isSubmitting ? 'Creating...' : 'Save Account'}
            </Button>
          </div>
        </form>
      )}

      <DataTable data={users} columns={columns} />
    </Card>
  );
};
