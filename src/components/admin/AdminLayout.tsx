/**
 * @file AdminLayout.tsx
 * @description Master layout wrapper for all Gardenvaly admin views with configurable sidebar placement (left/right), responsive drawer, header, and content canvas.
 */

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRouter } from '../../context/RouterContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>(() => {
    try {
      const saved = localStorage.getItem('gardenvaly_admin_sidebar_position');
      // Defaults to 'right' as requested by user
      return saved === 'left' ? 'left' : 'right';
    } catch {
      return 'right';
    }
  });

  const { isAuthenticated } = useAdminAuth();
  const { currentPath, navigate } = useRouter();

  const toggleSidebarPosition = () => {
    const next = sidebarPosition === 'right' ? 'left' : 'right';
    setSidebarPosition(next);
    try {
      localStorage.setItem('gardenvaly_admin_sidebar_position', next);
    } catch {}
  };

  // If user visits /admin/login, don't show the sidebar & header layout
  if (currentPath === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen bg-[#F7F5EC] text-stone-800 flex flex-col ${
        sidebarPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
      } antialiased`}
    >
      {/* Store Management Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        sidebarPosition={sidebarPosition}
        onTogglePosition={toggleSidebarPosition}
      />

      {/* Main Administrative Work Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          sidebarPosition={sidebarPosition}
          onToggleSidebarPosition={toggleSidebarPosition}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
