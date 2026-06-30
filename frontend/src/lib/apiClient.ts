import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ access_token?: string }>(
          '/api/auth/refresh',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const newToken = refreshResponse.data?.access_token;
        if (newToken) {
          setAccessToken(newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiError {
  detail: string;
  status?: number;
}

const formatError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail || error.message || 'An unexpected API error occurred';
    return {
      detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
      status: error.response?.status,
    };
  }
  return {
    detail: error instanceof Error ? error.message : 'Unknown error occurred',
  };
};

export const apiClient = {
  get: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  put: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  delete: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  instance: axiosInstance,
};
