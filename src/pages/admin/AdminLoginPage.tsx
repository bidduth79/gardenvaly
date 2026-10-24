/**
 * @file AdminLoginPage.tsx
 * @description Clean Laravel Filament-style administrative sign-in portal in Slate, Black, and White.
 */

import React, { useState } from 'react';
import {
  Store,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative antialiased">
      {/* Top Bar with Language Switcher and Return to Store */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্টোরফ্রন্টে ফিরুন' : 'Back to Storefront'}</span>
        </button>
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold text-slate-950 tracking-tight">
          GardenValy Admin
        </h2>
        <p className="text-center text-xs text-slate-500 font-medium mt-1">
          {language === 'bn' ? 'অ্যাডমিন প্যানেলে সাইন ইন করুন' : 'Sign in to your administrative console'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xs rounded-xl border border-slate-200 space-y-5">
          {/* Quick Credential Fill Box */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900">
                {language === 'bn' ? 'অ্যাডমিন লগইন তথ্য:' : 'Admin Credentials:'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                admin@gardenvaly.com / gardenvaly123
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {language === 'bn' ? 'অটো-ফিল' : 'Auto-fill'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-slate-900 text-white text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'ইমেইল বা ইউজারনেম' : 'Email or Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gardenvaly.com"
                  className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-slate-300 text-slate-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 text-slate-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
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
                  className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950 border-slate-300"
                />
                <span className="text-slate-600">
                  {language === 'bn' ? 'মনে রাখুন' : 'Remember session'}
                </span>
              </label>

              <span className="text-[11px] text-slate-400">
                {language === 'bn' ? 'সুপার অ্যাডমিন' : 'Superadmin'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>{language === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{language === 'bn' ? 'সাইন ইন করুন' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
