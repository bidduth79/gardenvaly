/**
 * @file PWAInstallButton.tsx
 * @description In-App PWA installation trigger with a Portal-rendered modal (never clipped
 * inside sticky headers or mobile drawers), direct PWA install option, and offline indicator.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, X, CheckCircle2, WifiOff, Share, Sparkles, MonitorSmartphone } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installTriggered, setInstallTriggered] = useState(false);
  const isBn = language === 'bn';

  if (isInstalled) {
    return null;
  }

  const handleOpenModalOrInstall = () => {
    setShowGuideModal(true);
  };

  const handleDirectPWAInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setShowGuideModal(false);
      }
    } else {
      setInstallTriggered(true);
      setTimeout(() => setInstallTriggered(false), 4000);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModalOrInstall}
        className={
          compact
            ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-[#10261E] hover:bg-[#174D35] text-[#174D35] dark:text-[#34D399] hover:text-white border border-emerald-200/80 dark:border-[#1B3B2E] text-xs font-bold transition-all cursor-pointer shrink-0'
            : 'w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-emerald-50/90 dark:bg-[#10261E] hover:bg-[#174D35] text-[#174D35] dark:text-[#34D399] hover:text-white border border-emerald-200/80 dark:border-[#1B3B2E] text-sm font-bold transition-all cursor-pointer'
        }
        title={isBn ? 'গার্ডেনভ্যালি PWA অ্যাপ ইনস্টল করুন' : 'Install Gardenvaly PWA App'}
      >
        <span className="flex items-center gap-1.5">
          <Download className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#174D35] text-white dark:bg-[#1B3B2E] dark:text-[#34D399] font-semibold leading-none">
          PWA
        </span>
      </button>

      {showGuideModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? 'গার্ডেনভ্যালি PWA অ্যাপ ইনস্টল' : 'Install Gardenvaly PWA App'}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fade-in"
            onClick={() => setShowGuideModal(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0C2018] p-6 shadow-2xl border border-stone-200 dark:border-[#1B3B2E] space-y-4 text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#174D35] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-serif-botanical font-bold text-stone-900 dark:text-white">
                        {isBn ? 'Gardenvaly অ্যাপ ইনস্টল' : 'Install Gardenvaly App'}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#1B3B2E] text-[#174D35] dark:text-[#34D399] font-bold uppercase tracking-wider">
                        PWA
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-[#A8C4B5] mt-0.5">
                      {isBn
                        ? 'হোমস্ক্রিনে ১-ক্লিকে দ্রুত ও অফলাইন শপিং অভিজ্ঞতা'
                        : 'Fast home-screen & offline-ready shopping experience'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-[#10261E] flex items-center justify-center text-stone-500 dark:text-stone-400 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Direct PWA Option Card */}
              <div className="rounded-2xl bg-emerald-50/80 dark:bg-[#10261E] border border-emerald-200/80 dark:border-[#1B3B2E] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174D35] dark:text-[#34D399]">
                    <MonitorSmartphone className="w-4 h-4 shrink-0" />
                    <span>{isBn ? 'প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA) অপশন' : 'Progressive Web App (PWA) Option'}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-[#C5A059]">
                    <Sparkles className="w-3 h-3" />
                    {isBn ? 'ফ্রি ও হালকা' : 'Zero Storage Bloat'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-[#CBD5E1] leading-relaxed">
                  {isBn
                    ? 'কোনো অ্যাপ স্টোর ছাড়াই সরাসরি আপনার ফোন বা কম্পিউটারে নেটিভ অ্যাপ হিসেবে গার্ডেনভ্যালি ব্যবহার করুন।'
                    : 'Install Gardenvaly directly on your phone or desktop as a standalone native-like app without any app store.'}
                </p>

                <button
                  type="button"
                  onClick={handleDirectPWAInstall}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#174D35] hover:bg-[#123c29] py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>
                    {isInstallable
                      ? isBn
                        ? 'এখনই PWA অ্যাপ ইনস্টল করুন (১-ক্লিক)'
                        : 'Install PWA App Now (1-Click)'
                      : isBn
                      ? 'PWA হিসেবে হোমস্ক্রিনে যুক্ত করুন'
                      : 'Add PWA to Home Screen'}
                  </span>
                </button>

                {installTriggered && !isInstallable && (
                  <p className="text-[11px] text-[#174D35] dark:text-[#34D399] font-medium text-center">
                    {isBn
                      ? 'নিচের নির্দেশনা অনুসরণ করে ব্রাউজার মেনু থেকে ১-ক্লিকে ইনস্টল সম্পন্ন করুন 👇'
                      : 'Follow the quick browser step below to finish adding to your Home Screen 👇'}
                  </p>
                )}
              </div>

              {/* Platform Guide */}
              {isIOS ? (
                <div className="bg-stone-50 dark:bg-[#10261E] rounded-2xl p-4 space-y-2 text-xs text-stone-700 dark:text-[#CBD5E1] border border-stone-200/70 dark:border-[#1B3B2E]">
                  <p className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Share className="w-4 h-4 text-[#174D35] dark:text-[#34D399]" />
                    <span>{isBn ? 'iPhone / iPad-এ PWA ইনস্টল করার নিয়ম:' : 'How to install PWA on iPhone / iPad:'}</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>
                      {isBn
                        ? 'Safari ব্রাউজারের নিচে Share বাটনে ট্যাপ করুন।'
                        : 'Tap the Share button in your Safari toolbar.'}
                    </li>
                    <li>
                      {isBn
                        ? 'নিচে স্ক্রল করে "Add to Home Screen"-এ ট্যাপ করুন।'
                        : 'Scroll down and tap "Add to Home Screen".'}
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="bg-stone-50 dark:bg-[#10261E] rounded-2xl p-4 space-y-2 text-xs text-stone-700 dark:text-[#CBD5E1] border border-stone-200/70 dark:border-[#1B3B2E]">
                  <p className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#174D35] dark:text-[#34D399]" />
                    <span>{isBn ? 'Android / Desktop ব্রাউজারে PWA ইনস্টল:' : 'Install PWA on Android / Desktop:'}</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>
                      {isBn
                        ? 'ব্রাউজারের অ্যাড্রেস বারের ডানপাশে Install (📲) আইকনে ক্লিক করুন।'
                        : 'Click the Install (📲) icon on the right side of your browser address bar.'}
                    </li>
                    <li>
                      {isBn
                        ? 'অথবা ব্রাউজার মেনু (⋮) থেকে "Install App" / "Add to Home screen" সিলেক্ট করুন।'
                        : 'Or open the browser menu (⋮) and select "Install App" / "Add to Home screen".'}
                    </li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#10261E] dark:hover:bg-[#1B3B2E] py-2.5 text-xs font-bold text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        {language === 'bn'
          ? 'অফলাইন মোড — ক্যাশ করা ডেটা ব্যবহৃত হচ্ছে'
          : 'Offline Mode — Viewing cached store catalog'}
      </span>
    </div>
  );
};
