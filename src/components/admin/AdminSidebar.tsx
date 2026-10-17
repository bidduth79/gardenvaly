/**
 * @file AdminSidebar.tsx
 * @description Professional e-commerce store management sidebar for Gardenvaly.
 * Features categorized domain menus (Catalog, Sales, Storefront, Settings),
 * collapsible accordion sections, live notification/counter badges, quick search,
 * quick action buttons, and support for left/right positioning.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  Tags,
  ShoppingBag,
  Boxes,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  MessageSquareQuote,
  Search,
  X,
  PanelLeft,
  PanelRight,
  Store,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { reviewService, REVIEWS_UPDATED_EVENT } from '../../services/reviewService';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  sidebarPosition?: 'left' | 'right';
  onTogglePosition?: () => void;
}

interface MenuItem {
  path: string;
  icon: React.ElementType;
  labelEn: string;
  labelBn: string;
  badgeType?: 'count' | 'alert' | 'highlight';
  getBadgeValue?: (counts: MenuCounts) => number | string | null;
}

interface MenuGroup {
  id: string;
  titleEn: string;
  titleBn: string;
  icon: React.ElementType;
  items: MenuItem[];
}

interface MenuCounts {
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  totalOrders: number;
  totalReviews: number;
  totalCategories: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  sidebarPosition = 'right',
  onTogglePosition,
}) => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { logout, user } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState<MenuCounts>({
    totalProducts: 24,
    lowStockCount: 0,
    pendingOrders: 0,
    totalOrders: 0,
    totalReviews: 8,
    totalCategories: 6,
  });

  // State to track expanded accordion groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    catalog: true,
    sales: true,
    storefront: true,
    settings: true,
  });

  // Fetch dynamic counts for products, stock alerts, orders, and reviews
  useEffect(() => {
    let mounted = true;

    const loadCounts = async () => {
      try {
        const [products, orders, reviews] = await Promise.all([
          adminService.getAllProducts().catch(() => []),
          orderService.getOrders().catch(() => []),
          Promise.resolve(reviewService.getReviews()),
        ]);

        if (!mounted) return;

        const lowStock = products.filter(
          (p) => p.stockQuantity <= 10 || !p.inStock
        ).length;
        const pending = orders.filter((o) => o.status === 'pending').length;

        // Count unique categories
        const categories = new Set(products.map((p) => p.category)).size;

        setCounts({
          totalProducts: products.length,
          lowStockCount: lowStock,
          pendingOrders: pending,
          totalOrders: orders.length,
          totalReviews: reviews.length,
          totalCategories: categories || 6,
        });
      } catch (err) {
        // Fallback silently
      }
    };

    loadCounts();

    const handleReviewsUpdated = () => {
      try {
        const revs = reviewService.getReviews();
        setCounts((prev) => ({ ...prev, totalReviews: revs.length }));
      } catch {}
    };

    window.addEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    window.addEventListener('storage', loadCounts);

    return () => {
      mounted = false;
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
      window.removeEventListener('storage', loadCounts);
    };
  }, []);

  // Define structured store management menu groups
  const menuGroups: MenuGroup[] = useMemo(
    () => [
      {
        id: 'overview',
        titleEn: 'Overview & Reports',
        titleBn: 'সারসংক্ষেপ ও রিপোর্ট',
        icon: LayoutDashboard,
        items: [
          {
            path: '/admin',
            icon: LayoutDashboard,
            labelEn: 'Dashboard Overview',
            labelBn: 'ড্যাশবোর্ড সারসংক্ষেপ',
          },
          {
            path: '/admin/reports',
            icon: BarChart3,
            labelEn: 'Sales & Analytics',
            labelBn: 'রিপোর্ট ও বিশ্লেষণ',
          },
        ],
      },
      {
        id: 'catalog',
        titleEn: 'Catalog & Inventory',
        titleBn: 'পণ্য ও ইনভেন্টরি',
        icon: Sprout,
        items: [
          {
            path: '/admin/products',
            icon: Sprout,
            labelEn: 'All Products',
            labelBn: 'পণ্য তালিকা',
            badgeType: 'count',
            getBadgeValue: (c) => c.totalProducts,
          },
          {
            path: '/admin/products/new',
            icon: PlusCircle,
            labelEn: 'Add New Product',
            labelBn: 'নতুন পণ্য যোগ',
          },
          {
            path: '/admin/categories',
            icon: Tags,
            labelEn: 'Categories',
            labelBn: 'ক্যাটাগরি সমূহ',
            badgeType: 'count',
            getBadgeValue: (c) => c.totalCategories,
          },
          {
            path: '/admin/inventory',
            icon: Boxes,
            labelEn: 'Stock & Inventory',
            labelBn: 'ইনভেন্টরি কন্ট্রোল',
            badgeType: 'alert',
            getBadgeValue: (c) => (c.lowStockCount > 0 ? `${c.lowStockCount} alert` : null),
          },
        ],
      },
      {
        id: 'sales',
        titleEn: 'Orders & Customers',
        titleBn: 'অর্ডার ও গ্রাহক',
        icon: ShoppingBag,
        items: [
          {
            path: '/admin/orders',
            icon: ShoppingBag,
            labelEn: 'Orders Management',
            labelBn: 'অর্ডারসমূহ',
            badgeType: 'highlight',
            getBadgeValue: (c) => (c.pendingOrders > 0 ? `${c.pendingOrders} new` : c.totalOrders),
          },
          {
            path: '/admin/customers',
            icon: Users,
            labelEn: 'Customer Records',
            labelBn: 'গ্রাহক রেকর্ড',
          },
        ],
      },
      {
        id: 'storefront',
        titleEn: 'Storefront & Media',
        titleBn: 'স্টোর ও ডিজাইন',
        icon: Sparkles,
        items: [
          {
            path: '/admin/banners',
            icon: Sparkles,
            labelEn: 'Hero Banners',
            labelBn: 'হিরো ব্যানার ও ছবি',
          },
          {
            path: '/admin/reviews',
            icon: MessageSquareQuote,
            labelEn: 'Customer Reviews',
            labelBn: 'গ্রাহক মতামত ও রিভিউ',
            badgeType: 'count',
            getBadgeValue: (c) => c.totalReviews,
          },
        ],
      },
      {
        id: 'settings',
        titleEn: 'Settings & Config',
        titleBn: 'স্টোর সেটিংস',
        icon: Settings,
        items: [
          {
            path: '/admin/settings',
            icon: Settings,
            labelEn: 'Store Configuration',
            labelBn: 'স্টোর সেটিংস ও ডেলিভারি',
          },
        ],
      },
    ],
    []
  );

  // Auto-expand group containing active route
  useEffect(() => {
    menuGroups.forEach((group) => {
      const containsActive = group.items.some((item) =>
        item.path === '/admin'
          ? currentPath === '/admin'
          : currentPath.startsWith(item.path)
      );
      if (containsActive) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [currentPath, menuGroups]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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

  // Lock body scroll when mobile sidebar drawer is open
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Filter groups and items based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return menuGroups;
    const query = searchQuery.toLowerCase().trim();

    return menuGroups
      .map((group) => {
        const matchesGroupTitle =
          group.titleEn.toLowerCase().includes(query) ||
          group.titleBn.toLowerCase().includes(query);

        const filteredItems = group.items.filter(
          (item) =>
            item.labelEn.toLowerCase().includes(query) ||
            item.labelBn.toLowerCase().includes(query)
        );

        if (matchesGroupTitle || filteredItems.length > 0) {
          return {
            ...group,
            items: matchesGroupTitle ? group.items : filteredItems,
          };
        }
        return null;
      })
      .filter((g): g is MenuGroup => g !== null);
  }, [menuGroups, searchQuery]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#174D35] text-stone-100 select-none border-x border-emerald-800/60 shadow-xl">
      {/* Brand & Store Header */}
      <div className="p-3.5 border-b border-emerald-800/70 flex items-center justify-between gap-2 shrink-0 bg-emerald-950/40">
        <div
          onClick={() => handleNav('/admin')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5C8D50] to-[#174D35] flex items-center justify-center text-white shadow-md border border-emerald-600/40 shrink-0">
            <Store className="w-5 h-5 text-emerald-200 group-hover:scale-105 transition-transform" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif-botanical font-bold text-base text-amber-100 tracking-tight leading-none group-hover:text-white transition-colors truncate">
                Gardenvaly
              </span>
              <span className="text-[10px] text-emerald-300 font-medium tracking-wide flex items-center gap-1 mt-0.5">
                <span>{language === 'bn' ? 'স্টোর ম্যানেজমেন্ট' : 'Store Admin'}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              sidebarPosition === 'right' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              sidebarPosition === 'right' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Action Shortcuts (Visible when expanded) */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="p-3 border-b border-emerald-800/40 bg-emerald-950/20 space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleNav('/admin/products/new')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-600/80 text-white text-xs font-semibold shadow-xs transition-all border border-emerald-500/30 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">{language === 'bn' ? '+ নতুন পণ্য' : '+ Product'}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 hover:text-white text-xs font-medium transition-all border border-emerald-700/40 cursor-pointer"
              title="Open storefront"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">{language === 'bn' ? 'স্টোর দেখুন' : 'Live Shop'}</span>
            </button>
          </div>

          {/* In-Menu Quick Search / Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'মেনু খুঁজুন...' : 'Search menus...'}
              className="w-full pl-8 pr-7 py-1 text-xs bg-emerald-950/60 border border-emerald-700/50 rounded-lg text-stone-100 placeholder:text-emerald-400/70 focus:outline-none focus:border-amber-300/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Menu List (Categorized Domain Groups) */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3 custom-scrollbar">
        {filteredGroups.length === 0 ? (
          <div className="py-6 px-3 text-center text-xs text-emerald-400/80">
            {language === 'bn' ? 'কোনো মেনু পাওয়া যায়নি' : 'No menu found'}
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isOpen = openGroups[group.id] ?? true;
            const groupTitle = language === 'bn' ? group.titleBn : group.titleEn;
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Accordion Header */}
                {(!isCollapsed || isMobileOpen) ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300/90 hover:text-amber-200 tracking-wider uppercase transition-colors rounded-md hover:bg-emerald-900/40 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <GroupIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{groupTitle}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-px bg-emerald-800/40 my-2" />
                )}

                {/* Submenu Items */}
                {(isOpen || isCollapsed) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = isItemActive(item.path);
                      const Icon = item.icon;
                      const label = language === 'bn' ? item.labelBn : item.labelEn;
                      const badgeValue = item.getBadgeValue ? item.getBadgeValue(counts) : null;

                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNav(item.path)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 min-h-[44px] rounded-lg text-xs font-medium transition-all text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                            active
                              ? 'bg-gradient-to-r from-[#5C8D50] to-[#174D35] text-white shadow-sm border border-emerald-500/40 font-semibold'
                              : 'text-stone-300 hover:text-white hover:bg-emerald-900/60'
                          }`}
                          title={label}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                active ? 'text-amber-200' : 'text-emerald-400'
                              }`}
                            />
                            {(!isCollapsed || isMobileOpen) && (
                              <span className="truncate">{label}</span>
                            )}
                          </div>

                          {/* Live Metric / Notification Badge */}
                          {(!isCollapsed || isMobileOpen) && badgeValue !== null && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                                item.badgeType === 'alert'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : item.badgeType === 'highlight'
                                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold'
                                  : 'bg-emerald-950/60 text-emerald-200 border border-emerald-700/40'
                              }`}
                            >
                              {badgeValue}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      {/* Footer Controls: Sidebar Side Toggle, Storefront Link, Admin Info */}
      <div className="p-3 border-t border-emerald-800/60 space-y-1.5 bg-emerald-950/40 shrink-0">
        {/* Toggle Sidebar Side (Left / Right) */}
        {onTogglePosition && (!isCollapsed || isMobileOpen) && (
          <button
            onClick={onTogglePosition}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-300 hover:text-amber-200 hover:bg-emerald-900/60 transition-colors cursor-pointer border border-emerald-800/50"
            title="Toggle sidebar placement between Left and Right"
          >
            <div className="flex items-center gap-2">
              {sidebarPosition === 'right' ? (
                <PanelRight className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <PanelLeft className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>
                {language === 'bn' ? 'সাইডবার অবস্থান:' : 'Sidebar Side:'}
              </span>
            </div>
            <span className="font-semibold text-amber-300">
              {sidebarPosition === 'right'
                ? language === 'bn'
                  ? 'ডানপাশ'
                  : 'Right'
                : language === 'bn'
                ? 'বামপাশ'
                : 'Left'}
            </span>
          </button>
        )}

        {/* View Customer Storefront Link */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-emerald-200 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-emerald-300 shrink-0" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="truncate">
              {language === 'bn' ? 'গ্রাহক স্টোরফ্রন্ট দেখুন' : 'Live Storefront'}
            </span>
          )}
        </button>

        {/* User Info & Logout */}
        {user && (!isCollapsed || isMobileOpen) && (
          <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-between mt-1">
            <div className="truncate mr-2">
              <p className="text-xs font-semibold text-stone-200 truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user.role}</p>
            </div>
            <button
              onClick={logout}
              title={language === 'bn' ? 'লগআউট' : 'Logout'}
              className="p-1.5 text-emerald-400 hover:text-red-300 rounded hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div
          className={`md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex transition-opacity ${
            sidebarPosition === 'right' ? 'justify-end' : 'justify-start'
          }`}
          onClick={onCloseMobile}
        >
          <div
            className="w-72 h-full max-w-[85vw] shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
