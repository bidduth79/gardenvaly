/**
 * @file AdminOrdersPage.tsx
 * @description Clean Laravel Filament-style Orders Resource Table in Slate, Black, and White
 * with Semantic Status Colors and 100% pure Bengali ('bn') or English ('en') localization.
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminOrder, OrderStatus, PaymentStatus } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderActionModal, ModalType } from '../../components/admin/OrderActionModal';
import { AdminPrintModal } from '../../components/admin/AdminPrintModal';
import { apiClient } from '../../services/apiClient';
import {
  formatAdminCurrency,
  formatAdminDate,
  formatAdminNumber,
  toBnDigits,
  translateDistrict,
  translatePaymentMethod,
} from '../../utils/adminI18n';

export const AdminOrdersPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [deliveryAreaFilter, setDeliveryAreaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_total' | 'lowest_total'>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Modal State
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | undefined>(undefined);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [voucherOrder, setVoucherOrder] = useState<AdminOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrdersPaginated({
        search: searchTerm,
        status: statusFilter as any,
        paymentStatus: paymentStatusFilter as any,
        paymentMethod: 'all',
        deliveryArea: deliveryAreaFilter as any,
        sortBy,
        page,
        limit: pageSize,
      });
      setOrders(res.orders);
      setTotalOrdersCount(res.total);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, paymentStatusFilter, deliveryAreaFilter, sortBy, page]);

  const openStatusModal = (order: AdminOrder, status: OrderStatus) => {
    setSelectedOrder(order);
    setTargetStatus(status);
    setModalType('confirm-status');
  };

  const handleModalSubmit = async (data: any) => {
    if (!selectedOrder) return;

    if (modalType === 'confirm-status' && targetStatus) {
      const res = await orderService.updateOrderStatus(selectedOrder.id, targetStatus, data.note);
      if (res.success) {
        setActionFeedback({
          type: 'success',
          message:
            language === 'bn'
              ? `অর্ডার #${toBnDigits(selectedOrder.orderNumber)} এর অবস্থা হালনাগাদ করা হয়েছে`
              : `Order #${selectedOrder.orderNumber} status updated to ${targetStatus}`,
        });
      } else {
        setActionFeedback({
          type: 'error',
          message:
            res.error ||
            (language === 'bn' ? 'অর্ডারের অবস্থা পরিবর্তন করা যায়নি' : 'Failed to update order status'),
        });
      }
    }

    fetchOrders();
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const handleExportCsv = async () => {
    try {
      const token = apiClient.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders/export/csv', { headers });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gardenvaly-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setActionFeedback({
        type: 'error',
        message: language === 'bn' ? 'ফাইল ডাউনলোড ব্যর্থ হয়েছে' : 'Failed to export CSV',
      });
    }
  };

  const renderStatusText = (status: OrderStatus) => {
    const labels: Record<OrderStatus, { bn: string; en: string; cls: string }> = {
      pending: { bn: 'অপেক্ষমাণ', en: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      confirmed: { bn: 'নিশ্চিতকৃত', en: 'Confirmed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      processing: { bn: 'প্রস্তুত হচ্ছে', en: 'Processing', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      packed: { bn: 'প্যাকিং সম্পন্ন', en: 'Packed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      shipped: { bn: 'পথে আছে', en: 'Shipped', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
      delivered: { bn: 'ডেলিভারি সম্পন্ন', en: 'Delivered', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      cancelled: { bn: 'বাতিল', en: 'Cancelled', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
      return_requested: { bn: 'ফেরত অনুরোধ', en: 'Return Req.', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      returned: { bn: 'পণ্য ফেরত', en: 'Returned', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
      refunded: { bn: 'মূল্য ফেরত', en: 'Refunded', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
    };
    const item = labels[status] || { bn: status, en: status, cls: 'bg-slate-100 text-slate-800 border-slate-200' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${item.cls}`}>
        {language === 'bn' ? item.bn : item.en}
      </span>
    );
  };

  const renderPaymentText = (paymentStatus: PaymentStatus, method: string) => {
    const isPaid = paymentStatus === 'paid';
    return (
      <div className="text-xs">
        <span className={isPaid ? 'text-emerald-600 font-bold' : 'text-amber-600 font-semibold'}>
          {isPaid
            ? language === 'bn'
              ? '✓ পরিশোধিত'
              : '✓ Paid'
            : paymentStatus === 'refunded'
            ? language === 'bn'
              ? 'মূল্য ফেরত'
              : 'Refunded'
            : language === 'bn'
            ? 'বকেয়া'
            : 'Unpaid'}
        </span>
        <span className="text-slate-400 mx-1" aria-hidden="true">·</span>
        <span className="text-slate-500">{translatePaymentMethod(method, language)}</span>
      </div>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalOrdersCount / pageSize));

  const statusTabs = [
    { id: 'all', bn: 'সব অর্ডার', en: 'All' },
    { id: 'pending', bn: 'অপেক্ষমাণ', en: 'Pending' },
    { id: 'confirmed', bn: 'নিশ্চিতকৃত', en: 'Confirmed' },
    { id: 'processing', bn: 'প্রস্তুত হচ্ছে', en: 'Processing' },
    { id: 'shipped', bn: 'পথে আছে', en: 'Shipped' },
    { id: 'delivered', bn: 'ডেলিভারি সম্পন্ন', en: 'Delivered' },
    { id: 'cancelled', bn: 'বাতিল', en: 'Cancelled' },
  ];

  return (
    <div className="space-y-5">
      {/* Laravel Filament Resource Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
            {language === 'bn' ? 'অর্ডারসমূহ' : 'Orders'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {language === 'bn'
              ? `মোট ${formatAdminNumber(totalOrdersCount, 'bn')} টি অর্ডার তালিকাভুক্ত রয়েছে`
              : `Showing ${totalOrdersCount} customer orders`}
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'bn' ? 'তালিকা ডাউনলোড' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Feedback Notification */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between border ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button onClick={() => setActionFeedback(null)} className="opacity-70 hover:opacity-100 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Unified Laravel Filament Resource Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Top Segmented Status Tabs Bar */}
        <div className="px-4 pt-3 pb-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-slate-950 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? tab.bn : tab.en}
            </button>
          ))}
        </div>

        {/* Search & Secondary Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder={
                language === 'bn' ? 'অর্ডার নং, নাম বা মোবাইল নম্বর...' : 'Search order #, name, phone...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">{language === 'bn' ? 'সকল পেমেন্ট' : 'All Payments'}</option>
              <option value="unpaid">{language === 'bn' ? 'বকেয়া পেমেন্ট' : 'Unpaid'}</option>
              <option value="paid">{language === 'bn' ? 'পরিশোধিত পেমেন্ট' : 'Paid'}</option>
            </select>

            <select
              value={deliveryAreaFilter}
              onChange={(e) => {
                setDeliveryAreaFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">{language === 'bn' ? 'সকল এলাকা' : 'All Areas'}</option>
              <option value="dhaka">{language === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</option>
              <option value="outside_dhaka">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="newest">{language === 'bn' ? 'নতুন অর্ডার আগে' : 'Newest First'}</option>
              <option value="oldest">{language === 'bn' ? 'পুরাতন অর্ডার আগে' : 'Oldest First'}</option>
              <option value="highest_total">{language === 'bn' ? 'সর্বোচ্চ মূল্য আগে' : 'Highest Total'}</option>
            </select>
          </div>
        </div>

        {/* High-Density Orders Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[740px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'অর্ডার নং ও তারিখ' : 'Order'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'গ্রাহক ও ঠিকানা' : 'Customer'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'পণ্যের বিবরণ' : 'Items'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'পেমেন্ট তথ্য' : 'Payment'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'মোট মূল্য' : 'Total'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'পদক্ষেপ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>{language === 'bn' ? 'অর্ডার লোড হচ্ছে...' : 'Loading orders...'}</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-7 h-7 mx-auto mb-2 opacity-40" />
                    <span>{language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found.'}</span>
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-mono font-semibold text-slate-950 tabular-nums">
                        {language === 'bn' ? toBnDigits(ord.orderNumber) : ord.orderNumber}
                      </p>
                      <p className="text-[11px] text-slate-400 tabular-nums">
                        {formatAdminDate(ord.createdAt, language)}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-950">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        {language === 'bn' ? toBnDigits(ord.customer.mobileNumber) : ord.customer.mobileNumber} ·{' '}
                        {translateDistrict(ord.customer.district, language)}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 tabular-nums">
                        {formatAdminNumber(ord.items.length, language)}
                      </span>{' '}
                      <span className="text-slate-500 text-xs">{language === 'bn' ? 'টি পণ্য' : 'items'}</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {language === 'bn'
                          ? ord.items[0]?.productNameBn || ord.items[0]?.productName
                          : ord.items[0]?.productName}
                      </p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderPaymentText(ord.paymentStatus, ord.paymentMethod)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        {renderStatusText(ord.status)}
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => openStatusModal(ord, 'confirmed')}
                            className="text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline text-left font-semibold cursor-pointer"
                          >
                            + {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => openStatusModal(ord, 'processing')}
                            className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline text-left font-semibold cursor-pointer"
                          >
                            + {language === 'bn' ? 'প্রস্তুত করুন' : 'Process'}
                          </button>
                        )}
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => openStatusModal(ord, 'shipped')}
                            className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline text-left font-semibold cursor-pointer"
                          >
                            + {language === 'bn' ? 'কুরিয়ারে পাঠান' : 'Ship'}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
                      {formatAdminCurrency(ord.totalAmount, language)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <a
                          href={`/admin/voucher/${ord.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md bg-white hover:bg-slate-950 text-slate-950 hover:text-white border border-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                          title={language === 'bn' ? 'আলাদা ট্যাবে সাদাকালো ভাউচার ওপেন করুন' : 'Open Black & White Voucher in New Tab'}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ভাউচার' : 'Voucher'}</span>
                        </a>
                        <button
                          onClick={() => navigate(`/admin/orders/${ord.id}`)}
                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-slate-900 hover:bg-slate-100 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
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

        {/* Clean Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/40 text-xs">
            <span className="text-slate-500 tabular-nums">
              {language === 'bn'
                ? `পৃষ্ঠা ${formatAdminNumber(page, 'bn')} / ${formatAdminNumber(totalPages, 'bn')}`
                : `Page ${page} of ${totalPages}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderActionModal
          type={modalType}
          order={selectedOrder}
          targetStatus={targetStatus}
          isOpen={modalType !== null}
          onClose={() => {
            setModalType(null);
            setSelectedOrder(null);
            setTargetStatus(undefined);
          }}
          onSubmit={handleModalSubmit}
        />
      )}

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
