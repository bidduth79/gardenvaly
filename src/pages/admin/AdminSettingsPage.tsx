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
  MessageSquare,
  Send,
  Zap,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { StoreSettings } from '../../types/admin';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreSettings } from '../../services/settingsService';
import { integrationService } from '../../services/integrationService';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings: globalSettings, saveSettings } = useStoreSettings();

  const [settings, setSettings] = useState<StoreSettings>(globalSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Integration test states
  const [courierTesting, setCourierTesting] = useState(false);
  const [courierTestResult, setCourierTestResult] = useState<string | null>(null);
  const [smsTesting, setSmsTesting] = useState(false);
  const [smsTestPhone, setSmsTestPhone] = useState('');
  const [smsTestResult, setSmsTestResult] = useState<string | null>(null);

  // Sync state when globalSettings loads from server
  useEffect(() => {
    setSettings(globalSettings);
  }, [globalSettings]);

  const handleTestCourier = async () => {
    setCourierTesting(true);
    setCourierTestResult(null);
    try {
      const res = await integrationService.testCourier(settings.courierProvider || 'steadfast');
      if (res.success) {
        setCourierTestResult(res.message || 'Courier connection successful');
      } else {
        setCourierTestResult(res.error || 'Courier test failed');
      }
    } catch {
      setCourierTestResult('Network error testing courier');
    } finally {
      setCourierTesting(false);
    }
  };

  const handleTestSms = async () => {
    if (!smsTestPhone) {
      setSmsTestResult(language === 'bn' ? 'একটি টেস্ট মোবাইল নম্বর দিন' : 'Enter a test phone number');
      return;
    }
    setSmsTesting(true);
    setSmsTestResult(null);
    try {
      const res = await integrationService.testSms(smsTestPhone);
      if (res.success) {
        setSmsTestResult(res.message || 'SMS test completed');
      } else {
        setSmsTestResult(res.error || 'Failed to send test SMS');
      }
    } catch {
      setSmsTestResult('Network error testing SMS');
    } finally {
      setSmsTesting(false);
    }
  };

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

        {/* 5. Courier Delivery API Integration (Steadfast, Pathao, RedX) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                {isBn ? '৫. কুরিয়ার সার্ভিস এপিআই ইন্টিগ্রেশন (Steadfast, Pathao, RedX)' : '5. Courier API Integration'}
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {settings.courierProvider ? settings.courierProvider.toUpperCase() : 'STEADFAST'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'ডিফল্ট কুরিয়ার সার্ভিস নির্বাচন করুন' : 'Default Courier Partner'}
              </label>
              <select
                value={settings.courierProvider || 'steadfast'}
                onChange={(e) => setSettings({ ...settings, courierProvider: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35] bg-white cursor-pointer"
              >
                <option value="steadfast">Steadfast Courier (স্টেডফাস্ট)</option>
                <option value="pathao">Pathao Courier (পাঠাও কুরিয়ার)</option>
                <option value="redx">RedX Delivery (রেডএক্স)</option>
                <option value="manual">Manual / Own Delivery (ম্যানুয়াল)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.autoCreateCourierParcel ?? false}
                  onChange={(e) => setSettings({ ...settings, autoCreateCourierParcel: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-stone-700">
                  {isBn ? 'অর্ডার "Confirmed" হলেই স্বয়ংক্রিয়ভাবে পার্সেল তৈরি করুন' : 'Auto-dispatch to courier when confirmed'}
                </span>
              </label>
            </div>
          </div>

          {/* Steadfast specific fields */}
          {(settings.courierProvider === 'steadfast' || !settings.courierProvider) && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">Steadfast Courier API Credentials</span>
                <span className="text-[11px] text-stone-500 font-mono">portal.steadfast.com.bd</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">API Key</label>
                  <input
                    type="password"
                    value={settings.steadfastApiKey || ''}
                    onChange={(e) => setSettings({ ...settings, steadfastApiKey: e.target.value })}
                    placeholder="Enter Steadfast API Key"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={settings.steadfastSecretKey || ''}
                    onChange={(e) => setSettings({ ...settings, steadfastSecretKey: e.target.value })}
                    placeholder="Enter Steadfast Secret Key"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pathao specific fields */}
          {settings.courierProvider === 'pathao' && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">Pathao Courier Credentials</span>
                <span className="text-[11px] text-stone-500 font-mono">merchant.pathao.com</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Client ID</label>
                  <input
                    type="text"
                    value={settings.pathaoClientId || ''}
                    onChange={(e) => setSettings({ ...settings, pathaoClientId: e.target.value })}
                    placeholder="Pathao Client ID"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Client Secret</label>
                  <input
                    type="password"
                    value={settings.pathaoClientSecret || ''}
                    onChange={(e) => setSettings({ ...settings, pathaoClientSecret: e.target.value })}
                    placeholder="Pathao Client Secret"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* RedX specific fields */}
          {settings.courierProvider === 'redx' && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <span className="text-xs font-bold text-indigo-950">RedX Delivery API Token</span>
              <input
                type="password"
                value={settings.redxApiToken || ''}
                onChange={(e) => setSettings({ ...settings, redxApiToken: e.target.value })}
                placeholder="Enter RedX Bearer Token"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
              />
            </div>
          )}

          {/* Courier Test button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestCourier}
              disabled={courierTesting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{courierTesting ? (isBn ? 'পরীক্ষা হচ্ছে...' : 'Testing...') : (isBn ? 'কানেকশন টেস্ট করুন' : 'Test Connection')}</span>
            </button>
            {courierTestResult && (
              <span className="text-xs font-medium text-stone-600 italic">
                {courierTestResult}
              </span>
            )}
          </div>
        </div>

        {/* 6. Bangladeshi SMS Gateway (Greenweb, BulkSMS BD) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                {isBn ? '৬. বাংলা এসএমএস গেটওয়ে কনফিগারেশন' : '6. SMS Gateway Notifications'}
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
              {settings.smsProvider ? settings.smsProvider.toUpperCase() : 'DISABLED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'এসএমএস গেটওয়ে নির্বাচন' : 'SMS Provider'}
              </label>
              <select
                value={settings.smsProvider || 'disabled'}
                onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D35] bg-white cursor-pointer"
              >
                <option value="disabled">{isBn ? 'বন্ধ রাখুন (সিমুলেশন মোড)' : 'Disabled / Simulation'}</option>
                <option value="greenweb">Greenweb BD (api.greenweb.com.bd)</option>
                <option value="bulksmsbd">BulkSMS BD (bulksmsbd.net)</option>
                <option value="custom_webhook">Custom Webhook Endpoint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'এপিআই কি / টোকেন' : 'API Key / Token'}
              </label>
              <input
                type="password"
                value={settings.smsApiKey || ''}
                onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                placeholder="SMS API Token"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'সেন্ডার আইডি (Sender ID)' : 'Sender ID'}
              </label>
              <input
                type="text"
                value={settings.smsSenderId || ''}
                onChange={(e) => setSettings({ ...settings, smsSenderId: e.target.value })}
                placeholder="e.g. Gardenvaly"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold"
              />
            </div>
          </div>

          {settings.smsProvider === 'custom_webhook' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Webhook URL</label>
              <input
                type="url"
                value={settings.smsWebhookUrl || ''}
                onChange={(e) => setSettings({ ...settings, smsWebhookUrl: e.target.value })}
                placeholder="https://your-webhook-endpoint.com/sms"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>
          )}

          {/* SMS Notification Toggles */}
          <div className="pt-2 border-t border-stone-100">
            <span className="block text-xs font-bold text-stone-700 mb-2">
              {isBn ? 'কোন কোন ইভেন্টে কাস্টমারকে স্বয়ংক্রিয় এসএমএস পাঠানো হবে:' : 'Automatic Customer SMS Triggers:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.sendSmsOnOrderPlaced ?? true}
                  onChange={(e) => setSettings({ ...settings, sendSmsOnOrderPlaced: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isBn ? '১. নতুন অর্ডার সাবমিট হলে কনফার্মেশন এসএমএস' : '1. Order Placed Confirmation'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.sendSmsOnOrderConfirmed ?? true}
                  onChange={(e) => setSettings({ ...settings, sendSmsOnOrderConfirmed: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isBn ? '২. অ্যাডমিন অর্ডার কনফার্ম করলে এসএমএস' : '2. Order Confirmed SMS'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.sendSmsOnOrderShipped ?? true}
                  onChange={(e) => setSettings({ ...settings, sendSmsOnOrderShipped: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isBn ? '৩. কুরিয়ারে শিপ হলে ট্র্যাকিং লিংক সহ এসএমএস' : '3. Courier Dispatched with Tracking Link'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.sendSmsOnOrderDelivered ?? true}
                  onChange={(e) => setSettings({ ...settings, sendSmsOnOrderDelivered: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isBn ? '৪. সফল ডেলিভারি সম্পন্ন হলে ধন্যবাদ এসএমএস' : '4. Delivery Completed Thank You SMS'}</span>
              </label>
            </div>
          </div>

          {/* Test SMS box */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={smsTestPhone}
              onChange={(e) => setSmsTestPhone(e.target.value)}
              placeholder="017XXXXXXXX (পরীক্ষামূলক নম্বর)"
              className="w-full sm:w-64 px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
            />
            <button
              type="button"
              onClick={handleTestSms}
              disabled={smsTesting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{smsTesting ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending...') : (isBn ? 'টেস্ট এসএমএস পাঠান' : 'Send Test SMS')}</span>
            </button>
            {smsTestResult && (
              <span className="text-xs font-medium text-stone-700 italic">
                {smsTestResult}
              </span>
            )}
          </div>
        </div>

        {/* 7. Online Payment Gateways (bKash Merchant & SSLCommerz) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                {isBn ? '৭. অনলাইন পেমেন্ট গেটওয়ে (bKash Checkout ও SSLCommerz)' : '7. Online Payment Gateways'}
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">
              Merchant Direct
            </span>
          </div>

          {/* bKash Merchant API */}
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.bkashMerchantEnabled ?? false}
                  onChange={(e) => setSettings({ ...settings, bkashMerchantEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-pink-950">
                  {isBn ? 'বিকাশ মার্চেন্ট অনলাইন পেমেন্ট গেটওয়ে সক্রিয় করুন' : 'Enable bKash Merchant Checkout API'}
                </span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.bkashSandbox ?? true}
                  onChange={(e) => setSettings({ ...settings, bkashSandbox: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-pink-600"
                />
                <span>Sandbox / Test Mode</span>
              </label>
            </div>

            {settings.bkashMerchantEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">bKash App Key</label>
                  <input
                    type="password"
                    value={settings.bkashAppKey || ''}
                    onChange={(e) => setSettings({ ...settings, bkashAppKey: e.target.value })}
                    placeholder="Enter App Key"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">bKash App Secret</label>
                  <input
                    type="password"
                    value={settings.bkashAppSecret || ''}
                    onChange={(e) => setSettings({ ...settings, bkashAppSecret: e.target.value })}
                    placeholder="Enter App Secret"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">API Username</label>
                  <input
                    type="text"
                    value={settings.bkashUsername || ''}
                    onChange={(e) => setSettings({ ...settings, bkashUsername: e.target.value })}
                    placeholder="bKash Merchant Username"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">API Password</label>
                  <input
                    type="password"
                    value={settings.bkashPassword || ''}
                    onChange={(e) => setSettings({ ...settings, bkashPassword: e.target.value })}
                    placeholder="bKash Merchant Password"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SSLCommerz Gateway */}
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.sslcommerzEnabled ?? false}
                  onChange={(e) => setSettings({ ...settings, sslcommerzEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-950">
                  {isBn ? 'SSLCommerz গেটওয়ে সক্রিয় করুন (Cards, Visa, MFS)' : 'Enable SSLCommerz Payment Gateway'}
                </span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sslcommerzSandbox ?? true}
                  onChange={(e) => setSettings({ ...settings, sslcommerzSandbox: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-amber-600"
                />
                <span>Sandbox / Test Mode</span>
              </label>
            </div>

            {settings.sslcommerzEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Store ID</label>
                  <input
                    type="text"
                    value={settings.sslcommerzStoreId || ''}
                    onChange={(e) => setSettings({ ...settings, sslcommerzStoreId: e.target.value })}
                    placeholder="SSLCommerz Store ID"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Store Password</label>
                  <input
                    type="password"
                    value={settings.sslcommerzStorePass || ''}
                    onChange={(e) => setSettings({ ...settings, sslcommerzStorePass: e.target.value })}
                    placeholder="SSLCommerz Store Password"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            )}
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
