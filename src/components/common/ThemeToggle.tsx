/**
 * @file ThemeToggle.tsx
 * @description Accessible Day / Night mode toggle button with sun and moon icons.
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'icon' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const title = language === 'bn'
    ? (isDark ? 'ডে মোড চালু করুন' : 'নাইট মোড চালু করুন')
    : (isDark ? 'Switch to Day mode' : 'Switch to Night mode');

  if (variant === 'pill') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={title}
        title={title}
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
          isDark
            ? 'bg-[#11281E] border-[#1B3B2E] text-amber-300 hover:text-white'
            : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>{language === 'bn' ? 'নাইট' : 'Night'}</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{language === 'bn' ? 'ডে' : 'Day'}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={title}
      title={title}
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-all cursor-pointer group/theme ${
        isDark
          ? 'bg-[#11281E] text-amber-300 hover:bg-[#18392b] border border-[#1B3B2E] shadow-2xs'
          : 'bg-amber-50/80 text-amber-600 hover:bg-amber-100/80 border border-amber-200/80 shadow-2xs'
      } ${className}`}
    >
      {isDark ? (
        <span
          key="night-celestial"
          className="relative flex items-center justify-center animate-celestial-rise"
        >
          <Moon className="w-4 h-4 fill-amber-300 text-amber-300 group-hover/theme:-rotate-12 transition-transform" />
          {/* Tiny Firefly / Star Dots */}
          <span className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-[#4ADE80] animate-ping" />
          <span className="absolute -bottom-0.5 -left-1 w-1 h-1 rounded-full bg-amber-200 animate-pulse" />
        </span>
      ) : (
        <span
          key="day-celestial"
          className="relative flex items-center justify-center animate-celestial-rise"
        >
          <Sun className="w-4.5 h-4.5 fill-amber-500 text-amber-600 group-hover/theme:rotate-45 transition-transform duration-500" />
        </span>
      )}
    </button>
  );
};
