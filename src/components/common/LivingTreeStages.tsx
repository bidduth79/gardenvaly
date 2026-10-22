/**
 * @file LivingTreeStages.tsx
 * @description Classic Adobe Illustrator vector tree art across 4 lifecycle stages,
 * modeled directly after the reference illustration:
 * - Solid sculpted woody-brown trunk with bark grain lines, side spur, and multi-forked branches
 * - 4-tone scalloped bushy foliage clusters (deep forest, rich green, apple green, sunlit lime)
 * - Organic leaf dapple spots inside each foliage cluster
 * - Zero background light circles, zero sunbeams, and zero X-ray overlapping translucency
 */

import React from 'react';

const BotanicalDefs: React.FC = () => (
  <defs>
    {/* Solid Woody Trunk Base Gradient */}
    <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#6E421C" />
      <stop offset="55%" stopColor="#8C5828" />
      <stop offset="100%" stopColor="#5A3414" />
    </linearGradient>

    {/* Warm Sunlit Bark Highlight Gradient */}
    <linearGradient id="barkHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#B57C42" />
      <stop offset="100%" stopColor="#8C5828" />
    </linearGradient>

    {/* Crisp Ruby Fruit Gradient */}
    <radialGradient id="rubyGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#FDA4AF" />
      <stop offset="40%" stopColor="#E11D48" />
      <stop offset="100%" stopColor="#9F1239" />
    </radialGradient>

    {/* Crisp Golden Citrus Fruit Gradient */}
    <radialGradient id="goldGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#FEF08A" />
      <stop offset="45%" stopColor="#F59E0B" />
      <stop offset="100%" stopColor="#D97706" />
    </radialGradient>

    {/* 1. Deep Forest Green Scalloped Bush Cluster (Back/Shadow Layer) */}
    <g id="bushDeepGreen">
      <path
        d="M-75 10 C-88 -5 -82 -28 -64 -34 C-66 -54 -44 -68 -24 -58 C-12 -74 16 -74 28 -58 C48 -68 70 -52 66 -32 C84 -24 88 -2 72 12 C80 28 64 44 46 40 C34 54 6 54 -6 42 C-26 52 -52 46 -58 28 C-74 30 -82 18 -75 10 Z"
        fill="#1E6B24"
      />
      {/* Organic Dapple Spots */}
      <circle cx="-42" cy="-18" r="6" fill="#2B842E" />
      <circle cx="-26" cy="-32" r="4.5" fill="#2B842E" />
      <circle cx="18" cy="-24" r="7" fill="#16531B" />
      <circle cx="42" cy="-6" r="5" fill="#2B842E" />
      <circle cx="-15" cy="14" r="6.5" fill="#16531B" />
      <circle cx="24" cy="16" r="4" fill="#2B842E" />
    </g>

    {/* 2. Medium Rich Green Scalloped Bush Cluster (Mid-Back Layer) */}
    <g id="bushMidGreen">
      {/* Subtle Layer Drop Shadow */}
      <path
        d="M-82 16 C-96 0 -88 -26 -68 -34 C-70 -56 -46 -72 -24 -60 C-10 -78 20 -78 32 -60 C54 -70 76 -52 72 -30 C90 -22 94 2 76 16 C84 34 66 50 48 44 C34 58 6 58 -8 46 C-30 56 -56 50 -64 32 C-80 34 -88 24 -82 16 Z"
        fill="#154D1A"
        opacity="0.35"
        transform="translate(4, 7)"
      />
      <path
        d="M-82 16 C-96 0 -88 -26 -68 -34 C-70 -56 -46 -72 -24 -60 C-10 -78 20 -78 32 -60 C54 -70 76 -52 72 -30 C90 -22 94 2 76 16 C84 34 66 50 48 44 C34 58 6 58 -8 46 C-30 56 -56 50 -64 32 C-80 34 -88 24 -82 16 Z"
        fill="#3B9C29"
      />
      {/* Organic Dapple Spots */}
      <circle cx="-48" cy="-14" r="7" fill="#52B634" />
      <circle cx="-30" cy="-34" r="5" fill="#52B634" />
      <circle cx="-8" cy="-42" r="8" fill="#2A7B1E" />
      <circle cx="22" cy="-28" r="6.5" fill="#52B634" />
      <circle cx="48" cy="-10" r="5.5" fill="#2A7B1E" />
      <circle cx="-22" cy="18" r="7.5" fill="#2A7B1E" />
      <circle cx="14" cy="20" r="6" fill="#52B634" />
      <circle cx="38" cy="18" r="4.5" fill="#52B634" />
    </g>

    {/* 3. Vibrant Apple-Lime Green Scalloped Bush Cluster (Mid-Front Layer) */}
    <g id="bushBrightGreen">
      {/* Subtle Layer Drop Shadow */}
      <path
        d="M-70 12 C-84 -4 -76 -26 -58 -32 C-60 -52 -38 -66 -18 -56 C-6 -72 20 -72 30 -54 C50 -64 70 -48 66 -28 C82 -20 86 2 70 14 C76 30 60 44 42 40 C30 52 4 52 -8 40 C-26 50 -50 44 -56 26 C-70 28 -76 18 -70 12 Z"
        fill="#246A1D"
        opacity="0.3"
        transform="translate(3, 6)"
      />
      <path
        d="M-70 12 C-84 -4 -76 -26 -58 -32 C-60 -52 -38 -66 -18 -56 C-6 -72 20 -72 30 -54 C50 -64 70 -48 66 -28 C82 -20 86 2 70 14 C76 30 60 44 42 40 C30 52 4 52 -8 40 C-26 50 -50 44 -56 26 C-70 28 -76 18 -70 12 Z"
        fill="#72C130"
      />
      {/* Organic Dapple Spots */}
      <circle cx="-38" cy="-16" r="6.5" fill="#92D642" />
      <circle cx="-18" cy="-34" r="5" fill="#92D642" />
      <circle cx="12" cy="-36" r="7" fill="#54A222" />
      <circle cx="36" cy="-16" r="6" fill="#92D642" />
      <circle cx="-14" cy="12" r="7.5" fill="#54A222" />
      <circle cx="20" cy="14" r="5.5" fill="#92D642" />
      <circle cx="44" cy="8" r="4" fill="#54A222" />
    </g>

    {/* 4. Sunlit Yellow-Green Crown Highlight Cluster (Top-Front Layer) */}
    <g id="bushSunlitLime">
      {/* Subtle Layer Drop Shadow */}
      <path
        d="M-64 10 C-76 -4 -70 -24 -52 -30 C-54 -48 -34 -62 -16 -52 C-4 -66 18 -66 28 -50 C46 -58 64 -44 60 -26 C74 -18 78 2 62 12 C68 26 54 40 38 36 C26 48 4 48 -6 36 C-24 46 -46 40 -50 24 C-64 26 -70 16 -64 10 Z"
        fill="#488E1E"
        opacity="0.3"
        transform="translate(3, 5)"
      />
      <path
        d="M-64 10 C-76 -4 -70 -24 -52 -30 C-54 -48 -34 -62 -16 -52 C-4 -66 18 -66 28 -50 C46 -58 64 -44 60 -26 C74 -18 78 2 62 12 C68 26 54 40 38 36 C26 48 4 48 -6 36 C-24 46 -46 40 -50 24 C-64 26 -70 16 -64 10 Z"
        fill="#B4E046"
      />
      {/* Bright Yellow-Lime Dapple Spots */}
      <circle cx="-32" cy="-14" r="6" fill="#D2F266" />
      <circle cx="-12" cy="-30" r="7.5" fill="#D2F266" />
      <circle cx="16" cy="-26" r="5.5" fill="#94C632" />
      <circle cx="34" cy="-10" r="6.5" fill="#D2F266" />
      <circle cx="-10" cy="10" r="6" fill="#94C632" />
      <circle cx="18" cy="12" r="7" fill="#D2F266" />
    </g>

    {/* Crisp Botanical Blossom (No Glow Halo) */}
    <g id="realFlower">
      <circle cx="0" cy="-6" r="4" fill="#FEF08A" />
      <circle cx="-5.5" cy="-2" r="4" fill="#FEF08A" />
      <circle cx="-3.5" cy="5" r="4" fill="#FEF08A" />
      <circle cx="3.5" cy="5" r="4" fill="#FEF08A" />
      <circle cx="5.5" cy="-2" r="4" fill="#FEF08A" />
      <circle cx="0" cy="0" r="2.8" fill="#D97706" />
    </g>

    {/* Crisp Ruby Pomegranate Fruit */}
    <g id="realFruitPom">
      <path d="M0 -10 Q-2 -4 0 0" fill="none" stroke="#4A2A10" strokeWidth="1.8" />
      <circle cx="0" cy="10" r="10.5" fill="url(#rubyGrad)" />
      <ellipse cx="-3" cy="6.5" rx="2.8" ry="1.6" fill="#FFE4E6" />
      <path d="M-3.5 20 L-2 23.5 L0 21 L2 23.5 L3.5 20 Z" fill="#881337" />
    </g>

    {/* Crisp Golden Citrus Fruit */}
    <g id="realFruitCitrus">
      <path d="M0 -10 Q2 -4 0 0" fill="none" stroke="#4A2A10" strokeWidth="1.8" />
      <path d="M0 0 C8 4 11 15 4.5 22 C-1 28 -9.5 23 -9.5 13 C-9.5 5 -3.5 1 0 0 Z" fill="url(#goldGrad)" />
      <ellipse cx="-2" cy="10" rx="2.5" ry="1.5" fill="#FEF9C3" />
    </g>
  </defs>
);

