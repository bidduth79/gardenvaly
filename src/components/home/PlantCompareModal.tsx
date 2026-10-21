/**
 * @file PlantCompareModal.tsx
 * @description Floating comparison bar and side-by-side botanical comparison modal.
 */

import React from 'react';
import { X, GitCompareArrows, Sun, Droplet, Star, ShoppingBag, CheckCircle2, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';

export const PlantCompareModal: React.FC = () => {
  const {
    compareItems,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useCompare();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

  if (compareItems.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Compare Dock */}
      {!isCompareModalOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-white/15 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#174D35] text-[#A3E635] flex items-center justify-center shrink-0">
              <GitCompareArrows className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {isBn
                  ? `${formatNumeral(compareItems.length, language)}টি গাছ তুলনার জন্য নির্বাচিত (সর্বোচ্চ ৩টি)`
                  : `${compareItems.length} item(s) selected to compare (max 3)`}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {compareItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-stone-200 max-w-[110px] truncate"
                  >
                    <span className="truncate">{isBn ? item.nameBn : item.nameEn}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(item.id)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-stone-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              {isBn ? 'মুছুন' : 'Clear'}
            </button>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b58e47] text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              {isBn ? 'তুলনা দেখুন' : 'Compare Now'}
            </button>
          </div>
        </div>
      )}

      {/* Full Comparison Modal */}
      {isCompareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-6"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-[#174D35] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitCompareArrows className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h2 className="text-lg sm:text-xl font-serif-botanical font-bold">
                    {isBn ? 'গাছ ও বীজ পাশাপাশি তুলনা করুন' : 'Side-by-Side Plant Comparison'}
                  </h2>
                  <p className="text-xs text-stone-200">
                    {isBn
                      ? 'আলোর চাহিদা, পানির মাত্রা, সাইজ ও মূল্যের তুলনামূলক বিশ্লেষণ'
                      : 'Compare sunlight, watering needs, dimensions, and pricing'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-xs text-stone-200 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সব মুছুন' : 'Reset'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Grid */}
            <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="py-3 px-3 w-36 text-stone-500 font-semibold">
                      {isBn ? 'বৈশিষ্ট্য' : 'Specification'}
                    </th>
                    {compareItems.map((item) => (
                      <th key={item.id} className="py-3 px-4 align-top">
                        <div className="relative rounded-2xl overflow-hidden h-36 bg-stone-100 mb-2.5 border border-stone-200">
                          <img
                            src={item.imageUrl}
                            alt={isBn ? item.nameBn : item.nameEn}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-rose-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            navigate(`/product/${item.slug}`);
                          }}
                          className="font-serif-botanical font-bold text-stone-900 hover:text-[#174D35] text-base text-left hover:underline cursor-pointer block"
                        >
                          {isBn ? item.nameBn : item.nameEn}
                        </button>
                        {item.botanicalName && (
                          <span className="text-[11px] italic text-[#5C8D50] font-normal block">
                            {item.botanicalName}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'মূল্য' : 'Price'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4 font-bold text-base text-[#174D35] font-mono">
                        {formatPrice(item.price, language)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'কাস্টমার রেটিং' : 'Rating'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {formatNumeral(item.rating.toFixed(1), language)} ({formatNumeral(item.reviewsCount, language)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'আলোর চাহিদা' : 'Sunlight Need'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4 text-stone-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                          {isBn ? item.sunlightBn : item.sunlightEn}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'পানি দেওয়ার নিয়ম' : 'Watering'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4 text-stone-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Droplet className="w-4 h-4 text-sky-500 shrink-0" />
                          {isBn ? item.waterBn : item.waterEn}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'স্থান / পরিবেশ' : 'Environment'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4 text-stone-700 capitalize">
                        {item.indoorOutdoor === 'indoor'
                          ? (isBn ? 'ইনডোর / ঘরের ভেতরে' : 'Indoor')
                          : item.indoorOutdoor === 'outdoor'
                          ? (isBn ? 'আউটডোর / রোদে' : 'Outdoor')
                          : (isBn ? 'ইনডোর ও ব্যালকনি উভয়ই' : 'Indoor & Balcony')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-600">
                      {isBn ? 'স্টক স্ট্যাটাস' : 'Availability'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.inStock
                            ? `${formatNumeral(item.stockQuantity, language)} ${isBn ? 'টি স্টকে আছে' : 'in stock'}`
                            : (isBn ? 'স্টক আউট' : 'Out of stock')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-3 font-semibold text-stone-600">
                      {isBn ? 'অ্যাকশন' : 'Action'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-4 px-4">
                        <button
                          type="button"
                          disabled={!item.inStock}
                          onClick={() => addToCart(item, 1)}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#174D35] hover:bg-[#123d2a] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
