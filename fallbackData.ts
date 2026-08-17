import { Product, Category, LeaderboardUser } from '../types';

export const BANNER_IMAGE = 'https://i.ibb.co.com/My5r5CPq/Chat-GPT-Image-Aug-8-2026-07-32-55-AM.png';

export const BANNER_STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1535242208474-9a279b24b27e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586083710037-33a7e5021a8a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1536511135880-e83792f39228?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
];

export const BANNER_IMAGES = BANNER_STOCK_IMAGES;

export const CATEGORIES: Category[] = [
  {
    id: 'fruit',
    name: 'ফল গাছের বীজ',
    iconEmoji: '🥭',
    image: 'https://i.ibb.co.com/xq8YYKm9/Chat-GPT-Image-Aug-8-2026-07-54-27-AM.png',
    subtitle: 'মিষ্টি ও সুস্বাদু ফলের বীজ',
    itemCount: 8,
    description: 'উন্নত জাতের আম, পেঁপে, তরমুজ, বাঙ্গি ও অন্যান্য ফলের খাঁটি বীজ।'
  },
  {
    id: 'veg',
    name: 'সবজি বীজ',
    iconEmoji: '🥦',
    image: 'https://i.ibb.co.com/qYMkjyX8/Chat-GPT-Image-Aug-8-2026-07-59-21-AM.png',
    subtitle: 'উচ্চফলনশীল সবজির বীজ',
    itemCount: 20,
    description: 'টমেটো, মরিচ, বেগুন, শিম, শসা সহ সকল শীতকালীন ও বারোমাসি সবজির বীজ।'
  },
  {
    id: 'ful',
    name: 'ফুলের বীজ',
    iconEmoji: '🌺',
    image: 'https://i.ibb.co.com/0Rg347Bm/Chat-GPT-Image-Aug-8-2026-08-06-20-AM.png',
    subtitle: 'দেশি-বিদেশি ফুলের বীজ',
    itemCount: 15,
    description: 'কসমস, গাদা, গোলাপ, জেনিয়া ও বিরল জাতের ফুলের বীজ।'
  },
  {
    id: 'herbs',
    name: 'হার্বস বীজ',
    iconEmoji: '🌿',
    image: 'https://i.ibb.co.com/j9kMQjfN/Chat-GPT-Image-Aug-8-2026-08-16-57-AM.png',
    subtitle: 'ঔষধী ও ভেষজ পাতা বীজ',
    itemCount: 10,
    description: 'পুদিনা, ধনিয়া, তুলসী, স্টেভিয়া ও অন্যান্য ভেষজ গাছের বীজ।'
  },
  {
    id: 'offers',
    name: 'অফার সমূহ',
    iconEmoji: '🏷️',
    image: 'https://i.ibb.co.com/q3Xq3Nrh/Chat-GPT-Image-Aug-8-2026-08-19-58-AM.png',
    subtitle: 'বিশেষ ছাড় ও অফার',
    itemCount: 12,
    description: 'সীমিত সময়ের আকর্ষনীয় ডিসকাউন্ট ও কম্বো অফার।'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '2',
    name: 'হাইব্রিড টমেটো বীজ (বিউটিফুল)',
    category: 'veg',
    price: 180,
    originalPrice: 220,
    cashback: 20,
    stock: 100,
    rating: 4.7,
    reviewsCount: 85,
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600'],
    description: 'সারা বছর চাষ উপযোগী উচ্চ ফলনশীল টমেটো বীজ। রোগবালাই সহনশীল।',
    germinationDays: '৫-৭ দিন',
    sproutDays: '১৫ দিন',
    season: 'বারোমাসি',
    packSize: '১০ গ্রাম',
    badgeTags: ['১২ মাস', 'সেরা পণ্য'],
    isPopular: true,
    isNew: true
  },
  {
    id: '3',
    name: 'দেশি তরমুজ বীজ',
    category: 'fruit',
    price: 250,
    originalPrice: 300,
    cashback: 30,
    stock: 35,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://i.ibb.co.com/bMqhLXWk/Chat-GPT-Image-Jul-31-2026-06-42-01-PM.png',
    images: ['https://i.ibb.co.com/bMqhLXWk/Chat-GPT-Image-Jul-31-2026-06-42-01-PM.png'],
    description: 'মিষ্টি ও লাল রঙের দেশি জাতের তরমুজ বীজ।',
    germinationDays: '৭-১০ দিন',
    sproutDays: '২০ দিন',
    season: 'গ্রীষ্মকালীন',
    packSize: '৫ গ্রাম',
    badgeTags: ['পপুলার', 'অফার'],
    isPopular: true,
    isNew: false
  },
  {
    id: '4',
    name: 'লাল শাক ও পালং শাক বীজ কম্বো',
    category: 'veg',
    price: 120,
    originalPrice: 160,
    cashback: 15,
    stock: 80,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'],
    description: 'তাজা ও পুষ্টিকর লাল শাক এবং পালং শাকের উচ্চ germination rate বিশিষ্ট বীজ।',
    germinationDays: '৩-৫ দিন',
    sproutDays: '১০ দিন',
    season: 'সবসময়',
    packSize: '২০ গ্রাম',
    badgeTags: ['পরীক্ষিত', 'অফার'],
    isPopular: true,
    isNew: true
  },
  {
    id: '5',
    name: 'রঙিন বিদেশি কসমস ফুল বীজ',
    category: 'ful',
    price: 150,
    originalPrice: 200,
    cashback: 25,
    stock: 50,
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=600'],
    description: 'আপনার ছাদবাগান ও বারান্দা রঙিন করতে অসাধারণ বিদেশি কসমস ফুলের বীজ।',
    germinationDays: '৭-১০ দিন',
    sproutDays: '২৫ দিন',
    season: 'শীত ও বসন্ত',
    packSize: '৩ গ্রাম',
    badgeTags: ['আনকমন', 'সেরা পণ্য'],
    isPopular: true,
    isNew: true
  }
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Tubba',
    phone: '016****1908',
    location: 'চট্টগ্রাম',
    totalAmount: 4228,
    ordersCount: 2,
    avatar: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/product-images/profiles/9e43cb27-f04a-482c-a357-9c2779249357/avatar-1778049105544.webp'
  },
  {
    rank: 2,
    name: 'MD NAZRUL ISLAM.',
    phone: '018****8114',
    location: 'নারায়ণগঞ্জ',
    totalAmount: 4227,
    ordersCount: 4,
    avatar: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/product-images/profiles/d8fee53e-42b3-4c98-90db-6e84141fe3b2/avatar-1778985100412.webp'
  },
  {
    rank: 3,
    name: 'Jahidur Rahman Chowdhury',
    phone: '017****5561',
    location: 'নারায়ণগঞ্জ',
    totalAmount: 4133,
    ordersCount: 1,
    avatar: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/product-images/profiles/6f7630bc-c7e7-43a9-97b8-fa30b5eec001/avatar-1778056257053.webp'
  },
  {
    rank: 4,
    name: 'Eather Ahmed',
    phone: '019****6767',
    location: 'খুলনা',
    totalAmount: 3911,
    ordersCount: 4,
    avatar: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/product-images/profiles/62069fe0-4bef-4ae7-af96-30e7ae32f1e5/avatar-1778955951691.webp'
  }
];

