/**
 * @file AdminProductsPage.tsx
 * @description Product catalog management for plants and seeds with searching, filtering, and deletion controls.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Sprout,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product, ProductCategoryType } from '../../types/product';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminProductsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
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

    const matchesType = selectedType === 'all' || p.type === selectedType;

    const matchesStock =
      selectedStock === 'all' ||
      (selectedStock === 'in-stock' && p.stockQuantity > 5) ||
      (selectedStock === 'low-stock' && p.stockQuantity > 0 && p.stockQuantity <= 5) ||
      (selectedStock === 'out-of-stock' && p.stockQuantity === 0);

    return matchesSearch && matchesType && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'পণ্য ক্যাটালগ ব্যবস্থাপনা' : 'Botanical Products Catalog'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? `মোট ${products.length} টি গাছ ও বীজের তথ্য সংরক্ষিত রয়েছে`
              : `Total ${products.length} living plant specimens & heirloom seeds registered`}
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'bn' ? 'নাম বা SKU দিয়ে খুঁজুন...' : 'Search by name, SKU...'
            }
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          >
            <option value="all">{language === 'bn' ? 'সকল টাইপ' : 'All Types'}</option>
            <option value="plant">{language === 'bn' ? 'গাছ (Plants)' : 'Plants'}</option>
            <option value="seed">{language === 'bn' ? 'বীজ (Seeds)' : 'Seeds'}</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          >
            <option value="all">{language === 'bn' ? 'সকল স্টক অবস্থা' : 'All Stock Status'}</option>
            <option value="in-stock">{language === 'bn' ? 'পর্যাপ্ত স্টক (>5)' : 'In Stock (>5)'}</option>
            <option value="low-stock">{language === 'bn' ? 'লো-স্টক (১-৫)' : 'Low Stock (1-5)'}</option>
            <option value="out-of-stock">{language === 'bn' ? 'স্টক শেষ (০)' : 'Out of Stock (0)'}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-xs sm:text-sm min-w-[680px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'পণ্য' : 'Product'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'মূল্য (BDT)' : 'Price'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'স্টক পরিমাণ' : 'Stock'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Sprout className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>{language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No products found.'}</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.nameEn}
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="max-w-xs truncate">
                          <p className="font-semibold text-stone-900 truncate">
                            {language === 'bn' ? prod.nameBn : prod.nameEn}
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            {prod.SKU}
                            {prod.botanicalName ? ` • ${prod.botanicalName}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-4 text-stone-600">
                      <span className="capitalize">{prod.category}</span>
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 uppercase">
                        {prod.type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      ৳{prod.price.toLocaleString()}
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="ml-1 text-[10px] text-stone-400 line-through">
                          ৳{prod.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{prod.stockQuantity}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {prod.stockQuantity === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                        </span>
                      ) : prod.stockQuantity <= 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {language === 'bn' ? 'লো-স্টক' : 'Low Stock'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {language === 'bn' ? 'পর্যাপ্ত' : 'In Stock'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/product/${prod.slug}`)}
                          className="p-1.5 text-stone-500 hover:text-[#174D35] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/${prod.id}/edit`)}
                          className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(prod)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-stone-900 text-base">
                {language === 'bn' ? 'পণ্য মুছে ফেলতে চান?' : 'Confirm Deletion'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'bn'
                  ? `"${deleteCandidate.nameBn || deleteCandidate.nameEn}" পণ্যটি ড্যাশবোর্ড থেকে মুছে যাবে।`
                  : `Are you sure you want to remove "${deleteCandidate.nameEn}"?`}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {isDeleting
                  ? language === 'bn' ? 'মুছে ফেলা হচ্ছে...' : 'Deleting...'
                  : language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
