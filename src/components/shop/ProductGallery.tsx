/**
 * @file ProductGallery.tsx
 * @description Product image gallery with main view and interactive thumbnails.
 */

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || '');

  return (
    <div className="space-y-4">
      <div className="rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs h-80 sm:h-[420px]">
        <img
          src={selectedImage || images[0]}
          alt={`${name} - botanical view | Gardenvaly`}
          width={600}
          height={420}
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                (selectedImage || images[0]) === img
                  ? 'border-[#174D35] ring-2 ring-[#174D35]/20'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                width={80}
                height={80}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
