import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Category, OrderDetails, Banner, Review, Coupon } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/fallbackData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';

export interface HomepageSettings {
  noticeText?: string;
  noticeEnabled?: boolean;
  heroHeading?: string;
  heroSubheading?: string;
  ctaText?: string;
  ctaLink?: string;
  showCategories?: boolean;
  showPromoBanner?: boolean;
  showLeaderboard?: boolean;
  showBlogTips?: boolean;
  showTrustSection?: boolean;
  promoTitle?: string;
  promoSubtext?: string;
  promoButtonText?: string;
  promoCouponCode?: string;
}

export interface FooterSettings {
  brandName?: string;
  hotline?: string;
  whatsapp?: string;
  address?: string;
  copyright?: string;
  footerEnabled?: boolean;
  facebook?: string;
  tiktok?: string;
  instagram?: string;
}

export interface ContactSettings {
  hotline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface PolicySettings {
  privacy?: string;
  terms?: string;
  refund?: string;
  shipping?: string;
}

export interface StoreSettings {
  name?: string;
  logo?: string;
  favicon?: string;
  hours?: string;
  currency?: string;
  language?: string;
}

export interface SeoSettings {
  siteTitle?: string;
  keywords?: string;
  description?: string;
  googleVerification?: string;
  facebookPixel?: string;
  ogImage?: string;
}

export interface DeliverySettings {
  insideCharge: number;
  outsideCharge: number;
  freeMinimum: number;
  deliveryNote?: string;
  deliveryChargeEnabled: boolean;
}

export interface PaymentSettings {
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashNumber?: string;
  bkashType?: string;
  nagadEnabled: boolean;
  nagadNumber?: string;
  nagadType?: string;
  rocketEnabled: boolean;
  rocketNumber?: string;
  rocketType?: string;
  instruction?: string;
}

export interface ShippingZone {
  id?: string;
  name: string;
  charge: number;
  estimatedDays?: string;
  description?: string;
}

export interface NoticeSettings {
  noticeText?: string;
  noticeLink?: string;
  noticeEnabled?: boolean;
  popupHeading?: string;
  popupSubheading?: string;
  popupImage?: string;
  popupButton?: string;
  popupLink?: string;
  popupEnabled?: boolean;
}

// Default Homepage Settings
export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  noticeText: '🔥 নির্দিষ্ট বীজে আজই অর্ডার করুন ফ্রি ডেলিভারি ও আকর্ষণীয় উপহার!',
  noticeEnabled: false,
  heroHeading: 'Seed Haven BD - ১০০% খাঁটি ও উন্নত মানের বীজ',
  heroSubheading: 'অঙ্কুরোদ্গম গ্যারান্টি সহ সারা বাংলাদেশে দ্রুত হোম ডেলিভারি',
  ctaText: 'বীজ সমূহ দেখুন',
  ctaLink: '#products',
  showCategories: true,
  showPromoBanner: false,
  showLeaderboard: true,
  showBlogTips: false,
  showTrustSection: true,
  promoTitle: 'বিশেষ অর্ডারে আকর্ষণীয় ক্যাশব্যাক ও ছাড়',
  promoSubtext: 'মানসম্মত হাইব্রিড ও দেশি বীজ সংগ্রহ করুন এখনই!',
  promoButtonText: 'অর্ডার করুন',
  promoCouponCode: 'SEED10',
};

// Default Notice & Popup Settings
export const DEFAULT_NOTICE_SETTINGS: NoticeSettings = {
  noticeText: '🎉 সকল বীজে পাবেন ১০০% অঙ্কুরোদ্গম গ্যারান্টি!',
  noticeLink: '',
  noticeEnabled: false,
  popupHeading: '🎁 বিশেষ ছাড় ও ধামাকা অফার!',
  popupSubheading: 'আমাদের সকল প্রিমিয়াম হাইব্রিড ও দেশি বীজে পাচ্ছেন আকর্ষণীয় ছাড়!',
  popupImage: '',
  popupButton: 'অফারটি দেখুন',
  popupLink: '/#products',
  popupEnabled: false,
};

