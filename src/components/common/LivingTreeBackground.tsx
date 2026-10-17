/**
 * @file LivingTreeBackground.tsx
 * @description Full-page background living botanical life-cycle system.
 * Positioned on -z-10 over the base canvas so it is clearly visible
 * around cards and on both margins, evolving across the 4 stages of scroll.
 */

import React, { useEffect, useRef } from 'react';
import {
  SeedInSoilStage,
  SproutStemStage,
  BranchingTreeStage,
  MatureFruitingTreeStage,
} from './LivingTreeStages';
import { LivingTreePetalsCanvas } from './LivingTreePetalsCanvas';

function calcOpacity(progress: number, start: number, peakStart: number, peakEnd: number, end: number): number {
  if (progress < start || progress > end) return 0;
  if (progress >= peakStart && progress <= peakEnd) return 1;
  if (progress < peakStart) return (progress - start) / (peakStart - start);
  return 1 - (progress - peakEnd) / (end - peakEnd);
}

interface StageRefObjects {
  s1: React.RefObject<HTMLDivElement | null>;
  s2: React.RefObject<HTMLDivElement | null>;
  s3: React.RefObject<HTMLDivElement | null>;
  s4: React.RefObject<HTMLDivElement | null>;
  glow: React.RefObject<HTMLDivElement | null>;
}

function updateLivingTreeElements(refs: StageRefObjects, progress: number): void {
  if (refs.s1.current) {
    const op1 = calcOpacity(progress, 0.0, 0.0, 0.18, 0.35);
    refs.s1.current.style.opacity = op1.toFixed(3);
    refs.s1.current.style.transform = `translate3d(0, ${progress * 60}px, 0)`;
  }
  if (refs.s2.current) {
    const op2 = calcOpacity(progress, 0.16, 0.28, 0.45, 0.60);
    refs.s2.current.style.opacity = op2.toFixed(3);
    refs.s2.current.style.transform = `translate3d(0, ${(progress - 0.28) * -50}px, 0)`;
  }
  if (refs.s3.current) {
    const op3 = calcOpacity(progress, 0.42, 0.55, 0.70, 0.82);
    refs.s3.current.style.opacity = op3.toFixed(3);
    refs.s3.current.style.transform = `translate3d(0, ${(progress - 0.55) * -40}px, 0)`;
  }
  if (refs.s4.current) {
    const op4 = calcOpacity(progress, 0.68, 0.80, 1.0, 1.0);
    refs.s4.current.style.opacity = op4.toFixed(3);
    refs.s4.current.style.transform = `translate3d(0, ${(progress - 0.8) * -30}px, 0)`;
  }
  if (refs.glow.current) {
    const col = progress < 0.35
      ? 'rgba(163, 230, 53, 0.05)'
      : progress < 0.7
      ? 'rgba(34, 197, 94, 0.06)'
      : 'rgba(20, 83, 45, 0.08)';
    refs.glow.current.style.backgroundColor = col;
  }
}

function useLivingTreeScroll(refs: StageRefObjects): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId: number;
    let isTicking = false;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      updateLivingTreeElements(refs, progress);
      isTicking = false;
    };

    const handleScroll = () => {
      if (!isTicking) {
        rafId = window.requestAnimationFrame(onScroll);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    onScroll();

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
  const glow = useRef<HTMLDivElement>(null);

  useLivingTreeScroll({ s1, s2, s3, s4, glow });

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Base Canvas Color */}
      <div className="absolute inset-0 bg-[#F7F5EC]" />

      {/* Ambient Glow Backlight */}
      <div
        ref={glow}
        className="absolute inset-0 transition-colors duration-1000 ease-out"
        style={{ backgroundColor: 'rgba(197, 160, 89, 0.08)' }}
      />

      {/* Stage 1: Seed in Soil Bed */}
      <div
        ref={s1}
        className="absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{ opacity: 1 }}
      >
        <SeedInSoilStage />
      </div>

      {/* Stage 2: Sprout & Rising Stem */}
      <div
        ref={s2}
        className="absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{ opacity: 0 }}
      >
        <SproutStemStage />
      </div>

      {/* Stage 3: Growing Branched Tree */}
      <div
        ref={s3}
        className="absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{ opacity: 0 }}
      >
        <BranchingTreeStage />
      </div>

      {/* Stage 4: Mature Fruiting Tree */}
      <div
        ref={s4}
        className="absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{ opacity: 0 }}
      >
        <MatureFruitingTreeStage />
      </div>

      {/* Drifting Petals & Leaves Particle Canvas */}
      <LivingTreePetalsCanvas />
    </div>
  );
};
