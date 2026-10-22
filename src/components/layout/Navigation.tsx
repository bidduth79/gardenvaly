/**
 * @file Navigation.tsx
 * @description DesignMingle-inspired desktop pill navigation (.nav > a, .dd-trigger)
 * with smooth rounded-full hover pills, 180deg rotating dropdown chevrons,
 * and both wide (.dd-panel) and narrow (.dd-panel.dd-narrow) dropdown menus.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sprout, Flower2, Leaf, Shovel, FlaskConical, PackageCheck } from 'lucide-react';
import { NAV_LINKS } from '../../config/constants';
import { HIERARCHICAL_CATEGORIES } from '../../data/mockCategoryHierarchy';
import { MegaMenu } from './MegaMenu';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isBn = language === 'bn';

  // Close dropdowns on route change
  useEffect(() => {
    setOpenMenuId(null);
  }, [currentPath]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenMenuId(id);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 150);
  };

  const handleNavClick = (linkId: string, href: string) => {
    setOpenMenuId(null);
    if (linkId === 'home') navigate('/');
    else if (linkId === 'plants') navigate('/plants');
    else if (linkId === 'seeds') navigate('/seeds');
    else if (linkId === 'supplies') navigate('/supplies');
    else if (linkId === 'combos') navigate('/combos');
    else if (linkId === 'track') navigate('/track-order');
    else if (linkId === 'contact') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else if (linkId === 'guide') {
      const el = document.getElementById('tips');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else {
      navigate(href);
    }
  };

  const seedSubItems = [
    {
      labelBn: 'উচ্চ ফলনশীল সবজি বীজ',
      labelEn: 'High-Yield Vegetable Seeds',
      href: '/category/vegetable-seeds',
      icon: Sprout,
    },
    {
      labelBn: 'দেশি ও বিদেশি ফুলের বীজ',
      labelEn: 'Exotic & Native Flower Seeds',
      href: '/category/flower-seeds',
      icon: Flower2,
    },
    {
      labelBn: 'সম্পূর্ণ বীজ কালেকশন',
      labelEn: 'All Certified Organic Seeds',
      href: '/seeds',
      icon: Leaf,
    },
  ];

  const supplySubItems = [
    {
      labelBn: 'প্রিমিয়াম জৈব সার ও মাটি',
      labelEn: 'Organic Fertilizers & Soil Mix',
      href: '/category/fertilizers',
      icon: FlaskConical,
    },
    {
      labelBn: 'বাগান পরিচর্যার টুলস ও কিট',
      labelEn: 'Gardening Tools & Care Kits',
      href: '/category/gardening-tools',
      icon: Shovel,
    },
    {
      labelBn: 'সব বাগান সরঞ্জাম দেখুন',
      labelEn: 'All Gardening Supplies',
      href: '/supplies',
      icon: PackageCheck,
    },
  ];

  return (
    <nav
      className="hidden lg:flex items-center gap-1 shrink-0 relative"
      aria-label="Main"
    >
      {NAV_LINKS.map((link) => {
        const label = isBn ? link.labelBn : link.labelEn;
        const isPlants = link.id === 'plants';
        const isSeeds = link.id === 'seeds';
        const isSupplies = link.id === 'supplies';
        const hasDropdown = isPlants || isSeeds || isSupplies;
        const isDropdownOpen = openMenuId === link.id;

        const isActive =
          (link.id === 'home' && currentPath === '/') ||
          (isPlants && (currentPath === '/plants' || currentPath.startsWith('/category/'))) ||
          (isSeeds && currentPath === '/seeds') ||
          (isSupplies && (currentPath === '/supplies' || currentPath === '/tools')) ||
          (link.id === 'combos' && currentPath === '/combos') ||
          (link.id === 'track' && currentPath === '/track-order');

        const href = isPlants
          ? '/plants'
          : isSeeds
          ? '/seeds'
          : isSupplies
          ? '/supplies'
          : link.href;

        // DesignMingle .v2 .site-header .nav > a / .dd-trigger pill styling
        const pillClassName = `inline-flex items-center gap-1.5 px-4 py-[9px] text-[15px] font-normal whitespace-nowrap shrink-0 rounded-full transition-[background,color] duration-250 cursor-pointer select-none ${
          isActive || isDropdownOpen
            ? 'bg-[#EFEDEE] text-[#121111] dark:bg-[#174D35]/40 dark:text-[#34D399] font-medium'
            : 'text-stone-700 hover:bg-[#EFEDEE] hover:text-[#121111] dark:text-stone-300 dark:hover:bg-[#153427] dark:hover:text-white'
        }`;

        if (hasDropdown) {
          const narrowItems = isSeeds ? seedSubItems : isSupplies ? supplySubItems : [];

          return (
            <div
              key={link.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(link.id)}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={href}
                aria-current={isActive ? 'page' : undefined}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id, href);
                }}
                className={pillClassName}
              >
                <span>{label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    isDropdownOpen ? 'rotate-180 text-[#174D35] dark:text-[#34D399]' : 'text-stone-500 dark:text-stone-400'
                  }`}
                />
              </a>

              {/* Wide 2-Column Botanical Mega Menu (.dd-panel) for Plants */}
              {isPlants && (
                <MegaMenu
                  isOpen={isDropdownOpen}
                  categories={HIERARCHICAL_CATEGORIES}
                  onClose={() => setOpenMenuId(null)}
                  onMouseEnter={() => handleMouseEnter(link.id)}
                  onMouseLeave={handleMouseLeave}
                />
              )}

              {/* Narrow Single-Column Dropdown (.dd-panel.dd-narrow) for Seeds & Supplies */}
              {(isSeeds || isSupplies) && (
                <div
                  role="menu"
                  onMouseEnter={() => handleMouseEnter(link.id)}
                  onMouseLeave={handleMouseLeave}
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-3.5 z-50 transition-all duration-250 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                    isDropdownOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="w-[310px] bg-white dark:bg-[#0C2018] border border-stone-200/80 dark:border-[#1B3B2E] rounded-[24px] p-3 shadow-[0_30px_60px_-24px_rgba(18,17,17,0.28)] flex flex-col gap-1">
                    {narrowItems.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            navigate(item.href);
                          }}
                          className="dm-dd-item w-full flex items-center gap-3 px-2.5 py-2 rounded-[12px] hover:bg-stone-100/85 dark:hover:bg-[#132E22] transition-colors text-left cursor-pointer"
                        >
                          <span className="dm-dd-ico w-[32px] h-[32px] rounded-[9px] bg-[#F2F1F3] dark:bg-[#153427] text-[#3A3540] dark:text-[#34D399] grid place-items-center shrink-0">
                            <IconComp className="w-[16px] h-[16px]" />
                          </span>
                          <b className="text-[14px] font-medium text-stone-900 dark:text-white leading-snug">
                            {isBn ? item.labelBn : item.labelEn}
                          </b>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <a
            key={link.id}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.id, link.href);
            }}
            className={pillClassName}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
