/**
 * @file LivingTreeStages.tsx
 * @description Master realistic vector art for the 4 botanical lifecycle stages.
 * Features organic textured boughs, botanically shaped small foliage sprigs,
 * and delicate fruits hanging tastefully across the full-width overarching top canopy.
 */

import React from 'react';

const BotanicalDefs: React.FC = () => (
  <defs>
    <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#122B10" />
      <stop offset="50%" stopColor="#1E4419" />
      <stop offset="100%" stopColor="#143212" />
    </linearGradient>
    <radialGradient id="rubyGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#FDA4AF" />
      <stop offset="35%" stopColor="#E11D48" />
      <stop offset="85%" stopColor="#9F1239" />
      <stop offset="100%" stopColor="#881337" />
    </radialGradient>
    <radialGradient id="goldGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#FEF08A" />
      <stop offset="40%" stopColor="#F59E0B" />
      <stop offset="85%" stopColor="#B45309" />
      <stop offset="100%" stopColor="#78350F" />
    </radialGradient>
    {/* Scaled-down delicate ruby pomegranate */}
    <g id="realFruitPom">
      <path d="M0 -10 Q-2 -4 0 0" fill="none" stroke="#166534" strokeWidth="2" />
      <path d="M-1 -5 C-5 -8 -7 -3 -2 -2 Z" fill="#4ADE80" />
      <circle cx="0" cy="13" r="13" fill="url(#rubyGrad)" />
      <ellipse cx="-3" cy="9" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.8" />
      <path d="M-4 26 L-2.5 30 L0 27 L2.5 30 L4 26 Z" fill="#881337" />
    </g>
    {/* Scaled-down delicate golden citrus */}
    <g id="realFruitCitrus">
      <path d="M0 -10 Q2 -4 0 0" fill="none" stroke="#166534" strokeWidth="2" />
      <path d="M1 -5 C5 -8 7 -3 2 -2 Z" fill="#22C55E" />
      <path d="M0 0 C10 5 14 19 6 28 C-1 37 -12 30 -12 16 C-12 6 -5 1 0 0 Z" fill="url(#goldGrad)" />
      <ellipse cx="-2" cy="14" rx="3.5" ry="2" fill="#FEF08A" opacity="0.85" />
    </g>
    {/* Delicate small botanical flower */}
    <g id="realFlower">
      <circle cx="0" cy="-6" r="4" fill="#FEF08A" opacity="0.95" />
      <circle cx="-5" cy="-2" r="4" fill="#FEF08A" opacity="0.95" />
      <circle cx="-3" cy="5" r="4" fill="#FEF08A" opacity="0.95" />
      <circle cx="3" cy="5" r="4" fill="#FEF08A" opacity="0.95" />
      <circle cx="5" cy="-2" r="4" fill="#FEF08A" opacity="0.95" />
      <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
    </g>
    {/* Delicate small botanical leaf sprig */}
    <g id="smallLeafSprig">
      <path d="M0 0 Q6 16 12 32" fill="none" stroke="#166534" strokeWidth="1.5" />
      <path d="M2 6 C-7 4 -9 10 -3 13 C2 11 4 8 2 6 Z" fill="#22C55E" />
      <path d="M5 12 C13 10 15 16 9 19 C5 17 3 14 5 12 Z" fill="#15803D" />
      <path d="M8 20 C0 18 -2 24 4 27 C8 25 10 22 8 20 Z" fill="#4ADE80" />
      <path d="M10 27 C17 25 19 31 13 34 C9 32 8 29 10 27 Z" fill="#16A34A" />
      <path d="M12 32 C13 38 10 41 8 38 C7 35 9 33 12 32 Z" fill="#84CC16" />
    </g>
    {/* Delicate small leaf cluster rosette */}
    <g id="smallLeafCluster">
      <path d="M0 0 C-10 -4 -13 -14 -3 -15 C5 -13 6 -6 0 0 Z" fill="#15803D" />
      <path d="M0 0 C-14 2 -16 11 -8 14 C-2 14 -1 6 0 0 Z" fill="#166534" />
      <path d="M0 0 C9 -6 16 -3 14 5 C11 10 3 6 0 0 Z" fill="#22C55E" />
      <path d="M0 0 C5 8 13 13 14 5 C12 -2 5 2 0 0 Z" fill="#4ADE80" />
      <path d="M0 0 C-4 10 2 16 7 11 C8 6 3 2 0 0 Z" fill="#14532D" />
    </g>
  </defs>
);

