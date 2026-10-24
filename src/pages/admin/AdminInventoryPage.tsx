/**
 * @file AdminInventoryPage.tsx
 * @description Rapid stock control and inventory adjustment table in Slate, Black, and White
 * with Semantic Status Colors and 100% pure Bengali ('bn') or English ('en') localization.
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import {
  formatAdminNumber,
  toBnDigits,
  translateProductType,
  translateStockUnit,
} from '../../utils/adminI18n';

export const AdminInventoryPage: React.FC = () => {
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchProducts = async () => {
    const list = await adminService.getAllProducts();
    setProducts(list);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id: string, newStock: number) => {
    setUpdatingId(id);
    const updated = await adminService.updateStock(id, newStock);
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockQuantity: updated.stockQuantity } : p))
      );
      setFeedback(language === 'bn' ? 'স্টক সফলভাবে হালনাগাদ হয়েছে!' : 'Stock updated successfully!');
      setTimeout(() => setFeedback(null), 2000);
    }
    setUpdatingId(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameBn.includes(searchTerm) ||
      p.SKU.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterMode === 'all' ||
      (filterMode === 'low' && p.stockQuantity > 0 && p.stockQuantity <= 5) ||
      (filterMode === 'out' && p.stockQuantity === 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
          {language === 'bn' ? 'স্টক ও ইনভেন্টরি' : 'Inventory'}
        </h1>

        {feedback && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Unified Resource Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 self-start">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল স্টক' : 'All Stock'}
            </button>
            <button
              onClick={() => setFilterMode('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                filterMode === 'low'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কম স্টক (১-৫)' : 'Low Stock (1-5)'}</span>
            </button>
            <button
              onClick={() => setFilterMode('out')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterMode === 'out'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {language === 'bn' ? 'স্টক শেষ (০)' : 'Out of Stock (0)'}
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'bn' ? 'পণ্যের নাম বা কোড দিয়ে খুঁজুন...' : 'Search by name or SKU...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'পণ্য ও কোড' : 'Product'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ধরন' : 'Type'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'বর্তমান মজুদ' : 'Current Stock'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'দ্রুত স্টক সমন্বয়' : 'Quick Adjust'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getSafeImageUrl(p.imageUrl, { type: p.type, categorySlug: p.categorySlug })}
                        alt={p.nameEn}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        onError={(e) => handleImageError(e, getProductFallbackImage(p))}
                      />
                      <div className="max-w-xs truncate">
                        <p className="font-semibold text-slate-950 truncate">
                          {language === 'bn' ? p.nameBn : p.nameEn}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {language === 'bn' ? `কোড: ${toBnDigits(p.SKU)}` : p.SKU}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {translateProductType(p.type, language)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={p.stockQuantity}
                        onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                        disabled={updatingId === p.id}
                        className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold text-slate-950 focus:outline-hidden focus:ring-2 focus:ring-slate-900 tabular-nums"
                      />
                      <span className="text-slate-500 text-xs">
                        {translateStockUnit(p.type, language)}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {p.stockQuantity === 0 ? (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                      </span>
                    ) : p.stockQuantity <= 5 ? (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {language === 'bn' ? 'কম স্টক' : 'Low Stock'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {language === 'bn' ? 'পর্যাপ্ত' : 'In Stock'}
                      </span>
                    )}
                  </td>

                  {/* Fast Adjust Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => handleUpdateStock(p.id, Math.max(0, p.stockQuantity - 1))}
                        className="p-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title={language === 'bn' ? '১ টি কমান' : '-1 unit'}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 1)}
                        className="p-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title={language === 'bn' ? '১ টি বাড়ান' : '+1 unit'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 5)}
                        className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs cursor-pointer tabular-nums"
                      >
                        +{formatAdminNumber(5, language)}
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 10)}
                        className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs cursor-pointer tabular-nums"
                      >
                        +{formatAdminNumber(10, language)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
