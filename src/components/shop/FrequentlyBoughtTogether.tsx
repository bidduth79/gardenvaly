/**
 * @file FrequentlyBoughtTogether.tsx
 * @description "একসাথে কিনলে সাশ্রয়" (Frequently Bought Together) bundle widget for ProductDetailPage.
 * Automatically pairs the current product with complementary care supplies & seeds and applies
 * the Admin-configured bundle discount.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { comboService, COMBOS_UPDATED_EVENT } from '../../services/comboService';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
}) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const isBn = language === 'bn';

  const [settings, setSettings] = useState(() => comboService.getSettings());
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const handleSync = () => setSettings(comboService.getSettings());
    window.addEventListener(COMBOS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(COMBOS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Pick 2 complementary items (e.g. 1 fertilizer/care + 1 tool/seed)
  const companionItems = useMemo(() => {
    const others = MOCK_PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && p.inStock && p.stockQuantity > 0
    );
    const careOrTool =
      others.find((p) => p.type === 'care' || p.type === 'tool') || others[0];
    const secondCompanion =
      others.find(
        (p) =>
          p.id !== careOrTool?.id &&
          (currentProduct.type === 'plant' ? p.type === 'tool' || p.type === 'seed' : p.type === 'plant')
      ) || others[1];
    return [careOrTool, secondCompanion].filter(Boolean) as Product[];
  }, [currentProduct]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    currentProduct.id,
    ...companionItems.map((i) => i.id),
  ]);

  useEffect(() => {
    setSelectedIds([currentProduct.id, ...companionItems.map((i) => i.id)]);
  }, [currentProduct.id, companionItems]);

  if (!settings.fbtEnabled || companionItems.length === 0) return null;

  const allItems = [currentProduct, ...companionItems];
  const activeItems = allItems.filter((item) => selectedIds.includes(item.id));
  const regularTotal = activeItems.reduce((sum, item) => sum + item.price, 0);
  const discountPct = activeItems.length >= 2 ? settings.fbtDiscountPercent : 0;
  const bundlePrice = Math.round(regularTotal * (1 - discountPct / 100));
  const savings = regularTotal - bundlePrice;

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return; // Keep primary product checked
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddBundleToCart = () => {
    if (activeItems.length === 1) {
      addToCart(currentProduct, 1);
    } else {
      const namesBn = activeItems.map((i) => i.nameBn).join(' + ');
      const namesEn = activeItems.map((i) => i.nameEn).join(' + ');
      const virtualBundle: Product = {
        ...currentProduct,
        id: `fbt-${activeItems.map((i) => i.id).join('-')}`,
        nameBn: `🎁 কম্বো বান্ডেল: ${namesBn}`,
        nameEn: `🎁 Bundle: ${namesEn}`,
        price: bundlePrice,
        originalPrice: regularTotal,
        discountPercent: discountPct,
      };
      addToCart(virtualBundle, 1);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section className="mt-10 p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0C2018] border border-stone-200/85 dark:border-[#1B3B2E] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174D35] dark:text-[#4ADE80]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>
              {isBn
                ? `একসাথে কিনলে ${formatNumeral(settings.fbtDiscountPercent, language)}% কম্বো ছাড়`
                : `Frequently Bought Together — Save ${settings.fbtDiscountPercent}%`}
            </span>
          </span>
          <h3 className="text-lg sm:text-xl font-serif-botanical font-bold text-stone-900 dark:text-white mt-0.5">
            {isBn
              ? 'গাছের সঠিক বৃদ্ধির জন্য বাগানিরা সাধারণত একসাথে নেন'
              : 'Complete Care Bundle Recommended by Our Horticulturists'}
          </h3>
        </div>

        {savings > 0 && (
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-[#174D35] text-amber-900 dark:text-[#4ADE80] text-xs font-extrabold">
            {isBn
              ? `আপনি সাশ্রয় করছেন ${formatPrice(savings, language)}`
              : `You Save ${formatPrice(savings, language)}`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 8 Cols: Visual Item Chain with Checkboxes */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {allItems.map((item, idx) => {
            const isChecked = selectedIds.includes(item.id);
            const isMain = item.id === currentProduct.id;
            return (
              <React.Fragment key={item.id}>
                {idx > 0 && (
                  <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-stone-100 dark:bg-[#153427] text-stone-500 dark:text-[#4ADE80] shrink-0 self-center">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`flex-1 p-3 rounded-2xl border transition-all flex items-center sm:flex-col sm:items-start gap-3 ${
                    isMain ? 'cursor-default' : 'cursor-pointer'
                  } ${
                    isChecked
                      ? 'border-[#22C55E] bg-emerald-50/40 dark:bg-[#132E22]/70'
                      : 'border-stone-200 dark:border-[#1B3B2E] opacity-60'
                  }`}
                >
                  <div className="relative w-16 h-16 sm:w-full sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={isBn ? item.nameBn : item.nameEn}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        isChecked
                          ? 'bg-[#174D35] text-[#4ADE80]'
                          : 'bg-white/90 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5" /> : null}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C8D50] dark:text-[#4ADE80] block">
                      {isMain
                        ? isBn
                          ? 'এই পণ্যটি'
                          : 'This Item'
                        : isBn
                        ? 'সহযোগী পণ্য'
                        : 'Add-on Companion'}
                    </span>
                    <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1 mt-0.5">
                      {isBn ? item.nameBn : item.nameEn}
                    </p>
                    <p className="text-xs font-extrabold text-[#174D35] dark:text-[#4ADE80] mt-1">
                      {formatPrice(item.price, language)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right 4 Cols: Bundle Total & Add All Button */}
        <div className="lg:col-span-4 rounded-2xl bg-[#F7F5EC] dark:bg-[#10261E] p-5 border border-stone-200/80 dark:border-[#1B3B2E] space-y-3">
          <div className="text-xs text-stone-600 dark:text-stone-300">
            {isBn
              ? `নির্বাচিত ${formatNumeral(activeItems.length, language)}টি পণ্যের কম্বো মূল্য:`
              : `Bundle Price for ${activeItems.length} Selected Items:`}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#174D35] dark:text-[#4ADE80]">
              {formatPrice(bundlePrice, language)}
            </span>
            {savings > 0 && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(regularTotal, language)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            className="w-full py-3 px-4 rounded-xl bg-[#174D35] hover:bg-[#22C55E] text-white hover:text-[#061810] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isBn ? 'কম্বো কার্টে যোগ হয়েছে!' : 'Bundle Added to Cart!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isBn
                    ? `সবগুলো একসাথে কার্টে নিন (${formatNumeral(activeItems.length, language)}টি)`
                    : `Add All ${activeItems.length} to Cart`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