/**
 * Reusable Master Woody Trunk & Multi-Forked Branches (modeled after image_92e48c27.png)
 */
const IllustratedWoodyTrunk: React.FC = () => (
  <g>
    {/* Ground Base Root Flare */}
    <path
      d="M148 865 C154 820 152 765 148 715 C144 670 154 630 164 595 C172 565 162 515 148 465 L162 465 C178 515 186 560 180 598 C196 565 218 538 238 515 L258 518 C232 550 202 585 188 632 C178 665 178 705 182 740 C190 718 202 698 214 682 C206 708 196 732 190 755 C192 795 204 835 218 865 C208 868 198 862 192 866 C184 862 176 868 168 864 C160 868 154 862 148 865 Z"
      fill="url(#barkGrad)"
    />

    {/* Far-Left Curving Branch (Supports Left Canopy) */}
    <path
      d="M150 472 C132 415 112 365 78 320 C58 295 36 282 14 275 L22 264 C48 272 72 288 94 316 C126 358 146 410 162 468 Z"
      fill="url(#barkGrad)"
    />

    {/* Center-Left Forking Branch */}
    <path
      d="M235 522 C212 482 195 435 178 372 C168 335 154 300 136 272 L148 266 C168 295 182 332 194 370 C204 405 216 442 232 472 C230 438 238 402 254 372 L266 378 C250 408 244 445 248 485 Z"
      fill="url(#barkGrad)"
    />

    {/* Center-Right S-Curve Branch with Y-Fork */}
    <path
      d="M236 520 C248 488 232 455 244 425 C256 395 282 378 296 342 C306 315 308 282 316 252 L330 255 C322 282 320 312 312 338 C332 315 352 285 368 252 L382 256 C362 295 338 330 308 358 C292 388 268 405 258 432 C250 456 266 485 254 522 Z"
      fill="url(#barkGrad)"
    />

    {/* Long Sweeping Rightward Main Bough (Signature Feature of Reference Image) */}
    <path
      d="M242 525 C295 492 342 442 388 378 C422 330 452 295 495 275 C535 258 582 255 628 282 L620 294 C578 270 535 272 498 290 C458 310 430 345 398 392 C352 458 302 512 248 545 Z"
      fill="url(#barkGrad)"
    />

    {/* Upper-Right Peeking Branch Fork (Visible inside Right Canopy) */}
    <path
      d="M510 245 C542 228 575 202 602 175 L612 182 C588 206 562 226 538 240 C568 242 598 244 626 238 L628 248 C592 256 552 255 512 252 Z"
      fill="url(#barkHighlight)"
    />

    {/* Warm Sunlit Inner Bark Highlight Strips */}
    <path
      d="M170 845 C172 780 166 710 176 645 C186 590 218 548 248 518 C302 482 350 430 392 372 C424 328 455 294 492 276"
      fill="none"
      stroke="url(#barkHighlight)"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Crisp Dark Brown Illustrator Wood-Grain Texture Lines */}
    <path
      d="M160 855 C164 795 158 730 160 675 M176 858 C178 805 174 750 180 700 M194 855 C188 810 184 765 196 720 M168 625 C176 580 198 545 228 515 M265 512 C312 475 355 425 394 370 M248 495 C240 460 248 430 272 402 M156 460 C138 408 118 360 88 320"
      fill="none"
      stroke="#4A2A10"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </g>
);

