'use client';

import React, { ReactNode } from 'react';
import { FieldValues, UseFormReturn, SubmitHandler } from 'react-hook-form';
import { FormToolbar } from '@/components/cms/FormToolbar';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export interface CreateFormProps<TFieldValues extends FieldValues> {
  title: string;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  onCancel?: () => void;
  isLoading?: boolean;
  children: ReactNode;
  saveLabel?: string;
}

export function CreateForm<TFieldValues extends FieldValues>({
  title,
  description,
  form,
  onSubmit,
  onCancel,
  isLoading = false,
  children,
  saveLabel = 'Create Record',
}: CreateFormProps<TFieldValues>) {
  const { handleSubmit, formState } = form;

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <CardHeader className="border-b border-slate-800/80 pb-6">
        <CardTitle className="text-xl font-extrabold text-white">{title}</CardTitle>
        {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
      </CardHeader>

      {isLoading ? (
        <CardContent className="p-12 flex justify-center">
          <Spinner size="lg" label="Initializing form structure..." />
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <CardContent className="pt-6 space-y-6">{children}</CardContent>

          <FormToolbar
            onSave={handleSubmit(onSubmit)}
            onCancel={onCancel}
            isSaving={formState.isSubmitting}
            isDirty={formState.isDirty}
            saveLabel={saveLabel}
          />
        </form>
      )}
    </Card>
  );
}
