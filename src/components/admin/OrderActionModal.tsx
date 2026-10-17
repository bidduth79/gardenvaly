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
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminOrder, OrderStatus } from '../../types/order';

export type ModalType =
  | 'confirm-status'
  | 'delivery'
  | 'cod-collection'
  | 'return'
  | 'refund'
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
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [expectedDate, setExpectedDate] = useState(order.expectedDeliveryDate || '');
  const [codAmount, setCodAmount] = useState(String(order.codOutstandingBalance ?? order.totalAmount));
  const [staffName, setStaffName] = useState(order.codCollectedByStaff || 'Nursery Delivery Staff');
  const [returnReason, setReturnReason] = useState('Customer changed mind / Damaged in transit');
  const [restoreStock, setRestoreStock] = useState(true);
  const [refundAmount, setRefundAmount] = useState(String(order.totalAmount));
  const [refundReason, setRefundReason] = useState('Damaged plant / customer dissatisfied');

  if (!isOpen || !type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'confirm-status') {
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
            {type === 'delivery' && <Truck className="w-5 h-5 text-[#174D35]" />}
            {type === 'cod-collection' && <DollarSign className="w-5 h-5 text-emerald-600" />}
            {type === 'return' && <RotateCcw className="w-5 h-5 text-purple-600" />}
            {type === 'refund' && <RefreshCw className="w-5 h-5 text-rose-600" />}
            <h3 className="font-semibold text-stone-800 text-lg">
              {type === 'confirm-status' && (language === 'bn' ? 'স্ট্যাটাস নিশ্চিতকরণ' : 'Confirm Status Change')}
              {type === 'delivery' && (language === 'bn' ? 'কুরিয়ার ও ট্র্যাকিং তথ্য' : 'Update Delivery / Courier')}
              {type === 'cod-collection' && (language === 'bn' ? 'ক্যাশ কালেকশন গ্রহণ' : 'Record COD Collection')}
              {type === 'return' && (language === 'bn' ? 'রিটার্ন প্রসেসিং' : 'Process Order Return')}
              {type === 'refund' && (language === 'bn' ? 'রিফান্ড প্রদান' : 'Record Customer Refund')}
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
                  placeholder="e.g. ST-8974512"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#174D35]"
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
