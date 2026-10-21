/**
 * @file GardenVillageHaven.tsx
 * @description The rural haven on the right bank: grounded cottage, Krishan, Krishani, children and delivered plants.
 */

import React from 'react';

interface GardenVillageHavenProps {
  isDark?: boolean;
  className?: string;
}

export const GardenVillageHaven: React.FC<GardenVillageHavenProps> = ({
  isDark = false,
  className = '',
}) => {
  return (
    <g
      id="village-haven-group"
      transform="translate(940, 100)"
      className={`select-none ${className}`}
    >
      {/* Soft Ambient House Glow in Dark Mode */}
      {isDark && (
        <circle cx="260" cy="110" r="70" fill="#F59E0B" opacity="0.12" />
      )}

      {/* Tall Banana & Areca Palm Trees Behind Cottage */}
      <g id="village-trees" transform="translate(300, 168)">
        <path d="M 0 0 Q 5 -50 0 -95" stroke="#15803D" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 0 -95 Q -30 -115 -50 -95 Q -30 -85 0 -95 Z" fill="#22C55E" />
        <path d="M 0 -95 Q 25 -125 45 -105 Q 25 -90 0 -95 Z" fill="#16A34A" />
        <path d="M 0 -95 Q -10 -130 5 -140 Q 5 -115 0 -95 Z" fill="#4ADE80" />

        <path d="M 35 0 Q 42 -65 38 -125" stroke="#78350F" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 38 -125 Q 15 -145 -5 -135" stroke="#15803D" strokeWidth="3" fill="none" />
        <path d="M 38 -125 Q 60 -150 80 -140" stroke="#16A34A" strokeWidth="3" fill="none" />
        <path d="M 38 -125 Q 40 -160 45 -165" stroke="#22C55E" strokeWidth="3" fill="none" />
      </g>

      {/* Traditional Rural Cottage (Base grounded firmly at y: 168) */}
      <g id="cottage-structure" transform="translate(180, 78)">
        <rect x="20" y="38" width="125" height="52" fill="#D97706" stroke="#92400E" strokeWidth="2" rx="2" />
        <rect x="22" y="40" width="121" height="48" fill="#FBBF24" opacity="0.25" />

        <polygon points="5,38 82,2 160,38" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
        <polygon points="12,37 82,6 153,37" fill="#92400E" />

        {/* Bottle Gourd Trellis on Roof (লাউয়ের মাচা) */}
        <path d="M 25 34 Q 55 14 95 20 Q 125 24 145 36" stroke="#22C55E" strokeWidth="2" fill="none" />
        <circle cx="60" cy="22" r="4" fill="#4ADE80" />
        <circle cx="85" cy="24" r="5" fill="#22C55E" />
        <ellipse cx="112" cy="28" rx="4" ry="7" fill="#86EFAC" />

        <rect x="80" y="50" width="24" height="40" rx="1.5" fill="#451A03" />
        <rect x="36" y="50" width="22" height="20" rx="1.5" fill={isDark ? '#F59E0B' : '#FEF08A'} stroke="#78350F" strokeWidth="1.5" />
      </g>

      {/* Yard Fence */}
      <line x1="160" y1="162" x2="195" y2="162" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
      <line x1="170" y1="154" x2="170" y2="168" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
      <line x1="185" y1="154" x2="185" y2="168" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />

      {/* Unloaded Fresh Plants in the Yard (Grounded at y: 168 in front of Krishani & Krishan) */}
      {/* Unloaded Fresh Plants in the Yard (Firmly on the ground at y: 168) */}
      <g id="unloaded-plants" transform="translate(30, 142)">
        <g className="animate-plant-unload">
          <rect x="0" y="10" width="18" height="16" rx="2" fill="#C26A3E" stroke="#7C2D12" strokeWidth="1" />
          <path d="M 9 10 Q 0 0 -2 -6 Q 7 -2 9 10 Z" fill="#22C55E" />
          <path d="M 9 10 Q 18 0 20 -6 Q 11 -2 9 10 Z" fill="#15803D" />

          <rect x="22" y="12" width="16" height="14" rx="1.5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <circle cx="30" cy="5" r="5" fill="#F59E0B" />
          <circle cx="30" cy="5" r="2.2" fill="#78350F" />
          {/* Celebratory Star Sparkle */}
          <circle cx="42" cy="-2" r="2.5" fill="#FDE047" opacity="0.95" />
          <path d="M 4 2 Q 2 -2 5 -3 Q 7 -1 4 2 Z" fill="#4ADE80" />
        </g>
      </g>

      {/* Krishan (কৃষক - পা মাটিতে y: 168 তে দৃঢ়ভাবে স্থাপিত, হাত নেড়ে হাসিমুখে স্বাগত জানাচ্ছেন) */}
      <g id="krishan" transform="translate(70, 114)">
        <circle cx="16" cy="10" r="5.5" fill="#FBBF24" />
        <polygon points="4,10 16,1 28,10" fill="#D97706" stroke="#78350F" strokeWidth="1" />
        <path d="M 9 16 L 23 16 L 25 36 L 7 36 Z" fill="#0284C7" />
        <path d="M 10 16 Q 16 25 18 34" stroke="#DC2626" strokeWidth="2.5" fill="none" />
        {/* Animated Waving Hand */}
        <path
          d="M 9 20 L -2 12 L -6 6"
          stroke="#FBBF24"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-farmer-wave"
        />
        <path d="M 23 20 L 30 26" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        {/* Lungi touches ground at y: 54 in local -> 114 + 54 = 168! */}
        <rect x="7" y="36" width="18" height="18" fill="#0D9488" rx="1" />
      </g>

      {/* Krishani (কৃষাণী - পা মাটিতে y: 168 তে স্থাপিত, লাল পেড়ে সবুজ শাড়িতে চারাগাছ গ্রহণের মুভমেন্ট) */}
      <g id="krishani" transform="translate(112, 114)">
        <g className="animate-krishani-welcome">
          <circle cx="14" cy="9" r="5" fill="#FBBF24" />
          <circle cx="19" cy="8" r="3" fill="#1C1917" />
          <path d="M 8 15 L 20 15 L 24 54 L 4 54 Z" fill="#15803D" />
          <path d="M 8 15 L 18 35 L 20 54" stroke="#DC2626" strokeWidth="2.5" fill="none" />
          <path d="M 4 54 L 24 54" stroke="#DC2626" strokeWidth="2" />
          {/* Open welcoming arms */}
          <path d="M 8 18 L -6 20 L -10 18" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 20 18 L 26 24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* Playing Children in the Cottage Yard (বাচ্চারা খেলবে - গ্রামীণ আনন্দের ভাইব) */}
      {/* Child 1: Boy Running with Soaring Kite */}
      <g id="child-kite" transform="translate(225, 134)">
        <circle cx="10" cy="8" r="4" fill="#FBBF24" />
        <rect x="6" y="12" width="8" height="12" rx="2" fill="#EA580C" />
        <line x1="8" y1="24" x2="4" y2="34" stroke="#0284C7" strokeWidth="2" />
        <line x1="12" y1="24" x2="18" y2="34" stroke="#0284C7" strokeWidth="2" />
        <path d="M 12 15 L 18 8" stroke="#FBBF24" strokeWidth="1.8" />
        <path d="M 18 8 Q 28 -20 40 -45" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
        {/* Soaring Diamond Kite in the Sky */}
        <g transform="translate(40, -45)" className="animate-kite-soar">
          <polygon points="0,-12 9,0 0,12 -9,0" fill="#EF4444" stroke="#FACC15" strokeWidth="1.2" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#FACC15" strokeWidth="1" />
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#FACC15" strokeWidth="1" />
          <path d="M 0 12 Q 5 20 2 28" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
        </g>
      </g>

      {/* Child 2: Little Girl Hopping Joyfully near the Porch */}
      <g id="child-girl" transform="translate(275, 138)" className="animate-kid-hop">
        <circle cx="8" cy="6" r="3.5" fill="#FBBF24" />
        <circle cx="11" cy="5" r="2" fill="#1C1917" />
        <polygon points="4,10 12,10 16,24 0,24" fill="#EAB308" />
        <line x1="5" y1="24" x2="4" y2="30" stroke="#78350F" strokeWidth="1.5" />
        <line x1="11" y1="24" x2="14" y2="30" stroke="#78350F" strokeWidth="1.5" />
        <path d="M 4 13 L -2 8" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 12 13 L 18 8" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
};
