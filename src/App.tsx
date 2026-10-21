/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * @file App.tsx
 * @description Master application router and layout shell for Gardenvaly by Hasna Hena.
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ShopByCategory } from './components/home/ShopByCategory';
import { FeaturedPlants } from './components/home/FeaturedPlants';
import { FeaturedSeeds } from './components/home/FeaturedSeeds';
import { FeaturedSupplies } from './components/home/FeaturedSupplies';
import { PromotionalBanner } from './components/home/PromotionalBanner';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { GardeningTips } from './components/home/GardeningTips';
import { CustomerReviews } from './components/home/CustomerReviews';
import { NewsletterSection } from './components/home/NewsletterSection';
import { SearchDrawer } from './components/home/SearchDrawer';
import { CartDrawer } from './components/home/CartDrawer';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FloatingWhatsAppWidget } from './components/common/FloatingWhatsAppWidget';
import { LivingTreeBackground } from './components/common/LivingTreeBackground';
import { LivingTreeIndicator } from './components/common/LivingTreeIndicator';
import { SeedToTreeJourney } from './components/home/SeedToTreeJourney';
import { productService } from './services/productService';
import { Product, Category } from './types/product';
import { loggerService } from './services/loggerService';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { PlantCompareModal } from './components/home/PlantCompareModal';
import { OfflineIndicator } from './components/common/PWAInstallButton';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

import { useLanguage } from './context/LanguageContext';
import { usePageSeo } from './hooks/usePageSeo';
import { analyticsService } from './services/analyticsService';
import { MOCK_TIPS } from './data/mockTips';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { MOCK_CATEGORIES } from './data/mockCategories';

