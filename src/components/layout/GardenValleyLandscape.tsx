/**
 * @file GardenValleyLandscape.tsx
 * @description Storytelling animated botanical landscape connecting GardenValy shop to the village haven.
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { GardenDeliveryVan } from './GardenDeliveryVan';
import { GardenShopCottage } from './GardenShopCottage';
import { GardenVillageHaven } from './GardenVillageHaven';
import './valleyLandscape.css';

export const GardenValleyLandscape: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const [showVanToast, setShowVanToast] = useState(false);

  const handleVanClick = () => {
    setShowVanToast(true);
    setTimeout(() => setShowVanToast(false), 3500);
  };

  const isBn = language === 'bn';

  return (
    <div
      role="region"
      aria-label="GardenValy Storytelling Botanical Landscape"
      className="relative w-full h-64 sm:h-72 md:h-80 lg:h-88 overflow-hidden select-none transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #06120D 0%, #0A2217 35%, #103323 70%, #06120D 100%)'
          : 'linear-gradient(180deg, #174D35 0%, #1B583D 25%, #25704E 50%, #1E5C40 80%, #174D35 100%)',
      }}
    >
      {/* Top Floating Story Slogan Banner */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/30 backdrop-blur-xs border border-emerald-400/25 shadow-sm text-[11px] font-medium text-emerald-100">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>
          {isBn
            ? '🌱 গার্ডেনভ্যালি থেকে চারাগাছ পৌঁছে যাচ্ছে বাংলার শ্যামল আঙিনায়'
            : '🌱 GardenValy — From Our Nursery to Your Green Haven'}
        </span>
      </div>

      {/* Unified Master SVG: Sky, Sun/Moon, Clouds, High Flying Birds, Hills, Shop, Road, Van, Village */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#0D2B1E' : '#2D7550'} />
            <stop offset="100%" stopColor={isDark ? '#091F15' : '#215B3D'} />
          </linearGradient>
          <linearGradient id="hillMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#123827' : '#1E5E3D'} />
            <stop offset="100%" stopColor={isDark ? '#0D291D' : '#184F33'} />
          </linearGradient>
          <linearGradient id="valleyNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#184732' : '#1A5337'} />
            <stop offset="100%" stopColor={isDark ? '#0F3022' : '#174D35'} />
          </linearGradient>
        </defs>

        {/* Radiant Sun (Day) / Moon (Night) */}
        <g transform="translate(720, 95)" className="animate-sun-glow">
          <circle cx="0" cy="0" r="48" fill={isDark ? '#6EE7B7' : '#FEF08A'} opacity={isDark ? 0.15 : 0.4} />
          <circle cx="0" cy="0" r="32" fill={isDark ? '#E2E8F0' : 'url(#sunGlow)'} />
          {isDark && (
            <>
              <circle cx="-5" cy="-7" r="4" fill="#CBD5E1" opacity="0.6" />
              <circle cx="7" cy="5" r="5" fill="#CBD5E1" opacity="0.6" />
            </>
          )}
        </g>

        {/* Drifting Clouds */}
        <g className="animate-cloud-slow" opacity={isDark ? 0.2 : 0.45}>
          <path d="M 80 50 Q 100 30 130 40 Q 160 25 190 45 Q 220 40 230 60 Q 235 75 200 75 L 90 75 Q 70 70 80 50 Z" fill="#FFFFFF" />
          <path d="M 760 65 Q 780 45 810 55 Q 840 40 870 60 Q 895 55 905 75 L 770 75 Q 750 70 760 65 Z" fill="#FFFFFF" />
        </g>

        {/* High Flying Birds Traversing Across the Hills */}
        <g className="animate-birds-fly">
          <g className="animate-bird-flap" opacity={isDark ? 0.6 : 0.85}>
            <path d="M 0 45 Q 8 37 16 45 Q 24 37 32 45 Q 24 41 16 47 Q 8 41 0 45 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
            <path d="M 38 58 Q 44 52 50 58 Q 56 52 62 58 Q 56 55 50 60 Q 44 55 38 58 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
            <path d="M -30 62 Q -24 57 -18 62 Q -12 57 -6 62 Q -12 59 -18 64 Q -24 59 -30 62 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
          </g>
        </g>

        {/* Far Background Tea Garden Hills */}
        <path d="M 0 185 Q 240 115 500 170 Q 760 125 1020 175 Q 1240 135 1440 180 L 1440 320 L 0 320 Z" fill="url(#hillFar)" />

        {/* Midground Hills with Tea Bush Orchard Dots */}
        <path d="M 0 215 Q 220 155 450 205 Q 700 160 940 220 Q 1200 180 1440 210 L 1440 320 L 0 320 Z" fill="url(#hillMid)" />
        <g fill={isDark ? '#0A2016' : '#14462C'} opacity="0.5">
          <circle cx="280" cy="195" r="5" /> <circle cx="360" cy="188" r="6" /> <circle cx="440" cy="205" r="5.5" />
          <circle cx="680" cy="192" r="5" /> <circle cx="760" cy="198" r="6" /> <circle cx="860" cy="208" r="5" />
        </g>

        {/* Foreground Valley Meadow & Winding Road Grounded at y: 268 */}
        <path d="M 0 245 Q 360 225 720 245 Q 1080 230 1440 250 L 1440 320 L 0 320 Z" fill="url(#valleyNear)" />
        <path d="M -20 274 Q 340 266 720 273 Q 1100 268 1460 276" stroke={isDark ? '#1C4030' : '#947B5A'} strokeWidth="18" fill="none" opacity="0.65" />
        <path d="M -20 274 Q 340 266 720 273 Q 1100 268 1460 276" stroke={isDark ? '#2D5B45' : '#D1C2A5'} strokeWidth="1.8" strokeDasharray="10 12" fill="none" opacity="0.85" />

        {/* Left Side: GardenValy Shop (Firmly anchored on the ground at y: 268) */}
        <GardenShopCottage isDark={isDark} />

        {/* Right Side: Village Haven with Krishan, Krishani, Kids & Delivered Plants (Anchored at y: 268) */}
        <GardenVillageHaven isDark={isDark} />

        {/* Moving Delivery Van: Enters -> Parks at Shop -> Loads -> Drives -> Stops at Village -> Unloads -> Leaves */}
        <g transform="translate(0, 170)" className="animate-story-van">
          <GardenDeliveryVan isDark={isDark} onClick={handleVanClick} />
        </g>
      </svg>

      {/* Interactive Van Speech Toast */}
      {showVanToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border-2 border-emerald-500 text-xs font-bold text-emerald-900 dark:text-emerald-200 animate-bounce">
          🚚🪴 {isBn ? 'গার্ডেনভ্যালি থেকে চারাগাছ পৌঁছে যাচ্ছে আপনার দরজায়!' : 'Fresh plants on their way from GardenValy!'}
        </div>
      )}
    </div>
  );
};
