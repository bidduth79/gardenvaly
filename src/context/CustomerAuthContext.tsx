/**
 * @file CustomerAuthContext.tsx
 * @description Customer authentication and session state management.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerProfile, CustomerRegisterPayload } from '../types/customer';
import { customerService } from '../services/customerService';
import { loggerService } from '../services/loggerService';

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (payload: CustomerRegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<CustomerProfile>;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => customerService.getSavedProfile());
  const [token, setToken] = useState<string | null>(() => customerService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const refreshProfile = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const fresh = await customerService.getProfile();
      setCustomer(fresh);
    } catch (err) {
      loggerService.warn('Could not refresh customer profile', 'CustomerAuthContext');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (identifier: string, password?: string) => {
    setIsLoading(true);
    try {
      const data = await customerService.login(identifier, password);
      setToken(data.token);
      setCustomer(data.customer);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.demoLogin();
      setToken(data.token);
      setCustomer(data.customer);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: CustomerRegisterPayload) => {
    setIsLoading(true);
    try {
      const data = await customerService.register(payload);
      setToken(data.token);
      setCustomer(data.customer);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    customerService.clearSession();
    setToken(null);
    setCustomer(null);
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    const updated = await customerService.updateProfile(updates);
    setCustomer(updated);
    return updated;
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: Boolean(token && customer),
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        refreshProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLoginModal,
        openRegisterModal,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
