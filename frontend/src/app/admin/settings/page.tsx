'use client';

import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { UserManagement } from '@/components/admin/settings/UserManagement';
import { RolesPermissions } from '@/components/admin/settings/RolesPermissions';
import { AuditLogViewer } from '@/components/admin/settings/AuditLogViewer';
import { PromptLibrarySettings } from '@/components/admin/settings/PromptLibrarySettings';
import { AIProviderSettings } from '@/components/admin/settings/AIProviderSettings';
import { SystemConfiguration } from '@/components/admin/settings/SystemConfiguration';
import { ResearchConfiguration } from '@/components/admin/settings/ResearchConfiguration';
import { FeatureFlags } from '@/components/admin/settings/FeatureFlags';
import { BackupRestore } from '@/components/admin/settings/BackupRestore';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { Spinner } from '@/components/ui/Spinner';

export default function AdministrationSettingsPage() {
  const {
    activeTab,
    setActiveTab,
    users,
    auditLogs,
    featureFlags,
    config,
    isLoading,
    toggleFlag,
    updateConfig,
    isUpdating,
  } = useSystemSettings();

  const tabs = [
    { id: 'users', label: '👥 Team & RBAC' },
    { id: 'ai', label: '🤖 AI & Prompt Library' },
    { id: 'config', label: '⚙️ Research & Host Config' },
    { id: 'flags', label: '🚩 Feature Flags' },
    { id: 'security', label: '🔒 Security & Backups' },
    { id: 'audit', label: '📜 Audit Logs' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Administration & Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configure researcher RBAC policies, AI generation thresholds, and host platform governance
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Environment: {config.environment.toUpperCase()}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 text-slate-400">
            <Spinner size="lg" />
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
              Loading Administrative Governance Parameters...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'users' && (
              <>
                <UserManagement users={users} />
                <RolesPermissions />
              </>
            )}

            {activeTab === 'ai' && (
              <>
                <AIProviderSettings />
                <PromptLibrarySettings />
              </>
            )}

            {activeTab === 'config' && (
              <>
                <ResearchConfiguration config={config} onUpdate={updateConfig} />
                <SystemConfiguration config={config} onUpdate={updateConfig} isUpdating={isUpdating} />
              </>
            )}

            {activeTab === 'flags' && <FeatureFlags flags={featureFlags} onToggle={(key, current) => toggleFlag({ key, enabled: !current })} />}

            {activeTab === 'security' && (
              <>
                <SecuritySettings />
                <BackupRestore />
              </>
            )}

            {activeTab === 'audit' && <AuditLogViewer logs={auditLogs} />}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
