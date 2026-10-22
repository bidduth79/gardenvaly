/**
 * @file AdminGuidesPage.tsx
 * @description Administrative management page for Gardening Care Guides (বাগান পরিচর্যা নির্দেশিকা).
 * Allows admins to add new guide cards, write full-page editorial documents, upload cover images,
 * edit existing guides, reorder cards for the storefront horizontal slider, and reset defaults.
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Clock,
  Upload,
  Eye,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { GardenTip } from '../../types';
import { guideService, GUIDES_UPDATED_EVENT } from '../../services/guideService';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';
import { DEFAULT_FALLBACK_IMAGE, handleImageError } from '../../utils/imageFallback';

interface GuideFormState {
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  readTimeBn: string;
  readTimeEn: string;
  excerptBn: string;
  excerptEn: string;
  contentBn: string;
  contentEn: string;
  stepsBnText: string;
  stepsEnText: string;
  proTipBn: string;
  proTipEn: string;
  imageUrl: string;
  publishedDate: string;
}

const INITIAL_FORM: GuideFormState = {
  titleBn: '',
  titleEn: '',
  categoryBn: 'গাছের পরিচর্যা',
  categoryEn: 'Plant Care',
  readTimeBn: '৪ মিনিট পাঠ',
  readTimeEn: '4 min read',
  excerptBn: '',
  excerptEn: '',
  contentBn: '',
  contentEn: '',
  stepsBnText: '',
  stepsEnText: '',
  proTipBn: '',
  proTipEn: '',
  imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=85',
  publishedDate: new Date().toISOString().slice(0, 10),
};

export const AdminGuidesPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [guides, setGuides] = useState<GardenTip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GuideFormState>(INITIAL_FORM);
  const [previewGuide, setPreviewGuide] = useState<GardenTip | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const loadGuides = () => {
    setGuides(guideService.getGuides());
  };

  useEffect(() => {
    loadGuides();
    window.addEventListener(GUIDES_UPDATED_EVENT, loadGuides);
    return () => window.removeEventListener(GUIDES_UPDATED_EVENT, loadGuides);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      publishedDate: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guide: GardenTip) => {
    setEditingId(guide.id);
    setFormData({
      titleBn: guide.titleBn,
      titleEn: guide.titleEn,
      categoryBn: guide.categoryBn,
      categoryEn: guide.categoryEn,
      readTimeBn: guide.readTimeBn,
      readTimeEn: guide.readTimeEn,
      excerptBn: guide.excerptBn,
      excerptEn: guide.excerptEn,
      contentBn: guide.contentBn || guide.excerptBn,
      contentEn: guide.contentEn || guide.excerptEn,
      stepsBnText: (guide.stepsBn || []).join('\n'),
      stepsEnText: (guide.stepsEn || []).join('\n'),
      proTipBn: guide.proTipBn || '',
      proTipEn: guide.proTipEn || '',
      imageUrl: guide.imageUrl,
      publishedDate: guide.publishedDate || new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleBn.trim() && !formData.titleEn.trim()) return;

    const stepsBn = formData.stepsBnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const stepsEn = formData.stepsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<GardenTip, 'id'> = {
      titleBn: formData.titleBn.trim() || formData.titleEn.trim(),
      titleEn: formData.titleEn.trim() || formData.titleBn.trim(),
      categoryBn: formData.categoryBn.trim() || 'বাগান পরিচর্যা',
      categoryEn: formData.categoryEn.trim() || 'Garden Care',
      readTimeBn: formData.readTimeBn.trim() || '৪ মিনিট পাঠ',
      readTimeEn: formData.readTimeEn.trim() || '4 min read',
      excerptBn: formData.excerptBn.trim() || formData.contentBn.slice(0, 140),
      excerptEn: formData.excerptEn.trim() || formData.contentEn.slice(0, 140) || formData.excerptBn.trim(),
      contentBn: formData.contentBn.trim() || formData.excerptBn.trim(),
      contentEn: formData.contentEn.trim() || formData.excerptEn.trim() || formData.contentBn.trim(),
      stepsBn,
      stepsEn: stepsEn.length > 0 ? stepsEn : stepsBn,
      proTipBn: formData.proTipBn.trim(),
      proTipEn: formData.proTipEn.trim() || formData.proTipBn.trim(),
      imageUrl:
        formData.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=85',
      publishedDate: formData.publishedDate || new Date().toISOString().slice(0, 10),
    };

    if (editingId) {
      guideService.updateGuide(editingId, payload);
      showToast(isBn ? 'বাগান নির্দেশিকা সফলভাবে আপডেট হয়েছে!' : 'Gardening guide updated!');
    } else {
      guideService.addGuide(payload);
      showToast(isBn ? 'নতুন বাগান নির্দেশিকা কার্ড যুক্ত হয়েছে!' : 'New gardening guide added!');
    }

    setIsModalOpen(false);
    loadGuides();
  };

  const handleDelete = (id: string) => {
    guideService.deleteGuide(id);
    loadGuides();
    showToast(isBn ? 'নির্দেশিকাটি মুছে ফেলা হয়েছে।' : 'Guide deleted.');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= guides.length) return;
    const copy = [...guides];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    guideService.reorderGuides(copy);
    loadGuides();
  };

  const handleReset = () => {
    guideService.resetToDefault();
    loadGuides();
    setConfirmReset(false);
    showToast(isBn ? 'ডিফল্ট বাগান নির্দেশিকাগুলো পুনরুদ্ধার করা হয়েছে।' : 'Restored default guides.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#174D35] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium">
          <Check className="w-4 h-4 text-[#A3E635]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{isBn ? 'স্টোরফ্রন্ট এডিটোরিয়াল গাইড' : 'Storefront Editorial Guides'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
            {isBn ? 'বাগান পরিচর্যা নির্দেশিকা ম্যানেজমেন্ট' : 'Gardening Care Guides Management'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isBn
              ? 'এখান থেকে নতুন বাগান নির্দেশিকা কার্ড এবং ফুল-পেইজ ডকুমেন্ট যোগ, সম্পাদনা ও ক্রম পরিবর্তন করুন। ৩টির বেশি কার্ড হলে হোমপেজে ডানে-বামে স্ক্রল করা যাবে।'
              : 'Add, edit, or reorder gardening guide cards and their full-page documents. Cards automatically scroll horizontally on the homepage.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {confirmReset ? (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-semibold text-amber-800">
                {isBn ? 'ডিফল্টে রিসেট করবেন?' : 'Reset to defaults?'}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
              >
                {isBn ? 'হ্যাঁ' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 rounded-lg text-stone-600 text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'না' : 'No'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123c29] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? '+ নতুন নির্দেশিকা কার্ড যোগ করুন' : '+ Add New Guide Card'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">
              {isBn ? 'মোট নির্দেশিকা কার্ড' : 'Total Guide Cards'}
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {formatNumeral(guides.length, language)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#174D35] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">
              {isBn ? 'হোমপেজ স্লাইডার স্ট্যাটাস' : 'Homepage Slider Mode'}
            </p>
            <p className="text-sm font-bold text-[#174D35] mt-1">
              {isBn ? 'ডানে-বামে অ্যারো স্ক্রল সক্রিয়' : 'Left/Right Arrow Carousel Active'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">
              {isBn ? 'বিস্তারিত ভিউ মোড' : 'Reader View Mode'}
            </p>
            <p className="text-sm font-bold text-stone-900 mt-1">
              {isBn ? 'ফুল-পেইজ ডকুমেন্ট ভিউ' : 'Full-Page Document Reader'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Guides Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col sm:flex-row"
          >
            <div className="relative w-full sm:w-44 h-44 sm:h-auto shrink-0 bg-stone-100">
              <img
                src={guide.imageUrl || DEFAULT_FALLBACK_IMAGE}
                alt={isBn ? guide.titleBn : guide.titleEn}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-[#174D35] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {isBn ? guide.categoryBn : guide.categoryEn}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-stone-400 mb-1.5">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {isBn ? guide.readTimeBn : guide.readTimeEn}
                  </span>
                  <span className="font-semibold text-stone-400">
                    #{formatNumeral(index + 1, language)}
                  </span>
                </div>

                <h3 className="font-serif-botanical font-bold text-base sm:text-lg text-stone-900 line-clamp-1">
                  {isBn ? guide.titleBn : guide.titleEn}
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {isBn ? guide.excerptBn : guide.excerptEn}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100">
                    {formatNumeral((guide.stepsBn || []).length, language)}{' '}
                    {isBn ? 'টি ধাপ' : 'Steps'}
                  </span>
                  {guide.proTipBn && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                      {isBn ? 'হাসনাহেনার টিপস যুক্ত' : 'Pro Tip Included'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title={isBn ? 'আগে নিন' : 'Move earlier'}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === guides.length - 1}
                    title={isBn ? 'পরে নিন' : 'Move later'}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewGuide(guide)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(guide)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-[#174D35] hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(guide.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    title={isBn ? 'ডিলিট করুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Guide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif-botanical font-bold text-stone-900">
                  {editingId
                    ? isBn
                      ? 'বাগান নির্দেশিকা সম্পাদনা করুন'
                      : 'Edit Gardening Guide'
                    : isBn
                    ? 'নতুন বাগান নির্দেশিকা কার্ড যোগ করুন'
                    : 'Add New Gardening Guide Card'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isBn
                    ? 'কার্ডের তথ্য এবং "বিস্তারিত পড়ুন"-এ ক্লিক করলে যে ফুল-পেইজ ডকুমেন্ট আসবে তা এখানে লিখুন।'
                    : 'Fill in card summary and the full-page document content.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'শিরোনাম (বাংলা) *' : 'Title (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="যেমন: ছাদবাগানে টমেটো ও সবজি চাষের নিয়ম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'শিরোনাম (English)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Rooftop Vegetable Gardening Guide"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              {/* Category & Read time */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'ক্যাটাগরি (বাংলা)' : 'Category (Bn)'}
                  </label>
                  <input
                    type="text"
                    value={formData.categoryBn}
                    onChange={(e) => setFormData({ ...formData, categoryBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'ক্যাটাগরি (En)' : 'Category (En)'}
                  </label>
                  <input
                    type="text"
                    value={formData.categoryEn}
                    onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'পাঠের সময় (বাংলা)' : 'Read Time (Bn)'}
                  </label>
                  <input
                    type="text"
                    value={formData.readTimeBn}
                    onChange={(e) => setFormData({ ...formData, readTimeBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'পাঠের সময় (En)' : 'Read Time (En)'}
                  </label>
                  <input
                    type="text"
                    value={formData.readTimeEn}
                    onChange={(e) => setFormData({ ...formData, readTimeEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Cover Image URL or Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'কভার ছবি (লিঙ্ক অথবা ডিভাইস থেকে আপলোড)' : 'Cover Image (URL or Upload)'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                  <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ছবি আপলোড' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Card Short Excerpt */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'কার্ডের সংক্ষিপ্ত বিবরণ (বাংলা) *' : 'Card Short Summary (Bengali) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerptBn}
                  onChange={(e) => setFormData({ ...formData, excerptBn: e.target.value })}
                  placeholder="কার্ডের ভেতরে যে ২-৩ লাইনের সারসংক্ষেপ দেখাবে..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              {/* Full-Page Document Content */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn
                    ? 'ফুল-পেইজ ডকুমেন্টের বিস্তারিত লেখা (বাংলা) *'
                    : 'Full-Page Document Article Content (Bengali) *'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.contentBn}
                  onChange={(e) => setFormData({ ...formData, contentBn: e.target.value })}
                  placeholder="বিস্তারিত পড়ুন বাটনে ক্লিক করলে যে পূর্ণাঙ্গ ডকুমেন্ট আসবে তার অনুচ্ছেদগুলো এখানে লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm leading-relaxed"
                />
              </div>

              {/* Step by Step Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn
                    ? 'ধাপে ধাপে করণীয় পয়েন্টসমূহ (প্রতি লাইনে ১টি করে ধাপ লিখুন)'
                    : 'Step-by-Step Instructions (One step per line)'}
                </label>
                <textarea
                  rows={4}
                  value={formData.stepsBnText}
                  onChange={(e) => setFormData({ ...formData, stepsBnText: e.target.value })}
                  placeholder={
                    '১ম ধাপ এখানে লিখুন\n২য় ধাপ এখানে লিখুন\n৩য় ধাপ এখানে লিখুন'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              {/* Hasna Hena Pro Tip */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'হাসনাহেনার বিশেষ পরামর্শ (ঐচ্ছিক)' : "Hasna Hena's Pro Tip (Optional)"}
                </label>
                <input
                  type="text"
                  value={formData.proTipBn}
                  onChange={(e) => setFormData({ ...formData, proTipBn: e.target.value })}
                  placeholder="গাছের বিশেষ যত্ন সম্পর্কে ১-২ লাইনের গুরুত্বপূর্ণ টিপস..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123c29] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                >
                  {editingId
                    ? isBn
                      ? 'আপডেট সংরক্ষণ করুন'
                      : 'Save Changes'
                    : isBn
                    ? 'নির্দেশিকা প্রকাশ করুন'
                    : 'Publish Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Document Preview Modal in Admin */}
      {previewGuide && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-[#174D35] uppercase">
                {isBn ? previewGuide.categoryBn : previewGuide.categoryEn}
              </span>
              <button
                type="button"
                onClick={() => setPreviewGuide(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900 mt-3">
              {isBn ? previewGuide.titleBn : previewGuide.titleEn}
            </h3>
            <img
              src={previewGuide.imageUrl || DEFAULT_FALLBACK_IMAGE}
              alt={previewGuide.titleBn}
              onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
              className="w-full h-56 object-cover rounded-2xl my-4"
            />
            <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
              {(previewGuide.contentBn || previewGuide.excerptBn)
                .split('\n\n')
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            {(previewGuide.stepsBn || []).length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="font-bold text-sm text-stone-900">
                  {isBn ? 'ধাপে ধাপে করণীয়:' : 'Steps:'}
                </h4>
                {(previewGuide.stepsBn || []).map((s, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-stone-700 flex gap-2">
                    <span className="font-bold text-[#174D35]">
                      {formatNumeral(idx + 1, language)}.
                    </span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
