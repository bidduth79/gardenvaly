/**
 * @file usePageSeo.ts
 * @description React hook to declare and manage page SEO, titles, social cards, and structured data.
 */

import { useEffect } from 'react';
import { seoManager, ClientSeoOptions } from '../services/seoManager';
import { analyticsService } from '../services/analyticsService';

export function usePageSeo(options: ClientSeoOptions): void {
  useEffect(() => {
    seoManager.updatePageSeo(options);
    analyticsService.trackPageView(options.canonicalPath || window.location.pathname, options.title);
  }, [
    options.title,
    options.description,
    options.canonicalPath,
    options.robots,
    options.ogType,
    options.ogImage,
    options.lang,
    JSON.stringify(options.jsonLd),
  ]);
}