// Default Contact & Social Settings
export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  hotline: '09617443377',
  phone: '01410136900',
  whatsapp: '01410136900',
  email: 'support@seedhavenbd.com',
  address: 'দেবীগঞ্জ, পঞ্চগড় | সারা দেশে ক্যাশ অন ডেলিভারি',
  facebook: 'https://facebook.com/seedhavenbd',
  instagram: 'https://instagram.com/seedhavenbd',
  youtube: 'https://youtube.com/@seedhavenbd',
  tiktok: 'https://tiktok.com/@seedhavenbd',
};

// Default Policy Settings
export const DEFAULT_POLICY_SETTINGS: PolicySettings = {
  privacy: `Seed Haven BD-তে আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।\n\n১. তথ্য সংগ্রহ: অর্ডার প্রক্রিয়াকরণের জন্য আপনার নাম, ঠিকানা, মোবাইল নম্বর ও ইমেইল সংরক্ষণ করা হয়।\n২. তথ্যের ব্যবহার: শুধুমাত্র পণ্য পৌঁছে দেওয়া এবং অর্ডার সংক্রান্ত যোগাযোগের জন্য আপনার তথ্য ব্যবহৃত হয়।\n৩. তথ্য গোপনীয়তা: আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।\n৪. ডাটা সিকিউরিটি: আপনার অর্ডারের তথ্য নিরাপদ ডাটাবেসে সুরক্ষিত রাখা হয়।`,
  terms: `Seed Haven BD থেকে যেকোনো পণ্য ক্রয়ের পূর্বে নিম্নোক্ত শর্তাবলী ভালোভাবে পড়ে নিন:\n\n১. অর্ডার নিশ্চিতকরণ: ওয়েবসাইটে অর্ডার সম্পন্ন করার পর আমাদের প্রতিনিধি কল বা মেসেজের মাধ্যমে অর্ডার কনফার্ম করতে পারেন।\n২. মূল্য ও পেমেন্ট: প্রতিটি বীজের গায়ে বা ওয়েবসাইটে উল্লেখিত মূল্যই চূড়ান্ত। ক্যাশ অন ডেলিভারি বা বিকাশ/নগদ/রকেটে পেমেন্ট করা যাবে।\n৩. স্টক ও ডেলিভারি: সকল প্রোডাক্টের স্টক প্রতিনিয়ত আপডেট হয়। প্রাকৃতিক দুর্যোগ বা পার্সেল পরিবহনে বিলম্ব হলে কাস্টমারকে অবহিত করা হবে।\n৪. বীজের গুণমান: আমরা সর্বোচ্চ মানের বীজ সরবরাহ করে থাকি, তবে অঙ্কুরোদ্গম সম্পূর্ণ নির্ভর করে সঠিক মাটি, আলো, তাপমাত্রা ও পরিচর্যার ওপর।`,
  refund: `গ্রাহক সন্তুষ্টি আমাদের মূল লক্ষ্য। পণ্য গ্রহণে কোনো ত্রুটি পরিলক্ষিত হলে আমাদের রিটার্ন পলিসি প্রযোজ্য হবে:\n\n১. রিটার্ন গ্রহণের সময়: পার্সেল হাতে পাওয়ার পর ডেলিভারি ম্যানের সামনেই প্যাকেট চেক করুন।\n২. ভুল বা ক্ষতিগ্রস্ত পণ্য: ভুল বীজ বা ক্ষতিগ্রস্ত পার্সেল পেলে সাথে সাথে ডেলিভারি ম্যানকে ফেরত দিন অথবা আমাদের হেল্পলাইনে কল করুন।\n৩. রিফান্ড প্রক্রিয়া: কোনো কারণে রিটার্নকৃত পণ্যের রিফান্ড প্রযোজ্য হলে ৩ থেকে ৭ কর্মদিবসের মধ্যে বিকাশ/নগদে টাকা ফেরত দেওয়া হবে।\n৪. শর্তাবলী: ব্যবহৃত বা কাস্টমার দ্বারা ক্ষতিগ্রস্ত পণ্যের ক্ষেত্রে রিটার্ন বা রিফান্ড প্রযোজ্য হবে না।`,
  shipping: `Seed Haven BD সারা বাংলাদেশে বিশ্বস্ত কুরিয়ার সার্ভিসের মাধ্যমে হোম ডেলিভারি সুবিধা প্রদান করে:\n\n১. ডেলিভারি চার্জ: ঢাকা শহরের ভেতরে ডেলিভারি চার্জ ৮০ টাকা এবং ঢাকার বাইরে ১৫০ টাকা (অথবা নির্ধারিত ডেলিভারি ফি)।\n২. ডেলিভারি সময়: অর্ডার কনফার্ম হওয়ার পর সাধারণত ২ থেকে ৪ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।\n৩. ট্র্যাকিং ও আপডেট: অর্ডার শিপ হওয়ার পর এসএমএস বা হোয়াটসঅ্যাপে ডেলিভারি আপডেট জানানো হবে।\n৪. ক্যাশ অন ডেলিভারি: কুরিয়ার ম্যানের থেকে পণ্য হাতে পেয়ে মূল্য পরিশোধ করার সুবিধা রয়েছে।`,
};

