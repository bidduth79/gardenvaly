/**
 * @file AdminHeader.tsx
 * @description Modern Laravel Filament / Linear style top header in pure Slate, Black & White
 * featuring contextual breadcrumbs, a quick jump search bar, language toggle, and profile menu.
 */

import React, { useState } from 'react';
import {
  Menu,
  ExternalLink,
  LogOut,
  ChevronRight,
  ChevronDown,
  Settings,
  Search,
  Plus,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentPath, navigate } = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAdminAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [showQuickResults, setShowQuickResults] = useState(false);

  const getBreadcrumb = (): { sectionEn: string; sectionBn: string; pageEn: string; pageBn: string } => {
    if (currentPath === '/admin') {
      return { sectionEn: 'Admin', sectionBn: 'অ্যাডমিন', pageEn: 'Dashboard', pageBn: 'ড্যাশবোর্ড' };
    }
    if (currentPath === '/admin/products/new') {
      return { sectionEn: 'Products', sectionBn: 'পণ্য তালিকা', pageEn: 'Create', pageBn: 'নতুন পণ্য যোগ' };
    }
    if (currentPath.includes('/edit')) {
      return { sectionEn: 'Products', sectionBn: 'পণ্য তালিকা', pageEn: 'Edit', pageBn: 'পণ্য সম্পাদনা' };
    }
    if (currentPath.startsWith('/admin/products')) {
      return { sectionEn: 'Catalog', sectionBn: 'ক্যাটালগ', pageEn: 'Products', pageBn: 'সকল পণ্য' };
    }
    if (currentPath.startsWith('/admin/categories')) {
      return { sectionEn: 'Catalog', sectionBn: 'ক্যাটালগ', pageEn: 'Categories', pageBn: 'ক্যাটাগরি' };
    }
    if (currentPath.startsWith('/admin/combos')) {
      return { sectionEn: 'Catalog', sectionBn: 'ক্যাটালগ', pageEn: 'Combo Packs', pageBn: 'কম্বো প্যাক' };
    }
    if (currentPath.startsWith('/admin/inventory')) {
      return { sectionEn: 'Catalog', sectionBn: 'ক্যাটালগ', pageEn: 'Inventory', pageBn: 'স্টক কন্ট্রোল' };
    }
    if (currentPath.startsWith('/admin/vouchers')) {
      return { sectionEn: 'Sales', sectionBn: 'বিক্রয়', pageEn: 'Vouchers & Cash Memo', pageBn: 'ভাউচার ও ক্যাশ মেমো' };
    }
    if (currentPath.startsWith('/admin/orders/')) {
      return { sectionEn: 'Orders', sectionBn: 'অর্ডারসমূহ', pageEn: 'Order Details', pageBn: 'অর্ডার বিবরণ' };
    }
    if (currentPath.startsWith('/admin/orders')) {
      return { sectionEn: 'Sales', sectionBn: 'বিক্রয়', pageEn: 'Orders', pageBn: 'অর্ডারসমূহ' };
    }
    if (currentPath.startsWith('/admin/customers')) {
      return { sectionEn: 'Sales', sectionBn: 'বিক্রয়', pageEn: 'Customers', pageBn: 'গ্রাহক তালিকা' };
    }
    if (currentPath.startsWith('/admin/coupons')) {
      return { sectionEn: 'Sales', sectionBn: 'বিক্রয়', pageEn: 'Coupons', pageBn: 'কুপন ও ছাড়' };
    }
    if (currentPath.startsWith('/admin/reports')) {
      return { sectionEn: 'Sales', sectionBn: 'বিক্রয়', pageEn: 'Reports', pageBn: 'বিক্রয় রিপোর্ট' };
    }
    if (currentPath.startsWith('/admin/banners')) {
      return { sectionEn: 'Content', sectionBn: 'কনটেন্ট', pageEn: 'Hero Banners', pageBn: 'হিরো ব্যানার' };
    }
    if (currentPath.startsWith('/admin/guides')) {
      return { sectionEn: 'Content', sectionBn: 'কনটেন্ট', pageEn: 'Gardening Guides', pageBn: 'বাগান গাইড' };
    }
    if (currentPath.startsWith('/admin/reviews')) {
      return { sectionEn: 'Content', sectionBn: 'কনটেন্ট', pageEn: 'Reviews', pageBn: 'কাস্টমার রিভিউ' };
    }
    if (currentPath.startsWith('/admin/settings')) {
      return { sectionEn: 'System', sectionBn: 'সিস্টেম', pageEn: 'Settings', pageBn: 'স্টোর সেটিংস' };
    }
    return { sectionEn: 'Admin', sectionBn: 'অ্যাডমিন', pageEn: 'Overview', pageBn: 'সারসংক্ষেপ' };
  };

  const quickLinks = [
    { path: '/admin', bn: 'ড্যাশবোর্ড সারসংক্ষেপ', en: 'Dashboard Overview' },
    { path: '/admin/orders', bn: 'অর্ডারসমূহ পরিচালনা করুন', en: 'Manage Orders' },
    { path: '/admin/products', bn: 'সকল পণ্য তালিকা', en: 'All Products Catalog' },
    { path: '/admin/products/new', bn: '+ নতুন পণ্য যোগ করুন', en: '+ Add New Product' },
    { path: '/admin/inventory', bn: 'স্টক ও ইনভেন্টরি আপডেট', en: 'Stock & Inventory Control' },
    { path: '/admin/categories', bn: 'ক্যাটাগরি সমূহ', en: 'Product Categories' },
    { path: '/admin/coupons', bn: 'কুপন ও ডিসকাউন্ট কোড', en: 'Promo Codes & Coupons' },
    { path: '/admin/banners', bn: 'হিরো ব্যানার পরিবর্তন', en: 'Hero Banners' },
    { path: '/admin/settings', bn: 'স্টোর সেটিংস ও ডেলিভারি চার্জ', en: 'Store Settings' },
  ];

  const filteredLinks = quickLinks.filter(
    (l) =>
      l.bn.toLowerCase().includes(quickQuery.toLowerCase()) ||
      l.en.toLowerCase().includes(quickQuery.toLowerCase())
  );

  const crumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Drawer Button & Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
          <button
            onClick={() => navigate('/admin')}
            className="text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? crumb.sectionBn : crumb.sectionEn}
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-950 truncate">
            {language === 'bn' ? crumb.pageBn : crumb.pageEn}
          </span>
        </nav>
      </div>

      {/* Center: Quick Jump Search Bar */}
      <div className="hidden lg:block relative w-72 xl:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={quickQuery}
          onFocus={() => setShowQuickResults(true)}
          onBlur={() => setTimeout(() => setShowQuickResults(false), 180)}
          onChange={(e) => setQuickQuery(e.target.value)}
          placeholder={language === 'bn' ? 'যেকোনো পেজ বা অপশন খুঁজুন...' : 'Quick jump to any page...'}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-slate-900 transition-colors"
        />
        {showQuickResults && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 max-h-64 overflow-y-auto">
            {filteredLinks.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">
                {language === 'bn' ? 'কিছু পাওয়া যায়নি' : 'No matching page'}
              </div>
            ) : (
              filteredLinks.map((item) => (
                <button
                  key={item.path}
                  onMouseDown={() => {
                    navigate(item.path);
                    setQuickQuery('');
                    setShowQuickResults(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 flex items-center justify-between cursor-pointer"
                >
                  <span>{language === 'bn' ? item.bn : item.en}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right: Monochrome Language Toggle, Storefront Link & Admin Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Monochrome Slate/Black Language Switcher */}
        <div
          className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs"
          title={language === 'bn' ? 'ভাষা পরিবর্তন করুন' : 'Switch Admin Language'}
        >
          <button
            onClick={() => setLanguage('bn')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              language === 'bn'
                ? 'bg-slate-950 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-slate-950 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            English
          </button>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'নতুন পণ্য' : 'New Product'}</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Live Store'}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs">
              {language === 'bn' ? 'হা' : user?.name ? user.name.slice(0, 2).toUpperCase() : 'GV'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-900 whitespace-nowrap">
              {language === 'bn'
                ? user?.name === 'Hasna Hena' || !user?.name
                  ? 'হাসনা হেনা'
                  : user.name
                : user?.name || 'Hasna Hena'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-950">
                  {language === 'bn'
                    ? user?.name === 'Hasna Hena' || !user?.name
                      ? 'হাসনা হেনা'
                      : user.name
                    : user?.name || 'Hasna Hena'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">admin@gardenvaly.com</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'bn' ? 'স্টোর সেটিংস' : 'Store Settings'}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                  navigate('/admin/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer font-semibold"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
