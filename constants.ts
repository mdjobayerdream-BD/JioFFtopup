
import { Category, Package } from './types';

export const ADMIN_UID = '12345678';
export const SUPPORT_PHONE = '8801700000000';
export const TELEGRAM_LINK = 'https://t.me/jiostore';
export const INITIAL_MARQUEE = 'Welcome to JIO Store! 💎 Instant Top-Up available 24/7. Use code WELCOME for a bonus on your first deposit! 🚀';

export const DEFAULT_PAYMENT_NUMBERS = {
  bkash: '01700000000',
  nagad: '01800000000',
  rocket: '01900000000',
  binance: '1210169527'
};

export const CATEGORIES: Category[] = [
  {
    id: 'ff-id',
    title: 'Free Fire UID',
    group: 'FreeFire',
    image: 'https://images.unsplash.com/photo-1580234797602-22c37b2a6230?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ff-weekly',
    title: 'Weekly/Monthly',
    group: 'FreeFire',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pubg-uc',
    title: 'PUBG UC',
    group: 'PUBG',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'netflix-sub',
    title: 'Netflix Premium',
    group: 'Subscription',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop'
  }
];

export const PACKAGES: Package[] = [
  { id: 'ff1', categoryId: 'ff-id', diamonds: '115 Diamonds', priceBDT: 85, tag: 'POPULAR' },
  { id: 'ff2', categoryId: 'ff-id', diamonds: '240 Diamonds', priceBDT: 175 },
  { id: 'ff3', categoryId: 'ff-id', diamonds: '610 Diamonds', priceBDT: 430, tag: 'HOT' },
  { id: 'ff4', categoryId: 'ff-id', diamonds: '1240 Diamonds', priceBDT: 850 },
  { id: 'ff5', categoryId: 'ff-id', diamonds: '2530 Diamonds', priceBDT: 1700 },
  
  { id: 'fw1', categoryId: 'ff-weekly', diamonds: 'Weekly Membership', priceBDT: 160, tag: 'HOT' },
  { id: 'fm1', categoryId: 'ff-weekly', diamonds: 'Monthly Membership', priceBDT: 750 },
  
  { id: 'p1', categoryId: 'pubg-uc', diamonds: '60 UC', priceBDT: 95 },
  { id: 'p2', categoryId: 'pubg-uc', diamonds: '325 UC', priceBDT: 450, tag: 'POPULAR' },
  { id: 'p3', categoryId: 'pubg-uc', diamonds: '660 UC', priceBDT: 880 }
];
