/**
 * @file seoManager.ts
 * @description Client-side DOM head metadata and Schema.org structured data manager
 * for seamless Single Page Application transitions.
 */

export interface ClientSeoOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: 'index, follow' | 'noindex, nofollow';
  ogType?: 'website' | 'product';
  ogImage?: string;
  lang?: 'bn' | 'en';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&h=630&q=85';

class SeoManager {
  private getOrCreateMeta(attrName: 'name' | 'property', attrValue: string): HTMLMetaElement {
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    return el;
  }

  private getOrCreateLink(rel: string, hreflang?: string): HTMLLinkElement {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let el = document.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      if (hreflang) el.setAttribute('hreflang', hreflang);
      document.head.appendChild(el);
    }
    return el;
  }

  /**
   * Synchronize all relevant document head tags with the active page state.
   */
  public updatePageSeo(options: ClientSeoOptions): void {
    if (typeof document === 'undefined') return;

    const {
      title,
      description,
      canonicalPath = window.location.pathname,
      robots = 'index, follow',
      ogType = 'website',
      ogImage = DEFAULT_IMAGE,
      lang = 'bn',
      jsonLd,
    } = options;

    // 1. Document title & html lang
    document.title = title;
    document.documentElement.lang = lang;

    // 2. Standard Meta Tags
    const metaDesc = this.getOrCreateMeta('name', 'description');
    metaDesc.content = description;

    const metaRobots = this.getOrCreateMeta('name', 'robots');
    metaRobots.content = robots;

    // 3. Canonical and Hreflang URLs
    const origin = window.location.origin;
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${origin}${cleanPath.split('?')[0]}`;

    const canonicalLink = this.getOrCreateLink('canonical');
    canonicalLink.href = canonicalUrl;

    const hreflangBn = this.getOrCreateLink('alternate', 'bn');
    hreflangBn.href = `${canonicalUrl}?lang=bn`;

    const hreflangEn = this.getOrCreateLink('alternate', 'en');
    hreflangEn.href = `${canonicalUrl}?lang=en`;

    const hreflangDefault = this.getOrCreateLink('alternate', 'x-default');
    hreflangDefault.href = canonicalUrl;

    // 4. OpenGraph Tags
    this.getOrCreateMeta('property', 'og:site_name').content = 'Gardenvaly by Hasna Hena';
    this.getOrCreateMeta('property', 'og:type').content = ogType;
    this.getOrCreateMeta('property', 'og:title').content = title;
    this.getOrCreateMeta('property', 'og:description').content = description;
    this.getOrCreateMeta('property', 'og:url').content = canonicalUrl;
    this.getOrCreateMeta('property', 'og:image').content = ogImage;
    this.getOrCreateMeta('property', 'og:locale').content = lang === 'bn' ? 'bn_BD' : 'en_US';
    this.getOrCreateMeta('property', 'og:locale:alternate').content = lang === 'bn' ? 'en_US' : 'bn_BD';

    // 5. Twitter Tags
    this.getOrCreateMeta('name', 'twitter:card').content = 'summary_large_image';
    this.getOrCreateMeta('name', 'twitter:title').content = title;
    this.getOrCreateMeta('name', 'twitter:description').content = description;
    this.getOrCreateMeta('name', 'twitter:image').content = ogImage;

    // 6. JSON-LD Structured Data
    let schemaEl = document.getElementById('gardenvaly-schema') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = 'gardenvaly-schema';
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      const serialized = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemaEl.textContent = JSON.stringify(serialized).replace(/</g, '\\u003c');
    } else if (schemaEl) {
      schemaEl.remove();
    }
  }
}

export const seoManager = new SeoManager();
