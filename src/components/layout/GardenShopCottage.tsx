/**
 * @file GardenShopCottage.tsx
 * @description The GardenValy boutique botanical plant shop cottage on the left bank of the valley.
 */

import React from 'react';

interface GardenShopCottageProps {
  isDark?: boolean;
  className?: string;
}

export const GardenShopCottage: React.FC<GardenShopCottageProps> = ({
  isDark = false,
  className = '',
}) => {
  return (
    <g
      id="shop-cottage-group"
      transform="translate(5, 114)"
      className={`select-none ${className}`}
    >
      {/* Foundation & Stone Base (Rests on road line at y: 154) */}
      <rect x="25" y="144" width="170" height="10" rx="2" fill="#292524" />
      <rect x="28" y="146" width="164" height="6" rx="1" fill="#44403C" />

      {/* Cottage Main Wooden Wall */}
      <rect
        x="35"
        y="72"
        width="150"
        height="72"
        fill="#78350F"
        stroke="#451A03"
        strokeWidth="2.5"
      />
      {/* Horizontal Planks */}
      <line x1="35" y1="90" x2="185" y2="90" stroke="#451A03" strokeWidth="1.2" opacity="0.6" />
      <line x1="35" y1="108" x2="185" y2="108" stroke="#451A03" strokeWidth="1.2" opacity="0.6" />
      <line x1="35" y1="126" x2="185" y2="126" stroke="#451A03" strokeWidth="1.2" opacity="0.6" />

      {/* Main Shop Slanted Roof with Green Shingles */}
      <polygon
        points="15,74 110,22 205,74"
        fill="#14532D"
        stroke="#052E16"
        strokeWidth="3"
      />
      <polygon points="26,72 110,27 194,72" fill="#166534" />
      {/* Roof Ridge & Finial */}
      <line x1="110" y1="14" x2="110" y2="24" stroke="#C5A059" strokeWidth="3" strokeLinecap="round" />
      <circle cx="110" cy="13" r="3.5" fill="#F59E0B" />

      {/* Striped Canopy / Awning over Front Display */}
      <polygon points="40,82 135,82 142,94 33,94" fill="#15803D" />
      <polygon points="52,82 72,82 68,94 48,94" fill="#F7F5EC" />
      <polygon points="88,82 108,82 104,94 84,94" fill="#F7F5EC" />
      <polygon points="124,82 135,82 131,94 120,94" fill="#F7F5EC" />

      {/* Prominent Hanging Signboard: "GardenValy" */}
      <g id="shop-signboard" transform="translate(42, 42)">
        <line x1="16" y1="-8" x2="16" y2="2" stroke="#A8A29E" strokeWidth="1.5" />
        <line x1="90" y1="-8" x2="90" y2="2" stroke="#A8A29E" strokeWidth="1.5" />
        <rect
          x="4"
          y="2"
          width="98"
          height="26"
          rx="4"
          fill="#451A03"
          stroke="#C5A059"
          strokeWidth="2"
        />
        <rect x="7" y="5" width="92" height="20" rx="2" fill="#1E5E3A" />
        <path d="M 14 15 C 14 10 20 8 23 15 C 20 18 16 18 14 15 Z" fill="#4ADE80" />
        <text
          x="59"
          y="19"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="bold"
          letterSpacing="0.8"
          fill="#FEF08A"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          GardenValy
        </text>
      </g>

      {/* Shop Window with Warm Illumination */}
      <rect
        x="50"
        y="102"
        width="40"
        height="32"
        rx="3"
        fill={isDark ? '#F59E0B' : '#FEF08A'}
        stroke="#451A03"
        strokeWidth="2"
        opacity="0.95"
      />
      <line x1="70" y1="102" x2="70" y2="134" stroke="#451A03" strokeWidth="1.8" />
      <line x1="50" y1="118" x2="90" y2="118" stroke="#451A03" strokeWidth="1.8" />
      <circle cx="70" cy="125" r="4.5" fill="#15803D" />

      {/* Shop Front Door */}
      <rect x="105" y="96" width="34" height="48" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="2" />
      <circle cx="132" cy="122" r="2" fill="#FBBF24" />

      {/* Right Porch: Plant Display Shelves (Where plants load onto the van) */}
      <g id="shop-plant-stands" transform="translate(145, 96)">
        <rect x="0" y="32" width="42" height="4" fill="#58310C" />
        <rect x="6" y="18" width="34" height="4" fill="#58310C" />
        <line x1="8" y1="18" x2="8" y2="48" stroke="#451A03" strokeWidth="2.5" />
        <line x1="36" y1="18" x2="36" y2="48" stroke="#451A03" strokeWidth="2.5" />

        {/* Pots on Shelf */}
        <rect x="10" y="8" width="10" height="10" rx="1" fill="#C26A3E" />
        <circle cx="15" cy="4" r="3.5" fill="#F59E0B" />
        <circle cx="15" cy="4" r="1.5" fill="#78350F" />
        <rect x="25" y="9" width="9" height="9" rx="1" fill="#B45309" />
        <circle cx="29.5" cy="5" r="3" fill="#EC4899" />

        <rect x="2" y="24" width="12" height="8" rx="1" fill="#C26A3E" />
        <path d="M 8 24 Q 2 16 0 12 Q 8 16 8 24 Z" fill="#22C55E" />
        <path d="M 8 24 Q 14 16 16 12 Q 10 16 8 24 Z" fill="#16A34A" />

        <rect x="18" y="23" width="14" height="9" rx="1" fill="#9A3412" />
        <circle cx="23" cy="18" r="3" fill="#E11D48" />
        <circle cx="28" cy="19" r="2.5" fill="#F43F5E" />
      </g>

      {/* Hanging Floral Basket */}
      <line x1="135" y1="84" x2="135" y2="98" stroke="#78716C" strokeWidth="1" />
      <ellipse cx="135" cy="99" rx="6" ry="3" fill="#78350F" />
      <circle cx="133" cy="97" r="2.5" fill="#F43F5E" />
      <circle cx="137" cy="97" r="2.5" fill="#FACC15" />

      {/* Vintage Wall Lantern */}
      <rect x="40" y="98" width="4" height="10" fill="#1C1917" />
      <circle cx="42" cy="104" r="3.5" fill={isDark ? '#F59E0B' : '#FEF08A'} opacity={isDark ? 0.95 : 0.8} />
    </g>
  );
};