// Default SEO Settings
export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'Seed Haven BD - প্রিমিয়াম বীজ ও গার্ডেন শপ',
  keywords: 'বীজ, হাইব্রিড বীজ, ফুলের বীজ, সবজির বীজ, বীজ দোকান, Seed Haven BD, gardening seeds Bangladesh',
  description: 'সারা বাংলাদেশে প্রিমিয়াম কোয়ালিটির সবজি, ফুল, ফল ও অর্গানিক বীজ হোম ডেলিভারি পেতে Seed Haven BD থেকে অর্ডার করুন।',
  googleVerification: '',
  facebookPixel: '',
  ogImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000',
};

// Default Store Settings
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  name: 'Seed Haven BD',
  logo: '',
  favicon: '',
  hours: 'সকাল ৯:০০ - রাত ১০:০০ (প্রতিদিন)',
  currency: 'BDT',
  language: 'bn',
};

// Subscribe to real-time homepage settings from Firestore
export function subscribeToHomepageSettings(callback: (settings: HomepageSettings) => void) {
  const docRef = doc(db, 'settings', 'homepage');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          noticeText: data.noticeText !== undefined ? data.noticeText : DEFAULT_HOMEPAGE_SETTINGS.noticeText,
          noticeEnabled: data.noticeEnabled === true,
          heroHeading: data.heroHeading || DEFAULT_HOMEPAGE_SETTINGS.heroHeading,
          heroSubheading: data.heroSubheading || DEFAULT_HOMEPAGE_SETTINGS.heroSubheading,
          ctaText: data.ctaText || DEFAULT_HOMEPAGE_SETTINGS.ctaText,
          ctaLink: data.ctaLink || DEFAULT_HOMEPAGE_SETTINGS.ctaLink,
          showCategories: data.showCategories !== false,
          showPromoBanner: data.showPromoBanner === true,
          showLeaderboard: data.showLeaderboard !== false,
          showBlogTips: data.showBlogTips === true,
          showTrustSection: data.showTrustSection !== false,
          promoTitle: data.promoTitle || DEFAULT_HOMEPAGE_SETTINGS.promoTitle,
          promoSubtext: data.promoSubtext || DEFAULT_HOMEPAGE_SETTINGS.promoSubtext,
          promoButtonText: data.promoButtonText || DEFAULT_HOMEPAGE_SETTINGS.promoButtonText,
          promoCouponCode: data.promoCouponCode || DEFAULT_HOMEPAGE_SETTINGS.promoCouponCode,
        });
      } else {
        callback(DEFAULT_HOMEPAGE_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to homepage settings from Firestore:', error);
      callback(DEFAULT_HOMEPAGE_SETTINGS);
    }
  );
}

