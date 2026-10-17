/**
 * @file AdminProductFormPage.tsx
 * @description Create & Edit form for plants and heirloom seeds with bilingual content, care instructions, and pricing.
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Sprout,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Upload,
  X,
  Plus,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product, ProductCategoryType, Category } from '../../types/product';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

export const AdminProductFormPage: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();

  const isEdit = currentPath.includes('/edit');
  // Extract id from path e.g. /admin/products/:id/edit
  const match = currentPath.match(/\/admin\/products\/([^/]+)\/edit/);
  const productId = match ? match[1] : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    botanicalName: '',
    category: 'Indoor Plants',
    categorySlug: 'indoor-plants',
    type: 'plant' as ProductCategoryType,
    price: 350,
    originalPrice: 400,
    stockQuantity: 15,
    SKU: '',
    imageUrl: '',
    images: [] as string[],
    isFeatured: false,
    isBestseller: false,
    descriptionEn: '',
    descriptionBn: '',
    sunlightEn: 'Bright indirect light',
    sunlightBn: 'উজ্জ্বল পরোক্ষ আলো',
    waterEn: 'Water when topsoil is dry',
    waterBn: 'উপরের মাটি শুকালে পানি দিন',
    packetSizeEn: '',
    packetSizeBn: '',
    plantingSeasonEn: '',
    plantingSeasonBn: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const updated = [...(prev.images || []), trimmed];
      return {
        ...prev,
        images: updated,
        imageUrl: prev.imageUrl || trimmed,
      };
    });
    setNewImageUrl('');
  };

  const handleDeviceFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setFormData((prev) => {
            const updated = [...(prev.images || []), result];
            return {
              ...prev,
              images: updated,
              imageUrl: prev.imageUrl || result,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || '',
      };
    });
  };

  const handleSetCover = (index: number) => {
    setFormData((prev) => {
      const list = [...(prev.images || [])];
      const [selected] = list.splice(index, 1);
      const updated = [selected, ...list];
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || '',
      };
    });
  };

  useEffect(() => {
    async function init() {
      const cats = await adminService.getAllCategories();
      setCategories(cats);

      if (isEdit && productId) {
        setLoading(true);
        const prod = await adminService.getProductById(productId);
        if (prod) {
          const initImages = Array.isArray(prod.images) && prod.images.length > 0
            ? prod.images
            : (prod.imageUrl ? [prod.imageUrl] : []);
          setFormData({
            nameEn: prod.nameEn,
            nameBn: prod.nameBn,
            botanicalName: prod.botanicalName || '',
            category: prod.category,
            categorySlug: prod.categorySlug,
            type: prod.type,
            price: prod.price,
            originalPrice: prod.originalPrice || prod.price,
            stockQuantity: prod.stockQuantity,
            SKU: prod.SKU,
            imageUrl: prod.imageUrl,
            images: initImages,
            isFeatured: prod.isFeatured,
            isBestseller: Boolean(prod.isBestseller),
            descriptionEn: prod.shortDescEn || prod.descriptionEn || '',
            descriptionBn: prod.shortDescBn || prod.descriptionBn || '',
            sunlightEn: prod.sunlightEn || '',
            sunlightBn: prod.sunlightBn || '',
            waterEn: prod.waterEn || '',
            waterBn: prod.waterBn || '',
            packetSizeEn: prod.packetSizeEn || '',
            packetSizeBn: prod.packetSizeBn || '',
            plantingSeasonEn: prod.plantingSeasonEn || '',
            plantingSeasonBn: prod.plantingSeasonBn || '',
          });
        }
        setLoading(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          SKU: `GV-${Math.floor(1000 + Math.random() * 9000)}`,
        }));
      }
    }
    init();
  }, [isEdit, productId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nameEn.trim()) errs.nameEn = 'English name is required';
    if (!formData.nameBn.trim()) errs.nameBn = 'বাংলা নাম আবশ্যক';
    if (formData.price <= 0) errs.price = 'Price must be greater than 0';
    if (formData.stockQuantity < 0) errs.stockQuantity = 'Stock cannot be negative';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const finalImages = formData.images && formData.images.length > 0
      ? formData.images
      : (formData.imageUrl ? [formData.imageUrl] : []);
    const primaryImg = finalImages[0] || formData.imageUrl;

    await adminService.saveProduct({
      id: productId || undefined,
      ...formData,
      images: finalImages,
      inStock: formData.stockQuantity > 0,
      imageUrl: getSafeImageUrl(primaryImg, {
        type: formData.type,
        categorySlug: formData.categorySlug,
      }),
    });

    setLoading(false);
    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/admin/products');
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#174D35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to Products'}</span>
        </button>

        <span className="text-xs text-stone-500">
          {isEdit ? `Editing: ${productId}` : 'New Botanical Entry'}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <div className="pb-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {isEdit
                ? language === 'bn' ? 'পণ্য তথ্য সম্পাদনা' : 'Edit Botanical Product'
                : language === 'bn' ? 'নতুন পণ্য তালিকাভুক্ত করুন' : 'Create New Botanical Product'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'bn'
                ? 'গার্ডেনভ্যালি স্টোরফ্রন্টে প্রদর্শনের জন্য উভয় ভাষায় তথ্য পূরণ করুন।'
                : 'Fill in bilingual titles, nursery pricing, stock levels, and cultivation guidelines.'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#174D35] flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'bn'
                ? 'পণ্যটি সফলভাবে সংরক্ষণ করা হয়েছে! প্রোডাক্ট তালিকায় রিডাইরেক্ট করা হচ্ছে...'
                : 'Product successfully saved! Redirecting to products catalog...'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-[#174D35]">
              1. {language === 'bn' ? 'মৌলিক বিবরণ (Bilingual Names)' : 'Basic Information'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Monstera Deliciosa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
                {errors.nameEn && <p className="text-red-500 text-[11px] mt-1">{errors.nameEn}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  পণ্যের নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: মনস্টেরা ডেলিসিওসা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
                {errors.nameBn && <p className="text-red-500 text-[11px] mt-1">{errors.nameBn}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Botanical Name (Scientific)
                </label>
                <input
                  type="text"
                  value={formData.botanicalName}
                  onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                  placeholder="e.g. Monstera deliciosa Liebm."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Type (গাছ / বীজ)
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ProductCategoryType })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                >
                  <option value="plant">Plant (জীবন্ত চারাগাছ)</option>
                  <option value="seed">Seed (বীজ প্যাকেট)</option>
                  <option value="tool">Garden Tool (সরঞ্জাম)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.categorySlug}
                  onChange={(e) => {
                    const c = categories.find((cat) => cat.slug === e.target.value);
                    setFormData({
                      ...formData,
                      categorySlug: e.target.value,
                      category: c ? c.nameEn : 'General',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.nameEn} ({c.nameBn})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing and Inventory */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-[#174D35]">
              2. {language === 'bn' ? 'মূল্য ও স্টক (Pricing & Stock)' : 'Pricing & Inventory'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Selling Price (BDT ৳) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
                {errors.price && <p className="text-red-500 text-[11px] mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Original / Regular Price (BDT ৳)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Stock Quantity (নার্সারি স্টক) *
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
                {errors.stockQuantity && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.stockQuantity}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={formData.SKU}
                  onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                  placeholder="e.g. GV-8821"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    {language === 'bn' ? 'পণ্যের গ্যালারি ছবি (১ থেকে ৫+ ছবি)' : 'Product Gallery Images (1 to 5+ Photos)'}
                  </label>
                  <span className="text-[11px] font-bold text-[#174D35] bg-emerald-50 px-2 py-0.5 rounded-full">
                    {language === 'bn' ? `মোট ছবি: ${formData.images.length}টি` : `Total Images: ${formData.images.length}`}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    placeholder="https://images.unsplash.com/... বা লিংক দিয়ে যোগ করুন"
                    className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'যোগ করুন' : 'Add'}</span>
                  </button>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ডিভাইস ফাইল' : 'Upload'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleDeviceFiles}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const def = getProductFallbackImage(formData);
                      setFormData((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), def],
                        imageUrl: prev.imageUrl || def,
                      }));
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shrink-0"
                    title={language === 'bn' ? 'অরজিনাল ডিফল্ট ছবি যোগ করুন' : 'Add default sample photo'}
                  >
                    <span>{language === 'bn' ? 'ডিফল্ট ছবি' : 'Default'}</span>
                  </button>
                </div>

                {/* Uploaded Images Thumbnails Grid */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 bg-white flex flex-col group ${
                          idx === 0 ? 'border-[#174D35] ring-2 ring-[#174D35]/20 shadow-xs' : 'border-stone-200'
                        }`}
                      >
                        <div className="h-24 bg-stone-100 overflow-hidden relative">
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, getProductFallbackImage(formData))}
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#174D35] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              ★ {language === 'bn' ? 'কভার' : 'Cover'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="py-1 text-[10px] font-bold text-stone-600 hover:text-[#174D35] hover:bg-emerald-50 transition-colors border-t border-stone-100 cursor-pointer"
                          >
                            {language === 'bn' ? 'কভার বানান' : 'Set as Cover'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-stone-400 italic">
                    {language === 'bn'
                      ? '⚠️ কোনো ছবি যোগ করা হয়নি। অন্তত ০১টি ছবি যোগ করুন।'
                      : '⚠️ No images added yet. Please add at least 1 image.'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#174D35] focus:ring-[#174D35]"
                />
                <span className="text-xs font-medium text-stone-700">
                  {language === 'bn' ? 'হোমপেজে ফিচার্ড হিসেবে প্রদর্শন' : 'Show in Featured Products'}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  className="w-4 h-4 rounded text-[#174D35] focus:ring-[#174D35]"
                />
                <span className="text-xs font-medium text-stone-700">
                  {language === 'bn' ? 'বেস্টসেলার ব্যাজ' : 'Bestseller Badge'}
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Cultivation Guidelines */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-[#174D35]">
              3. {language === 'bn' ? 'চাষ ও যত্ন নির্দেশিকা (Care Guide)' : 'Care & Cultivation Specs'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sunlight Requirement (English)
                </label>
                <input
                  type="text"
                  value={formData.sunlightEn}
                  onChange={(e) => setFormData({ ...formData, sunlightEn: e.target.value })}
                  placeholder="Bright indirect sunlight"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  সূর্যালোকের চাহিদা (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.sunlightBn}
                  onChange={(e) => setFormData({ ...formData, sunlightBn: e.target.value })}
                  placeholder="উজ্জ্বল পরোক্ষ রোদ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Watering Frequency (English)
                </label>
                <input
                  type="text"
                  value={formData.waterEn}
                  onChange={(e) => setFormData({ ...formData, waterEn: e.target.value })}
                  placeholder="Water when topsoil feels dry"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  পানির নিয়ম (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.waterBn}
                  onChange={(e) => setFormData({ ...formData, waterBn: e.target.value })}
                  placeholder="মাটির আর্দ্রতা দেখে পানি দিন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="py-2.5 px-5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>
                {loading
                  ? language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'
                  : language === 'bn' ? 'পণ্য সংরক্ষণ করুন' : 'Save Product'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
