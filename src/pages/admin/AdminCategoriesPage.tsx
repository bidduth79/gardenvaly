/**
 * @file AdminCategoriesPage.tsx
 * @description Category taxonomy management for plants, heirloom seeds, and garden essentials.
 */

import React, { useState, useEffect } from 'react';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Sprout,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category, ProductCategoryType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

export const AdminCategoriesPage: React.FC = () => {
  const { language } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    type: 'plant' as ProductCategoryType,
    descriptionEn: '',
    descriptionBn: '',
    imageUrl: '',
  });

  const fetchCategories = async () => {
    const list = await adminService.getAllCategories();
    setCategories(list);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      nameEn: '',
      nameBn: '',
      type: 'plant',
      descriptionEn: '',
      descriptionBn: '',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      nameEn: cat.nameEn,
      nameBn: cat.nameBn,
      type: cat.type,
      descriptionEn: cat.descriptionEn,
      descriptionBn: cat.descriptionBn,
      imageUrl: cat.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn.trim()) return;

    await adminService.saveCategory({
      id: editingCategory ? editingCategory.id : undefined,
      ...formData,
      nameBn: formData.nameBn || formData.nameEn,
    });

    setIsModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await adminService.deleteCategory(id);
      fetchCategories();
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'ক্যাটাগরি ব্যবস্থাপনা' : 'Category Taxonomy'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'গার্ডেনভ্যালির উদ্ভিদ ও বীজ বিভাগসমূহ সাজান'
              : 'Organize botanical collections, indoor foliage, and organic seed varieties'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন ক্যাটাগরি' : 'Add Category'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {['all', 'plant', 'seed'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              filterType === type
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            {type === 'all'
              ? language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'
              : type === 'plant'
              ? language === 'bn' ? 'গাছ (Plants)' : 'Plant Categories'
              : language === 'bn' ? 'বীজ (Seeds)' : 'Seed Categories'}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-[#174D35]/30 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <img
                  src={getSafeImageUrl(cat.imageUrl, { type: cat.type, categorySlug: cat.slug })}
                  alt={cat.nameEn}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-100 shadow-xs"
                  onError={(e) => handleImageError(e, getProductFallbackImage({ type: cat.type, categorySlug: cat.slug }))}
                />
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800">
                  {cat.type}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-stone-900 text-base">
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {cat.nameEn} • <span className="font-mono">{cat.slug}</span>
                </p>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {language === 'bn'
                    ? cat.descriptionBn || cat.descriptionEn
                    : cat.descriptionEn}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                {cat.itemCount || 0} {language === 'bn' ? 'টি পণ্য' : 'products'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base">
                {editingCategory
                  ? language === 'bn' ? 'ক্যাটাগরি সম্পাদনা' : 'Edit Category'
                  : language === 'bn' ? 'নতুন ক্যাটাগরি তৈরি' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Indoor Plants"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ক্যাটাগরির নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: ইনডোর প্ল্যান্ট"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ProductCategoryType })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                >
                  <option value="plant">Plant (গাছ)</option>
                  <option value="seed">Seed (বীজ)</option>
                  <option value="tool">Tool (টুল)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'bn' ? 'ক্যাটাগরি ছবি (ডিভাইস আপলোড বা লিংক)' : 'Category Image (Upload or URL)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... বা আপলোড করুন"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ব্রাউজ' : 'Browse'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setFormData({ ...formData, imageUrl: ev.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        imageUrl: getProductFallbackImage({ type: formData.type }),
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shrink-0"
                    title={language === 'bn' ? 'অরজিনাল ডিফল্ট ছবি বসান' : 'Use original default photo'}
                  >
                    <span>{language === 'bn' ? 'ডিফল্ট ছবি' : 'Default'}</span>
                  </button>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-2 p-1.5 bg-stone-50 rounded-xl border border-stone-200">
                    <img
                      src={formData.imageUrl}
                      alt="Category preview"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-200 shrink-0"
                      onError={(e) => handleImageError(e, getProductFallbackImage({ type: formData.type }))}
                    />
                    <div className="flex-1 min-w-0 text-[11px] text-stone-500 truncate">
                      {formData.imageUrl.startsWith('data:') ? 'ডিভাইস থেকে ছবি যুক্ত হয়েছে' : formData.imageUrl}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
