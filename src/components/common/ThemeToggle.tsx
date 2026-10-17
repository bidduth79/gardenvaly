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
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
        isDark
          ? 'bg-[#11281E] text-amber-300 hover:bg-[#18392b] border border-[#1B3B2E] shadow-2xs'
          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
      } ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 fill-amber-300 text-amber-300 transition-transform active:rotate-45" />
      ) : (
        <Sun className="w-4 h-4 fill-amber-500 text-amber-600 transition-transform active:rotate-45" />
      )}
    </button>
  );
};
