'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import type { LoginResponse } from '@/types/api';

const loginSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many login attempts. Please try again in 15 minutes.');
        }
        const errData = await response.json().catch(() => ({
          detail: 'Authentication failed. Please verify your credentials.',
        }));
        throw new Error(errData.detail || 'Invalid username or password.');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      login(data.access_token, data.user);
      router.push('/admin');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || 'An unexpected error occurred during login.');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMessage && (
        <Alert variant="error" title="Authentication Error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Input
        label="Username or Email"
        type="text"
        placeholder="e.g. researcher_admin"
        required
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
        </Button>
      </div>
    </form>
  );
};