const MainShell: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    analyticsService.init();
    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        loggerService.error('Failed to load initial data in MainShell', err, 'App');
      }
    }
    loadData();
  }, []);

  // Synchronize homepage and admin portal SEO
  const isHome = currentPath === '/';
  const isAdmin = currentPath.startsWith('/admin');

  usePageSeo({
    title: isAdmin
      ? 'Gardenvaly Admin Portal'
      : language === 'bn'
      ? 'Gardenvaly — গার্ডেনভ্যালি | সবুজে সাজুক জীবন (by Hasna Hena)'
      : 'Gardenvaly by Hasna Hena | Grow Green, Live Beautiful',
    description:
      language === 'bn'
        ? 'স্বাস্থ্যকর ইনডোর-আউটডোর গাছ ও প্রিমিয়াম কোয়ালিটির খাঁটি অর্গানিক বীজের বিশ্বস্ত নার্সারি গার্ডেনভ্যালি। সবুজে সাজুক জীবন।'
        : 'Premium nursery for healthy indoor plants, outdoor shrubs, and authentic high-yield organic seeds in Bangladesh. Grow green, live beautiful.',
    canonicalPath: isHome ? '/' : currentPath,
    robots: isAdmin ? 'noindex, nofollow' : 'index, follow',
    ogType: 'website',
    lang: language,
    jsonLd: isHome
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'OnlineStore',
            name: 'Gardenvaly by Hasna Hena',
            alternateName: ['Gardenvaly', 'গার্ডেনভ্যালি'],
            url: typeof window !== 'undefined' ? window.location.origin : 'https://gardenvaly.com',
            description:
              'Premium nursery for healthy indoor plants, outdoor shrubs, and authentic high-yield organic seeds in Bangladesh.',
            telephone: '+880 1712-345678',
            email: 'contact@gardenvaly.com',
            priceRange: '৳৳',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Dhaka',
              addressCountry: 'BD',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Gardenvaly by Hasna Hena',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://gardenvaly.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${typeof window !== 'undefined' ? window.location.origin : 'https://gardenvaly.com'}/shop?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          ...MOCK_TIPS.map((tip) => ({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: language === 'bn' ? tip.titleBn : tip.titleEn,
            description: language === 'bn' ? tip.excerptBn : tip.excerptEn,
            image: tip.imageUrl,
            datePublished: tip.publishedDate,
            author: {
              '@type': 'Person',
              name: 'Hasna Hena',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gardenvaly by Hasna Hena',
            },
          })),
        ]
      : undefined,
  });

  // Separate rendering pipeline for administrative portal routes
  if (currentPath.startsWith('/admin')) {
    const renderAdminContent = () => {
      if (currentPath === '/admin/login') {
        return <AdminLoginPage />;
      }
      if (currentPath === '/admin/products/new') {
        return <AdminProductFormPage />;
      }
      if (currentPath.match(/^\/admin\/products\/[^/]+\/edit$/)) {
        return <AdminProductFormPage />;
      }
      if (currentPath === '/admin/products') {
        return <AdminProductsPage />;
      }
      if (currentPath === '/admin/categories') {
        return <AdminCategoriesPage />;
      }
      if (currentPath.match(/^\/admin\/orders\/[^/]+$/)) {
        return <AdminOrderDetailPage />;
      }
      if (currentPath === '/admin/orders') {
        return <AdminOrdersPage />;
      }
      if (currentPath === '/admin/inventory') {
        return <AdminInventoryPage />;
      }
      if (currentPath === '/admin/customers') {
        return <AdminCustomersPage />;
      }
      if (currentPath === '/admin/coupons') {
        return <AdminCouponsPage />;
      }
      if (currentPath === '/admin/reports') {
        return <AdminReportsPage />;
      }
      if (currentPath === '/admin/banners') {
        return <AdminBannersPage />;
      }
      if (currentPath === '/admin/reviews') {
        return <AdminReviewsPage />;
      }
      if (currentPath === '/admin/settings') {
        return <AdminSettingsPage />;
      }
      // Default admin home
      return <AdminDashboardPage />;
    };

    return (
      <AdminAuthProvider>
        <AdminLayout>{renderAdminContent()}</AdminLayout>
      </AdminAuthProvider>
    );
  }

  // Customer-facing public storefront rendering pipeline
  const renderContent = () => {
    if (currentPath === '/') {
      return (
        <main className="flex-1">
          <HeroSection />
          <ShopByCategory categories={categories} />
          <FeaturedPlants products={products} />
          <FeaturedSeeds products={products} />
          <SeedToTreeJourney />
          <FeaturedSupplies products={products} />
          <PromotionalBanner />
          <WhyChooseUs />
          <GardeningTips />
          <CustomerReviews />
          <NewsletterSection />
        </main>
      );
    }
    if (
      currentPath === '/shop' ||
      currentPath === '/plants' ||
      currentPath === '/seeds' ||
      currentPath === '/supplies' ||
      currentPath === '/tools' ||
      currentPath.startsWith('/category/')
    ) {
      return (
        <main className="flex-1">
          <ShopPage />
        </main>
      );
    }
    if (currentPath.startsWith('/product/')) {
      return (
        <main className="flex-1">
          <ProductDetailPage />
        </main>
      );
    }
    if (currentPath === '/cart') {
      return (
        <main className="flex-1">
          <CartPage />
        </main>
      );
    }
    if (currentPath === '/checkout') {
      return (
        <main className="flex-1">
          <CheckoutPage />
        </main>
      );
    }
    if (currentPath === '/track-order') {
      return (
        <main className="flex-1">
          <OrderTrackingPage />
        </main>
      );
    }
    if (currentPath === '/profile' || currentPath === '/account' || currentPath === '/wishlist') {
      return (
        <main className="flex-1">
          <CustomerProfilePage />
        </main>
      );
    }
    return (
      <main className="flex-1">
        <NotFoundPage />
      </main>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col text-stone-800 overflow-x-hidden pb-16 lg:pb-0">
      <LivingTreeBackground />
      <Header />
      {renderContent()}
      <Footer />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
      />
      <CartDrawer />
      <FloatingWhatsAppWidget />
      <LivingTreeIndicator />
      <PlantCompareModal />
      <OfflineIndicator />
      <CustomerAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CustomerAuthProvider>
          <WishlistProvider>
            <CompareProvider>
              <CartProvider>
                <RouterProvider>
                  <MainShell />
                </RouterProvider>
              </CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </CustomerAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