// Subscribe to real-time footer settings from Firestore
export function subscribeToFooterSettings(callback: (settings: FooterSettings) => void) {
  const docRef = doc(db, 'settings', 'footer');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          brandName: data.brandName || 'Seed Haven BD',
          hotline: data.hotline || '09617443377',
          whatsapp: data.whatsapp || '01410136900',
          address: data.address || 'দেবীগঞ্জ, পঞ্চগড় | সারা দেশে ক্যাশ অন ডেলিভারি',
          copyright: data.copyright || '© 2026 Seed Haven BD। সর্বস্বত্ব সংরক্ষিত।',
          footerEnabled: data.footerEnabled !== false,
          facebook: data.facebook || 'https://facebook.com',
          tiktok: data.tiktok || 'https://tiktok.com',
          instagram: data.instagram || 'https://instagram.com',
        });
      } else {
        callback({
          brandName: 'Seed Haven BD',
          hotline: '09617443377',
          whatsapp: '01410136900',
          address: 'দেবীগঞ্জ, পঞ্চগড় | সারা দেশে ক্যাশ অন ডেলিভারি',
          copyright: '© 2026 Seed Haven BD। সর্বস্বত্ব সংরক্ষিত।',
          footerEnabled: true,
          facebook: 'https://facebook.com',
          tiktok: 'https://tiktok.com',
          instagram: 'https://instagram.com',
        });
      }
    },
    (error) => {
      console.error('Error listening to footer settings from Firestore:', error);
      callback({
        brandName: 'Seed Haven BD',
        hotline: '09617443377',
        whatsapp: '01410136900',
        address: 'দেবীগঞ্জ, পঞ্চগড় | সারা দেশে ক্যাশ অন ডেলিভারি',
        copyright: '© 2026 Seed Haven BD। সর্বস্বত্ব সংরক্ষিত।',
        footerEnabled: true,
        facebook: 'https://facebook.com',
        tiktok: 'https://tiktok.com',
        instagram: 'https://instagram.com',
      });
    }
  );
}

// Subscribe to real-time delivery settings from Firestore
export function subscribeToDeliverySettings(callback: (settings: DeliverySettings) => void) {
  const docRef = doc(db, 'settings', 'delivery');
  const defaultDelivery: DeliverySettings = {
    insideCharge: 60,
    outsideCharge: 100,
    freeMinimum: 1000,
    deliveryNote: 'সারা বাংলাদেশে ২-৪ কার্যদিবসে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি।',
    deliveryChargeEnabled: false,
  };

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          insideCharge: typeof data.insideCharge === 'number' ? data.insideCharge : 60,
          outsideCharge: typeof data.outsideCharge === 'number' ? data.outsideCharge : 100,
          freeMinimum: typeof data.freeMinimum === 'number' ? data.freeMinimum : 1000,
          deliveryNote: data.deliveryNote || defaultDelivery.deliveryNote,
          deliveryChargeEnabled: typeof data.deliveryChargeEnabled === 'boolean' ? data.deliveryChargeEnabled : false,
        });
      } else {
        callback(defaultDelivery);
      }
    },
    (error) => {
      console.error('Error listening to delivery settings from Firestore:', error);
      callback(defaultDelivery);
    }
  );
}

// Subscribe to custom shipping zones from Firestore
export function subscribeToShippingZones(callback: (zones: ShippingZone[]) => void) {
  const colRef = collection(db, 'shippingZones');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const zonesList: ShippingZone[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ShippingZone, 'id'>),
      }));
      callback(zonesList);
    },
    (error) => {
      console.error('Error listening to shipping zones from Firestore:', error);
      callback([]);
    }
  );
}

// Subscribe to real-time payment settings from Firestore
export function subscribeToPaymentSettings(callback: (settings: PaymentSettings) => void) {
  const docRef = doc(db, 'settings', 'payment');
  const defaultPayment: PaymentSettings = {
    codEnabled: true,
    bkashEnabled: true,
    bkashNumber: '01410136900',
    bkashType: 'Personal',
    nagadEnabled: true,
    nagadNumber: '01410136900',
    nagadType: 'Personal',
    rocketEnabled: true,
    rocketNumber: '01410136900',
    rocketType: 'Personal',
    instruction: 'মোবাইল ব্যাংকিং (বিকাশ/নগদ/রকেট) বা ক্যাশ অন ডেলিভারি (COD) নির্বাচন করুন।',
  };

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          codEnabled: data.codEnabled !== false,
          bkashEnabled: data.bkashEnabled === true,
          bkashNumber: data.bkashNumber || defaultPayment.bkashNumber,
          bkashType: data.bkashType || defaultPayment.bkashType,
          nagadEnabled: data.nagadEnabled === true,
          nagadNumber: data.nagadNumber || defaultPayment.nagadNumber,
          nagadType: data.nagadType || defaultPayment.nagadType,
          rocketEnabled: data.rocketEnabled === true,
          rocketNumber: data.rocketNumber || defaultPayment.rocketNumber,
          rocketType: data.rocketType || defaultPayment.rocketType,
          instruction: data.instruction || defaultPayment.instruction,
        });
      } else {
        callback(defaultPayment);
      }
    },
    (error) => {
      console.error('Error listening to payment settings from Firestore:', error);
      callback(defaultPayment);
    }
  );
}

