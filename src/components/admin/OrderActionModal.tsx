/**
 * @file OrderActionModal.tsx
 * @description Confirmation and parameterized action dialogs for order lifecycle events.
 */

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Truck,
  DollarSign,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  Zap,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminOrder, OrderStatus } from '../../types/order';
import { integrationService } from '../../services/integrationService';

export type ModalType =
  | 'confirm-status'
  | 'delivery'
  | 'cod-collection'
  | 'return'
  | 'refund'
  | 'send-sms'
  | null;

interface OrderActionModalProps {
  type: ModalType;
  order: AdminOrder;
  targetStatus?: OrderStatus;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const OrderActionModal: React.FC<OrderActionModalProps> = ({
  type,
  order,
  targetStatus,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [note, setNote] = useState('');
  const [courierName, setCourierName] = useState(order.deliveryProvider || 'Steadfast Courier');
  const [courierProviderKey, setCourierProviderKey] = useState<'steadfast' | 'pathao' | 'redx' | 'manual'>('steadfast');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [expectedDate, setExpectedDate] = useState(order.expectedDeliveryDate || '');
  const [codAmount, setCodAmount] = useState(String(order.codOutstandingBalance ?? order.totalAmount));
  const [staffName, setStaffName] = useState(order.codCollectedByStaff || 'Nursery Delivery Staff');
  const [returnReason, setReturnReason] = useState('Customer changed mind / Damaged in transit');
  const [restoreStock, setRestoreStock] = useState(true);
  const [refundAmount, setRefundAmount] = useState(String(order.totalAmount));
  const [refundReason, setRefundReason] = useState('Damaged plant / customer dissatisfied');

  // SMS states
  const [smsEvent, setSmsEvent] = useState<'order_confirmed' | 'order_shipped' | 'order_delivered' | 'custom'>('order_shipped');
  const [smsMessage, setSmsMessage] = useState(
    `গার্ডেনভ্যালি: আপনার অর্ডার #${order.orderNumber} কুরিয়ারে পাঠানো হয়েছে। শীঘ্রই ডেলিভারি পাবেন।`
  );
  const [courierBookingLoading, setCourierBookingLoading] = useState(false);
  const [courierSuccessMsg, setCourierSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'send-sms') {
        const res = await integrationService.sendSms({
          to: order.customer.mobileNumber,
          message: smsMessage,
          event: smsEvent,
          orderId: order.id,
        });
        if (res.success) {
          await onSubmit({ smsSent: true, result: res.data });
        } else {
          setError(res.error || 'Failed to dispatch SMS');
          setLoading(false);
          return;
        }
      } else if (type === 'confirm-status') {
        await onSubmit({ status: targetStatus, note });
      } else if (type === 'delivery') {
        await onSubmit({
          deliveryProvider: courierName,
          trackingNumber,
          expectedDeliveryDate: expectedDate,
          deliveryNotes: note,
          dispatchDate: new Date().toISOString(),
        });
      } else if (type === 'cod-collection') {
        const num = parseFloat(codAmount);
        if (isNaN(num) || num < 0) {
          setError(language === 'bn' ? 'সঠিক টাকার পরিমাণ লিখুন' : 'Please enter a valid amount');
          setLoading(false);
          return;
        }
        await onSubmit({
          collectedAmount: num,
          collectedByStaff: staffName,
          note,
        });
      } else if (type === 'return') {
        await onSubmit({
          action: 'approve',
          reason: returnReason,
          restoreToStock: restoreStock,
        });
      } else if (type === 'refund') {
        const num = parseFloat(refundAmount);
        if (isNaN(num) || num <= 0 || num > order.totalAmount) {
          setError(
            language === 'bn'
              ? `রিফান্ডের পরিমাণ ১ থেকে ৳${order.totalAmount} এর মধ্যে হতে হবে`
              : `Refund amount must be between 1 and ৳${order.totalAmount}`
          );
          setLoading(false);
          return;
        }
        await onSubmit({
          amount: num,
          reason: refundReason,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {type === 'confirm-status' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {type === 'delivery' && <Truck className="w-5 h-5 text-indigo-600" />}
            {type === 'cod-collection' && <DollarSign className="w-5 h-5 text-emerald-600" />}
            {type === 'return' && <RotateCcw className="w-5 h-5 text-purple-600" />}
            {type === 'refund' && <RefreshCw className="w-5 h-5 text-rose-600" />}
            {type === 'send-sms' && <MessageSquare className="w-5 h-5 text-emerald-700" />}
            <h3 className="font-semibold text-stone-800 text-lg">
              {type === 'confirm-status' && (language === 'bn' ? 'স্ট্যাটাস নিশ্চিতকরণ' : 'Confirm Status Change')}
              {type === 'delivery' && (language === 'bn' ? 'কুরিয়ার ও পার্সেল বুকিং' : 'Update Delivery / Courier')}
              {type === 'cod-collection' && (language === 'bn' ? 'ক্যাশ কালেকশন গ্রহণ' : 'Record COD Collection')}
              {type === 'return' && (language === 'bn' ? 'রিটার্ন প্রসেসিং' : 'Process Order Return')}
              {type === 'refund' && (language === 'bn' ? 'রিফান্ড প্রদান' : 'Record Customer Refund')}
              {type === 'send-sms' && (language === 'bn' ? 'কাস্টমারকে এসএমএস পাঠান' : 'Send Customer SMS')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Type: Confirm Status */}
          {type === 'confirm-status' && (
            <div className="space-y-3">
              <p className="text-sm text-stone-600">
                {language === 'bn'
                  ? `আপনি কি নিশ্চিতভাবে অর্ডার #${order.orderNumber}-এর স্ট্যাটাস "${order.status}" থেকে "${targetStatus}"-এ পরিবর্তন করতে চান?`
                  : `Are you sure you want to transition order #${order.orderNumber} from "${order.status}" to "${targetStatus}"?`}
              </p>
              {targetStatus === 'cancelled' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  ⚠️{' '}
                  {language === 'bn'
                    ? 'অর্ডার বাতিল করলে সংরক্ষিত সব স্টক স্বয়ংক্রিয়ভাবে ইনভেন্টরিতে নিরাপদে একবার রিস্টোর করা হবে।'
                    : 'Cancelling this order will automatically restore reserved stock to inventory strictly once.'}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'অডিট নোট (ঐচ্ছিক)' : 'Audit Note / Reason (Optional)'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={language === 'bn' ? 'পরিবর্তনের কারণ লিখুন...' : 'Reason for status update...'}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>
          )}

          {/* Type: Delivery */}
          {type === 'delivery' && (
            <div className="space-y-3">
              {/* 1-Click Courier Auto-Booking Button */}
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">
                    {language === 'bn' ? '১-ক্লিকে কুরিয়ার পার্সেল বুকিং' : '1-Click Courier API Booking'}
                  </span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                    Steadfast / Pathao / RedX
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={courierProviderKey}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setCourierProviderKey(val);
                      if (val === 'steadfast') setCourierName('Steadfast Courier');
                      else if (val === 'pathao') setCourierName('Pathao Courier');
                      else if (val === 'redx') setCourierName('RedX Delivery');
                      else setCourierName('Manual Courier');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-indigo-200 text-xs bg-white font-medium"
                  >
                    <option value="steadfast">Steadfast Courier</option>
                    <option value="pathao">Pathao Courier</option>
                    <option value="redx">RedX Delivery</option>
                    <option value="manual">Manual</option>
                  </select>

                  <button
                    type="button"
                    disabled={courierBookingLoading}
                    onClick={async () => {
                      setCourierBookingLoading(true);
                      setError(null);
                      try {
                        const res = await integrationService.dispatchCourier({
                          orderId: order.id,
                          provider: courierProviderKey,
                          deliveryNotes: note,
                        });
                        if (res.success && res.data) {
                          setTrackingNumber(res.data.trackingNumber || '');
                          if (res.data.deliveryProvider) setCourierName(res.data.deliveryProvider);
                          setCourierSuccessMsg(
                            language === 'bn'
                              ? `পার্সেল তৈরি সম্পন্ন! ট্র্যাকিং নং: ${res.data.trackingNumber}`
                              : `Parcel created! Tracking: ${res.data.trackingNumber}`
                          );
                        } else {
                          setError(res.error || 'Courier dispatch failed');
                        }
                      } catch {
                        setError('Courier network error');
                      } finally {
                        setCourierBookingLoading(false);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{courierBookingLoading ? (language === 'bn' ? 'বুকিং হচ্ছে...' : 'Booking...') : (language === 'bn' ? 'অটো বুকিং করুন' : 'Auto Book Now')}</span>
                  </button>
                </div>
                {courierSuccessMsg && (
                  <p className="text-xs font-semibold text-emerald-700 mt-1">✓ {courierSuccessMsg}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'কুরিয়ার / ডেলিভারি প্রোভাইডার' : 'Courier / Delivery Provider'}
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  required
                  placeholder="e.g. Steadfast Courier, RedX, Paperfly, Nursery Rider"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'ট্র্যাকিং / কনসাইনমেন্ট নম্বর' : 'Tracking / Consignment Number'}
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  placeholder="e.g. STDF-8974512"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'সম্ভাব্য ডেলিভারির তারিখ' : 'Estimated Delivery Date'}
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>
          )}

          {/* Type: COD Collection */}
          {type === 'cod-collection' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                {language === 'bn'
                  ? `প্রত্যাশিত COD পরিমাণ: ৳${order.codExpectedAmount || order.totalAmount} (বকেয়া: ৳${order.codOutstandingBalance ?? order.totalAmount})`
                  : `Expected COD Amount: ৳${order.codExpectedAmount || order.totalAmount} (Outstanding: ৳${order.codOutstandingBalance ?? order.totalAmount})`}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'সংগৃহীত টাকা (৳)' : 'Actual Amount Collected (৳)'}
                </label>
                <input
                  type="number"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'সংগ্রহকারী স্টাফ / কুরিয়ার এজেন্ট' : 'Collected by Staff / Agent'}
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>
          )}

          {/* Type: Return */}
          {type === 'return' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'রিটার্নের কারণ' : 'Return Reason'}
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="restoreStockCheck"
                  checked={restoreStock}
                  onChange={(e) => setRestoreStock(e.target.checked)}
                  className="w-4 h-4 text-[#174D35] rounded-sm focus:ring-[#174D35]"
                />
                <label htmlFor="restoreStockCheck" className="text-xs text-stone-700 cursor-pointer">
                  {language === 'bn'
                    ? 'পরিদর্শন শেষে অক্ষত/সেলযোগ্য গাছ বা বীজ পুনরায় স্টকে যুক্ত করুন'
                    : 'Inspect and restore sellable undamaged plants/seeds back to available stock'}
                </label>
              </div>
            </div>
          )}

          {/* Type: Refund */}
          {type === 'refund' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                {language === 'bn'
                  ? `সর্বোচ্চ অনুমোদনযোগ্য রিফান্ড: ৳${order.totalAmount}`
                  : `Maximum allowable refund: ৳${order.totalAmount}`}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'রিফান্ডের পরিমাণ (৳)' : 'Refund Amount (৳)'}
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  required
                  max={order.totalAmount}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'রিফান্ডের কারণ' : 'Refund Reason'}
                </label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>
          )}

          {/* Type: Send SMS */}
          {type === 'send-sms' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px]">Recipient Phone:</span>
                  <span className="font-bold text-emerald-950 font-mono text-sm">{order.customer.mobileNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[10px]">Customer:</span>
                  <span className="font-semibold text-stone-800">{order.customer.fullName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'টেমপ্লেট নির্বাচন করুন' : 'Choose SMS Template'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSmsEvent('order_confirmed');
                      setSmsMessage(`গার্ডেনভ্যালি: আপনার অর্ডার #${order.orderNumber} নিশ্চিত করা হয়েছে। পছন্দের গাছ ও পণ্যসমূহ পরম যত্নে প্যাকেজিং করা হচ্ছে।`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      smsEvent === 'order_confirmed' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    1. অর্ডার নিশ্চিতকরণ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsEvent('order_shipped');
                      setSmsMessage(
                        `গার্ডেনভ্যালি: আপনার অর্ডার #${order.orderNumber} ${order.deliveryProvider || 'কুরিয়ার'}-এ পাঠানো হয়েছে। ট্র্যাকিং নং: ${order.trackingNumber || 'প্রক্রিয়াধীন'}। শীঘ্রই ডেলিভারি পাবেন।`
                      );
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      smsEvent === 'order_shipped' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    2. কুরিয়ার শিপমেন্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsEvent('order_delivered');
                      setSmsMessage(`গার্ডেনভ্যালি: আপনার অর্ডার #${order.orderNumber} সফলভাবে ডেলিভারি হয়েছে। আপনার বাগান সুন্দর হোক! ধন্যবাদ সাথে থাকার জন্য।`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      smsEvent === 'order_delivered' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    3. ডেলিভারি সম্পন্ন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsEvent('custom');
                      setSmsMessage(`গার্ডেনভ্যালি: প্রিয় ${order.customer.fullName}, আপনার অর্ডারের বিশেষ আপডেটের জন্য আমরা যোগাযোগ করছি।`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      smsEvent === 'custom' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    4. কাস্টম বার্তা
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'bn' ? 'এসএমএস বার্তা (বাংলা)' : 'SMS Message Content'}
                </label>
                <textarea
                  rows={3}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
                />
                <span className="text-[10px] text-stone-400 text-right block mt-0.5">
                  দৈর্ঘ্য: {smsMessage.length} অক্ষর
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#174D35] hover:bg-[#123e2a] rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'bn' ? 'প্রসেসিং...' : 'Processing...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
