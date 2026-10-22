/**
 * @file LivingTreeBackground.tsx
 * @description Full-page background living botanical life-cycle system.
 * Uses a physics-damped requestAnimationFrame lerp loop and Hermite smoothstep
 * cross-fading with root-anchored scale3d + translate3d GPU transforms for
 * ultra-smooth scroll evolution across all 4 stages.
 */

import React, { useEffect, useRef } from 'react';
import {
  SeedInSoilStage,
  SproutStemStage,
  BranchingTreeStage,
  MatureFruitingTreeStage,
} from './LivingTreeStages';
import { LivingTreePetalsCanvas } from './LivingTreePetalsCanvas';

/**
 * Hermite smoothstep (t^2 * (3 - 2t)) for zero-corner organic easing
 */
function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Smooth bell/plateau opacity curve using Hermite smoothstep ramps
 */
function calcOpacity(progress: number, start: number, peakStart: number, peakEnd: number, end: number): number {
  if (progress <= start || progress >= end) return 0;
  if (progress >= peakStart && progress <= peakEnd) return 1;
  if (progress < peakStart) return smoothstep(start, peakStart, progress);
  return 1 - smoothstep(peakEnd, end, progress);
}

interface StageRefObjects {
  s1: React.RefObject<HTMLDivElement | null>;
  s2: React.RefObject<HTMLDivElement | null>;
  s3: React.RefObject<HTMLDivElement | null>;
  s4: React.RefObject<HTMLDivElement | null>;
}

function updateLivingTreeElements(refs: StageRefObjects, progress: number): void {
  if (refs.s1.current) {
    const op1 = calcOpacity(progress, -0.01, 0.0, 0.16, 0.38);
    const scale1 = 0.96 + Math.min(1, progress / 0.35) * 0.06;
    const y1 = progress * 24;
    refs.s1.current.style.opacity = op1.toFixed(4);
    refs.s1.current.style.transform = `translate3d(0, ${y1.toFixed(2)}px, 0) scale3d(${scale1.toFixed(4)}, ${scale1.toFixed(4)}, 1)`;
  }
  if (refs.s2.current) {
    const op2 = calcOpacity(progress, 0.12, 0.28, 0.44, 0.62);
    const localT2 = Math.min(1, Math.max(0, (progress - 0.12) / 0.50));
    const scale2 = 0.92 + localT2 * 0.10;
    const y2 = (0.36 - progress) * 26;
    refs.s2.current.style.opacity = op2.toFixed(4);
    refs.s2.current.style.transform = `translate3d(0, ${y2.toFixed(2)}px, 0) scale3d(${scale2.toFixed(4)}, ${scale2.toFixed(4)}, 1)`;
  }
  if (refs.s3.current) {
    const op3 = calcOpacity(progress, 0.38, 0.54, 0.70, 0.86);
    const localT3 = Math.min(1, Math.max(0, (progress - 0.38) / 0.48));
    const scale3 = 0.93 + localT3 * 0.09;
    const y3 = (0.62 - progress) * 22;
    refs.s3.current.style.opacity = op3.toFixed(4);
    refs.s3.current.style.transform = `translate3d(0, ${y3.toFixed(2)}px, 0) scale3d(${scale3.toFixed(4)}, ${scale3.toFixed(4)}, 1)`;
  }
  if (refs.s4.current) {
    const op4 = calcOpacity(progress, 0.64, 0.78, 1.0, 1.05);
    const localT4 = Math.min(1, Math.max(0, (progress - 0.64) / 0.36));
    const scale4 = 0.94 + localT4 * 0.06;
    const y4 = (0.85 - progress) * 18;
    refs.s4.current.style.opacity = op4.toFixed(4);
    refs.s4.current.style.transform = `translate3d(0, ${y4.toFixed(2)}px, 0) scale3d(${scale4.toFixed(4)}, ${scale4.toFixed(4)}, 1)`;
  }
}

function useLivingTreeScroll(refs: StageRefObjects): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId = 0;
    let isRunning = false;

    const getScrollProgress = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    let targetProgress = getScrollProgress();
    let currentProgress = targetProgress;

    const tick = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        // Silky-smooth exponential damping (lerp factor 0.085)
        currentProgress += diff * 0.085;
        updateLivingTreeElements(refs, currentProgress);
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        updateLivingTreeElements(refs, currentProgress);
        isRunning = false;
      }
    };

    const handleScroll = () => {
      targetProgress = getScrollProgress();
      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateLivingTreeElements(refs, currentProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [refs]);
}

export const LivingTreeBackground: React.FC = () => {
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);
  const s4 = useRef<HTMLDivElement>(null);

  useLivingTreeScroll({ s1, s2, s3, s4 });

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Clean Solid Base Canvas (Zero Artificial Lights or Glow Circles) */}
      <div className="absolute inset-0 bg-[#F7F5EC] dark:bg-[#06120D]" />

      {/* Stage 1: Seed & First Sprout */}
      <div
        ref={s1}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 1, transformOrigin: '175px 865px' }}
      >
        <SeedInSoilStage />
      </div>

      {/* Stage 2: Young Woody Sapling */}
      <div
        ref={s2}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0, transformOrigin: '175px 865px' }}
      >
        <SproutStemStage />
      </div>

      {/* Stage 3: Growing Branched Illustrator Tree */}
      <div
        ref={s3}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0, transformOrigin: '175px 865px' }}
      >
        <BranchingTreeStage />
      </div>

      {/* Stage 4: Mature Fruiting Illustrator Tree */}
      <div
        ref={s4}
        className="absolute inset-0 will-change-[transform,opacity]"
        style={{ opacity: 0, transformOrigin: '175px 865px' }}
      >
        <MatureFruitingTreeStage />
      </div>

      {/* Subtle Drifting Petals & Leaves Particle Canvas */}
      <LivingTreePetalsCanvas />
    </div>
  );
};
