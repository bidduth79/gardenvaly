/**
 * @file CustomCursor.tsx
 * @description DesignMingle-inspired smooth spring-lerp cursor follower dot (.ov-cursor),
 * top scroll progress bar (.ov-progress), and global IntersectionObserver scroll-reveal
 * (.ov-rv -> .ov-rv.in) so headings, text, and cards across all sections fade up from the bottom on scroll.
 */

import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Top Scroll Progress Bar (DesignMingle motion.js .progress)
    const bar = progressRef.current;
    let scrollTicking = false;

    const updateProgress = () => {
      scrollTicking = false;
      if (!bar) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const onScrollOrResize = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    updateProgress();

    // 2. Global Scroll-Triggered Fade-Up Observer (.ov-rv) matching DesignMingle theme-v2.js
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let revealObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.add('in');
              el.setAttribute('data-ov-in', 'true');
              revealObserver?.unobserve(el);
            }
          });
        },
        { rootMargin: '0px 0px -4% 0px', threshold: 0.04 }
      );

      const scanAndObserve = () => {
        if (!revealObserver) return;
        // Auto-tag storefront section headings, subtitles, cards, and interactive blocks (excluding Hero)
        const autoSelectors = [
          'main > section:not(:first-child) h2',
          'main > section:not(:first-child) h2 + p',
          'main > section:not(:first-child) .text-center > p',
          'main > section:not(:first-child) .grid > div',
          'main > section:not(:first-child) .grid > article',
          'footer#contact .ov-rv',
        ];
        document.querySelectorAll<HTMLElement>(autoSelectors.join(', ')).forEach((el) => {
          if (!el.classList.contains('ov-rv')) {
            el.classList.add('ov-rv');
            const parent = el.parentElement;
            if (parent && parent.classList.contains('grid')) {
              const siblings = Array.from(parent.children);
              const idx = siblings.indexOf(el);
              if (idx >= 0) {
                el.style.setProperty('--rv-delay', `${Math.min(idx % 4, 3) * 90}ms`);
              }
            } else if (el.tagName === 'P') {
              el.style.setProperty('--rv-delay', '90ms');
            }
          }
        });

        document.querySelectorAll<HTMLElement>('.ov-rv').forEach((el) => {
          if (el.getAttribute('data-ov-in') === 'true' || el.classList.contains('in')) {
            el.classList.add('in');
            el.setAttribute('data-ov-in', 'true');
            return;
          }
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
            el.classList.add('in');
            el.setAttribute('data-ov-in', 'true');
            revealObserver?.unobserve(el);
            return;
          }
          if (!el.dataset.ovObserved) {
            el.dataset.ovObserved = '1';
            revealObserver?.observe(el);
          }
        });
      };

      scanAndObserve();
      mutationObserver = new MutationObserver(() => {
        scanAndObserve();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 3. Smooth Light-Green Cursor Dot (DesignMingle theme-v2.js .ov-cursor)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dot = cursorRef.current;

    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = targetX;
    let currentY = targetY;
    let isShown = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dot) return;
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isShown) {
        currentX = targetX;
        currentY = targetY;
        isShown = true;
        dot.classList.add('on');
      }

      const targetEl = e.target as Element | null;
      const interactiveEl =
        targetEl &&
        typeof targetEl.closest === 'function' &&
        targetEl.closest('a, button, summary, [role="button"], input, textarea, select, label');

      dot.classList.toggle('big', Boolean(interactiveEl));
    };

    const handleMouseLeave = () => {
      if (!dot) return;
      isShown = false;
      dot.classList.remove('on');
    };

    const loop = () => {
      if (dot) {
        currentX += (targetX - currentX) * 0.22;
        currentY += (targetY - currentY) * 0.22;
        dot.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
      rafId = window.requestAnimationFrame(loop);
    };

    if (isFinePointer && !prefersReducedMotion && dot) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (revealObserver) revealObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="ov-progress" aria-hidden="true" />
      <div ref={cursorRef} className="ov-cursor" aria-hidden="true" />
    </>
  );
};
