/**
 * @file seoService.ts
 * @description Server-side SEO service providing dynamic robots.txt, XML sitemap generation,
 * metadata extraction, Open Graph / Twitter tags, and Schema.org JSON-LD generation
 * for Gardenvaly — by Hasna Hena.
 */

import { db, type DBProduct, type DBCategory} from '../db/database.ts';
import { ENV} from '../config/env.ts';

export interface PageSeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType: 'website' | 'product';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard: 'summary_large_image' | 'summary';
  lang: 'bn' | 'en';
  hreflang: {
    bn: string;
    en: string;
    xDefault: string;
  };
  jsonLd: Record<string, unknown>[];
  statusCode?: number;
}

const BRAND_NAME = 'Gardenvaly';
const BRAND_SIGNATURE = 'by Hasna Hena';
const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&h=630&q=85';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class SeoService {
  /**
   * Determine the absolute base URL based on environment or incoming request.
   */
  public getBaseUrl(req?: { protocol?: string; get?: (header: string) => string | undefined }): string {
    const envAppUrl = process.env.APP_URL;
    if (envAppUrl && envAppUrl !== 'MY_APP_URL' && envAppUrl.startsWith('http')) {
      return envAppUrl.replace(/\/+$/, '');
    }

    if (req && req.get) {
      const host = req.get('host');
      const proto = req.protocol || 'http';
      if (host) {
        return `${proto}://${host}`.replace(/\/+$/, '');
      }
    }

    return 'https://gardenvaly.com';
  }

  /**
   * Generate standards-compliant robots.txt.
   */
  public generateRobotsTxt(baseUrl: string): string {
    return [
      '# Robots directives for Gardenvaly — by Hasna Hena',
      'User-agent: *',
      'Allow: /',
      'Allow: /shop',
      'Allow: /plants',
      'Allow: /seeds',
      'Allow: /category/',
      'Allow: /product/',
      'Allow: /dist/',
      'Allow: /assets/',
      'Allow: /src/',
      '',
      '# Private customer & administrative portal protection',
      'Disallow: /admin',
      'Disallow: /admin/',
      'Disallow: /cart',
      'Disallow: /checkout',
      'Disallow: /api/',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
      '',
    ].join('\n');
  }

  /**
   * Dynamically build XML sitemap indexing all published products, categories, and public landing pages.
   */
  public generateSitemapXml(baseUrl: string): string {
    try {
      const products = db.getProducts({ publishedOnly: true });
      const categories = db.getCategories();

      // Collect URLs
      interface SitemapEntry {
        loc: string;
        lastmod?: string;
        changefreq: 'daily' | 'weekly' | 'monthly';
        priority: string;
      }

      const entries: SitemapEntry[] = [
        {
          loc: `${baseUrl}/`,
          changefreq: 'daily',
          priority: '1.0',
        },
        {
          loc: `${baseUrl}/shop`,
          changefreq: 'daily',
          priority: '0.9',
        },
        {
          loc: `${baseUrl}/plants`,
          changefreq: 'daily',
          priority: '0.9',
        },
        {
          loc: `${baseUrl}/seeds`,
          changefreq: 'daily',
          priority: '0.9',
        },
      ];

      // Add category routes
      for (const cat of categories) {
        if (cat.isActive) {
          entries.push({
            loc: `${baseUrl}/category/${cat.slug}`,
            lastmod: cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : undefined,
            changefreq: 'weekly',
            priority: '0.8',
          });
        }
      }

      // Add published product routes
      for (const prod of products) {
        if (prod.isPublished) {
          const modDate = prod.updatedAt || prod.createdAt;
          entries.push({
            loc: `${baseUrl}/product/${prod.slug}`,
            lastmod: modDate ? new Date(modDate).toISOString().split('T')[0] : undefined,
            changefreq: 'weekly',
            priority: '0.8',
          });
        }
      }

      const xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ];

      for (const entry of entries) {
        xmlLines.push('  <url>');
        xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
        if (entry.lastmod) {
          xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
        }
        xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
        xmlLines.push(`    <priority>${entry.priority}</priority>`);
        // Bilingual alternate annotations
        const cleanBase = entry.loc;
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="bn" href="${escapeXml(cleanBase)}?lang=bn"/>`
        );
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(cleanBase)}?lang=en"/>`
        );
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(cleanBase)}"/>`
        );
        xmlLines.push('  </url>');
      }

      xmlLines.push('</urlset>');
      return xmlLines.join('\n');
    } catch (err) {
      console.error('[SEO] Error building XML sitemap:', err);
      // Fallback safe minimum sitemap
      return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url><loc>${escapeXml(baseUrl)}/</loc><priority>1.0</priority></url>`,
        `  <url><loc>${escapeXml(baseUrl)}/shop</loc><priority>0.9</priority></url>`,
        '</urlset>',
      ].join('\n');
    }
  }

  /**
   * Compute structured metadata for a specific route and language.
   */
  public getPageSeoData(pathname: string, lang: 'bn' | 'en' = 'bn', baseUrl: string): PageSeoData {
    const cleanPath = pathname.split('?')[0] || '/';
    const settings = db.getSettings();

    // Default hreflang map
    const makeHreflang = (path: string) => ({
      bn: `${baseUrl}${path}?lang=bn`,
      en: `${baseUrl}${path}?lang=en`,
      xDefault: `${baseUrl}${path}`,
    });

    // 1. Organization / OnlineStore Schema
    const organizationSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
      alternateName: [BRAND_NAME, settings.storeNameBn || 'গার্ডেনভ্যালি'],
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description:
        lang === 'bn'
          ? 'স্বাস্থ্যকর ইনডোর-আউটডোর গাছ ও প্রিমিয়াম খাঁটি অর্গানিক বীজের নার্সারি গার্ডেনভ্যালি। সবুজে সাজুক জীবন।'
          : 'Gardenvaly by Hasna Hena — Premium nursery for healthy indoor plants, outdoor foliage, and organic seeds.',
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      priceRange: '৳৳',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
    };

    // 2. WebSite Schema with SearchAction
    const websiteSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    // Private / Non-indexable routes
    if (cleanPath.startsWith('/admin') || cleanPath === '/cart' || cleanPath === '/checkout') {
      const title = cleanPath.startsWith('/admin')
        ? `Gardenvaly Portal | Admin Management`
        : cleanPath === '/cart'
        ? lang === 'bn'
          ? `শপিং কার্ট | ${BRAND_NAME}`
          : `Shopping Cart | ${BRAND_NAME}`
        : lang === 'bn'
        ? `নিরাপদ চেকআউট | ${BRAND_NAME}`
        : `Secure Checkout | ${BRAND_NAME}`;

      return {
        title,
        description: 'Private customer or management area. Authorized access only.',
        canonicalUrl: `${baseUrl}${cleanPath}`,
        robots: 'noindex, nofollow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: 'Private customer or management area.',
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: 'summary',
        lang,
        hreflang: makeHreflang(cleanPath),
        jsonLd: [],
      };
    }

    // Product Detail Page: /product/:slug
    if (cleanPath.startsWith('/product/')) {
      const slug = cleanPath.replace('/product/', '').split('/')[0];
      const product = db.findProductBySlug(slug);

      if (!product || !product.isPublished) {
        return {
          title: lang === 'bn' ? `পণ্য পাওয়া যায়নি | ${BRAND_NAME}` : `Product Not Found | ${BRAND_NAME}`,
          description:
            lang === 'bn'
              ? 'অনুরোধকৃত গাছ বা বীজটি বর্তমানে পাওয়া যাচ্ছে না।'
              : 'The requested botanical item is not currently available.',
          canonicalUrl: `${baseUrl}${cleanPath}`,
          robots: 'noindex, nofollow',
          ogType: 'website',
          ogTitle: `Product Not Found | ${BRAND_NAME}`,
          ogDescription: 'The requested plant or seed item was not found.',
          ogImage: DEFAULT_HERO_IMAGE,
          twitterCard: 'summary',
          lang,
          hreflang: makeHreflang(cleanPath),
          jsonLd: [],
          statusCode: 404,
        };
      }

      const name = lang === 'bn' ? product.nameBn : product.nameEn;
      const desc =
        (lang === 'bn' ? product.descriptionBn : product.descriptionEn) ||
        (lang === 'bn' ? product.nameBn : product.nameEn);
      const title =
        lang === 'bn'
          ? `${product.nameBn} (${product.nameEn}) | ${BRAND_NAME} ${BRAND_SIGNATURE}`
          : `${product.nameEn}${product.botanicalName ? ` – ${product.botanicalName}` : ''} | ${BRAND_NAME}`;
      const canonical = `${baseUrl}/product/${product.slug}`;
      const img = product.imageUrl || (product.images && product.images[0]) || DEFAULT_HERO_IMAGE;

      // Product Schema
      const productSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        image: product.images && product.images.length > 0 ? product.images : [img],
        description: desc,
        sku: product.SKU,
        brand: {
          '@type': 'Brand',
          name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
        },
        offers: {
          '@type': 'Offer',
          url: canonical,
          priceCurrency: 'BDT',
          price: product.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability:
            product.inStock && product.stockQuantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
          },
        },
      };

      // Only include rating if genuine review data exists
      if (product.rating && product.reviewsCount && product.reviewsCount > 0) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount,
        };
      }

      // BreadcrumbList Schema
      const breadcrumbSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'bn' ? 'হোম' : 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'bn' ? 'শপ' : 'Shop',
            item: `${baseUrl}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.category,
            item: `${baseUrl}/category/${product.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name,
            item: canonical,
          },
        ],
      };

      return {
        title,
        description: desc.slice(0, 160),
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'product',
        ogTitle: title,
        ogDescription: desc.slice(0, 160),
        ogImage: img,
        twitterCard: 'summary_large_image',
        lang,
        hreflang: makeHreflang(`/product/${product.slug}`),
        jsonLd: [productSchema, breadcrumbSchema],
      };
    }

    // Category Page: /category/:slug
    if (cleanPath.startsWith('/category/')) {
      const slug = cleanPath.replace('/category/', '').split('/')[0];
      const categories = db.getCategories();
      const cat = categories.find((c) => c.slug === slug);

      if (!cat) {
        return {
          title: lang === 'bn' ? `ক্যাটাগরি পাওয়া যায়নি | ${BRAND_NAME}` : `Category Not Found | ${BRAND_NAME}`,
          description: 'The requested product category was not found.',
          canonicalUrl: `${baseUrl}${cleanPath}`,
          robots: 'noindex, nofollow',
          ogType: 'website',
          ogTitle: `Category Not Found | ${BRAND_NAME}`,
          ogDescription: 'The requested product category was not found.',
          ogImage: DEFAULT_HERO_IMAGE,
          twitterCard: 'summary',
          lang,
          hreflang: makeHreflang(cleanPath),
          jsonLd: [],
          statusCode: 404,
        };
      }

      const name = lang === 'bn' ? cat.nameBn : cat.nameEn;
      const desc =
        (lang === 'bn' ? cat.descriptionBn : cat.descriptionEn) ||
        (lang === 'bn'
          ? `${name} ক্যাটাগরির স্বাস্থ্যকর গাছ ও খাঁটি বীজ অর্ডার করুন গার্ডেনভ্যালিতে।`
          : `Explore our collection of ${name} plants and seeds at Gardenvaly.`);
      const title =
        lang === 'bn'
          ? `${cat.nameBn} — সংগ্রহ | ${BRAND_NAME} (by Hasna Hena)`
          : `${cat.nameEn} Collection | ${BRAND_NAME} by Hasna Hena`;
      const canonical = `${baseUrl}/category/${cat.slug}`;
      const img = cat.imageUrl || DEFAULT_HERO_IMAGE;

      const breadcrumbSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'bn' ? 'হোম' : 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'bn' ? 'শপ' : 'Shop',
            item: `${baseUrl}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: canonical,
          },
        ],
      };

      return {
        title,
        description: desc.slice(0, 160),
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: desc.slice(0, 160),
        ogImage: img,
        twitterCard: 'summary_large_image',
        lang,
        hreflang: makeHreflang(`/category/${cat.slug}`),
        jsonLd: [breadcrumbSchema],
      };
    }

    // Specific Shop Section: /plants
    if (cleanPath === '/plants') {
      const title =
        lang === 'bn'
          ? `তাজা গাছের সংগ্রহশালা | ${BRAND_NAME} — by Hasna Hena`
          : `Live Plants Nursery Collection | ${BRAND_NAME} by Hasna Hena`;
      const desc =
        lang === 'bn'
          ? 'এয়ার-পিউরিফায়িং ইনডোর গাছ, বারান্দার চারা ও ছাদবাগানের সতেজ গাছপালা সংগ্রহ করুন খাঁটি নার্সারি গার্ডেনভ্যালিতে।'
          : 'Explore healthy, well-rooted air-purifying indoor plants and vibrant patio greenery by Hasna Hena.';

      return {
        title,
        description: desc,
        canonicalUrl: `${baseUrl}/plants`,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: desc,
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: 'summary_large_image',
        lang,
        hreflang: makeHreflang('/plants'),
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: lang === 'bn' ? 'হোম' : 'Home', item: `${baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: lang === 'bn' ? 'গাছপালা' : 'Plants', item: `${baseUrl}/plants` },
            ],
          },
        ],
      };
    }

    // Specific Shop Section: /seeds
    if (cleanPath === '/seeds') {
      const title =
        lang === 'bn'
          ? `উন্নত জাতের শাকসবজি ও ফুলের বীজ | ${BRAND_NAME} — by Hasna Hena`
          : `High-Yield Vegetable & Flower Seeds | ${BRAND_NAME} by Hasna Hena`;
      const desc =
        lang === 'bn'
          ? 'উচ্চ অঙ্কুরোদগম ক্ষমতাসম্পন্ন দেশি-বিদেশি শাকসবজি ও বাহারি ফুলের খাঁটি অর্গানিক বীজ সংগ্রহ করুন।'
          : 'Authentic high-germination heirloom and hybrid vegetable, herb, and flower seeds delivered nationwide.';

      return {
        title,
        description: desc,
        canonicalUrl: `${baseUrl}/seeds`,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: desc,
        ogImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&h=630&q=85',
        twitterCard: 'summary_large_image',
        lang,
        hreflang: makeHreflang('/seeds'),
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: lang === 'bn' ? 'হোম' : 'Home', item: `${baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: lang === 'bn' ? 'বীজ' : 'Seeds', item: `${baseUrl}/seeds` },
            ],
          },
        ],
      };
    }

    // Full Catalog Shop: /shop
    if (cleanPath === '/shop') {
      const title =
        lang === 'bn'
          ? `গাছ ও অর্গানিক বীজের অনলাইন সংগ্রহ | ${BRAND_NAME} — by Hasna Hena`
          : `Shop Live Plants & Organic Seeds | ${BRAND_NAME} by Hasna Hena`;
      const desc =
        lang === 'bn'
          ? 'গার্ডেনভ্যালির সম্পূর্ণ ক্যাটালগ — ইনডোর গাছ, বারান্দার চারা ও খাঁটি বীজ অর্ডার করুন ক্যাশ অন ডেলিভারিতে।'
          : "Browse Gardenvaly's curated catalog of premium nursery plants, botanical foliage, and certified organic seeds.";

      return {
        title,
        description: desc,
        canonicalUrl: `${baseUrl}/shop`,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: desc,
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: 'summary_large_image',
        lang,
        hreflang: makeHreflang('/shop'),
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: lang === 'bn' ? 'হোম' : 'Home', item: `${baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: lang === 'bn' ? 'শপ' : 'Shop', item: `${baseUrl}/shop` },
            ],
          },
        ],
      };
    }

    // Default: Homepage (/)
    const title =
      lang === 'bn'
        ? `${BRAND_NAME} — গার্ডেনভ্যালি | সবুজে সাজুক জীবন (${BRAND_SIGNATURE})`
        : `${BRAND_NAME} ${BRAND_SIGNATURE} | Grow Green, Live Beautiful`;
    const desc =
      lang === 'bn'
        ? 'স্বাস্থ্যকর ইনডোর-আউটডোর গাছ ও প্রিমিয়াম কোয়ালিটির খাঁটি অর্গানিক বীজের বিশ্বস্ত নার্সারি গার্ডেনভ্যালি। সবুজে সাজুক জীবন।'
        : 'Premium nursery for healthy indoor plants, outdoor shrubs, and authentic high-yield organic seeds in Bangladesh. Grow green, live beautiful.';

    return {
      title,
      description: desc,
      canonicalUrl: `${baseUrl}/`,
      robots: 'index, follow',
      ogType: 'website',
      ogTitle: title,
      ogDescription: desc,
      ogImage: DEFAULT_HERO_IMAGE,
      twitterCard: 'summary_large_image',
      lang,
      hreflang: makeHreflang('/'),
      jsonLd: [organizationSchema, websiteSchema],
    };
  }

  /**
   * Injects comprehensive SEO tags, meta directives, and JSON-LD schema into the HTML string.
   */
  public injectSeoIntoHtml(html: string, seo: PageSeoData): string {
    let result = html;

    // 1. Sync Document Language
    result = result.replace(/<html(\s+[^>]*)?>/i, `<html lang="${seo.lang}">`);

    // 2. Sync Title
    const titleTag = `<title>${escapeHtml(seo.title)}</title>`;
    if (/<title>.*?<\/title>/is.test(result)) {
      result = result.replace(/<title>.*?<\/title>/is, titleTag);
    } else {
      result = result.replace('</head>', `  ${titleTag}\n</head>`);
    }

    // 3. Remove existing meta/link tags that will be replaced
    result = result
      .replace(/<meta\s+name="description"[^>]*>/gi, '')
      .replace(/<meta\s+name="robots"[^>]*>/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
      .replace(/<link\s+rel="alternate"\s+hreflang=[^>]*>/gi, '')
      .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
      .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
      .replace(/<script\s+id="gardenvaly-schema"[^>]*>.*?<\/script>/gis, '')
      .replace(/<meta\s+name="google-site-verification"[^>]*>/gi, '');

    // 4. Build Replacement Head Chunk
    const safeJsonLd = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');
    const verificationTag = ENV.GOOGLE_SITE_VERIFICATION
      ? `  <meta name="google-site-verification" content="${escapeHtml(ENV.GOOGLE_SITE_VERIFICATION)}" />\n`
      : '';

    const newHeadTags = [
      `  <meta name="description" content="${escapeHtml(seo.description)}" />`,
      `  <meta name="robots" content="${seo.robots}" />`,
      `  <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
      `  <link rel="alternate" hreflang="bn" href="${escapeHtml(seo.hreflang.bn)}" />`,
      `  <link rel="alternate" hreflang="en" href="${escapeHtml(seo.hreflang.en)}" />`,
      `  <link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.hreflang.xDefault)}" />`,
      `  <meta property="og:site_name" content="${BRAND_NAME} ${BRAND_SIGNATURE}" />`,
      `  <meta property="og:type" content="${seo.ogType}" />`,
      `  <meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
      `  <meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
      `  <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`,
      `  <meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
      `  <meta property="og:locale" content="${seo.lang === 'bn' ? 'bn_BD' : 'en_US'}" />`,
      `  <meta property="og:locale:alternate" content="${seo.lang === 'bn' ? 'en_US' : 'bn_BD'}" />`,
      `  <meta name="twitter:card" content="${seo.twitterCard}" />`,
      `  <meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />`,
      `  <meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />`,
      `  <meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
      verificationTag.trim(),
      `  <script id="gardenvaly-schema" type="application/ld+json">${safeJsonLd}</script>`,
    ]
      .filter(Boolean)
      .join('\n');

    result = result.replace('</head>', `${newHeadTags}\n</head>`);
    return result;
  }
}

export const seoService = new SeoService();
