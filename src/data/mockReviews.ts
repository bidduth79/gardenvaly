/**
 * @file mockReviews.ts
 * @description Transparent sample customer reviews for storefront presentation.
 */

import { ReviewItem } from '../types';

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorEn: 'Dr. Nusrat Jahan',
    authorBn: 'ডা. নুসরাত জাহান',
    locationEn: 'Dhanmondi, Dhaka',
    locationBn: 'ধানমন্ডি, ঢাকা',
    commentEn: 'The Amrapali mango sapling arrived fresh with vibrant healthy green leaves. Superb packaging!',
    commentBn: 'আম্রপালি আমের চারাটি অত্যন্ত সতেজ ও সুস্থ অবস্থায় পেয়েছি। প্যাকেজিং সত্যিই চমৎকার ছিল!',
    rating: 5,
    dateEn: '2 days ago',
    dateBn: '২ দিন আগে',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-2',
    authorEn: 'Tanvir Ahmed',
    authorBn: 'তানভীর আহমেদ',
    locationEn: 'Uttara, Dhaka',
    locationBn: 'উত্তরা, ঢাকা',
    commentEn: 'Cherry tomato and chili seeds germinated within 4 days. Hasna Hena’s care guides made it very easy.',
    commentBn: 'চেরি টমেটো ও কাঁচামরিচের বীজ মাত্র ৪ দিনেই গজিয়েছে। হাসনাহেনার পরিচর্যার টিপস খুব কাজে লেগেছে।',
    rating: 5,
    dateEn: '1 week ago',
    dateBn: '১ সপ্তাহ আগে',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-3',
    authorEn: 'Shamima Akter',
    authorBn: 'শামীমা আক্তার',
    locationEn: 'Chittagong',
    locationBn: 'চট্টগ্রাম',
    commentEn: 'The Kashmiri rose plant started blooming within three weeks. Heavenly fragrance on my rooftop!',
    commentBn: 'কাশ্মীরি গোলাপ গাছটি লাগানোর তিন সপ্তাহের মধ্যেই ফুল ফুটেছে। সুবাসে পুরো ছাদবাগান ভরে উঠেছে!',
    rating: 5,
    dateEn: '2 weeks ago',
    dateBn: '২ সপ্তাহ আগে',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
];
