/**
 * @file AdminDashboardPage.tsx
 * @description Monochrome Slate/Black/White Base + Semantic Functional Color System
 * with 100% pure Bengali ('bn') or 100% pure English ('en') localization via adminI18n.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sprout,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Calendar,
  ChevronRight,
  Plus,
  Eye,
  Boxes,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Printer,
  BarChart3,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import {
  DashboardMetrics,
  DateRangeOption,
  SalesTrendPoint,
} from '../../types/admin';
import { AdminOrder } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { SalesTrendChart } from '../../components/admin/DashboardCharts';
import { AdminPrintModal } from '../../components/admin/AdminPrintModal';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import {
  formatAdminCurrency,
  formatAdminNumber,
  formatAdminDate,
  toBnDigits,
} from '../../utils/adminI18n';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const [dateRange, setDateRange] = useState<DateRangeOption>('all_time');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendPoint[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [lowStockList, setLowStockList] = useState<any[]>([]);
  const [orderTab, setOrderTab] = useState<'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'>('all');
  const [loading, setLoading] = useState(true);
  const [voucherOrder, setVoucherOrder] = useState<AdminOrder | null>(null);

  const loadData = async (range: string) => {
    setLoading(true);
    try {
      const [m, trend, allOrders, inventory] = await Promise.all([
        adminService.getDashboardMetrics(range),
        adminService.getSalesTrend(range === 'all_time' ? 'last_30_days' : range),
        orderService.getOrders(),
        adminService.getInventoryAlerts(10),
      ]);

      setMetrics(m);
      setSalesTrend(trend);
      setOrders(allOrders);
      setLowStockList(inventory.filter((i) => i.stockStatus !== 'healthy_stock').slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dateRange);
  }, [dateRange]);

  const filteredRecentOrders = useMemo(() => {
    const list =
      orderTab === 'all'
        ? orders
        : orderTab === 'processing'
        ? orders.filter((o) => o.status === 'processing' || o.status === 'packed')
        : orders.filter((o) => o.status === orderTab);
    return list.slice(0, 8);
  }, [orders, orderTab]);

  // Semantic Status Badges (Success = Emerald, Warning = Amber, Danger = Rose, Info = Blue)
  const formatStatusBadge = (status: string) => {
    const mapBn: Record<string, string> = {
      pending: 'অপেক্ষমাণ',
      confirmed: 'নিশ্চিতকৃত',
      processing: 'প্রস্তুত হচ্ছে',
      packed: 'প্যাকিং সম্পন্ন',
      shipped: 'পথে আছে',
      delivered: 'ডেলিভারি সম্পন্ন',
      cancelled: 'বাতিল',
    };
    const mapEn: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      packed: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    const label = language === 'bn' ? mapBn[status] || status : mapEn[status] || status;

    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {label}
        </span>
      );
    }
    if (status === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✓ {label}
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          ✕ {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {label}
      </span>
    );
  };

  const pipelineSteps = [
    {
      id: 'pending' as const,
      bn: 'অপেক্ষমাণ অর্ডার',
      en: 'Pending',
      count: metrics?.pendingOrders ?? 0,
      icon: Clock,
      numClass: 'text-amber-600',
    },
    {
      id: 'confirmed' as const,
      bn: 'নিশ্চিতকৃত',
      en: 'Confirmed',
      count: metrics?.confirmedOrders ?? 0,
      icon: CheckCircle2,
      numClass: 'text-blue-600',
    },
    {
      id: 'processing' as const,
      bn: 'প্রস্তুত হচ্ছে',
      en: 'Processing',
      count: metrics?.processingOrders ?? 0,
      icon: Package,
      numClass: 'text-slate-900',
    },
    {
      id: 'shipped' as const,
      bn: 'পথে আছে',
      en: 'Shipped',
      count: metrics?.shippedOrders ?? 0,
      icon: Truck,
      numClass: 'text-blue-600',
    },
    {
      id: 'delivered' as const,
      bn: 'সফল ডেলিভারি',
      en: 'Delivered',
      count: metrics?.deliveredOrders ?? 0,
      icon: ShoppingBag,
      numClass: 'text-emerald-600',
    },
  ];

  const hasLowStock = (metrics?.lowStockProducts ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Top Executive Header & Quick Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
          {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
        </h1>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
              className="text-xs font-semibold text-slate-900 bg-transparent pr-2 focus:outline-hidden cursor-pointer"
            >
              <option value="today">{language === 'bn' ? 'আজকের হিসাব' : 'Today'}</option>
              <option value="yesterday">{language === 'bn' ? 'গতকালের হিসাব' : 'Yesterday'}</option>
              <option value="last_7_days">{language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}</option>
              <option value="last_30_days">{language === 'bn' ? 'গত ৩০ দিন' : 'Last 30 Days'}</option>
              <option value="this_month">{language === 'bn' ? 'চলতি মাস' : 'This Month'}</option>
              <option value="all_time">{language === 'bn' ? 'সর্বকালীন হিসাব' : 'All Time'}</option>
            </select>
            <button
              onClick={() => loadData(dateRange)}
              className="p-1 text-slate-500 hover:text-slate-950 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
              title={language === 'bn' ? 'হালনাগাদ করুন' : 'Refresh'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => navigate('/admin/reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'রিপোর্ট' : 'Reports'}</span>
          </button>

          <button
            onClick={() => navigate('/admin/inventory')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' ? 'স্টক কন্ট্রোল' : 'Inventory'}</span>
          </button>

          <button
            onClick={() => navigate('/admin/banners')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' ? 'ব্যানার' : 'Banners'}</span>
          </button>

          {/* Semantic Success / Primary CTA Button */}
          <button
            onClick={() => navigate('/admin/products/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পণ্য যোগ' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* 4 MODERN BENTO KPI CARDS (SLATE/WHITE BASE + SEMANTIC TEXT ACCENTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Order Value */}
        <div
          onClick={() => navigate('/admin/reports')}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'সর্বমোট অর্ডার মূল্য' : 'Gross Order Value'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-3 tabular-nums tracking-tight">
              {formatAdminCurrency(metrics?.totalOrderValue ?? 0, language)}
            </div>
          </div>
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs tabular-nums">
            <span className="text-slate-600">
              {language === 'bn' ? 'আদায়কৃত:' : 'Collected:'}{' '}
              <strong className="text-emerald-600 font-bold">
                {formatAdminCurrency(metrics?.actualCollectedPayments ?? 0, language)}
              </strong>
            </span>
            <span className="text-slate-600">
              {language === 'bn' ? 'বকেয়া:' : 'COD Due:'}{' '}
              <strong className="text-amber-600 font-bold">
                {formatAdminCurrency(metrics?.outstandingCod ?? 0, language)}
              </strong>
            </span>
          </div>
        </div>

        {/* KPI 2: Orders Overview */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'সর্বমোট অর্ডার' : 'Total Orders'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-3 tabular-nums tracking-tight">
              {formatAdminNumber(metrics?.totalOrders ?? 0, language)}
            </div>
          </div>
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs tabular-nums">
            <span className="text-slate-600">
              {language === 'bn' ? 'অপেক্ষমাণ:' : 'Pending:'}{' '}
              <strong className="text-amber-600 font-bold">
                {formatAdminNumber(metrics?.pendingOrders ?? 0, language)}
              </strong>
            </span>
            <span className="text-slate-600">
              {language === 'bn' ? 'ডেলিভারি:' : 'Delivered:'}{' '}
              <strong className="text-emerald-600 font-bold">
                {formatAdminNumber(metrics?.deliveredOrders ?? 0, language)}
              </strong>
            </span>
          </div>
        </div>

        {/* KPI 3: Products Catalog */}
        <div
          onClick={() => navigate('/admin/products')}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'তালিকাভুক্ত মোট পণ্য' : 'Products in Catalog'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-3 tabular-nums tracking-tight">
              {formatAdminNumber(metrics?.totalProducts ?? 0, language)}
            </div>
          </div>
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 tabular-nums">
            <span>
              {language === 'bn' ? 'গাছের চারা:' : 'Plants:'}{' '}
              <strong className="text-slate-950">
                {formatAdminNumber(metrics?.plantProducts ?? 0, language)}
              </strong>
            </span>
            <span>
              {language === 'bn' ? 'বীজ:' : 'Seeds:'}{' '}
              <strong className="text-slate-950">
                {formatAdminNumber(metrics?.seedProducts ?? 0, language)}
              </strong>
            </span>
          </div>
        </div>

        {/* KPI 4: Stock Status (Semantic Warning / Success) */}
        <div
          onClick={() => navigate('/admin/inventory')}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'স্টক সতর্কতা' : 'Low Stock Alerts'}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  hasLowStock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold mt-3 tabular-nums tracking-tight ${
                hasLowStock ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {formatAdminNumber(metrics?.lowStockProducts ?? 0, language)}
            </div>
          </div>
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className={hasLowStock ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
              {hasLowStock
                ? language === 'bn'
                  ? '⚠ দ্রুত স্টক হালনাগাদ প্রয়োজন'
                  : '⚠ Restock needed soon'
                : language === 'bn'
                ? '✓ সকল পণ্যের পর্যাপ্ত স্টক আছে'
                : '✓ All inventory healthy'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* INTERACTIVE 5-STAGE ORDER PIPELINE BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'bn' ? 'অর্ডারের ধাপসমূহ' : 'Order Pipeline'}
          </span>
          {orderTab !== 'all' && (
            <button
              onClick={() => setOrderTab('all')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {language === 'bn' ? 'সব অর্ডার দেখান' : 'Reset filter'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const active = orderTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setOrderTab(active ? 'all' : step.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                <div>
                  <p className={`text-[11px] font-medium ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                    {language === 'bn' ? step.bn : step.en}
                  </p>
                  <p className={`text-lg font-extrabold tabular-nums mt-0.5 ${active ? 'text-white' : step.numClass}`}>
                    {formatAdminNumber(step.count, language)}
                  </p>
                </div>
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* RECENT ORDERS RESOURCE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-950">
            {language === 'bn' ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Orders'}
          </h2>

          <button
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-white font-semibold transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            <span>{language === 'bn' ? 'সকল অর্ডার দেখুন' : 'All Orders'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">{language === 'bn' ? 'অর্ডার নং' : 'Order ID'}</th>
                <th className="py-3.5 px-5">{language === 'bn' ? 'গ্রাহক' : 'Customer'}</th>
                <th className="py-3.5 px-5">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="py-3.5 px-5">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-3.5 px-5 text-right">{language === 'bn' ? 'মোট মূল্য' : 'Total'}</th>
                <th className="py-3.5 px-5 text-right">{language === 'bn' ? 'ভাউচার ও পদক্ষেপ' : 'Voucher & Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredRecentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-slate-400">
                    {language === 'bn' ? 'এই ধাপে কোনো অর্ডার নেই।' : 'No matching orders found.'}
                  </td>
                </tr>
              ) : (
                filteredRecentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-950 tabular-nums whitespace-nowrap">
                      {language === 'bn' ? toBnDigits(ord.orderNumber) : ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {ord.customer.fullName.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950 leading-tight">{ord.customer.fullName}</p>
                          <p className="text-[11px] text-slate-500 tabular-nums">
                            {language === 'bn' ? toBnDigits(ord.customer.mobileNumber) : ord.customer.mobileNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {formatAdminDate(ord.createdAt, language)}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {formatStatusBadge(ord.status)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-950 tabular-nums whitespace-nowrap">
                      {formatAdminCurrency(ord.totalAmount, language)}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <a
                          href={`/admin/voucher/${ord.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-950 text-slate-950 hover:text-white border border-slate-900 transition-colors cursor-pointer"
                          title={language === 'bn' ? 'আলাদা ট্যাবে সাদাকালো ভাউচার ওপেন করুন' : 'Open Black & White Voucher in New Tab'}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ভাউচার' : 'Voucher'}</span>
                        </a>
                        <button
                          onClick={() => navigate(`/admin/orders/${ord.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-950 text-slate-900 hover:text-white border border-slate-300 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOWER 2-COLUMN ANALYTICS & INVENTORY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-950 text-base">
              {language === 'bn' ? 'দৈনিক বিক্রয় প্রবাহ' : 'Sales Revenue Trend'}
            </h2>
            <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
              {formatAdminCurrency(metrics?.totalOrderValue ?? 0, language)}
            </span>
          </div>

          <SalesTrendChart data={salesTrend} />
        </div>

        {/* Low Stock Alert Table (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-950 text-base">
              {language === 'bn' ? 'স্টক সতর্কতা' : 'Low Stock Alerts'}
            </h2>
            <button
              onClick={() => navigate('/admin/inventory')}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>{language === 'bn' ? 'স্টক হালনাগাদ' : 'Manage'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockList.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-600 font-semibold">
              ✓ {language === 'bn' ? 'সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।' : 'All products are well-stocked.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockList.map((item, idx) => (
                <div key={idx} className="px-5 py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getSafeImageUrl(item.imageUrl)}
                      alt={item.nameEn}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      onError={(e) => handleImageError(e, getProductFallbackImage())}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950 truncate">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {language === 'bn' ? `কোড: ${toBnDigits(item.sku)}` : item.sku}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md font-semibold tabular-nums whitespace-nowrap border ${
                      item.stockQuantity === 0
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {item.stockQuantity === 0
                      ? language === 'bn'
                        ? 'স্টক শেষ (০)'
                        : 'Out of stock (0)'
                      : `${formatAdminNumber(item.stockQuantity, language)} ${
                          language === 'bn' ? 'টি বাকি' : 'left'
                        }`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Built-in A4 Voucher PDF Modal */}
      {voucherOrder && (
        <AdminPrintModal
          mode="voucher"
          order={voucherOrder}
          language={language}
          onClose={() => setVoucherOrder(null)}
        />
      )}
    </div>
  );
};
