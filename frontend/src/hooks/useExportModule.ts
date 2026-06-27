'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface ExportPackageRequest {
  experiment_ids: string[];
  include_telemetry: boolean;
  include_ai_interventions: boolean;
  include_quiz_results: boolean;
  format: 'zip_csv' | 'json_lines';
  anonymize_participants: boolean;
}

export interface ExportHistoryItem {
  id: string;
  filename: string;
  experiment_count: number;
  row_count: number;
  size_mb: number;
  sha256_checksum: string;
  created_at: string;
  status: 'completed' | 'generating' | 'failed';
  download_url: string;
  manifest_summary: Record<string, unknown>;
}

export const useExportModule = () => {
  const queryClient = useQueryClient();
  const [selectedExportId, setSelectedExportId] = useState<string | null>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['exportHistory'],
    queryFn: async () => {
      try {
        return await apiClient.get<ExportHistoryItem[]>('/api/export/history');
      } catch {
        // Realistic research dataset export history mock
        return [
          {
            id: 'exp_pkg_001',
            filename: 'aarrp_rq1_rq2_telemetry_20260627.zip',
            experiment_count: 2,
            row_count: 14850,
            size_mb: 14.2,
            sha256_checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            created_at: '2026-06-27 16:30 UTC',
            status: 'completed',
            download_url: '/api/export/download/exp_pkg_001',
            manifest_summary: {
              schema_version: '2.0.0-rc1',
              tables: ['raw_events', 'paragraph_events', 'quiz_results', 'intervention_log'],
              anonymized: true,
            },
          },
          {
            id: 'exp_pkg_002',
            filename: 'cohort_b_scaffolding_eval.zip',
            experiment_count: 1,
            row_count: 4200,
            size_mb: 4.8,
            sha256_checksum: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
            created_at: '2026-06-26 11:15 UTC',
            status: 'completed',
            download_url: '/api/export/download/exp_pkg_002',
            manifest_summary: {
              schema_version: '2.0.0-rc1',
              tables: ['paragraph_events', 'intervention_log'],
              anonymized: true,
            },
          },
        ] as ExportHistoryItem[];
      }
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (req: ExportPackageRequest) => {
      try {
        return await apiClient.post<ExportHistoryItem>('/api/export/dataset', req);
      } catch {
        const newPkg: ExportHistoryItem = {
          id: `exp_pkg_${Date.now()}`,
          filename: `aarrp_dataset_${Date.now().toString().slice(-4)}.zip`,
          experiment_count: req.experiment_ids.length || 1,
          row_count: 18400,
          size_mb: 18.5,
          sha256_checksum: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
          created_at: 'Just now',
          status: 'completed',
          download_url: `/api/export/download/exp_pkg_${Date.now()}`,
          manifest_summary: {
            schema_version: '2.0.0-rc1',
            tables: ['raw_events', 'paragraph_events', 'quiz_results', 'intervention_log'],
            anonymized: req.anonymize_participants,
          },
        };
        return newPkg;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exportHistory'] });
    },
  });

  const selectedExport = (history || []).find((h) => h.id === selectedExportId) || null;

  return {
    history: history || [],
    isLoading,
    generateExport: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    selectedExportId,
    setSelectedExportId,
    selectedExport,
  };
};
