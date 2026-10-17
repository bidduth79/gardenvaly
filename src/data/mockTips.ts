/**
 * @file mockTips.ts
 * @description 3 Editorial gardening guidance articles by Hasna Hena.
 */

import { GardenTip } from '../types';

export const MOCK_TIPS: GardenTip[] = [
  {
    id: 'indoor-plant-care',
    titleEn: 'How to Care for Indoor Plants',
    titleBn: 'ইনডোর গাছের সহজ ও সঠিক যত্ন',
    excerptEn: 'Proper lighting, avoiding waterlogging, and gentle leaf dusting secrets to keep indoor greens lush and thriving.',
    excerptBn: 'পরিমিত আলো, অতিরিক্ত পানি পরিহার এবং পাতার ধুলাবালি পরিষ্কার করে ইনডোর গাছকে সতেজ রাখার পরীক্ষিত উপায়।',
    readTimeEn: '4 min read',
    readTimeBn: '৪ মিনিট পাঠ',
    categoryEn: 'Indoor Gardening',
    categoryBn: 'ইনডোর বাগান',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-04-01',
  },
  {
    id: 'choosing-right-soil',
    titleEn: 'Choosing the Right Soil for Potted Plants',
    titleBn: 'টবের গাছের জন্য সঠিক মাটি নির্বাচন',
    excerptEn: 'Crafting well-draining potting mixes with coco peat, compost, and vermicompost for root health.',
    excerptBn: 'দোআঁশ মাটি, কোকোপিট, গোবর সার ও ভার্মিকম্পোস্টের সঠিক অনুপাতে স্বাস্থ্যকর টবের মাটি প্রস্তুতকরণ।',
    readTimeEn: '5 min read',
    readTimeBn: '৫ মিনিট পাঠ',
    categoryEn: 'Soil & Compost',
    categoryBn: 'মাটি ও পুষ্টি',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-04-05',
  },
  {
    id: 'when-to-plant-seeds',
    titleEn: 'When to Plant Seeds: The Seasonal Calendar',
    titleBn: 'বীজ বপনের সঠিক সময় ও ঋতুভিত্তিক ক্যালেন্ডার',
    excerptEn: 'Understanding seasonal temperatures and optimal sowing moisture for highest seedling survival in Bangladesh.',
    excerptBn: 'ঋতুভিত্তিক তাপমাত্রা এবং সঠিক আর্দ্রতায় বীজ বপন করে সফলভাবে চারা উৎপাদনের উপযুক্ত সময়সূচি।',
    readTimeEn: '3 min read',
    readTimeBn: '৩ মিনিট পাঠ',
    categoryEn: 'Seed Cultivation',
    categoryBn: 'বীজ চাষাবাদ',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-04-10',
  },
];
