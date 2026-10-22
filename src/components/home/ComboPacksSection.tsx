/**
 * @file ComboPacksSection.tsx
 * @description Storefront Combo Packs & Custom Bundle Studio featuring:
 * 1. Curated Thematic Combo Packs with "What's Inside the Box" visual item breakdown,
 *    savings badges, 1-click Add to Cart, and 1-click Instant Buy Now.
 * 2. Interactive "Build Your Own Combo" (নিজের কম্বো নিজেই সাজান) 3-item bundle builder
 *    (1 Plant + 1 Seed + 1 Supply) with automatic percentage discount configured by Admin.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Gift,
  Sparkles,
  Check,
  ShoppingBag,
  Zap,
  Plus,
  Star,
  ArrowRight,
  PackageCheck,
  Sprout,
  Flower2,
  Shovel,
  CheckCircle2,
} from 'lucide-react';
import {
  comboService,
  ComboPack,
  ComboSettings,
  COMBOS_UPDATED_EVENT,
} from '../../services/comboService';
import { Product } from '../../types/product';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { InstantBuyNowModal } from '../shop/InstantBuyNowModal';

interface ComboPacksSectionProps {
  products?: Product[];
  isFullPage?: boolean;
}

export const ComboPacksSection: React.FC<ComboPacksSectionProps> = ({
  products = MOCK_PRODUCTS,
  isFullPage = false,
}) => {
  const { language } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

  const [combos, setCombos] = useState<ComboPack[]>(() => comboService.getActiveCombos());
  const [settings, setSettings] = useState<ComboSettings>(() => comboService.getSettings());
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');
  const [addedComboId, setAddedComboId] = useState<string | null>(null);
  const [instantBuyProduct, setInstantBuyProduct] = useState<Product | null>(null);

  // Sync with Admin updates in real time
  useEffect(() => {
    const handleSync = () => {
      setCombos(comboService.getActiveCombos());
      setSettings(comboService.getSettings());
    };
    window.addEventListener(COMBOS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(COMBOS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Categorized products for "Build Your Own Combo"
  const plantOptions = useMemo(
    () => products.filter((p) => p.type === 'plant' && p.inStock).slice(0, 8),
    [products]
  );
  const seedOptions = useMemo(
    () => products.filter((p) => p.type === 'seed' && p.inStock).slice(0, 8),
    [products]
  );
  const supplyOptions = useMemo(
    () =>
      products
        .filter((p) => (p.type === 'care' || p.type === 'tool') && p.inStock)
        .slice(0, 8),
    [products]
  );

  const [selectedPlantId, setSelectedPlantId] = useState<string>('');
  const [selectedSeedId, setSelectedSeedId] = useState<string>('');
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>('');
  const [customJustAdded, setCustomJustAdded] = useState(false);

  const selectedPlant =
    plantOptions.find((p) => p.id === selectedPlantId) || plantOptions[0] || null;
  const selectedSeed =
    seedOptions.find((p) => p.id === selectedSeedId) || seedOptions[0] || null;
  const selectedSupply =
    supplyOptions.find((p) => p.id === selectedSupplyId) || supplyOptions[0] || null;

  const handleAddComboToCart = (combo: ComboPack) => {
    const virtualProduct = comboService.comboToProduct(combo);
    addToCart(virtualProduct, 1);
    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 1600);
  };

  const handleInstantBuyCombo = (combo: ComboPack) => {
    const virtualProduct = comboService.comboToProduct(combo);
    setInstantBuyProduct(virtualProduct);
  };

  const handleAddCustomBundle = () => {
    if (!selectedPlant || !selectedSeed || !selectedSupply) return;
    const bundleProduct = comboService.customBundleToProduct(
      selectedPlant,
      selectedSeed,
      selectedSupply,
      settings.customComboDiscountPercent
    );
    addToCart(bundleProduct, 1);
    setCustomJustAdded(true);
    setTimeout(() => setCustomJustAdded(false), 1600);
  };

  const handleInstantBuyCustomBundle = () => {
    if (!selectedPlant || !selectedSeed || !selectedSupply) return;
    const bundleProduct = comboService.customBundleToProduct(
      selectedPlant,
      selectedSeed,
      selectedSupply,
      settings.customComboDiscountPercent
    );
    setInstantBuyProduct(bundleProduct);
  };

  if (combos.length === 0 && !settings.customComboEnabled) return null;

  const customRegularTotal =
    (selectedPlant?.price || 0) + (selectedSeed?.price || 0) + (selectedSupply?.price || 0);
  const customDiscountedPrice = Math.round(
    customRegularTotal * (1 - settings.customComboDiscountPercent / 100)
  );
  const customSavedAmount = customRegularTotal - customDiscountedPrice;

  return (
    <section
      id="combo-packs"
      className={`scroll-mt-20 ${isFullPage ? 'py-8 sm:py-12' : 'py-12 sm:py-16'} bg-transparent`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Mode Switcher Tabs */}
        <div className="ov-rv flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/10 dark:bg-[#153427] text-[#174D35] dark:text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                {isBn ? 'স্পেশাল কম্বো ও ভ্যালু বান্ডেল অফার' : 'Special Value Combo Bundles'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 dark:text-white leading-tight">
              {isBn
                ? 'একসাথে কিনুন, বেশি সাশ্রয় করুন — রেডিমেড ও কাস্টম কম্বো প্যাক'
                : 'Curated & Custom Botanical Combo Packs'}
            </h2>
            <p className="text-xs sm:text-base text-stone-600 dark:text-[#CBD5E1] mt-2 leading-relaxed">
              {isBn
                ? 'নতুন বাগানি কিংবা অভিজ্ঞ বৃক্ষপ্রেমীদের জন্য আমাদের বিশেষজ্ঞদের সাজানো রেডিমেড কম্বো প্যাক অথবা নিজের পছন্দমতো গাছ, বীজ ও সার মিলিয়ে কাস্টম বান্ডেল তৈরি করুন।'
                : 'Choose from our horticulturist-curated value bundles or build your own custom 3-in-1 plant, seed, and care combo with instant savings.'}
            </p>
          </div>

          {/* Interactive Switcher Pills: Curated Combos vs. Build Your Own Combo */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto bg-white/90 dark:bg-[#0C2018] p-1.5 rounded-2xl border border-stone-200/80 dark:border-[#1B3B2E] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('curated')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-[#174D35] text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#132E22]'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-[#4ADE80]" />
              <span>
                {isBn
                  ? `রেডিমেড কম্বো প্যাক (${formatNumeral(combos.length, language)})`
                  : `Curated Combos (${combos.length})`}
              </span>
            </button>

            {settings.customComboEnabled && (
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-[#174D35] text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#132E22]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>
                  {isBn
                    ? `নিজের কম্বো নিজেই সাজান (${formatNumeral(settings.customComboDiscountPercent, language)}% ছাড়)`
                    : `Build Your Own (${settings.customComboDiscountPercent}% Off)`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ─── TAB 1: CURATED COMBO PACKS GRID ─── */}
        {activeTab === 'curated' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {combos.map((combo) => {
              const title = isBn ? combo.titleBn : combo.titleEn;
              const subtitle = isBn ? combo.subtitleBn : combo.subtitleEn;
              const badge = isBn ? combo.badgeBn : combo.badgeEn;
              const benefits = isBn ? combo.benefitsBn : combo.benefitsEn;
              const savings = Math.max(0, combo.regularPrice - combo.comboPrice);
              const discountPct =
                combo.regularPrice > 0
                  ? Math.round((savings / combo.regularPrice) * 100)
                  : 0;
              const isAdded = addedComboId === combo.id;
              const isAvailable = combo.stockQuantity > 0;

              return (
                <article
                  key={combo.id}
                  className="ov-rv bg-white dark:bg-[#0C2018] rounded-3xl border border-stone-200/85 dark:border-[#1B3B2E] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Top Cover Banner with Savings & Rating Badges */}
                    <div className="relative h-52 sm:h-60 overflow-hidden bg-stone-100 dark:bg-[#10261E]">
                      <img
                        src={combo.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Top Left: Theme Badge */}
                      <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/90 backdrop-blur-md text-[#4ADE80] text-xs font-bold border border-[#4ADE80]/30 shadow-md">
                        <Gift className="w-3.5 h-3.5" />
                        <span>{badge}</span>
                      </div>

                      {/* Top Right: Savings Pill */}
                      {savings > 0 && (
                        <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#C5A059] text-stone-950 text-xs font-extrabold shadow-md">
                          {isBn
                            ? `সাশ্রয় ${formatPrice(savings, language)} (-${formatNumeral(discountPct, language)}%)`
                            : `Save ${formatPrice(savings, language)} (-${discountPct}%)`}
                        </div>
                      )}

                      {/* Bottom Title Overlay inside Image */}
                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {formatNumeral(combo.rating.toFixed(1), language)}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-300">
                            {formatNumeral(combo.soldCount, language)}+{' '}
                            {isBn ? 'কম্বো বিক্রি হয়েছে' : 'bundles sold'}
                          </span>
                          <span>•</span>
                          <span className="text-stone-200">
                            {isBn
                              ? `${formatNumeral(combo.items.length, language)}টি পণ্য একসাথে`
                              : `${combo.items.length} Items Included`}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif-botanical font-bold leading-snug drop-shadow">
                          {title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body: Subtitle + What's Inside the Box + Benefits */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-[#CBD5E1] leading-relaxed">
                        {subtitle}
                      </p>

                      {/* IDEA A: "What's Inside the Box" Visual Breakdown */}
                      <div className="rounded-2xl bg-[#F7F5EC]/90 dark:bg-[#10261E] p-3.5 border border-stone-200/70 dark:border-[#1B3B2E]">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#174D35] dark:text-[#4ADE80]">
                            {isBn
                              ? '📦 এই কম্বো প্যাকে যা যা থাকছে:'
                              : "📦 What's Inside This Combo:"}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-500 dark:text-[#9CB5A7]">
                            {isBn
                              ? `স্টক: ${formatNumeral(combo.stockQuantity, language)}টি`
                              : `Stock: ${combo.stockQuantity}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {combo.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2.5 bg-white dark:bg-[#0C2018] p-2 rounded-xl border border-stone-200/60 dark:border-[#1B3B2E]"
                            >
                              <img
                                src={item.imageUrl}
                                alt={isBn ? item.nameBn : item.nameEn}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-100 dark:border-[#1B3B2E]"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                                  {isBn ? item.nameBn : item.nameEn}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-[#9CB5A7] mt-0.5">
                                  <span>
                                    {isBn ? item.quantityLabelBn : item.quantityLabelEn}
                                  </span>
                                  <span className="font-semibold text-[#5C8D50] dark:text-[#4ADE80]">
                                    {formatPrice(item.unitPrice, language)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Benefits Checklist */}
                      {benefits && benefits.length > 0 && (
                        <ul className="space-y-1.5">
                          {benefits.map((b, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Combo Price + 1-Click Actions */}
                  <div className="px-5 sm:px-6 py-4 bg-stone-50/80 dark:bg-[#091812] border-t border-stone-200/70 dark:border-[#1B3B2E] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-[#9CB5A7] block">
                        {isBn ? 'বিশেষ কম্বো মূল্য:' : 'Special Combo Price:'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#174D35] dark:text-[#4ADE80]">
                          {formatPrice(combo.comboPrice, language)}
                        </span>
                        {combo.regularPrice > combo.comboPrice && (
                          <span className="text-xs sm:text-sm text-stone-400 line-through font-medium">
                            {formatPrice(combo.regularPrice, language)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => handleInstantBuyCombo(combo)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#7A5A1E] dark:text-[#FDE047] hover:text-stone-950 text-xs font-bold transition-all cursor-pointer active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{isBn ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleAddComboToCart(combo)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                          !isAvailable
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-[#22C55E] text-[#061810]'
                            : 'bg-[#174D35] hover:bg-[#22C55E] text-white hover:text-[#061810]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{isBn ? 'কার্টে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>{isBn ? 'কম্বো কার্টে নিন' : 'Add Combo to Cart'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: IDEA B — BUILD YOUR OWN COMBO STUDIO (নিজের কম্বো নিজেই সাজান) ─── */}
        {activeTab === 'custom' && settings.customComboEnabled && (
          <div className="ov-rv in bg-white dark:bg-[#0C2018] rounded-3xl border border-stone-200/85 dark:border-[#1B3B2E] p-5 sm:p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 8 Cols: 3-Step Selector (1 Plant + 1 Seed + 1 Supply) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Step 1: Pick a Plant */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-[#174D35] text-[#4ADE80] text-xs flex items-center justify-center">
                      ১
                    </span>
                    <Sprout className="w-4 h-4 text-[#174D35] dark:text-[#4ADE80]" />
                    <span>
                      {isBn
                        ? 'ধাপ ১: যেকোনো ১টি গাছ নির্বাচন করুন'
                        : 'Step 1: Choose Any 1 Live Plant'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {plantOptions.map((item) => {
                      const isPicked = selectedPlant?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedPlantId(item.id)}
                          className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isPicked
                              ? 'border-[#22C55E] bg-emerald-50/60 dark:bg-[#132E22] ring-2 ring-[#22C55E]/40'
                              : 'border-stone-200 dark:border-[#1B3B2E] hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={isBn ? item.nameBn : item.nameEn}
                            className="w-full h-20 object-cover rounded-xl mb-1.5"
                          />
                          <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                            {isBn ? item.nameBn : item.nameEn}
                          </p>
                          <p className="text-[11px] font-semibold text-[#174D35] dark:text-[#4ADE80] mt-0.5">
                            {formatPrice(item.price, language)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Pick a Seed Packet */}
                <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-[#1B3B2E]">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-[#174D35] text-[#4ADE80] text-xs flex items-center justify-center">
                      ২
                    </span>
                    <Flower2 className="w-4 h-4 text-[#C5A059]" />
                    <span>
                      {isBn
                        ? 'ধাপ ২: যেকোনো ১টি অর্গানিক বীজ প্যাকেট বেছে নিন'
                        : 'Step 2: Choose Any 1 Organic Seed Packet'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {seedOptions.map((item) => {
                      const isPicked = selectedSeed?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedSeedId(item.id)}
                          className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isPicked
                              ? 'border-[#22C55E] bg-emerald-50/60 dark:bg-[#132E22] ring-2 ring-[#22C55E]/40'
                              : 'border-stone-200 dark:border-[#1B3B2E] hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={isBn ? item.nameBn : item.nameEn}
                            className="w-full h-20 object-cover rounded-xl mb-1.5"
                          />
                          <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                            {isBn ? item.nameBn : item.nameEn}
                          </p>
                          <p className="text-[11px] font-semibold text-[#174D35] dark:text-[#4ADE80] mt-0.5">
                            {formatPrice(item.price, language)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Pick a Fertilizer or Tool */}
                <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-[#1B3B2E]">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-[#174D35] text-[#4ADE80] text-xs flex items-center justify-center">
                      ৩
                    </span>
                    <Shovel className="w-4 h-4 text-[#5C8D50]" />
                    <span>
                      {isBn
                        ? 'ধাপ ৩: যেকোনো ১টি সার বা বাগান সরঞ্জাম বেছে নিন'
                        : 'Step 3: Choose Any 1 Fertilizer or Tool'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {supplyOptions.map((item) => {
                      const isPicked = selectedSupply?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedSupplyId(item.id)}
                          className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isPicked
                              ? 'border-[#22C55E] bg-emerald-50/60 dark:bg-[#132E22] ring-2 ring-[#22C55E]/40'
                              : 'border-stone-200 dark:border-[#1B3B2E] hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={isBn ? item.nameBn : item.nameEn}
                            className="w-full h-20 object-cover rounded-xl mb-1.5"
                          />
                          <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                            {isBn ? item.nameBn : item.nameEn}
                          </p>
                          <p className="text-[11px] font-semibold text-[#174D35] dark:text-[#4ADE80] mt-0.5">
                            {formatPrice(item.price, language)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Live Custom Bundle Summary & Instant Discount Box */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 rounded-3xl bg-[#174D35] text-white p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-bold block">
                      {isBn ? 'আপনার কাস্টম বান্ডেল' : 'Your Custom Bundle'}
                    </span>
                    <h3 className="text-lg font-serif-botanical font-bold">
                      {isBn ? '৩-ইন-১ বাগান কম্বো বক্স' : '3-in-1 Garden Combo Box'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#4ADE80] text-[#061810] text-xs font-extrabold">
                    -{formatNumeral(settings.customComboDiscountPercent, language)}%
                  </span>
                </div>

                {/* Selected 3 Items Visual Stack */}
                <div className="space-y-2.5">
                  {[
                    { labelBn: 'গাছ', labelEn: 'Plant', item: selectedPlant },
                    { labelBn: 'বীজ', labelEn: 'Seed', item: selectedSeed },
                    { labelBn: 'সামগ্রী', labelEn: 'Supply', item: selectedSupply },
                  ].map((slot, i) =>
                    slot.item ? (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/10"
                      >
                        <img
                          src={slot.item.imageUrl}
                          alt={isBn ? slot.item.nameBn : slot.item.nameEn}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#4ADE80] font-semibold block">
                            {isBn ? slot.labelBn : slot.labelEn}
                          </span>
                          <p className="text-xs font-bold text-white truncate">
                            {isBn ? slot.item.nameBn : slot.item.nameEn}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-amber-200 shrink-0">
                          {formatPrice(slot.item.price, language)}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-white/15 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>{isBn ? '৩টি পণ্যের মোট মূল্য:' : 'Regular Total (3 Items):'}</span>
                    <span className="line-through">
                      {formatPrice(customRegularTotal, language)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#4ADE80] font-semibold">
                    <span>
                      {isBn
                        ? `কম্বো ডিসকাউন্ট (${formatNumeral(settings.customComboDiscountPercent, language)}%):`
                        : `Bundle Discount (${settings.customComboDiscountPercent}%):`}
                    </span>
                    <span>-{formatPrice(customSavedAmount, language)}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-base font-extrabold text-white pt-2 border-t border-white/10">
                    <span>{isBn ? 'আপনার কম্বো মূল্য:' : 'Your Bundle Price:'}</span>
                    <span className="text-2xl text-[#C5A059]">
                      {formatPrice(customDiscountedPrice, language)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleAddCustomBundle}
                    className="w-full py-3 px-4 rounded-2xl bg-[#4ADE80] hover:bg-[#86EFAC] text-[#061810] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    {customJustAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isBn ? 'কাস্টম কম্বো কার্টে যোগ হয়েছে!' : 'Custom Bundle Added!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {isBn ? 'কাস্টম কম্বো কার্টে যোগ করুন' : 'Add Custom Combo to Cart'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantBuyCustomBundle}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white/12 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                    <span>
                      {isBn
                        ? '১-ক্লিকে সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)'
                        : '1-Click Instant Order (Cash on Delivery)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA to Dedicated Combos Page when rendered on Homepage */}
        {!isFullPage && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate('/combos')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#0C2018] border border-stone-200 dark:border-[#1B3B2E] text-xs sm:text-sm font-bold text-[#174D35] dark:text-[#4ADE80] hover:bg-[#174D35] hover:text-white transition-all shadow-xs cursor-pointer"
            >
              <span>
                {isBn
                  ? 'সকল কম্বো প্যাক ও কাস্টম বান্ডেল মেকার দেখুন'
                  : 'Explore All Combo Packs & Custom Bundle Studio'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {instantBuyProduct && (
        <InstantBuyNowModal
          isOpen={Boolean(instantBuyProduct)}
          onClose={() => setInstantBuyProduct(null)}
          product={instantBuyProduct}
        />
      )}
    </section>
  );
};
