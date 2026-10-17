/**
 * @file AdminHeader.tsx
 * @description Top navigation bar for the Gardenvaly Admin Dashboard with language switcher, notifications, and profile menu.
 */

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { apiClient } from '../../services/apiClient';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  sidebarPosition?: 'left' | 'right';
  onToggleSidebarPosition?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  sidebarPosition = 'right',
  onToggleSidebarPosition,
}) => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { user, logout } = useAdminAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  React.useEffect(() => {
    apiClient.checkHealth().then((healthy) => setApiConnected(healthy));
  }, []);

  // Derive title from route
  const getPageTitle = (): { en: string; bn: string } => {
    if (currentPath === '/admin') return { en: 'Dashboard Overview', bn: 'ড্যাশবোর্ড সারসংক্ষেপ' };
    if (currentPath === '/admin/products/new') return { en: 'Add New Product', bn: 'নতুন পণ্য যোগ করুন' };
    if (currentPath.includes('/edit')) return { en: 'Edit Product', bn: 'পণ্য সম্পাদনা' };
    if (currentPath.startsWith('/admin/products')) return { en: 'Product Management', bn: 'পণ্য ব্যবস্থাপনা' };
    if (currentPath.startsWith('/admin/categories')) return { en: 'Categories', bn: 'ক্যাটাগরি সমূহ' };
    if (currentPath.startsWith('/admin/orders/')) return { en: 'Order Details', bn: 'অর্ডারের বিবরণ' };
    if (currentPath.startsWith('/admin/orders')) return { en: 'Order Management', bn: 'অর্ডার ব্যবস্থাপনা' };
    if (currentPath.startsWith('/admin/inventory')) return { en: 'Inventory Control', bn: 'ইনভেন্টরি কন্ট্রোল' };
    if (currentPath.startsWith('/admin/customers')) return { en: 'Customer Records', bn: 'গ্রাহক রেকর্ড' };
    if (currentPath.startsWith('/admin/banners')) return { en: 'Hero Banners & Media', bn: 'হিরো ব্যানার ও ছবি' };
    if (currentPath.startsWith('/admin/reviews')) return { en: 'Customer Reviews & Feedback', bn: 'গ্রাহক মতামত ও রিভিউ' };
    if (currentPath.startsWith('/admin/reports')) return { en: 'Analytics & Reports', bn: 'রিপোর্ট ও বিশ্লেষণ' };
    if (currentPath.startsWith('/admin/settings')) return { en: 'Store Configuration', bn: 'স্টোর সেটিংস' };
    return { en: 'Admin Portal', bn: 'অ্যাডমিন পোর্টাল' };
  };

  const title = getPageTitle();

  const demoNotifications = [
    {
      id: 1,
      titleEn: 'New Order Received',
      titleBn: 'নতুন অর্ডার এসেছে',
      descEn: 'Order #GV-2026-0841 from Tahmina Akter',
      descBn: 'তাহমিনা আক্তারের অর্ডার #GV-2026-0841',
      time: '10m ago',
      type: 'order',
    },
    {
      id: 2,
      titleEn: 'Low Stock Alert',
      titleBn: 'স্টক সংকট সতর্কতা',
      descEn: 'Peace Lily is down to 2 units in nursery',
      descBn: 'পিস লিলি নার্সারিতে মাত্র ২ টি অবশিষ্ট',
      time: '1h ago',
      type: 'warning',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xs gap-2">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[#174D35]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold text-stone-900 leading-tight truncate">
            {language === 'bn' ? title.bn : title.en}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-stone-500 hidden sm:block truncate">
            Gardenvaly — by Hasna Hena Administrative Console
          </p>
        </div>
      </div>

      {/* Right: Actions, Language, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Sidebar Position Toggle (Left / Right) */}
        {onToggleSidebarPosition && (
          <button
            onClick={onToggleSidebarPosition}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer border border-stone-200"
            title={
              language === 'bn'
                ? sidebarPosition === 'right'
                  ? 'সাইডবার ডানপাশে রয়েছে (ক্লিক করে বামে নিন)'
                  : 'সাইডবার বামপাশে রয়েছে (ক্লিক করে ডানে নিন)'
                : sidebarPosition === 'right'
                ? 'Sidebar is on Right (Click to move Left)'
                : 'Sidebar is on Left (Click to move Right)'
            }
          >
            {sidebarPosition === 'right' ? (
              <PanelRight className="w-3.5 h-3.5 text-[#174D35]" />
            ) : (
              <PanelLeft className="w-3.5 h-3.5 text-[#174D35]" />
            )}
            <span className="hidden sm:inline text-[11px] font-semibold">
              {language === 'bn'
                ? sidebarPosition === 'right'
                  ? 'ডান সাইডবার'
                  : 'বাম সাইডবার'
                : sidebarPosition === 'right'
                ? 'Right Nav'
                : 'Left Nav'}
            </span>
          </button>
        )}

        {/* Live Storefront Quick Link */}
        <button
          onClick={() => navigate('/')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#174D35] bg-[#174D35]/5 hover:bg-[#174D35]/10 rounded-xl transition-colors cursor-pointer"
          title="Open live storefront"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'স্টোর দেখুন' : 'Live Store'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35]"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-800">
                  {language === 'bn' ? 'নোটিফিকেশন (ডেমো)' : 'Notifications (Demo)'}
                </span>
                <span className="text-[10px] text-stone-400">2 Unread</span>
              </div>
              <div className="mt-2 space-y-2">
                {demoNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 transition-colors cursor-pointer flex items-start gap-2.5"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      if (notif.type === 'order') navigate('/admin/orders');
                      else navigate('/admin/inventory');
                    }}
                  >
                    {notif.type === 'order' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <p className="font-semibold text-stone-800">
                        {language === 'bn' ? notif.titleBn : notif.titleEn}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {language === 'bn' ? notif.descBn : notif.descEn}
                      </p>
                      <span className="text-[10px] text-stone-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#174D35] text-amber-200 flex items-center justify-center font-bold text-xs shadow-xs">
              HH
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-stone-800 leading-tight">Hasna Hena</p>
              <p className="text-[10px] text-emerald-700 font-medium">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-stone-100">
                <p className="text-xs font-bold text-stone-800">Hasna Hena</p>
                <p className="text-[11px] text-stone-500">admin@gardenvaly.com</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Super Administrator</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'bn' ? 'স্টোর সেটিংস' : 'Store Settings'}</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'bn' ? 'গ্রাহক স্টোরফ্রন্ট' : 'View Storefront'}</span>
                </button>
              </div>

              <div className="pt-1 border-t border-stone-100">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                    navigate('/admin/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