/**
 * Stage 1 (0% - 25%): Clean Left-Side Sculpted Soil Mound, Seed & First Bushy Sprout
 * (Zero background lights or floating dots)
 */
export const SeedInSoilStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full opacity-90 dark:opacity-75" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <g transform="translate(30, 20)">
      {/* Clean Sculpted Earth Mound at Bottom Left */}
      <path
        d="M60 865 C105 832 195 832 245 865 Z"
        fill="#6E421C"
      />
      <path
        d="M82 865 C120 842 185 842 222 865 Z"
        fill="#8C5828"
      />

      {/* Germinating Seed & Short Woody Stem */}
      <ellipse cx="152" cy="838" rx="16" ry="11" fill="url(#goldGrad)" stroke="#5A3414" strokeWidth="2" />
      <path
        d="M152 830 C150 795 154 760 158 730"
        fill="none"
        stroke="#6E421C"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* First Small Scalloped Bushy Leaf Clusters */}
      <use href="#bushMidGreen" transform="translate(138, 725) scale(0.38)" />
      <use href="#bushBrightGreen" transform="translate(168, 718) scale(0.36)" />
      <use href="#bushSunlitLime" transform="translate(154, 704) scale(0.32)" />
    </g>
  </svg>
);

/**
 * Stage 2 (25% - 50%): Young Woody Sapling with Forked Branches & Scalloped Green Bushes
 */
