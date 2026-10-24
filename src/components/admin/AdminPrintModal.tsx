/**
 * @file AdminPrintModal.tsx
 * @description Official Pure Black-and-White SutonnyOMJ (suttonomj0) Voucher / Cash Memo
 * and A4 Business Report PDF Generator & Print Engine.
 */

import React, { useRef } from 'react';
import { Printer, X, FileCheck2, ExternalLink } from 'lucide-react';
import { AdminOrder } from '../../types/order';
import { DashboardMetrics, TopSellingProduct, InventoryAlertItem } from '../../types/admin';
import {
  AdminLang,
  formatAdminCurrency,
  formatAdminDate,
  formatAdminNumber,
  numberToBanglaWords,
  toBnDigits,
  translateDistrict,
  translatePaymentMethod,
} from '../../utils/adminI18n';

interface VoucherModalProps {
  mode: 'voucher';
  order: AdminOrder;
  language: AdminLang;
  onClose: () => void;
}

interface ReportModalProps {
  mode: 'report';
  metrics: DashboardMetrics | null;
  topProducts: TopSellingProduct[];
  inventoryAlerts: InventoryAlertItem[];
  dateRangeLabel: string;
  language: AdminLang;
  onClose: () => void;
}

export type AdminPrintModalProps = VoucherModalProps | ReportModalProps;

