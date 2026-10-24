/**
 * @file AdminOrderDetailPage.tsx
 * @description Order fulfillment & voucher/invoice management page in Slate, Black, and White
 * with Semantic Status Colors, 1-click A4 PDF Voucher generation, and 100% pure Bengali/English localization.
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Truck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  Package,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Printer,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminOrder, OrderStatus } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderActionModal, ModalType } from '../../components/admin/OrderActionModal';
import { AdminPrintModal } from '../../components/admin/AdminPrintModal';
import { ORDER_STATUS_REGISTRY, ALLOWED_STATUS_TRANSITIONS } from '../../../server/utils/orderLifecycle';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import {
  formatAdminCurrency,
  formatAdminDate,
  formatAdminNumber,
  toBnDigits,
  translateDistrict,
  translatePaymentMethod,
} from '../../utils/adminI18n';

export const AdminOrderDetailPage: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();

  const match = currentPath.match(/\/admin\/orders\/([^/]+)/);
  const orderId = match ? match[1] : null;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showVoucherPdf, setShowVoucherPdf] = useState(false);

  // Modal dialog states
  const [modalType, setModalType] = useState<ModalType>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | undefined>(undefined);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    const data = await orderService.getOrderById(orderId);
    if (data) {
      setOrder(data);
      setAdminNotes(data.adminNotes || '');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleOpenStatusModal = (status: OrderStatus) => {
    setTargetStatus(status);
    setModalType('confirm-status');
  };

  const handleModalSubmit = async (data: any) => {
    if (!order) return;
    setIsUpdating(true);

    try {
      if (modalType === 'confirm-status' && targetStatus) {
        const res = await orderService.updateOrderStatus(order.id, targetStatus, data.note);
        if (res.success && res.order) {
          setOrder(res.order);
          setUpdateFeedback({
            type: 'success',
            message: language === 'bn' ? 'অর্ডারের অবস্থা সফলভাবে হালনাগাদ হয়েছে!' : 'Order status updated successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to update status' });
        }
      } else if (modalType === 'delivery') {
        const res = await orderService.updateDelivery(order.id, data);
        if (res.success && res.order) {
          setOrder(res.order);
          setUpdateFeedback({
            type: 'success',
            message: language === 'bn' ? 'কুরিয়ার তথ্য সংরক্ষিত হয়েছে!' : 'Courier tracking updated successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to update courier info' });
        }
      } else if (modalType === 'cod-collection') {
        const res = await orderService.recordCodCollection(order.id, data);
        if (res.success && res.order) {
          setOrder(res.order);
          setUpdateFeedback({
            type: 'success',
            message: language === 'bn' ? 'নগদ আদায় হিসাব সংরক্ষিত হয়েছে!' : 'COD collection recorded successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to record collection' });
        }
      } else if (modalType === 'return') {
        const res = await orderService.processReturn(order.id, data);
        if (res.success && res.order) {
          setOrder(res.order);
          setUpdateFeedback({
            type: 'success',
            message: language === 'bn' ? 'পণ্য ফেরত প্রক্রিয়া সম্পন্ন হয়েছে!' : 'Return processed successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to process return' });
        }
      } else if (modalType === 'refund') {
        const res = await orderService.recordRefund(order.id, data);
        if (res.success && res.order) {
          setOrder(res.order);
          setUpdateFeedback({
            type: 'success',
            message: language === 'bn' ? 'মূল্য ফেরত হিসাব সংরক্ষিত হয়েছে!' : 'Refund recorded successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to record refund' });
        }
      } else if (modalType === 'send-sms') {
        setUpdateFeedback({
          type: 'success',
          message: language === 'bn' ? 'গ্রাহকের মোবাইলে বার্তা পাঠানো হয়েছে!' : 'SMS dispatched to customer!',
        });
      }
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateFeedback(null), 5000);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    setIsUpdating(true);
    const updated = await orderService.updateOrderNotes(order.id, adminNotes);
    if (updated) {
      setOrder(updated);
      setUpdateFeedback({
        type: 'success',
        message: language === 'bn' ? 'অ্যাডমিন নোট সংরক্ষিত হয়েছে!' : 'Admin notes saved!',
      });
      setTimeout(() => setUpdateFeedback(null), 3000);
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-slate-900" />
        <span>{language === 'bn' ? 'অর্ডারের বিস্তারিত লোড হচ্ছে...' : 'Loading order details...'}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="font-bold text-lg text-slate-950">
          {language === 'bn' ? 'অর্ডারটি খুঁজে পাওয়া যায়নি' : 'Order Not Found'}
        </h3>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          {language === 'bn' ? 'অর্ডার তালিকায় ফিরে যান' : 'Back to Orders'}
        </button>
      </div>
    );
  }

  const currentMeta = ORDER_STATUS_REGISTRY[order.status] || {
    labelEn: order.status,
    labelBn: order.status,
    color: '#15803D',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
  };

  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[order.status] || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header with Prominent Voucher / PDF Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
            title={language === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to orders'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold font-mono text-slate-950">
                #{language === 'bn' ? toBnDigits(order.orderNumber) : order.orderNumber}
              </h1>
              <span
                style={{
                  color: currentMeta.color,
                  backgroundColor: currentMeta.bgColor,
                  borderColor: currentMeta.borderColor,
                }}
                className="px-2.5 py-0.5 rounded-md text-xs font-bold border"
              >
                {language === 'bn' ? currentMeta.labelBn : currentMeta.labelEn}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn' ? 'অর্ডারের তারিখ: ' : 'Placed on: '}
              {formatAdminDate(order.createdAt, language)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {updateFeedback && (
            <div
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                updateFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {updateFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{updateFeedback.message}</span>
            </div>
          )}

          <a
            href={`/admin/voucher/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{language === 'bn' ? 'ভাউচার' : 'Voucher'}</span>
          </a>
        </div>
      </div>

      {/* Lifecycle Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-slate-900" />
            <span>{language === 'bn' ? 'অর্ডারের পদক্ষেপ' : 'Order Actions'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setModalType('send-sms')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
            <span>{language === 'bn' ? 'গ্রাহককে বার্তা পাঠান' : 'Send SMS'}</span>
          </button>

          {allowedTransitions.includes('confirmed') && (
            <button
              onClick={() => handleOpenStatusModal('confirmed')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              ✓ {language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}
            </button>
          )}

          {allowedTransitions.includes('processing') && (
            <button
              onClick={() => handleOpenStatusModal('processing')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              ⚙ {language === 'bn' ? 'পণ্য প্রস্তুত শুরু করুন' : 'Start Processing'}
            </button>
          )}

          {allowedTransitions.includes('packed') && (
            <button
              onClick={() => handleOpenStatusModal('packed')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              📦 {language === 'bn' ? 'প্যাকিং সম্পন্ন' : 'Mark Packed'}
            </button>
          )}

          {allowedTransitions.includes('shipped') && (
            <button
              onClick={() => setModalType('delivery')}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              🚚 {language === 'bn' ? 'কুরিয়ারে হস্তান্তর করুন' : 'Dispatch / Ship'}
            </button>
          )}

          {allowedTransitions.includes('delivered') && (
            <button
              onClick={() => handleOpenStatusModal('delivered')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              ✓ {language === 'bn' ? 'ডেলিভারি সম্পন্ন করুন' : 'Mark Delivered'}
            </button>
          )}

          {allowedTransitions.includes('return_requested') && (
            <button
              onClick={() => setModalType('return')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              ↩ {language === 'bn' ? 'পণ্য ফেরত আবেদন' : 'Process Return'}
            </button>
          )}

          {allowedTransitions.includes('refunded') && (
            <button
              onClick={() => setModalType('refund')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'মূল্য ফেরত প্রদান' : 'Record Refund'}
            </button>
          )}

          {allowedTransitions.includes('cancelled') && (
            <button
              onClick={() => handleOpenStatusModal('cancelled')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              ✕ {language === 'bn' ? 'অর্ডার বাতিল করুন' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Items, Logistics, and Audit History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
                <span>{language === 'bn' ? 'অর্ডারকৃত পণ্যের তালিকা' : 'Ordered Items'}</span>
              </h3>
              <button
                onClick={() => setShowVoucherPdf(true)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ভাউচার প্রিন্ট' : 'Print Voucher'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-2.5 px-2">{language === 'bn' ? 'পণ্য' : 'Item'}</th>
                    <th className="py-2.5 px-2">{language === 'bn' ? 'একক মূল্য' : 'Unit Price'}</th>
                    <th className="py-2.5 px-2">{language === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                    <th className="py-2.5 px-2 text-right">{language === 'bn' ? 'মোট মূল্য' : 'Subtotal'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={getSafeImageUrl(item.imageUrl)}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => handleImageError(e, getProductFallbackImage())}
                          />
                          <div>
                            <p className="font-semibold text-slate-950">
                              {language === 'bn' ? item.productNameBn || item.productName : item.productName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {language === 'bn' ? `কোড: ${toBnDigits(item.productId)}` : `Code: ${item.productId}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-700 tabular-nums">
                        {formatAdminCurrency(item.unitPrice, language)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-950 tabular-nums">
                        ×{formatAdminNumber(item.quantity, language)}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-slate-950 tabular-nums">
                        {formatAdminCurrency(item.lineSubtotal, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1.5 text-xs">
              <div className="flex justify-between w-64 text-slate-600">
                <span>{language === 'bn' ? 'পণ্যের উপমোট:' : 'Subtotal:'}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatAdminCurrency(order.subtotal, language)}
                </span>
              </div>
              <div className="flex justify-between w-64 text-slate-600">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatAdminCurrency(order.deliveryCharge, language)}
                </span>
              </div>
              {order.refundAmount !== undefined && order.refundAmount > 0 && (
                <div className="flex justify-between w-64 text-rose-600 font-semibold">
                  <span>{language === 'bn' ? 'মূল্য ফেরত কর্তন:' : 'Refund Issued:'}</span>
                  <span className="tabular-nums">-{formatAdminCurrency(order.refundAmount, language)}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                <span>{language === 'bn' ? 'সর্বমোট বিল:' : 'Final Total:'}</span>
                <span className="text-emerald-600 tabular-nums">
                  {formatAdminCurrency(order.totalAmount, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Courier & Logistics Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-900" />
                <span>{language === 'bn' ? 'কুরিয়ার ও ডেলিভারি তথ্য' : 'Courier & Logistics Information'}</span>
              </h3>
              <button
                onClick={() => setModalType('delivery')}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                ✎ {language === 'bn' ? 'কুরিয়ার তথ্য পরিবর্তন' : 'Edit Courier'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'কুরিয়ার সার্ভিস' : 'Courier Provider'}
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {order.deliveryProvider || (language === 'bn' ? 'এখনও নির্ধারিত হয়নি' : 'Not assigned yet')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'ট্র্যাকিং / কনসাইনমেন্ট আইডি' : 'Tracking / Consignment ID'}
                </p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">
                  {order.trackingNumber || (language === 'bn' ? 'প্রযোজ্য নয়' : 'N/A')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'কুরিয়ারে প্রেরণের তারিখ' : 'Dispatched Date'}
                </p>
                <p className="text-slate-700 mt-0.5">
                  {order.dispatchDate
                    ? formatAdminDate(order.dispatchDate, language)
                    : language === 'bn'
                    ? 'অপেক্ষমাণ'
                    : 'Pending dispatch'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'ডেলিভারি সম্পন্ন তারিখ' : 'Actual Delivery Date'}
                </p>
                <p className="text-slate-700 mt-0.5">
                  {order.actualDeliveryDate
                    ? formatAdminDate(order.actualDeliveryDate, language)
                    : language === 'bn'
                    ? 'চলমান'
                    : 'In transit'}
                </p>
              </div>

              {(order.trackingUrl || order.trackingNumber) && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-slate-500 text-xs">
                    {language === 'bn' ? 'সরাসরি কুরিয়ার ট্র্যাকিং লিঙ্ক:' : 'Direct Live Courier Tracking:'}
                  </span>
                  <a
                    href={order.trackingUrl || `https://steadfast.com.bd/t/${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors w-fit"
                  >
                    <span>{language === 'bn' ? 'কুরিয়ার পোর্টালে ট্র্যাক করুন' : 'Track on Courier'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Audit Log Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? 'অর্ডার কার্যক্রম লগ' : 'Order Activity History'}</span>
            </h3>

            <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
              {order.auditTrail && order.auditTrail.length > 0 ? (
                order.auditTrail.map((log, i) => (
                  <div key={i} className="text-xs relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute -left-[21px] top-1" />
                    <p className="font-semibold text-slate-900">
                      {log.action}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        • {formatAdminDate(log.timestamp, language)}
                      </span>
                    </p>
                    {log.details && <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">
                  {language === 'bn'
                    ? `অর্ডার তৈরি হয়েছে: ${formatAdminDate(order.createdAt, 'bn')}`
                    : `Order created on ${formatAdminDate(order.createdAt, 'en')}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer, Payment/COD, and Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Address Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-slate-900" />
              <span>{language === 'bn' ? 'গ্রাহকের বিবরণ ও ঠিকানা' : 'Customer Profile & Location'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'গ্রাহকের নাম' : 'Full Name'}
                </p>
                <p className="font-bold text-slate-950 text-sm">{order.customer.fullName}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Contact Phone'}
                </p>
                <div className="flex items-center gap-1.5 font-mono text-slate-900 font-semibold mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${order.customer.mobileNumber}`} className="hover:underline">
                    {language === 'bn' ? toBnDigits(order.customer.mobileNumber) : order.customer.mobileNumber}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</span>
                </p>
                <p className="text-slate-900 font-medium mt-1 leading-relaxed">
                  {order.customer.addressDetail}
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {translateDistrict(order.customer.district, language)}
                </p>
              </div>

              {order.customer.deliveryInstructions && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <span className="font-bold">
                    {language === 'bn' ? 'নির্দেশনা: ' : 'Instructions: '}
                  </span>
                  {order.customer.deliveryInstructions}
                </div>
              )}
            </div>
          </div>

          {/* COD & Payment Reconciliation Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-900" />
                <span>{language === 'bn' ? 'পেমেন্ট ও ক্যাশ হিসাব' : 'Payment & COD Audit'}</span>
              </h3>
              {order.paymentMethod === 'cash-on-delivery' && order.paymentStatus !== 'paid' && (
                <button
                  onClick={() => setModalType('cod-collection')}
                  className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                >
                  + {language === 'bn' ? 'টাকা আদায় এন্ট্রি' : 'Record COD'}
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Method:'}</span>
                <span className="font-semibold text-slate-900">
                  {translatePaymentMethod(order.paymentMethod, language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{language === 'bn' ? 'পেমেন্ট অবস্থা:' : 'Status:'}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md text-[11px] border ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {order.paymentStatus === 'paid'
                    ? language === 'bn'
                      ? 'পরিশোধিত'
                      : 'PAID'
                    : language === 'bn'
                    ? 'বকেয়া'
                    : 'UNPAID'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{language === 'bn' ? 'মোট প্রদেয় টাকা:' : 'Expected Amount:'}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatAdminCurrency(order.codExpectedAmount || order.totalAmount, language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{language === 'bn' ? 'আদায়কৃত টাকা:' : 'Collected Amount:'}</span>
                <span className="font-bold text-emerald-600 tabular-nums">
                  {formatAdminCurrency(order.codCollectedAmount || 0, language)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'বকেয়া টাকা:' : 'Outstanding Balance:'}</span>
                <span className="font-bold text-amber-600 tabular-nums">
                  {formatAdminCurrency(order.codOutstandingBalance ?? order.totalAmount, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Internal Admin Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{language === 'bn' ? 'অ্যাডমিন নোট' : 'Internal Admin Notes'}</span>
            </h3>

            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'এই অর্ডার সম্পর্কিত যেকোনো নোট এখানে লিখুন...'
                  : 'Write internal order handling notes here...'
              }
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />

            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নোট সংরক্ষণ করুন' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <OrderActionModal
        type={modalType}
        order={order}
        targetStatus={targetStatus}
        isOpen={modalType !== null}
        onClose={() => {
          setModalType(null);
          setTargetStatus(undefined);
        }}
        onSubmit={handleModalSubmit}
      />

      {/* Built-in A4 Voucher PDF Modal */}
      {showVoucherPdf && (
        <AdminPrintModal
          mode="voucher"
          order={order}
          language={language}
          onClose={() => setShowVoucherPdf(false)}
        />
      )}
    </div>
  );
};