// Subscribe to real-time notice & popup settings from Firestore
export function subscribeToNoticeSettings(callback: (settings: NoticeSettings) => void) {
  const docRef = doc(db, 'settings', 'notice');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          noticeText: data.noticeText !== undefined ? data.noticeText : DEFAULT_NOTICE_SETTINGS.noticeText,
          noticeLink: data.noticeLink || '',
          noticeEnabled: data.noticeEnabled === true,
          popupHeading: data.popupHeading || DEFAULT_NOTICE_SETTINGS.popupHeading,
          popupSubheading: data.popupSubheading || DEFAULT_NOTICE_SETTINGS.popupSubheading,
          popupImage: data.popupImage || '',
          popupButton: data.popupButton || DEFAULT_NOTICE_SETTINGS.popupButton,
          popupLink: data.popupLink || DEFAULT_NOTICE_SETTINGS.popupLink,
          popupEnabled: data.popupEnabled === true,
        });
      } else {
        callback(DEFAULT_NOTICE_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to notice settings from Firestore:', error);
      callback(DEFAULT_NOTICE_SETTINGS);
    }
  );
}

// Subscribe to real-time contact & social settings from Firestore
export function subscribeToContactSettings(callback: (settings: ContactSettings) => void) {
  const docRef = doc(db, 'settings', 'contact');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          hotline: data.hotline || DEFAULT_CONTACT_SETTINGS.hotline,
          phone: data.phone || DEFAULT_CONTACT_SETTINGS.phone,
          whatsapp: data.whatsapp || DEFAULT_CONTACT_SETTINGS.whatsapp,
          email: data.email || DEFAULT_CONTACT_SETTINGS.email,
          address: data.address || DEFAULT_CONTACT_SETTINGS.address,
          facebook: data.facebook || DEFAULT_CONTACT_SETTINGS.facebook,
          instagram: data.instagram || DEFAULT_CONTACT_SETTINGS.instagram,
          youtube: data.youtube || DEFAULT_CONTACT_SETTINGS.youtube,
          tiktok: data.tiktok || DEFAULT_CONTACT_SETTINGS.tiktok,
        });
      } else {
        callback(DEFAULT_CONTACT_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to contact settings from Firestore:', error);
      callback(DEFAULT_CONTACT_SETTINGS);
    }
  );
}

// Subscribe to real-time policy settings from Firestore
export function subscribeToPolicySettings(callback: (settings: PolicySettings) => void) {
  const docRef = doc(db, 'settings', 'policies');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          privacy: data.privacy !== undefined ? data.privacy : DEFAULT_POLICY_SETTINGS.privacy,
          terms: data.terms !== undefined ? data.terms : DEFAULT_POLICY_SETTINGS.terms,
          refund: data.refund !== undefined ? data.refund : DEFAULT_POLICY_SETTINGS.refund,
          shipping: data.shipping !== undefined ? data.shipping : DEFAULT_POLICY_SETTINGS.shipping,
        });
      } else {
        callback(DEFAULT_POLICY_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to policy settings from Firestore:', error);
      callback(DEFAULT_POLICY_SETTINGS);
    }
  );
}

// Subscribe to real-time SEO settings from Firestore
export function subscribeToSeoSettings(callback: (settings: SeoSettings) => void) {
  const docRef = doc(db, 'settings', 'seo');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          siteTitle: data.siteTitle !== undefined ? data.siteTitle : DEFAULT_SEO_SETTINGS.siteTitle,
          keywords: data.keywords !== undefined ? data.keywords : DEFAULT_SEO_SETTINGS.keywords,
          description: data.description !== undefined ? data.description : DEFAULT_SEO_SETTINGS.description,
          googleVerification: data.googleVerification !== undefined ? data.googleVerification : DEFAULT_SEO_SETTINGS.googleVerification,
          facebookPixel: data.facebookPixel !== undefined ? data.facebookPixel : DEFAULT_SEO_SETTINGS.facebookPixel,
          ogImage: data.ogImage !== undefined ? data.ogImage : DEFAULT_SEO_SETTINGS.ogImage,
        });
      } else {
        callback(DEFAULT_SEO_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to SEO settings from Firestore:', error);
      callback(DEFAULT_SEO_SETTINGS);
    }
  );
}

