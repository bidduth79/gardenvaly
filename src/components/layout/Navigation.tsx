/**
 * @file Navigation.tsx
 * @description Desktop and tablet navigation menu with router and botanical mega menu support.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { NAV_LINKS } from '../../config/constants';
import { HIERARCHICAL_CATEGORIES } from '../../data/mockCategoryHierarchy';
import { MegaMenu } from './MegaMenu';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mega menu on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
  }, [currentPath]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const handleNavClick = (linkId: string, href: string) => {
    setIsMegaMenuOpen(false);
    if (linkId === 'home') navigate('/');
    else if (linkId === 'plants') navigate('/plants');
    else if (linkId === 'seeds') navigate('/seeds');
    else if (linkId === 'supplies') navigate('/supplies');
    else if (linkId === 'track') navigate('/track-order');
    else if (linkId === 'guide' || linkId === 'contact') {
      const targetId = linkId === 'guide' ? 'tips' : 'contact';
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2 shrink-0 relative"
      aria-label="Desktop Navigation"
    >
      {NAV_LINKS.map((link) => {
        const label = language === 'bn' ? link.labelBn : link.labelEn;
        const isPlants = link.id === 'plants';
        const isActive =
          (link.id === 'home' && currentPath === '/') ||
          (isPlants && (currentPath === '/plants' || currentPath.startsWith('/category/'))) ||
          (link.id === 'seeds' && currentPath === '/seeds') ||
          (link.id === 'supplies' && (currentPath === '/supplies' || currentPath === '/tools')) ||
          (link.id === 'track' && currentPath === '/track-order');

        const href = isPlants ? '/plants' : link.href;

        if (isPlants) {
          return (
            <div
              key={link.id}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id, href);
                }}
                className={`inline-flex items-center gap-1 px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-[13px] xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors rounded-lg cursor-pointer select-none ${
                  isActive || isMegaMenuOpen
                    ? 'text-[#174D35] font-semibold bg-[#174D35]/10'
                    : 'text-stone-600 hover:text-[#174D35] hover:bg-stone-100/60'
                }`}
                aria-haspopup="true"
                aria-expanded={isMegaMenuOpen}
              >
                <span>{label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180 text-[#174D35]' : 'text-stone-400'
                  }`}
                />
              </a>

              {/* Botanical Mega Menu */}
              <MegaMenu
                isOpen={isMegaMenuOpen}
                categories={HIERARCHICAL_CATEGORIES}
                onClose={() => setIsMegaMenuOpen(false)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          );
        }

        return (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.id, link.href);
            }}
            className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-[13px] xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors rounded-lg cursor-pointer select-none ${
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
