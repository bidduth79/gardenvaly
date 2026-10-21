/**
 * @file PWAInstallButton.tsx
 * @description In-App PWA installation trigger with guided instructions for iOS/Desktop browsers
 * and an offline mode connectivity indicator.
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, WifiOff, Share } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const isBn = language === 'bn';

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={
          compact
            ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#174D35] text-[#174D35] hover:text-white border border-emerald-200/80 text-xs font-bold transition-all cursor-pointer shrink-0'
            : 'w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-emerald-50/90 hover:bg-[#174D35] text-[#174D35] hover:text-white border border-emerald-200/80 text-sm font-bold transition-all cursor-pointer'
        }
        title={isBn ? 'গার্ডেনভ্যালি অ্যাপ ইনস্টল করুন' : 'Install Gardenvaly App'}
      >
        <span className="flex items-center gap-1.5">
          <Download className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
        </span>
        {!compact && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#174D35] font-semibold">
            PWA
          </span>
        )}
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#174D35] text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif-botanical font-bold text-stone-900">
                    {isBn ? 'Gardenvaly অ্যাপ ইনস্টল করুন' : 'Install Gardenvaly App'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {isBn ? 'হোমস্ক্রিনে ১-ক্লিকে দ্রুত শপিং অভিজ্ঞতা' : 'Fast home-screen shopping experience'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 text-xs text-stone-700 border border-stone-200/70">
                <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-[#174D35]" />
                  <span>{isBn ? 'iPhone / iPad-এ ইনস্টল করার নিয়ম:' : 'How to install on iPhone / iPad:'}</span>
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
              <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 text-xs text-stone-700 border border-stone-200/70">
                <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174D35]" />
                  <span>{isBn ? 'মোবাইল বা কম্পিউটারে ইনস্টল করার নিয়ম:' : 'How to install on Android / Desktop:'}</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    {isBn
                      ? 'ব্রাউজারের অ্যাড্রেস বারের ডানপাশে Install আইকনে ক্লিক করুন।'
                      : 'Click the Install icon in your browser address bar.'}
                  </li>
                  <li>
                    {isBn
                      ? 'অথবা ব্রাউজার মেনু (⋮) থেকে "Install App" / "Add to Home screen" সিলেক্ট করুন।'
                      : 'Or open the browser menu (⋮) and select "Install App".'}
                  </li>
                </ol>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full rounded-xl bg-[#174D35] hover:bg-[#123c29] py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {isBn ? 'বুঝেছি, ধন্যবাদ' : 'Got it'}
            </button>
          </div>
        </div>
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
