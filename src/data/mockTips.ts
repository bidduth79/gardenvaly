/**
 * @file mockTips.ts
 * @description Comprehensive editorial gardening guidance articles & full-page documents by Hasna Hena.
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
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=85',
    publishedDate: '2026-04-01',
    contentBn: `ঘরের ভেতরে সবুজের ছোঁয়া শুধু চোখের প্রশান্তিই আনে না, বরং ঘরের বাতাসকে বিশুদ্ধ ও অক্সিজেনসমৃদ্ধ রাখতেও দারুণ ভূমিকা রাখে। তবে বাংলাদেশের আবহাওয়ায় ইনডোর গাছ সুস্থ রাখার জন্য আলো, পানি এবং বাতাসের সঠিক ভারসাম্য বজায় রাখা অত্যন্ত জরুরি।\n\nঅনেকেই মনে করেন ইনডোর প্ল্যান্ট মানেই অন্ধকার ঘরে রাখা যাবে—এটি একটি ভুল ধারণা। প্রতিটি গাছেরই সালোকসংশ্লেষণের জন্য পরোক্ষ প্রাকৃতিক আলো (Bright Indirect Light) প্রয়োজন। জানালার পাশে যেখানে সরাসরি কড়া রোদ পড়ে না কিন্তু প্রচুর আলো বাতাস চলাচল করে, এমন স্থান ইনডোর গাছের জন্য আদর্শ।\n\nইনডোর গাছ মারা যাওয়ার সবচেয়ে বড় কারণ হলো অতিরিক্ত পানি দেওয়া (Overwatering)। ঘরের ভেতরে রোদ কম থাকায় টবের মাটি শুকাতে সময় লাগে। তাই প্রতিদিন রুটিন করে পানি না দিয়ে, মাটির উপরের ১-২ ইঞ্চি শুকিয়েছে কি না তা আঙুল দিয়ে পরীক্ষা করে তবেই পানি দিন।`,
    contentEn: `Bringing greenery indoors not only creates visual serenity but also purifies indoor air and boosts oxygen levels. However, in Bangladesh's humid climate, maintaining the right balance of indirect light, watering, and airflow is essential for thriving indoor foliage.\n\nA common misconception is that indoor plants can survive in dark corners. Every living plant needs bright, indirect natural light for photosynthesis. Placing your pots near an east- or north-facing window with sheer curtains provides ideal illumination without scorching the leaves.\n\nThe leading cause of indoor plant loss is overwatering. Because indoor soil evaporates slowly, always check the top 1–2 inches of soil with your finger before watering.`,
    stepsBn: [
      'জানালার কাছাকাছি উজ্জ্বল কিন্তু পরোক্ষ আলোযুক্ত স্থানে গাছ রাখুন; কড়া দুপুরের রোদ এড়িয়ে চলুন।',
      'পানি দেওয়ার আগে আঙুল দিয়ে টবের উপরের ১.৫ ইঞ্চি মাটি পরীক্ষা করুন—ভেজা থাকলে পানি দেবেন না।',
      'সপ্তাহে অন্তত একদিন ভেজা নরম সুতি কাপড় দিয়ে গাছের পাতার উপরের ধুলাবালি আলতোভাবে মুছে দিন।',
      'টবের নিচে ড্রেনেজ ছিদ্র খোলা আছে কি না নিশ্চিত করুন যাতে অতিরিক্ত পানি জমে শিকড় পচে না যায়।',
      'মাসে একবার তরল জৈব সার বা এক চামচ ভার্মিকম্পোস্ট মাটির সাথে মিশিয়ে দিন।'
    ],
    stepsEn: [
      'Place plants in bright indirect light near a window, avoiding harsh midday sun.',
      'Test the top 1.5 inches of soil with your finger before watering—never water soggy soil.',
      'Gently wipe dust off the leaves once a week with a damp microfiber cloth so pores can breathe.',
      'Ensure every pot has unobstructed drainage holes at the bottom to prevent root rot.',
      'Feed once a month during spring and monsoon with mild liquid organic fertilizer or vermicompost.'
    ],
    proTipBn: 'সপ্তাহে অন্তত একবার সকালবেলা হালকা স্প্রেয়ার দিয়ে পাতায় পানি স্প্রে (Misting) করুন এবং মাসে ১-২ দিন গাছগুলোকে বারান্দার খোলা বাতাসে রাখুন।',
    proTipEn: 'Mist foliage lightly in the morning and rotate your indoor pots by 90 degrees every week so all sides grow evenly toward the light.'
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
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=85',
    publishedDate: '2026-04-05',
    contentBn: `টবের গাছের সুস্থতা ও দ্রুত বৃদ্ধির মূল রহস্য লুকিয়ে থাকে তার মাটির গুণাগুণের ওপর। সরাসরি বাগানের এঁটেল বা শক্ত মাটি টবে ব্যবহার করলে কয়েকদিন পরই মাটি জমাট বেঁধে যায়, ফলে শিকড়ে বাতাস চলাচল বন্ধ হয়ে যায় এবং পানি জমে গাছ মারা যায়।\n\nআদর্শ পটিং মিক্স (Potting Mix) এমন হতে হবে যা একই সাথে ঝুরঝুরে, হালকা, পুষ্টিসমৃদ্ধ এবং অতিরিক্ত পানি দ্রুত বের করে দিতে সক্ষম। ইনডোর, আউটডোর কিংবা ছাদবাগানের টবের জন্য দোআঁশ মাটির সাথে কোকোপিট, পচা গোবর সার বা ভার্মিকম্পোস্ট এবং সামান্য মোটা লাল বালির মিশ্রণ সবচেয়ে ভালো কাজ করে।\n\nএছাড়া মাটিতে ছত্রাক ও ক্ষতিকর কৃমি প্রতিরোধের জন্য প্রতি টবের মাটিতে এক মুঠো নিম খৈল এবং আধা চামচ ট্রাইকোডার্মা বা হাড়ের গুঁড়া মিশিয়ে নিলে গাছ দীর্ঘদিন রোগমুক্ত ও সতেজ থাকে।`,
    contentEn: `The secret to lush, fast-growing potted plants lies beneath the surface—in the quality of your potting soil. Using heavy garden clay directly in containers causes compaction, suffocating roots and trapping excess water.\n\nAn ideal potting mix must be airy, lightweight, nutrient-dense, and fast-draining while holding just enough moisture. Combining garden loam with washed coco peat, aged vermicompost, and coarse river sand creates the perfect root environment for rooftop and balcony containers.\n\nAdding neem cake powder and bone meal protects roots from soil-borne fungi and provides slow-release phosphorus for stronger stems and blooms.`,
    stepsBn: [
      '৪০% দোআঁশ মাটি + ৩০% ভার্মিকম্পোস্ট বা পুরনো পচা গোবর সার + ২০% কোকোপিট + ১০% মোটা বালি একসাথে মেশান।',
      'কোকোপিট ব্যবহারের আগে পরিষ্কার পানিতে ধুয়ে রোদে শুকিয়ে নিন যাতে অতিরিক্ত লবণ দূর হয়ে যায়।',
      'ছত্রাক ও পোকামাকড় রোধে প্রতি ১০ ইঞ্চি টবের মাটিতে ১ মুঠো নিম খৈল ও ১ চামচ হাড়ের গুঁড়া মেশান।',
      'টবে মাটি ভরার আগে নিচের ছিদ্রের ওপর খোলামকুচি বা ইটের ছোট টুকরো এবং তার ওপর সামান্য বালি দিন।',
      'প্রস্তুতকৃত মাটি ৭ দিন ছায়াযুক্ত স্থানে ঢেকে রেখে তারপর চারা রোপণ করলে সবচেয়ে ভালো ফলাফল পাওয়া যায়।'
    ],
    stepsEn: [
      'Blend 40% garden loam + 30% vermicompost + 20% washed coco peat + 10% coarse sand or perlite.',
      'Always rinse coco peat thoroughly before mixing to remove excess natural salts.',
      'Add a handful of neem cake powder and a spoonful of steamed bone meal per 10-inch pot.',
      'Place broken terracotta shards and a thin layer of coarse sand over the drainage hole before filling.',
      'Let the prepared soil mixture cure in the shade for 5–7 days before transplanting delicate seedlings.'
    ],
    proTipBn: 'সাকুলেন্ট বা ক্যাকটাস জাতীয় গাছের ক্ষেত্রে মাটিতে কোকোপিট কমিয়ে ৪০% মোটা বালি ও পার্লাইট ব্যবহার করুন যাতে এক মুহূর্তও পানি জমে না থাকে।',
    proTipEn: 'For succulents and indoor monsteras, increase coarse sand and perlite to 35% to guarantee instant drainage.'
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
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85',
    publishedDate: '2026-04-10',
    contentBn: `বীজ থেকে সফলভাবে চারা তৈরির ক্ষেত্রে সঠিক ঋতু এবং তাপমাত্রা নির্বাচন সবচেয়ে গুরুত্বপূর্ণ। ভালো মানের বীজ হওয়া সত্ত্বেও শুধুমাত্র অসময়ে বপন বা অতিরিক্ত গভীর মাটিতে পুঁতে ফেলার কারণে অনেক সময় বীজ অঙ্কুরিত হয় না।\n\nবাংলাদেশে প্রধানত দুটি মৌসুমে বীজ বপন করা হয়—শীতকালীন (রবি মৌসুম: সেপ্টেম্বর থেকে নভেম্বর) এবং গ্রীষ্ম ও বর্ষাকালীন (খরিফ মৌসুম: ফেব্রুয়ারি থেকে জুন)। টমেটো, ক্যাপসিকাম, ব্রকলি, পিটুনিয়া, ডালিয়া ও গাঁদা ফুলের বীজ বোনার সেরা সময় অক্টোবর থেকে নভেম্বর মাস। অন্যদিকে লাউ, কুমড়া, ঢ্যাঁড়শ, মরিচ, জিনিয়া ও সূর্যমুখীর বীজ ফেব্রুয়ারি থেকে মে মাসের মধ্যে বপন করলে দ্রুত চারা গজায়।\n\nবীজ বপনের আগে বীজের আকারের দ্বিগুণের বেশি গভীরে কখনোই বীজ পুঁতবেন না। খুব ছোট বীজ (যেমন পিটুনিয়া বা লেটুস) মাটির উপরে হালকাভাবে ছিটিয়ে তার ওপর কোকোপিটের পাতলা স্তর দিয়ে স্প্রেয়ার দিয়ে পানি দিন।`,
    contentEn: `Timing and soil temperature are the deciding factors in achieving a 98% seed germination rate. Even heirloom seeds can fail if sown in the wrong season or buried too deeply.\n\nIn Bangladesh, seed sowing follows two primary windows: the Winter/Rabi season (September to November) for tomatoes, capsicum, broccoli, petunias, marigolds, and dahlias; and the Summer/Kharif season (February to June) for gourds, okra, chilies, zinnias, and cosmos.\n\nNever bury a seed deeper than twice its diameter. Fine flower seeds should be pressed gently onto moist coco-peat seedling trays and misted with a fine sprayer.`,
    stepsBn: [
      'শক্ত আবরণের বীজ বপনের আগে ৬ থেকে ৮ ঘণ্টা কুসুম গরম বা সাধারণ পরিষ্কার পানিতে ভিজিয়ে রাখুন।',
      'সিডলিং ট্রে বা ছোট কাপে ৫০% কোকোপিট ও ৫০% ভার্মিকম্পোস্টের জীবাণুমুক্ত মিশ্রণ ব্যবহার করুন।',
      'বীজের আকারের চেয়ে মাত্র ১ থেকে ২ গুণ গভীরে বীজ বসিয়ে হালকা কোকোপিট দিয়ে ঢেকে দিন।',
      'মগ দিয়ে পানি না ঢেলে হ্যান্ড স্প্রেয়ার দিয়ে হালকাভাবে পানি স্প্রে করুন যাতে বীজ সরে না যায়।',
      'চারা গজানোর পর ধীরে ধীরে সকালের মিষ্টি রোদে রাখুন এবং ৪-৫টি আসল পাতা (True Leaves) এলে মূল টবে স্থানান্তর করুন।'
    ],
    stepsEn: [
      'Soak hard-coated seeds in clean room-temperature water for 6–8 hours prior to sowing.',
      'Use a sterile seedling mix of 50% washed coco peat and 50% fine vermicompost in germination trays.',
      'Sow seeds at a depth no greater than twice their width and cover lightly.',
      'Water exclusively with a fine mist sprayer to avoid washing tiny seeds away.',
      'Introduce morning sunlight once cotyledons emerge, and transplant after 4–5 true leaves develop.'
    ],
    proTipBn: 'বীজ বপনের পর অবশিষ্ট বীজগুলো বাতাসরোধী জিপলক ব্যাগে মুড়িয়ে ফ্রিজের সাধারণ চেম্বারে (ডিপ ফ্রিজে নয়) রাখলে ১ বছর পর্যন্ত অঙ্কুরোদগম ক্ষমতা অটুট থাকে।',
    proTipEn: 'Store leftover seeds in an airtight zip-lock pouch with a silica gel packet inside the refrigerator vegetable crisper for up to 12 months.'
  },
  {
    id: 'organic-pest-control',
    titleEn: 'Natural Organic Pest Control for Home Gardens',
    titleBn: 'জৈব উপায়ে গাছের পোকামাকড় ও রোগবালাই দমন',
    excerptEn: 'Safe homemade neem oil sprays and organic remedies to protect your balcony and rooftop garden from mealybugs and aphids.',
    excerptBn: 'রাসায়নিক বিষ ছাড়াই নিম তেল ও ঘরোয়া জৈব পদ্ধতিতে ছাদবাগান ও বারান্দার গাছকে মিলিবাগ ও জাব পোকা থেকে মুক্ত রাখার উপায়।',
    readTimeEn: '4 min read',
    readTimeBn: '৪ মিনিট পাঠ',
    categoryEn: 'Plant Protection',
    categoryBn: 'রোগবালাই দমন',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85',
    publishedDate: '2026-04-15',
    contentBn: `বারান্দা বা ছাদবাগানে মিলিবাগ (সাদা মাছি), জাব পোকা (Aphids) এবং পাতায় কালো দাগের সমস্যা প্রায় সব বাগানীরই চেনা। বাসাবাড়িতে শিশু ও পোষা প্রাণী থাকায় ক্ষতিকর রাসায়নিক কীটনাশক ব্যবহার না করে জৈব বা অর্গানিক পদ্ধতিতে পোকামাকড় দমন করা সবচেয়ে নিরাপদ ও কার্যকর।\n\nবিশুদ্ধ কোল্ড-প্রেসড নিম তেল (Neem Oil) গাছের প্রায় ৮০ ভাগ পোকামাকড় ও ছত্রাক দূর করতে পারে। তবে নিম তেল সরাসরি পানিতে মেশে না, তাই প্রতি ১ লিটার পানিতে ৫ মিলি (১ চা চামচ) নিম তেলের সাথে কয়েক ফোঁটা লিকুইড সাবান বা শ্যাম্পু মিশিয়ে ভালোভাবে ঝাঁকিয়ে নিলে চমৎকার জৈব কীটনাশক তৈরি হয়।\n\nসবসময় বিকেলের দিকে বা রোদ কমে গেলে পাতার উপরে এবং নিচে ভালোভাবে স্প্রে করতে হবে। কড়া রোদে স্প্রে করলে পাতার ক্ষতি হতে পারে।`,
    contentEn: `Mealybugs, aphids, spider mites, and fungal leaf spots are common challenges in balcony and rooftop gardens. Using harsh synthetic pesticides around family and pets is risky—making organic botanical sprays the safest and most sustainable choice.\n\nCold-pressed neem oil disrupts the life cycle of over 80% of common garden pests. Because oil and water do not mix naturally, emulsifying 5ml of neem oil with a few drops of mild liquid soap in 1 liter of warm water creates a potent, leaf-safe protective spray.\n\nAlways apply organic sprays in the late afternoon after direct sunlight has passed to prevent leaf burn and protect beneficial morning pollinators.`,
    stepsBn: [
      '১ লিটার কুসুম গরম পানিতে ১ চা চামচ (৫ মিলি) খাঁটি নিম তেল এবং ৪-৫ ফোঁটা লিকুইড ডিশওয়াশ বা শ্যাম্পু মেশান।',
      'বোতলটি ভালোভাবে ঝাঁকিয়ে সাদাটে দ্রবণ তৈরি হওয়ার সাথে সাথেই ব্যবহার করুন।',
      'বিকেল ৪টার পর পাতার উপরিভাগ, নিচের অংশ এবং কাণ্ডের ভাঁজে ভালোভাবে স্প্রে করুন।',
      'আক্রমণ বেশি হলে প্রতি ৪ দিন পর পর টানা ৩ বার স্প্রে করুন এবং প্রতিরোধের জন্য ১৫ দিনে একবার ব্যবহার করুন।',
      'আক্রান্ত পাতা বা ডাল খুব বেশি নষ্ট হয়ে গেলে সেটি কেটে বাগান থেকে দূরে ফেলে দিন।'
    ],
    stepsEn: [
      'Mix 5ml (1 tsp) cold-pressed neem oil with 4–5 drops of mild liquid soap in 1 liter of lukewarm water.',
      'Shake vigorously until the mixture turns milky white and use immediately.',
      'Spray thoroughly on both the tops and undersides of leaves after 4:00 PM.',
      'Repeat every 4 days for 3 cycles during active infestations, or once every 15 days for prevention.',
      'Prune heavily infested leaves immediately and dispose of them away from healthy pots.'
    ],
    proTipBn: 'ছত্রাকজনিত পাতা পচা রোধে ১ লিটার পানিতে আধা চামচ হলুদ গুঁড়া বা দারুচিনি গুঁড়া ভিজিয়ে রেখে ছেঁকে স্প্রে করলে দারুণ প্রাকৃতিক অ্যান্টি-ফাঙ্গাল হিসেবে কাজ করে।',
    proTipEn: 'Steeping half a teaspoon of cinnamon or turmeric powder in water makes an effective natural antifungal drench for seedlings.'
  }
];
