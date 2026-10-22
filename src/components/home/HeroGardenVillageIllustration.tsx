/**
 * @file HeroGardenVillageIllustration.tsx
 * @description Modern, cinematic, multi-layered vector artwork of a lush Botanical Conservatory Garden
 * and a serene Bengal River Village (আধুনিক বাগান ও বাংলার গ্রামের দৃশ্য) for the Hero Section.
 * Uses rich atmospheric gradients, volumetric light rays, Bezier-curved architecture,
 * layered tropical foliage (Monstera, Coconut Palms, Krishnachura, Water Lilies), and smooth micro-animations.
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import '../layout/valleyLandscape.css';

export type HeroDisplayMode = 'carousel' | 'illustration';
export const HERO_DISPLAY_MODE_KEY = 'gardenvaly_hero_display_mode';
export const HERO_MODE_UPDATED_EVENT = 'gardenvaly-hero-mode-updated';

export function getStoredHeroDisplayMode(): HeroDisplayMode {
  if (typeof window === 'undefined') return 'carousel';
  try {
    const val = localStorage.getItem(HERO_DISPLAY_MODE_KEY);
    return val === 'illustration' ? 'illustration' : 'carousel';
  } catch {
    return 'carousel';
  }
}

export function setStoredHeroDisplayMode(mode: HeroDisplayMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HERO_DISPLAY_MODE_KEY, mode);
    window.dispatchEvent(new CustomEvent(HERO_MODE_UPDATED_EVENT, { detail: mode }));
  } catch (e) {
    console.error('Failed to save hero display mode', e);
  }
}

interface HeroGardenVillageIllustrationProps {
  compactPreview?: boolean;
}

export const HeroGardenVillageIllustration: React.FC<HeroGardenVillageIllustrationProps> = ({
  compactPreview = false,
}) => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ─── 1. ATMOSPHERIC SKY & VOLUMETRIC GRADIENTS ─────────────────── */}
          <linearGradient id="modernSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#030D09" />
                <stop offset="32%" stopColor="#071F16" />
                <stop offset="68%" stopColor="#0E3828" />
                <stop offset="100%" stopColor="#164E37" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0B2E20" />
                <stop offset="28%" stopColor="#164E35" />
                <stop offset="62%" stopColor="#2E7D56" />
                <stop offset="86%" stopColor="#84A96C" />
                <stop offset="100%" stopColor="#F3D082" />
              </>
            )}
          </linearGradient>

          {/* Horizon Golden / Moonlit Ambient Glow */}
          <radialGradient id="horizonGlow" cx="76%" cy="42%" r="55%">
            <stop
              offset="0%"
              stopColor={isDark ? '#34D399' : '#FEF08A'}
              stopOpacity={isDark ? '0.26' : '0.68'}
            />
            <stop
              offset="45%"
              stopColor={isDark ? '#10B981' : '#F59E0B'}
              stopOpacity={isDark ? '0.12' : '0.28'}
            />
            <stop offset="100%" stopColor="#174D35" stopOpacity="0" />
          </radialGradient>

          {/* Sun / Moon Core Orb */}
          <linearGradient id="celestialOrb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#FFFFFF' : '#FFFBEB'} />
            <stop offset="60%" stopColor={isDark ? '#E2E8F0' : '#FDE047'} />
            <stop offset="100%" stopColor={isDark ? '#94A3B8' : '#F59E0B'} />
          </linearGradient>

          {/* Volumetric Sunbeams */}
          <linearGradient id="godRayGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop
              offset="0%"
              stopColor={isDark ? '#6EE7B7' : '#FEF08A'}
              stopOpacity={isDark ? '0.12' : '0.28'}
            />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Parallax Mountain & Hill Gradients */}
          <linearGradient id="farMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#0D3122' : '#2D6E4E'} />
            <stop offset="100%" stopColor={isDark ? '#071D14' : '#1B4933'} />
          </linearGradient>

          <linearGradient id="midTeaHillsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#123F2B' : '#2E7D52'} />
            <stop offset="100%" stopColor={isDark ? '#092418' : '#184A30'} />
          </linearGradient>

          <linearGradient id="villageBankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#164A32' : '#348C58'} />
            <stop offset="100%" stopColor={isDark ? '#0A2619' : '#15442B'} />
          </linearGradient>

          <linearGradient id="gardenForegroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#13422C' : '#256D45'} />
            <stop offset="100%" stopColor={isDark ? '#061810' : '#0E3320'} />
          </linearGradient>

          {/* Winding Bengal River Gradient */}
          <linearGradient id="sereneRiverGrad" x1="30%" y1="0%" x2="70%" y2="100%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#134E4A" />
                <stop offset="45%" stopColor="#0F766E" />
                <stop offset="80%" stopColor="#115E59" />
                <stop offset="100%" stopColor="#062C2B" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="35%" stopColor="#38BDF8" />
                <stop offset="72%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0E4F6E" />
              </>
            )}
          </linearGradient>

          {/* Conservatory Glass Dome Gradient */}
          <linearGradient id="glassDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={isDark ? '#34D399' : '#FFFFFF'}
              stopOpacity={isDark ? '0.28' : '0.45'}
            />
            <stop
              offset="55%"
              stopColor={isDark ? '#FDE047' : '#FEF9C3'}
              stopOpacity={isDark ? '0.22' : '0.32'}
            />
            <stop
              offset="100%"
              stopColor={isDark ? '#064E3B' : '#A7F3D0'}
              stopOpacity={isDark ? '0.4' : '0.25'}
            />
          </linearGradient>

          {/* Warm Cottage Window & Lantern Radial Glow */}
          <radialGradient id="warmWindowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>

          {/* Stone Pathway Gradient */}
          <linearGradient id="stonePathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#64584B' : '#D6C4AA'} />
            <stop offset="100%" stopColor={isDark ? '#3D342C' : '#9C8567'} />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="softBloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─── LAYER 1: SKY & HORIZON AMBIENCE ─────────────────────────────── */}
        <rect width="1440" height="760" fill="url(#modernSkyGrad)" />
        <rect width="1440" height="760" fill="url(#horizonGlow)" />

        {/* Night Stars & Milky Way Shimmer */}
        {isDark && (
          <g id="celestial-stars">
            {[
              [420, 68, 1.8],
              [540, 110, 1.2],
              [660, 54, 2.1],
              [780, 92, 1.5],
              [890, 48, 2.2],
              [980, 115, 1.4],
              [1060, 64, 1.9],
              [1240, 58, 2.0],
              [1350, 96, 1.6],
              [1405, 52, 1.4],
              [610, 155, 1.3],
              [830, 148, 1.7],
              [1290, 152, 1.5],
            ].map(([cx, cy, r], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={r}
                fill={idx % 2 === 0 ? '#FEF08A' : '#E2E8F0'}
                className={idx % 2 === 0 ? 'animate-star-twinkle' : 'animate-star-twinkle-delayed'}
              />
            ))}
          </g>
        )}

        {/* Volumetric God-Rays Radiating from Sun/Moon */}
        <g opacity={isDark ? '0.45' : '0.75'}>
          <polygon points="1095,165 680,520 820,520" fill="url(#godRayGrad)" />
          <polygon points="1095,165 890,540 1050,540" fill="url(#godRayGrad)" />
          <polygon points="1095,165 1110,540 1285,540" fill="url(#godRayGrad)" />
        </g>

        {/* Radiant Sun (Day) / Luminous Full Moon (Night) */}
        <g transform="translate(1095, 165)">
          <g className="animate-sun-glow">
            <circle
              cx="0"
              cy="0"
              r="115"
              fill={isDark ? '#34D399' : '#FDE047'}
              opacity={isDark ? '0.12' : '0.24'}
            />
            <circle
              cx="0"
              cy="0"
              r="76"
              fill={isDark ? '#A7F3D0' : '#FEF08A'}
              opacity={isDark ? '0.2' : '0.4'}
            />
            <circle cx="0" cy="0" r="48" fill="url(#celestialOrb)" filter="url(#softBloom)" />
            {isDark && (
              <g fill="#CBD5E1" opacity="0.45">
                <circle cx="-14" cy="-10" r="7.5" />
                <circle cx="12" cy="8" r="9.5" />
                <circle cx="-4" cy="18" r="5" />
              </g>
            )}
          </g>
        </g>

        {/* Soft Layered Atmospheric Clouds */}
        <g className="animate-cloud-slow" opacity={isDark ? '0.14' : '0.55'}>
          <path
            d="M 460 155 C 485 130, 530 132, 555 148 C 585 122, 640 125, 668 150 C 695 145, 720 158, 725 174 C 728 184, 705 188, 675 188 L 470 188 C 445 188, 442 170, 460 155 Z"
            fill={isDark ? '#A7F3D0' : '#FFFBEB'}
          />
          <path
            d="M 880 112 C 905 92, 945 94, 968 108 C 995 86, 1045 90, 1068 110 C 1090 106, 1112 118, 1115 130 L 885 130 C 865 130, 865 122, 880 112 Z"
            fill={isDark ? '#A7F3D0' : '#FFFFFF'}
          />
        </g>

        {/* Distant Flock of Birds Soaring Over the Valley */}
        <g className="animate-birds-fly" transform="translate(80, 45)">
          <g className="animate-bird-flap" opacity={isDark ? '0.75' : '0.88'}>
            <path
              d="M 610 110 C 618 98, 628 98, 635 108 C 642 98, 652 98, 660 110 C 650 103, 642 105, 635 113 C 628 105, 620 103, 610 110 Z"
              fill={isDark ? '#E2E8F0' : '#1E3A2F'}
            />
            <path
              d="M 668 124 C 674 115, 682 115, 688 122 C 694 115, 702 115, 708 124 C 700 119, 694 120, 688 126 C 682 120, 676 119, 668 124 Z"
              fill={isDark ? '#E2E8F0' : '#1E3A2F'}
            />
            <path
              d="M 575 128 C 581 120, 588 120, 594 126 C 600 120, 607 120, 613 128 C 606 123, 600 124, 594 129 C 588 124, 582 123, 575 128 Z"
              fill={isDark ? '#E2E8F0' : '#1E3A2F'}
            />
          </g>
        </g>

        {/* ─── LAYER 2: DISTANT MISTY HILLS & CONTOURED TEA GARDENS ────────── */}
        <path
          d="M -80 430 C 140 310, 360 300, 580 365 C 790 250, 990 255, 1190 335 C 1310 295, 1410 305, 1520 350 L 1520 760 L -80 760 Z"
          fill="url(#farMountainGrad)"
        />

        {/* Soft Valley Mist Ribbon 1 */}
        <path
          d="M 350 375 Q 680 340 1020 368 Q 1280 388 1480 355 L 1480 415 L 350 415 Z"
          fill={isDark ? '#34D399' : '#FEF9C3'}
          opacity={isDark ? '0.08' : '0.26'}
        />

        {/* Mid-ground Rolling Tea Garden Hills with Contour Ribbons */}
        <path
          d="M -80 475 C 180 385, 420 375, 670 432 C 880 365, 1110 355, 1340 415 C 1410 430, 1470 420, 1520 430 L 1520 760 L -80 760 Z"
          fill="url(#midTeaHillsGrad)"
        />
        {/* Sculpted Tea Terrace Contour Lines */}
        <g
          fill="none"
          stroke={isDark ? '#1E5E3E' : '#4ADE80'}
          strokeWidth="2"
          opacity={isDark ? '0.32' : '0.35'}
        >
          <path d="M 740 402 Q 960 362 1190 405" />
          <path d="M 710 418 Q 960 376 1230 422" />
          <path d="M 685 434 Q 960 392 1265 438" />
        </g>

        {/* ─── LAYER 3: S-CURVE BENGAL RIVER, SAILBOAT & WATER LILIES ──────── */}
        {/* River Meadow Base */}
        <path
          d="M -80 515 C 240 465, 540 455, 860 472 C 1120 485, 1310 462, 1520 475 L 1520 760 L -80 760 Z"
          fill="url(#villageBankGrad)"
        />

        {/* Graceful S-Curve River Flowing from Horizon to Foreground */}
        <path
          d="M 920 432 C 830 450, 740 472, 790 508 C 845 548, 1035 565, 1010 618 C 985 670, 760 710, 650 760 L 1280 760 C 1310 695, 1250 635, 1175 585 C 1090 528, 965 505, 955 468 C 948 448, 975 438, 1010 432 Z"
          fill="url(#sereneRiverGrad)"
        />

        {/* Riverbank Golden-Sand / Earth Edge */}
        <path
          d="M 920 432 C 830 450, 740 472, 790 508 C 845 548, 1035 565, 1010 618 C 985 670, 760 710, 650 760"
          fill="none"
          stroke={isDark ? '#346B52' : '#D6C4AA'}
          strokeWidth="3.5"
          opacity="0.7"
        />

        {/* Sun/Moon Shimmering Water Reflections */}
        <g
          stroke={isDark ? '#A7F3D0' : '#FEF9C3'}
          strokeLinecap="round"
          opacity={isDark ? '0.45' : '0.7'}
        >
          <line x1="860" y1="478" x2="915" y2="478" strokeWidth="2" />
          <line x1="835" y1="495" x2="905" y2="495" strokeWidth="2.5" />
          <line x1="875" y1="514" x2="955" y2="514" strokeWidth="2" />
          <line x1="935" y1="538" x2="1030" y2="538" strokeWidth="3" />
          <line x1="990" y1="568" x2="1095" y2="568" strokeWidth="2.5" />
          <line x1="960" y1="605" x2="1080" y2="605" strokeWidth="3.5" />
          <line x1="910" y1="648" x2="1055" y2="648" strokeWidth="3" />
        </g>

        {/* Elegant Bengal Wooden Sailboat (পালতোলা নৌকা) Gliding on the River */}
        <g transform="translate(865, 452)">
          <g className="animate-krishani-welcome">
            {/* Water Shadow / Reflection under Hull */}
            <ellipse
              cx="52"
              cy="86"
              rx="48"
              ry="5"
              fill={isDark ? '#042F2E' : '#0369A1'}
              opacity="0.55"
            />
            {/* Curved Traditional Dinghy Hull (ময়ূরপঙ্খী/ডিঙি ধাঁচের বাঁকানো গলুই) */}
            <path
              d="M 0 68 Q 14 84 52 84 Q 90 84 106 64 Q 88 73 52 73 Q 16 73 0 68 Z"
              fill="#3E2009"
              stroke="#78350F"
              strokeWidth="1.2"
            />
            {/* Arched Woven Bamboo Cabin (বাঁশের ছই) */}
            <path
              d="M 28 73 Q 50 52 74 73 Z"
              fill="#B45309"
              stroke="#78350F"
              strokeWidth="1.2"
            />
            <path d="M 36 73 Q 50 58 66 73" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />

            {/* Boatman Silhouette at the Stern */}
            <circle cx="84" cy="62" r="3.5" fill="#1C1917" />
            <polygon points="78,61 84,56 90,61" fill="#D97706" />
            <path d="M 81 65 L 87 65 L 89 72 L 79 72 Z" fill="#F8FAFC" />
            <line x1="87" y1="67" x2="104" y2="82" stroke="#5C3A21" strokeWidth="1.8" />

            {/* Tall Bamboo Mast & Billowing Curved Sails */}
            <line x1="50" y1="2" x2="50" y2="73" stroke="#451A03" strokeWidth="2.2" />
            {/* Main Billowing Sail */}
            <path
              d="M 50 6 C 78 16, 88 38, 76 58 C 64 54, 56 54, 50 56 Z"
              fill={isDark ? '#FEF3C7' : '#FFFFFF'}
              opacity="0.95"
            />
            {/* Secondary Warm Ochre Jib Sail */}
            <path
              d="M 47 12 C 26 24, 20 42, 28 56 C 36 53, 42 53, 47 55 Z"
              fill="#F59E0B"
              opacity="0.88"
            />
            {/* Sail Pennant Flag */}
            <path d="M 50 2 L 66 6 L 50 10 Z" fill="#EF4444" />
          </g>
        </g>

        {/* Blooming Pink Water Lilies (শাপলা ফুল) in the Foreground River Bend */}
        <g transform="translate(880, 655)">
          {[
            [0, 0, 1],
            [55, 18, 0.85],
            [125, -8, 0.95],
            [175, 15, 0.8],
          ].map(([lx, ly, sc], i) => (
            <g key={i} transform={`translate(${lx}, ${ly}) scale(${sc})`}>
              <ellipse cx="0" cy="6" rx="18" ry="5.5" fill="#15803D" opacity="0.85" />
              <path d="M 0 4 C -6 -6, -2 -12, 0 -14 C 2 -12, 6 -6, 0 4 Z" fill="#F43F5E" />
              <path d="M 0 4 C -12 -2, -14 -8, -8 -11 C -4 -9, -2 -3, 0 4 Z" fill="#FB7185" />
              <path d="M 0 4 C 12 -2, 14 -8, 8 -11 C 4 -9, 2 -3, 0 4 Z" fill="#FB7185" />
              <circle cx="0" cy="1" r="2.5" fill="#FACC15" />
            </g>
          ))}
        </g>

        {/* ─── LAYER 4: RIGHT BANK — ARTISTIC BENGAL VILLAGE SANCTUARY ──────── */}
        <g id="artistic-bengal-village" transform="translate(985, 290)">
          {/* Lush Krishnachura / Banyan Tree Canopy Behind Village */}
          <g transform="translate(215, 95)">
            {/* Multi-branching trunk */}
            <path
              d="M 45 145 C 45 105, 38 75, 20 45 M 45 110 C 58 82, 72 62, 92 42 M 45 145 L 45 60"
              stroke="#3E2009"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Layered Canopy Clouds */}
            <ellipse cx="15" cy="38" rx="48" ry="26" fill={isDark ? '#0D3B26' : '#15803D'} />
            <ellipse cx="75" cy="34" rx="52" ry="28" fill={isDark ? '#114B30' : '#16A34A'} />
            <ellipse cx="48" cy="18" rx="56" ry="30" fill={isDark ? '#155E3B' : '#22C55E'} />
            {/* Krishnachura Red-Orange Blossoms */}
            {!isDark && (
              <g fill="#F97316" opacity="0.85">
                <circle cx="22" cy="16" r="8" />
                <circle cx="45" cy="8" r="10" />
                <circle cx="72" cy="18" r="9" />
                <circle cx="88" cy="28" r="7" />
              </g>
            )}
          </g>

          {/* Graceful Curved Coconut Palms (নারিকেল গাছ) */}
          <g transform="translate(355, 225)">
            <g className="animate-tree-sway">
              {/* Curved Trunk with Ring Segments */}
              <path
                d="M 0 0 C 18 -65, 28 -135, 8 -205"
                stroke="#4A2C16"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              {/* Feathered Palm Fronds */}
              <g transform="translate(8, -205)">
                <path d="M 0 0 C -35 -28, -75 -18, -95 12 C -62 -4, -30 -8, 0 0 Z" fill="#15803D" />
                <path d="M 0 0 C -25 -45, -65 -52, -88 -32 C -55 -36, -25 -24, 0 0 Z" fill="#22C55E" />
                <path d="M 0 0 C 35 -32, 78 -22, 98 10 C 65 -6, 32 -10, 0 0 Z" fill="#15803D" />
                <path d="M 0 0 C 28 -48, 68 -54, 92 -30 C 58 -36, 26 -24, 0 0 Z" fill="#4ADE80" />
                <path d="M 0 0 C -8 -55, 18 -68, 35 -48 C 18 -45, 6 -25, 0 0 Z" fill="#86EFAC" />
                {/* Cluster of Tender Coconuts */}
                <circle cx="-4" cy="6" r="5.5" fill="#65A30D" />
                <circle cx="5" cy="7" r="5.5" fill="#84CC16" />
                <circle cx="1" cy="12" r="5" fill="#4D7C0F" />
              </g>
            </g>
          </g>

          {/* Secondary Cottage in Mid-ground (ছোট কুঁড়েঘর) */}
          <g transform="translate(95, 130)">
            {/* Mud Walls */}
            <path d="M 12 36 L 88 36 L 90 78 L 10 78 Z" fill={isDark ? '#7C2D12' : '#B45309'} />
            {/* Curved Bengal Dochala Thatch Roof (বাঁকানো দোচালা ছাদ) */}
            <path
              d="M 0 40 Q 50 4 100 40 Q 50 28 0 40 Z"
              fill={isDark ? '#451A03' : '#78350F'}
              stroke="#292524"
              strokeWidth="1.5"
            />
            <path d="M 4 38 Q 50 8 96 38 Q 50 26 4 38 Z" fill={isDark ? '#78350F' : '#D97706'} />
            {/* Glowing Window */}
            <rect
              x="32"
              y="48"
              width="16"
              height="14"
              rx="2"
              fill="#FEF08A"
              filter={isDark ? 'url(#softBloom)' : undefined}
            />
          </g>

          {/* Primary Heritage Bengal Chauchala Cottage (প্রধান গ্রামের বাড়ি ও বারান্দা) */}
          <g transform="translate(175, 132)">
            {/* Raised Terracotta Plinth / Veranda Base (মাটির দাওয়া/বারান্দা) */}
            <rect x="6" y="92" width="168" height="12" rx="3" fill="#451A03" />
            <rect x="12" y="88" width="156" height="6" rx="2" fill="#78350F" />

            {/* Main Cottage Terracotta-Ochre Walls */}
            <rect
              x="18"
              y="38"
              width="144"
              height="52"
              rx="2"
              fill={isDark ? '#9A3412' : '#D97706'}
              stroke="#451A03"
              strokeWidth="2"
            />
            {/* Subtle Textured Inner Wall Panel */}
            <rect x="24" y="42" width="132" height="44" fill={isDark ? '#7C2D12' : '#F59E0B'} opacity="0.45" />

            {/* Authentic Curved Bengal Chauchala Roof (বাংলার ঐতিহ্যবাহী বাঁকানো চৌচালা ছাদ) */}
            <path
              d="M 2 44 C 35 12, 65 -2, 90 -2 C 115 -2, 145 12, 178 44 C 135 34, 45 34, 2 44 Z"
              fill="#451A03"
            />
            <path
              d="M 6 42 C 38 14, 66 2, 90 2 C 114 2, 142 14, 174 42 C 132 32, 48 32, 6 42 Z"
              fill={isDark ? '#78350F' : '#B45309'}
            />
            {/* Roof Thatch Ridge Highlights */}
            <path
              d="M 42 16 Q 90 2 138 16"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Wooden Veranda Pillars */}
            <line x1="32" y1="38" x2="32" y2="88" stroke="#451A03" strokeWidth="3.5" />
            <line x1="88" y1="36" x2="88" y2="88" stroke="#451A03" strokeWidth="3.5" />
            <line x1="148" y1="38" x2="148" y2="88" stroke="#451A03" strokeWidth="3.5" />

            {/* Arched Wooden Door */}
            <path d="M 98 88 L 98 56 Q 112 46 126 56 L 126 88 Z" fill="#292524" stroke="#451A03" strokeWidth="1.5" />

            {/* Warm Glowing Lattice Windows */}
            <g>
              {isDark && <circle cx="58" cy="64" r="34" fill="url(#warmWindowGlow)" />}
              <rect
                x="44"
                y="52"
                width="28"
                height="22"
                rx="2.5"
                fill="#FEF08A"
                stroke="#451A03"
                strokeWidth="2"
                filter={isDark ? 'url(#softBloom)' : undefined}
              />
              <line x1="58" y1="52" x2="58" y2="74" stroke="#451A03" strokeWidth="1.5" />
              <line x1="44" y1="63" x2="72" y2="63" stroke="#451A03" strokeWidth="1.5" />
            </g>

            {/* Hanging Veranda Lantern */}
            <line x1="78" y1="36" x2="78" y2="48" stroke="#292524" strokeWidth="1.5" />
            {isDark && <circle cx="78" cy="52" r="24" fill="url(#warmWindowGlow)" />}
            <circle cx="78" cy="52" r="4" fill="#FEF08A" filter="url(#softBloom)" />
          </g>

          {/* Riverside Stepped Ghat (নদীর বাঁধানো ঘাট) Leading to the Water */}
          <g transform="translate(42, 218)">
            <polygon points="20,0 85,0 68,12 6,12" fill={isDark ? '#64748B' : '#E2E8F0'} />
            <polygon points="12,12 75,12 58,24 -2,24" fill={isDark ? '#475569' : '#CBD5E1'} />
            <polygon points="4,24 65,24 48,36 -10,36" fill={isDark ? '#334155' : '#94A3B8'} />
          </g>
        </g>

        {/* ─── LAYER 5: FOREGROUND & LEFT SIDE — LUSH BOTANICAL GARDEN & TREES ─ */}
        {/* Sculpted Multi-Tiered Botanical Lawn & Rolling Garden Meadow */}
        <path
          d="M -100 505 C 160 448, 460 472, 760 548 C 940 595, 1180 618, 1520 575 L 1520 760 L -100 760 Z"
          fill={isDark ? '#0B3321' : '#15803D'}
          opacity="0.92"
        />
        <path
          d="M -100 548 C 200 490, 510 525, 780 585 C 960 625, 1190 632, 1520 590 L 1520 760 L -100 760 Z"
          fill="url(#gardenForegroundGrad)"
        />

        {/* Winding Natural Flagstone Garden Trail Shifted to Left Side (বামপাশে বাগানের পাথরের মেঠোপথ) */}
        <path
          d="M 285 495 C 260 568, 165 642, 45 760 L 265 760 C 315 658, 342 572, 332 495 Z"
          fill="url(#stonePathGrad)"
          opacity="0.88"
        />
        <g fill={isDark ? '#78716C' : '#F5F5F4'} opacity="0.58">
          <ellipse cx="298" cy="528" rx="18" ry="5" />
          <ellipse cx="282" cy="564" rx="24" ry="6.5" />
          <ellipse cx="255" cy="605" rx="30" ry="8" />
          <ellipse cx="215" cy="654" rx="38" ry="9.5" />
          <ellipse cx="168" cy="710" rx="46" ry="11.5" />
        </g>

        {/* ─── LEFT-SIDE MAJESTIC GARDEN GROVE (বামপাশে সরিয়ে নেওয়া গাছপালা ও বাগান) ─── */}
        <g id="lush-botanical-sanctuary-grove" transform="translate(15, 220)">
          {/* Slender Areca / Betel Nut Palms Framing the Left Border (সুপারি গাছের সারি) */}
          {[
            [18, 255, -6, 0.88],
            [52, 248, 5, 0.94],
            [248, 258, -5, 0.86],
            [282, 265, 7, 0.8],
          ].map(([px, py, tilt, sc], i) => (
            <g key={i} transform={`translate(${px}, ${py}) scale(${sc})`}>
              <g className="animate-tree-sway">
                <path
                  d={`M 0 0 Q ${tilt} -85 ${tilt * 1.6} -175`}
                  stroke={isDark ? '#3E2723' : '#5D4037'}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <g transform={`translate(${tilt * 1.6}, -175)`}>
                  <path d="M 0 0 C -22 -24, -48 -18, -62 6 C -38 -4, -18 -6, 0 0 Z" fill="#15803D" />
                  <path d="M 0 0 C -16 -38, -42 -42, -56 -24 C -35 -26, -16 -16, 0 0 Z" fill="#22C55E" />
                  <path d="M 0 0 C 22 -24, 48 -18, 62 6 C 38 -4, 18 -6, 0 0 Z" fill="#16A34A" />
                  <path d="M 0 0 C 16 -38, 42 -42, 56 -24 C 35 -26, 16 -16, 0 0 Z" fill="#4ADE80" />
                  <path d="M 0 0 C -4 -42, 12 -52, 24 -34 C 12 -32, 4 -18, 0 0 Z" fill="#86EFAC" />
                </g>
              </g>
            </g>
          ))}

          {/* Grand Ancient Mango & Banyan Botanical Canopy Tree on the Left (বামপাশে ছায়াঘেরা আম ও বটবৃক্ষ) */}
          <g transform="translate(32, 28)">
            {/* Deep Back Canopy Shadow */}
            <ellipse cx="105" cy="88" rx="135" ry="62" fill={isDark ? '#062216' : '#0F3F26'} />

            {/* Sculpted Multi-Branching Tree Trunk & Roots */}
            <path
              d="M 85 245 C 88 205, 92 175, 92 140 C 92 108, 65 82, 35 62 M 98 245 C 96 195, 102 155, 138 72 M 94 165 C 115 128, 152 105, 185 88 M 90 155 C 68 122, 42 108, 12 96"
              stroke="#3E2009"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 92 245 C 94 195, 96 155, 96 115"
              stroke="#5C3416"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />

            {/* Hanging Aerial Roots & Botanical Vines (ঝুলন্ত লতা ও বটের ঝুরি) */}
            <g stroke={isDark ? '#15803D' : '#166534'} strokeWidth="2" opacity="0.75" fill="none">
              <path d="M 38 112 Q 34 155 40 185" />
              <path d="M 52 118 Q 50 148 54 172" />
              <path d="M 155 110 Q 160 148 154 180" />
              <path d="M 168 118 Q 172 145 168 168" />
            </g>

            {/* Layered Lush Emerald & Sunlit Lime Canopy Clouds */}
            <ellipse cx="32" cy="86" rx="72" ry="38" fill={isDark ? '#0D3B26' : '#14532D'} />
            <ellipse cx="178" cy="92" rx="76" ry="40" fill={isDark ? '#0D3B26' : '#14532D'} />
            <ellipse cx="105" cy="64" rx="95" ry="48" fill={isDark ? '#114B30' : '#15803D'} />
            <ellipse cx="55" cy="68" rx="68" ry="36" fill={isDark ? '#155E3B' : '#16A34A'} />
            <ellipse cx="155" cy="72" rx="70" ry="36" fill={isDark ? '#155E3B' : '#16A34A'} />
            <ellipse cx="105" cy="44" rx="78" ry="38" fill={isDark ? '#1B7247' : '#22C55E'} />
            {/* Golden Hour Top Canopy Rim Highlights */}
            <ellipse cx="92" cy="32" rx="55" ry="22" fill={isDark ? '#22C55E' : '#4ADE80'} opacity="0.75" />
            <ellipse cx="145" cy="52" rx="45" ry="18" fill={isDark ? '#22C55E' : '#86EFAC'} opacity="0.55" />

            {/* Blooming Forest Flame / Krishnachura & Golden Fruits Nested in Canopy */}
            <g opacity="0.92">
              {[
                [38, 58, '#F97316'],
                [64, 42, '#FB923C'],
                [98, 28, '#FACC15'],
                [132, 38, '#F97316'],
                [168, 56, '#FB7185'],
                [75, 72, '#FDE047'],
                [142, 76, '#FACC15'],
              ].map(([bx, by, bc], idx) => (
                <g key={idx} transform={`translate(${bx}, ${by})`}>
                  <circle cx="0" cy="0" r="7" fill={bc as string} />
                  <circle cx="6" cy="3" r="5.5" fill={bc as string} opacity="0.85" />
                  <circle cx="-5" cy="4" r="5" fill="#FEF08A" opacity="0.75" />
                </g>
              ))}
            </g>
          </g>

          {/* Lush Tropical Banana Plant Grove (বাম প্রান্তে কলাগাছের ঝাড়) */}
          <g transform="translate(8, 162)">
            <g className="animate-bough-sway">
              {/* Banana Pseudostems */}
              <path d="M 48 125 L 44 45" stroke="#4D7C0F" strokeWidth="9" strokeLinecap="round" />
              <path d="M 68 128 L 74 55" stroke="#65A30D" strokeWidth="7.5" strokeLinecap="round" />
              {/* Broad Arching Tropical Banana Fronds (কলাপাতা) */}
              <path
                d="M 44 48 C 12 18, -28 22, -48 52 C -18 42, 15 44, 44 48 Z"
                fill="#65A30D"
              />
              <path
                d="M 44 45 C 18 2, -18 -8, -42 14 C -12 12, 18 24, 44 45 Z"
                fill="#84CC16"
              />
              <path
                d="M 46 44 C 52 0, 88 -12, 112 12 C 85 12, 62 24, 46 44 Z"
                fill="#4ADE80"
              />
              <path
                d="M 74 56 C 102 28, 138 32, 154 58 C 126 48, 98 48, 74 56 Z"
                fill="#22C55E"
              />
              <path
                d="M 72 54 C 88 22, 122 14, 142 32 C 118 30, 92 38, 72 54 Z"
                fill="#84CC16"
              />
            </g>
          </g>

          {/* Arched Bamboo Garden Trellis Covered in Blooming Bougainvillea on the Left Path */}
          <g transform="translate(225, 168)">
            {/* Bamboo Posts & Woven Arch over the Left Garden Path */}
            <line x1="12" y1="115" x2="12" y2="32" stroke="#854D0E" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="92" y1="115" x2="92" y2="32" stroke="#854D0E" strokeWidth="4.5" strokeLinecap="round" />
            <path
              d="M 6 38 Q 52 -4 98 38"
              fill="none"
              stroke="#A16207"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 10 46 Q 52 6 94 46"
              fill="none"
              stroke="#CA8A04"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Lush Climbing Vines & Cascading Bougainvillea (বাগানবিলাস ফুলের ঝাড়) */}
            <path
              d="M 2 42 C 18 14, 42 4, 58 10 C 76 4, 96 16, 106 42 C 88 46, 72 34, 52 32 C 32 34, 16 46, 2 42 Z"
              fill="#15803D"
            />
            {[
              [12, 34, 9, '#E11D48'],
              [24, 22, 11, '#F43F5E'],
              [38, 14, 10, '#FB7185'],
              [52, 12, 12, '#E11D48'],
              [68, 15, 10, '#F43F5E'],
              [82, 24, 11, '#FB7185'],
              [94, 36, 9, '#E11D48'],
              [14, 52, 7.5, '#F43F5E'],
              [92, 54, 7.5, '#FB7185'],
            ].map(([bx, by, br, bc], idx) => (
              <g key={idx} transform={`translate(${bx}, ${by})`}>
                <circle cx="0" cy="0" r={br as number} fill={bc as string} />
                <circle cx="-2" cy="-2" r={(br as number) * 0.55} fill="#FDA4AF" />
                <circle cx="1" cy="1" r="2" fill="#FEF08A" />
              </g>
            ))}
          </g>

          {/* Traditional Low Woven Bamboo Garden Fence on the Left (বাঁশের নান্দনিক বাগান বেড়া) */}
          <g transform="translate(65, 248)" opacity="0.9">
            <line x1="0" y1="12" x2="145" y2="12" stroke="#A16207" strokeWidth="2.5" />
            <line x1="0" y1="24" x2="145" y2="24" stroke="#854D0E" strokeWidth="2.5" />
            {[0, 18, 36, 54, 72, 90, 108, 126, 144].map((fx) => (
              <line
                key={fx}
                x1={fx}
                y1="2"
                x2={fx}
                y2="34"
                stroke="#CA8A04"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>

        {/* ─── FOREGROUND BOTANICAL FLOWER BEDS, MONSTERAS & LUSH FOLIAGE (ON THE LEFT & BOTTOM) ─── */}
        {/* Far-Left Foreground Botanical Cluster (বামপাশে লেখার নিচে সূর্যমুখী, কচুপাতা ও রঙিন বাগান) */}
        <g id="foreground-garden-left" transform="translate(15, 495)">
          <g className="animate-bough-sway">
            {/* Deep Multi-Layered Botanical Shrubs */}
            <path
              d="M -30 225 C 5 135, 85 115, 145 165 C 185 112, 265 120, 295 225 Z"
              fill={isDark ? '#0D3824' : '#14532D'}
            />
            <path
              d="M 10 230 C 42 150, 112 138, 162 178 C 198 138, 258 148, 282 230 Z"
              fill={isDark ? '#14532D' : '#15803D'}
            />

            {/* Giant Elephant Ear / Taro Leaves (বড় কচু/অ্যালোকাসিয়া পাতা) & Monstera */}
            <g transform="translate(28, 78)">
              <path d="M 45 115 Q 28 75 18 48" stroke="#16A34A" strokeWidth="3.5" fill="none" />
              <path
                d="M 18 48 C -8 32, -12 68, 12 85 C 28 96, 42 82, 36 58 C 32 42, 24 42, 18 48 Z"
                fill="#22C55E"
              />
              <path d="M 52 115 Q 58 68 68 35" stroke="#22C55E" strokeWidth="4" fill="none" />
              <path
                d="M 68 35 C 45 15, 38 55, 58 76 C 74 92, 94 74, 88 46 C 84 28, 75 28, 68 35 Z"
                fill="#4ADE80"
              />
              <path d="M 62 115 Q 88 78 112 56" stroke="#15803D" strokeWidth="3.5" fill="none" />
              <path
                d="M 112 56 C 98 36, 85 65, 98 84 C 110 98, 132 86, 128 64 C 124 48, 118 48, 112 56 Z"
                fill="#86EFAC"
              />
            </g>

            {/* Vibrant Croton / Coleus Foliage Bush (রঙিন পাতাবাহার ঝোপ) */}
            <g transform="translate(175, 122)">
              <path d="M 25 65 C 5 42, 0 18, 14 8 C 28 18, 30 42, 25 65 Z" fill="#E11D48" />
              <path d="M 28 65 C 22 35, 32 10, 48 4 C 54 22, 42 45, 28 65 Z" fill="#F59E0B" />
              <path d="M 32 65 C 45 38, 65 22, 78 18 C 72 38, 52 54, 32 65 Z" fill="#84CC16" />
            </g>

            {/* Cluster of Tall Sunflowers & Golden Marigolds (সূর্যমুখী ও গাঁদা ফুলের বাগান) */}
            {[
              [25, 138, 12],
              [58, 124, 14],
              [94, 134, 11.5],
              [148, 128, 13],
              [184, 142, 11],
            ].map(([sx, sy, sr], idx) => (
              <g key={idx} transform={`translate(${sx}, ${sy})`}>
                <line x1="0" y1="0" x2="0" y2="55" stroke="#16A34A" strokeWidth="3.5" />
                <path d="M 0 28 Q -14 18 -18 26 Q -10 34 0 28 Z" fill="#22C55E" />
                <path d="M 0 36 Q 14 26 18 34 Q 10 42 0 36 Z" fill="#22C55E" />
                <circle cx="0" cy="0" r={sr as number} fill="#FACC15" />
                <circle cx="0" cy="0" r={(sr as number) * 0.68} fill="#F59E0B" />
                <circle cx="0" cy="0" r={(sr as number) * 0.36} fill="#451A03" />
              </g>
            ))}
          </g>
        </g>

        {/* Left-Mid Botanical Flower Garden (বামপাশের পাথরের পথের পাশে গোলাপ, জবা ও ল্যাভেন্ডার বাগান) */}
        <g id="foreground-garden-right" transform="translate(315, 515)">
          <g className="animate-bough-sway">
            {/* Deep Botanical Hedge & Fern Backdrop */}
            <path
              d="M -25 225 C 15 140, 105 122, 165 172 C 215 118, 295 128, 335 225 Z"
              fill={isDark ? '#0B2E1E' : '#14532D'}
            />
            <path
              d="M 10 230 C 48 162, 125 148, 178 188 C 222 145, 285 155, 315 230 Z"
              fill={isDark ? '#11422B' : '#15803D'}
            />

            {/* Spreading Lush Tropical Ferns (ফার্ন ও সবুজ পাতার ঝোপ) */}
            <g transform="translate(15, 118)" fill="#22C55E" opacity="0.9">
              <path d="M 35 75 C 12 48, -8 28, -22 18 C -4 14, 22 35, 35 75 Z" />
              <path d="M 38 75 C 28 42, 24 15, 32 -2 C 44 15, 44 45, 38 75 Z" fill="#4ADE80" />
              <path d="M 42 75 C 55 45, 75 24, 92 14 C 78 35, 58 55, 42 75 Z" />
            </g>

            {/* Tall Lavender, Salvia & Tube-Rose Flower Spikes (রজনীগন্ধা ও ল্যাভেন্ডার স্টিক) */}
            {[22, 42, 62, 82, 215, 235, 255, 275].map((sx, idx) => (
              <g key={sx} transform={`translate(${sx}, ${idx % 2 === 0 ? 96 : 112})`}>
                <line x1="0" y1="15" x2="0" y2="85" stroke="#16A34A" strokeWidth="2.5" />
                <ellipse
                  cx="0"
                  cy="12"
                  rx="5"
                  ry="16"
                  fill={idx % 3 === 0 ? '#F8FAFC' : '#A855F7'}
                />
                <ellipse
                  cx="0"
                  cy="7"
                  rx="3.8"
                  ry="10"
                  fill={idx % 3 === 0 ? '#DCFCE7' : '#C084FC'}
                />
              </g>
            ))}

            {/* Abundant Blooming Rose, Hibiscus & Marigold Cluster (গোলাপ, জবা ও গাঁদা ফুলের সমারোহ) */}
            {[
              [95, 142, '#F43F5E', '#FB7185'],
              [124, 126, '#FACC15', '#FEF08A'],
              [152, 138, '#E11D48', '#FDA4AF'],
              [182, 124, '#F97316', '#FDBA74'],
              [208, 140, '#EC4899', '#F9A8D4'],
              [138, 156, '#F59E0B', '#FDE047'],
              [170, 154, '#F43F5E', '#FDA4AF'],
            ].map(([rx, ry, c1, c2], idx) => (
              <g key={idx} transform={`translate(${rx}, ${ry})`}>
                <line x1="0" y1="6" x2="0" y2="58" stroke="#22C55E" strokeWidth="3" />
                <path d="M 0 28 Q -12 20 -15 26 Q -8 32 0 28 Z" fill="#4ADE80" />
                <circle cx="0" cy="0" r="12.5" fill={c1 as string} />
                <circle cx="-2" cy="-2" r="8" fill={c2 as string} />
                <circle cx="2" cy="2" r="3.5" fill="#FEF08A" opacity="0.85" />
              </g>
            ))}

            {/* Natural Clay Garden Pots Nestled Among the Flowers (মাটির টব) */}
            <g transform="translate(82, 178)">
              <path d="M 0 0 L 34 0 L 29 32 L 5 32 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
              <rect x="-2" y="-4" width="38" height="5" rx="2" fill="#D97706" />
            </g>
            <g transform="translate(152, 184)">
              <path d="M 0 0 L 30 0 L 26 26 L 4 26 Z" fill="#C26A3E" stroke="#7C2D12" strokeWidth="1.5" />
              <rect x="-2" y="-4" width="34" height="5" rx="2" fill="#EA580C" />
            </g>
          </g>
        </g>

        {/* Bottom-Right Tropical Monstera, Areca Fronds & Hibiscus Sanctuary Frame */}
        <g id="foreground-corner-foliage" transform="translate(1120, 510)">
          <path
            d="M 115 250 C 65 185, 38 118, 65 65 C 102 88, 125 155, 115 250 Z"
            fill={isDark ? '#092E1C' : '#14532D'}
          />
          <path
            d="M 155 250 C 98 185, 68 118, 95 62 C 135 84, 160 155, 155 250 Z"
            fill={isDark ? '#0D3B26' : '#15803D'}
          />
          <path
            d="M 182 250 C 150 168, 162 96, 202 52 C 224 98, 210 172, 182 250 Z"
            fill={isDark ? '#14532D' : '#16A34A'}
          />
          <path
            d="M 212 250 C 224 178, 262 122, 308 98 C 294 152, 255 205, 212 250 Z"
            fill={isDark ? '#1E5E3E' : '#22C55E'}
          />
          {/* Tropical Hibiscus & Plumeria Blooms */}
          <circle cx="112" cy="138" r="12" fill="#E11D48" />
          <circle cx="112" cy="138" r="5.5" fill="#FDE047" />
          <circle cx="155" cy="122" r="11.5" fill="#F43F5E" />
          <circle cx="155" cy="122" r="5" fill="#FDE047" />
          <circle cx="212" cy="115" r="10.5" fill="#F59E0B" />
          <circle cx="212" cy="115" r="4.5" fill="#FFFBEB" />
          <circle cx="255" cy="148" r="9.5" fill="#EC4899" />
          <circle cx="255" cy="148" r="4" fill="#FEF08A" />
        </g>

        {/* ─── LAYER 6: BUTTERFLIES & GLOWING POLLEN / FIREFLIES ───────────── */}
        {/* Swallowtail Butterflies Fluttering Over the Lush Garden */}
        <g transform="translate(265, 455)">
          <g className="animate-kid-hop">
            <path
              d="M 0 0 C -12 -14, -22 -6, -10 4 C -18 10, -10 18, 0 6 Z"
              fill={isDark ? '#34D399' : '#F43F5E'}
            />
            <path
              d="M 0 0 C 12 -14, 22 -6, 10 4 C 18 10, 10 18, 0 6 Z"
              fill={isDark ? '#A7F3D0' : '#FB7185'}
            />
          </g>
        </g>
        <g transform="translate(485, 485)">
          <g className="animate-firefly-float">
            <path
              d="M 0 0 C -11 -13, -19 -5, -9 3.5 C -15 9, -9 15, 0 5.5 Z"
              fill="#38BDF8"
            />
            <path
              d="M 0 0 C 11 -13, 19 -5, 9 3.5 C 15 9, 9 15, 0 5.5 Z"
              fill="#BAE6FD"
            />
          </g>
        </g>
        <g transform="translate(745, 525)">
          <g className="animate-firefly-float">
            <path
              d="M 0 0 C -10 -12, -18 -4, -8 3 C -14 8, -8 14, 0 5 Z"
              fill="#FACC15"
            />
            <path
              d="M 0 0 C 10 -12, 18 -4, 8 3 C 14 8, 8 14, 0 5 Z"
              fill="#FEF08A"
            />
          </g>
        </g>

        {/* Glowing Botanical Fireflies / Golden Sunlight Motes */}
        <g id="ambient-glowing-motes" filter="url(#softBloom)">
          {[
            [185, 565, 3.2],
            [365, 515, 2.8],
            [545, 565, 3.6],
            [720, 495, 2.5],
            [885, 580, 3.4],
            [1025, 520, 3.0],
            [1140, 565, 3.5],
            [1265, 490, 2.8],
          ].map(([mx, my, mr], idx) => (
            <g key={idx} transform={`translate(${mx}, ${my})`}>
              <circle
                cx="0"
                cy="0"
                r={mr}
                fill={idx % 2 === 0 ? '#A3E635' : '#FDE047'}
                className={idx % 2 === 0 ? 'animate-firefly-float' : 'animate-firefly-float-delayed'}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Balanced Left Botanical Readability Scrim (Keeps Left Trees Visible & White Text Crisp) */}
      {!compactPreview && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/65 via-stone-950/30 to-transparent lg:from-stone-950/55 lg:via-stone-950/20 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#174D35] via-transparent to-stone-950/30" />
        </>
      )}
    </div>
  );
};
