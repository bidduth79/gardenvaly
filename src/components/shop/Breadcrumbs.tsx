/**
 * @file Breadcrumbs.tsx
 * @description Reusable breadcrumb navigation bar for store routing.
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useRouter();
  const { t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-0">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500">
        <li>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:text-[#174D35] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('home')}</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-[#174D35] truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.path && navigate(item.path)}
                  className="hover:text-[#174D35] transition-colors cursor-pointer truncate max-w-[150px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