export const SeedInSoilStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M0 720 Q400 680 800 730 T1600 710 L1600 900 L0 900 Z" fill="#382415" opacity="0.45" />
    <path d="M0 770 Q450 740 900 780 T1600 760 L1600 900 L0 900 Z" fill="#24160B" opacity="0.6" />
    <g transform="translate(180, 720)">
      <circle cx="0" cy="0" r="65" fill="#A3E635" opacity="0.2" />
      <path d="M0 -42 C-28 -16 -34 22 -16 45 C-2 64 34 56 40 30 C46 8 28 -14 0 -42 Z" fill="#9A7B38" opacity="0.95" />
      <path d="M-2 -38 C-22 -16 -26 18 -12 38 C-2 52 24 46 30 26 C36 8 22 -10 -2 -38 Z" fill="#C5A059" opacity="0.95" />
      <path d="M0 -22 C-10 0 -10 22 0 30" stroke="#5C4214" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M5 45 Q-15 90 -35 140 M18 40 Q38 95 30 145" fill="none" stroke="#855B28" strokeWidth="3" opacity="0.75" />
      <path d="M0 -42 Q-25 -85 -55 -115 Q-15 -110 0 -42 Z" fill="#A3E635" opacity="0.95" />
      <path d="M0 -42 Q25 -90 50 -125 Q20 -115 0 -42 Z" fill="#BEF264" opacity="0.95" />
      <circle cx="-55" cy="-115" r="4.5" fill="#DCFCE7" opacity="0.9" />
    </g>
    <circle cx="120" cy="520" r="5" fill="#A3E635" opacity="0.7" />
    <circle cx="240" cy="380" r="6" fill="#84CC16" opacity="0.75" />
    <circle cx="680" cy="560" r="5" fill="#C5A059" opacity="0.65" />
    <circle cx="1080" cy="480" r="5.5" fill="#A3E635" opacity="0.7" />
    <circle cx="1480" cy="520" r="5.5" fill="#84CC16" opacity="0.7" />
  </svg>
);

export const SproutStemStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <path d="M180 730 Q140 810 90 890 M180 730 Q200 820 180 895 M800 760 Q760 820 720 890 M1420 740 Q1380 810 1350 895" fill="none" stroke="#785925" strokeWidth="3.5" opacity="0.7" />
    {/* Left Side: Climbing Botanical Stem with Small Dainty Leaf Pairs */}
    <g transform="translate(160, 750)">
      <path d="M-6 0 Q-30 -180 -10 -380 Q10 -510 -20 -630 Q-12 -510 -16 -380 Q-38 -180 6 0 Z" fill="#254B1E" opacity="0.9" />
      <path d="M-12 -140 C-45 -155 -60 -130 -35 -115 C-20 -100 -12 -125 -12 -140 Z" fill="#4ADE80" opacity="0.95" />
      <path d="M-12 -140 C25 -155 40 -130 20 -115 C5 -100 -5 -125 -12 -140 Z" fill="#22C55E" opacity="0.9" />
      <path d="M-14 -240 C-50 -260 -65 -235 -38 -220 C-22 -205 -14 -225 -14 -240 Z" fill="#22C55E" opacity="0.95" />
      <path d="M-14 -240 C28 -260 42 -235 22 -220 C7 -205 -5 -225 -14 -240 Z" fill="#16A34A" opacity="0.9" />
      <path d="M-8 -360 C-46 -380 -60 -355 -34 -340 C-18 -325 -8 -345 -8 -360 Z" fill="#4ADE80" opacity="0.95" />
      <path d="M-8 -360 C30 -380 44 -355 24 -340 C8 -325 -1 -345 -8 -360 Z" fill="#22C55E" opacity="0.9" />
      <path d="M5 -480 C-35 -500 -48 -475 -24 -460 C-10 -445 2 -465 5 -480 Z" fill="#84CC16" opacity="0.95" />
      <path d="M5 -480 C40 -500 52 -475 32 -460 C16 -445 5 -465 5 -480 Z" fill="#4ADE80" opacity="0.9" />
      <path d="M-20 -630 C-50 -648 -62 -625 -42 -612 C-26 -598 -18 -618 -20 -630 Z" fill="#BEF264" opacity="0.95" />
      <circle cx="-42" cy="-612" r="4.5" fill="#BAE6FD" opacity="0.9" />
    </g>
    <circle cx="500" cy="380" r="5" fill="#4ADE80" opacity="0.6" />
    <circle cx="950" cy="420" r="5.5" fill="#84CC16" opacity="0.65" />
    <circle cx="1380" cy="360" r="6" fill="#22C55E" opacity="0.65" />
  </svg>
);

