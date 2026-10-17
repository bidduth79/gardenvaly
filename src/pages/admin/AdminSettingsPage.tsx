/**
 * @file AdminSettingsPage.tsx
 * @description General store configuration, branding, delivery rates, bKash/Nagad accounts,
 * and contact credentials for Gardenvaly. Changes sync globally and immediately to the storefront.
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Store,
  Truck,
  Phone,
  ShieldCheck,
  CreditCard,
  Smartphone,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../../types/admin';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreSettings } from '../../services/settingsService';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings: globalSettings, saveSettings } = useStoreSettings();

  const [settings, setSettings] = useState<StoreSettings>(globalSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when globalSettings loads from server
  useEffect(() => {
    setSettings(globalSettings);
  }, [globalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveSettings(settings);
      setSettings(saved);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {isBn ? 'স্টোর সেটিংস ও কনফিগারেশন' : 'Store Settings & Configuration'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#174D35] text-[11px] font-bold">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {isBn
              ? 'স্টোরের নাম, বিকাশ/নগদ নম্বর, ফোন নম্বর ও ডেলিভারি চার্জ পরিবর্তন করুন (পরিবর্তন সাথে সাথে ওয়েবসাইটে দেখাবে)'
              : 'Configure store name, bKash/Nagad accounts, hotline numbers & delivery fees with instant live sync.'}
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isBn ? 'সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!' : 'Settings successfully saved and live!'}</span>
          </div>
        )}
      </div>

      {/* Live Active Overview Summary Badge */}
      <div className="p-4 rounded-2xl bg-[#F7F5EC] border border-[#174D35]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-stone-500 block text-[11px]">{isBn ? 'স্টোরের নাম:' : 'Store Name:'}</span>
          <span className="font-bold text-[#174D35] truncate block">
            {isBn ? (settings.storeNameBn || settings.storeNameEn) : (settings.storeNameEn || settings.storeNameBn)}
          </span>
        </div>
        <div>
          <span className="text-stone-500 block text-[11px]">{isBn ? 'বিকাশ নম্বর:' : 'bKash Number:'}</span>
          <span className="font-mono font-bold text-pink-700 truncate block">
            {settings.bkashNumber || 'N/A'} ({settings.bkashType || 'Personal'})
          </span>
        </div>
        <div>
          <span className="text-stone-500 block text-[11px]">{isBn ? 'হটলাইন নম্বর:' : 'Phone Hotline:'}</span>
          <span className="font-mono font-bold text-stone-800 truncate block">
            {settings.contactPhone || 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-stone-500 block text-[11px]">{isBn ? 'WhatsApp নম্বর:' : 'WhatsApp:'}</span>
          <span className="font-mono font-bold text-emerald-700 truncate block">
            {settings.officialWhatsapp || 'N/A'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Brand & Store Identity */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Store className="w-5 h-5 text-[#174D35]" />
            <h3 className="font-bold text-stone-900 text-sm">
              {isBn ? '১. স্টোরের নাম ও ব্র্যান্ড পরিচিতি' : '1. Store Name & Brand Identity'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্টোরের নাম (বাংলায়) *
              </label>
              <input
                type="text"
                value={settings.storeNameBn || ''}
                onChange={(e) => setSettings({ ...settings, storeNameBn: e.target.value })}
                placeholder="যেমন: গার্ডেনভ্যালি"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Name (in English) *
              </label>
              <input
                type="text"
                value={settings.storeNameEn || ''}
                onChange={(e) => setSettings({ ...settings, storeNameEn: e.target.value })}
                placeholder="e.g. Gardenvaly"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্বাক্ষর / সাব-টাইটেল (বাংলা)
              </label>
              <input
                type="text"
                value={settings.signatureBn || ''}
                onChange={(e) => setSettings({ ...settings, signatureBn: e.target.value })}
                placeholder="যেমন: বাই হাসনাহেনা"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Signature / Sub-title (English)
              </label>
              <input
                type="text"
                value={settings.signatureEn || ''}
                onChange={(e) => setSettings({ ...settings, signatureEn: e.target.value })}
                placeholder="e.g. by Hasna Hena"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ট্যাগলাইন (বাংলা)
              </label>
              <input
                type="text"
                value={settings.taglineBn || ''}
                onChange={(e) => setSettings({ ...settings, taglineBn: e.target.value })}
                placeholder="যেমন: সবুজে সাজুক জীবন"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tagline (English)
              </label>
              <input
                type="text"
                value={settings.taglineEn || ''}
                onChange={(e) => setSettings({ ...settings, taglineEn: e.target.value })}
                placeholder="e.g. Grow Green, Live Beautiful"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>
        </div>

        {/* 2. Mobile Banking & Payment Setup (bKash & Nagad) */}
        <div className="bg-white rounded-3xl border-2 border-emerald-800/20 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-50 text-pink-700">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {isBn ? '২. বিকাশ ও নগদ পেমেন্ট সেটিংস (bKash & Nagad)' : '2. Mobile Banking (bKash & Nagad) Settings'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isBn
                    ? 'চেকআউট পেজে কাস্টমাররা এই নম্বরে টাকা পাঠাবেন'
                    : 'These numbers will be displayed during customer checkout'}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 font-bold">
              bKash / Nagad
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* bKash Number */}
            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-pink-700" />
                  বিকাশ নম্বর (bKash Number)
                </span>
                <select
                  value={settings.bkashType || 'Personal'}
                  onChange={(e) => setSettings({ ...settings, bkashType: e.target.value as 'Personal' | 'Merchant' })}
                  className="text-xs font-semibold bg-white border border-pink-300 rounded-lg px-2 py-1 text-pink-900"
                >
                  <option value="Personal">পার্সোনাল (Personal)</option>
                  <option value="Merchant">মার্চেন্ট (Merchant)</option>
                </select>
              </div>
              <input
                type="text"
                value={settings.bkashNumber || ''}
                onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                placeholder="যেমন: 01712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 bg-white text-xs sm:text-sm font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-[10px] text-stone-500">
                {isBn ? 'কাস্টমার এই বিকাশ নম্বরে Send Money / Payment করবেন।' : 'Customer will send money to this bKash number.'}
              </p>
            </div>

            {/* Nagad Number */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  নগদ নম্বর (Nagad Number)
                </span>
                <select
                  value={settings.nagadType || 'Personal'}
                  onChange={(e) => setSettings({ ...settings, nagadType: e.target.value as 'Personal' | 'Merchant' })}
                  className="text-xs font-semibold bg-white border border-amber-300 rounded-lg px-2 py-1 text-amber-900"
                >
                  <option value="Personal">পার্সোনাল (Personal)</option>
                  <option value="Merchant">মার্চেন্ট (Merchant)</option>
                </select>
              </div>
              <input
                type="text"
                value={settings.nagadNumber || ''}
                onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                placeholder="যেমন: 01712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[10px] text-stone-500">
                {isBn ? 'কাস্টমার এই নগদ নম্বরে ক্যাশ-ইন / সেন্ড মানি করবেন।' : 'Customer will send payment to this Nagad number.'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isBn ? 'কাস্টমারদের জন্য পেমেন্ট নির্দেশিকা (Payment Instructions)' : 'Customer Payment Instructions'}
            </label>
            <input
              type="text"
              value={settings.paymentInstructionsBn || ''}
              onChange={(e) => setSettings({ ...settings, paymentInstructionsBn: e.target.value })}
              placeholder="বিকাশ বা নগদ অ্যাপ থেকে ওপরের নম্বরে Send Money করুন এবং TrxID নিচে লিখুন।"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            />
          </div>
        </div>

        {/* 3. Contact & Hotline Lines */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Phone className="w-5 h-5 text-[#5C8D50]" />
            <h3 className="font-bold text-stone-900 text-sm">
              {isBn ? '৩. যোগাযোগের চ্যানেল ও হেল্পলাইন নম্বর' : '3. Contact Lines & WhatsApp Hotline'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                অফিসিয়াল ফোন নম্বর (Official Phone) *
              </label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+880 1712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                WhatsApp নম্বর (হটলাইন) *
              </label>
              <input
                type="text"
                value={settings.officialWhatsapp || ''}
                onChange={(e) => setSettings({ ...settings, officialWhatsapp: e.target.value })}
                placeholder="+880 1712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্টোর ইমেইল (Store Email)
              </label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@gardenvaly.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                নার্সারির ঠিকানা (বাংলা)
              </label>
              <input
                type="text"
                value={settings.locationBn || ''}
                onChange={(e) => setSettings({ ...settings, locationBn: e.target.value })}
                placeholder="যেমন: ঢাকা, বাংলাদেশ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Location (English)
              </label>
              <input
                type="text"
                value={settings.locationEn || ''}
                onChange={(e) => setSettings({ ...settings, locationEn: e.target.value })}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>
        </div>

        {/* 4. Delivery Fees & Policies */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Truck className="w-5 h-5 text-[#174D35]" />
            <h3 className="font-bold text-stone-900 text-sm">
              {isBn ? '৪. ডেলিভারি ও প্যাকেজিং কনফিগারেশন' : '4. Delivery Rates & Policies'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্ট্যান্ডার্ড ডেলিভারি চার্জ (BDT ৳)
              </label>
              <input
                type="number"
                value={settings.standardDeliveryFee ?? 60}
                onChange={(e) =>
                  setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ফ্রি ডেলিভারি সীমা (BDT ৳)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold ?? 2000}
                onChange={(e) =>
                  setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.enablePickup}
                onChange={(e) => setSettings({ ...settings, enablePickup: e.target.checked })}
                className="w-4 h-4 rounded text-[#174D35] focus:ring-[#174D35]"
              />
              <span className="text-xs font-medium text-stone-700">
                {isBn ? 'লোকাল নার্সারি পিকআপ অপশন চালু রাখুন' : 'Enable Local Nursery Pickup Option'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.demoModeNotice}
                onChange={(e) => setSettings({ ...settings, demoModeNotice: e.target.checked })}
                className="w-4 h-4 rounded text-[#174D35] focus:ring-[#174D35]"
              />
              <span className="text-xs font-medium text-stone-700">
                {isBn ? 'ডেমো নোটিশ ব্যানার দৃশ্যমান রাখুন' : 'Show Frontend Demo Disclaimers'}
              </span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 py-3 px-8 rounded-2xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSaving
                ? isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'
                : isBn ? 'সকল পরিবর্তন সংরক্ষণ করুন' : 'Save All Settings'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
