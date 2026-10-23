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
      className="relative w-full aspect-[1440/175] min-h-[76px] overflow-x-clip overflow-y-visible select-none pointer-events-auto"
    >
      {/* Unified Master SVG: Full 1440px width spans edge-to-edge across all viewports without clipping top roofs/trees */}
      <svg
        viewBox="0 55 1440 231"
        preserveAspectRatio="xMidYMax meet"
        overflow="visible"
        className="w-full h-full overflow-visible block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#154630' : '#2D7550'} />
            <stop offset="100%" stopColor={isDark ? '#103625' : '#215B3D'} />
          </linearGradient>
          <linearGradient id="hillMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#123D2A' : '#1E5E3D'} />
            <stop offset="100%" stopColor={isDark ? '#0D2E20' : '#184F33'} />
          </linearGradient>
          <linearGradient id="valleyNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#164530' : '#1A5337'} />
            <stop offset="100%" stopColor={isDark ? '#0E3122' : '#113B28'} />
          </linearGradient>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Night Mode Twinkling Stars in the Sky */}
        {isDark && (
          <g id="night-stars">
            <g transform="translate(260, 96)">
              <circle cx="0" cy="0" r="1.8" fill="#FEF08A" className="animate-star-twinkle" />
            </g>
            <g transform="translate(420, 88)">
              <circle cx="0" cy="0" r="1.4" fill="#E2E8F0" className="animate-star-twinkle-delayed" />
            </g>
            <g transform="translate(590, 98)">
              <circle cx="0" cy="0" r="2" fill="#FDE047" className="animate-star-twinkle" />
            </g>
            <g transform="translate(880, 90)">
              <circle cx="0" cy="0" r="1.7" fill="#FEF08A" className="animate-star-twinkle-delayed" />
            </g>
            <g transform="translate(1050, 96)">
              <circle cx="0" cy="0" r="1.5" fill="#E2E8F0" className="animate-star-twinkle" />
            </g>
            <g transform="translate(1300, 88)">
              <circle cx="0" cy="0" r="1.9" fill="#FDE047" className="animate-star-twinkle-delayed" />
            </g>
          </g>
        )}

        {/* Radiant Sun (Day) / Moon (Night) — Positioned in the clear sky at x: 1160 */}
        <g transform="translate(1160, 122)">
          <g className="animate-sun-glow">
            <circle cx="0" cy="0" r="32" fill={isDark ? '#6EE7B7' : '#FEF08A'} opacity={isDark ? 0.16 : 0.38} />
            <circle cx="0" cy="0" r="21" fill={isDark ? '#E2E8F0' : 'url(#sunGlow)'} />
            {isDark && (
              <>
                <circle cx="-5" cy="-5" r="3" fill="#CBD5E1" opacity="0.6" />
                <circle cx="5" cy="4" r="3.6" fill="#CBD5E1" opacity="0.6" />
              </>
            )}
          </g>
        </g>

        {/* Drifting Clouds */}
        <g className="animate-cloud-slow" opacity={isDark ? 0.16 : 0.42}>
          <path d="M 120 112 Q 138 96 164 104 Q 190 91 215 108 Q 240 104 248 120 Q 252 132 222 132 L 128 132 Q 112 128 120 112 Z" fill="#FFFFFF" />
          <path d="M 860 116 Q 878 100 904 108 Q 930 96 956 112 Q 978 108 986 124 L 868 124 Q 852 120 860 116 Z" fill="#FFFFFF" />
        </g>

        {/* High Flying Birds Traversing Across the Hills */}
        <g className="animate-birds-fly">
          <g className="animate-bird-flap" opacity={isDark ? 0.65 : 0.85}>
            <path d="M 0 106 Q 8 98 16 106 Q 24 98 32 106 Q 24 102 16 108 Q 8 102 0 106 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
            <path d="M 38 118 Q 44 112 50 118 Q 56 112 62 118 Q 56 115 50 120 Q 44 115 38 118 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
            <path d="M -30 122 Q -24 117 -18 122 Q -12 117 -6 122 Q -12 119 -18 124 Q -24 119 -30 122 Z" fill={isDark ? '#A7F3D0' : '#D1FAE5'} />
          </g>
        </g>

        {/* Far Background Tea Garden Hills (extended -800..2240 for seamless ultrawide coverage) */}
        <path d="M -800 185 Q -280 120 0 185 Q 240 115 500 170 Q 760 125 1020 175 Q 1240 135 1440 180 Q 1840 125 2240 180 L 2240 290 L -800 290 Z" fill="url(#hillFar)" />

        {/* Midground Hills with Tea Bush Orchard Dots */}
        <path d="M -800 215 Q -300 165 0 215 Q 220 155 450 205 Q 700 160 940 220 Q 1200 180 1440 210 Q 1840 165 2240 215 L 2240 290 L -800 290 Z" fill="url(#hillMid)" />
        <g fill={isDark ? '#0A2419' : '#14462C'} opacity="0.5">
          <circle cx="280" cy="195" r="5" /> <circle cx="360" cy="188" r="6" /> <circle cx="440" cy="205" r="5.5" />
          <circle cx="680" cy="192" r="5" /> <circle cx="760" cy="198" r="6" /> <circle cx="860" cy="208" r="5" />
        </g>

        {/* Foreground Valley Meadow */}
        <path d="M -800 245 Q -360 230 0 245 Q 360 225 720 245 Q 1080 230 1440 250 Q 1840 232 2240 248 L 2240 290 L -800 290 Z" fill="url(#valleyNear)" />

        {/* Winding Country Road Grounded at y: 274 with Clear Contrast & Road Shoulders */}
        <path d="M -800 274 Q -360 268 0 274 Q 340 266 720 273 Q 1100 268 1440 275 Q 1840 269 2240 274" stroke={isDark ? '#6E5D4F' : '#B59B78'} strokeWidth="22" fill="none" opacity="0.7" />
        <path d="M -800 274 Q -360 268 0 274 Q 340 266 720 273 Q 1100 268 1440 275 Q 1840 269 2240 274" stroke={isDark ? '#4A3F35' : '#8C6D46'} strokeWidth="18" fill="none" opacity="0.96" />
        <path d="M -800 274 Q -360 268 0 274 Q 340 266 720 273 Q 1100 268 1440 275 Q 1840 269 2240 274" stroke={isDark ? '#FDE68A' : '#FFFBEB'} strokeWidth="2" strokeDasharray="10 12" fill="none" opacity="0.9" />

        {/* Roadside Rustic Wooden Lampposts & Directional Signboard */}
        <g id="roadside-decor">
          {/* Wooden Directional Signboard at x: 298 */}
          <g id="wooden-signboard" transform="translate(298, 226)">
            <rect x="14" y="14" width="4" height="30" rx="1" fill="#5C3A21" />
            <path d="M 0 4 L 34 4 L 40 10 L 34 16 L 0 16 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="1.2" />
            <text x="17" y="12.5" textAnchor="middle" fill="#FEF3C7" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
              {isBn ? 'সবুজ গাঁ' : 'VILLAGE'}
            </text>
          </g>

          {/* Wooden Lantern Lamppost 1 at x: 520 */}
          <g id="wooden-lamppost-1" transform="translate(520, 212)">
            <rect x="6" y="8" width="3.5" height="48" rx="1" fill="#4A2F1B" />
            <path d="M 6 10 L 18 10 L 16 14" stroke="#4A2F1B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {isDark && <circle cx="17" cy="18" r="18" fill="url(#lanternGlow)" className="animate-sun-glow" />}
            <polygon points="14,13 20,13 21,21 13,21" fill={isDark ? '#FDE047' : '#FEF9C3'} stroke="#4A2F1B" strokeWidth="1" />
          </g>

          {/* Wooden Lantern Lamppost 2 at x: 815 (Cleanly placed along mid-right road before village yard) */}
          <g id="wooden-lamppost-2" transform="translate(815, 214)">
            <rect x="6" y="8" width="3.5" height="48" rx="1" fill="#4A2F1B" />
            <path d="M 6 10 L 18 10 L 16 14" stroke="#4A2F1B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {isDark && <circle cx="17" cy="18" r="18" fill="url(#lanternGlow)" className="animate-sun-glow" />}
            <polygon points="14,13 20,13 21,21 13,21" fill={isDark ? '#FDE047' : '#FEF9C3'} stroke="#4A2F1B" strokeWidth="1" />
          </g>
        </g>

        {/* Day Mode Blooming Flower Bushes Along the Meadow */}
        {!isDark && (
          <g id="day-flower-bushes">
            {/* Flower Bush Cluster 1 near Shop */}
            <g transform="translate(248, 256)">
              <path d="M 0 10 Q 6 0 14 6 Q 22 -2 28 10 Z" fill="#15803D" />
              <circle cx="8" cy="5" r="2.5" fill="#F59E0B" />
              <circle cx="15" cy="3" r="2.5" fill="#FB7185" />
              <circle cx="21" cy="6" r="2.2" fill="#FBBF24" />
            </g>
            {/* Flower Bush Cluster 2 in Mid Valley */}
            <g transform="translate(650, 258)">
              <path d="M 0 10 Q 8 -1 16 5 Q 24 -2 32 10 Z" fill="#15803D" />
              <circle cx="9" cy="5" r="2.5" fill="#FB7185" />
              <circle cx="17" cy="3" r="2.6" fill="#FDE047" />
              <circle cx="24" cy="6" r="2.3" fill="#F97316" />
            </g>
            {/* Flower Bush Cluster 3 near Village */}
            <g transform="translate(1135, 257)">
              <path d="M 0 10 Q 7 0 15 6 Q 22 -1 28 10 Z" fill="#15803D" />
              <circle cx="8" cy="5" r="2.4" fill="#FDE047" />
              <circle cx="15" cy="3" r="2.5" fill="#F43F5E" />
              <circle cx="21" cy="6" r="2.2" fill="#FB923C" />
            </g>
          </g>
        )}

        {/* Night Mode Glowing Fireflies (জোনাকি পোকা) Floating Over the Meadow */}
        {isDark && (
          <g id="night-fireflies">
            <g transform="translate(275, 238)">
              <circle cx="0" cy="0" r="2.2" fill="#A3E635" className="animate-firefly-float" />
            </g>
            <g transform="translate(465, 228)">
              <circle cx="0" cy="0" r="2" fill="#FDE047" className="animate-firefly-float-delayed" />
            </g>
            <g transform="translate(680, 234)">
              <circle cx="0" cy="0" r="2.4" fill="#BEF264" className="animate-firefly-float" />
            </g>
            <g transform="translate(940, 225)">
              <circle cx="0" cy="0" r="2" fill="#A3E635" className="animate-firefly-float-delayed" />
            </g>
            <g transform="translate(1155, 236)">
              <circle cx="0" cy="0" r="2.3" fill="#FDE047" className="animate-firefly-float" />
            </g>
          </g>
        )}

        {/* Left Side: GardenValy Shop (Firmly anchored on the ground at y: 268) */}
        <GardenShopCottage isDark={isDark} />

        {/* Right Side: Village Haven with Krishan, Krishani, Kids & Delivered Plants (Anchored at y: 268) */}
        <GardenVillageHaven isDark={isDark} />

        {/* Moving Delivery Van: Enters -> Parks at Shop -> Loads -> Drives -> Stops at Village -> Unloads -> Exits */}
        <g className="animate-story-van">
          <GardenDeliveryVan isDark={isDark} onClick={handleVanClick} />
        </g>
      </svg>

      {/* Interactive Van Speech Toast */}
      {showVanToast && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border-2 border-emerald-500 text-xs font-bold text-emerald-900 dark:text-emerald-200 animate-bounce">
          🚚🪴 {isBn ? 'গার্ডেনভ্যালি থেকে চারাগাছ পৌঁছে যাচ্ছে আপনার দরজায়!' : 'Fresh plants on their way from GardenValy!'}
        </div>
      )}
    </div>
  );
};
