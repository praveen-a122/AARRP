'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { setAccessToken } from '@/lib/apiClient';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  accessToken: string | null;
  token: string | null; // For backward compatibility with earlier UI pages
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessTokenOrUsername: string, userOrPassword?: unknown) => Promise<void> | void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const silentRefresh = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Silent refresh failed');
        }

        const data = await response.json();
        if (isMounted && data.access_token) {
          updateToken(data.access_token);
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch {
        if (isMounted) {
          updateToken(null);
          setUser(null);
          if (
            typeof window !== 'undefined' &&
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/'
          ) {
            window.location.href = '/login';
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    silentRefresh();

    return () => {
      isMounted = false;
    };
  }, [updateToken]);

  const login = useCallback(
    async (accessTokenOrUsername: string, userOrPassword?: unknown) => {
      if (typeof userOrPassword === 'string') {
        // Backward compatibility handling: login(username, password)
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: accessTokenOrUsername, password: userOrPassword }),
        });
        if (!response.ok) {
          let errDetail = 'Authentication failed';
          try {
            const errData = await response.json();
            errDetail = errData.detail || errDetail;
          } catch {}
          throw { detail: errDetail, status: response.status };
        }
        const data = await response.json();
        const token = data.access_token;
        const usr = data.user || { username: accessTokenOrUsername, role: 'admin' };
        updateToken(token);
        setUser(usr);
      } else {
        // New signature: login(accessToken, user)
        const token = accessTokenOrUsername;
        const usr = (userOrPassword as User) || null;
        updateToken(token);
        setUser(usr);
      }
    },
    [updateToken]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {} finally {
      updateToken(null);
      setUser(null);

      // Invalidate React Query caches if queryClient is attached to window
      if (typeof window !== 'undefined') {
        const win = window as unknown as { __REACT_QUERY_CLIENT__?: { clear: () => void } };
        if (win.__REACT_QUERY_CLIENT__) {
          win.__REACT_QUERY_CLIENT__.clear();
        }
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [updateToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        token: accessToken,
        user,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
