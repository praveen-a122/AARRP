'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
