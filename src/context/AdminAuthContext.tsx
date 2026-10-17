/**
 * @file AdminAuthContext.tsx
 * @description Frontend administrative session context with demo auth state and role simulation.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/admin';
import { loggerService } from '../services/loggerService';
import { apiClient } from '../services/apiClient';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (email?: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'gardenvaly_admin_session';

const DEMO_ADMIN_USER: AdminUser = {
  id: 'usr-admin-01',
  name: 'Hasna Hena (Founder)',
  email: 'admin@gardenvaly.com',
  role: 'superadmin',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  lastLogin: new Date().toISOString(),
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      loggerService.warn('Error reading admin session', 'AdminAuth');
    }
    return DEMO_ADMIN_USER;
  });

  // Proactively ensure apiClient has a valid admin JWT token in AI Studio preview
  useEffect(() => {
    const existingToken = apiClient.getToken();
    if (!existingToken) {
      apiClient
        .post<{ token: string; user: AdminUser }>('/auth/login', {
          email: 'admin@gardenvaly.com',
          password: 'gardenvaly123',
        })
        .then((res) => {
          if (res.success && res.data?.token) {
            apiClient.setToken(res.data.token);
            if (res.data.user) {
              setUser(res.data.user);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient.post<{ token: string; user: AdminUser }>('/auth/login', {
        email,
        password,
      });

      if (res.success && res.data) {
        apiClient.setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        return { success: true };
      }

      // If backend returned explicit error message
      if (res.error) {
        return { success: false, error: res.error };
      }
    } catch (err) {
      loggerService.warn('API login request error, falling back to demo session', 'AdminAuth');
    }

    // Fallback demo login
    const adminSession: AdminUser = {
      ...DEMO_ADMIN_USER,
      email: email || DEMO_ADMIN_USER.email,
      lastLogin: new Date().toISOString(),
    };
    setUser(adminSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminSession));
    return { success: true };
  };

  const loginAsDemo = async (email?: string): Promise<boolean> => {
    try {
      const res = await apiClient.post<{ token: string; user: AdminUser }>('/auth/login', {
        email: email || 'admin@gardenvaly.com',
        password: 'gardenvaly123',
      });
      if (res.success && res.data?.token) {
        apiClient.setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        return true;
      }
    } catch {
      // ignore
    }

    const adminSession: AdminUser = {
      ...DEMO_ADMIN_USER,
      email: email || DEMO_ADMIN_USER.email,
      lastLogin: new Date().toISOString(),
    };
    setUser(adminSession);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminSession));
    } catch (e) {
      // ignore
    }
    loggerService.info('Admin demo session started', 'AdminAuth');
    return true;
  };

  const logout = (): void => {
    setUser(null);
    apiClient.removeToken();
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    loggerService.info('Admin session ended', 'AdminAuth');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
