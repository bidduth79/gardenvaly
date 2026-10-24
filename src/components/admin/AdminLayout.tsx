/**
 * @file AdminLayout.tsx
 * @description Clean Laravel Filament / Vercel style admin layout with .admin-shell isolation,
 * fixed left sidebar, command header, and high-contrast Slate, Black & White canvas.
 */

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useRouter } from '../../context/RouterContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentPath } = useRouter();

  // Do not wrap the standalone login page or standalone new-tab voucher in the sidebar/header shell
  if (currentPath === '/admin/login' || currentPath.startsWith('/admin/voucher/')) {
    return <div className="admin-shell">{children}</div>;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Fixed Left Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F8FAFC]">
        <AdminHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