export async function saveSeoSettings(settings: Partial<SeoSettings>) {
  try {
    const docRef = doc(db, 'settings', 'seo');
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.error('Failed to save SEO settings:', err);
    throw err;
  }
}

// Subscribe to real-time store settings from Firestore
export function subscribeToStoreSettings(callback: (settings: StoreSettings) => void) {
  const docRef = doc(db, 'settings', 'store');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          name: data.name !== undefined ? data.name : DEFAULT_STORE_SETTINGS.name,
          logo: data.logo !== undefined ? data.logo : DEFAULT_STORE_SETTINGS.logo,
          favicon: data.favicon !== undefined ? data.favicon : DEFAULT_STORE_SETTINGS.favicon,
          hours: data.hours !== undefined ? data.hours : DEFAULT_STORE_SETTINGS.hours,
          currency: data.currency !== undefined ? data.currency : DEFAULT_STORE_SETTINGS.currency,
          language: data.language !== undefined ? data.language : DEFAULT_STORE_SETTINGS.language,
        });
      } else {
        callback(DEFAULT_STORE_SETTINGS);
      }
    },
    (error) => {
      console.error('Error listening to store settings from Firestore:', error);
      callback(DEFAULT_STORE_SETTINGS);
    }
  );
}
export function subscribeToCategories(callback: (categories: Category[]) => void) {
  const colRef = collection(db, CATEGORIES_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        callback(CATEGORIES);
        return;
      }

      const categoriesList: Category[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        categoriesList.push({
          id: docSnap.id,
          name: data.name || '',
          iconEmoji: data.iconEmoji || '🌱',
          image: data.image || '',
          subtitle: data.subtitle || '',
          itemCount: Number(data.itemCount) || 0,
          description: data.description || '',
        });
      });

      callback(categoriesList.length ? categoriesList : CATEGORIES);
    },
    (error) => {
      console.error('Error listening to categories from Firestore:', error);
      callback(CATEGORIES);
    }
  );
}

// Add Category to Firestore
export async function addCategoryFirebase(category: Omit<Category, 'id'>) {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...category,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Delete Category from Firestore
export async function deleteCategoryFirebase(id: string) {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// Update Category in Firestore
export async function updateCategoryFirebase(id: string, data: Partial<Category>) {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, data);
}

// Subscribe to real-time products updates
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const colRef = collection(db, PRODUCTS_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        callback(PRODUCTS);
        return;
      }

      const productsList: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        productsList.push({
          id: docSnap.id,
          name: data.name || '',
          category: data.category || 'veg',
          price: Number(data.price || data.salePrice) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : (data.regularPrice ? Number(data.regularPrice) : undefined),
          cashback: data.cashback ? Number(data.cashback) : 0,
          stock: data.stock !== undefined ? Number(data.stock) : 50,
          rating: Number(data.rating) || 4.8,
          reviewsCount: Number(data.reviewsCount) || 10,
          imageEmoji: data.imageEmoji || '🌱',
          image: data.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600',
          images: Array.isArray(data.images) ? data.images : [data.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600'],
          badgeTags: Array.isArray(data.badgeTags) && data.badgeTags.length > 0 
            ? data.badgeTags 
            : (PRODUCTS.find(p => p.id === docSnap.id)?.badgeTags || (docSnap.id === '2' ? ['১২ মাস', 'সেরা পণ্য'] : docSnap.id === '3' ? ['পপুলার', 'অফার'] : docSnap.id === '4' ? ['পরীক্ষিত', 'অফার'] : ['আনকমন', 'সেরা পণ্য'])),
          description: data.description || '',
          germinationDays: data.germinationDays || '৫-৭ দিন',
          season: data.season || 'বারোমাসি',
          packSize: data.packSize || data.unit || '১ প্যাকেট',
          plantingTip: data.plantingTip || '',
          popular: Boolean(data.isPopular || data.popular),
        });
      });

      callback(productsList.length ? productsList : PRODUCTS);
    },
    (error) => {
      console.error('Error listening to products from Firestore:', error);
      callback(PRODUCTS);
    }
  );
}

