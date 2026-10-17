/**
 * @file LivingTreePetalsCanvas.tsx
 * @description Ultra-lightweight HTML5 particle canvas for drifting petals and fluttering leaves.
 * Defer-initialized in idle time to guarantee zero delay for core storefront content.
 */

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  rotation: number;
  vRot: number;
  type: 'petal' | 'leaf' | 'spore';
  color: string;
}

function createParticle(w: number, h: number, isInitial = false): Particle {
  const types: ('petal' | 'leaf' | 'spore')[] = ['petal', 'leaf', 'petal', 'spore'];
  const type = types[Math.floor(Math.random() * types.length)];
  const colors = {
    petal: Math.random() > 0.5 ? '#FDA4AF' : '#FEF08A',
    leaf: Math.random() > 0.5 ? '#4ADE80' : '#84CC16',
    spore: '#F59E0B',
  };

  return {
    x: Math.random() * w,
    y: isInitial ? Math.random() * h : -20,
    vy: 0.6 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.8,
    size: type === 'spore' ? 3 + Math.random() * 2 : 7 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.04,
    type,
    color: colors[type],
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.type === 'spore' ? 0.6 : 0.85;

  if (p.type === 'spore') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'petal') {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size);
    ctx.fill();
  }
  ctx.restore();
}

export const LivingTreePetalsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId: number;
    let particles: Particle[] = [];
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Populate initial 16 particles
    for (let i = 0; i < 16; i++) {
      particles.push(createParticle(canvas.width, canvas.height, true));
    }

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(3, scrollBoost + delta * 0.05);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = () => {
      if (document.hidden) {
        rafId = window.requestAnimationFrame(loop);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scrollBoost *= 0.94; // Decay scroll gust

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy + scrollBoost;
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
        p.rotation += p.vRot;

        if (p.y > canvas.height + 25 || p.x < -30 || p.x > canvas.width + 30) {
          particles[i] = createParticle(canvas.width, canvas.height, false);
        }
        drawParticle(ctx, p);
      }
      rafId = window.requestAnimationFrame(loop);
    };

    // Defer start into idle time to ensure core storefront loads with highest priority
    const startHandle = typeof window.requestIdleCallback !== 'undefined'
      ? window.requestIdleCallback(() => { rafId = window.requestAnimationFrame(loop); })
      : setTimeout(() => { rafId = window.requestAnimationFrame(loop); }, 120);

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
