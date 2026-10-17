/**
 * @file ShopPage.tsx
 * @description Master product listing page supporting categories, filters, sorting, and pagination.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';
import { Product, Category, ProductFilterState, SortOption } from '../types/product';
import { productService } from '../services/productService';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs, BreadcrumbItem } from '../components/shop/Breadcrumbs';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { FilterMobileDrawer } from '../components/shop/FilterMobileDrawer';
import { ShopHeader } from '../components/shop/ShopHeader';
import { ProductCard } from '../components/home/ProductCard';
import { Button } from '../components/common/Button';
import { usePageSeo } from '../hooks/usePageSeo';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_CATEGORIES } from '../data/mockCategories';

export const ShopPage: React.FC = () => {
  const { currentPath, params, navigate } = useRouter();
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Derive initial filter from URL path
  const isSuppliesPath = currentPath === '/supplies' || currentPath === '/tools';
  const [filters, setFilters] = useState<ProductFilterState>({
    type: currentPath === '/plants' ? 'plant' : currentPath === '/seeds' ? 'seed' : isSuppliesPath ? 'tool' : undefined,
    categorySlug: params.slug || undefined,
    sortBy: 'featured',
  });

  useEffect(() => {
    async function loadInitial() {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    }
    loadInitial();
  }, []);

  // Sync route changes with filters
  useEffect(() => {
    if (currentPath === '/plants') setFilters((f) => ({ ...f, type: 'plant', categorySlug: undefined }));
    else if (currentPath === '/seeds') setFilters((f) => ({ ...f, type: 'seed', categorySlug: undefined }));
    else if (currentPath === '/supplies' || currentPath === '/tools') setFilters((f) => ({ ...f, type: 'tool', categorySlug: undefined }));
    else if (params.slug) setFilters((f) => ({ ...f, categorySlug: params.slug }));
  }, [currentPath, params.slug]);

  const activeCategory = useMemo(() => {
    if (!filters.categorySlug) return null;
    return categories.find((c) => c.slug === filters.categorySlug) || null;
  }, [categories, filters.categorySlug]);

  // Execute filtering & sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (filters.type) {
      if (filters.type === 'tool') {
        list = list.filter((p) => p.type === 'tool' || p.type === 'care');
      } else {
        list = list.filter((p) => p.type === filters.type);
      }
    }
    if (filters.categorySlug) list = list.filter((p) => p.categorySlug === filters.categorySlug);
    if (filters.maxPrice) list = list.filter((p) => p.price <= (filters.maxPrice as number));
    if (filters.inStockOnly) list = list.filter((p) => p.inStock && p.stockQuantity > 0);
    if (filters.indoorOutdoor) list = list.filter((p) => p.indoorOutdoor === filters.indoorOutdoor || p.indoorOutdoor === 'both');
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter((p) => (p.nameEn || '').toLowerCase().includes(q) || (p.nameBn || '').includes(q));
    }
    if (filters.sortBy === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sortBy === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (filters.sortBy === 'name-asc') list.sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''));
    else if (filters.sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    else list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    return list;
  }, [products, filters]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Dynamic Page Title & Breadcrumbs
  const pageTitle = activeCategory
    ? language === 'bn' ? activeCategory.nameBn : activeCategory.nameEn
    : filters.type === 'plant'
    ? t('plantsOnly')
    : filters.type === 'seed'
    ? t('seedsOnly')
    : filters.type === 'tool'
    ? (language === 'bn' ? 'বাগান সামগ্রী ও সরঞ্জাম' : 'Gardening Supplies & Tools')
    : t('allProducts');

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('shop'), path: '/shop' },
    ...(activeCategory ? [{ label: pageTitle }] : [{ label: pageTitle }]),
  ];

  const seoTitle = activeCategory
    ? language === 'bn'
      ? `${activeCategory.nameBn} — সংগ্রহ | Gardenvaly (by Hasna Hena)`
      : `${activeCategory.nameEn} Collection | Gardenvaly by Hasna Hena`
    : filters.type === 'plant'
    ? language === 'bn'
      ? `তাজা গাছের সংগ্রহশালা | Gardenvaly — by Hasna Hena`
      : `Live Plants Nursery Collection | Gardenvaly by Hasna Hena`
    : filters.type === 'seed'
    ? language === 'bn'
      ? `উন্নত জাতের শাকসবজি ও ফুলের বীজ | Gardenvaly — by Hasna Hena`
      : `High-Yield Vegetable & Flower Seeds | Gardenvaly by Hasna Hena`
    : filters.type === 'tool'
    ? language === 'bn'
      ? `প্রয়োজনীয় বাগান সামগ্রী ও গার্ডেনিং টুলস | Gardenvaly — by Hasna Hena`
      : `Essential Gardening Supplies & Tools | Gardenvaly by Hasna Hena`
    : language === 'bn'
    ? `গাছ ও অর্গানিক বীজের অনলাইন সংগ্রহ | Gardenvaly — by Hasna Hena`
    : `Shop Live Plants & Organic Seeds | Gardenvaly by Hasna Hena`;

  const seoDescription = activeCategory
    ? language === 'bn'
      ? activeCategory.descriptionBn
      : activeCategory.descriptionEn
    : filters.type === 'plant'
    ? language === 'bn'
      ? 'এয়ার-পিউরিফায়িং ইনডোর গাছ, বারান্দার চারা ও ছাদবাগানের সতেজ গাছপালা সংগ্রহ করুন খাঁটি নার্সারি গার্ডেনভ্যালিতে।'
      : 'Explore healthy, well-rooted air-purifying indoor plants and vibrant patio greenery.'
    : filters.type === 'seed'
    ? language === 'bn'
      ? 'উচ্চ অঙ্কুরোদগম ক্ষমতাসম্পন্ন দেশি-বিদেশি শাকসবজি ও বাহারি ফুলের খাঁটি অর্গানিক বীজ সংগ্রহ করুন।'
      : 'Authentic high-germination heirloom and hybrid vegetable, herb, and flower seeds.'
    : filters.type === 'tool'
    ? language === 'bn'
      ? 'ছাদবাগান ও গাছের পরম যত্নে প্রিমিয়াম কাঁচি, স্প্রেয়ার, খাঁটি কেঁচো সার, কোকোপিট ও টব সংগ্রহ করুন।'
      : 'Discover heavy-duty pruning shears, 2L pressure sprayers, organic vermicompost, and planter pots.'
    : language === 'bn'
    ? 'গার্ডেনভ্যালির সম্পূর্ণ ক্যাটালগ — ইনডোর গাছ, বারান্দার চারা ও খাঁটি বীজ অর্ডার করুন ক্যাশ অন ডেলিভারিতে।'
    : "Browse Gardenvaly's curated catalog of premium nursery plants, botanical foliage, and certified organic seeds.";

  const canonicalPath = activeCategory
    ? `/category/${activeCategory.slug}`
    : filters.type === 'plant'
    ? '/plants'
    : filters.type === 'seed'
    ? '/seeds'
    : filters.type === 'tool'
    ? '/supplies'
    : '/shop';

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    canonicalPath,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: activeCategory?.imageUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&h=630&q=85',
    lang: language,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'bn' ? 'হোম' : 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: language === 'bn' ? 'শপ' : 'Shop', item: '/shop' },
          ...(activeCategory
            ? [{ '@type': 'ListItem', position: 3, name: pageTitle, item: `/category/${activeCategory.slug}` }]
            : []),
        ],
      },
    ],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex gap-8 mt-4">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={(u) => setFilters((prev) => ({ ...prev, ...u }))}
            onClearFilters={() => setFilters({ sortBy: 'featured' })}
          />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">
          <ShopHeader
            title={pageTitle}
            totalResults={filteredProducts.length}
            searchQuery={filters.searchQuery || ''}
            sortBy={filters.sortBy}
            onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
            onSortChange={(s) => setFilters((prev) => ({ ...prev, sortBy: s }))}
            onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl mx-auto flex items-center justify-center text-stone-400 mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-stone-800 text-base">{t('noProductsFound')}</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {t('filterEmptyHelp')}
              </p>
              <div className="mt-5">
                <Button variant="outline" size="sm" onClick={() => setFilters({ sortBy: 'featured' })}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {t('clearFilters')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {displayedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={() => navigate(`/product/${p.slug}`)}
                  />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="mt-10 text-center">
                  <Button variant="outline" size="md" onClick={() => setVisibleCount((c) => c + 6)}>
                    {t('loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FilterMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={categories}
        filters={filters}
        onFilterChange={(u) => setFilters((prev) => ({ ...prev, ...u }))}
        onClearFilters={() => setFilters({ sortBy: 'featured' })}
      />
    </div>
  );
};