// Seed initial default products to Firestore if empty
export async function seedInitialProducts() {
  try {
    for (const prod of PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(docRef, {
        ...prod,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error('Failed to seed initial products:', err);
  }
}

// Add a new product to Firestore
export async function addProductFirebase(product: Omit<Product, 'id'>) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Delete a product from Firestore
export async function deleteProductFirebase(id: string) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Update product in Firestore
export async function updateProductFirebase(id: string, data: Partial<Product>) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, data);
}

// Save order to Firestore
export async function saveOrderFirebase(order: OrderDetails) {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    
    // Clean undefined fields (like senderNumber or transactionId when COD is used)
    const cleanOrder: Record<string, any> = {
      orderId: order.orderId || ('SHB-' + Math.floor(100000 + Math.random() * 900000)),
      customerName: order.customerName || '',
      phone: order.phone || '',
      address: order.address || '',
      district: order.district || '',
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      deliveryFee: Number(order.deliveryFee || 0),
      total: Number(order.total || 0),
      paymentMethod: order.paymentMethod || 'cod',
      createdAt: serverTimestamp(),
    };

    if (order.senderNumber !== undefined && order.senderNumber !== null && order.senderNumber !== '') {
      cleanOrder.senderNumber = order.senderNumber;
    }
    if (order.transactionId !== undefined && order.transactionId !== null && order.transactionId !== '') {
      cleanOrder.transactionId = order.transactionId;
    }

    await addDoc(colRef, cleanOrder);
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
  }
}

// Get all orders from Firestore
export async function getOrdersFirebase(): Promise<OrderDetails[]> {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const orders: OrderDetails[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        ...data,
        orderId: docSnap.id,
      } as OrderDetails);
    });
    return orders;
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return [];
  }
}

// Delete single order from Firestore
export async function deleteOrderFirebase(orderId: string) {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete order:', err);
    throw err;
  }
}

// Delete all orders from Firestore
export async function deleteAllOrdersFirebase() {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const promises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(promises);
  } catch (err) {
    console.error('Failed to delete all orders:', err);
    throw err;
  }
}

// Update order status in Firestore
export async function updateOrderStatusFirebase(orderId: string, status: string) {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.error('Failed to update order status:', err);
    throw err;
  }
}

// Subscribe to real-time banners from Firestore
export function subscribeToBanners(callback: (banners: Banner[]) => void) {
  const colRef = collection(db, 'banners');

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }

      const bannersList: Banner[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.active !== false) {
          bannersList.push({
            id: docSnap.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            image: data.image || '',
            buttonText: data.buttonText || '',
            buttonLink: data.buttonLink || '',
            position: Number(data.position || 1),
            active: data.active !== false,
          });
        }
      });

      // Sort by position ascending
      bannersList.sort((a, b) => (a.position || 1) - (b.position || 1));

      callback(bannersList);
    },
    (error) => {
      console.error('Error listening to banners from Firestore:', error);
      callback([]);
    }
  );
}

// Subscribe to real-time reviews from Firestore (Optionally filtered for approved)
export function subscribeToReviews(callback: (reviews: Review[]) => void, approvedOnly = true) {
  const colRef = collection(db, 'reviews');

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }

      const reviewsList: Review[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const status = data.status || 'approved';
        if (!approvedOnly || status === 'approved') {
          reviewsList.push({
            id: docSnap.id,
            customerName: data.customerName || 'অনামী কাস্টমার',
            productName: data.productName || data.productId || '',
            productId: data.productId || '',
            rating: Number(data.rating || 5),
            comment: data.comment || data.review || '',
            status: status as any,
            avatar: data.avatar || '',
            imageUrl: data.imageUrl || '',
            createdAt: data.createdAt,
          });
        }
      });

      callback(reviewsList);
    },
    (error) => {
      console.error('Error listening to reviews from Firestore:', error);
      callback([]);
    }
  );
}

