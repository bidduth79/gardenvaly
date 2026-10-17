/**
 * @file Navigation.tsx
 * @description Desktop and tablet navigation menu with client routing support.
 */

import React from 'react';
import { NAV_LINKS } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();

  const handleNavClick = (linkId: string, href: string) => {
    if (linkId === 'home') navigate('/');
    else if (linkId === 'plants') navigate('/plants');
    else if (linkId === 'seeds') navigate('/seeds');
    else if (linkId === 'supplies') navigate('/supplies');
    else if (linkId === 'guide') {
      if (currentPath === '/') document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else if (linkId === 'contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {NAV_LINKS.map((link) => {
        const label = language === 'bn' ? link.labelBn : link.labelEn;
        const isActive =
          (link.id === 'home' && currentPath === '/') ||
          (link.id === 'plants' && currentPath === '/plants') ||
          (link.id === 'seeds' && currentPath === '/seeds') ||
          (link.id === 'supplies' && (currentPath === '/supplies' || currentPath === '/tools')) ||
          (link.id === 'track' && currentPath === '/track-order');

        const href =
          link.id === 'home'
            ? '/'
            : link.id === 'plants'
            ? '/plants'
            : link.id === 'seeds'
            ? '/seeds'
            : link.id === 'supplies'
            ? '/supplies'
            : link.href;

        return (
          <a
            key={link.id}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.id, link.href);
            }}
            className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
              isActive
                ? 'text-[#174D35] font-semibold bg-[#174D35]/10'
                : 'text-stone-600 hover:text-[#174D35] hover:bg-stone-100/60'
            }`}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