export const SproutStemStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full opacity-90 dark:opacity-75" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <g transform="translate(20, 10)">
      {/* Young Sapling Woody Trunk & 3 Forks */}
      <path
        d="M145 865 C152 795 150 720 158 650 C164 605 182 565 208 530 L220 534 C196 570 180 610 174 655 C168 720 172 795 184 865 Z"
        fill="url(#barkGrad)"
      />
      <path
        d="M164 645 C144 605 122 575 96 552 L104 544 C132 568 154 598 172 638 Z"
        fill="url(#barkGrad)"
      />
      <path
        d="M184 585 C215 562 248 542 282 528 L288 536 C254 552 222 572 190 596 Z"
        fill="url(#barkGrad)"
      />
      <path
        d="M162 855 C164 785 160 715 168 650 C174 605 192 568 214 532"
        fill="none"
        stroke="#4A2A10"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Layered Scalloped Bushy Sapling Crown */}
      <use href="#bushDeepGreen" transform="translate(95, 535) scale(0.62)" />
      <use href="#bushDeepGreen" transform="translate(285, 525) scale(0.6)" />
      <use href="#bushMidGreen" transform="translate(155, 515) scale(0.75)" />
      <use href="#bushBrightGreen" transform="translate(235, 505) scale(0.72)" />
      <use href="#bushSunlitLime" transform="translate(190, 475) scale(0.68)" />
    </g>
  </svg>
);

/**
 * Stage 3 (50% - 75%): Sculpted Multi-Forked Illustrator Tree (Reference Image Structure)
 */
