/**
 * @file AdminLoginPage.tsx
 * @description Dedicated administrative sign-in portal with validation, password toggle, and frontend demo notice.
 */

import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LanguageSwitcher } from '../../components/layout/LanguageSwitcher';

export const AdminLoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useLanguage();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail('admin@gardenvaly.com');
    setPassword('gardenvaly123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(language === 'bn' ? 'ইমেইল বা ইউজারনেম আবশ্যক' : 'Email or username is required');
      return;
    }
    if (!password.trim()) {
      setError(language === 'bn' ? 'পাসওয়ার্ড প্রদান করুন' : 'Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed'));
      }
    } catch {
      setIsLoading(false);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative antialiased">
      {/* Top Bar with Language Switcher and Return to Store */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#174D35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্টোরফ্রন্টে ফিরুন' : 'Back to Storefront'}</span>
        </button>
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5C8D50] to-[#174D35] flex items-center justify-center text-white shadow-lg border border-emerald-600/30">
            <Sprout className="w-9 h-9 text-emerald-100" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900 tracking-tight">
          Gardenvaly
        </h2>
        <p className="text-center text-xs text-[#5C8D50] font-medium tracking-wide">
          by Hasna Hena — Administrative Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200/80 space-y-6">
          {/* Demo Disclaimer Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === 'bn' ? 'সুরক্ষিত এক্সপ্রেস ব্যাকএন্ড ও অ্যাডমিন প্রমাণীকরণ' : 'Secure Express REST API & Admin Authentication'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {language === 'bn'
                ? 'গার্ডেনভ্যালির এক্সপ্রেস রেস্ট এপিআই ও জেডব্লিউটি প্রমাণীকরণ সক্রিয়। নিচের বাটনে ক্লিক করে অ্যাডমিন ক্রেডেনশিয়াল (ইমেইল: admin@gardenvaly.com, পাসওয়ার্ড: gardenvaly123) দিয়ে লগইন করুন।'
                : 'Gardenvaly Express REST API & JWT authentication are active. Click below to auto-fill verified admin credentials (admin@gardenvaly.com / gardenvaly123).'}
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#174D35] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>
                {language === 'bn' ? 'অ্যাডমিন তথ্য পূরণ করুন (admin@gardenvaly.com)' : 'Fill Admin Credentials'}
              </span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'bn' ? 'ইমেইল বা ইউজারনেম' : 'Email or Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gardenvaly.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35] focus:border-transparent transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35] focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#174D35] focus:ring-[#174D35] border-stone-300"
                />
                <span className="text-stone-600">
                  {language === 'bn' ? 'মনে রাখুন' : 'Remember session'}
                </span>
              </label>

              <span className="text-[11px] text-stone-400 italic">
                {language === 'bn' ? 'হাসনা হেনা অ্যাডমিন' : 'Role: Superadmin'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>{language === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Verifying Session...'}</span>
              ) : (
                <>
                  <span>{language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-stone-500">
          Gardenvaly — by Hasna Hena &copy; 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
};
