/**
 * @file LivingTreePetalsCanvas.tsx
 * @description Lightweight HTML5 particle canvas for drifting botanical leaves & petals.
 * Automatically pauses when tab is hidden or prefers-reduced-motion is enabled.
 */

import React, { useEffect, useRef } from 'react';

interface PetalParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  rotation: number;
  vRot: number;
  swayPhase: number;
  swaySpeed: number;
  alpha: number;
  isPetal: boolean;
  color: string;
}

const LEAF_COLORS = ['#15803D', '#16A34A', '#22C55E', '#4D7C0F', '#65A30D'];
const PETAL_COLORS = ['#FDA4AF', '#FB7185', '#FDE047', '#FBBF24'];

function createParticle(w: number, h: number, isInitial = false): PetalParticle {
  const isPetal = Math.random() > 0.55;
  const palette = isPetal ? PETAL_COLORS : LEAF_COLORS;
  const color = palette[Math.floor(Math.random() * palette.length)];

  return {
    x: Math.random() * w,
    y: isInitial ? Math.random() * h : -20,
    vy: 0.5 + Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.5,
    size: isPetal ? 5 + Math.random() * 4 : 7 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.025,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.015 + Math.random() * 0.015,
    alpha: 0.55 + Math.random() * 0.25,
    isPetal,
    color,
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: PetalParticle): void {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;

  ctx.beginPath();
  if (p.isPetal) {
    ctx.ellipse(0, 0, p.size, p.size * 0.68, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size);
  }
  ctx.fill();
  ctx.restore();
}

export const LivingTreePetalsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let particles: PetalParticle[] = [];
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const count = 16;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(canvas.width, canvas.height, true));
    }

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(2.5, scrollBoost + delta * 0.04);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = () => {
      if (document.hidden) {
        rafId = window.requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scrollBoost *= 0.94;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swayPhase += p.swaySpeed;
        p.y += p.vy + scrollBoost;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.6;
        p.rotation += p.vRot;

        if (p.y > canvas.height + 24 || p.x < -30 || p.x > canvas.width + 30) {
          particles[i] = createParticle(canvas.width, canvas.height, false);
        }

        drawParticle(ctx, p);
      }

      rafId = window.requestAnimationFrame(loop);
    };

    const startHandle =
      typeof window.requestIdleCallback !== 'undefined'
        ? window.requestIdleCallback(() => {
            rafId = window.requestAnimationFrame(loop);
          })
        : setTimeout(() => {
            rafId = window.requestAnimationFrame(loop);
          }, 120);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
      if (typeof window.cancelIdleCallback !== 'undefined' && typeof startHandle === 'number') {
        window.cancelIdleCallback(startHandle);
      } else {
        clearTimeout(startHandle as NodeJS.Timeout);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 select-none"
    />
  );
};
