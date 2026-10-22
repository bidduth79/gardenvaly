/**
 * @file AdminCombosPage.tsx
 * @description Complete Admin Management Page (/admin/combos) allowing the store admin
 * to create, edit, delete, toggle active status, manage items inside each Combo Pack,
 * and configure global discount percentages for "Build Your Own Combo" and
 * "Frequently Bought Together".
 */

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  PackageCheck,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import {
  comboService,
  ComboPack,
  ComboItem,
  ComboSettings,
  COMBOS_UPDATED_EVENT,
} from '../../services/comboService';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';

export const AdminCombosPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [combos, setCombos] = useState<ComboPack[]>(() => comboService.getCombos());
  const [settings, setSettings] = useState<ComboSettings>(() => comboService.getSettings());
  const [editingCombo, setEditingCombo] = useState<ComboPack | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setCombos(comboService.getCombos());
      setSettings(comboService.getSettings());
    };
    window.addEventListener(COMBOS_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(COMBOS_UPDATED_EVENT, handleSync);
  }, []);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2800);
  };

  const handleToggleActive = (combo: ComboPack) => {
    comboService.updateCombo(combo.id, { isActive: !combo.isActive });
    showToast(
      isBn
        ? 'কম্বো প্যাকের স্ট্যাটাস আপডেট হয়েছে'
        : 'Combo pack visibility updated'
    );
  };

  const handleDeleteCombo = (id: string) => {
    comboService.deleteCombo(id);
    showToast(isBn ? 'কম্বো প্যাকটি মুছে ফেলা হয়েছে' : 'Combo pack deleted');
  };

  const handleResetDefaults = () => {
    comboService.resetCombosToDefault();
    showToast(
      isBn
        ? 'ডিফল্ট কম্বো প্যাক ও সেটিংস পুনরুদ্ধার করা হয়েছে'
        : 'Default combo packs restored'
    );
  };

  const handleSaveSettings = (newSettings: ComboSettings) => {
    setSettings(newSettings);
    comboService.saveSettings(newSettings);
    showToast(isBn ? 'কম্বো সেটিংস সংরক্ষিত হয়েছে!' : 'Combo settings saved!');
  };

  const handleStartCreate = () => {
    const newPack: ComboPack = {
      id: `combo-${Date.now()}`,
      slug: `special-combo-${Date.now()}`,
      badgeBn: 'স্পেশাল কম্বো অফার',
      badgeEn: 'Special Combo Offer',
      titleBn: 'নতুন স্পেশাল বাগান কম্বো প্যাক',
      titleEn: 'New Botanical Value Combo Pack',
      subtitleBn: 'গাছ, বীজ ও পরিচর্যা সামগ্রীর সমন্বয়ে বিশেষ সাশ্রয়ী কম্বো প্যাক।',
      subtitleEn: 'Curated botanical value pack with plants, seeds, and care essentials.',
      imageUrl:
        'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80',
      regularPrice: 1000,
      comboPrice: 800,
      isActive: true,
      isFeatured: true,
      stockQuantity: 20,
      soldCount: 15,
      rating: 4.9,
      items: [
        {
          id: `ci-${Date.now()}-1`,
          nameBn: 'স্নেক প্ল্যান্ট চারা',
          nameEn: 'Snake Plant Sapling',
          quantityLabelBn: '১টি চারা',
          quantityLabelEn: '1 Plant',
          imageUrl:
            'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=300&q=80',
          unitPrice: 350,
        },
        {
          id: `ci-${Date.now()}-2`,
          nameBn: 'রেডি পটিং মিক্স ও জৈব সার',
          nameEn: 'Ready Potting Soil & Compost',
          quantityLabelBn: '৫ কেজি প্যাক',
          quantityLabelEn: '5 kg Pack',
          imageUrl:
            'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80',
          unitPrice: 300,
        },
      ],
      benefitsBn: [
        'আলাদা কেনার চেয়ে বিশেষ মূল্যে সাশ্রয়',
        '১০০% সুস্থ ও সতেজ চারার নিশ্চয়তা',
      ],
      benefitsEn: [
        'Special bundle savings compared to individual items',
        '100% healthy nursery-grade plants',
      ],
    };
    setEditingCombo(newPack);
    setIsCreating(true);
  };

  const handleSaveComboForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;
    if (isCreating) {
      comboService.addCombo(editingCombo);
      showToast(isBn ? 'নতুন কম্বো প্যাক তৈরি হয়েছে!' : 'New combo pack created!');
    } else {
      comboService.updateCombo(editingCombo.id, editingCombo);
      showToast(isBn ? 'কম্বো প্যাক আপডেট সংরক্ষিত হয়েছে!' : 'Combo pack updated!');
    }
    setEditingCombo(null);
    setIsCreating(false);
  };

  const handleAddItemToEditing = () => {
    if (!editingCombo) return;
    const newItem: ComboItem = {
      id: `ci-${Date.now()}`,
      nameBn: 'নতুন পণ্য',
      nameEn: 'New Bundle Item',
      quantityLabelBn: '১টি',
      quantityLabelEn: '1 Unit',
      imageUrl:
        'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=300&q=80',
      unitPrice: 200,
    };
    setEditingCombo({
      ...editingCombo,
      items: [...editingCombo.items, newItem],
    });
  };

  const handleQuickAddStoreProduct = (productId: string) => {
    if (!editingCombo || !productId) return;
    const found = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!found) return;
    const newItem: ComboItem = {
      id: `ci-${Date.now()}`,
      nameBn: found.nameBn,
      nameEn: found.nameEn,
      quantityLabelBn: found.packetSizeBn || '১টি',
      quantityLabelEn: found.packetSizeEn || '1 Unit',
      imageUrl: found.imageUrl,
      unitPrice: found.price,
    };
    const nextItems = [...editingCombo.items, newItem];
    const autoRegPrice = nextItems.reduce((sum, i) => sum + Number(i.unitPrice || 0), 0);
    setEditingCombo({
      ...editingCombo,
      items: nextItems,
      regularPrice: autoRegPrice,
      comboPrice: Math.round(autoRegPrice * 0.82),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174D35] mb-1">
            <Gift className="w-4 h-4 text-[#C5A059]" />
            <span>{isBn ? 'কম্বো ও বান্ডেল কন্ট্রোল সেন্টার' : 'Combo & Bundle Management'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900">
            {isBn ? 'কম্বো প্যাক সাজান ও ম্যানেজ করুন' : 'Manage Combo Packs & Bundle Offers'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {isBn
              ? 'এখান থেকে রেডিমেড কম্বো প্যাক তৈরি, ভেতরের পণ্য পরিবর্তন, দাম নির্ধারণ এবং কাস্টম কম্বোর ডিসকাউন্ট নিয়ন্ত্রণ করুন।'
              : 'Create and customize combo packs, edit included items, and configure custom bundle discount rules.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBn ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#4ADE80]" />
            <span>{isBn ? '+ নতুন কম্বো প্যাক তৈরি করুন' : '+ Create New Combo Pack'}</span>
          </button>
        </div>
      </div>

      {/* Status Toast */}
      {savedToast && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-lg">
          <Check className="w-4 h-4 text-[#4ADE80]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Global Settings Card: Custom Combo Studio & Frequently Bought Together */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>
            {isBn
              ? 'স্বয়ংক্রিয় কাস্টম কম্বো ও প্রোডাক্ট পেইজ বান্ডেল সেটিংস'
              : 'Interactive Custom Bundle & Product Page Bundle Settings'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Setting 1: Build Your Own Combo */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="toggle-custom-combo"
                  checked={settings.customComboEnabled}
                  onChange={(e) =>
                    handleSaveSettings({
                      ...settings,
                      customComboEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#174D35] rounded cursor-pointer"
                />
                <label
                  htmlFor="toggle-custom-combo"
                  className="text-xs sm:text-sm font-bold text-stone-900 cursor-pointer"
                >
                  {isBn
                    ? '"নিজের কম্বো নিজেই সাজান" (Build Your Own Combo)'
                    : '"Build Your Own Combo" Studio'}
                </label>
              </div>
              <p className="text-[11px] text-stone-500">
                {isBn
                  ? 'গ্রাহক ১টি গাছ + ১টি বীজ + ১টি সার একসাথে নিলে কত % ছাড় পাবে'
                  : 'Discount % when customer picks 1 Plant + 1 Seed + 1 Supply'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="number"
                min={0}
                max={60}
                value={settings.customComboDiscountPercent}
                onChange={(e) =>
                  handleSaveSettings({
                    ...settings,
                    customComboDiscountPercent: Math.max(
                      0,
                      Math.min(60, Number(e.target.value) || 0)
                    ),
                  })
                }
                className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-center text-stone-900 bg-white"
              />
              <span className="text-xs font-bold text-stone-700">% ছাড়</span>
            </div>
          </div>

          {/* Setting 2: Frequently Bought Together */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="toggle-fbt"
                  checked={settings.fbtEnabled}
                  onChange={(e) =>
                    handleSaveSettings({
                      ...settings,
                      fbtEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#174D35] rounded cursor-pointer"
                />
                <label
                  htmlFor="toggle-fbt"
                  className="text-xs sm:text-sm font-bold text-stone-900 cursor-pointer"
                >
                  {isBn
                    ? 'প্রোডাক্ট পেইজে "একসাথে কিনলে সাশ্রয়" (Frequently Bought Together)'
                    : 'Product Page "Frequently Bought Together"'}
                </label>
              </div>
              <p className="text-[11px] text-stone-500">
                {isBn
                  ? 'প্রোডাক্ট ডিটেইল পেইজে সহযোগী পণ্যের বান্ডেল ডিসকাউন্ট হার'
                  : 'Discount % for add-on bundles on product detail pages'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="number"
                min={0}
                max={50}
                value={settings.fbtDiscountPercent}
                onChange={(e) =>
                  handleSaveSettings({
                    ...settings,
                    fbtDiscountPercent: Math.max(
                      0,
                      Math.min(50, Number(e.target.value) || 0)
                    ),
                  })
                }
                className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-center text-stone-900 bg-white"
              />
              <span className="text-xs font-bold text-stone-700">% ছাড়</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Combo Pack Modal / Drawer Form */}
      {editingCombo && (
        <div className="bg-white p-5 sm:p-7 rounded-2xl border-2 border-[#174D35] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3.5">
            <h2 className="text-lg font-serif-botanical font-bold text-stone-900 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#174D35]" />
              <span>
                {isCreating
                  ? isBn
                    ? 'নতুন কম্বো প্যাক তৈরি করুন'
                    : 'Create New Combo Pack'
                  : isBn
                  ? 'কম্বো প্যাক সম্পাদনা করুন'
                  : 'Edit Combo Pack'}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingCombo(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveComboForm} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'কম্বোর নাম (বাংলা)' : 'Combo Title (Bengali)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCombo.titleBn}
                  onChange={(e) =>
                    setEditingCombo({ ...editingCombo, titleBn: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'কম্বোর নাম (ইংরেজি)' : 'Combo Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCombo.titleEn}
                  onChange={(e) =>
                    setEditingCombo({ ...editingCombo, titleEn: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'ব্যাজ ট্যাগ (বাংলা)' : 'Badge Label (Bengali)'}
                </label>
                <input
                  type="text"
                  value={editingCombo.badgeBn}
                  onChange={(e) =>
                    setEditingCombo({ ...editingCombo, badgeBn: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'কম্বো কভার ছবির লিংক (Image URL)' : 'Cover Image URL'}
                </label>
                <input
                  type="url"
                  required
                  value={editingCombo.imageUrl}
                  onChange={(e) =>
                    setEditingCombo({ ...editingCombo, imageUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Subtitle Description (Bengali)'}
                </label>
                <textarea
                  rows={2}
                  value={editingCombo.subtitleBn}
                  onChange={(e) =>
                    setEditingCombo({ ...editingCombo, subtitleBn: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
            </div>

            {/* Pricing & Stock Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'রেগুলার মোট মূল্য (৳)' : 'Regular Price (৳)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editingCombo.regularPrice}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      regularPrice: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#174D35] mb-1">
                  {isBn ? 'ডিসকাউন্ট কম্বো মূল্য (৳)' : 'Combo Offer Price (৳)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editingCombo.comboPrice}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      comboPrice: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#174D35] text-sm font-bold text-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'স্টক সংখ্যা' : 'Stock Quantity'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingCombo.stockQuantity}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      stockQuantity: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-bold"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] text-stone-500">
                  {isBn ? 'গ্রাহকের সাশ্রয়:' : 'Customer Saves:'}
                </span>
                <span className="text-base font-extrabold text-emerald-700">
                  {formatPrice(
                    Math.max(0, editingCombo.regularPrice - editingCombo.comboPrice),
                    language
                  )}
                </span>
              </div>
            </div>

            {/* Items Inside the Combo Editor */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-bold text-stone-900">
                  {isBn
                    ? `📦 কম্বোর ভেতরের পণ্যসমূহ (${formatNumeral(editingCombo.items.length, language)}টি)`
                    : `📦 Items Included in Combo (${editingCombo.items.length})`}
                </label>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      handleQuickAddStoreProduct(e.target.value);
                      e.target.value = '';
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white text-stone-800"
                  >
                    <option value="">
                      {isBn
                        ? '+ স্টোরের বিদ্যমান পণ্য থেকে যোগ করুন...'
                        : '+ Quick-add from store catalog...'}
                    </option>
                    {MOCK_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isBn ? p.nameBn : p.nameEn} ({formatPrice(p.price, language)})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddItemToEditing}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    {isBn ? '+ কাস্টম আইটেম যোগ' : '+ Add Custom Item'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {editingCombo.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder={isBn ? 'পণ্যের নাম (বাংলা)' : 'Item Name (BN)'}
                        value={item.nameBn}
                        onChange={(e) => {
                          const next = [...editingCombo.items];
                          next[idx] = { ...item, nameBn: e.target.value, nameEn: e.target.value };
                          setEditingCombo({ ...editingCombo, items: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder={isBn ? 'পরিমাণ (যেমন: ১টি চারা)' : 'Quantity'}
                        value={item.quantityLabelBn}
                        onChange={(e) => {
                          const next = [...editingCombo.items];
                          next[idx] = {
                            ...item,
                            quantityLabelBn: e.target.value,
                            quantityLabelEn: e.target.value,
                          };
                          setEditingCombo({ ...editingCombo, items: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        placeholder="মূল্য (৳)"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const next = [...editingCombo.items];
                          next[idx] = { ...item, unitPrice: Number(e.target.value) || 0 };
                          setEditingCombo({ ...editingCombo, items: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="url"
                        placeholder="ছবির লিংক"
                        value={item.imageUrl}
                        onChange={(e) => {
                          const next = [...editingCombo.items];
                          next[idx] = { ...item, imageUrl: e.target.value };
                          setEditingCombo({ ...editingCombo, items: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const next = editingCombo.items.filter((_, i) => i !== idx);
                          setEditingCombo({ ...editingCombo, items: next });
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setEditingCombo(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                {isBn ? 'বাতিল করুন' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#4ADE80]" />
                <span>{isBn ? 'কম্বো প্যাক সংরক্ষণ করুন' : 'Save Combo Pack'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Combo Packs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {combos.map((combo) => {
          const savings = Math.max(0, combo.regularPrice - combo.comboPrice);
          return (
            <div
              key={combo.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between gap-4 transition-opacity ${
                combo.isActive ? 'border-stone-200/90' : 'border-stone-200/50 opacity-65'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={combo.imageUrl}
                  alt={isBn ? combo.titleBn : combo.titleEn}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-stone-200"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#174D35] text-[10px] font-bold">
                      {isBn ? combo.badgeBn : combo.badgeEn}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        combo.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {combo.isActive
                        ? isBn
                          ? 'সক্রিয় (Active)'
                          : 'Active'
                        : isBn
                        ? 'লুকানো (Hidden)'
                        : 'Hidden'}
                    </span>
                  </div>

                  <h3 className="text-base font-serif-botanical font-bold text-stone-900 line-clamp-1">
                    {isBn ? combo.titleBn : combo.titleEn}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2">
                    {isBn ? combo.subtitleBn : combo.subtitleEn}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-[#174D35]">
                      {formatPrice(combo.comboPrice, language)}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(combo.regularPrice, language)}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700">
                      ({isBn ? `সাশ্রয় ${formatPrice(savings, language)}` : `Save ${formatPrice(savings, language)}`})
                    </span>
                  </div>
                </div>
              </div>

              {/* Included Mini Items Preview */}
              <div className="flex items-center gap-1.5 flex-wrap bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                {combo.items.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-stone-200/80 text-[11px] font-medium text-stone-700"
                  >
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-4 h-4 rounded object-cover"
                    />
                    <span className="truncate max-w-[130px]">
                      {isBn ? item.nameBn : item.nameEn}
                    </span>
                  </span>
                ))}
              </div>

              {/* Admin Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  {isBn
                    ? `স্টক: ${formatNumeral(combo.stockQuantity, language)}টি`
                    : `Stock: ${combo.stockQuantity}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(combo)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    {combo.isActive ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{isBn ? 'লুকান' : 'Hide'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isBn ? 'প্রদর্শন করুন' : 'Show'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCombo(combo);
                      setIsCreating(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#174D35] text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট / সাজান' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCombo(combo.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
