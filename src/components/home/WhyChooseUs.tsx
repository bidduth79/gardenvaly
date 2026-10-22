/**
 * @file WhyChooseUs.tsx
 * @description 4 feature value cards with DesignMingle-inspired 3D pointer-tilt,
 * scroll-triggered bottom fade-up reveal (.ov-rv), and visible 0-to-target count-up statistics.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sprout, BookOpen, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface StatCounterProps {
  target: number;
  suffixBn: string;
  suffixEn: string;
  labelBn: string;
  labelEn: string;
  language: 'bn' | 'en';
  delayMs: number;
}

const StatCounterCard: React.FC<StatCounterProps> = ({
  target,
  suffixBn,
  suffixEn,
  labelBn,
  labelEn,
  language,
  delayMs,
}) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isBn = language === 'bn';

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof window === 'undefined') return;

    let rafId = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    const startCountingFromZero = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      setCount(0);

      timeoutId = setTimeout(() => {
        const duration = 2200;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * eased));
          if (progress < 1) {
            rafId = window.requestAnimationFrame(tick);
          }
        };

        rafId = window.requestAnimationFrame(tick);
      }, delayMs);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCountingFromZero();
            } else {
              if (rafId) window.cancelAnimationFrame(rafId);
              if (timeoutId) clearTimeout(timeoutId);
              setCount(0);
            }
          });
        },
        { threshold: 0.25 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        if (rafId) window.cancelAnimationFrame(rafId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      startCountingFromZero();
    }
  }, [target, delayMs]);

  return (
    <div
      ref={cardRef}
      style={{ '--rv-delay': `${delayMs}ms` } as React.CSSProperties}
      className="ov-rv text-center p-5 rounded-2xl bg-white/85 dark:bg-[#0C2018] border border-stone-200/80 dark:border-[#1B3B2E] shadow-xs"
    >
      <div className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-[#174D35] dark:text-[#4ADE80] tabular-nums">
        {formatNumeral(count.toLocaleString('en-US'), language)}
        {isBn ? suffixBn : suffixEn}
      </div>
      <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-[#CBD5E1] mt-1">
        {isBn ? labelBn : labelEn}
      </p>
    </div>
  );
};

export const WhyChooseUs: React.FC = () => {
  const { language, t } = useLanguage();

  const stats = [
    {
      target: 9500,
      suffixBn: '+',
      suffixEn: '+',
      labelBn: 'সবুজপ্রেমী পরিবারের আস্থা',
      labelEn: 'Happy Plant Families',
    },
    {
      target: 98,
      suffixBn: '%',
      suffixEn: '%',
      labelBn: 'বীজের অঙ্কুরোদগম নিশ্চয়তা',
      labelEn: 'Seed Germination Rate',
    },
    {
      target: 64,
      suffixBn: ' জেলা',
      suffixEn: ' Districts',
      labelBn: 'সারাদেশে নিরাপদ হোম ডেলিভারি',
      labelEn: 'Nationwide Safe Delivery',
    },
    {
      target: 100,
      suffixBn: '%',
      suffixEn: '%',
      labelBn: 'সতেজ ও নার্সারি-গ্রেড চারা',
      labelEn: 'Healthy Nursery Saplings',
    },
  ];

  const features = [
    {
      id: 'selected-plants',
      icon: <Sprout className="w-6 h-6 text-[#5C8D50]" />,
      titleEn: 'Carefully Selected Plants',
      titleBn: 'যত্নে নির্বাচিত গাছ',
      descEn: 'Healthy botanical varieties curated by Hasna Hena for home spaces.',
      descBn: 'ঘরের পরিবেশ ও আবহাওয়া অনুযায়ী হাসনাহেনার পরম যত্নে বাছাইকৃত সুস্থ গাছ।',
    },
    {
      id: 'quality-seeds',
      icon: <ShieldCheck className="w-6 h-6 text-[#174D35]" />,
      titleEn: 'Quality Seeds',
      titleBn: 'মানসম্মত বীজ',
      descEn: 'Fresh, tested vegetable and flower seeds from reliable domestic sources.',
      descBn: 'বিশ্বস্ত দেশি-বিদেশি উৎস থেকে সংগৃহীত তাজা ও খাঁটি জাতের বীজ।',
    },
    {
      id: 'gardening-guidance',
      icon: <BookOpen className="w-6 h-6 text-[#C5A059]" />,
      titleEn: 'Gardening Guidance',
      titleBn: 'বাগান পরিচর্যার পরামর্শ',
      descEn: 'Practical watering, sunlight, and organic soil tips for beginners.',
      descBn: 'পানি, রোদ ও সার প্রয়োগের সঠিক নিয়মে বাগান করার সহজ নির্দেশনা।',
    },
    {
      id: 'convenient-ordering',
      icon: <Truck className="w-6 h-6 text-[#174D35]" />,
      titleEn: 'Convenient Ordering',
      titleBn: 'সহজে অর্ডার',
      descEn: 'Smooth plant browsing and responsive customer support for every gardener.',
      descBn: 'সহজেই পছন্দের গাছ বাছাই এবং সার্বক্ষণিক সহায়ক গ্রাহক পরামর্শ।',
    },
  ];

  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const ry = (((e.clientX - rect.left) / rect.width - 0.5) * 10).toFixed(2);
    const rx = ((0.5 - (e.clientY - rect.top) / rect.height) * 10).toFixed(2);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--rx', `${rx}deg`);
  };

  const resetCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <section className="py-14 sm:py-18 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="ov-rv text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 dark:text-white">
            {t('whyChooseTitle')}
          </h2>
          <p
            style={{ '--rv-delay': '100ms' } as React.CSSProperties}
            className="ov-rv text-sm sm:text-base text-stone-600 dark:text-[#CBD5E1] mt-2"
          >
            {t('whyChooseSubtitle')}
          </p>
        </div>

        {/* DesignMingle Scroll Count-Up Metrics Row (Counts from 0 on scroll) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((st, idx) => (
            <StatCounterCard key={idx} {...st} language={language} delayMs={idx * 120} />
          ))}
        </div>

        {/* 4 Feature Value Cards with Scroll Fade-Up & 3D Pointer-Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const title = language === 'bn' ? feat.titleBn : feat.titleEn;
            const desc = language === 'bn' ? feat.descBn : feat.descEn;

            return (
              <div
                key={feat.id}
                style={{ '--rv-delay': `${idx * 110}ms` } as React.CSSProperties}
                onMouseMove={handleCardTilt}
                onMouseLeave={resetCardTilt}
                className="ov-rv ov-tilt-frame bg-[#F7F5EC]/80 dark:bg-[#0C2018] p-6 rounded-2xl border border-stone-200/80 dark:border-[#1B3B2E] hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#10261E] dark:border dark:border-[#1B3B2E] flex items-center justify-center shadow-xs mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-serif-botanical font-bold text-base text-stone-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-[#CBD5E1] mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