export const BranchingTreeStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <path d="M120 820 Q90 520 160 300 Q150 260 170 200 L195 200 Q175 260 180 300 Q145 550 160 820 Z" fill="url(#barkGrad)" opacity="0.92" />
    <path d="M165 240 Q400 130 750 110 T1450 150 Q1100 80 750 85 T175 220 Z" fill="url(#barkGrad)" opacity="0.88" />
    <path d="M750 110 Q950 170 1200 180 Q1050 145 765 110 Z" fill="url(#barkGrad)" opacity="0.85" />
    {/* Dense Canopy Silhouette */}
    <path d="M100 210 Q200 140 320 150 Q460 90 620 110 Q780 70 940 90 Q1120 70 1280 100 Q1440 80 1560 130 L1560 0 L100 0 Z" fill="#15803D" opacity="0.75" />
    <path d="M140 180 Q250 110 380 120 Q520 70 680 90 Q850 50 1020 75 Q1180 50 1360 85 Q1480 75 1580 110 L1580 0 L140 0 Z" fill="#166534" opacity="0.85" />
    {/* Small Leaf Sprigs & Clusters along the ceiling */}
    <use href="#smallLeafCluster" transform="translate(240, 150)" />
    <use href="#smallLeafSprig" transform="translate(340, 160)" />
    <use href="#smallLeafCluster" transform="translate(480, 125)" />
    <use href="#smallLeafSprig" transform="translate(620, 130)" />
    <use href="#smallLeafCluster" transform="translate(760, 115)" />
    <use href="#smallLeafSprig" transform="translate(900, 120)" />
    <use href="#smallLeafCluster" transform="translate(1050, 110)" />
    <use href="#smallLeafSprig" transform="translate(1200, 130)" />
    <use href="#smallLeafCluster" transform="translate(1360, 125)" />
    <use href="#smallLeafSprig" transform="translate(1480, 140)" />
    <use href="#realFlower" transform="translate(390, 150)" />
    <use href="#realFlower" transform="translate(710, 125)" />
    <use href="#realFlower" transform="translate(1120, 120)" />
    <use href="#realFlower" transform="translate(1420, 140)" />
  </svg>
);

export const MatureFruitingTreeStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <path d="M110 820 Q80 500 150 260 Q140 220 160 160 L195 160 Q175 220 180 260 Q145 520 165 820 Z" fill="url(#barkGrad)" opacity="0.95" />
    {/* Overarching Canopy with Gentle Wind Sway */}
    <g className="animate-bough-sway">
      <path d="M155 200 Q400 90 800 80 T1500 120 Q1150 50 800 55 T165 180 Z" fill="url(#barkGrad)" opacity="0.92" />
      <path d="M480 95 Q700 150 950 140 Q750 115 495 95 Z" fill="url(#barkGrad)" opacity="0.88" />
      <path d="M950 140 Q1180 180 1420 170 Q1220 145 960 135 Z" fill="url(#barkGrad)" opacity="0.88" />
      {/* Canopy Base Layers */}
      <path d="M80 220 Q180 130 310 145 Q470 70 640 85 Q820 50 1000 75 Q1180 50 1360 90 Q1480 80 1600 130 L1600 0 L80 0 Z" fill="#064E3B" opacity="0.9" />
      <path d="M120 190 Q240 105 380 115 Q540 55 720 70 Q910 40 1100 65 Q1290 45 1470 85 L1470 0 L120 0 Z" fill="#052E16" opacity="0.93" />
      <path d="M160 175 Q290 90 450 100 Q630 45 810 55 Q1000 35 1190 55 Q1370 40 1540 75 L1540 0 L160 0 Z" fill="#14532D" opacity="0.88" />
      {/* Small Dainty Botanical Leaves along the branches */}
      <use href="#smallLeafCluster" transform="translate(200, 170)" />
      <use href="#smallLeafSprig" transform="translate(270, 180)" />
      <use href="#smallLeafCluster" transform="translate(360, 150)" />
      <use href="#smallLeafSprig" transform="translate(490, 140)" />
      <use href="#smallLeafCluster" transform="translate(580, 125)" />
      <use href="#smallLeafSprig" transform="translate(680, 130)" />
      <use href="#smallLeafCluster" transform="translate(850, 115)" />
      <use href="#smallLeafSprig" transform="translate(960, 125)" />
      <use href="#smallLeafCluster" transform="translate(1060, 120)" />
      <use href="#smallLeafSprig" transform="translate(1220, 135)" />
      <use href="#smallLeafCluster" transform="translate(1330, 130)" />
      <use href="#smallLeafSprig" transform="translate(1470, 145)" />
      {/* Tastefully Reduced Fruits: Only 4 delicate fruits total across ceiling */}
      <g className="animate-fruit-sway"><use href="#realFruitPom" transform="translate(420, 140)" /></g>
      <g className="animate-fruit-sway-delayed"><use href="#realFruitCitrus" transform="translate(780, 125)" /></g>
      <g className="animate-fruit-sway"><use href="#realFruitPom" transform="translate(1140, 135)" /></g>
      <g className="animate-fruit-sway-delayed"><use href="#realFruitCitrus" transform="translate(1410, 155)" /></g>
      {/* Delicate Blossoms */}
      <use href="#realFlower" transform="translate(290, 160)" />
      <use href="#realFlower" transform="translate(630, 120)" />
      <use href="#realFlower" transform="translate(990, 110)" />
      <use href="#realFlower" transform="translate(1280, 130)" />
    </g>
  </svg>
);
