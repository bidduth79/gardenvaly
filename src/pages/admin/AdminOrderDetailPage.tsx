/**
 * @file AdminOrderDetailPage.tsx
 * @description Deep order fulfillment management supporting the 10-stage lifecycle,
 * courier tracking, Cash-on-Delivery reconciliation, stock-safe returns, and audit trails.
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  DollarSign,
  RotateCcw,
  RefreshCw,
  XCircle,
  Package,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminOrder, OrderStatus } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderActionModal, ModalType } from '../../components/admin/OrderActionModal';
import { ORDER_STATUS_REGISTRY, ALLOWED_STATUS_TRANSITIONS } from '../../../server/utils/orderLifecycle';

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
            message: language === 'bn' ? 'স্ট্যাটাস আপডেট সফল হয়েছে!' : 'Order status updated successfully!',
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
            message: language === 'bn' ? 'ক্যাশ কালেকশন অডিটে সংরক্ষিত হয়েছে!' : 'COD collection recorded successfully!',
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
            message: language === 'bn' ? 'রিটার্ন প্রসেস সম্পন্ন হয়েছে!' : 'Return processed successfully!',
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
            message: language === 'bn' ? 'রিফান্ড রেকর্ড করা হয়েছে!' : 'Refund recorded successfully!',
          });
        } else {
          setUpdateFeedback({ type: 'error', message: res.error || 'Failed to record refund' });
        }
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
      <div className="py-20 text-center text-stone-400">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-[#174D35]" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-lg text-stone-900">
          {language === 'bn' ? 'অর্ডারটি খুঁজে পাওয়া যায়নি' : 'Order Not Found'}
        </h3>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-xs font-semibold text-[#174D35] hover:underline"
        >
          {language === 'bn' ? 'অর্ডার তালিকায় ফিরুন' : 'Back to Orders Queue'}
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            title="Back to queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
                {order.orderNumber}
              </h2>
              <span
                style={{
                  color: currentMeta.color,
                  backgroundColor: currentMeta.bgColor,
                  borderColor: currentMeta.borderColor,
                }}
                className="px-3 py-0.5 rounded-full text-xs font-bold border"
              >
                {language === 'bn' ? currentMeta.labelBn : currentMeta.labelEn}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>
        </div>

        {updateFeedback && (
          <div
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
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
      </div>

      {/* Lifecycle Action Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#174D35]" />
            <span>{language === 'bn' ? 'অনুমোদিত অ্যাকশনসমূহ' : 'Permitted Lifecycle Actions'}</span>
          </p>
          <span className="text-[11px] text-stone-400">
            {language === 'bn' ? 'পরবর্তী ধাপে যেতে ক্লিক করুন' : 'Click to transition order state'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {allowedTransitions.includes('confirmed') && (
            <button
              onClick={() => handleOpenStatusModal('confirmed')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              ✓ {language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}
            </button>
          )}

          {allowedTransitions.includes('processing') && (
            <button
              onClick={() => handleOpenStatusModal('processing')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              ⚙ {language === 'bn' ? 'নার্সারিতে প্রস্তুত করুন' : 'Start Processing'}
            </button>
          )}

          {allowedTransitions.includes('packed') && (
            <button
              onClick={() => handleOpenStatusModal('packed')}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              📦 {language === 'bn' ? 'প্যাক সম্পন্ন' : 'Mark Packed'}
            </button>
          )}

          {allowedTransitions.includes('shipped') && (
            <button
              onClick={() => {
                setModalType('delivery');
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              🚚 {language === 'bn' ? 'কুরিয়ারে পাঠান (Ship)' : 'Dispatch / Handover'}
            </button>
          )}

          {allowedTransitions.includes('delivered') && (
            <button
              onClick={() => handleOpenStatusModal('delivered')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              🎉 {language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Mark Delivered'}
            </button>
          )}

          {allowedTransitions.includes('return_requested') && (
            <button
              onClick={() => {
                setModalType('return');
              }}
              className="px-3 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              ↩ {language === 'bn' ? 'রিটার্ন আবেদন' : 'Process Return'}
            </button>
          )}

          {allowedTransitions.includes('refunded') && (
            <button
              onClick={() => {
                setModalType('refund');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              💸 {language === 'bn' ? 'রিফান্ড প্রদান' : 'Record Refund'}
            </button>
          )}

          {allowedTransitions.includes('cancelled') && (
            <button
              onClick={() => handleOpenStatusModal('cancelled')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              ✕ {language === 'bn' ? 'অর্ডার বাতিল' : 'Cancel Order'}
            </button>
          )}

          {allowedTransitions.length === 0 && (
            <span className="text-xs text-stone-500 font-medium">
              {language === 'bn'
                ? 'এই অর্ডারের জন্য কোনো পরবর্তী ধাপ প্রযোজ্য নেই (টার্মিনাল স্ট্যাটাস)'
                : 'No further status transitions available (Terminal status)'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Items, Logistics, and Audit History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#174D35]" />
              <span>{language === 'bn' ? 'অর্ডারকৃত গাছ ও বীজ' : 'Ordered Plant & Seed Items'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-2.5 px-2">{language === 'bn' ? 'পণ্য' : 'Item'}</th>
                    <th className="py-2.5 px-2">{language === 'bn' ? 'অর্ডারকালীন মূল্য' : 'Order Price'}</th>
                    <th className="py-2.5 px-2">{language === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                    <th className="py-2.5 px-2 text-right">{language === 'bn' ? 'মোট' : 'Subtotal'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-stone-900">{item.productName}</p>
                            <p className="text-[10px] text-stone-400 font-mono">SKU / ID: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-stone-700">৳{item.unitPrice}</td>
                      <td className="py-3 px-2 font-semibold text-stone-900">×{item.quantity}</td>
                      <td className="py-3 px-2 text-right font-bold text-stone-900">
                        ৳{item.lineSubtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-stone-100 flex flex-col items-end space-y-1.5 text-xs">
              <div className="flex justify-between w-64 text-stone-600">
                <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}:</span>
                <span className="font-semibold text-stone-800">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between w-64 text-stone-600">
                <span>{language === 'bn' ? 'ডেলিভারি ফি' : 'Delivery Charge'}:</span>
                <span className="font-semibold text-stone-800">৳{order.deliveryCharge}</span>
              </div>
              {order.refundAmount !== undefined && order.refundAmount > 0 && (
                <div className="flex justify-between w-64 text-rose-600 font-semibold">
                  <span>{language === 'bn' ? 'রিফান্ড কর্তন' : 'Refund Issued'}:</span>
                  <span>-৳{order.refundAmount}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>{language === 'bn' ? 'সর্বমোট' : 'Final Total'}:</span>
                <span className="text-[#174D35]">৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Courier & Logistics Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#174D35]" />
                <span>{language === 'bn' ? 'কুরিয়ার ও লজিস্টিকস ট্র্যাকিং' : 'Courier & Logistics Information'}</span>
              </h3>
              <button
                onClick={() => setModalType('delivery')}
                className="text-xs text-[#174D35] hover:underline font-semibold cursor-pointer"
              >
                ✎ {language === 'bn' ? 'তথ্য পরিবর্তন' : 'Edit Courier'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Courier Provider</p>
                <p className="font-bold text-stone-800 mt-0.5">{order.deliveryProvider || 'Not assigned yet'}</p>
              </div>
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Tracking / Consignment ID</p>
                <p className="font-mono font-bold text-stone-800 mt-0.5">{order.trackingNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Dispatched Date</p>
                <p className="text-stone-700 mt-0.5">
                  {order.dispatchDate ? new Date(order.dispatchDate).toLocaleDateString('en-GB') : 'Pending dispatch'}
                </p>
              </div>
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Actual Delivery Date</p>
                <p className="text-stone-700 mt-0.5">
                  {order.actualDeliveryDate ? new Date(order.actualDeliveryDate).toLocaleDateString('en-GB') : 'In transit'}
                </p>
              </div>
            </div>
          </div>

          {/* Immutable Audit Log Trail */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#5C8D50]" />
              <span>{language === 'bn' ? 'অডিট হিস্টোরি ও ট্র্যাকিং লগ' : 'Immutable Order Audit Trail'}</span>
            </h3>

            <div className="space-y-3 border-l-2 border-[#174D35]/30 pl-4 ml-2">
              {order.auditTrail && order.auditTrail.length > 0 ? (
                order.auditTrail.map((log, i) => (
                  <div key={i} className="text-xs relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#174D35] absolute -left-[21px] top-1" />
                    <p className="font-semibold text-stone-800">
                      {log.action}{' '}
                      <span className="text-[10px] text-stone-400 font-normal">
                        • {new Date(log.timestamp).toLocaleString('en-GB')} by {log.performedBy}
                      </span>
                    </p>
                    {log.details && <p className="text-stone-500 text-[11px] mt-0.5">{log.details}</p>}
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-400">
                  Initial order created at {new Date(order.createdAt).toLocaleString('en-GB')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer, Payment/COD, and Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Address Details */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-[#174D35]" />
              <span>{language === 'bn' ? 'গ্রাহকের বিবরণ' : 'Customer Profile & Location'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Full Name</p>
                <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
              </div>

              <div>
                <p className="text-stone-400 text-[10px] uppercase font-semibold">Contact Phone</p>
                <div className="flex items-center gap-1.5 font-mono text-stone-800 font-semibold mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`tel:${order.customer.mobileNumber}`} className="hover:underline">
                    {order.customer.mobileNumber}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <p className="text-stone-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#5C8D50]" />
                  <span>Delivery Address</span>
                </p>
                <p className="text-stone-800 font-medium mt-1 leading-relaxed">
                  {order.customer.addressDetail}
                </p>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  {order.customer.upazila ? `${order.customer.upazila}, ` : ''}
                  {order.customer.district}, {order.customer.division}
                </p>
              </div>

              {order.customer.deliveryInstructions && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px]">
                  <span className="font-bold">Instructions: </span>
                  {order.customer.deliveryInstructions}
                </div>
              )}
            </div>
          </div>

          {/* COD & Payment Reconciliation Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#174D35]" />
                <span>{language === 'bn' ? 'পেমেন্ট ও COD রিকনসিলিয়েশন' : 'Payment & COD Audit'}</span>
              </h3>
              {order.paymentMethod === 'cash-on-delivery' && order.paymentStatus !== 'paid' && (
                <button
                  onClick={() => setModalType('cod-collection')}
                  className="text-xs text-[#174D35] hover:underline font-semibold cursor-pointer"
                >
                  + {language === 'bn' ? 'কালেকশন এন্ট্রি' : 'Record'}
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Method:</span>
                <span className="font-semibold text-stone-800">
                  {order.paymentMethod === 'whatsapp-order' ? 'WhatsApp Order' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Expected COD:</span>
                <span className="font-semibold text-stone-800">৳{order.codExpectedAmount || order.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Collected COD:</span>
                <span className="font-bold text-emerald-700">৳{order.codCollectedAmount || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                <span className="text-stone-500">Outstanding Balance:</span>
                <span className="font-bold text-stone-900">৳{order.codOutstandingBalance ?? order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Internal Nursery Admin Notes */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>{language === 'bn' ? 'অভ্যন্তরীণ অ্যাডমিন নোটস' : 'Internal Nursery Notes'}</span>
            </h3>

            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Nursery seedling package checked before courier dispatch."
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
            />

            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নোট সংরক্ষণ করুন' : 'Save Nursery Note'}</span>
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
    </div>
  );
};
