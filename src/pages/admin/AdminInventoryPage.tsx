/**
 * @file AdminInventoryPage.tsx
 * @description Rapid stock control and inventory adjustment table for nursery plants and seed batches.
 */

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Save,
  Sprout,
  Filter,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';

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
      setFeedback(language === 'bn' ? 'স্টক সফলভাবে পরিবর্তিত হয়েছে!' : 'Stock updated successfully!');
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'ইনভেন্টরি ও স্টক নিয়ন্ত্রণ' : 'Nursery Inventory & Stock Levels'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'চারাগাছ ও বীজ প্যাকেটসমূহের স্টক দ্রুত বৃদ্ধি বা হ্রাস করুন'
              : 'Rapid in-place quantity adjustments for living nursery stock and seed packs'}
          </p>
        </div>

        {feedback && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'bn' ? 'পণ্য বা SKU দিয়ে খুঁজুন...' : 'Search by name or SKU...'
            }
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {language === 'bn' ? 'সকল স্টক' : 'All Stock'}
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer ${
              filterMode === 'low'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লো-স্টক (১-৫)' : 'Low Stock (1-5)'}</span>
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterMode === 'out'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            {language === 'bn' ? 'স্টক শূন্য (০)' : 'Out of Stock (0)'}
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'পণ্য বিবরণ' : 'Botanical Specimen'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'টাইপ' : 'Type'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'বর্তমান স্টক' : 'Current Stock'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'দ্রুত স্টক সমন্বয়' : 'Fast Restock'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.nameEn}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="max-w-xs truncate">
                        <p className="font-semibold text-stone-900 truncate">
                          {language === 'bn' ? p.nameBn : p.nameEn}
                        </p>
                        <p className="text-[11px] text-stone-400 font-mono">
                          {p.SKU}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 capitalize text-stone-600 font-medium">
                    {p.type}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={p.stockQuantity}
                        onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                        disabled={updatingId === p.id}
                        className="w-16 px-2 py-1 rounded-lg border border-stone-300 text-center font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                      />
                      <span className="text-stone-400 text-xs">
                        {p.type === 'seed' ? 'packs' : 'pots'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {p.stockQuantity === 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                        {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                      </span>
                    ) : p.stockQuantity <= 5 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {language === 'bn' ? 'লো-স্টক' : 'Low Stock'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {language === 'bn' ? 'পর্যাপ্ত' : 'Healthy Stock'}
                      </span>
                    )}
                  </td>

                  {/* Fast Adjust Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => handleUpdateStock(p.id, Math.max(0, p.stockQuantity - 1))}
                        className="p-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
                        title="-1 unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 1)}
                        className="p-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
                        title="+1 unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 5)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#174D35] font-bold text-xs cursor-pointer"
                        title="+5 batch restock"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity + 10)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#174D35] font-bold text-xs cursor-pointer"
                        title="+10 nursery shipment"
                      >
                        +10
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
