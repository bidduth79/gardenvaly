/**
 * @file RouterContext.tsx
 * @description Lightweight client-side router supporting path, hash, and query params.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loggerService } from '../services/loggerService';

interface RouterContextType {
  currentPath: string;
  params: Record<string, string>;
  queryParams: URLSearchParams;
  navigate: (to: string) => void;
  setQueryParam: (key: string, value: string | null) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parseLocation(): { path: string; search: string } {
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    const [pathPart, queryPart] = hash.slice(1).split('?');
    return { path: pathPart || '/', search: queryPart ? `?${queryPart}` : '' };
  }
  return { path: window.location.pathname || '/', search: window.location.search || '' };
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locationState, setLocationState] = useState(() => parseLocation());

  useEffect(() => {
    // If landed with legacy hash route '#/product/...', migrate cleanly to pushState path
    if (window.location.hash.startsWith('#/')) {
      const { path, search } = parseLocation();
      try {
        window.history.replaceState(null, '', `${path}${search}`);
      } catch {
        // Safe fallback
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setLocationState(parseLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string): void => {
    try {
      const cleanTo = to.startsWith('/') ? to : `/${to}`;
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', cleanTo);
        setLocationState(parseLocation());
      } else {
        window.location.hash = `#${cleanTo}`;
        setLocationState(parseLocation());
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loggerService.info(`Navigated to: ${cleanTo}`, 'Router');
    } catch (err) {
      loggerService.error('Navigation error', err, 'Router');
    }
  };

  const setQueryParam = (key: string, value: string | null): void => {
    try {
      const q = new URLSearchParams(locationState.search);
      if (value === null || value === '') {
        q.delete(key);
      } else {
        q.set(key, value);
      }
      const newQuery = q.toString() ? `?${q.toString()}` : '';
      const [basePath] = locationState.path.split('?');
      const target = `${basePath}${newQuery}`;
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', target);
      } else {
        window.location.hash = `#${target}`;
      }
      setLocationState({ path: basePath, search: newQuery });
    } catch (err) {
      loggerService.error('Error setting query param', err, 'Router');
    }
  };

  // Extract route parameters
  const params: Record<string, string> = {};
  const path = locationState.path;
  if (path.startsWith('/product/')) {
    params.slug = path.replace('/product/', '').split('?')[0];
  } else if (path.startsWith('/category/')) {
    params.slug = path.replace('/category/', '').split('?')[0];
  }

  const queryParams = new URLSearchParams(locationState.search);

  return (
    <RouterContext.Provider
      value={{
        currentPath: path,
        params,
        queryParams,
        navigate,
        setQueryParam,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
