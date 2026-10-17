/**
 * @file InvoicePrintModal.tsx
 * @description Official branded digital cash memo and printable invoice modal for Gardenvaly customers.
 */

import React from 'react';
import { X, Printer, Leaf } from 'lucide-react';
import { AdminOrder } from '../../types/order';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { BRAND_CONFIG } from '../../config/constants';
import { useStoreSettings } from '../../services/settingsService';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ isOpen, onClose, order }) => {
  const { language } = useLanguage();
  const { settings } = useStoreSettings();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {isBn ? 'অফিসিয়াল ক্যাশ মেমো' : 'Official Cash Memo'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / সেভ করুন' : 'Print / Save PDF'}</span>
            </button>
            <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Area */}
        <div className="py-6 space-y-6">
          {/* Memo Header */}
          <div className="flex items-start justify-between border-b-2 border-[#174D35] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#5C8D50]" />
                <h2 className="text-xl sm:text-2xl font-serif-botanical font-bold text-[#174D35]">
                  {isBn ? (settings.storeNameBn || settings.storeNameEn || BRAND_CONFIG.name) : (settings.storeNameEn || settings.storeNameBn || BRAND_CONFIG.name)}
                </h2>
              </div>
              <p className="text-[11px] font-semibold text-[#C5A059] mt-0.5">
                {isBn ? (settings.signatureBn || settings.signatureEn || BRAND_CONFIG.signature) : (settings.signatureEn || settings.signatureBn || BRAND_CONFIG.signature)} • {isBn ? (settings.taglineBn || 'সবুজে সাজুক জীবন') : (settings.taglineEn || 'Grow Green, Live Beautiful')}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                {settings.contactPhone || BRAND_CONFIG.phone} • {settings.contactEmail || BRAND_CONFIG.email}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2 py-1 bg-stone-100 rounded text-stone-700">INVOICE</span>
              <p className="text-xs font-bold text-stone-900 mt-2">{order.orderNumber}</p>
              <p className="text-[11px] text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F7F5EC]/60 p-4 rounded-xl border border-stone-200/60">
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase">{isBn ? 'গ্রাহকের বিবরণ' : 'Customer Details'}</p>
              <p className="font-bold text-stone-900 mt-1">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.mobileNumber}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase">{isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</p>
              <p className="text-stone-700 mt-1">{order.customer.addressDetail}</p>
              <p className="text-stone-500">{order.customer.district}, {order.customer.division}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-left">
                <th className="py-2">{isBn ? 'আইটেম বিবরণ' : 'Item Description'}</th>
                <th className="py-2 text-center">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                <th className="py-2 text-right">{isBn ? 'একক মূল্য' : 'Unit Price'}</th>
                <th className="py-2 text-right">{isBn ? 'মোট' : 'Total'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((it, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-2 font-medium text-stone-800">{it.productName}</td>
                  <td className="py-2 text-center text-stone-600">{formatNumeral(it.quantity, language)}</td>
                  <td className="py-2 text-right text-stone-600">{formatPrice(it.unitPrice, language)}</td>
                  <td className="py-2 text-right font-bold text-stone-900">{formatPrice(it.lineSubtotal, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations Summary */}
          <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
              <span>{formatPrice(order.subtotal, language)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
              <span>{formatPrice(order.deliveryCharge, language)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#174D35] pt-2 border-t border-stone-200">
              <span>{isBn ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
              <span>{formatPrice(order.totalAmount, language)}</span>
            </div>
          </div>

          {/* Footer Blessing */}
          <div className="text-center pt-4 border-t border-dashed border-stone-200 text-[11px] text-stone-500">
            <p className="italic font-serif-botanical text-[#174D35] font-semibold">
              {isBn ? 'সবুজে সাজুক জীবন • গার্ডেনভ্যালির সাথে থাকার জন্য ধন্যবাদ!' : 'Grow Green, Live Beautiful • Thank you for choosing Gardenvaly!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