// Submit a new customer review to Firestore
export async function submitCustomerReview(reviewData: {
  customerName: string;
  productName?: string;
  productId?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  customerPhoto?: string;
}) {
  try {
    const colRef = collection(db, 'reviews');
    await addDoc(colRef, {
      ...reviewData,
      status: 'approved',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to submit review:', err);
    throw err;
  }
}

// Subscribe to real-time coupons from Firestore
export function subscribeToCoupons(callback: (coupons: Coupon[]) => void) {
  const colRef = collection(db, 'coupons');

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }

      const couponsList: Coupon[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.active !== false) {
          couponsList.push({
            id: docSnap.id,
            code: (data.code || '').toString().trim().toUpperCase(),
            type: data.type === 'fixed' ? 'fixed' : 'percent',
            value: Number(data.value || 0),
            minimum: Number(data.minimum || 0),
            max: Number(data.max || 0),
            expiry: data.expiry || '',
            limit: Number(data.limit || 0),
            active: data.active !== false,
          });
        }
      });

      callback(couponsList);
    },
    (error) => {
      console.error('Error listening to coupons from Firestore:', error);
      callback([]);
    }
  );
}

// Save customer inquiry to Firestore
export async function addInquiry(inquiry: {
  name: string;
  phone: string;
  message: string;
}) {
  try {
    const colRef = collection(db, 'inquiries');
    await addDoc(colRef, {
      ...inquiry,
      createdAt: serverTimestamp(),
      status: 'unread',
    });
    return true;
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return false;
  }
}

// Subscribe to real-time orders from Firestore
export function subscribeToOrders(callback: (orders: OrderDetails[]) => void) {
  const colRef = collection(db, ORDERS_COLLECTION);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }

      const ordersList: OrderDetails[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let createdAtFormatted = '';
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          createdAtFormatted = data.createdAt.toDate().toLocaleString('bn-BD');
        } else {
          createdAtFormatted = 'সম্প্রতি';
        }

        ordersList.push({
          orderId: data.orderId || docSnap.id,
          customerName: data.customerName || '',
          phone: data.phone || '',
          address: data.address || '',
          district: data.district || '',
          items: data.items || [],
          subtotal: Number(data.subtotal || 0),
          discount: Number(data.discount || 0),
          deliveryFee: Number(data.deliveryFee || 0),
          total: Number(data.total || 0),
          paymentMethod: data.paymentMethod || 'cod',
          senderNumber: data.senderNumber || '',
          transactionId: data.transactionId || '',
          status: data.status || 'প্রক্রিয়াধীন',
          createdAt: createdAtFormatted,
        } as OrderDetails);
      });

      callback(ordersList);
    },
    (error) => {
      console.error('Error listening to orders from Firestore:', error);
      callback([]);
    }
  );
}

// Record daily visitor
export async function recordVisitor() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionKey = `visited_${todayStr}`;
    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, 'true');
    const docRef = doc(db, 'visitors', todayStr);
    await setDoc(docRef, {
      date: todayStr,
      count: increment(1),
      lastVisit: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('Error recording visitor:', e);
  }
}

// Subscribe to visitors
export function subscribeToVisitors(callback: (visitors: { date: string; count: number }[]) => void) {
  const colRef = collection(db, 'visitors');
  return onSnapshot(colRef, (snapshot) => {
    const list: { date: string; count: number }[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        date: docSnap.id,
        count: Number(data.count || 0)
      });
    });
    list.sort((a, b) => b.date.localeCompare(a.date));
    callback(list);
  }, (err) => {
    console.error('Error listening to visitors:', err);
    callback([]);
  });
}

// Save newsletter subscription to Firestore
export async function addNewsletterSubscription(email: string) {
  try {
    const colRef = collection(db, 'newsletterSubscriptions');
    await addDoc(colRef, {
      email,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error saving newsletter subscription:', error);
    return false;
  }
}

// Save product rating to Firestore
export async function saveProductRatingFirebase(productId: string, rating: number, userId?: string) {
  try {
    const docId = userId ? `${productId}_${userId}` : `${productId}_default`;
    const docRef = doc(db, 'productRatings', docId);
    await setDoc(docRef, {
      productId,
      rating: Number(rating),
      userId: userId || 'anonymous',
      createdAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving product rating:', error);
    return false;
  }
}

// Subscribe to product ratings from Firestore
export function subscribeToProductRatings(callback: (ratingsMap: Record<string, number>) => void) {
  const colRef = collection(db, 'productRatings');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const ratingsMap: Record<string, number> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.productId && data.rating) {
          ratingsMap[data.productId] = Number(data.rating);
        }
      });
      callback(ratingsMap);
    },
    (error) => {
      console.error('Error listening to product ratings:', error);
      callback({});
    }
  );
}

