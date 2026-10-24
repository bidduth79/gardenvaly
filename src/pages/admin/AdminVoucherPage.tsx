/**
 * @file AdminVoucherPage.tsx
 * @description Supports both:
 * 1. Standalone New Browser Tab (/admin/voucher/:id) — pure Black & White official SutonnyOMJ voucher page
 * 2. Dedicated Admin Panel Vouchers Tab (/admin/vouchers) — browse any order's voucher and open in new tab or print PDF
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  ExternalLink,
  Search,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminOrder } from '../../types/order';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { OfficialBlackWhiteVoucher } from '../../components/admin/AdminPrintModal';
import {
  formatAdminCurrency,
  formatAdminDate,
  toBnDigits,
} from '../../utils/adminI18n';

export const AdminVoucherPage: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { language, setLanguage } = useLanguage();

  const standaloneMatch = currentPath.match(/^\/admin\/voucher\/([^/]+)$/);
  const standaloneOrderId = standaloneMatch ? standaloneMatch[1] : null;

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const printAreaRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (standaloneOrderId) {
          const single = await orderService.getOrderById(standaloneOrderId);
          if (mounted && single) {
            setSelectedOrder(single);
          }
        } else {
          const all = await orderService.getOrders();
          if (mounted) {
            setOrders(all);
            if (all.length > 0) {
              setSelectedOrder(all[0]);
            }
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [standaloneOrderId]);

  const handlePrintVoucher = () => {
    if (!printAreaRef.current || !iframeRef.current || !selectedOrder) return;
    const contentHtml = printAreaRef.current.innerHTML;
    const docTitle = `GardenValy-Voucher-${selectedOrder.orderNumber}`;

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

  /* ==========================================================================
     MODE 1: STANDALONE NEW BROWSER TAB (/admin/voucher/:id)
     ========================================================================== */
  if (standaloneOrderId) {
    return (
      <div className="min-h-screen bg-slate-200 text-black flex flex-col">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="bg-slate-950 text-white px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ফিরুন' : 'Back'}</span>
            </button>
            <span className="text-sm font-bold">
              {language === 'bn' ? 'ক্যাশ মেমো / ভাউচার' : 'Cash Memo / Voucher'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                  language === 'bn' ? 'bg-white text-slate-950' : 'text-slate-300'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                  language === 'en' ? 'bg-white text-slate-950' : 'text-slate-300'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handlePrintVoucher}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / পিডিএফ' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Standalone A4 Paper Sheet */}
        <div className="flex-1 p-4 sm:p-10 overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-600 font-semibold">
              {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
            </div>
          ) : !selectedOrder ? (
            <div className="py-20 text-center text-slate-700 font-bold">
              {language === 'bn' ? 'পাওয়া যায়নি।' : 'Not found.'}
            </div>
          ) : (
            <div
              ref={printAreaRef}
              className="max-w-3xl mx-auto bg-white p-6 sm:p-10 shadow-xl border border-black"
            >
              <OfficialBlackWhiteVoucher order={selectedOrder} language={language} />
            </div>
          )}
        </div>

        <iframe ref={iframeRef} title="standalone-voucher-print" className="hidden w-0 h-0 border-0" />
      </div>
    );
  }

  /* ==========================================================================
     MODE 2: DEDICATED VOUCHERS TAB INSIDE ADMIN PANEL (/admin/vouchers)
     ========================================================================== */
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.mobileNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
          {language === 'bn' ? 'ভাউচার ও ক্যাশ মেমো' : 'Vouchers & Cash Memos'}
        </h1>

        {selectedOrder && (
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`/admin/voucher/${selectedOrder.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আলাদা ট্যাব' : 'New Tab'}</span>
            </a>

            <button
              onClick={handlePrintVoucher}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / পিডিএফ' : 'Print / PDF'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2-Column Split: Left Order Selector (4 cols) + Right Live Official B&W Voucher (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Order List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === 'bn' ? 'ভাউচার নং বা নাম দিয়ে খুঁজুন...' : 'Search order # or customer...'
                }
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredOrders.map((ord) => {
              const active = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-3.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                    active ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-xs font-mono font-bold ${active ? 'text-white' : 'text-slate-950'}`}>
                      #{language === 'bn' ? toBnDigits(ord.orderNumber) : ord.orderNumber}
                    </p>
                    <p className={`text-xs font-semibold truncate mt-0.5 ${active ? 'text-slate-200' : 'text-slate-700'}`}>
                      {ord.customer.fullName}
                    </p>
                    <p className={`text-[11px] ${active ? 'text-slate-400' : 'text-slate-400'}`}>
                      {formatAdminDate(ord.createdAt, language)}
                    </p>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <p className={`text-xs font-extrabold tabular-nums ${active ? 'text-white' : 'text-slate-950'}`}>
                      {formatAdminCurrency(ord.totalAmount, language)}
                    </p>
                    <a
                      href={`/admin/voucher/${ord.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        active
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                      }`}
                      title={language === 'bn' ? 'আলাদা ট্যাবে ওপেন করুন' : 'Open in new tab'}
                    >
                      <span>{language === 'bn' ? 'নতুন ট্যাব' : 'New Tab'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Live Official B&W SutonnyOMJ Voucher Sheet */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div
              ref={printAreaRef}
              className="bg-white p-5 sm:p-8 shadow-md border-2 border-black"
            >
              <OfficialBlackWhiteVoucher order={selectedOrder} language={language} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>{language === 'bn' ? 'কোনো ভাউচার নেই' : 'No voucher selected'}</span>
            </div>
          )}
        </div>
      </div>

      <iframe ref={iframeRef} title="admin-voucher-print" className="hidden w-0 h-0 border-0" />
    </div>
  );
};
