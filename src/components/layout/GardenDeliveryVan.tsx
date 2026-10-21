/**
 * @file GardenDeliveryVan.tsx
 * @description Eco botanical delivery van with plant loading/unloading cargo and synchronized wheels.
 */

import React from 'react';

interface GardenDeliveryVanProps {
  isDark?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GardenDeliveryVan: React.FC<GardenDeliveryVanProps> = ({
  isDark = false,
  className = '',
  onClick,
}) => {
  return (
    <g
      id="story-delivery-van"
      onClick={onClick}
      className={`cursor-pointer select-none ${className}`}
    >
      {/* Headlight beam */}
      <polygon
        points="195,50 255,36 255,68 195,58"
        fill={isDark ? 'url(#vanNightBeam)' : 'url(#vanDayBeam)'}
        opacity={isDark ? 0.8 : 0.45}
      />

      {/* Cargo Bed Content: Fresh Potted Plants that load at Shop and unload at Village */}
      <g id="van-cargo" transform="translate(18, -4)" className="animate-plant-load">
        {/* Terracotta Plant Pot 1 with Monstera */}
        <rect x="15" y="32" width="22" height="18" rx="2" fill="#C26A3E" stroke="#7C2D12" strokeWidth="1" />
        <path d="M 26 28 C 22 18 10 16 8 8 C 16 10 24 18 26 28 Z" fill="#2D6A4F" />
        <path d="M 26 28 C 28 16 38 12 42 6 C 38 12 32 20 26 28 Z" fill="#40916C" />
        <path d="M 26 28 C 24 12 26 6 27 2 C 28 8 28 18 26 28 Z" fill="#52B788" />

        {/* Terracotta Plant Pot 2 with Blooming Sunflower */}
        <rect x="42" y="30" width="20" height="20" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        <circle cx="54" cy="8" r="4.5" fill="#78350F" />
        <circle cx="50" cy="8" r="2.5" fill="#F59E0B" />
        <circle cx="58" cy="8" r="2.5" fill="#F59E0B" />
        <circle cx="54" cy="4" r="2.5" fill="#FBBF24" />
        <circle cx="54" cy="12" r="2.5" fill="#F59E0B" />

        {/* Seedling Sprout in Wooden Crate */}
        <rect x="66" y="34" width="22" height="16" rx="1.5" fill="#854D0E" stroke="#58310C" strokeWidth="1" />
        <ellipse cx="69" cy="17" rx="4" ry="2.5" transform="rotate(-30 69 17)" fill="#4ADE80" />
        <ellipse cx="78" cy="22" rx="3.5" ry="2" transform="rotate(25 78 22)" fill="#86EFAC" />
      </g>

      {/* Cargo Bed Side Rails (Wooden Planks) */}
      <rect x="22" y="44" width="82" height="24" rx="3" fill="#854D0E" stroke="#58310C" strokeWidth="1.5" />
      <line x1="24" y1="52" x2="102" y2="52" stroke="#58310C" strokeWidth="1.2" />
      <line x1="24" y1="60" x2="102" y2="60" stroke="#58310C" strokeWidth="1.2" />
      <rect x="42" y="44" width="4" height="24" fill="#58310C" />
      <rect x="68" y="44" width="4" height="24" fill="#58310C" />
      <rect x="92" y="44" width="4" height="24" fill="#58310C" />

      {/* Main Vehicle Chassis & Driver Cabin */}
      <path
        d="M 98 40 L 140 40 L 165 54 L 195 58 C 199 59 202 63 202 68 L 202 78 C 202 81 199 84 195 84 L 22 84 C 18 84 15 81 15 78 L 15 64 C 15 61 18 58 22 58 L 98 58 Z"
        fill="#14532D"
        stroke="#052E16"
        strokeWidth="2"
      />

      {/* Cabin Roof & Windshield */}
      <path d="M 136 42 L 162 54 L 142 54 L 122 54 Z" fill="#F7F5EC" />
      <path d="M 138 44 L 160 54 L 140 54 L 126 54 Z" fill={isDark ? '#1E293B' : '#BAE6FD'} opacity="0.85" />
      {/* Driver Silhouette with Straw Hat */}
      <circle cx="132" cy="49" r="4" fill="#E2E8F0" />
      <ellipse cx="132" cy="46" rx="7" ry="2" fill="#D97706" />

      {/* Front Bumper & Headlight */}
      <rect x="198" y="74" width="8" height="6" rx="2" fill="#94A3B8" />
      <circle cx="199" cy="64" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

      {/* Door Branding: GardenValy */}
      <rect x="110" y="62" width="38" height="15" rx="3" fill="#052E16" />
      <text
        x="129"
        y="73"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#C5A059"
        letterSpacing="0.4"
        fontFamily="system-ui"
      >
        GARDENVALY
      </text>

      {/* Wheel 1: Rear Wheel (Synchronized spinning - stops while parked!) */}
      <g transform="translate(52, 84)">
        <circle cx="0" cy="0" r="14" fill="#1C1917" />
        <circle cx="0" cy="0" r="9" fill="#E2E8F0" />
        <g className="animate-story-wheel">
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#64748B" strokeWidth="1.8" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="#64748B" strokeWidth="1.8" />
          <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5" stroke="#64748B" strokeWidth="1.5" />
          <line x1="-6.5" y1="6.5" x2="6.5" y2="-6.5" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#174D35" />
          <circle cx="0" cy="0" r="1.5" fill="#C5A059" />
        </g>
      </g>

      {/* Wheel 2: Front Wheel (Synchronized spinning - stops while parked!) */}
      <g transform="translate(172, 84)">
        <circle cx="0" cy="0" r="14" fill="#1C1917" />
        <circle cx="0" cy="0" r="9" fill="#E2E8F0" />
        <g className="animate-story-wheel">
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#64748B" strokeWidth="1.8" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="#64748B" strokeWidth="1.8" />
          <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5" stroke="#64748B" strokeWidth="1.5" />
          <line x1="-6.5" y1="6.5" x2="6.5" y2="-6.5" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#174D35" />
          <circle cx="0" cy="0" r="1.5" fill="#C5A059" />
        </g>
      </g>

      {/* Trailing Eco Leaf Puffs */}
      <g opacity="0.8">
        <circle cx="8" cy="76" r="2.5" fill="#86EFAC" />
        <circle cx="2" cy="70" r="2" fill="#4ADE80" />
        <path d="M 5 72 Q 3 67 7 65 Q 9 70 5 72 Z" fill="#22C55E" />
      </g>

      <defs>
        <linearGradient id="vanDayBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vanNightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  );
};
