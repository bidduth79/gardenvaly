/**
 * @file AdminReportsPage.tsx
 * @description Business & Financial Reports page in Slate, Black, and White with Semantic Colors,
 * 1-click A4 PDF Report generation, CSV export, and 100% pure Bengali/English localization.
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Printer,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import {
  DashboardMetrics,
  DateRangeOption,
  TopSellingProduct,
  InventoryAlertItem,
} from '../../types/admin';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/apiClient';
import { AdminPrintModal } from '../../components/admin/AdminPrintModal';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import {
  formatAdminCurrency,
  formatAdminNumber,
  toBnDigits,
  translateCategoryName,
  translateProductType,
} from '../../utils/adminI18n';

export const AdminReportsPage: React.FC = () => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'financial' | 'top_products' | 'inventory' | 'cod'>('financial');
  const [dateRange, setDateRange] = useState<DateRangeOption>('all_time');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportPdf, setShowReportPdf] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const dateRangeLabelMap: Record<DateRangeOption, { bn: string; en: string }> = {
    today: { bn: 'আজকের হিসাব', en: 'Today' },
    yesterday: { bn: 'গতকালের হিসাব', en: 'Yesterday' },
    last_7_days: { bn: 'গত ৭ দিন', en: 'Last 7 Days' },
    last_30_days: { bn: 'গত ৩০ দিন', en: 'Last 30 Days' },
    this_month: { bn: 'চলতি মাস', en: 'This Month' },
    previous_month: { bn: 'পূর্ববর্তী মাস', en: 'Previous Month' },
    all_time: { bn: 'সর্বকালীন হিসাব', en: 'All Time' },
    custom: { bn: 'নির্বাচিত সময়কাল', en: 'Custom Range' },
  };

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
      setFeedback(language === 'bn' ? 'ফাইল ডাউনলোড ব্যর্থ হয়েছে' : 'Failed to export CSV');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with PDF Report & CSV Export Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
          {language === 'bn' ? 'বিক্রয় ও আর্থিক রিপোর্ট' : 'Sales & Financial Reports'}
        </h1>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
              className="bg-transparent font-semibold text-slate-900 pr-2 focus:outline-hidden cursor-pointer"
            >
              <option value="today">{language === 'bn' ? 'আজকের হিসাব' : 'Today'}</option>
              <option value="yesterday">{language === 'bn' ? 'গতকালের হিসাব' : 'Yesterday'}</option>
              <option value="last_7_days">{language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}</option>
              <option value="last_30_days">{language === 'bn' ? 'গত ৩০ দিন' : 'Last 30 Days'}</option>
              <option value="this_month">{language === 'bn' ? 'চলতি মাস' : 'This Month'}</option>
              <option value="previous_month">{language === 'bn' ? 'পূর্ববর্তী মাস' : 'Previous Month'}</option>
              <option value="all_time">{language === 'bn' ? 'সর্বকালীন হিসাব' : 'All Time'}</option>
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={() => handleExportCsv(activeTab)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{language === 'bn' ? 'সিএসভি ডাউনলোড' : 'Export CSV'}</span>
          </button>

          {/* Primary PDF Report Button */}
          <button
            onClick={() => setShowReportPdf(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট / পিডিএফ' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl w-fit overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'financial'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          {language === 'bn' ? 'আর্থিক সারসংক্ষেপ' : 'Financial Summary'}
        </button>
        <button
          onClick={() => setActiveTab('cod')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cod'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          {language === 'bn' ? 'ক্যাশ অন ডেলিভারি হিসাব' : 'COD Reconciliation'}
        </button>
        <button
          onClick={() => setActiveTab('top_products')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'top_products'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          {language === 'bn' ? 'সর্বাধিক বিক্রীত পণ্য' : 'Top Selling Products'}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          {language === 'bn' ? 'স্টক সতর্কতা রিপোর্ট' : 'Inventory Alerts'}
        </button>
      </div>

      {/* TAB 1: Financial & Sales Summary */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'সর্বমোট অর্ডার মূল্য' : 'Gross Order Value'}
              </span>
              <div className="text-2xl font-extrabold text-slate-950 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.totalOrderValue ?? 0, language)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-emerald-600">
                {language === 'bn' ? 'সফল ডেলিভারি বিক্রয়' : 'Delivered Sales Value'}
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.deliveredOrderValue ?? 0, language)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-blue-600">
                {language === 'bn' ? 'গড় অর্ডার মূল্য' : 'Average Order Value'}
              </span>
              <div className="text-2xl font-extrabold text-slate-950 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.averageOrderValue ?? 0, language)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-rose-600">
                {language === 'bn' ? 'মোট মূল্য ফেরত' : 'Total Refunds'}
              </span>
              <div className="text-2xl font-extrabold text-rose-600 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.totalRefunds ?? 0, language)}
              </div>
            </div>
          </div>

          {/* Accounting Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-950 text-base">
              {language === 'bn' ? 'বিস্তারিত আর্থিক হিসাব বিবরণী' : 'Financial Accounting Breakdown'}
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {language === 'bn' ? 'নিট বিক্রয়' : 'Net Sales'}
                </span>
                <span className="font-extrabold text-slate-950 text-sm tabular-nums">
                  {formatAdminCurrency(metrics?.netSales ?? 0, language)}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {language === 'bn' ? 'প্রকৃত আদায়কৃত নগদ টাকা' : 'Actual Collected Payments'}
                </span>
                <span className="font-extrabold text-emerald-600 text-sm tabular-nums">
                  {formatAdminCurrency(metrics?.actualCollectedPayments ?? 0, language)}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {language === 'bn' ? 'বকেয়া ক্যাশ অন ডেলিভারি' : 'Outstanding COD Balance'}
                </span>
                <span className="font-extrabold text-amber-600 text-sm tabular-nums">
                  {formatAdminCurrency(metrics?.outstandingCod ?? 0, language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COD Reconciliation */}
      {activeTab === 'cod' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">
                {language === 'bn' ? 'মোট প্রত্যাশিত ক্যাশ অন ডেলিভারি' : 'Expected Total COD'}
              </span>
              <div className="text-2xl font-extrabold text-slate-950 mt-2 tabular-nums">
                {formatAdminCurrency(
                  (metrics?.actualCollectedPayments ?? 0) + (metrics?.outstandingCod ?? 0),
                  language
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/30">
              <span className="text-xs font-semibold text-emerald-700">
                {language === 'bn' ? 'আদায়কৃত ক্যাশ টাকা' : 'Actual COD Collected'}
              </span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.actualCollectedPayments ?? 0, language)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/30">
              <span className="text-xs font-semibold text-amber-700">
                {language === 'bn' ? 'বকেয়া ক্যাশ ব্যালেন্স' : 'Outstanding COD Balance'}
              </span>
              <div className="text-2xl font-extrabold text-amber-700 mt-2 tabular-nums">
                {formatAdminCurrency(metrics?.outstandingCod ?? 0, language)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Top Selling Items */}
      {activeTab === 'top_products' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-950 text-base">
              {language === 'bn' ? 'সর্বাধিক বিক্রীত গাছ ও বীজের তালিকা' : 'Top Performing Plant & Seed Products'}
            </h3>
            <span className="text-xs text-slate-500">
              {language === 'bn' ? 'বিক্রির সংখ্যা অনুযায়ী সাজানো' : 'Sorted by Units Sold'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'কোড' : 'SKU'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'বিক্রীত সংখ্যা' : 'Units Sold'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'অর্ডার সংখ্যা' : 'Orders'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'মোট বিক্রয় মূল্য' : 'Revenue'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-400 tabular-nums">
                      {formatAdminNumber(idx + 1, language)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeImageUrl(p.imageUrl, { type: p.type })}
                          alt={p.nameEn}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => handleImageError(e, getProductFallbackImage({ type: p.type }))}
                        />
                        <div>
                          <p className="font-semibold text-slate-950">{language === 'bn' ? p.nameBn : p.nameEn}</p>
                          <p className="text-[10px] text-slate-400">
                            {translateProductType(p.type, language)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      {language === 'bn' ? toBnDigits(p.sku) : p.sku}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-950 tabular-nums">
                      {formatAdminNumber(p.unitsSold, language)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 tabular-nums">
                      {formatAdminNumber(p.qualifyingOrdersCount, language)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 tabular-nums">
                      {formatAdminCurrency(p.grossSales, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Inventory Alerts */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-950 text-base">
              {language === 'bn' ? 'স্টক সতর্কতা ও ইনভেন্টরি রিপোর্ট' : 'Inventory Stock Levels & Alerts'}
            </h3>
            <span className="text-xs text-slate-500">
              {language === 'bn' ? '১০ টির কম মজুদ থাকা পণ্য' : 'Threshold: ≤ 10 units'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                  <th className="py-3 px-4">{language === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'কোড' : 'SKU'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'বিভাগ' : 'Category'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'বর্তমান মজুদ' : 'Available Stock'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryAlerts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeImageUrl(item.imageUrl, { categorySlug: item.categorySlug })}
                          alt={item.nameEn}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => handleImageError(e, getProductFallbackImage({ categorySlug: item.categorySlug }))}
                        />
                        <p className="font-semibold text-slate-950">{language === 'bn' ? item.nameBn : item.nameEn}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      {language === 'bn' ? toBnDigits(item.sku) : item.sku}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {translateCategoryName(item.categorySlug, language)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-950 tabular-nums">
                      {formatAdminNumber(item.stockQuantity, language)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                          item.stockStatus === 'out_of_stock'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.stockStatus === 'low_stock'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.stockStatus === 'out_of_stock'
                          ? language === 'bn'
                            ? 'স্টক শেষ'
                            : 'Out of Stock'
                          : item.stockStatus === 'low_stock'
                          ? language === 'bn'
                            ? 'কম স্টক'
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

      {/* Built-in A4 Report PDF Modal */}
      {showReportPdf && (
        <AdminPrintModal
          mode="report"
          metrics={metrics}
          topProducts={topProducts}
          inventoryAlerts={inventoryAlerts}
          dateRangeLabel={
            language === 'bn'
              ? dateRangeLabelMap[dateRange]?.bn || 'সর্বকালীন'
              : dateRangeLabelMap[dateRange]?.en || 'All Time'
          }
          language={language}
          onClose={() => setShowReportPdf(false)}
        />
      )}
    </div>
  );
};
