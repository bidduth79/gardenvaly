/**
 * @file CustomerAuthModal.tsx
 * @description Accessible, responsive customer login and registration modal with 1-click demo entry.
 */

import React, { useState, useEffect } from 'react';
import { X, Lock, Phone, User, MapPin, Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    demoLogin,
    register,
    isLoading,
  } = useCustomerAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regMobileNumber, setRegMobileNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('Dhaka');
  const [regDistrict, setRegDistrict] = useState('Dhaka');
  const [regAddressDetail, setRegAddressDetail] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, setIsAuthModalOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
      setSuccessMessage(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login(loginIdentifier, loginPassword);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে');
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    try {
      await demoLogin();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'ডেমো লগইন ব্যর্থ হয়েছে');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await register({
        fullName: regFullName,
        mobileNumber: regMobileNumber,
        email: regEmail || undefined,
        password: regPassword,
        division: regDivision,
        district: regDistrict,
        addressDetail: regAddressDetail,
      });
      setSuccessMessage(isBn ? 'স্বাগতম! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।' : 'Welcome! Account created successfully.');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-[#174D35] to-[#25684A] text-white p-5 sm:p-6 pb-6">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gardenvaly Member Hub</span>
          </div>
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-serif-botanical font-bold text-white">
            {authModalTab === 'login'
              ? (isBn ? 'আপনার একাউন্টে লগইন করুন' : 'Sign In to Your Account')
              : (isBn ? 'নতুন কাস্টমার একাউন্ট খুলুন' : 'Create Customer Account')}
          </h2>
          <p className="text-xs text-stone-200/90 mt-1">
            {isBn
              ? 'অর্ডার হিস্ট্রি, ডেলিভারি ট্র্যাকিং ও পছন্দের উইশলিস্ট সংরক্ষণ করুন'
              : 'Save order records, track deliveries, and keep your plant wishlist'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition-all cursor-pointer border-b-2 ${
              authModalTab === 'login'
                ? 'border-[#174D35] text-[#174D35] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition-all cursor-pointer border-b-2 ${
              authModalTab === 'register'
                ? 'border-[#174D35] text-[#174D35] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {isBn ? 'নতুন একাউন্ট খুলুন' : 'Register'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick 1-Click Demo Login Button */}
          {authModalTab === 'login' && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {isBn ? 'টেস্টের জন্য এক-ক্লিকে ডেমো লগইন' : '1-Click Demo Login'}
                </span>
                <span className="text-[10px] bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                  তাহমিনা আক্তার
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {isBn
                  ? 'পূর্ববর্তী ৩টি অর্ডার ও উইশলিস্টসহ ডেমো একাউন্ট তাৎক্ষণিক পরীক্ষা করতে ক্লিক করুন:'
                  : 'Instantly test past orders and saved wishlist with sample user:'}
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>{isBn ? '⚡ ডেমো একাউন্টে প্রবেশ করুন' : '⚡ Sign In with Demo Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ─── LOGIN FORM ─────────────────────────── */}
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={isBn ? 'যেমন: 01712345678' : 'e.g. 01712345678'}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (isBn ? 'লগইন হচ্ছে...' : 'Signing In...') : (isBn ? 'লগইন করুন' : 'Sign In')}
              </Button>
            </form>
          ) : (
            /* ─── REGISTER FORM ───────────────────────── */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'পুরো নাম *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder={isBn ? 'যেমন: তাহমিনা আক্তার' : 'e.g. Tahmina Akter'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={regMobileNumber}
                      onChange={(e) => setRegMobileNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *' : 'Password (min 6 characters) *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isBn ? 'বিভাগ' : 'Division'}
                  </label>
                  <select
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
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
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder={isBn ? 'যেমন: ঢাকা' : 'e.g. Dhaka'}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'বিস্তারিত ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা)' : 'Full Delivery Address'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <textarea
                    rows={2}
                    value={regAddressDetail}
                    onChange={(e) => setRegAddressDetail(e.target.value)}
                    placeholder={isBn ? 'বাড়ি নং, রোড নং, এলাকা ও ল্যান্ডমার্ক...' : 'House, road, area details...'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#174D35] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (isBn ? 'একাউন্ট তৈরি হচ্ছে...' : 'Creating...') : (isBn ? 'একাউন্ট খুলুন' : 'Create Account')}
              </Button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-stone-100/70 border-t border-stone-200 text-center text-[11px] text-stone-500">
          {isBn ? (
            <span>
              গার্ডেনভ্যালির সাথে থাকার জন্য ধন্যবাদ •{' '}
              <button
                type="button"
                onClick={() => setAuthModalTab(authModalTab === 'login' ? 'register' : 'login')}
                className="text-[#174D35] font-bold hover:underline cursor-pointer"
              >
                {authModalTab === 'login' ? 'নতুন একাউন্ট তৈরি করুন' : 'আগে থেকেই একাউন্ট আছে? লগইন করুন'}
              </button>
            </span>
          ) : (
            <span>
              {authModalTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setAuthModalTab(authModalTab === 'login' ? 'register' : 'login')}
                className="text-[#174D35] font-bold hover:underline cursor-pointer"
              >
                {authModalTab === 'login' ? 'Register here' : 'Sign in here'}
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
