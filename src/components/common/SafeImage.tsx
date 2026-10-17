import React, { useState, useEffect } from 'react';
import {
  getSafeImageUrl,
  getProductFallbackImage,
  BOTANICAL_SVG_FALLBACK,
} from '../../utils/imageFallback';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: string;
  categorySlug?: string;
  category?: string;
  customFallback?: string;
}

/**
 * SafeImage component for Gardenvaly.
 * Automatically provides guaranteed fallback image if:
 * 1. src is undefined, null, or empty string.
 * 2. image fails to load (404, network error, broken link) via onError.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Gardenvaly Product',
  fallbackType,
  categorySlug,
  category,
  customFallback,
  className = '',
  onError,
  ...rest
}) => {
  const fallback =
    customFallback ||
    getProductFallbackImage({
      type: fallbackType,
      categorySlug,
      category,
    }) ||
    BOTANICAL_SVG_FALLBACK;

  const initialSrc = getSafeImageUrl(src, {
    type: fallbackType,
    categorySlug,
    category,
  });

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const resolved = getSafeImageUrl(src, {
      type: fallbackType,
      categorySlug,
      category,
    });
    setImgSrc(resolved);
    setHasError(false);
  }, [src, fallbackType, categorySlug, category]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
};

export default SafeImage;
