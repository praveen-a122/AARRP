'use client';

import React, { ReactNode } from 'react';
import { FieldValues, UseFormReturn, SubmitHandler } from 'react-hook-form';
import { FormToolbar } from '@/components/cms/FormToolbar';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

export interface EditFormProps<TFieldValues extends FieldValues> {
  title: string;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  onCancel?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  isLoading?: boolean;
  children: ReactNode;
  saveLabel?: string;
}

export function EditForm<TFieldValues extends FieldValues>({
  title,
  description,
  form,
  onSubmit,
  onCancel,
  onDelete,
  onDuplicate,
  isLoading = false,
  children,
  saveLabel = 'Update Record',
}: EditFormProps<TFieldValues>) {
  const { handleSubmit, formState } = form;

  useUnsavedChangesWarning({ isDirty: formState.isDirty });

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <CardHeader className="border-b border-slate-800/80 pb-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-extrabold text-white">{title}</CardTitle>
          {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
        </div>
        {formState.isDirty && (
          <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
            Unsaved Changes
          </span>
        )}
      </CardHeader>

      {isLoading ? (
        <CardContent className="p-12 flex justify-center">
          <Spinner size="lg" label="Loading record data..." />
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <CardContent className="pt-6 space-y-6">{children}</CardContent>

          <FormToolbar
            onSave={handleSubmit(onSubmit)}
            onCancel={onCancel}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            canDelete={!!onDelete}
            canDuplicate={!!onDuplicate}
            isSaving={formState.isSubmitting}
            isDirty={formState.isDirty}
            saveLabel={saveLabel}
          />
        </form>
      )}
    </Card>
  );
}