export const BEST_POST = {
  author: 'Afsana Mimi',
  timeAgo: '4 দিন আগে',
  avatar: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/product-images/profiles/58c21361-2432-4d12-8c2b-ec00aceea898/avatar-1778003910801.webp',
  postImage: 'https://afwshccobrpdhzcwtgvs.supabase.co/storage/v1/object/public/chat-images/social/f42c072e-1c5c-4736-be16-5b3d99368a65/1785506901533-ab-seed-social-ab-seed-oga3z.webp',
  content: 'কেউ কি স্ট্রবেরি থেকে চারা করতে পেরেছেন আমি পেরেছি আলহামদুলিল্লাহ \nধন্যবাদ ab Seed Company',
  likes: 3,
  comments: 0
};

export const BLOG_POSTS = [
  {
    id: 'b1',
    title: 'টবে বীজ থেকে চারা গজানোর সঠিক পদ্ধতি',
    date: '২৮ জুলাই, ২০২৬',
    readTime: '৩ মিনিট পড়া',
    excerpt: 'সহজ ৬টি ধাপে বাসাতেই টবে ভালো চারা গজানোর গোপন কৌশল জানুন। কীভাবে মাটি তৈরি করবেন...',
    category: 'গাইড',
    imageEmoji: '🌱'
  },
  {
    id: 'b2',
    title: 'ছাদবাগানে শীতকালীন সবজি চাষের নিয়মাবলী',
    date: '১৫ জুলাই, ২০২৬',
    readTime: '৫ মিনিট পড়া',
    excerpt: 'ফুলকপি, টমেটো, পালং শাক ও শিম চাষের সঠিক সময় এবং যত্ন নেওয়ার উপায়...',
    category: 'পরামর্শ',
    imageEmoji: '🥦'
  }
];
