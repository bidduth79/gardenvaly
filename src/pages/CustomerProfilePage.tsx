/**
 * @file CustomerProfilePage.tsx
 * @description Customer profile dashboard: order history with tracking, saved wishlist, and auto-filling address settings.
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Printer,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  ArrowRight,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { Button } from '../components/common/Button';
import { formatPrice, formatNumeral } from '../utils/formatters';
import { InvoicePrintModal } from '../components/checkout/InvoicePrintModal';

export const CustomerProfilePage: React.FC = () => {
  const { customer, isAuthenticated, logout, updateProfile, openLoginModal } = useCustomerAuth();
  const { wishlistIds, toggleWishlist, wishlistCount } = useWishlist();
  const { language, t } = useLanguage();
  const { navigate, queryParams } = useRouter();
  const { addToCart } = useCart();
  const isBn = language === 'bn';

  // Read initial tab from URL query param if present
  const initialTab = queryParams.get('tab') === 'wishlist' ? 'wishlist' : queryParams.get('tab') === 'address' ? 'address' : 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address'>(initialTab);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Profile edit form state
  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [division, setDivision] = useState(customer?.division || 'Dhaka');
  const [district, setDistrict] = useState(customer?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(customer?.upazila || '');
  const [addressDetail, setAddressDetail] = useState(customer?.addressDetail || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Sync profile form when customer loads
  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || '');
      setEmail(customer.email || '');
      setDivision(customer.division || 'Dhaka');
      setDistrict(customer.district || 'Dhaka');
      setUpazila(customer.upazila || '');
      setAddressDetail(customer.addressDetail || '');
    }
  }, [customer]);

  // Load customer orders
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingOrders(true);
      customerService
        .getMyOrders()
        .then((res) => {
          setOrders(res);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [isAuthenticated]);

  // Load products to resolve wishlist items
  useEffect(() => {
    productService.getProducts().then((res) => {
      setAllProducts(res);
    });
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      await updateProfile({
        fullName,
        email: email || undefined,
        division,
        district,
        upazila,
        addressDetail,
      });
      setProfileSuccessMsg(isBn ? 'ঠিকানা ও প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    } catch {
      // ignore
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Helper status color badge
  const renderStatusBadge = (status: string) => {
    const map: Record<string, { labelBn: string; labelEn: string; color: string; icon: React.ReactNode }> = {
      pending: { labelBn: 'অপেক্ষমাণ', labelEn: 'Pending', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Clock className="w-3 h-3" /> },
      confirmed: { labelBn: 'নিশ্চিত', labelEn: 'Confirmed', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: <CheckCircle className="w-3 h-3" /> },
      processing: { labelBn: 'প্রসেসিং', labelEn: 'Processing', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: <Clock className="w-3 h-3" /> },
      packed: { labelBn: 'প্যাকেজিং শেষ', labelEn: 'Packed', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: <Package className="w-3 h-3" /> },
      shipped: { labelBn: 'অন দ্য ওয়ে', labelEn: 'On the Way', color: 'bg-orange-50 text-orange-800 border-orange-200', icon: <Truck className="w-3 h-3" /> },
      delivered: { labelBn: 'ডেলিভার্ড', labelEn: 'Delivered', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { labelBn: 'বাতিল', labelEn: 'Cancelled', color: 'bg-red-50 text-red-800 border-red-200', icon: <Clock className="w-3 h-3" /> },
    };

    const s = map[status] || { labelBn: status, labelEn: status, color: 'bg-stone-100 text-stone-700 border-stone-200', icon: null };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.color}`}>
        {s.icon}
        <span>{isBn ? s.labelBn : s.labelEn}</span>
      </span>
    );
  };

  // If NOT logged in, show friendly gateway card
  if (!isAuthenticated || !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#174D35]/10 text-[#174D35] flex items-center justify-center mx-auto shadow-inner">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
              {isBn ? 'কাস্টমার প্রোফাইল ও ড্যাশবোর্ড' : 'Customer Account & Dashboard'}
            </h1>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              {isBn
                ? 'আপনার পূর্ববর্তী অর্ডার হিস্ট্রি দেখতে, পছন্দের গাছপালা সংরক্ষণ করতে এবং ডেলিভারি ঠিকানা ম্যানেজ করতে একাউন্টে লগইন করুন।'
                : 'Sign in to access your complete order history, manage delivery addresses, and view your saved botanical wishlist.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={openLoginModal}
              className="w-full sm:w-auto"
            >
              {isBn ? 'লগইন বা একাউন্ট খুলুন' : 'Sign In / Register'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto"
            >
              {isBn ? 'শপে ফিরে যান' : 'Browse Store'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── CUSTOMER HERO BANNER ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#174D35] via-[#1E5D42] to-[#2B7756] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient botanical background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#5C8D50]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Customer Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white font-serif-botanical font-bold text-2xl sm:text-3xl shadow-inner shrink-0">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059]/30 border border-[#C5A059]/50 text-[#F5E6BE] text-[11px] font-semibold tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>{isBn ? 'গার্ডেনভ্যালি প্রিমিয়াম মেম্বার' : 'Gardenvaly Member'}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-white">
                {customer.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>{customer.mobileNumber}</span>
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>{customer.email}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>{customer.district || customer.division}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action & Metric Stats */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto">
            <div className="text-center px-4 py-2 bg-black/25 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-stone-300">{isBn ? 'মোট অর্ডার' : 'Total Orders'}</p>
              <p className="text-lg sm:text-2xl font-bold font-mono text-white">
                {formatNumeral(customer.totalOrders || orders.length, language)}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-black/25 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-stone-300">{isBn ? 'পছন্দের গাছ' : 'Wishlist'}</p>
              <p className="text-lg sm:text-2xl font-bold font-mono text-[#F5E6BE]">
                {formatNumeral(wishlistCount, language)}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              title={isBn ? 'লগআউট' : 'Sign Out'}
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── TAB NAVIGATION ─────────────────────────────────────────── */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#174D35] text-[#174D35]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
            {formatNumeral(orders.length, language)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-[#174D35] text-[#174D35]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{isBn ? 'পছন্দের তালিকা' : 'Wishlist'}</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono font-bold">
            {formatNumeral(wishlistCount, language)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('address')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'address'
              ? 'border-[#174D35] text-[#174D35]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#5C8D50]" />
          <span>{isBn ? 'ডেলিভারি ঠিকানা ও প্রোফাইল' : 'Address & Profile'}</span>
        </button>
      </div>

      {/* ─── TAB 1: MY ORDERS ──────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="p-12 text-center text-stone-500">
              <Clock className="w-8 h-8 animate-spin mx-auto text-[#174D35] mb-2" />
              <p>{isBn ? 'অর্ডার হিস্ট্রি লোড হচ্ছে...' : 'Loading your orders...'}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif-botanical font-bold text-stone-800">
                {isBn ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই' : 'No Orders Found'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {isBn
                  ? 'গার্ডেনভ্যালির তাজা গাছপালা ও অর্গানিক বীজের সমাহার ঘুরে দেখুন এবং অর্ডার করুন।'
                  : 'Browse our collection of fresh indoor/outdoor plants and high-yield organic seeds.'}
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
                {isBn ? 'গাছ ও বীজ কিনুন' : 'Browse Store'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Top Ribbon */}
                  <div className="bg-stone-50/80 px-5 sm:px-6 py-3.5 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#174D35]">
                        {order.orderNumber}
                      </span>
                      <span className="text-stone-300">|</span>
                      <span className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {renderStatusBadge(order.status)}
                      <span className="text-sm font-bold font-mono text-stone-900">
                        {formatPrice(order.totalAmount, language)}
                      </span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Items List */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200/60 shrink-0">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                  🌱
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-stone-900">
                                {item.productName}
                              </p>
                              <p className="text-xs text-stone-500">
                                {formatPrice(item.unitPrice, language)} × {formatNumeral(item.quantity, language)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold font-mono text-stone-800">
                            {formatPrice(item.lineSubtotal || item.unitPrice * item.quantity, language)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Payment Metadata Footer */}
                    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
                      <div>
                        <span className="text-stone-400">{isBn ? 'ডেলিভারি ঠিকানা: ' : 'Delivery: '}</span>
                        <span className="font-medium text-stone-800">
                          {order.customer.addressDetail}, {order.customer.district}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{isBn ? 'ইনভয়েস' : 'Invoice'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/track-order`)}
                          className="px-3 py-1.5 rounded-xl bg-[#174D35] hover:bg-[#123E2A] text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{isBn ? 'ট্র্যাক করুন' : 'Track Order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: WISHLIST ───────────────────────────────────────── */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif-botanical font-bold text-stone-800">
                {isBn ? 'আপনার পছন্দের তালিকা খালি রয়েছে' : 'Your Wishlist is Empty'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {isBn
                  ? 'যেকোনো গাছের ছবিতে থাকা হার্ট (Heart) আইকনে ক্লিক করে পছন্দের তালিকায় যুক্ত করুন।'
                  : 'Click the heart icon on any plant or seed to save it for later.'}
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
                {isBn ? 'গাছ ও বীজ ব্রাউজ করুন' : 'Explore Catalog'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 mb-3">
                    <img
                      src={prod.imageUrl}
                      alt={isBn ? prod.nameBn : prod.nameEn}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                      title={isBn ? 'পছন্দের তালিকা থেকে সরান' : 'Remove from wishlist'}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C8D50]">
                      {prod.category}
                    </span>
                    <h3 className="font-serif-botanical font-bold text-base text-stone-900 line-clamp-1 mt-0.5">
                      {isBn ? prod.nameBn : prod.nameEn}
                    </h3>
                    <p className="text-sm font-bold font-mono text-[#174D35] mt-1">
                      {formatPrice(prod.price, language)}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart(prod, 1)}
                      className="flex-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                      <span>{t('addToCart')}</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${prod.slug}`)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                      title={isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: ADDRESS & PROFILE SETTINGS ─────────────────────── */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-2xl shadow-sm">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-serif-botanical font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#174D35]" />
              <span>{isBn ? 'ডেলিভারি ঠিকানা ও প্রোফাইল তথ্য' : 'Delivery Address & Profile'}</span>
            </h2>
            <p className="text-xs text-stone-500">
              {isBn
                ? 'এখানে দেওয়া তথ্যগুলো আপনার চেকআউট পেজে স্বয়ংক্রিয়ভাবে বসে যাবে, তাই বারবার নতুন করে লিখতে হবে না।'
                : 'This address auto-populates your checkout form for rapid 1-click orders.'}
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'পুরো নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  disabled
                  value={customer.mobileNumber}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'বিভাগ' : 'Division'}
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                >
                  <option value="Dhaka">ঢাকা (Dhaka)</option>
                  <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                  <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                  <option value="Khulna">খুলনা (Khulna)</option>
                  <option value="Barisal">বরিশাল (Barisal)</option>
                  <option value="Sylhet">সিলেট (Sylhet)</option>
                  <option value="Rangpur">রংপুর (Rangpur)</option>
                  <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'জেলা' : 'District'}
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={isBn ? 'যেমন: ঢাকা' : 'e.g. Dhaka'}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'উপজেলা / থানা' : 'Upazila / Thana'}
                </label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder={isBn ? 'যেমন: ধানমন্ডি' : 'e.g. Dhanmondi'}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'বিস্তারিত ডেলিভারি ঠিকানা (বাড়ি নং, রোড নং, এলাকা)' : 'Detailed Address'}
              </label>
              <textarea
                rows={3}
                required
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder={isBn ? 'বাড়ি নং, রোড নং, ফ্ল্যাট নং, ল্যান্ডমার্ক ইত্যাদি...' : 'House, Road, Area, Landmarks...'}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSavingProfile}
              className="mt-2"
            >
              {isSavingProfile ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'তথ্য আপডেট ও সংরক্ষণ করুন' : 'Save Address Details')}
            </Button>
          </form>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <InvoicePrintModal
          order={selectedInvoiceOrder}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
