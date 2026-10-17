/**
 * @file ProductLightboxModal.tsx
 * @description Fullscreen interactive lightbox modal with pan, zoom controls, and thumbnail drawer.
 */

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface ProductLightboxModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  name: string;
  onClose: () => void;
}

export const ProductLightboxModal: React.FC<ProductLightboxModalProps> = ({
  isOpen,
  images,
  initialIndex,
  name,
  onClose,
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(3, +(z + 0.5).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(1, +(z - 0.5).toFixed(1)));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} Fullscreen Zoom View`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-4 select-none animate-fadeIn"
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between text-white pb-3 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold truncate max-w-xs sm:max-w-md">{name}</span>
          {images.length > 1 && (
            <span className="text-xs text-stone-300 bg-white/15 px-2 py-0.5 rounded-full font-mono">
              {formatNumeral(currentIndex + 1, language)} / {formatNumeral(images.length, language)}
            </span>
          )}
        </div>

        {/* Zoom Controls & Close */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/15">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 text-stone-200 hover:text-white hover:bg-white/15 rounded-lg disabled:opacity-40 cursor-pointer"
              title={language === 'bn' ? 'জুম ইন (+)' : 'Zoom In (+)'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs px-1.5 font-mono text-stone-300">{zoomLevel}x</span>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-stone-200 hover:text-white hover:bg-white/15 rounded-lg disabled:opacity-40 cursor-pointer"
              title={language === 'bn' ? 'জুম আউট (-)' : 'Zoom Out (-)'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-stone-200 hover:text-white hover:bg-white/15 rounded-lg cursor-pointer"
              title={language === 'bn' ? 'রিসেট (১x)' : 'Reset (1x)'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-200 hover:text-white hover:bg-white/15 rounded-xl cursor-pointer transition-colors"
            aria-label="Close Fullscreen View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden my-3">
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-4 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => (i + 1) % images.length)}
              className="absolute right-2 sm:right-4 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="max-h-[72vh] max-w-[90vw] overflow-auto flex items-center justify-center">
          <img
            src={currentImage}
            alt={`${name} zoomed detail ${currentIndex + 1}`}
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease-out' }}
            className="max-h-[70vh] max-w-[85vw] object-contain rounded-xl origin-center shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip (Only if multiple images) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-black/40 rounded-2xl max-w-full z-10 border border-white/10">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                currentIndex === idx ? 'border-[#5C8D50] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
