/**
 * @file HeroImageEditorModal.tsx
 * @description Comprehensive in-browser image studio for hero carousel photos.
 * Supports device upload, interactive cropping, color correction & botanical filters,
 * smart background removal with color-keying & replacement, and custom bilingual titles.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Crop as CropIcon,
  Sliders,
  Wand2,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  Sun,
  Eye,
  Layers,
  Sparkles,
  Pipette,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface HeroSlide {
  id: string;
  imageUrl: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  altText: string;
}

interface HeroImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: HeroSlide[];
  onSaveSlides: (newSlides: HeroSlide[]) => void;
  onResetToDefaults: () => void;
}

type EditorTab = 'crop' | 'color' | 'background' | 'details';
type AspectRatio = '16:9' | '4:3' | '1:1' | 'free';

interface FilterPreset {
  nameBn: string;
  nameEn: string;
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
}

const FILTER_PRESETS: FilterPreset[] = [
  { nameBn: 'অরিজিনাল', nameEn: 'Original', brightness: 0, contrast: 0, saturation: 100, warmth: 0 },
  { nameBn: 'সতেজ বোটানিক্যাল', nameEn: 'Lush Botanical', brightness: 5, contrast: 15, saturation: 135, warmth: -5 },
  { nameBn: 'গোল্ডেন সানলাইট', nameEn: 'Golden Sunlight', brightness: 8, contrast: 10, saturation: 120, warmth: 25 },
  { nameBn: 'ভিভিড ব্লুম', nameEn: 'Vivid Floral', brightness: 5, contrast: 20, saturation: 145, warmth: 10 },
  { nameBn: 'স্নিগ্ধ ড্রিম', nameEn: 'Soft Dream', brightness: 12, contrast: -10, saturation: 90, warmth: 5 },
];

const BG_REPLACEMENT_PRESETS = [
  { id: 'transparent', labelBn: 'স্বচ্ছ (PNG)', labelEn: 'Transparent', style: 'transparent' },
  { id: 'botanical-dark', labelBn: 'গাঢ় বোটানিক্যাল', labelEn: 'Deep Forest', style: 'linear-gradient(135deg, #174D35, #0B291C)' },
  { id: 'sunlight-glow', labelBn: 'সোনালী আভা', labelEn: 'Warm Sunlight', style: 'linear-gradient(135deg, #5C8D50, #C5A059)' },
  { id: 'soft-cream', labelBn: 'সফট ক্রিম', labelEn: 'Organic Cream', style: '#F7F5EC' },
  { id: 'studio-grey', labelBn: 'মডার্ন স্টুডিও', labelEn: 'Studio Slate', style: '#292524' },
];

export const HeroImageEditorModal: React.FC<HeroImageEditorModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSaveSlides,
  onResetToDefaults,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Management list vs active editing state
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('crop');

  // Source image loaded in editor
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string>('');

  // 1. Crop / Transform States
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 2. Color Correction States
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [warmth, setWarmth] = useState<number>(0); // -50 to 50

  // 3. Background Removal States
  const [bgRemovalActive, setBgRemovalActive] = useState<boolean>(false);
  const [pickedBgColor, setPickedBgColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [tolerance, setTolerance] = useState<number>(35); // 5 to 90
  const [feather, setFeather] = useState<number>(2); // 0 to 8
  const [selectedBgStyle, setSelectedBgStyle] = useState<string>('transparent');
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);

  // 4. Slide Metadata
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitleBn, setSubtitleBn] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset editor states
  const resetEditor = () => {
    setEditingSlide(null);
    setSourceImage(null);
    setSourceImageUrl('');
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setAspectRatio('16:9');
    setPanOffset({ x: 0, y: 0 });
    setBrightness(0);
    setContrast(0);
    setSaturation(100);
    setWarmth(0);
    setBgRemovalActive(false);
    setPickedBgColor(null);
    setTolerance(35);
    setFeather(2);
    setSelectedBgStyle('transparent');
    setIsEyedropperActive(false);
    setActiveTab('crop');
  };

  // Open existing slide for editing
  const handleEditSlide = (slide: HeroSlide) => {
    resetEditor();
    setEditingSlide(slide);
    setTitleBn(slide.titleBn);
    setTitleEn(slide.titleEn);
    setSubtitleBn(slide.subtitleBn);
    setSubtitleEn(slide.subtitleEn);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImage(img);
      setSourceImageUrl(slide.imageUrl);
    };
    img.src = slide.imageUrl;
  };

  // Upload new image from user's device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      resetEditor();
      const newSlideTemplate: HeroSlide = {
        id: `custom-slide-${Date.now()}`,
        imageUrl: dataUrl,
        titleBn: 'আমার বাগানের নতুন সতেজ গাছ',
        titleEn: 'Fresh Botanical Addition',
        subtitleBn: 'কাস্টম কালেকশন',
        subtitleEn: 'Curated by You',
        altText: 'Custom uploaded garden photo',
      };
      setEditingSlide(newSlideTemplate);
      setTitleBn(newSlideTemplate.titleBn);
      setTitleEn(newSlideTemplate.titleEn);
      setSubtitleBn(newSlideTemplate.subtitleBn);
      setSubtitleEn(newSlideTemplate.subtitleEn);

      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSourceImageUrl(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);

    // clear file input so same file can be re-selected if needed
    e.target.value = '';
  };

  // Apply Botanical Filter Preset
  const applyPreset = (preset: FilterPreset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setWarmth(preset.warmth);
  };

  // Render & Process Canvas
  const processCanvas = useCallback(
    (targetCanvas: HTMLCanvasElement, exportWidth = 1200) => {
      if (!sourceImage) return;

      // Aspect ratio calculation
      let targetRatio = 16 / 9;
      if (aspectRatio === '4:3') targetRatio = 4 / 3;
      if (aspectRatio === '1:1') targetRatio = 1;
      if (aspectRatio === 'free') targetRatio = sourceImage.width / sourceImage.height;

      const exportHeight = Math.round(exportWidth / targetRatio);
      targetCanvas.width = exportWidth;
      targetCanvas.height = exportHeight;

      const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, exportWidth, exportHeight);

      // 1. Draw Background Replacement if configured
      if (selectedBgStyle !== 'transparent') {
        if (selectedBgStyle.startsWith('linear-gradient')) {
          const grad = ctx.createLinearGradient(0, 0, exportWidth, exportHeight);
          if (selectedBgStyle.includes('#174D35')) {
            grad.addColorStop(0, '#174D35');
            grad.addColorStop(1, '#0B291C');
          } else {
            grad.addColorStop(0, '#5C8D50');
            grad.addColorStop(1, '#C5A059');
          }
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = selectedBgStyle;
        }
        ctx.fillRect(0, 0, exportWidth, exportHeight);
      }

      // 2. Offscreen canvas for Transformations + Color filters
      const offCanvas = document.createElement('canvas');
      offCanvas.width = exportWidth;
      offCanvas.height = exportHeight;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.save();

      // CSS filter for color corrections
      const brightValue = 100 + brightness;
      const contrastValue = 100 + contrast;
      const satValue = saturation;
      offCtx.filter = `brightness(${brightValue}%) contrast(${contrastValue}%) saturate(${satValue}%)`;

      // Center transformations
      offCtx.translate(exportWidth / 2 + panOffset.x, exportHeight / 2 + panOffset.y);
      offCtx.rotate((rotation * Math.PI) / 180);
      if (flipH) offCtx.scale(-1, 1);
      offCtx.scale(zoom, zoom);

      // Fit image cover
      const imgAspect = sourceImage.width / sourceImage.height;
      let drawW = exportWidth;
      let drawH = exportWidth / imgAspect;
      if (drawH < exportHeight) {
        drawH = exportHeight;
        drawW = exportHeight * imgAspect;
      }

      offCtx.drawImage(sourceImage, -drawW / 2, -drawH / 2, drawW, drawH);
      offCtx.restore();

      // 3. Smart Background Removal if enabled
      if (bgRemovalActive) {
        const imgData = offCtx.getImageData(0, 0, exportWidth, exportHeight);
        const data = imgData.data;

        // If no explicit color picked, auto-sample corner background pixels
        let targetR = 245;
        let targetG = 245;
        let targetB = 245;

        if (pickedBgColor) {
          targetR = pickedBgColor.r;
          targetG = pickedBgColor.g;
          targetB = pickedBgColor.b;
        } else {
          // Average the 4 corners to detect background color
          const corners = [
            0,
            (exportWidth - 1) * 4,
            ((exportHeight - 1) * exportWidth) * 4,
            ((exportHeight - 1) * exportWidth + exportWidth - 1) * 4,
          ];
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          corners.forEach((idx) => {
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
          });
          targetR = rSum / 4;
          targetG = gSum / 4;
          targetB = bSum / 4;
        }

        const colorDist = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
          return Math.sqrt(
            Math.pow(r1 - r2, 2) * 0.299 +
            Math.pow(g1 - g2, 2) * 0.587 +
            Math.pow(b1 - b2, 2) * 0.114
          );
        };

        const tolDist = (tolerance / 100) * 180;
        const featherDist = (feather / 10) * 40;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = colorDist(r, g, b, targetR, targetG, targetB);

          if (dist <= tolDist) {
            data[i + 3] = 0; // Fully transparent
          } else if (dist < tolDist + featherDist && featherDist > 0) {
            const alphaFactor = (dist - tolDist) / featherDist;
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        offCtx.putImageData(imgData, 0, 0);
      }

      // 4. Warmth color cast overlay
      if (warmth !== 0) {
        offCtx.save();
        offCtx.globalCompositeOperation = warmth > 0 ? 'color' : 'soft-light';
        offCtx.fillStyle = warmth > 0 ? `rgba(245, 158, 11, ${Math.abs(warmth) / 300})` : `rgba(59, 130, 246, ${Math.abs(warmth) / 300})`;
        offCtx.fillRect(0, 0, exportWidth, exportHeight);
        offCtx.restore();
      }

      // 5. Draw processed output to main canvas
      ctx.drawImage(offCanvas, 0, 0);
    },
    [
      sourceImage,
      aspectRatio,
      selectedBgStyle,
      brightness,
      contrast,
      saturation,
      panOffset,
      rotation,
      flipH,
      zoom,
      bgRemovalActive,
      pickedBgColor,
      tolerance,
      feather,
      warmth,
    ]
  );

  // Live preview update
  useEffect(() => {
    if (previewCanvasRef.current && sourceImage) {
      processCanvas(previewCanvasRef.current, 800);
    }
  }, [processCanvas, sourceImage]);

  // Click on canvas to sample background color (Eyedropper)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setPickedBgColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    setBgRemovalActive(true);
    setIsEyedropperActive(false);
  };

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEyedropperActive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Final Save Slide
  const handleSaveCurrentSlide = () => {
    if (!sourceImage) return;

    const exportCanvas = document.createElement('canvas');
    processCanvas(exportCanvas, 1400);
    const finalDataUrl = exportCanvas.toDataURL('image/jpeg', 0.88);

    const updatedSlide: HeroSlide = {
      id: editingSlide?.id || `slide-${Date.now()}`,
      imageUrl: finalDataUrl,
      titleBn: titleBn.trim() || 'সবুজে সাজুক আপনার আঙিনা',
      titleEn: titleEn.trim() || 'Botanical Living Space',
      subtitleBn: subtitleBn.trim() || 'গার্ডেনভ্যালি সিলেকশন',
      subtitleEn: subtitleEn.trim() || 'Gardenvaly Selection',
      altText: titleEn || 'Custom gardenvaly hero banner',
    };

    const existingIndex = slides.findIndex((s) => s.id === updatedSlide.id);
    let newSlides: HeroSlide[];
    if (existingIndex >= 0) {
      newSlides = [...slides];
      newSlides[existingIndex] = updatedSlide;
    } else {
      newSlides = [updatedSlide, ...slides];
    }

    onSaveSlides(newSlides);
    resetEditor();
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert(isBn ? 'কমপক্ষে একটি ছবি স্লাইডারে থাকা আবশ্যক।' : 'At least one slide must remain.');
      return;
    }
    const filtered = slides.filter((s) => s.id !== id);
    onSaveSlides(filtered);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-editor-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#F7F5EC] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#174D35]/10 text-[#174D35]">
              <Sparkles className="w-5 h-5 text-[#5C8D50]" />
            </div>
            <div>
              <h2 id="hero-editor-modal-title" className="text-lg sm:text-xl font-serif-botanical font-bold text-stone-900">
                {editingSlide
                  ? isBn
                    ? 'হিরো ছবি সম্পাদনা ও স্টুডিও'
                    : 'Hero Photo Studio & Customizer'
                  : isBn
                  ? 'হিরো ছবির গ্যালারি ও ডিভাইস আপলোড'
                  : 'Hero Slides Manager & Device Upload'}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? 'ডিভাইস থেকে নিজের গাছের ছবি আপলোড, ক্রপ, কালার কারেকশন ও ব্যাকগ্রাউন্ড রিমুভ করুন'
                  : 'Upload plant photos from device, crop, apply color filters & remove background'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingSlide && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'নতুন ছবি আপলোড' : 'Upload Photo'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                resetEditor();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label={isBn ? 'বন্ধ করুন' : 'Close modal'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hidden File Input for Device Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!editingSlide ? (
            /* VIEW 1: Slide Management Grid */
            <div className="space-y-6">
              {/* Quick Upload Hero Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#174D35]/30 hover:border-[#174D35] bg-white/70 hover:bg-[#174D35]/5 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#174D35]/10 group-hover:bg-[#174D35] group-hover:text-white text-[#174D35] flex items-center justify-center transition-all mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-800">
                  {isBn ? 'ফোন বা কম্পিউটার থেকে গাছের ছবি নির্বাচন করুন' : 'Choose Plant Photo from Device'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md">
                  {isBn
                    ? 'এখানে ক্লিক করে ছবি নির্বাচন করলেই স্বয়ংক্রিয়ভাবে ক্রপ, কালার গ্রেডিং ও ব্যাকগ্রাউন্ড রিমুভার খুলে যাবে।'
                    : 'Click here or drag & drop to open the built-in Crop, Color Grading & Background Remover.'}
                </p>
                <span className="mt-3 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-semibold">
                  JPG, PNG, WEBP Supported
                </span>
              </div>

              {/* Current Slides List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                    {isBn ? `বর্তমান স্লাইড তালিকা (${slides.length} টি ছবি)` : `Active Slides (${slides.length})`}
                  </h3>
                  <button
                    type="button"
                    onClick={onResetToDefaults}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-medium underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isBn ? 'অরিজিনাল ছবিতে রিসেট করুন' : 'Reset to Defaults'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="bg-white rounded-2xl p-3 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-100 mb-3">
                        <img
                          src={slide.imageUrl}
                          alt={slide.altText}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-xs font-semibold text-[#174D35] line-clamp-1">
                          {isBn ? slide.subtitleBn : slide.subtitleEn}
                        </p>
                        <h4 className="text-sm font-bold text-stone-800 line-clamp-1">
                          {isBn ? slide.titleBn : slide.titleEn}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleEditSlide(slide)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{isBn ? 'এডিট ও ফিল্টার' : 'Edit & Filter'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          title={isBn ? 'ছবিটি ডিলিট করুন' : 'Delete slide'}
                          aria-label="Delete slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 2: Rich Photo Studio & Editor */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Canvas Preview Viewport */}
              <div className="lg:col-span-7 space-y-3">
                <div
                  className={`relative rounded-3xl overflow-hidden border-2 border-stone-300 shadow-inner bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] bg-stone-200 flex items-center justify-center min-h-[300px] sm:min-h-[380px] ${
                    isEyedropperActive ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas
                    ref={previewCanvasRef}
                    onClick={handleCanvasClick}
                    className="max-w-full max-h-[420px] object-contain shadow-2xl rounded-2xl"
                  />

                  {/* Eyedropper Notice Overlay */}
                  {isEyedropperActive && (
                    <div className="absolute top-4 left-4 right-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pipette className="w-4 h-4" />
                        <span>{isBn ? 'যে ব্যাকগ্রাউন্ড কালার মুছে ফেলতে চান ছবিতে সেখানে ক্লিক করুন' : 'Click on the background color in the photo to remove it'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEyedropperActive(false)}
                        className="underline text-[11px]"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                  )}

                  {/* Drag pan helper hint */}
                  {!isEyedropperActive && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5">
                      <Maximize2 className="w-3 h-3" />
                      <span>{isBn ? 'ছবিটি ড্র্যাগ করে সাজান' : 'Drag to reposition'}</span>
                    </div>
                  )}
                </div>

                {/* Quick Aspect Ratio Switcher */}
                <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-600 pl-2">
                    {isBn ? 'অ্যাসপেক্ট রেশিও:' : 'Aspect Ratio:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {(['16:9', '4:3', '1:1', 'free'] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                          aspectRatio === ratio
                            ? 'bg-[#174D35] text-white shadow-sm'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {ratio === '16:9' ? '16:9 (Hero)' : ratio === '4:3' ? '4:3' : ratio === '1:1' ? '1:1' : 'Free'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Studio Tools & Controls */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-5">
                {/* Tool Tabs */}
                <div className="flex items-center p-1 bg-stone-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('crop')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'crop' ? 'bg-white text-[#174D35] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <CropIcon className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ক্রপ ও জুম' : 'Crop & Zoom'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('color')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'color' ? 'bg-white text-[#174D35] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কালার' : 'Colors'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('background')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'background' ? 'bg-white text-[#174D35] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ব্যাকগ্রাউন্ড' : 'BG Remover'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'details' ? 'bg-white text-[#174D35] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isBn ? 'শিরোনাম' : 'Titles'}</span>
                  </button>
                </div>

                {/* TAB 1: CROP & TRANSFORM */}
                {activeTab === 'crop' && (
                  <div className="space-y-4">
                    {/* Zoom Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-[#174D35]" />
                          {isBn ? 'জুম স্কেলিং' : 'Zoom Level'}
                        </span>
                        <span>{Math.round(zoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="2.5"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-[#174D35]"
                      />
                    </div>

                    {/* Transform Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 hover:border-[#174D35] hover:bg-[#174D35]/5 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-4 h-4 text-[#174D35]" />
                        <span>{isBn ? 'ঘোরান (৯০°)' : 'Rotate 90°'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipH((prev) => !prev)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 hover:border-[#174D35] hover:bg-[#174D35]/5 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                      >
                        <FlipHorizontal className="w-4 h-4 text-[#174D35]" />
                        <span>{isBn ? 'ফ্লিপ করুন' : 'Flip Mirror'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setRotation(0);
                        setFlipH(false);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                      className="w-full text-center text-xs text-stone-500 hover:text-stone-800 underline pt-1 cursor-pointer"
                    >
                      {isBn ? 'পজিশন ও জুম রিসেট করুন' : 'Reset Crop Position'}
                    </button>
                  </div>
                )}

                {/* TAB 2: COLOR CORRECTION & FILTERS */}
                {activeTab === 'color' && (
                  <div className="space-y-4">
                    {/* Preset Botanical Filters */}
                    <div>
                      <p className="text-xs font-semibold text-stone-600 mb-2">
                        {isBn ? 'বোটানিক্যাল ফিল্টার প্রিসেট:' : 'Botanical Filter Presets:'}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {FILTER_PRESETS.map((p) => (
                          <button
                            key={p.nameEn}
                            type="button"
                            onClick={() => applyPreset(p)}
                            className="py-1.5 px-2 rounded-xl text-[11px] font-semibold border border-stone-200 hover:border-[#174D35] hover:bg-[#174D35]/10 text-stone-700 transition-colors cursor-pointer text-center"
                          >
                            {isBn ? p.nameBn : p.nameEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brightness Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                        <span>{isBn ? 'উজ্জ্বলতা (Brightness)' : 'Brightness'}</span>
                        <span>{brightness > 0 ? `+${brightness}` : brightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full accent-[#174D35]"
                      />
                    </div>

                    {/* Contrast Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                        <span>{isBn ? 'কনট্রাস্ট (Contrast)' : 'Contrast'}</span>
                        <span>{contrast > 0 ? `+${contrast}` : contrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-[#174D35]"
                      />
                    </div>

                    {/* Saturation Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                        <span>{isBn ? 'রঙের গভীরতা (Saturation)' : 'Saturation'}</span>
                        <span>{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={saturation}
                        onChange={(e) => setSaturation(parseInt(e.target.value))}
                        className="w-full accent-[#174D35]"
                      />
                    </div>

                    {/* Warmth Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                        <span>{isBn ? 'সোনালী রোদ / উষ্ণতা (Warmth)' : 'Warmth / Sun Glow'}</span>
                        <span>{warmth > 0 ? `+${warmth}` : warmth}</span>
                      </div>
                      <input
                        type="range"
                        min="-35"
                        max="35"
                        value={warmth}
                        onChange={(e) => setWarmth(parseInt(e.target.value))}
                        className="w-full accent-amber-600"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: BACKGROUND REMOVAL */}
                {activeTab === 'background' && (
                  <div className="space-y-4">
                    {/* Auto Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          {isBn ? 'ব্যাকগ্রাউন্ড রিমুভ চালু করুন' : 'Enable Background Removal'}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {isBn ? 'গাছের পাতা ও টবের চারপাশের ব্যাকগ্রাউন্ড মুছুন' : 'Cut out plant & pot subject cleanly'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBgRemovalActive((prev) => !prev)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          bgRemovalActive ? 'bg-[#174D35]' : 'bg-stone-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            bgRemovalActive ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {bgRemovalActive && (
                      <>
                        {/* Eyedropper Color Picker */}
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900">
                              {isBn ? 'নির্দিষ্ট ব্যাকগ্রাউন্ড কালার বাছুন:' : 'Sample Background Color:'}
                            </span>
                            {pickedBgColor && (
                              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                                <span
                                  className="w-4 h-4 rounded-full border border-stone-400 inline-block"
                                  style={{
                                    backgroundColor: `rgb(${pickedBgColor.r}, ${pickedBgColor.g}, ${pickedBgColor.b})`,
                                  }}
                                />
                                <span>Selected</span>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEyedropperActive(true)}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isEyedropperActive
                                ? 'bg-amber-600 text-white animate-pulse'
                                : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                            }`}
                          >
                            <Pipette className="w-4 h-4" />
                            <span>
                              {isEyedropperActive
                                ? isBn
                                ? 'ছবিতে ক্লিক করে কালার নির্বাচন করুন...'
                                : 'Click on photo background...'
                                : isBn
                                ? 'আইড্রপার দিয়ে রঙ বাছুন'
                                : 'Pick Color with Eyedropper'}
                            </span>
                          </button>
                        </div>

                        {/* Tolerance Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                            <span>{isBn ? 'সংবেদনশীলতা / সহনশীলতা (Tolerance)' : 'Tolerance'}</span>
                            <span>{tolerance}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="75"
                            value={tolerance}
                            onChange={(e) => setTolerance(parseInt(e.target.value))}
                            className="w-full accent-[#174D35]"
                          />
                        </div>

                        {/* Edge Feather */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                            <span>{isBn ? 'পাতার কিনারা স্মুথনেস (Feathering)' : 'Edge Smoothness'}</span>
                            <span>{feather}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="6"
                            value={feather}
                            onChange={(e) => setFeather(parseInt(e.target.value))}
                            className="w-full accent-[#174D35]"
                          />
                        </div>

                        {/* Replacement Background Presets */}
                        <div>
                          <p className="text-xs font-semibold text-stone-700 mb-1.5">
                            {isBn ? 'নতুন ব্যাকগ্রাউন্ড যুক্ত করুন:' : 'Replace Background With:'}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {BG_REPLACEMENT_PRESETS.map((bg) => (
                              <button
                                key={bg.id}
                                type="button"
                                onClick={() => setSelectedBgStyle(bg.style)}
                                className={`p-2 rounded-xl text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                                  selectedBgStyle === bg.style
                                    ? 'border-[#174D35] ring-2 ring-[#174D35]/20 bg-stone-100'
                                    : 'border-stone-200 hover:border-stone-400 bg-white'
                                }`}
                              >
                                {isBn ? bg.labelBn : bg.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 4: TITLES & DETAILS */}
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isBn ? 'বাংলা মূল শিরোনাম (Hero Title Bn)' : 'Bangla Title'}
                      </label>
                      <input
                        type="text"
                        value={titleBn}
                        onChange={(e) => setTitleBn(e.target.value)}
                        placeholder="যেমন: সবুজে সাজুক আপনার আঙিনা"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#174D35] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isBn ? 'ইংরেজি শিরোনাম (Hero Title En)' : 'English Title'}
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. Nurturing Botanical Elegance"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#174D35] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isBn ? 'সাবটাইটেল / ক্যাটাগরি (বাংলা)' : 'Subtitle Bn'}
                      </label>
                      <input
                        type="text"
                        value={subtitleBn}
                        onChange={(e) => setSubtitleBn(e.target.value)}
                        placeholder="যেমন: ইনডোর ও ব্যালকনি প্ল্যান্ট"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#174D35] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={resetEditor}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isBn ? 'ফিরে যান' : 'Cancel Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrentSlide}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isBn ? 'স্লাইডারে সেভ করুন' : 'Save to Carousel'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
