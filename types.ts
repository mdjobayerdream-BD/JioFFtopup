export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  uid: string; // The Player ID used for login
  name: string;
  password?: string;
  balance: number;
  tokens: number;
  role: UserRole;
  referralCode: string;
  streakDays: number;
  lastClaimDate: string | null;
}

export interface Package {
  id: string;
  categoryId: string;
  diamonds: string;
  priceBDT: number;
  bonus?: string;
  tag?: string;
}

export type CategoryGroup = 'FreeFire' | 'PUBG' | 'Subscription' | 'Other';

export interface Category {
  id: string;
  title: string;
  group: CategoryGroup;
  image: string;
}

export type OrderStatus = 'pending' | 'completed' | 'rejected';

export interface Order {
  id: string;
  userId: string;
  userUid: string; // Stored for display
  categoryId: string;
  packageDetails: string;
  amount: number; // Final Total Amount
  basePrice: number;
  tax: number;
  paymentMethod: 'Wallet' | 'bKash' | 'Nagad' | 'Binance';
  trxId?: string; // Optional transaction ID for direct payments
  senderNumber?: string; // Sender's number for verification
  status: OrderStatus;
  date: string;
  targetPlayerId: string; // The ID the user entered to top-up
  targetPlayerName?: string; // Optional name
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';

export interface DepositRequest {
  id: string;
  userId: string;
  userUid: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Binance';
  trxId: string;
  status: DepositStatus;
  date: string;
}

export interface AppSettings {
  marqueeNotice: string;
  paymentNumbers: {
    bkash: string;
    nagad: string;
    rocket: string;
    binance: string;
  }
}