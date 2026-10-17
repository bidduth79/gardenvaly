/**
 * @file AdminReportsPage.tsx
 * @description In-depth store analytics, financial reports, COD reconciliation audit,
 * top-selling product metrics, and authorized CSV reporting.
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Sprout,
  DollarSign,
  Calendar,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import {
  DashboardMetrics,
  DateRangeOption,
  TopSellingProduct,
  InventoryAlertItem,
} from '../../types/admin';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/apiClient';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

export const AdminReportsPage: React.FC = () => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'financial' | 'top_products' | 'inventory' | 'cod'>('financial');
  const [dateRange, setDateRange] = useState<DateRangeOption>('all_time');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [m, top, alerts] = await Promise.all([
        adminService.getDashboardMetrics(dateRange),
        adminService.getTopSellingProducts(dateRange, undefined, 20),
        adminService.getInventoryAlerts(10),
      ]);
      setMetrics(m);
      setTopProducts(top);
      setInventoryAlerts(alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const handleExportCsv = async (type: string) => {
    try {
      const token = apiClient.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reports/export/csv?type=${type}&range=${dateRange}`, { headers });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gardenvaly-${type}-${dateRange}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert(language === 'bn' ? 'CSV এক্সপোর্ট ব্যর্থ হয়েছে' : 'Failed to export report CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'ব্যবসায়িক রিপোর্ট ও অডিট অ্যানালিটিক্স' : 'Business Reports & Financial Analytics'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'বিক্রয় বিশ্লেষণ, ক্যাশ-অন-ডেলিভারি হিসাব এবং ইনভেন্টরি পারফরম্যান্স'
              : 'Verified financial reconciliation, COD collection audits, and botanical inventory performance'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-xs shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#174D35]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
              className="bg-transparent font-semibold text-stone-800 pr-2 focus:outline-hidden cursor-pointer"
            >
              <option value="today">{language === 'bn' ? 'আজকের' : 'Today'}</option>
              <option value="yesterday">{language === 'bn' ? 'গতকালের' : 'Yesterday'}</option>
              <option value="last_7_days">{language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}</option>
              <option value="last_30_days">{language === 'bn' ? 'গত ৩০ দিন' : 'Last 30 Days'}</option>
              <option value="this_month">{language === 'bn' ? 'চলতি মাস' : 'This Month'}</option>
              <option value="previous_month">{language === 'bn' ? 'পূর্ববর্তী মাস' : 'Prev Month'}</option>
              <option value="all_time">{language === 'bn' ? 'সর্বকালীন' : 'All Time'}</option>
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={() => handleExportCsv(activeTab)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#174D35]" />
            <span>{language === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'financial'
              ? 'bg-[#174D35] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'আর্থিক বিবরণ ও বিক্রয়' : 'Financial & Sales'}
        </button>
        <button
          onClick={() => setActiveTab('cod')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cod'
              ? 'bg-[#174D35] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'COD রিকনসিলিয়েশন' : 'COD Reconciliation'}
        </button>
        <button
          onClick={() => setActiveTab('top_products')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'top_products'
              ? 'bg-[#174D35] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'টপ-সেলিং পণ্য' : 'Top Selling Items'}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#174D35] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'ইনভেন্টরি সতর্কতা' : 'Inventory Alerts'}
        </button>
      </div>

      {/* TAB 1: Financial & Sales Summary */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                {language === 'bn' ? 'গ্রস অর্ডার মূল্য (Gross)' : 'Gross Order Value'}
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-2">
                ৳{(metrics?.totalOrderValue ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Non-cancelled order totals</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                {language === 'bn' ? 'ডেলিভার্ড সফল বিক্রয়' : 'Delivered Sales Value'}
              </span>
              <div className="text-2xl font-bold text-emerald-800 mt-2">
                ৳{(metrics?.deliveredOrderValue ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600/80 mt-1">Successfully completed deliveries</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                {language === 'bn' ? 'গড় অর্ডার মূল্য (AOV)' : 'Average Order Value'}
              </span>
              <div className="text-2xl font-bold text-[#174D35] mt-2">
                ৳{(metrics?.averageOrderValue ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Per active order basket</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                {language === 'bn' ? 'মোট রিফান্ড' : 'Total Refunds'}
              </span>
              <div className="text-2xl font-bold text-rose-700 mt-2">
                ৳{(metrics?.totalRefunds ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-rose-600/80 mt-1">Recorded customer refunds</p>
            </div>
          </div>

          {/* Formulas and Accounting Definitions Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'অ্যাকাউন্টিং সংজ্ঞা ও ব্যবসায়িক মেট্রিক্স' : 'Accounting Formulas & Metric Definitions'}
            </h3>
            <div className="divide-y divide-stone-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">Net Sales (নেট বিক্রয়)</span>
                  <p className="text-[11px] text-stone-400">Formula: Delivered Order Value - Verified Refunds</p>
                </div>
                <span className="font-bold text-stone-900 text-sm">৳{(metrics?.netSales ?? 0).toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">Actual Collected Payments (সংগৃহীত টাকা)</span>
                  <p className="text-[11px] text-stone-400">Verified COD cash in hand + Online prepaid payments</p>
                </div>
                <span className="font-bold text-emerald-700 text-sm">৳{(metrics?.actualCollectedPayments ?? 0).toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">Outstanding COD Balance (বকেয়া COD)</span>
                  <p className="text-[11px] text-stone-400">Expected COD on delivered/active orders minus verified collected amounts</p>
                </div>
                <span className="font-bold text-amber-700 text-sm">৳{(metrics?.outstandingCod ?? 0).toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">Profit Calculation Policy</span>
                  <p className="text-[11px] text-stone-400">Inventory purchasing costs and operational nursery overhead</p>
                </div>
                <span className="text-xs text-stone-500 font-medium">Profit data not configured (Cost tracking required)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COD Reconciliation */}
      {activeTab === 'cod' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                {language === 'bn' ? 'প্রত্যাশিত মোট COD' : 'Expected Total COD'}
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-2">
                ৳{((metrics?.actualCollectedPayments ?? 0) + (metrics?.outstandingCod ?? 0)).toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {language === 'bn' ? 'সংগৃহীত COD টাকা' : 'Actual COD Collected'}
              </span>
              <div className="text-2xl font-bold text-emerald-800 mt-2">
                ৳{(metrics?.actualCollectedPayments ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-2xs bg-amber-50/20">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                {language === 'bn' ? 'বকেয়া ক্যাশ ব্যালেন্স' : 'Outstanding COD Balance'}
              </span>
              <div className="text-2xl font-bold text-amber-800 mt-2">
                ৳{(metrics?.outstandingCod ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'bn' ? 'ক্যাশ-অন-ডেলিভারি সমন্বয় নীতি' : 'Cash on Delivery Reconciliation Audit Policy'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              ডেলিভারি সম্পন্ন হলেই কোনো ক্যাশ-অন-ডেলিভারি অর্ডার স্বয়ংক্রিয়ভাবে সংগৃহীত হিসেবে গণ্য হবে না।
              প্রতিটি ডেলিভারি এজেন্টের মাধ্যমে প্রাপ্ত টাকা স্বতন্ত্র অডিট রেকর্ডে সংরক্ষিত হতে হবে।
              বাতিলকৃত বা ফেরত আসা অর্ডার থেকে কোনো বকেয়া যোগ করা হবে না।
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Top Selling Items */}
      {activeTab === 'top_products' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'ঐতিহাসিক অর্ডার অনুযায়ী সর্বাধিক বিক্রীত গাছ ও বীজ' : 'Top Performing Plant & Seed Products'}
            </h3>
            <span className="text-xs text-stone-400">Sorted by Units Sold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[11px] font-semibold uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">{language === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">{language === 'bn' ? 'বিক্রিত ইউনিট' : 'Units Sold'}</th>
                  <th className="py-2.5 px-3">{language === 'bn' ? 'অর্ডার সংখ্যা' : 'Orders Count'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'bn' ? 'গ্রস বিক্রয়' : 'Gross Revenue'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-bold text-stone-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeImageUrl(p.imageUrl, { type: p.type })}
                          alt={p.nameEn}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                          onError={(e) => handleImageError(e, getProductFallbackImage({ type: p.type }))}
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{language === 'bn' ? p.nameBn : p.nameEn}</p>
                          <p className="text-[10px] text-stone-400 capitalize">{p.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">{p.sku}</td>
                    <td className="py-3 px-3 font-bold text-stone-900">{p.unitsSold}</td>
                    <td className="py-3 px-3 text-stone-700">{p.qualifyingOrdersCount}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#174D35]">৳{p.grossSales.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Inventory Alerts */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'ইনভেন্টরি স্টক রিপোর্ট ও অ্যালার্ট' : 'Inventory Stock Levels & Alerts'}
            </h3>
            <span className="text-xs text-stone-400">Threshold: ≤ 10 units</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[11px] font-semibold uppercase">
                  <th className="py-2.5 px-3">{language === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="py-2.5 px-3">{language === 'bn' ? 'মজুদ স্টক' : 'Available Stock'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inventoryAlerts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeImageUrl(item.imageUrl, { categorySlug: item.categorySlug })}
                          alt={item.nameEn}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                          onError={(e) => handleImageError(e, getProductFallbackImage({ categorySlug: item.categorySlug }))}
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{language === 'bn' ? item.nameBn : item.nameEn}</p>
                          <p className="text-[10px] text-stone-400">{item.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">{item.sku}</td>
                    <td className="py-3 px-3 text-stone-600 capitalize">{item.categorySlug}</td>
                    <td className="py-3 px-3 font-bold text-stone-900">{item.stockQuantity}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.stockStatus === 'out_of_stock'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.stockStatus === 'low_stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.stockStatus === 'out_of_stock'
                          ? language === 'bn'
                            ? 'স্টক আউট'
                            : 'Out of Stock'
                          : item.stockStatus === 'low_stock'
                          ? language === 'bn'
                            ? 'লো স্টক'
                            : 'Low Stock'
                          : language === 'bn'
                          ? 'পর্যাপ্ত'
                          : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