export const BranchingTreeStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full opacity-90 dark:opacity-75" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <g transform="translate(-15, 25) scale(0.88)">
      {/* 1. Back Deep Forest Green Foliage Clusters */}
      <use href="#bushDeepGreen" transform="translate(75, 285) scale(1.15)" />
      <use href="#bushDeepGreen" transform="translate(215, 295) scale(1.1)" />
      <use href="#bushDeepGreen" transform="translate(615, 275) scale(1.15)" />

      {/* 2. Mid-Layer Rich Green Foliage Clusters */}
      <use href="#bushMidGreen" transform="translate(155, 225) scale(1.25)" />
      <use href="#bushMidGreen" transform="translate(335, 245) scale(1.3)" />
      <use href="#bushMidGreen" transform="translate(495, 195) scale(1.25)" />

      {/* 3. Sculpted Woody Trunk & Sweeping Branches (Visible Under & Between Canopy) */}
      <IllustratedWoodyTrunk />

      {/* 4. Front Vibrant Apple-Green & Sunlit Lime Crown Clusters */}
      <use href="#bushBrightGreen" transform="translate(125, 195) scale(1.05)" />
      <use href="#bushBrightGreen" transform="translate(445, 225) scale(1.2)" />
      <use href="#bushBrightGreen" transform="translate(565, 245) scale(1.05)" />
      <use href="#bushSunlitLime" transform="translate(245, 145) scale(1.25)" />
      <use href="#bushSunlitLime" transform="translate(375, 135) scale(1.15)" />
    </g>
  </svg>
);

/**
 * Stage 4 (75% - 100%): Full Majestic Reference Illustrator Tree with Lush Layered Canopy & Fruits
 */
export const MatureFruitingTreeStage: React.FC = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full opacity-90 dark:opacity-75" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
    <BotanicalDefs />
    <g transform="translate(-10, 5) scale(0.95)">
      <g className="animate-bough-sway">
        {/* Layer 1: Deep Forest Green Outer & Under-Canopy Clusters (Matches Left, Bottom & Far-Right of Reference Image) */}
        <use href="#bushDeepGreen" transform="translate(68, 290) scale(1.25)" />
        <use href="#bushDeepGreen" transform="translate(95, 220) scale(1.1)" />
        <use href="#bushDeepGreen" transform="translate(220, 305) scale(1.15)" />
        <use href="#bushDeepGreen" transform="translate(545, 295) scale(1.1)" />
        <use href="#bushDeepGreen" transform="translate(655, 275) scale(1.25)" />

        {/* Layer 2: Medium Rich Leaf Green Body Clusters */}
        <use href="#bushMidGreen" transform="translate(165, 235) scale(1.3)" />
        <use href="#bushMidGreen" transform="translate(295, 255) scale(1.35)" />
        <use href="#bushMidGreen" transform="translate(445, 135) scale(1.3)" />
        <use href="#bushMidGreen" transform="translate(525, 225) scale(1.25)" />

        {/* Layer 3: Sculpted Woody Brown Trunk & Multi-Forked Branches */}
        <IllustratedWoodyTrunk />

        {/* Layer 4: Vibrant Apple-Green Mid-Front Canopy Clusters */}
        <use href="#bushBrightGreen" transform="translate(125, 205) scale(1.1)" />
        <use href="#bushBrightGreen" transform="translate(215, 125) scale(1.2)" />
        <use href="#bushBrightGreen" transform="translate(435, 235) scale(1.3)" />
        <use href="#bushBrightGreen" transform="translate(555, 165) scale(1.15)" />
        <use href="#bushBrightGreen" transform="translate(595, 255) scale(1.1)" />

        {/* Layer 5: Sunlit Yellow-Green Top Crown Clusters (Matches Upper-Center & Right Highlights of Reference) */}
        <use href="#bushSunlitLime" transform="translate(285, 135) scale(1.35)" />
        <use href="#bushSunlitLime" transform="translate(385, 125) scale(1.2)" />
        <use href="#bushSunlitLime" transform="translate(425, 240) scale(1.05)" />

        {/* Delicate Hanging Fruits & Blossoms Nestled Naturally Under the Canopy Boughs */}
        <g className="animate-fruit-sway">
          <use href="#realFruitPom" transform="translate(155, 315)" />
        </g>
        <g className="animate-fruit-sway-delayed">
          <use href="#realFruitCitrus" transform="translate(325, 310)" />
        </g>
        <g className="animate-fruit-sway">
          <use href="#realFruitPom" transform="translate(485, 295)" />
        </g>
        <g className="animate-fruit-sway-delayed">
          <use href="#realFruitCitrus" transform="translate(595, 310)" />
        </g>

        <use href="#realFlower" transform="translate(195, 245)" />
        <use href="#realFlower" transform="translate(345, 195)" />
        <use href="#realFlower" transform="translate(495, 215)" />
      </g>
    </g>
  </svg>
);