export const AdminPrintModal: React.FC<AdminPrintModalProps> = (props) => {
  const { language, onClose } = props;
  const printAreaRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrintPdf = () => {
    if (!printAreaRef.current || !iframeRef.current) return;
    const contentHtml = printAreaRef.current.innerHTML;
    const docTitle =
      props.mode === 'voucher'
        ? `GardenValy-Voucher-${props.order.orderNumber}`
        : `GardenValy-Report-${new Date().toISOString().slice(0, 10)}`;

    const fullHtml = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 12mm; }
    body, body * {
      font-family: 'Tiro Bangla', 'Noto Serif Bengali', 'Times New Roman', Georgia, serif !important;
      color: #000000 !important;
      background: #ffffff;
      border-color: #000000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .voucher-invert {
      background-color: #000000 !important;
      color: #ffffff !important;
    }
    .voucher-invert * {
      color: #ffffff !important;
    }
  </style>
</head>
<body>
  <div class="voucher-sutonny">${contentHtml}</div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHtml);
      iframeDoc.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-400 overflow-hidden">
        {/* Top Action Bar */}
        <div className="bg-slate-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-white shrink-0" />
            <h3 className="text-sm font-bold leading-none">
              {props.mode === 'voucher'
                ? language === 'bn'
                  ? 'ক্যাশ মেমো / ভাউচার'
                  : 'Cash Memo / Voucher'
                : language === 'bn'
                ? 'বিক্রয় ও আর্থিক রিপোর্ট'
                : 'Sales & Financial Report'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {props.mode === 'voucher' && (
              <a
                href={`/admin/voucher/${props.order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আলাদা ট্যাব' : 'New Tab'}</span>
              </a>
            )}
            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / পিডিএফ' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Paper Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          <div
            ref={printAreaRef}
            className="voucher-sutonny bg-white text-black shadow-lg border-2 border-black p-6 sm:p-10 max-w-3xl mx-auto"
          >
            {props.mode === 'voucher' ? (
              <OfficialBlackWhiteVoucher order={props.order} language={language} />
            ) : (
              <OfficialBlackWhiteReport
                metrics={props.metrics}
                topProducts={props.topProducts}
                inventoryAlerts={props.inventoryAlerts}
                dateRangeLabel={props.dateRangeLabel}
                language={language}
              />
            )}
          </div>
        </div>

        {/* Hidden Print Frame */}
        <iframe ref={iframeRef} title="pdf-print-frame" className="hidden w-0 h-0 border-0" />
      </div>
    </div>
  );
};

/* ============================================================================
   1. OFFICIAL PURE BLACK & WHITE VOUCHER / CASH MEMO
   ============================================================================ */
export const OfficialBlackWhiteVoucher: React.FC<{ order: AdminOrder; language: AdminLang }> = ({
  order,
  language,
}) => {
  const isPaid = order.paymentStatus === 'paid';
  const collected = isPaid ? order.totalAmount : order.codCollectedAmount || 0;
  const due = Math.max(0, order.totalAmount - collected);
  const fmtVoucherAmt = (val: number) =>
    language === 'bn' ? `${formatAdminNumber(val, 'bn')}/-` : `TK ${formatAdminNumber(val, 'en')}/-`;

  return (
    <div className="voucher-sutonny bg-white text-black border-4 border-double border-black p-5 sm:p-7 space-y-4">
      {/* Top Bismillah / Official Header Line */}
      <div className="text-center text-xs font-bold tracking-widest border-b border-black pb-1.5">
        {language === 'bn' ? 'বিসমিল্লাহির রাহমানির রাহিম' : 'OFFICIAL COMMERCIAL VOUCHER'}
      </div>

      {/* Store Title & Official Cash Memo Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
            {language === 'bn' ? 'মেসার্স গার্ডেনভ্যালি নার্সারি ও বীজ ভান্ডার' : 'M/S GARDENVALY NURSERY & SEEDS'}
          </h1>
          <p className="text-sm font-semibold mt-1">
            {language === 'bn'
              ? 'উন্নত মানের দেশি-বিদেশি ইনডোর ও আউটডোর চারাগাছ এবং পরীক্ষিত বীজের বিশ্বস্ত প্রতিষ্ঠান'
              : 'Wholesale & Retail Supplier of Quality Indoor/Outdoor Plants & Certified Seeds'}
          </p>
          <p className="text-xs mt-0.5">
            {language === 'bn'
              ? 'প্রধান কার্যালয়: ঢাকা, বাংলাদেশ | মোবাইল: ০১৭০০-০০০০০০ | ওয়েব: গার্ডেনভ্যালি ডট কম'
              : 'Head Office: Dhaka, Bangladesh | Phone: +880 1700-000000 | Web: gardenvaly.com'}
          </p>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <div className="voucher-invert inline-block px-4 py-1.5 bg-black text-white font-extrabold text-sm tracking-wider border border-black">
            {language === 'bn' ? 'ক্যাশ মেমো / ভাউচার' : 'CASH MEMO / VOUCHER'}
          </div>
          <p className="text-xs font-bold mt-2">
            {language === 'bn'
              ? `ভাউচার নং: ${toBnDigits(order.orderNumber)}`
              : `Voucher No: ${order.orderNumber}`}
          </p>
          <p className="text-xs font-semibold">
            {language === 'bn' ? 'তারিখ: ' : 'Date: '}
            {formatAdminDate(order.createdAt, language)}
          </p>
        </div>
      </div>

      {/* Customer Details Table (Traditional Ruled Box) */}
      <table className="w-full border-collapse border border-black text-xs sm:text-sm">
        <tbody>
          <tr>
            <td className="border border-black px-3 py-1.5 font-bold w-28">
              {language === 'bn' ? 'ক্রেতার নাম:' : 'Customer:'}
            </td>
            <td className="border border-black px-3 py-1.5 font-semibold">
              {order.customer.fullName}
            </td>
            <td className="border border-black px-3 py-1.5 font-bold w-28">
              {language === 'bn' ? 'মোবাইল নং:' : 'Mobile No:'}
            </td>
            <td className="border border-black px-3 py-1.5 font-bold">
              {language === 'bn' ? toBnDigits(order.customer.mobileNumber) : order.customer.mobileNumber}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5 font-bold">
              {language === 'bn' ? 'ঠিকানা:' : 'Address:'}
            </td>
            <td className="border border-black px-3 py-1.5" colSpan={3}>
              {order.customer.addressDetail}, {translateDistrict(order.customer.district, language)}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5 font-bold">
              {language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}
            </td>
            <td className="border border-black px-3 py-1.5 font-semibold">
              {translatePaymentMethod(order.paymentMethod, language)}
            </td>
            <td className="border border-black px-3 py-1.5 font-bold">
              {language === 'bn' ? 'অবস্থা:' : 'Status:'}
            </td>
            <td className="border border-black px-3 py-1.5 font-extrabold">
              {isPaid
                ? language === 'bn'
                  ? 'নগদ পরিশোধিত'
                  : 'PAID IN FULL'
                : language === 'bn'
                ? 'ক্যাশ অন ডেলিভারি (বকেয়া)'
                : 'DUE ON DELIVERY (COD)'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main Itemized Ruled Table */}
      <table className="w-full border-collapse border border-black text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-black font-extrabold text-center">
            <th className="border border-black py-2 px-2 w-14">
              {language === 'bn' ? 'ক্রমিক নং' : 'SL'}
            </th>
            <th className="border border-black py-2 px-3 text-left">
              {language === 'bn' ? 'মালের বিবরণ (গাছ / বীজ)' : 'Description of Goods'}
            </th>
            <th className="border border-black py-2 px-2 w-24 text-center">
              {language === 'bn' ? 'পরিমাণ' : 'Qty'}
            </th>
            <th className="border border-black py-2 px-3 w-28 text-right">
              {language === 'bn' ? 'দর (টাকা)' : 'Rate (TK)'}
            </th>
            <th className="border border-black py-2 px-3 w-32 text-right">
              {language === 'bn' ? 'মোট টাকা' : 'Amount (TK)'}
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-black py-2 px-2 text-center font-semibold">
                {formatAdminNumber(idx + 1, language)}
              </td>
              <td className="border border-black py-2 px-3">
                <span className="font-bold">
                  {language === 'bn' ? item.productNameBn || item.productName : item.productName}
                </span>
                <span className="text-xs ml-2">
                  ({language === 'bn' ? `কোড: ${toBnDigits(item.productId)}` : `Code: ${item.productId}`})
                </span>
              </td>
              <td className="border border-black py-2 px-2 text-center font-bold">
                {formatAdminNumber(item.quantity, language)} {language === 'bn' ? 'টি' : 'pcs'}
              </td>
              <td className="border border-black py-2 px-3 text-right">
                {fmtVoucherAmt(item.unitPrice)}
              </td>
              <td className="border border-black py-2 px-3 text-right font-bold">
                {fmtVoucherAmt(item.lineSubtotal)}
              </td>
            </tr>
          ))}

          {/* Blank filler rows for authentic commercial voucher look if fewer than 4 items */}
          {Array.from({ length: Math.max(0, 4 - order.items.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-7">
              <td className="border border-black px-2" />
              <td className="border border-black px-3" />
              <td className="border border-black px-2" />
              <td className="border border-black px-3" />
              <td className="border border-black px-3" />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} rowSpan={5} className="border border-black p-3 align-top text-xs space-y-1.5">
              <p className="font-extrabold">
                {language === 'bn'
                  ? `কথায় (মোট বিল): ${numberToBanglaWords(order.totalAmount)}`
                  : `In Words: Taka ${order.totalAmount.toLocaleString()} Only`}
              </p>
              <p className="pt-2 leading-relaxed">
                {language === 'bn'
                  ? 'বিঃদ্রঃ— ডেলিভারিম্যানের উপস্থিতিতে গাছ ও বীজের প্যাকেট যাচাই করে বুঝে নিন। বিক্রীত মাল ফেরত বা পরিবর্তনের ক্ষেত্রে ২৪ ঘণ্টার মধ্যে জানাতে হবে।'
                  : 'Note: Please verify all plants and seeds in the presence of the delivery agent upon receipt.'}
              </p>
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {language === 'bn' ? 'উপমোট:' : 'Subtotal:'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {fmtVoucherAmt(order.subtotal)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {language === 'bn' ? 'ডেলিভারি ভাড়া:' : 'Delivery Charge:'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {fmtVoucherAmt(order.deliveryCharge)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 text-right font-extrabold">
              {language === 'bn' ? 'সর্বমোট বিল:' : 'Grand Total:'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-extrabold text-base">
              {fmtVoucherAmt(order.totalAmount)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {language === 'bn' ? 'জমা / পরিশোধিত:' : 'Advance / Paid:'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {fmtVoucherAmt(collected)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 text-right font-extrabold">
              {language === 'bn' ? 'বকেয়া / প্রদেয়:' : 'Net Balance Due:'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-extrabold text-base">
              {fmtVoucherAmt(due)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Official Signature Footer */}
      <div className="pt-12 pb-2 grid grid-cols-3 gap-4 text-xs font-bold text-center">
        <div>
          <div className="border-t border-black pt-1.5 inline-block w-36">
            {language === 'bn' ? 'ক্রেতার স্বাক্ষর' : 'Customer Signature'}
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-1.5 inline-block w-36">
            {language === 'bn' ? 'ডেলিভারিম্যানের স্বাক্ষর' : 'Delivery Agent'}
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-1.5 inline-block w-44">
            {language === 'bn' ? 'পক্ষে— গার্ডেনভ্যালি কর্তৃপক্ষ' : 'For GardenValy Authority'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. OFFICIAL BLACK & WHITE BUSINESS REPORT PDF DOCUMENT
   ============================================================================ */
export const OfficialBlackWhiteReport: React.FC<{
  metrics: DashboardMetrics | null;
  topProducts: TopSellingProduct[];
  inventoryAlerts: InventoryAlertItem[];
  dateRangeLabel: string;
  language: AdminLang;
}> = ({ metrics, topProducts, inventoryAlerts, dateRangeLabel, language }) => {
  return (
    <div className="voucher-sutonny bg-white text-black border-4 border-double border-black p-6 space-y-5">
      {/* Report Header */}
      <div className="text-center border-b-2 border-black pb-4">
        <h2 className="text-2xl font-extrabold">
          {language === 'bn'
            ? 'মেসার্স গার্ডেনভ্যালি — অফিশিয়াল বিক্রয় ও স্টক অডিট রিপোর্ট'
            : 'M/S GARDENVALY — OFFICIAL SALES & INVENTORY AUDIT REPORT'}
        </h2>
        <p className="text-xs font-bold mt-1">
          {language === 'bn'
            ? `হিসাবের সময়কাল: ${dateRangeLabel} | প্রকাশের তারিখ: ${formatAdminDate(new Date(), 'bn')}`
            : `Period: ${dateRangeLabel} | Date: ${formatAdminDate(new Date(), 'en')}`}
        </p>
      </div>

      {/* Summary Table */}
      <table className="w-full border-collapse border border-black text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-black font-extrabold">
            <th className="border border-black py-2 px-3 text-left">
              {language === 'bn' ? 'আর্থিক খাতের বিবরণ' : 'Financial Metric'}
            </th>
            <th className="border border-black py-2 px-3 text-right">
              {language === 'bn' ? 'পরিমাণ / টাকা' : 'Value / Amount'}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black py-1.5 px-3 font-bold">
              {language === 'bn' ? 'সর্বমোট অর্ডার সংখ্যা' : 'Total Orders Count'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {formatAdminNumber(metrics?.totalOrders ?? 0, language)} {language === 'bn' ? 'টি' : ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 font-bold">
              {language === 'bn' ? 'সর্বমোট অর্ডার মূল্য' : 'Gross Order Value'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {formatAdminCurrency(metrics?.totalOrderValue ?? 0, language)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 font-bold">
              {language === 'bn' ? 'প্রকৃত আদায়কৃত নগদ টাকা' : 'Actual Collected Payments'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {formatAdminCurrency(metrics?.actualCollectedPayments ?? 0, language)}
            </td>
          </tr>
          <tr>
            <td className="border border-black py-1.5 px-3 font-bold">
              {language === 'bn' ? 'বকেয়া ক্যাশ অন ডেলিভারি' : 'Outstanding COD Balance'}
            </td>
            <td className="border border-black py-1.5 px-3 text-right font-bold">
              {formatAdminCurrency(metrics?.outstandingCod ?? 0, language)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Top Selling Products */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold">
          {language === 'bn' ? '১. সর্বাধিক বিক্রীত পণ্যের তালিকা:' : '1. Top Selling Products:'}
        </h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b-2 border-black font-extrabold">
              <th className="border border-black py-1.5 px-2 w-12 text-center">#</th>
              <th className="border border-black py-1.5 px-3 text-left">
                {language === 'bn' ? 'পণ্যের নাম' : 'Product Name'}
              </th>
              <th className="border border-black py-1.5 px-2 text-center">
                {language === 'bn' ? 'কোড' : 'Code'}
              </th>
              <th className="border border-black py-1.5 px-2 text-right">
                {language === 'bn' ? 'বিক্রীত সংখ্যা' : 'Units Sold'}
              </th>
              <th className="border border-black py-1.5 px-3 text-right">
                {language === 'bn' ? 'মোট বিক্রয় মূল্য' : 'Revenue'}
              </th>
            </tr>
          </thead>
          <tbody>
            {topProducts.slice(0, 10).map((p, i) => (
              <tr key={i}>
                <td className="border border-black py-1.5 px-2 text-center">
                  {formatAdminNumber(i + 1, language)}
                </td>
                <td className="border border-black py-1.5 px-3 font-bold">
                  {language === 'bn' ? p.nameBn : p.nameEn}
                </td>
                <td className="border border-black py-1.5 px-2 text-center">
                  {language === 'bn' ? toBnDigits(p.sku) : p.sku}
                </td>
                <td className="border border-black py-1.5 px-2 text-right font-bold">
                  {formatAdminNumber(p.unitsSold, language)}
                </td>
                <td className="border border-black py-1.5 px-3 text-right font-bold">
                  {formatAdminCurrency(p.grossSales, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Inventory */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold">
          {language === 'bn' ? '২. কম স্টক / স্টক সতর্কতা তালিকা:' : '2. Low Stock Alert List:'}
        </h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b-2 border-black font-extrabold">
              <th className="border border-black py-1.5 px-3 text-left">
                {language === 'bn' ? 'পণ্যের নাম' : 'Product'}
              </th>
              <th className="border border-black py-1.5 px-3 text-center">
                {language === 'bn' ? 'কোড' : 'Code'}
              </th>
              <th className="border border-black py-1.5 px-3 text-right">
                {language === 'bn' ? 'বর্তমান মজুদ' : 'Current Stock'}
              </th>
            </tr>
          </thead>
          <tbody>
            {inventoryAlerts.slice(0, 8).map((item, i) => (
              <tr key={i}>
                <td className="border border-black py-1.5 px-3 font-bold">
                  {language === 'bn' ? item.nameBn : item.nameEn}
                </td>
                <td className="border border-black py-1.5 px-3 text-center">
                  {language === 'bn' ? toBnDigits(item.sku) : item.sku}
                </td>
                <td className="border border-black py-1.5 px-3 text-right font-extrabold">
                  {formatAdminNumber(item.stockQuantity, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
