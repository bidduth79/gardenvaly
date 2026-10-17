/**
 * @file BangladeshAddressSelector.tsx
 * @description Beautiful cascaded dropdown selector for Bangladesh addresses:
 * Division (বিভাগ) -> District (জেলা) -> Thana/Upazila (থানা/উপজেলা) -> Union (ইউনিয়ন).
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BANGLADESH_DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  getUnionsByUpazila,
  DistrictItem,
  UpazilaItem,
  UnionItem,
} from '../../data/bangladeshLocations';
import { MapPin, ChevronDown, Edit3 } from 'lucide-react';

export interface BangladeshAddressSelectorProps {
  division: string;
  district: string;
  upazila: string;
  union?: string;
  onChange: (field: 'division' | 'district' | 'upazila' | 'union', value: string) => void;
  errors?: {
    division?: string;
    district?: string;
    upazila?: string;
    union?: string;
  };
  required?: boolean;
  disabled?: boolean;
  showUnion?: boolean;
  compact?: boolean;
}

export const BangladeshAddressSelector: React.FC<BangladeshAddressSelectorProps> = ({
  division,
  district,
  upazila,
  union = '',
  onChange,
  errors = {},
  required = true,
  disabled = false,
  showUnion = true,
  compact = false,
}) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [upazilas, setUpazilas] = useState<UpazilaItem[]>([]);
  const [unions, setUnions] = useState<UnionItem[]>([]);
  const [isCustomUnion, setIsCustomUnion] = useState<boolean>(false);

  // Update districts when division changes
  useEffect(() => {
    if (division) {
      const distList = getDistrictsByDivision(division);
      setDistricts(distList);
    } else {
      setDistricts([]);
    }
  }, [division]);

  // Update upazilas when district changes
  useEffect(() => {
    if (district) {
      const upzList = getUpazilasByDistrict(district);
      setUpazilas(upzList);
    } else {
      setUpazilas([]);
    }
  }, [district]);

  // Update unions when upazila changes
  useEffect(() => {
    if (upazila) {
      const unList = getUnionsByUpazila(upazila);
      setUnions(unList);
      // Check if current union is in the list
      if (union && !unList.some((u) => u.id === union || u.nameBn === union || u.nameEn === union)) {
        setIsCustomUnion(true);
      }
    } else {
      setUnions([]);
    }
  }, [upazila]);

  const handleDivisionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDiv = e.target.value;
    onChange('division', newDiv);
    onChange('district', '');
    onChange('upazila', '');
    onChange('union', '');
    setIsCustomUnion(false);
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    onChange('district', newDist);
    onChange('upazila', '');
    onChange('union', '');
    setIsCustomUnion(false);
  };

  const handleUpazilaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUpz = e.target.value;
    onChange('upazila', newUpz);
    onChange('union', '');
    setIsCustomUnion(false);
  };

  const handleUnionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomUnion(true);
      onChange('union', '');
    } else {
      setIsCustomUnion(false);
      onChange('union', val);
    }
  };

  const selectContainerClass = compact
    ? 'w-full px-3 py-2 text-xs bg-stone-50 border rounded-xl transition-colors focus:bg-white focus:outline-none focus:ring-2 appearance-none'
    : 'w-full px-3.5 py-2.5 sm:py-3 text-sm bg-stone-50 border rounded-xl transition-colors focus:bg-white focus:outline-none focus:ring-2 min-h-[44px] appearance-none';

  return (
    <div className="space-y-3">
      {/* 4-Column Responsive Grid on large screens, 2-col on tablet, 1-col on mobile */}
      <div
        className={`grid gap-2.5 sm:gap-3 ${
          showUnion ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {/* ─── 1. DIVISION DROPDOWN ────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
            <span>
              {t('division') || (isBn ? 'বিভাগ' : 'Division')}{' '}
              {required && <span className="text-red-500">*</span>}
            </span>
          </label>
          <div className="relative">
            <select
              value={division}
              onChange={handleDivisionSelect}
              disabled={disabled}
              className={`${selectContainerClass} pr-8 ${
                errors.division
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                  : 'border-stone-200 focus:ring-[#174D35] focus:border-[#174D35]'
              }`}
            >
              <option value="">{t('selectDivision') || (isBn ? '-- বিভাগ নির্বাচন করুন --' : '-- Select Division --')}</option>
              {BANGLADESH_DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {isBn ? `${d.nameBn} (${d.nameEn})` : `${d.nameEn} (${d.nameBn})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          {errors.division && (
            <p className="text-[11px] text-red-500 mt-1">{errors.division}</p>
          )}
        </div>

        {/* ─── 2. DISTRICT DROPDOWN ────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
            <span>
              {t('district') || (isBn ? 'জেলা' : 'District')}{' '}
              {required && <span className="text-red-500">*</span>}
            </span>
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={handleDistrictSelect}
              disabled={disabled || !division}
              className={`${selectContainerClass} pr-8 disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.district
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                  : 'border-stone-200 focus:ring-[#174D35] focus:border-[#174D35]'
              }`}
            >
              <option value="">
                {!division
                  ? isBn
                    ? '-- আগে বিভাগ বাছুন --'
                    : '-- Choose Division First --'
                  : t('selectDistrict') || (isBn ? '-- জেলা নির্বাচন করুন --' : '-- Select District --')}
              </option>
              {districts.map((dst) => (
                <option key={dst.id} value={dst.id}>
                  {isBn ? `${dst.nameBn} (${dst.nameEn})` : `${dst.nameEn} (${dst.nameBn})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          {errors.district && (
            <p className="text-[11px] text-red-500 mt-1">{errors.district}</p>
          )}
        </div>

        {/* ─── 3. THANA / UPAZILA DROPDOWN ─────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
            <span>
              {t('upazila') || (isBn ? 'থানা / উপজেলা' : 'Thana / Upazila')}{' '}
              {required && <span className="text-red-500">*</span>}
            </span>
          </label>
          <div className="relative">
            <select
              value={upazila}
              onChange={handleUpazilaSelect}
              disabled={disabled || !district}
              className={`${selectContainerClass} pr-8 disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.upazila
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                  : 'border-stone-200 focus:ring-[#174D35] focus:border-[#174D35]'
              }`}
            >
              <option value="">
                {!district
                  ? isBn
                    ? '-- আগে জেলা বাছুন --'
                    : '-- Choose District First --'
                  : t('selectUpazila') || (isBn ? '-- থানা/উপজেলা নির্বাচন করুন --' : '-- Select Thana/Upazila --')}
              </option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.id}>
                  {isBn ? `${u.nameBn} (${u.nameEn})` : `${u.nameEn} (${u.nameBn})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          {errors.upazila && (
            <p className="text-[11px] text-red-500 mt-1">{errors.upazila}</p>
          )}
        </div>

        {/* ─── 4. UNION DROPDOWN ────────────────────────────────────────── */}
        {showUnion && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
              <span>
                {t('union') || (isBn ? 'ইউনিয়ন' : 'Union')}{' '}
                {required && <span className="text-red-500">*</span>}
              </span>
              {isCustomUnion && (
                <button
                  type="button"
                  onClick={() => setIsCustomUnion(false)}
                  className="text-[10px] text-[#174D35] underline font-medium hover:opacity-80"
                >
                  {isBn ? 'ইউনিয়ন তালিকা' : 'Union list'}
                </button>
              )}
            </label>

            {!isCustomUnion ? (
              <div className="relative">
                <select
                  value={union}
                  onChange={handleUnionSelect}
                  disabled={disabled || !upazila}
                  className={`${selectContainerClass} pr-8 disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.union
                      ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                      : 'border-stone-200 focus:ring-[#174D35] focus:border-[#174D35]'
                  }`}
                >
                  <option value="">
                    {!upazila
                      ? isBn
                        ? '-- আগে থানা বাছুন --'
                        : '-- Choose Thana First --'
                      : t('selectUnion') || (isBn ? '-- ইউনিয়ন নির্বাচন করুন --' : '-- Select Union --')}
                  </option>
                  {unions.map((un) => (
                    <option key={un.id} value={un.id}>
                      {isBn ? un.nameBn : un.nameEn}
                    </option>
                  ))}
                  {upazila && (
                    <option value="__custom__">
                      ✏️ {isBn ? 'অন্যান্য (নিজের ইউনিয়ন লিখুন)...' : 'Other (Type custom union)...'}
                    </option>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            ) : (
              <div className="relative">
                <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={union}
                  onChange={(e) => onChange('union', e.target.value)}
                  placeholder={
                    t('customUnionPlaceholder') ||
                    (isBn ? 'ইউনিয়নের নাম লিখুন...' : 'Type union name...')
                  }
                  className={`${selectContainerClass} pl-9 ${
                    errors.union
                      ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                      : 'border-stone-200 focus:ring-[#174D35] focus:border-[#174D35]'
                  }`}
                />
              </div>
            )}

            {errors.union && (
              <p className="text-[11px] text-red-500 mt-1">{errors.union}</p>
            )}
          </div>
        )}
      </div>

      {/* Selected location breadcrumb badge */}
      {division && district && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#174D35] bg-[#174D35]/5 border border-[#174D35]/15 px-3 py-1.5 rounded-xl font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#5C8D50] shrink-0" />
          <span className="truncate">
            {division} {district ? `› ${district}` : ''} {upazila ? `› ${upazila}` : ''}{' '}
            {union ? `› ${union}` : ''}
          </span>
        </div>
      )}
    </div>
  );
};
