# Gardenvaly Fullscreen Botanical Hero & Seamless Organic Background

Transform the current split-column hero into a cinematic, full-width, edge-to-edge botanical slider with high-legibility typographic overlays, and craft a seamless organic transition underneath featuring an overlapping trust metric strip and natural curved wave divider.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The questions regarding layout and transition style were dismissed, so we have synthesized the best architectural approach matching high-end botanical e-commerce standards:
> - **Fullscreen Hero Presentation**: Full-width edge-to-edge carousel (`min-h-[580px] lg:h-[82vh]`) with left-aligned typographic content over an optical deep-forest botanical scrim gradient (`from-stone-950/92 via-stone-950/65 to-transparent`).
> - **Background Underneath**: An overlapping floating botanical trust bar (-translate-y-1/2) bridging the bottom of the hero with the rest of the store, accompanied by a subtle organic SVG wave transition to the warm natural stone canvas (`#FBFBFA`).
> - **Admin Banner Integration**: Seamlessly retains compatibility with existing slides stored in `localStorage` (`gardenvaly_hero_slides`) and the Admin Banners Page (`/admin/banners`).

---

### 1. Overview & Core Concept

- **What It Does**: Upgrades the storefront hero section from a constrained right-column box into a panoramic, immersive fullscreen experience that showcases Hasna Hena's lush plant and flower collections across the full browser width, while maintaining instant access to primary actions ("Browse Plants", "Order Seeds", "Reviews").
- **Target Audience**: Home gardeners, terrace enthusiasts, plant lovers, and urban shoppers in Bangladesh looking for authentic, healthy greenery and seeds.
- **Key Value**: First impressions jump from a standard boxed template to a premium, immersive horticultural brand experience, dramatically increasing visual impact without sacrificing text readability or mobile performance.

---

### 2. User Experience & Visual Design

#### A. Edge-to-Edge Panoramic Carousel Experience
1. **Full-Bleed Visual Canvas**: Carousel slides expand to 100% viewport width with a responsive height (`h-[520px] sm:h-[600px] lg:h-[82vh] max-h-[780px]`).
2. **Measured Contrast Scrim**: A multi-stop gradient scrim (`linear-gradient(to right, rgba(12,18,14,0.92) 0%, rgba(12,18,14,0.70) 50%, rgba(12,18,14,0.25) 100%)`) ensures text has WCAG AA contrast (ratio > 7:1) over any bright or variegated plant photo.
3. **Typography & Hero Content**:
   - **Signature Tag**: Elegant gold/green botanical brand tag (`#C5A059` & `#5C8D50`) indicating Hasna Hena's curation.
   - **Display Headline**: Refined botanical serif typography (`text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight text-balance leading-tight`).
   - **Subtitle**: Crisp readable prose in Bengali / English explaining the curated collection.
   - **Action CTAs**: Primary solid emerald button (`bg-[#174D35]` with hover lift) + secondary translucent frosted glass button (`bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border-white/25`).
   - **Social Proof**: 5-star customer ratings badge with customer avatars and live link jumping to customer reviews.

#### B. Bottom Background & Section Transition Architecture
1. **Floating Bridge Trust Bar**:
   - Positioned directly at the bottom seam of the fullscreen hero, slightly overlapping the transition boundary.
   - 3 value pillars: 100% Healthy Plant Guarantee, Tested Seed Strains, and Expert Advice from Hasna Hena.
   - Rendered with warm off-white surface, subtle hairline border, and gentle drop shadow, grounding the viewer into the catalog.
2. **Organic Wave Transition & Under-Hero Ambient Atmosphere**:
   - Smooth botanical curve connecting the hero seamlessly to the "Shop by Category" section.
   - Ambient warm stone canvas (`bg-[#FDFBF7]`) with soft diffused botanical glows (`bg-[#5C8D50]/8`) that eliminate abrupt color blocking.

