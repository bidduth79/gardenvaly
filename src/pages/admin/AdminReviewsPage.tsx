/**
 * @file AdminReviewsPage.tsx
 * @description Administrative dashboard for managing customer reviews and homepage testimonials.
 * Supports adding, editing, deleting, reordering, live previewing, and resetting testimonials.
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Search,
  Star,
  Eye,
  X,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { reviewService, REVIEWS_UPDATED_EVENT } from '../../services/reviewService';
import { ReviewItem } from '../../types';
import { formatNumeral } from '../../utils/formatters';

const PRESET_AVATARS = [
  {
    name: 'Female Gardener 1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Male Gardener 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Female Gardener 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Male Gardener 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Senior Enthusiast',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

export const AdminReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

  const [reviews, setReviews] = useState<ReviewItem[]>(() => reviewService.getReviews());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<'bn' | 'en'>('bn');

  // Form Fields
  const [formData, setFormData] = useState<Omit<ReviewItem, 'id'>>({
    authorBn: '',
    authorEn: '',
    locationBn: '',
    locationEn: '',
    commentBn: '',
    commentEn: '',
    rating: 5,
    dateBn: 'আজকে',
    dateEn: 'Today',
    avatarUrl: PRESET_AVATARS[0].url,
  });

  useEffect(() => {
    const sync = () => {
      setReviews(reviewService.getReviews());
    };
    window.addEventListener(REVIEWS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(REVIEWS_UPDATED_EVENT, sync);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAddModal = () => {
    setEditingReviewId(null);
    setFormData({
      authorBn: '',
      authorEn: '',
      locationBn: 'ঢাকা',
      locationEn: 'Dhaka',
      commentBn: '',
      commentEn: '',
      rating: 5,
      dateBn: 'আজকে',
      dateEn: 'Today',
      avatarUrl: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url,
    });
    setPreviewLanguage(isBn ? 'bn' : 'en');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: ReviewItem) => {
    setEditingReviewId(review.id);
    setFormData({
      authorBn: review.authorBn,
      authorEn: review.authorEn,
      locationBn: review.locationBn,
      locationEn: review.locationEn,
      commentBn: review.commentBn,
      commentEn: review.commentEn,
      rating: review.rating,
      dateBn: review.dateBn,
      dateEn: review.dateEn,
      avatarUrl: review.avatarUrl,
    });
    setPreviewLanguage(isBn ? 'bn' : 'en');
    setIsModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorBn.trim() && !formData.authorEn.trim()) {
      alert(isBn ? 'অনুগ্রহ করে গ্রাহকের নাম লিখুন।' : 'Please enter the reviewer name.');
      return;
    }
    if (!formData.commentBn.trim() && !formData.commentEn.trim()) {
      alert(isBn ? 'অনুগ্রহ করে মতামতের বিবরণ লিখুন।' : 'Please enter the review comment.');
      return;
    }

    const finalData = {
      ...formData,
      authorBn: formData.authorBn.trim() || formData.authorEn.trim(),
      authorEn: formData.authorEn.trim() || formData.authorBn.trim(),
      locationBn: formData.locationBn.trim() || formData.locationEn.trim() || 'বাংলাদেশ',
      locationEn: formData.locationEn.trim() || formData.locationBn.trim() || 'Bangladesh',
      commentBn: formData.commentBn.trim() || formData.commentEn.trim(),
      commentEn: formData.commentEn.trim() || formData.commentBn.trim(),
      dateBn: formData.dateBn.trim() || 'সম্প্রতি',
      dateEn: formData.dateEn.trim() || 'Recently',
    };

    if (editingReviewId) {
      reviewService.updateReview(editingReviewId, finalData);
      showToast(isBn ? 'মতামত সফলভাবে আপডেট করা হয়েছে!' : 'Review updated successfully!');
    } else {
      reviewService.addReview(finalData);
      showToast(isBn ? 'নতুন মতামত সফলভাবে যুক্ত হয়েছে!' : 'New review added successfully!');
    }

    setIsModalOpen(false);
    setEditingReviewId(null);
  };

  const handleDeleteReview = (id: string) => {
    reviewService.deleteReview(id);
    setDeleteConfirmId(null);
    showToast(isBn ? 'মতামতটি মুছে ফেলা হয়েছে।' : 'Review deleted successfully.');
  };

  const handleMoveReview = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reviews.length) return;

    const updated = [...reviews];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    reviewService.reorderReviews(updated);
    setReviews(updated);
    showToast(isBn ? 'মতামতের ক্রম পরিবর্তন করা হয়েছে!' : 'Review reordered successfully!');
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isBn
          ? 'আপনি কি নিশ্চিত যে সকল মতামত ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?'
          : 'Are you sure you want to restore default reviews?'
      )
    ) {
      const def = reviewService.resetToDefault();
      setReviews(def);
      showToast(isBn ? 'ডিফল্ট মতামত ফিরিয়ে আনা হয়েছে!' : 'Reset to default reviews!');
    }
  };

  // Filtered Reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.authorBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.authorEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.locationBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.locationEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.commentBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.commentEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating === 'all' || rev.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  // Calculate Metrics
  const totalCount = reviews.length;
  const avgRating = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '5.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-600">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
            <MessageSquareQuote className="w-4 h-4" />
            <span>{isBn ? 'গ্রাহক প্রতিক্রিয়া ও টেস্টিমোনিয়াল' : 'Customer Feedback & Social Proof'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
            {isBn ? 'গ্রাহক মতামত ব্যবস্থাপনা' : 'Customer Reviews Management'}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {isBn
              ? 'হোমপেজের মতামত সেকশন ও প্রশংসাপত্রগুলো অ্যাডমিন থেকে সরাসরি পরিবর্তন, নতুন যোগ বা ক্রম নির্ধারণ করুন। যেকোনো পরিবর্তন সাথে সাথে ওয়েবসাইটে দৃশ্যমান হবে।'
              : 'Easily add, edit, reorder, or delete testimonials showcased on your storefront. Changes reflect immediately.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/#reviews')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-sm transition-colors border border-stone-200"
          >
            <ExternalLink className="w-4 h-4 text-stone-500" />
            <span>{isBn ? 'হোমপেজে দেখুন' : 'View on Homepage'}</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 hover:bg-amber-50 text-stone-600 hover:text-amber-700 font-medium rounded-xl text-sm transition-colors border border-stone-200"
            title={isBn ? 'ডিফল্ট মতামত ফিরিয়ে আনুন' : 'Reset to default sample reviews'}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{isBn ? 'রিসেট' : 'Reset'}</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন মতামত যোগ করুন' : 'Add New Review'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{isBn ? 'মোট মতামত' : 'Total Testimonials'}</p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{formatNumeral(totalCount, language)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{isBn ? 'গড় রেটিং' : 'Average Rating'}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-stone-900">{formatNumeral(avgRating, language)}</span>
              <span className="text-xs text-stone-400">/ ৫.০</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{isBn ? '৫-স্টার রিভিউ' : '5-Star Reviews'}</p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{formatNumeral(fiveStarCount, language)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={isBn ? 'নাম, এলাকা বা মতামতের টেক্সট দিয়ে খুঁজুন...' : 'Search by name, location, or comment...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">{isBn ? 'রেটিং:' : 'Rating:'}</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#1B4332]"
          >
            <option value="all">{isBn ? 'সকল রেটিং' : 'All Ratings'}</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option>
            <option value="4">⭐⭐⭐⭐ (4 Star)</option>
            <option value="3">⭐⭐⭐ (3 Star)</option>
            <option value="2">⭐⭐ (2 Star)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <MessageSquareQuote className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700">{isBn ? 'কোনো মতামত পাওয়া যায়নি' : 'No Reviews Found'}</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {isBn
                ? 'আপনার সার্চ ফিল্টারে কোনো তথ্য মেলেনি অথবা এখনো কোনো মতামত যুক্ত করা হয়নি।'
                : 'No reviews matched your search criteria.'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'প্রথম মতামত যোগ করুন' : 'Add First Review'}</span>
            </button>
          </div>
        ) : (
          filteredReviews.map((rev, index) => {
            const author = isBn ? rev.authorBn : rev.authorEn;
            const location = isBn ? rev.locationBn : rev.locationEn;
            const comment = isBn ? rev.commentBn : rev.commentEn;
            const date = isBn ? rev.dateBn : rev.dateEn;

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:border-[#1B4332]/40 transition-all flex flex-col md:flex-row gap-5 items-start justify-between"
              >
                {/* Left Side: Avatar & Details */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <img
                    src={rev.avatarUrl}
                    alt={author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-stone-200 shrink-0 shadow-xs"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-stone-900 text-base">{author}</h3>
                      <span className="text-xs text-stone-400">({isBn ? rev.authorEn : rev.authorBn})</span>
                      <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-medium">
                        📍 {location}
                      </span>
                      <span className="text-xs text-stone-400">· {date}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-500 mb-2.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-xs text-stone-500 font-semibold ml-1">
                        ({formatNumeral(rev.rating, language)}.0)
                      </span>
                    </div>

                    {/* Review Comments */}
                    <div className="space-y-1.5 bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200/60">
                      <div>
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
                          {isBn ? 'বাংলা মন্তব্য:' : 'Bengali Comment:'}
                        </span>
                        <p className="text-sm text-stone-800 italic">"{rev.commentBn}"</p>
                      </div>
                      <div className="pt-1.5 border-t border-stone-200/50">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
                          {isBn ? 'ইংরেজি মন্তব্য:' : 'English Comment:'}
                        </span>
                        <p className="text-xs text-stone-600 italic">"{rev.commentEn}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Reorder & Action Controls */}
                <div className="flex flex-row md:flex-col items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-4 w-full md:w-auto justify-end">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 mr-auto md:mr-0">
                    <button
                      onClick={() => handleMoveReview(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-400 rounded-lg hover:bg-stone-100 transition-colors"
                      title={isBn ? 'উপরে সরান' : 'Move up'}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveReview(index, 'down')}
                      disabled={index === reviews.length - 1}
                      className="p-2 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-400 rounded-lg hover:bg-stone-100 transition-colors"
                      title={isBn ? 'নিচে সরান' : 'Move down'}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(rev)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'এডিট' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(rev.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">{isBn ? 'মতামত মুছে ফেলবেন?' : 'Delete Review?'}</h3>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              {isBn
                ? 'আপনি কি নিশ্চিত যে এই গ্রাহক মতামতটি মুছে ফেলতে চান? এটি হোমপেজ থেকেও তাৎক্ষণিকভাবে মুছে যাবে।'
                : 'Are you sure you want to delete this review? It will be immediately removed from the homepage.'}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                {isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div>
                <h3 className="text-xl font-bold font-serif-botanical text-stone-900">
                  {editingReviewId
                    ? isBn
                      ? 'মতামত সম্পাদনা করুন'
                      : 'Edit Customer Review'
                    : isBn
                    ? 'নতুন গ্রাহক মতামত যোগ করুন'
                    : 'Add New Customer Review'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isBn
                    ? 'তথ্যগুলো পূরণ করুন; পরিবর্তনগুলো হোমপেজে সাথে সাথে আপডেট হবে।'
                    : 'Fill in the testimonial details to appear on the storefront.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-6">
              {/* Reviewer Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'গ্রাহকের নাম (বাংলা) *' : 'Author Name (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ডা. নুসরাত জাহান"
                    value={formData.authorBn}
                    onChange={(e) => setFormData({ ...formData, authorBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'গ্রাহকের নাম (English)' : 'Author Name (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Nusrat Jahan"
                    value={formData.authorEn}
                    onChange={(e) => setFormData({ ...formData, authorEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'ঠিকানা/শহর (বাংলা)' : 'Location (Bengali)'}
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ধানমন্ডি, ঢাকা"
                    value={formData.locationBn}
                    onChange={(e) => setFormData({ ...formData, locationBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'ঠিকানা/শহর (English)' : 'Location (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Dhaka"
                    value={formData.locationEn}
                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'তারিখের বিবরণ (বাংলা)' : 'Date Label (Bengali)'}
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ২ দিন আগে / আজকে"
                    value={formData.dateBn}
                    onChange={(e) => setFormData({ ...formData, dateBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isBn ? 'তারিখের বিবরণ (English)' : 'Date Label (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 days ago / Today"
                    value={formData.dateEn}
                    onChange={(e) => setFormData({ ...formData, dateEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {isBn ? 'রেটিং (তারকা নির্বাচন করুন)' : 'Star Rating'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formData.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-stone-700 ml-2">
                    {formatNumeral(formData.rating, language)} {isBn ? 'স্টার' : 'Stars'}
                  </span>
                </div>
              </div>

              {/* Comments (Bangla and English) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'গ্রাহকের মতামত (বাংলা) *' : 'Review Comment (Bengali) *'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="যেমন: আম্রপালি আমের চারাটি অত্যন্ত সতেজ ও সুস্থ অবস্থায় পেয়েছি। প্যাকেজিং সত্যিই চমৎকার ছিল!"
                  value={formData.commentBn}
                  onChange={(e) => setFormData({ ...formData, commentBn: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isBn ? 'গ্রাহকের মতামত (English)' : 'Review Comment (English)'}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The sapling arrived fresh and healthy. Excellent packaging!"
                  value={formData.commentEn}
                  onChange={(e) => setFormData({ ...formData, commentEn: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                />
              </div>

              {/* Profile Photo / Avatar */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {isBn ? 'প্রোফাইল ছবি / অবতার' : 'Profile Photo / Avatar'}
                </label>

                {/* Preset Avatars */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                      className={`relative rounded-full p-0.5 transition-all ${
                        formData.avatarUrl === preset.url
                          ? 'ring-3 ring-[#1B4332] scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-full object-cover" />
                      {formData.avatarUrl === preset.url && (
                        <div className="absolute -top-1 -right-1 bg-[#1B4332] text-white rounded-full p-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Avatar URL */}
                <div className="relative">
                  <input
                    type="url"
                    placeholder="অথবা সরাসরি ছবির ইমেজ URL দিন (https://...)"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] focus:bg-white"
                  />
                </div>
              </div>

              {/* Live Preview of the card */}
              <div className="p-4 bg-stone-100/70 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#5C8D50]" />
                    <span>{isBn ? 'হোমপেজে যেভাবে দেখা যাবে (লাইভ প্রিভিউ):' : 'Storefront Live Preview:'}</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setPreviewLanguage('bn')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
                        previewLanguage === 'bn' ? 'bg-[#1B4332] text-white' : 'text-stone-600'
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLanguage('en')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
                        previewLanguage === 'en' ? 'bg-[#1B4332] text-white' : 'text-stone-600'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs max-w-md mx-auto">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(formData.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
                    "{previewLanguage === 'bn' ? formData.commentBn || 'গ্রাহকের সুন্দর মন্তব্য...' : formData.commentEn || 'Customer comment...'}"
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                    <img
                      src={formData.avatarUrl || PRESET_AVATARS[0].url}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {previewLanguage === 'bn' ? formData.authorBn || 'গ্রাহকের নাম' : formData.authorEn || 'Customer Name'}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        {previewLanguage === 'bn' ? formData.locationBn || 'ঢাকা' : formData.locationEn || 'Dhaka'} · {previewLanguage === 'bn' ? formData.dateBn : formData.dateEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-xl shadow-xs transition-colors"
                >
                  {editingReviewId
                    ? isBn
                      ? 'পরিবর্তন সংরক্ষণ করুন'
                      : 'Update Review'
                    : isBn
                    ? 'মতামত প্রকাশ করুন'
                    : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
