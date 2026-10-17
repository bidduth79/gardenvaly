/**
 * @file CustomerInformationForm.tsx
 * @description Customer shipping address form with real-time validation and error hints.
 */

import React, { useEffect } from 'react';
import { CustomerInfo } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { BangladeshAddressSelector } from '../common/BangladeshAddressSelector';

interface CustomerInformationFormProps {
  formData: CustomerInfo;
  errors: Record<string, string>;
  onChange: (field: keyof CustomerInfo, value: string) => void;
}

export const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({
  formData,
  errors,
  onChange,
}) => {
  const { t, language } = useLanguage();
  const { customer, isAuthenticated } = useCustomerAuth();

  // Auto-populate form when customer is logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      if (!formData.fullName && customer.fullName) onChange('fullName', customer.fullName);
      if (!formData.mobileNumber && customer.mobileNumber) onChange('mobileNumber', customer.mobileNumber);
      if (!formData.email && customer.email) onChange('email', customer.email);
      if (!formData.division && customer.division) onChange('division', customer.division);
      if (!formData.district && customer.district) onChange('district', customer.district);
      if (!formData.upazila && customer.upazila) onChange('upazila', customer.upazila);
      if (!formData.union && customer.union) onChange('union', customer.union);
      if (!formData.addressDetail && customer.addressDetail) onChange('addressDetail', customer.addressDetail);
    }
  }, [isAuthenticated, customer]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h2 className="font-serif-botanical font-bold text-lg text-stone-900">
          {t('customerInformation')}
        </h2>
        {isAuthenticated && customer && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{customer.fullName} ({language === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Auto-filled'})</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="e.g. Hasna Hena"
            autoComplete="name"
            className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 focus:ring-[#174D35]'
            }`}
          />
          {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('mobileNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.mobileNumber}
            onChange={(e) => onChange('mobileNumber', e.target.value)}
            placeholder="01XXXXXXXXX"
            className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.mobileNumber ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 focus:ring-[#174D35]'
            }`}
          />
          {errors.mobileNumber && <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber}</p>}
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {t('emailAddress')}
        </label>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="e.g. name@example.com"
          className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[44px] ${
            errors.email ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 focus:ring-[#174D35]'
          }`}
        />
        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Division, District, Upazila & Union Cascading Dropdown Selector */}
      <BangladeshAddressSelector
        division={formData.division}
        district={formData.district}
        upazila={formData.upazila}
        union={formData.union}
        onChange={(field, val) => onChange(field, val)}
        errors={errors}
        showUnion={true}
      />

      {/* Detailed Address */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {t('detailedAddress')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={2}
          value={formData.addressDetail}
          onChange={(e) => onChange('addressDetail', e.target.value)}
          placeholder="House no, Flat, Road, Holding..."
          autoComplete="street-address"
          className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 ${
            errors.addressDetail ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 focus:ring-[#174D35]'
          }`}
        />
        {errors.addressDetail && <p className="text-[11px] text-red-500 mt-1">{errors.addressDetail}</p>}
      </div>

      {/* Delivery Notes */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {t('deliveryInstructions')}
        </label>
        <input
          type="text"
          value={formData.deliveryInstructions || ''}
          onChange={(e) => onChange('deliveryInstructions', e.target.value)}
          placeholder="e.g. Leave with security / Call before arriving"
          className="w-full px-3.5 py-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35] min-h-[44px]"
        />
      </div>
    </div>
  );
};
