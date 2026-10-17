/**
 * @file AdminDashboardPage.tsx
 * @description Master data-driven admin dashboard displaying the 12 mandatory summary cards,
 * timezone-aware date filters, sales trends, status distribution, top products, and inventory warnings.
 */

import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Boxes,
  TrendingUp,
  PlusCircle,
  Eye,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Package,
  Truck,
  XCircle,
  RotateCcw,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import {
  DashboardMetrics,
  DateRangeOption,
  SalesTrendPoint,
  StatusDistributionPoint,
  TopSellingProduct,
} from '../../types/admin';
import { AdminOrder } from '../../types/order';
import { Product } from '../../types/product';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { SalesTrendChart, StatusDistributionChart } from '../../components/admin/DashboardCharts';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const [dateRange, setDateRange] = useState<DateRangeOption>('all_time');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendPoint[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistributionPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [lowStockList, setLowStockList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (range: string) => {
    setLoading(true);
    try {
      const [m, trend, dist, top, orders, inventory] = await Promise.all([
        adminService.getDashboardMetrics(range),
        adminService.getSalesTrend(range === 'all_time' ? 'last_30_days' : range),
        adminService.getStatusDistribution(range),
        adminService.getTopSellingProducts(range, undefined, 5),
        orderService.getOrders(),
        adminService.getInventoryAlerts(10),
      ]);

      setMetrics(m);
      setSalesTrend(trend);
      setStatusDist(dist);
      setTopProducts(top);
      setRecentOrders(orders.slice(0, 5));
      setLowStockList(inventory.filter((i) => i.stockStatus !== 'healthy_stock').slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dateRange);
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {language === 'bn' ? 'অ্যাডমিন অ্যানালিটিক্স ড্যাশবোর্ড' : 'Store Performance & Analytics'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#174D35] border border-emerald-200">
              Asia/Dhaka
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'bn'
              ? 'বাস্তব ডাটাবেস রেকর্ড অনুযায়ী অর্ডার, বিক্রয় ও নার্সারি ইনভেন্টরি ট্র্যাকিং'
              : 'Real-time verified metrics for orders, revenue, inventory, and COD reconciliation'}
          </p>
        </div>

        {/* Global Date Filter Controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-2xs">
          <Calendar className="w-4 h-4 text-[#174D35] ml-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
            className="text-xs font-semibold text-stone-800 bg-transparent pr-4 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="today">{language === 'bn' ? 'আজকের (Today)' : 'Today'}</option>
            <option value="yesterday">{language === 'bn' ? 'গতকালের (Yesterday)' : 'Yesterday'}</option>
            <option value="last_7_days">{language === 'bn' ? 'গত ৭ দিন (Last 7 Days)' : 'Last 7 Days'}</option>
            <option value="last_30_days">{language === 'bn' ? 'গত ৩০ দিন (Last 30 Days)' : 'Last 30 Days'}</option>
            <option value="this_month">{language === 'bn' ? 'চলতি মাস (This Month)' : 'This Month'}</option>
            <option value="previous_month">{language === 'bn' ? 'পূর্ববর্তী মাস (Prev Month)' : 'Previous Month'}</option>
            <option value="all_time">{language === 'bn' ? 'সর্বকালীন (All Time)' : 'All Time'}</option>
          </select>
          <button
            onClick={() => loadData(dateRange)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Shortcut to Hero Banner Studio */}
        <button
          onClick={() => navigate('/admin/banners')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#174D35] to-[#5C8D50] hover:from-[#123e2a] hover:to-[#4e7943] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{language === 'bn' ? 'হিরো ব্যানার ও ফটো স্টুডিও' : 'Hero Banners & Photo Studio'}</span>
        </button>
      </div>

      {/* 12 MANDATORY SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {/* 1. Total Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-2xs hover:border-[#174D35] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
            </span>
            <ShoppingBag className="w-4 h-4 text-[#174D35]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">{metrics?.totalOrders ?? 0}</div>
          <p className="text-[10px] text-stone-400 mt-1 flex items-center justify-between">
            <span>{metrics?.timeRangeLabel || 'All Time'}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>

        {/* 2. New & Pending Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'নতুন / পেন্ডিং' : 'New / Pending'}
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700">{metrics?.pendingOrders ?? 0}</div>
          <p className="text-[10px] text-amber-600/80 mt-1">
            {language === 'bn' ? 'নিশ্চিতকরণের অপেক্ষায়' : 'Awaiting confirmation'}
          </p>
        </div>

        {/* 3. Confirmed Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'নিশ্চিত অর্ডার' : 'Confirmed'}
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700">{metrics?.confirmedOrders ?? 0}</div>
          <p className="text-[10px] text-blue-600/80 mt-1">
            {language === 'bn' ? 'প্রসেসিংয়ের জন্য প্রস্তুত' : 'Ready to pack'}
          </p>
        </div>

        {/* 4. Processing Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-2xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'প্রস্তুত হচ্ছে' : 'Processing'}
            </span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-purple-700">{metrics?.processingOrders ?? 0}</div>
          <p className="text-[10px] text-purple-600/80 mt-1">
            {language === 'bn' ? 'নার্সারিতে প্রস্তুত' : 'In nursery packing'}
          </p>
        </div>

        {/* 5. Shipped Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-sky-200/80 shadow-2xs hover:border-sky-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-sky-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'শিপড / পথে' : 'Shipped'}
            </span>
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-sky-700">{metrics?.shippedOrders ?? 0}</div>
          <p className="text-[10px] text-sky-600/80 mt-1">
            {language === 'bn' ? 'কুরিয়ারের অধীনে' : 'In transit with courier'}
          </p>
        </div>

        {/* 6. Delivered Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'সফল ডেলিভারি' : 'Delivered'}
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700">{metrics?.deliveredOrders ?? 0}</div>
          <p className="text-[10px] text-emerald-600/80 mt-1">
            {language === 'bn' ? 'গ্রাহকের হাতে পৌঁছেছে' : 'Completed sales'}
          </p>
        </div>

        {/* 7. Cancelled Orders */}
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'বাতিল অর্ডার' : 'Cancelled'}
            </span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-700">{metrics?.cancelledOrders ?? 0}</div>
          <p className="text-[10px] text-rose-600/80 mt-1">
            {language === 'bn' ? 'স্টক স্বয়ংক্রিয় রিস্টোর' : 'Stock auto-restored'}
          </p>
        </div>

        {/* 8. Total Order Value (Gross) */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {language === 'bn' ? 'মোট অর্ডার মূল্য' : 'Gross Value'}
            </span>
            <TrendingUp className="w-4 h-4 text-[#174D35]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#174D35]">
            ৳{(metrics?.totalOrderValue ?? 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {language === 'bn' ? 'সমস্ত সক্রিয় অর্ডার' : 'Non-cancelled orders'}
          </p>
        </div>

        {/* 9. Actual Collected Payments */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'সংগৃহীত ক্যাশ' : 'Collected Cash'}
            </span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-800">
            ৳{(metrics?.actualCollectedPayments ?? 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-700 mt-1 font-medium">
            {language === 'bn' ? 'যাচাইকৃত ক্যাশ কালেকশন' : 'Verified collected payments'}
          </p>
        </div>

        {/* 10. Outstanding Cash on Delivery */}
        <div className="bg-white p-4 rounded-2xl border border-amber-300 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'বকেয়া COD' : 'Outstanding COD'}
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-800">
            ৳{(metrics?.outstandingCod ?? 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-amber-700 mt-1 font-medium">
            {language === 'bn' ? 'কুরিয়ার থেকে সংগ্রহ বাকি' : 'Uncollected balance'}
          </p>
        </div>

        {/* 11. Total Products */}
        <div
          onClick={() => navigate('/admin/products')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#174D35] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {language === 'bn' ? 'মোট প্রোডাক্ট' : 'Total Products'}
            </span>
            <Sprout className="w-4 h-4 text-[#5C8D50]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">{metrics?.totalProducts ?? 0}</div>
          <p className="text-[10px] text-stone-400 mt-1">
            {metrics?.plantProducts || 0} {language === 'bn' ? 'গাছ' : 'plants'} • {metrics?.seedProducts || 0}{' '}
            {language === 'bn' ? 'বীজ' : 'seeds'}
          </p>
        </div>

        {/* 12. Low-Stock Products */}
        <div
          onClick={() => navigate('/admin/inventory')}
          className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'লো-স্টক সতর্কতা' : 'Low Stock'}
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-700">{metrics?.lowStockProducts ?? 0}</div>
          <p className="text-[10px] text-rose-600/80 mt-1">
            {language === 'bn' ? 'স্টক ১০ বা তার কম' : 'Stock ≤ 10 units'}
          </p>
        </div>
      </div>

      {/* ADDITIONAL ACCURATE BUSINESS FORMULAS CALLOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Delivered Order Value (Actual Realized Sales) */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
              {language === 'bn' ? 'প্রকৃত ডেলিভার্ড বিক্রয়' : 'Delivered Sales Value'}
            </p>
            <p className="text-lg font-bold text-stone-900 mt-0.5">
              ৳{(metrics?.deliveredOrderValue ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 block">
              {language === 'bn' ? 'নেট বিক্রয় (Net Sales):' : 'Net Sales:'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              ৳{(metrics?.netSales ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
              {language === 'bn' ? 'গড় অর্ডার মূল্য (AOV)' : 'Average Order Value'}
            </p>
            <p className="text-lg font-bold text-stone-900 mt-0.5">
              ৳{(metrics?.averageOrderValue ?? 0).toLocaleString()}
            </p>
          </div>
          <p className="text-[10px] text-stone-400 text-right max-w-[120px]">
            {language === 'bn' ? 'সক্রিয় অর্ডার প্রতি গড় মূল্য' : 'Per active customer order'}
          </p>
        </div>

        {/* Profit Status (Honest Data Integrity Policy) */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
              {language === 'bn' ? 'প্রফিট হিসাব' : 'Profit Calculation'}
            </p>
            <p className="text-xs font-semibold text-stone-600 mt-1">
              {metrics?.profitStatus || 'Profit data not configured'}
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-stone-400" />
        </div>
      </div>

      {/* CHARTS ROW: Sales Trend & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {language === 'bn' ? 'বিক্রয় ট্রেন্ড ও অর্ডার গ্রাফ' : 'Daily Sales Trend'}
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'bn' ? 'নির্বাচিত সময়কালের বিক্রয় প্রবাহ' : 'Daily sales volume over selected date range'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#174D35]">
                ৳{(metrics?.totalOrderValue ?? 0).toLocaleString()}
              </span>
              <p className="text-[10px] text-stone-400">{language === 'bn' ? 'মোট বিক্রয়' : 'Period Total'}</p>
            </div>
          </div>

          <SalesTrendChart data={salesTrend} />
        </div>

        {/* Order Status Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'অর্ডার স্ট্যাটাস অনুপাত' : 'Order Status Distribution'}
            </h3>
            <p className="text-xs text-stone-400">
              {language === 'bn' ? 'সকল ১০টি লাইফসাইকেল স্ট্যাটাসের হিসাব' : 'Breakdown across all 10 order lifecycle stages'}
            </p>
          </div>

          <StatusDistributionChart data={statusDist} />
        </div>
      </div>

      {/* SECONDARY ROW: Top Selling Products & Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top-Selling Products (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'bn' ? 'সর্বাধিক বিক্রীত পণ্য' : 'Top-Selling Products'}</span>
            </h3>
            <button
              onClick={() => navigate('/admin/reports')}
              className="text-xs text-[#174D35] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'bn' ? 'সকল রিপোর্ট' : 'Full Report'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              {language === 'bn' ? 'এই সময়কালে কোনো বিক্রয় রেকর্ড নেই।' : 'No sales records in selected date range.'}
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {topProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getSafeImageUrl(p.imageUrl)}
                      alt={p.nameEn}
                      className="w-9 h-9 rounded-xl object-cover border border-stone-200"
                      onError={(e) => handleImageError(e, getProductFallbackImage())}
                    />
                    <div>
                      <p className="font-semibold text-stone-900 line-clamp-1">
                        {language === 'bn' ? p.nameBn : p.nameEn}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900">৳{p.grossSales.toLocaleString()}</span>
                    <p className="text-[10px] text-stone-500">
                      {p.unitsSold} {language === 'bn' ? 'টি বিক্রয়' : 'units sold'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock & Out of Stock Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{language === 'bn' ? 'ইনভেন্টরি সতর্কতা ও লো-স্টক' : 'Inventory Alerts'}</span>
            </h3>
            <button
              onClick={() => navigate('/admin/inventory')}
              className="text-xs text-[#174D35] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'bn' ? 'ইনভেন্টরি ম্যানেজ' : 'Manage Stock'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockList.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-600 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              ✓ {language === 'bn' ? 'সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।' : 'All inventory levels are healthy.'}
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {lowStockList.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getSafeImageUrl(item.imageUrl)}
                      alt={item.nameEn}
                      className="w-9 h-9 rounded-xl object-cover border border-stone-200"
                      onError={(e) => handleImageError(e, getProductFallbackImage())}
                    />
                    <div>
                      <p className="font-semibold text-stone-900 line-clamp-1">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.stockStatus === 'out_of_stock'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.stockQuantity === 0
                        ? language === 'bn'
                          ? 'স্টক আউট (০)'
                          : 'Out of Stock (0)'
                        : `${item.stockQuantity} ${language === 'bn' ? 'টি বাকি' : 'left'}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT ORDERS ROW */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'সাম্প্রতিক কাস্টমার অর্ডার' : 'Recent Customer Orders'}
            </h3>
            <p className="text-xs text-stone-400">
              {language === 'bn' ? 'সরাসরি প্রসেস করার জন্য বিস্তারিত বাটনে ক্লিক করুন' : 'Latest orders received from storefront'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs text-[#174D35] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সকল অর্ডার দেখুন' : 'View All Orders'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 text-[11px] font-semibold uppercase">
                <th className="py-2.5 px-3">{language === 'bn' ? 'অর্ডার নম্বর' : 'Order #'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'গ্রাহক' : 'Customer'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'মূল্য' : 'Amount'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                  <td className="py-3 px-3 font-medium text-stone-800">{ord.customer.fullName}</td>
                  <td className="py-3 px-3 font-bold text-stone-900">৳{ord.totalAmount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/orders/${ord.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {language === 'bn' ? 'বিস্তারিত' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
