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
import { useShopPageSeo } from '../hooks/useShopPageSeo';
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
    Promise.all([productService.getCategories(), productService.getProducts()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  }, []);

  // Sync route changes with filters
  useEffect(() => {
    if (currentPath === '/plants') setFilters((f) => ({ ...f, type: 'plant', categorySlug: undefined, categorySlugs: [] }));
    else if (currentPath === '/seeds') setFilters((f) => ({ ...f, type: 'seed', categorySlug: undefined, categorySlugs: [] }));
    else if (currentPath === '/supplies' || currentPath === '/tools') setFilters((f) => ({ ...f, type: 'tool', categorySlug: undefined, categorySlugs: [] }));
    else if (params.slug) setFilters((f) => ({ ...f, categorySlug: params.slug, categorySlugs: [params.slug] }));
  }, [currentPath, params.slug]);

  const activeCategory = useMemo(() => {
    const slug = filters.categorySlug || (filters.categorySlugs && filters.categorySlugs.length === 1 ? filters.categorySlugs[0] : null);
    if (!slug) return null;
    return categories.find((c) => c.slug === slug) || null;
  }, [categories, filters.categorySlug, filters.categorySlugs]);

  // Execute filtering & sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (filters.type) {
      list = list.filter((p) => filters.type === 'tool' ? (p.type === 'tool' || p.type === 'care') : p.type === filters.type);
    }
    if (filters.categorySlugs && filters.categorySlugs.length > 0) {
      list = list.filter((p) => {
        return filters.categorySlugs!.includes(p.categorySlug) ||
          (p.subcategorySlug && filters.categorySlugs!.includes(p.subcategorySlug)) ||
          (filters.categorySlugs!.includes('baromasi-fruit-plants') && (p.nameBn.includes('লেবু') || p.tagsBn?.some((t) => t.includes('বারোমাসি')))) ||
          (filters.categorySlugs!.includes('deshi-fruit-plants') && (p.nameBn.includes('আম') || p.tagsBn?.some((t) => t.includes('দেশি')))) ||
          (filters.categorySlugs!.includes('fragrant-flowers') && (p.nameBn.includes('জুঁই') || p.nameBn.includes('গোলাপ'))) ||
          (filters.categorySlugs!.includes('indoor-plants') && (p.indoorOutdoor === 'indoor' || p.tagsBn?.some((t) => t.includes('ইনডোর')))) ||
          (filters.categorySlugs!.includes('outdoor-plants') && (p.indoorOutdoor === 'outdoor' || p.tagsBn?.some((t) => t.includes('আউটডোর'))));
      });
    } else if (filters.categorySlug) {
      list = list.filter((p) => p.categorySlug === filters.categorySlug || p.subcategorySlug === filters.categorySlug);
    }
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

  const pageTitle = activeCategory
    ? (language === 'bn' ? activeCategory.nameBn : activeCategory.nameEn)
    : filters.type === 'plant' ? t('plantsOnly') : filters.type === 'seed' ? t('seedsOnly')
    : filters.type === 'tool' ? (language === 'bn' ? 'বাগান সামগ্রী ও সরঞ্জাম' : 'Gardening Supplies & Tools') : t('allProducts');

  const breadcrumbs: BreadcrumbItem[] = [{ label: t('shop'), path: '/shop' }, { label: pageTitle }];

  useShopPageSeo({
    activeCategory,
    type: filters.type,
    pageTitle,
    language,
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
            categories={categories}
            selectedCategorySlugs={filters.categorySlugs || (filters.categorySlug ? [filters.categorySlug] : [])}
            onToggleCategorySlug={(slug) => {
              const cur = filters.categorySlugs || (filters.categorySlug ? [filters.categorySlug] : []);
              const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
              setFilters((prev) => ({ ...prev, categorySlugs: next, categorySlug: next.length === 1 ? next[0] : undefined }));
            }}
            onRemoveCategorySlug={(slug) => {
              const cur = filters.categorySlugs || (filters.categorySlug ? [filters.categorySlug] : []);
              const next = cur.filter((s) => s !== slug);
              setFilters((prev) => ({ ...prev, categorySlugs: next, categorySlug: next.length === 1 ? next[0] : undefined }));
            }}
            onClearCategorySlugs={() => setFilters((prev) => ({ ...prev, categorySlugs: [], categorySlug: undefined }))}
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl mx-auto flex items-center justify-center text-stone-400 mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-stone-800 text-base">{t('noProductsFound')}</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">{t('filterEmptyHelp')}</p>
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
                  <ProductCard key={p.id} product={p} />
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
