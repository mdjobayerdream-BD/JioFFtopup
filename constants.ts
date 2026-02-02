import { Category, Package } from './types';

export const ADMIN_UID = "7382970242";
export const ADMIN_EMAIL = "mdjobayerdream@gmail.com";
export const SUPPORT_PHONE = "8801619789895";
export const TELEGRAM_LINK = "https://t.me/freefiretopupstore";

// Default payment numbers
export const DEFAULT_PAYMENT_NUMBERS = {
    bkash: "01619789895",
    nagad: "01619789895",
    rocket: "01619789895",
    binance: "1210169527"
};

export const CATEGORIES: Category[] = [
  {
    id: 'ff-id',
    title: 'Free Fire ID Code',
    group: 'FreeFire',
    image: 'https://i.pinimg.com/736x/21/20/b0/2120b058cb9e57d1b302c3c97970d4c8.jpg', 
  },
  {
    id: 'ff-weekly',
    title: 'Weekly & Monthly',
    group: 'Subscription',
    image: 'https://i.pinimg.com/736x/87/4a/0c/874a0c84134b22c83b86cb4f89d52f63.jpg',
  },
  {
    id: 'pubg-uc',
    title: 'PUBG UC',
    group: 'PUBG',
    image: 'https://i.pinimg.com/736x/58/01/5e/58015e34749f57280753a493a3229230.jpg',
  },
  {
    id: 'netflix',
    title: 'Netflix Premium',
    group: 'Subscription',
    image: 'https://i.pinimg.com/736x/2c/8b/6e/2c8b6e6f6634c034b7a13c4c9d96c429.jpg',
  },
];

export const PACKAGES: Package[] = [
  // DIAMOND PACKAGES - 5% Discount Applied (Base prices updated as per request)
  { id: 'd25', categoryId: 'ff-id', diamonds: '25 Diamonds', priceBDT: 24 }, // Base 25
  { id: 'd50', categoryId: 'ff-id', diamonds: '50 Diamonds', priceBDT: 48 }, // Base 50
  { id: 'd115', categoryId: 'ff-id', diamonds: '115 Diamonds', priceBDT: 95, tag: 'HOT' }, // Base 100
  { id: 'd240', categoryId: 'ff-id', diamonds: '240 Diamonds', priceBDT: 190 }, // Base 200
  { id: 'd355', categoryId: 'ff-id', diamonds: '355 Diamonds', priceBDT: 285 }, // Base 300
  { id: 'd480', categoryId: 'ff-id', diamonds: '480 Diamonds', priceBDT: 380 }, // Base 400
  { id: 'd610', categoryId: 'ff-id', diamonds: '610 Diamonds', priceBDT: 475, bonus: 'Bonus' }, // Base 500
  { id: 'd725', categoryId: 'ff-id', diamonds: '725 Diamonds', priceBDT: 570 }, // Base 600
  { id: 'd850', categoryId: 'ff-id', diamonds: '850 Diamonds', priceBDT: 665 }, // Base 700
  { id: 'd965', categoryId: 'ff-id', diamonds: '965 Diamonds', priceBDT: 760 }, // Base 800
  { id: 'd1090', categoryId: 'ff-id', diamonds: '1090 Diamonds', priceBDT: 855 }, // Base 900
  { id: 'd1240', categoryId: 'ff-id', diamonds: '1240 Diamonds', priceBDT: 950 }, // Base 1000
  { id: 'd1480', categoryId: 'ff-id', diamonds: '1480 Diamonds', priceBDT: 1140 }, // Base 1200
  { id: 'd1850', categoryId: 'ff-id', diamonds: '1850 Diamonds', priceBDT: 1425 }, // Base 1500
  { id: 'd2530', categoryId: 'ff-id', diamonds: '2530 Diamonds', priceBDT: 1900 }, // Base 2000
  
  // Higher tiers (Maintained previous discount structure)
  { id: 'd3140', categoryId: 'ff-id', diamonds: '3140 Diamonds', priceBDT: 2232 },
  { id: 'd3770', categoryId: 'ff-id', diamonds: '3770 Diamonds', priceBDT: 2660 },
  { id: 'd5060', categoryId: 'ff-id', diamonds: '5060 Diamonds', priceBDT: 3610, tag: 'Best' },
  { id: 'd7590', categoryId: 'ff-id', diamonds: '7590 Diamonds', priceBDT: 5415 },
  { id: 'd10120', categoryId: 'ff-id', diamonds: '10120 Diamonds', priceBDT: 7220 },
  { id: 'd15180', categoryId: 'ff-id', diamonds: '15180 Diamonds', priceBDT: 10925 },
  { id: 'd20240', categoryId: 'ff-id', diamonds: '20240 Diamonds', priceBDT: 14440 },

  // SPECIAL MEMBERSHIP PACKS
  { id: 'm-weekly', categoryId: 'ff-weekly', diamonds: 'Weekly Membership', priceBDT: 155, tag: 'Weekly' },
  { id: 'm-monthly', categoryId: 'ff-weekly', diamonds: 'Monthly Membership', priceBDT: 780, tag: 'Monthly' },
  { id: 'm-lite', categoryId: 'ff-weekly', diamonds: 'Weekly Lite', priceBDT: 45 },
  { id: 'm-combo', categoryId: 'ff-weekly', diamonds: 'Weekly + Monthly', priceBDT: 935, tag: 'Combo' },
  
  // Placeholder for PUBG to prevent crashes if visited
  { id: 'u1', categoryId: 'pubg-uc', diamonds: '60 UC', priceBDT: 95 },
];

export const INITIAL_MARQUEE = "Welcome to Jio TopUp Store! ⚡ SPECIAL SALE: 5% OFF ALL DIAMOND PACKAGES! ⚡ Instant Delivery 30s - 20m ⚡ 100% Safe & Trusted ⚡";