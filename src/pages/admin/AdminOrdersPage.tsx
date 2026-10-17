/**
 * @file AdminOrdersPage.tsx
 * @description Comprehensive order management page supporting the full 10-stage lifecycle,
 * COD collection status, multi-criteria filtering, pagination, and secure CSV export.
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MessageSquare,
  ArrowUpRight,
  Download,
  DollarSign,
  RotateCcw,
  RefreshCw,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminOrder, OrderStatus, PaymentStatus } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderActionModal, ModalType } from '../../components/admin/OrderActionModal';
import { apiClient } from '../../services/apiClient';

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
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [deliveryAreaFilter, setDeliveryAreaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_total' | 'lowest_total'>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Modal State
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | undefined>(undefined);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrdersPaginated({
        search: searchTerm,
        status: statusFilter as any,
        paymentStatus: paymentStatusFilter as any,
        paymentMethod: paymentMethodFilter as any,
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
  }, [searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, deliveryAreaFilter, sortBy, page]);

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
              ? `অর্ডার #${selectedOrder.orderNumber} এর স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে`
              : `Order #${selectedOrder.orderNumber} status successfully updated to ${targetStatus}`,
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: res.error || 'Failed to update order status',
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
      alert(language === 'bn' ? 'CSV এক্সপোর্ট ব্যর্থ হয়েছে' : 'Failed to export CSV');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {language === 'bn' ? 'নতুন অর্ডার' : 'Pending'}
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {language === 'bn' ? 'অর্ডার নিশ্চিত' : 'Confirmed'}
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            {language === 'bn' ? 'প্রস্তুত হচ্ছে' : 'Processing'}
          </span>
        );
      case 'packed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            {language === 'bn' ? 'প্যাক করা হয়েছে' : 'Packed'}
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            {language === 'bn' ? 'শিপড' : 'Shipped'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {language === 'bn' ? 'ডেলিভার্ড' : 'Delivered'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {language === 'bn' ? 'বাতিল' : 'Cancelled'}
          </span>
        );
      case 'return_requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
            {language === 'bn' ? 'রিটার্ন অনুরোধ' : 'Return Req.'}
          </span>
        );
      case 'returned':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            {language === 'bn' ? 'পণ্য ফেরত' : 'Returned'}
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            {language === 'bn' ? 'টাকা ফেরত' : 'Refunded'}
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus: PaymentStatus, method: string) => {
    const isPaid = paymentStatus === 'paid';
    return (
      <div className="flex flex-col gap-0.5">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
            isPaid
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : paymentStatus === 'refunded'
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isPaid
            ? language === 'bn'
              ? 'পরিশোধিত (Paid)'
              : 'Paid'
            : paymentStatus === 'refunded'
            ? language === 'bn'
              ? 'রিফান্ডেড (Refunded)'
              : 'Refunded'
            : language === 'bn'
            ? 'বকেয়া (Unpaid)'
            : 'Unpaid'}
        </span>
        <span className="text-[10px] text-stone-400">
          {method === 'online-bkash' ? 'bKash' : 'Cash on Delivery'}
        </span>
      </div>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalOrdersCount / pageSize));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'অর্ডার ব্যবস্থাপনা' : 'Customer Orders Management'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'সম্পূর্ণ ১০-ধাপের অর্ডার লাইফসাইকেল, কুরিয়ার ট্র্যাকিং ও ক্যাশ-অন-ডেলিভারি সমন্বয়'
              : 'End-to-end 10-stage order lifecycle, courier logistics, and COD cash reconciliation'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#174D35]" />
            <span>{language === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold shadow-xs">
            {language === 'bn' ? `মোট ${totalOrdersCount} টি অর্ডার` : `Total ${totalOrdersCount} Orders`}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button onClick={() => setActionFeedback(null)} className="text-stone-400 hover:text-stone-600">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder={
                language === 'bn' ? 'অর্ডার নম্বর, কাস্টমারের নাম বা ফোন...' : 'Search by order #, phone, name...'
              }
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
            />
          </div>

          {/* 10-Stage Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
            >
              <option value="all">{language === 'bn' ? 'সকল অর্ডার স্ট্যাটাস' : 'All Order Statuses'}</option>
              <option value="pending">1. Pending (নতুন অর্ডার)</option>
              <option value="confirmed">2. Confirmed (অর্ডার নিশ্চিত)</option>
              <option value="processing">3. Processing (প্রস্তুত হচ্ছে)</option>
              <option value="packed">4. Packed (প্যাক করা হয়েছে)</option>
              <option value="shipped">5. Shipped (ডেলিভারির পথে)</option>
              <option value="delivered">6. Delivered (ডেলিভার্ড)</option>
              <option value="cancelled">7. Cancelled (বাতিল)</option>
              <option value="return_requested">8. Return Requested (অনুরোধ)</option>
              <option value="returned">9. Returned (ফেরত এসেছে)</option>
              <option value="refunded">10. Refunded (রিফান্ডেড)</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
            >
              <option value="all">{language === 'bn' ? 'সকল পেমেন্ট স্ট্যাটাস' : 'All Payment States'}</option>
              <option value="unpaid">{language === 'bn' ? 'বকেয়া (Unpaid)' : 'Unpaid'}</option>
              <option value="paid">{language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid'}</option>
              <option value="partially_refunded">{language === 'bn' ? 'আংশিক রিফান্ড' : 'Partially Refunded'}</option>
              <option value="refunded">{language === 'bn' ? 'সম্পূর্ণ রিফান্ড' : 'Refunded'}</option>
            </select>
          </div>

          {/* Delivery Area Filter */}
          <div>
            <select
              value={deliveryAreaFilter}
              onChange={(e) => {
                setDeliveryAreaFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
            >
              <option value="all">{language === 'bn' ? 'সকল ডেলিভারি এলাকা' : 'All Delivery Areas'}</option>
              <option value="dhaka">{language === 'bn' ? 'ঢাকার ভেতরে (৳৬০)' : 'Inside Dhaka (৳60)'}</option>
              <option value="outside_dhaka">{language === 'bn' ? 'ঢাকার বাইরে (৳১২০)' : 'Outside Dhaka (৳120)'}</option>
            </select>
          </div>
        </div>

        {/* Secondary Bar: Sorting */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span>{language === 'bn' ? 'সাজান:' : 'Sort by:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 border border-stone-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-[#174D35]"
            >
              <option value="newest">{language === 'bn' ? 'সর্বশেষ অর্ডার (Newest)' : 'Newest First'}</option>
              <option value="oldest">{language === 'bn' ? 'পুরাতন অর্ডার (Oldest)' : 'Oldest First'}</option>
              <option value="highest_total">{language === 'bn' ? 'সর্বোচ্চ মূল্য (Highest Total)' : 'Highest Total'}</option>
              <option value="lowest_total">{language === 'bn' ? 'সর্বনিম্ন মূল্য (Lowest Total)' : 'Lowest Total'}</option>
            </select>
          </div>
          <div>
            {language === 'bn' ? `পৃষ্ঠা ${page} এর ${totalPages}` : `Page ${page} of ${totalPages}`}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-xs sm:text-sm min-w-[760px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'অর্ডার ও তারিখ' : 'Order & Date'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'গ্রাহক তথ্য' : 'Customer & Location'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'আইটেম' : 'Items'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'মোট মূল্য' : 'Total'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'পেমেন্ট ও চ্যানেল' : 'Payment'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'লাইফসাইকেল স্ট্যাটাস' : 'Lifecycle Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="w-6 h-6 border-2 border-[#174D35] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>{language === 'bn' ? 'অর্ডার লোড হচ্ছে...' : 'Loading orders...'}</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>{language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found matching criteria.'}</span>
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Order Number & Date */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-stone-900">{ord.orderNumber}</p>
                      <p className="text-[11px] text-stone-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      {ord.deliveryProvider && (
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          🚚 {ord.deliveryProvider}
                        </p>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{ord.customer.fullName}</p>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{ord.customer.mobileNumber}</span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {[ord.customer.union, ord.customer.upazila, ord.customer.district || 'Dhaka', ord.customer.division || 'Dhaka'].filter(Boolean).join(', ')}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{ord.items.length}</span>{' '}
                      <span className="text-stone-500 text-xs">
                        {language === 'bn' ? 'টি আইটেম' : 'items'}
                      </span>
                      <p className="text-[11px] text-stone-400 truncate max-w-[130px]">
                        {ord.items[0]?.productName}
                        {ord.items.length > 1 ? ` +${ord.items.length - 1} more` : ''}
                      </p>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 text-sm">৳{ord.totalAmount.toLocaleString()}</span>
                      {ord.codOutstandingBalance !== undefined && ord.codOutstandingBalance > 0 && (
                        <p className="text-[10px] text-amber-700 font-medium">
                          বকেয়া: ৳{ord.codOutstandingBalance}
                        </p>
                      )}
                    </td>

                    {/* Payment Status & Channel */}
                    <td className="py-3.5 px-4">
                      {getPaymentBadge(ord.paymentStatus, ord.paymentMethod)}
                    </td>

                    {/* Lifecycle Status & Quick Transition */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div>{getStatusBadge(ord.status)}</div>
                        {/* Quick state transitions */}
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => openStatusModal(ord, 'confirmed')}
                            className="text-[10px] text-blue-700 hover:underline text-left font-medium"
                          >
                            + {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => openStatusModal(ord, 'processing')}
                            className="text-[10px] text-purple-700 hover:underline text-left font-medium"
                          >
                            + {language === 'bn' ? 'প্রস্তুত করুন' : 'Process'}
                          </button>
                        )}
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => openStatusModal(ord, 'packed')}
                            className="text-[10px] text-teal-700 hover:underline text-left font-medium"
                          >
                            + {language === 'bn' ? 'প্যাক করুন' : 'Mark Packed'}
                          </button>
                        )}
                        {ord.status === 'packed' && (
                          <button
                            onClick={() => openStatusModal(ord, 'shipped')}
                            className="text-[10px] text-sky-700 hover:underline text-left font-medium"
                          >
                            + {language === 'bn' ? 'ডিসপ্যাচ করুন' : 'Ship'}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Details Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${ord.id}`)}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 bg-stone-50/50 text-xs">
            <span className="text-stone-500">
              {language === 'bn'
                ? `মোট ${totalOrdersCount} টির মধ্যে ${(page - 1) * pageSize + 1} - ${Math.min(
                    page * pageSize,
                    totalOrdersCount
                  )} দেখানো হচ্ছে`
                : `Showing ${(page - 1) * pageSize + 1} - ${Math.min(
                    page * pageSize,
                    totalOrdersCount
                  )} of ${totalOrdersCount} orders`}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-stone-700">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
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
    </div>
  );
};
