/**
 * @file CategoryIcon.tsx
 * @description Standardized botanical and category vector icon renderer.
 */

import React from 'react';
import { TreeDeciduous, Flower2, Leaf, Sprout, Wrench } from 'lucide-react';
import { CategoryIconType } from '../../types/product';

export interface CategoryIconProps {
  icon?: CategoryIconType;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  className = 'w-4 h-4 text-stone-600 shrink-0',
}) => {
  switch (icon) {
    case 'tree':
      return <TreeDeciduous className={className} />;
    case 'flower':
      return <Flower2 className={className} />;
    case 'potted':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 14h10l-1.5 7h-7L7 14z" />
          <path d="M12 14v-6" />
          <path d="M12 8a4 4 0 0 0-4-4c0 2.2 1.8 4 4 4z" />
          <path d="M12 11a4 4 0 0 1 4-4c0 2.2-1.8 4-4 4z" />
        </svg>
      );
    case 'leaf':
      return <Leaf className={className} />;
    case 'tool':
      return <Wrench className={className} />;
    case 'seed':
    default:
      return <Sprout className={className} />;
  }
};
