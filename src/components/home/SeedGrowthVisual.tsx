/**
 * @file SeedGrowthVisual.tsx
 * @description Dynamic SVG illustrations representing the 4 stages of botanical growth:
 * - Stage 0 (খাঁটি): Dormant Heirloom Seed in Fertile Soil
 * - Stage 1 (কচি): Sprouting Shoot with First Emerald Leaves
 * - Stage 2 (ফুল): Blooming Tree with Fragrant Golden-White Flowers
 * - Stage 3 (ফল গাছ): Mature Fruiting Tree with Sweet Ruby & Golden Fruits
 */

import React from 'react';

interface SeedGrowthVisualProps {
  stage: number; // 0: Seed (খাঁটি), 1: Sprout (কচি), 2: Bloom (ফুল), 3: Fruiting Tree (ফল গাছ)
}

export const SeedGrowthVisual: React.FC<SeedGrowthVisualProps> = ({ stage }) => {
  return (
    <div className="relative w-full max-w-[220px] sm:max-w-[270px] lg:max-w-[300px] aspect-square mx-auto flex items-center justify-center p-2 sm:p-3 select-none">
      {/* Background Soft Glow */}
      <div
        className={`absolute inset-4 rounded-full transition-all duration-700 blur-2xl ${
          stage === 0
            ? 'bg-amber-600/15'
            : stage === 1
            ? 'bg-emerald-600/20'
            : stage === 2
            ? 'bg-yellow-500/20'
            : 'bg-emerald-700/25'
        }`}
      />

      {/* Stage 0: খাঁটি — The Dormant Heirloom Seed in Soil */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu will-change-[transform,opacity] ${
          stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-xl" aria-hidden="true">
          {/* Underground Loam Stratum */}
          <ellipse cx="100" cy="155" rx="80" ry="22" fill="#3D2817" opacity="0.25" />
          <path d="M20 145 Q100 135 180 145 L180 170 Q100 180 20 170 Z" fill="#2E1D11" opacity="0.35" />
          {/* Moisture Droplets */}
          <circle cx="55" cy="120" r="4" fill="#60A5FA" opacity="0.7" />
          <circle cx="145" cy="125" r="3.5" fill="#60A5FA" opacity="0.6" />
          <circle cx="100" cy="85" r="4.5" fill="#60A5FA" opacity="0.8" />
          {/* The Golden Seed Body */}
          <path
            d="M100 90 C80 108 72 135 78 150 C84 165 116 165 122 150 C128 135 120 108 100 90 Z"
            fill="#C5A059"
          />
          <path
            d="M100 96 C86 112 80 132 84 145 C89 157 111 157 116 145 C120 132 114 112 100 96 Z"
            fill="#D9B36C"
          />
          {/* Subtle Germination Crack */}
          <path d="M100 105 Q98 125 104 140" stroke="#785925" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Stage 1: কচি — The Sprouting Shoot with First Emerald Leaves */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu will-change-[transform,opacity] ${
          stage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-xl" aria-hidden="true">
          {/* Sunlight Aura Rays */}
          <circle cx="100" cy="35" r="14" fill="#FDE047" opacity="0.3" />
          <circle cx="100" cy="35" r="8" fill="#FACC15" opacity="0.6" />
          <line x1="100" y1="12" x2="100" y2="4" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="20" x2="72" y2="15" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <line x1="122" y1="20" x2="128" y2="15" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          {/* Ground Surface */}
          <ellipse cx="100" cy="155" rx="75" ry="16" fill="#3D2817" opacity="0.3" />
          {/* Subterranean Roots */}
          <path d="M100 155 Q85 170 70 178 M100 155 Q102 175 100 188 M100 155 Q115 168 130 176" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          {/* Sprout Stem */}
          <path d="M100 152 Q95 110 100 75" fill="none" stroke="#5C8D50" strokeWidth="6" strokeLinecap="round" />
          {/* Left Leaf */}
          <path d="M100 78 C70 65 60 45 74 42 C88 40 98 62 100 76 Z" fill="#5C8D50" />
          <path d="M100 78 C76 68 68 52 78 48" fill="none" stroke="#3D6834" strokeWidth="1.5" />
          {/* Right Leaf */}
          <path d="M100 72 C130 58 140 40 126 36 C112 34 102 56 100 70 Z" fill="#4B7740" />
          <path d="M100 72 C124 62 132 46 122 42" fill="none" stroke="#3D6834" strokeWidth="1.5" />
          {/* Droplet on leaf tip */}
          <circle cx="68" cy="42" r="3" fill="#93C5FD" opacity="0.9" />
        </svg>
      </div>

      {/* Stage 2: ফুল — The Blooming Tree Crowned with Fragrant Blossoms */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu will-change-[transform,opacity] ${
          stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-60 h-60 sm:w-72 sm:h-72 drop-shadow-2xl" aria-hidden="true">
          <defs>
            <g id="journeyBlossom">
              <circle cx="0" cy="-5" r="3.6" fill="#FEF9C3" />
              <circle cx="-4.8" cy="-1.5" r="3.6" fill="#FEF08A" />
              <circle cx="-3" cy="4" r="3.6" fill="#FEF9C3" />
              <circle cx="3" cy="4" r="3.6" fill="#FEF08A" />
              <circle cx="4.8" cy="-1.5" r="3.6" fill="#FEF9C3" />
              <circle cx="0" cy="0" r="2.4" fill="#F59E0B" />
            </g>
          </defs>
          {/* Shaded Grass Ground */}
          <ellipse cx="100" cy="168" rx="80" ry="16" fill="#174D35" opacity="0.28" />
          {/* Young Branched Tree Trunk */}
          <path d="M93 165 C93 142 90 122 82 104 L118 104 C110 122 107 142 107 165 Z" fill="#6E421C" />
          <path d="M93 126 Q72 108 58 96 L64 91 Q82 102 96 116 Z" fill="#5A3414" />
          <path d="M107 122 Q128 104 142 94 L137 88 Q120 98 104 114 Z" fill="#5A3414" />
          {/* Fresh Spring Canopy Foliage */}
          <circle cx="100" cy="70" r="40" fill="#1E5C41" />
          <circle cx="72" cy="75" r="30" fill="#246A4B" />
          <circle cx="128" cy="75" r="30" fill="#2E7E59" />
          <circle cx="100" cy="48" r="30" fill="#3D8F67" />
          <circle cx="82" cy="55" r="24" fill="#52B788" />
          <circle cx="118" cy="55" r="24" fill="#40916C" />
          {/* Abundant Fragrant Blossoms Across the Crown */}
          <use href="#journeyBlossom" transform="translate(100, 38) scale(1.15)" />
          <use href="#journeyBlossom" transform="translate(74, 52) scale(1.05)" />
          <use href="#journeyBlossom" transform="translate(126, 54) scale(1.1)" />
          <use href="#journeyBlossom" transform="translate(58, 76) scale(1.0)" />
          <use href="#journeyBlossom" transform="translate(140, 74) scale(1.0)" />
          <use href="#journeyBlossom" transform="translate(88, 72) scale(1.1)" />
          <use href="#journeyBlossom" transform="translate(114, 78) scale(1.05)" />
          <use href="#journeyBlossom" transform="translate(76, 92) scale(0.9)" />
          <use href="#journeyBlossom" transform="translate(122, 92) scale(0.95)" />
        </svg>
      </div>

      {/* Stage 3: ফল গাছ — The Magnificent Mature Tree with Sweet Fruits */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu will-change-[transform,opacity] ${
          stage === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-60 h-60 sm:w-72 sm:h-72 drop-shadow-2xl" aria-hidden="true">
          {/* Shaded Grass Ground */}
          <ellipse cx="100" cy="168" rx="85" ry="18" fill="#174D35" opacity="0.3" />
          {/* Solid Tree Trunk */}
          <path d="M92 165 C92 140 88 120 78 100 L122 100 C112 120 108 140 108 165 Z" fill="#5C3D2E" />
          <path d="M92 125 Q70 105 55 95 L62 90 Q80 100 95 115 Z" fill="#4A3125" />
          <path d="M108 120 Q130 102 145 92 L140 86 Q122 98 105 112 Z" fill="#4A3125" />
          {/* Lush Canopy Foliage Layers */}
          <circle cx="100" cy="68" r="42" fill="#174D35" />
          <circle cx="70" cy="72" r="32" fill="#1E5C41" />
          <circle cx="130" cy="72" r="32" fill="#246A4B" />
          <circle cx="100" cy="45" r="32" fill="#2E7E59" />
          <circle cx="82" cy="52" r="26" fill="#3D8F67" />
          <circle cx="118" cy="52" r="26" fill="#3D8F67" />
          {/* Hanging Sweet Fruits (Citrus / Pomegranate Red & Orange) */}
          <circle cx="65" cy="75" r="7.5" fill="#E11D48" />
          <circle cx="66" cy="74" r="2.2" fill="#FDA4AF" />
          <circle cx="135" cy="72" r="7.5" fill="#E11D48" />
          <circle cx="136" cy="71" r="2.2" fill="#FDA4AF" />
          <circle cx="100" cy="50" r="8" fill="#F97316" />
          <circle cx="101" cy="49" r="2.5" fill="#FDBA74" />
          <circle cx="82" cy="88" r="6.5" fill="#F97316" />
          <circle cx="83" cy="87" r="2" fill="#FDBA74" />
          <circle cx="118" cy="85" r="7" fill="#E11D48" />
          <circle cx="119" cy="84" r="2" fill="#FDA4AF" />
          <circle cx="102" cy="74" r="6.5" fill="#F59E0B" />
          <circle cx="103" cy="73" r="2" fill="#FEF08A" />
        </svg>
      </div>
    </div>
  );
};
