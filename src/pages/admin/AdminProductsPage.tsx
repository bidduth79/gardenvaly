/**
 * @file AdminProductsPage.tsx
 * @description Clean Laravel Filament-style Products Resource Table in Slate, Black, and White
 * with Semantic Colors and 100% pure Bengali ('bn') or English ('en') localization.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sprout,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product } from '../../types/product';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import {
  formatAdminCurrency,
  formatAdminNumber,
  toBnDigits,
  translateCategoryName,
  translateProductType,
} from '../../utils/adminI18n';

export const AdminProductsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'plant' | 'seed' | 'low-stock'>('all');
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    const list = await adminService.getAllProducts();
    setProducts(list);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    await adminService.deleteProduct(deleteCandidate.id);
    setIsDeleting(false);
    setDeleteCandidate(null);
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameBn.includes(searchTerm) ||
      p.SKU.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'plant') return p.type === 'plant';
    if (activeTab === 'seed') return p.type === 'seed';
    if (activeTab === 'low-stock') return p.stockQuantity <= 5;
    return true;
  });

  const tabs = [
    { id: 'all' as const, bn: 'সব পণ্য', en: 'All Products' },
    { id: 'plant' as const, bn: 'গাছের চারা', en: 'Plants' },
    { id: 'seed' as const, bn: 'উন্নত বীজ', en: 'Seeds' },
    { id: 'low-stock' as const, bn: 'কম স্টক', en: 'Low Stock' },
  ];

  return (
    <div className="space-y-5">
      {/* Laravel Filament Resource Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
            {language === 'bn' ? 'সকল পণ্য তালিকা' : 'Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {language === 'bn'
              ? `মোট ${formatAdminNumber(products.length, 'bn')} টি গাছ ও বীজ সংরক্ষিত রয়েছে`
              : `${products.length} total products in catalog`}
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'New Product'}</span>
        </button>
      </div>

      {/* Unified Laravel Filament Resource Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Top Toolbar: Tabs + Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {language === 'bn' ? tab.bn : tab.en}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'পণ্যের নাম বা কোড দিয়ে খুঁজুন...' : 'Search name or SKU...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* High-Density Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[680px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'পণ্য ও কোড' : 'Product'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'বিভাগ ও ধরন' : 'Category'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'মূল্য' : 'Price'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'মজুদ সংখ্যা' : 'Stock'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'পদক্ষেপ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Sprout className="w-7 h-7 mx-auto mb-2 opacity-40" />
                    <span>{language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No products found.'}</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getSafeImageUrl(prod.imageUrl, { type: prod.type, categorySlug: prod.categorySlug })}
                          alt={prod.nameEn}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => handleImageError(e, getProductFallbackImage(prod))}
                        />
                        <div className="max-w-xs truncate">
                          <p className="font-semibold text-slate-950 truncate">
                            {language === 'bn' ? prod.nameBn : prod.nameEn}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                            {language === 'bn' ? `কোড: ${toBnDigits(prod.SKU)}` : prod.SKU}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-xs whitespace-nowrap">
                      <span className="font-medium text-slate-900">
                        {translateCategoryName(prod.category, language)}
                      </span>
                      <span className="text-slate-400 mx-1.5" aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-500">
                        {translateProductType(prod.type, language)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
                      {formatAdminCurrency(prod.price, language)}
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="ml-1.5 text-[11px] text-slate-400 line-through font-normal">
                          {formatAdminCurrency(prod.originalPrice, language)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatAdminNumber(prod.stockQuantity, language)}
                    </td>

                    <td className="py-3 px-4 text-xs whitespace-nowrap">
                      {prod.stockQuantity === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                        </span>
                      ) : prod.stockQuantity <= 5 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          {language === 'bn' ? 'কম স্টক' : 'Low Stock'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {language === 'bn' ? 'পর্যাপ্ত' : 'In Stock'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/product/${prod.slug}`)}
                          className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title={language === 'bn' ? 'ওয়েবসাইটে দেখুন' : 'View on Storefront'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/${prod.id}/edit`)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(prod)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete Product'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-950 text-base">
                {language === 'bn' ? 'পণ্যটি মুছে ফেলতে চান?' : 'Delete Product?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? `"${deleteCandidate.nameBn}" স্থায়ীভাবে তালিকা থেকে মুছে যাবে।`
                  : `"${deleteCandidate.nameEn}" will be permanently removed.`}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ফিরে যান' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting
                  ? language === 'bn'
                    ? 'মুছে ফেলা হচ্ছে...'
                    : 'Deleting...'
                  : language === 'bn'
                  ? 'হ্যাঁ, মুছে ফেলুন'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