#### C. Micro-Interactions & Carousel Controls
- Floating lateral arrow buttons (left/right) with backdrop blur and smooth hover reveal.
- Minimalist bottom slider indicators with an active slide progress bar.
- Pause/Play toggle to give full accessibility control to the user.
- Interactive next-slide preview thumbnail at the bottom right.
- Touch gesture support (swipe left/right) on mobile devices.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Width Scrim Overlay vs Centered Card**:
  - *Chosen*: Left-aligned content container with horizontal directional scrim gradient.
  - *Why*: Allows the lush plant imagery on the right side to remain unoccluded, while guaranteeing high contrast and legibility for Bengali and English typography on the left.
- **Decision 2: Viewport Height Sizing (`82vh` vs `100vh`)**:
  - *Chosen*: `82vh` (capped between 520px and 780px) instead of hard `100vh`.
  - *Why*: A strict `100vh` completely hides the next section fold ("Shop by Category"), lowering product discovery. `82vh` provides full-screen grandeur while peeking the top of the next section and the floating trust bar, encouraging downward scrolling.
- **Decision 3: Preserving Admin Panel Customization**:
  - *Chosen*: Full backward and forward compatibility with the existing `gardenvaly_hero_slides` data schema and `/admin/banners` management view.
  - *Why*: Admins can continue adding, reordering, and replacing hero slide URLs, titles, and subtitles without breaking layout.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HeroSection (Full-Bleed)                        │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Background Image Slider (100% w, 82vh h, crossfade transition)     │ │
│ │  - Active slide: scale-105 slow ken-burns zoom                     │ │
│ │  - Directional botanical gradient scrim (dark on left, clear right)│ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Content Container (max-w-7xl mx-auto, px-4 to px-8)                │ │
│ │  ├── Brand Signature Kicker                                        │ │
│ │  ├── Responsive Botanical Headline (text-balance)                  │ │
│ │  ├── Subtitle Description (Bengali / English)                      │ │
│ │  ├── Star Rating & Social Proof Link                               │ │
│ │  └── Dual Storefront CTAs ("গাছ দেখুন" | "বীজ কিনুন")             │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Carousel Nav (Prev/Next, Slide Indicators, Play/Pause, Next Thumb) │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │  Floating Botanical Trust Bar (Overlapping Hero Boundary)     │
    │  [100% সুস্থ গাছ]   ·   [পরীক্ষিত অর্গানিক বীজ]   ·   [হাসনাহেনার পরামর্শ] │
    └───────────────────────────────┬───────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │  Organic Wave SVG Divider & Ambient Stone Canvas (#FDFBF7)    │
    │  Smooth entry into CategoryShowcase & FeaturedPlants          │
    └───────────────────────────────────────────────────────────────┘
```

#### Files to be Modified
- `src/components/home/HeroSection.tsx`: Re-architect geometry from 2-column grid (`lg:grid-cols-12`) to full-bleed container with left-scrim content overlay, interactive navigation, and overlapping bottom trust strip.
- `src/components/home/CategoryShowcase.tsx`: Adjust top spacing and background coordination to align with the organic wave transition from the hero.

---

### 5. Verification Plan

1. **Visual Testing across Devices**:
   - Desktop (1440px): Verify full-width edge-to-edge images, left-aligned typography readability against the gradient scrim, and smooth slide transitions.
   - Tablet (768px - 1024px): Verify responsive typography scaling and indicator controls.
   - Mobile (360px - 414px): Verify touch swipe, no text overflow, clean button stacking, and no horizontal scrollbars.
2. **Accessibility & Contrast**:
   - Check text contrast against all 5 default hero slide backgrounds using the gradient scrim.
   - Test keyboard navigation for Previous/Next slide and Play/Pause buttons.
3. **Admin Banner Sync**:
   - Verify that changes made in the Admin Banners Page (`/admin/banners`) immediately reflect in the fullscreen hero slider.
4. **Build & Compilation**:
   - Run `compile_applet` to confirm clean TypeScript compilation.
