import { User, Order, AppSettings, OrderStatus, DepositRequest, DepositStatus } from './types';
import { ADMIN_UID, INITIAL_MARQUEE, DEFAULT_PAYMENT_NUMBERS } from './constants';

const USERS_KEY = 'jio_store_users';
const ORDERS_KEY = 'jio_store_orders';
const DEPOSITS_KEY = 'jio_store_deposits';
const SETTINGS_KEY = 'jio_store_settings';
const CURRENT_USER_ID_KEY = 'jio_store_current_uid';

// Helper to get data
const getStorage = <T>(key: string, defaultVal: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('user_data_update'));
  }
};

// --- Users ---

export const loginUser = (uid: string, password: string): { success: boolean; message?: string; user?: User } => {
  const users = getStorage<User[]>(USERS_KEY, []);
  let user = users.find(u => u.uid === uid);

  if (user) {
    // User exists, verify password
    if (user.password && user.password !== password) {
        return { success: false, message: 'Incorrect Password' };
    }
    // Legacy user support: if no password set, set it now
    if (!user.password) {
        user.password = password;
        const index = users.findIndex(u => u.uid === uid);
        users[index] = user;
        setStorage(USERS_KEY, users);
    }
  } else {
    // Register new user
    user = {
      id: Date.now().toString(),
      uid,
      name: `Player_${uid.slice(-4)}`,
      password,
      balance: 0,
      tokens: 0,
      role: uid === ADMIN_UID ? 'admin' : 'user',
      referralCode: `REF${Math.floor(Math.random() * 10000)}`,
      streakDays: 0,
      lastClaimDate: null,
    };
    users.push(user);
    setStorage(USERS_KEY, users);
  }

  localStorage.setItem(CURRENT_USER_ID_KEY, uid);
  return { success: true, user };
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_ID_KEY);
};

export const getCurrentUser = (): User | null => {
  const uid = localStorage.getItem(CURRENT_USER_ID_KEY);
  if (!uid) return null;
  const users = getStorage<User[]>(USERS_KEY, []);
  return users.find(u => u.uid === uid) || null;
};

export const claimDailyReward = (uid: string): { success: boolean; message: string; newStreak?: number } => {
  const users = getStorage<User[]>(USERS_KEY, []);
  const userIndex = users.findIndex(u => u.uid === uid);
  if (userIndex === -1) return { success: false, message: 'User not found' };

  const user = users[userIndex];
  const today = new Date().toISOString().split('T')[0];

  if (user.lastClaimDate === today) {
    return { success: false, message: 'Already claimed today!' };
  }

  // Simple streak logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (user.lastClaimDate === yesterdayStr) {
    user.streakDays += 1;
  } else {
    user.streakDays = 1;
  }

  user.tokens += 1; // Reward
  user.lastClaimDate = today;
  
  users[userIndex] = user;
  setStorage(USERS_KEY, users);
  notifyUpdate(); // Notify app to refresh balance
  
  return { success: true, message: `Claimed! +1 Token. Streak: ${user.streakDays} days`, newStreak: user.streakDays };
};

// --- Orders ---

export const createOrder = (order: Omit<Order, 'id' | 'status' | 'date'>): { success: boolean; message: string } => {
  const orders = getStorage<Order[]>(ORDERS_KEY, []);
  const users = getStorage<User[]>(USERS_KEY, []);
  const userIndex = users.findIndex(u => u.uid === order.userUid);

  if (userIndex === -1) return { success: false, message: 'User not found' };

  const user = users[userIndex];

  // Logic: If paying by Wallet, check balance against TOTAL Amount (inc tax)
  if (order.paymentMethod === 'Wallet') {
    if (user.balance < order.amount) {
      return { success: false, message: 'Insufficient Wallet Balance. Please Add Money.' };
    }
    user.balance -= order.amount;
    users[userIndex] = user;
    setStorage(USERS_KEY, users);
    notifyUpdate(); // Notify app to refresh balance
  } else {
    // Direct Payment Logic
    if (!order.trxId) {
        return { success: false, message: 'Transaction ID is required for direct payment.' };
    }
    if (!order.senderNumber && order.paymentMethod !== 'Binance') {
        return { success: false, message: 'Sender Number is required.' };
    }
  }

  const newOrder: Order = {
    ...order,
    id: `ORD${Date.now()}`,
    status: 'pending',
    date: new Date().toISOString(),
  };

  orders.unshift(newOrder); // Add to top
  setStorage(ORDERS_KEY, orders);
  
  return { success: true, message: 'Order Placed Successfully! Admin will verify.' };
};

export const getOrders = (): Order[] => {
  return getStorage<Order[]>(ORDERS_KEY, []);
};

export const getUserOrders = (uid: string): Order[] => {
  const orders = getOrders();
  return orders.filter(o => o.userUid === uid);
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getStorage<Order[]>(ORDERS_KEY, []);
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    setStorage(ORDERS_KEY, orders);
  }
};

// --- Deposits / Wallet ---

export const createDepositRequest = (request: Omit<DepositRequest, 'id' | 'status' | 'date'>): { success: boolean; message: string } => {
  const deposits = getStorage<DepositRequest[]>(DEPOSITS_KEY, []);
  const newDeposit: DepositRequest = {
    ...request,
    id: `DEP${Date.now()}`,
    status: 'pending',
    date: new Date().toISOString(),
  };
  deposits.unshift(newDeposit);
  setStorage(DEPOSITS_KEY, deposits);
  return { success: true, message: 'Deposit Request Submitted! Wait for Admin Approval.' };
};

export const getDepositRequests = (): DepositRequest[] => {
  return getStorage<DepositRequest[]>(DEPOSITS_KEY, []);
};

export const getUserDeposits = (uid: string): DepositRequest[] => {
  const deposits = getDepositRequests();
  return deposits.filter(d => d.userUid === uid);
};

export const updateDepositStatus = (depositId: string, status: DepositStatus) => {
  const deposits = getStorage<DepositRequest[]>(DEPOSITS_KEY, []);
  const depositIndex = deposits.findIndex(d => d.id === depositId);
  
  if (depositIndex === -1) return;
  
  const deposit = deposits[depositIndex];

  // Logic: If transitioning TO approved, add balance to user
  if (deposit.status === 'pending' && status === 'approved') {
    const users = getStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.uid === deposit.userUid);
    if (userIndex !== -1) {
      // Add balance
      users[userIndex].balance += deposit.amount;
      setStorage(USERS_KEY, users);
      notifyUpdate(); // Notify app to refresh balance
    }
  }

  // Update status
  deposits[depositIndex].status = status;
  setStorage(DEPOSITS_KEY, deposits);
};

// --- Settings ---

export const getSettings = (): AppSettings => {
  return getStorage<AppSettings>(SETTINGS_KEY, { 
    marqueeNotice: INITIAL_MARQUEE,
    paymentNumbers: DEFAULT_PAYMENT_NUMBERS
  });
};

export const updateSettings = (settings: AppSettings) => {
  setStorage(SETTINGS_KEY, settings);
};