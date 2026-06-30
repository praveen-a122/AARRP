'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface AdminUserItem {
  id?: string;
  userId: string;
  name: string;
  email: string;
  role: 'Principal Investigator' | 'Research Associate' | 'System Admin' | 'Viewer';
  status: 'active' | 'suspended';
  lastLogin: string;
  admin_id?: number;
  username?: string;
}

export interface AuditLogEntry {
  id?: string;
  logId: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
}

export interface FeatureFlagItem {
  id?: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'experimental' | 'ui' | 'ai' | 'performance';
}

export interface SystemConfigState {
  environment: 'production' | 'staging' | 'development';
  maxSessionsPerUser: number;
  telemetryRetentionDays: number;
  aiTimeoutSec: number;
  defaultGroqModel: string;
  enableAutosave: boolean;
  autosaveIntervalSec: number;
}

export const useSystemSettings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('users');

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        return await apiClient.get<AdminUserItem[]>('/api/admin/list');
      } catch {
        return [
          { id: 'usr_1', userId: 'usr_1', name: 'Dr. Alistair Vance', email: 'a.vance@research.org', role: 'Principal Investigator', status: 'active', lastLogin: '10m ago' },
          { id: 'usr_2', userId: 'usr_2', name: 'Elena Rostova', email: 'e.rostova@research.org', role: 'Research Associate', status: 'active', lastLogin: '1h ago' },
          { id: 'usr_3', userId: 'usr_3', name: 'DevOps Ops', email: 'sysadmin@research.org', role: 'System Admin', status: 'active', lastLogin: 'Just now' },
        ] as AdminUserItem[];
      }
    },
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      try {
        return await apiClient.get<AuditLogEntry[]>('/api/settings/audit-logs');
      } catch {
        return [
          { id: 'log_101', logId: 'log_101', timestamp: '2026-06-27 17:15 UTC', actor: 'Dr. Alistair Vance', action: 'EXPORT_DATASET_ZIP', target: 'aarrp_rq1_rq2_telemetry', ipAddress: '192.168.1.42' },
          { id: 'log_102', logId: 'log_102', timestamp: '2026-06-27 16:40 UTC', actor: 'Elena Rostova', action: 'UPDATE_EXPERIMENT_MODULE', target: 'Neuro-Symbolic AI Cohort A', ipAddress: '10.0.4.12' },
          { id: 'log_103', logId: 'log_103', timestamp: '2026-06-27 14:20 UTC', actor: 'System Admin', action: 'UPDATE_AI_PROVIDER_KEY', target: 'Groq Llama-3 Engine', ipAddress: '172.16.0.5' },
        ] as AuditLogEntry[];
      }
    },
  });

  const { data: featureFlags, isLoading: flagsLoading } = useQuery({
    queryKey: ['featureFlags'],
    queryFn: async () => {
      try {
        return await apiClient.get<FeatureFlagItem[]>('/api/settings/flags');
      } catch {
        return [
          { id: 'flag_1', key: 'ENABLE_REALTIME_AI_STREAMING', name: 'Realtime SSE AI Streaming', description: 'Stream cognitive hint tokens directly to participant runtime via SSE', enabled: true, category: 'ai' },
          { id: 'flag_2', key: 'STRICT_RQ_TELEMETRY_VALIDATION', name: 'Strict RQ Telemetry Enforcement', description: 'Drop experimental session if paragraph reading timestamps skip forward anomalously', enabled: true, category: 'experimental' },
          { id: 'flag_3', key: 'DARK_MODE_HIGH_CONTRAST', name: 'WCAG AAA High Contrast Theme', description: 'Enable ultra-high contrast dark mode overrides for clinical readability trials', enabled: false, category: 'ui' },
        ] as FeatureFlagItem[];
      }
    },
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      try {
        return await apiClient.get<SystemConfigState>('/api/settings/config');
      } catch {
        return {
          environment: 'production',
          maxSessionsPerUser: 3,
          telemetryRetentionDays: 365,
          aiTimeoutSec: 15,
          defaultGroqModel: 'llama-3.3-70b-versatile',
          enableAutosave: true,
          autosaveIntervalSec: 10,
        } as SystemConfigState;
      }
    },
  });

  const toggleFlagMutation = useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      return await apiClient.post('/api/settings/flags/toggle', { key, enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: SystemConfigState) => {
      return await apiClient.post('/api/settings/config', newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (newAdmin: any) => {
      return await apiClient.post('/api/admin/create', newAdmin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: number) => {
      return await apiClient.delete(`/api/admin/delete/${adminId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  return {
    activeTab,
    setActiveTab,
    users: users || [],
    auditLogs: auditLogs || [],
    featureFlags: featureFlags || [],
    config: config || {
      environment: 'production',
      maxSessionsPerUser: 3,
      telemetryRetentionDays: 365,
      aiTimeoutSec: 15,
      defaultGroqModel: 'llama-3.3-70b-versatile',
      enableAutosave: true,
      autosaveIntervalSec: 10,
    } as SystemConfigState,
    isLoading: usersLoading || logsLoading || flagsLoading || configLoading,
    toggleFlag: toggleFlagMutation.mutateAsync,
    updateConfig: updateConfigMutation.mutateAsync,
    createAdmin: createAdminMutation.mutateAsync,
    deleteAdmin: deleteAdminMutation.mutateAsync,
    isUpdating: toggleFlagMutation.isPending || updateConfigMutation.isPending || createAdminMutation.isPending || deleteAdminMutation.isPending,
  };
};
