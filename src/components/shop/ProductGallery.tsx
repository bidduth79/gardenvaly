/**
 * @file ProductGallery.tsx
 * @description Dynamic multi-image gallery with cursor magnifier zoom and fullscreen lightbox.
 */

import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';
import { ProductLightboxModal } from './ProductLightboxModal';

interface ProductGalleryProps {
  images: string[];
  name: string;
  type?: string;
  categorySlug?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  name,
  type,
  categorySlug,
}) => {
  const { language } = useLanguage();
  const fallback = getProductFallbackImage({ type, categorySlug });
  const rawList = Array.isArray(images) && images.length > 0 ? images : [];
  const cleanList = rawList.filter((img) => Boolean(img && typeof img === 'string' && img.trim().length > 0));
  const validImages = cleanList.length > 0 ? cleanList : [fallback];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeIndex = Math.min(currentIndex, validImages.length - 1);
  const currentImage = validImages[safeIndex] || fallback;
  const mainSrc = getSafeImageUrl(currentImage, { type, categorySlug });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % validImages.length);
  };

  return (
    <div className="space-y-3.5">
      {/* Main Image Stage with Cursor Lens Zoom */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs h-80 sm:h-[440px] cursor-zoom-in group select-none"
      >
        <img
          src={mainSrc}
          alt={`${name} - botanical view | Gardenvaly`}
          width={600}
          height={440}
          loading="eager"
          fetchPriority="high"
          onError={(e) => handleImageError(e, fallback)}
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
          }}
          className="w-full h-full object-cover pointer-events-none will-change-transform"
        />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-800 text-[11px] font-bold shadow-xs backdrop-blur-xs transition-all cursor-pointer"
            title={language === 'bn' ? 'ফুলস্ক্রিন জুম করুন' : 'Click to zoom fullscreen'}
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#174D35]" />
            <span className="hidden sm:inline">{language === 'bn' ? 'জুম করুন' : 'Zoom HD'}</span>
          </button>

          {validImages.length > 1 && (
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold font-mono">
              {formatNumeral(safeIndex + 1, language)} / {formatNumeral(validImages.length, language)}
            </span>
          )}
        </div>

        {/* Previous & Next Controls (Rendered ONLY if more than 1 image) */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnail Strip (Rendered ONLY when multiple images exist) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {validImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                safeIndex === i
                  ? 'border-[#174D35] ring-2 ring-[#174D35]/30 scale-102 shadow-xs'
                  : 'border-stone-200/80 opacity-75 hover:opacity-100 hover:border-stone-400'
              }`}
            >
              <img
                src={getSafeImageUrl(img, { type, categorySlug })}
                alt={`${name} thumbnail ${i + 1}`}
                width={80}
                height={80}
                loading="lazy"
                onError={(e) => handleImageError(e, fallback)}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <ProductLightboxModal
        isOpen={isLightboxOpen}
        images={validImages.map((img) => getSafeImageUrl(img, { type, categorySlug }))}
        initialIndex={safeIndex}
        name={name}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
};
