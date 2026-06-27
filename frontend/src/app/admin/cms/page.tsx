'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { SearchBar } from '@/components/cms/SearchBar';
import { ExperimentFilters, FilterState } from '@/components/cms/ExperimentFilters';
import { ExperimentActions } from '@/components/cms/ExperimentActions';
import { ExperimentTable } from '@/components/cms/ExperimentTable';
import { DeleteConfirmDialog } from '@/components/crud/DeleteConfirmDialog';
import { Alert } from '@/components/ui/Alert';
import type { Experiment } from '@/types/api';

export default function CMSHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    author: 'all',
    sortOrder: 'updated_desc',
  });
  const [page, setPage] = useState(1);
  const [expToDelete, setExpToDelete] = useState<Experiment | null>(null);

  const { data: experiments, isLoading, isError, error } = useQuery<Experiment[], Error>({
    queryKey: ['cms', 'experiments'],
    queryFn: () => apiClient.get<Experiment[]>('/api/cms/experiment'),
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cms/experiment/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['cms', 'experiments'] });
      const previous = queryClient.getQueryData<Experiment[]>(['cms', 'experiments']);
      if (previous) {
        queryClient.setQueryData<Experiment[]>(
          ['cms', 'experiments'],
          previous.filter((exp) => exp.id !== id)
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cms', 'experiments'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'experiments'] });
      setExpToDelete(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (exp: Experiment) => {
      return apiClient.post<Experiment>('/api/cms/experiment', {
        title: `${exp.title} (Copy)`,
        description: exp.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'experiments'] });
    },
  });

  const filteredExperiments = useMemo(() => {
    if (!experiments) return [];
    let list = [...experiments];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (exp) =>
          exp.title.toLowerCase().includes(term) ||
          exp.id.toLowerCase().includes(term) ||
          (exp.description && exp.description.toLowerCase().includes(term))
      );
    }

    if (filters.status !== 'all') {
      list = list.filter((exp) => (exp.current_version?.status || 'draft') === filters.status);
    }

    if (filters.sortOrder === 'title_asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortOrder === 'created_desc') {
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else {
      list.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
    }

    return list;
  }, [experiments, searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredExperiments.length / 10));
  const paginatedExperiments = filteredExperiments.slice((page - 1) * 10, page * 10);

  const handleConfigure = (exp: Experiment) => {
    router.push(`/admin/cms/experiments/${exp.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {isError && (
        <Alert variant="error" title="Failed to load experiments">
          {error.message || 'Unable to communicate with the database server.'}
        </Alert>
      )}

      {/* Top Action & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar onSearchChange={setSearchTerm} />
        <ExperimentActions
          onNew={() => router.push('/admin/cms/experiments/new')}
          isLoading={isLoading || duplicateMutation.isPending}
        />
      </div>

      {/* Filtering Toolbar */}
      <ExperimentFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters({ status: 'all', author: 'all', sortOrder: 'updated_desc' })}
      />

      {/* Experiment Data Table */}
      <ExperimentTable
        experiments={paginatedExperiments}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={{
          onConfigure: handleConfigure,
          onDuplicate: (exp) => duplicateMutation.mutate(exp),
          onDelete: (exp) => setExpToDelete(exp),
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={!!expToDelete}
        title="Delete Research Experiment"
        message={`Are you sure you want to permanently delete "${expToDelete?.title}"? All associated reading cohorts and telemetry recordings will be unlinked.`}
        onConfirm={() => expToDelete && deleteMutation.mutate(expToDelete.id)}
        onCancel={() => setExpToDelete(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
