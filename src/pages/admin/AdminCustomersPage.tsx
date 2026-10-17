/**
 * @file AdminCustomersPage.tsx
 * @description Customer directory aggregated from plant & seed orders with lifetime purchase values and contact details.
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AdminCustomer } from '../../types/order';
import { useLanguage } from '../../context/LanguageContext';

export const AdminCustomersPage: React.FC = () => {
  const { language } = useLanguage();

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await orderService.getCustomers();
      setCustomers(list);
      setLoading(false);
    }
    load();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobileNumber.includes(searchTerm) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'bn' ? 'গ্রাহক ডিরেক্টরি' : 'Gardenvaly Customer Directory'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'অর্ডার থেকে প্রাপ্ত গ্রাহকদের তালিকা ও লাইফটাইম ক্রয়ের বিবরণ'
              : 'Registered customer profiles aggregated from multi-channel orders'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs">
          {language === 'bn' ? `মোট ${customers.length} জন গ্রাহক` : `Total ${customers.length} Customers`}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'bn' ? 'নাম, মোবাইল নম্বর বা জেলা...' : 'Search by name, phone, or district...'
            }
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">{language === 'bn' ? 'গ্রাহকের নাম' : 'Customer'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'জেলা ও বিভাগ' : 'Location'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'মোট অর্ডার' : 'Orders'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'মোট ক্রয়' : 'Total Spent'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'সর্বশেষ অর্ডার' : 'Last Order'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>{language === 'bn' ? 'কোনো গ্রাহক পাওয়া যায়নি।' : 'No customer records found.'}</span>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#174D35]/10 text-[#174D35] flex items-center justify-center font-bold text-xs">
                          {c.fullName.charAt(0)}
                        </div>
                        <p className="font-semibold text-stone-900">{c.fullName}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-stone-800 font-mono text-xs">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{c.mobileNumber}</span>
                        </div>
                        {c.email && (
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span>{c.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5C8D50]" />
                        <span>{c.district}, {c.division}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {c.totalOrders} {language === 'bn' ? 'টি' : 'orders'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ৳{c.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 text-xs">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
