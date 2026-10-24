/**
 * @file AdminSidebar.tsx
 * @description Clean Laravel Filament-inspired left navigation sidebar in a strict
 * Slate, Black, and White monochrome palette.
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sprout,
  Tags,
  ShoppingBag,
  Boxes,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  MessageSquareQuote,
  X,
  Store,
  Ticket,
  BookOpen,
  Gift,
  FileText,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { formatAdminNumber } from '../../utils/adminI18n';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  path: string;
  icon: React.ElementType;
  labelEn: string;
  labelBn: string;
  badge?: number | null;
}

interface NavSection {
  titleEn: string;
  titleBn: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
}) => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { logout, user } = useAdminAuth();

  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadAlerts = async () => {
      try {
        const [products, orders] = await Promise.all([
          adminService.getAllProducts().catch(() => []),
          orderService.getOrders().catch(() => []),
        ]);
        if (!mounted) return;
        setLowStockCount(products.filter((p) => p.stockQuantity <= 10 || !p.inStock).length);
        setPendingOrders(orders.filter((o) => o.status === 'pending').length);
      } catch {
        // ignore
      }
    };
    loadAlerts();
    window.addEventListener('storage', loadAlerts);
    return () => {
      mounted = false;
      window.removeEventListener('storage', loadAlerts);
    };
  }, [currentPath]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  const isItemActive = (itemPath: string) => {
    if (itemPath === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(itemPath);
  };

  const sections: NavSection[] = [
    {
      titleEn: 'Shop & Sales',
      titleBn: 'অর্ডার ও বিক্রয়',
      items: [
        {
          path: '/admin/orders',
          icon: ShoppingBag,
          labelEn: 'Orders',
          labelBn: 'অর্ডারসমূহ',
          badge: pendingOrders > 0 ? pendingOrders : null,
        },
        {
          path: '/admin/vouchers',
          icon: FileText,
          labelEn: 'Vouchers (B&W)',
          labelBn: 'ভাউচার ও ক্যাশ মেমো',
        },
        {
          path: '/admin/customers',
          icon: Users,
          labelEn: 'Customers',
          labelBn: 'গ্রাহক তালিকা',
        },
        {
          path: '/admin/coupons',
          icon: Ticket,
          labelEn: 'Coupons',
          labelBn: 'কুপন ও ছাড়',
        },
        {
          path: '/admin/reports',
          icon: BarChart3,
          labelEn: 'Sales Reports',
          labelBn: 'বিক্রয় রিপোর্ট',
        },
      ],
    },
    {
      titleEn: 'Catalog',
      titleBn: 'পণ্য ও স্টক',
      items: [
        {
          path: '/admin/products',
          icon: Sprout,
          labelEn: 'Products',
          labelBn: 'সকল পণ্য',
        },
        {
          path: '/admin/categories',
          icon: Tags,
          labelEn: 'Categories',
          labelBn: 'ক্যাটাগরি',
        },
        {
          path: '/admin/combos',
          icon: Gift,
          labelEn: 'Combo Packs',
          labelBn: 'কম্বো প্যাক',
        },
        {
          path: '/admin/inventory',
          icon: Boxes,
          labelEn: 'Inventory',
          labelBn: 'স্টক কন্ট্রোল',
          badge: lowStockCount > 0 ? lowStockCount : null,
        },
      ],
    },
    {
      titleEn: 'Content & Config',
      titleBn: 'কনটেন্ট ও সেটিংস',
      items: [
        {
          path: '/admin/banners',
          icon: Sparkles,
          labelEn: 'Hero Banners',
          labelBn: 'হিরো ব্যানার',
        },
        {
          path: '/admin/guides',
          icon: BookOpen,
          labelEn: 'Gardening Guides',
          labelBn: 'বাগান গাইড',
        },
        {
          path: '/admin/reviews',
          icon: MessageSquareQuote,
          labelEn: 'Reviews',
          labelBn: 'কাস্টমার রিভিউ',
        },
        {
          path: '/admin/settings',
          icon: Settings,
          labelEn: 'Settings',
          labelBn: 'স্টোর সেটিংস',
        },
      ],
    },
  ];

  const sidebarBody = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <button
          onClick={() => handleNav('/admin')}
          className="flex items-center gap-3 text-left cursor-pointer group min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
            <Store className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="font-bold text-base text-white tracking-tight block leading-none">
              {language === 'bn' ? 'গার্ডেনভ্যালি' : 'GardenValy'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              {language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
            </span>
          </div>
        </button>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Flat Monochrome Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Primary Dashboard Item */}
        <div>
          <button
            onClick={() => handleNav('/admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/admin'
                ? 'bg-slate-100 text-slate-950 font-bold shadow-2xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 font-medium'
            }`}
          >
            <LayoutDashboard
              className={`w-4 h-4 shrink-0 ${
                currentPath === '/admin' ? 'text-slate-950' : 'text-slate-400'
              }`}
            />
            <span>{language === 'bn' ? 'মূল ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>
        </div>

        {/* Categorized Flat Sections */}
        {sections.map((section) => (
          <div key={section.titleEn} className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {language === 'bn' ? section.titleBn : section.titleEn}
            </div>
            {section.items.map((item) => {
              const active = isItemActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-100 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-slate-950' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">
                      {language === 'bn' ? item.labelBn : item.labelEn}
                    </span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`text-[11px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded ${
                        item.path === '/admin/inventory'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {formatAdminNumber(item.badge, language)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Clean Footer: Storefront Link & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-1.5 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Visit Storefront'}</span>
        </button>

        {user && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {language === 'bn' && user.name === 'Hasna Hena' ? 'হাসনা হেনা' : user.name}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">
                {language === 'bn' ? '● সক্রিয় · অ্যাডমিন' : '● Online · Admin'}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              title={language === 'bn' ? 'লগআউট করুন' : 'Sign out'}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:block w-60 shrink-0 sticky top-0 h-screen z-30">
        {sidebarBody}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 h-full max-w-[82vw] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarBody}
          </div>
        </div>
      )}
    </>
  );
};
