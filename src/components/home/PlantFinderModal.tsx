/**
 * @file PlantFinderModal.tsx
 * @description Interactive 3-step plant matcher quiz modal with instant curated recommendations.
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sun, Droplets, ShieldCheck, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice } from '../../utils/formatters';

interface PlantFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlantFinderModal: React.FC<PlantFinderModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [light, setLight] = useState<'low' | 'indirect' | 'direct'>('indirect');
  const [care, setCare] = useState<'easy' | 'moderate'>('easy');
  const [feature, setFeature] = useState<'air' | 'flowering' | 'all'>('air');
  const [matches, setMatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setMatches([]);
    }
  }, [isOpen]);

  const handleFind = async () => {
    setLoading(true);
    try {
      const all = await productService.getProducts();
      const plants = all.filter((p) => p.type === 'plant');
      const filtered = plants.filter((p) => {
        if (light === 'low' && !p.tagsEn.some((t) => t.toLowerCase().includes('low') || t.toLowerCase().includes('indoor'))) return false;
        if (care === 'easy' && !p.tagsEn.some((t) => t.toLowerCase().includes('easy') || t.toLowerCase().includes('beginner'))) return false;
        if (feature === 'air' && !p.tagsEn.some((t) => t.toLowerCase().includes('air'))) return false;
        return true;
      });
      setMatches(filtered.length > 0 ? filtered.slice(0, 4) : plants.slice(0, 3));
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2 text-[#174D35]">
            <Sparkles className="w-5 h-5 text-[#5C8D50]" />
            <h3 className="font-serif-botanical font-bold text-lg sm:text-xl">
              {isBn ? 'স্মার্ট প্ল্যান্ট ফাইন্ডার' : 'Smart Plant Matcher'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Questions or Results */}
        {matches.length === 0 ? (
          <div className="py-6 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  {isBn ? '১. আপনার ঘরে কেমন রোদ বা আলো পাওয়া যায়?' : '1. What light level does your space receive?'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'low', bn: 'কম আলো (ছায়া)', en: 'Low / Indirect Shade' },
                    { id: 'indirect', bn: 'উজ্জ্বল পরোক্ষ আলো', en: 'Bright Indirect' },
                    { id: 'direct', bn: 'খোলা রোদ বা বারান্দা', en: 'Direct Sunlight' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setLight(opt.id as 'low' | 'indirect' | 'direct'); setStep(2); }}
                      className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                        light === opt.id ? 'border-[#174D35] bg-emerald-50 text-[#174D35]' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {isBn ? opt.bn : opt.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  {isBn ? '২. আপনি কেমন পরিচর্যা পছন্দ করেন?' : '2. What care effort fits your routine?'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'easy', bn: 'অল্প যত্নে বাঁচে (নতুনদের জন্য)', en: 'Low Maintenance (Easy)' },
                    { id: 'moderate', bn: 'নিয়মিত পানি ও যত্ন নিতে পারব', en: 'Moderate Routine Care' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setCare(opt.id as 'easy' | 'moderate'); setStep(3); }}
                      className={`p-4 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                        care === opt.id ? 'border-[#174D35] bg-emerald-50 text-[#174D35]' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {isBn ? opt.bn : opt.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5C8D50]" />
                  {isBn ? '৩. গাছের বিশেষ কোনো গুণ চান?' : '3. Any special feature you prefer?'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'air', bn: 'বাতাস বিশুদ্ধকারী', en: 'Air Purifying' },
                    { id: 'flowering', bn: 'ফুল ফোটে এমন', en: 'Flowering Accent' },
                    { id: 'all', bn: 'যেকোনো সুন্দর গাছ', en: 'Any Hardy Plant' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFeature(opt.id as 'air' | 'flowering' | 'all')}
                      className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                        feature === opt.id ? 'border-[#174D35] bg-emerald-50 text-[#174D35]' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {isBn ? opt.bn : opt.en}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleFind}
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-[#174D35] hover:bg-[#123e2a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? (isBn ? 'খোঁজা হচ্ছে...' : 'Matching...') : (isBn ? 'আমার জন্য সেরা গাছ দেখুন' : 'Show My Matched Plants')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results View */
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
              <span>{isBn ? `আপনার জন্য সেরা (${matches.length})টি গাছ:` : `Found (${matches.length}) tailored matches:`}</span>
              <button onClick={() => { setMatches([]); setStep(1); }} className="flex items-center gap-1 text-[#174D35] font-semibold cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5" /> {isBn ? 'আবার খুঁজুন' : 'Restart Quiz'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {matches.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 bg-[#F7F5EC]/40 hover:bg-[#F7F5EC] hover:border-[#174D35]/30 transition-all group"
                >
                  {/* Clickable Product Info & Thumbnail -> Navigates to Product Detail Page */}
                  <div
                    onClick={() => {
                      onClose();
                      navigate(`/product/${p.slug}`);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    title={isBn ? 'বিস্তারিত দেখতে ক্লিক করুন' : 'Click to view product details'}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.nameEn}
                      className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0 border border-stone-200/60"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 group-hover:text-[#174D35] transition-colors truncate">
                        {isBn ? p.nameBn : p.nameEn}
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {formatPrice(p.price, language)}
                      </p>
                      <span className="text-[10px] text-[#5C8D50] font-semibold flex items-center gap-0.5 mt-0.5 group-hover:underline">
                        {isBn ? 'বিস্তারিত দেখুন' : 'View Details'} <ArrowRight className="w-2.5 h-2.5 inline" />
                      </span>
                    </div>
                  </div>

                  {/* Direct Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                      onClose();
                    }}
                    className="shrink-0 w-8 h-8 sm:w-auto px-2 sm:px-2.5 py-1.5 bg-[#174D35] hover:bg-[#123e2a] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                    title={isBn ? 'সরাসরি কার্টে যোগ করুন' : 'Add to Cart'}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isBn ? 'কার্টে নিন' : 'Add'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
