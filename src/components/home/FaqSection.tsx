/**
 * @file FaqSection.tsx
 * @description DesignMingle-inspired 2-column rounded FAQ accordion (.ov-faq)
 * with + to × rotating circular toggle badges and pill CTA button.
 */

import React, { useState } from 'react';
import { ArrowUpRight, HelpCircle, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FaqItem {
  id: string;
  qBn: string;
  qEn: string;
  aBn: string;
  aEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'delivery-safety',
    qBn: 'কুরিয়ারে গাছ পাঠালে চারা কি সতেজ ও অক্ষত থাকবে?',
    qEn: 'Will live plants stay fresh and undamaged during courier delivery?',
    aBn:
      'হ্যাঁ! আমরা প্রতিটি চারা কোকোপিট ময়েশ্চার প্যাকিং ও বিশেষ ভেন্টিলেটেড নার্সারি বক্সে প্যাক করি, যাতে ৩-৪ দিন পথে থাকলেও চারা শতভাগ সতেজ থাকে। যাত্রাপথে কোনো চারা ক্ষতিগ্রস্ত হলে আমরা বিনামূল্যে রিপ্লেসমেন্ট দিয়ে থাকি।',
    aEn:
      'Yes! Every sapling is packed with moisture-retaining cocopeat inside custom ventilated nursery boxes so it stays fresh for days. If any plant is damaged in transit, we provide a free replacement.',
  },
  {
    id: 'seed-germination',
    qBn: 'আপনাদের বীজের অঙ্কুরোদগম হার (Germination Rate) কেমন?',
    qEn: 'What is the germination rate of your organic seeds?',
    aBn:
      'আমাদের প্রতিটি সবজি ও ফুলের বীজ ল্যাব ও নার্সারিতে পরীক্ষিত এবং ৯৫% থেকে ৯৮% অঙ্কুরোদগম নিশ্চয়তাযুক্ত। প্রতিটি প্যাকেটের সাথে বীজ বপন ও চারা গজানোর সহজ নিয়মাবলী দেওয়া থাকে।',
    aEn:
      'All our heirloom vegetable and flower seeds are nursery-tested with a 95%–98% germination assurance. Easy sowing instructions are included with every order.',
  },
  {
    id: 'payment-methods',
    qBn: 'অর্ডার করার পর পেমেন্ট কিভাবে করব? ক্যাশ অন ডেলিভারি আছে কি?',
    qEn: 'How do I pay for my order? Is Cash on Delivery available?',
    aBn:
      'সারা বাংলাদেশে ৬৪ জেলায় আমাদের ক্যাশ অন ডেলিভারি (হাতে চারা পেয়ে মূল্য পরিশোধ) সুবিধা রয়েছে। এছাড়া বিকাশ ও নগদের মাধ্যমেও পেমেন্ট করতে পারবেন।',
    aEn:
      'We offer Cash on Delivery across all 64 districts of Bangladesh, as well as convenient bKash and Nagad mobile payment options.',
  },
  {
    id: 'beginner-care',
    qBn: 'আমি নতুন বাগানি—গাছের পরিচর্যা না জানলে কি সাহায্য পাব?',
    qEn: 'I am a beginner gardener—will I get plant care support after buying?',
    aBn:
      'অবশ্যই! আমাদের ওয়েবসাইটের "বাগান নির্দেশিকা" সেকশনে বিস্তারিত গাইড রয়েছে এবং যেকোনো সময় হোয়াটসঅ্যাপে গাছের ছবি পাঠিয়ে হাসনাহেনা ও আমাদের কৃষিবিদ টিমের ফ্রি পরামর্শ নিতে পারবেন।',
    aEn:
      'Absolutely! You can read our full care guides anytime or message us on WhatsApp with photos of your plant for free personal advice from Hasna Hena and our horticulture team.',
  },
  {
    id: 'delivery-time',
    qBn: 'অর্ডার কনফার্ম করার কত দিনের মধ্যে ডেলিভারি পাওয়া যায়?',
    qEn: 'How many days does delivery take after confirming an order?',
    aBn:
      'ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে যেকোনো জেলা বা উপজেলায় ২ থেকে ৪ কার্যদিবসের মধ্যে হোম ডেলিভারি সম্পন্ন হয়।',
    aEn:
      'Inside Dhaka city delivery takes 24–48 hours, and nationwide delivery across all districts takes 2–4 business days.',
  },
];

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DesignMingle .ov-faq 2-Column Layout (.8fr 1.2fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Intro Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174D35] dark:text-[#4ADE80]">
              <HelpCircle className="w-4 h-4" />
              <span>{isBn ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 dark:text-white leading-tight">
              {isBn
                ? 'গাছ ও বীজ অর্ডার নিয়ে আপনার মনে কোনো প্রশ্ন আছে?'
                : 'Questions About Ordering Live Plants & Seeds?'}
            </h2>

            <p className="text-sm sm:text-base text-stone-600 dark:text-[#CBD5E1] leading-relaxed">
              {isBn
                ? 'প্যাকিং, ডেলিভারি এবং গাছের পরিচর্যা নিয়ে গ্রাহকদের সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলোর উত্তর এখানে দেওয়া হলো।'
                : 'Everything you need to know about our breathable nursery packaging, nationwide delivery, and post-purchase plant care.'}
            </p>

            {/* DesignMingle .ov-btn Pill CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-4 h-12 pl-5 pr-1.5 rounded-full bg-[#121111] dark:bg-[#174D35] hover:bg-[#174D35] dark:hover:bg-[#4ADE80] text-white dark:hover:text-[#061810] text-sm font-medium shadow-lg transition-all duration-300"
              >
                <span>{isBn ? 'হোয়াটসঅ্যাপে সরাসরি কথা বলুন' : 'Ask Us on WhatsApp'}</span>
                <span className="w-9 h-9 rounded-full bg-white/15 dark:group-hover:bg-[#061810]/15 grid place-items-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Accordion Cards Column (7 cols — DesignMingle .ov-faq details style) */}
          <div className="lg:col-span-7 space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-[#EFEDEE]/85 dark:bg-[#0C2018] border border-stone-200/70 dark:border-[#1B3B2E] rounded-[22px] px-6 py-5 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-5 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-white leading-snug">
                      {isBn ? item.qBn : item.qEn}
                    </span>

                    <span
                      className={`w-9 h-9 rounded-full grid place-items-center shrink-0 transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen
                          ? 'rotate-45 bg-[#22C55E] text-[#061810]'
                          : 'bg-[#121111] dark:bg-[#174D35] text-white'
                      }`}
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </span>
                  </button>

                  {isOpen && (
                    <p className="mt-3.5 text-sm sm:text-[15px] text-stone-600 dark:text-[#CBD5E1] leading-relaxed pr-4 animate-fade-up-1">
                      {isBn ? item.aBn : item.aEn}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
