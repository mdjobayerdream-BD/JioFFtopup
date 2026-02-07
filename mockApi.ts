import { User, Order, AppSettings, OrderStatus, DepositRequest, DepositStatus } from './types';
import { ADMIN_UID, INITIAL_MARQUEE, DEFAULT_PAYMENT_NUMBERS } from './constants';

const USERS_KEY = 'jio_store_users';
const ORDERS_KEY = 'jio_store_orders';
const DEPOSITS_KEY = 'jio_store_deposits';
const SETTINGS_KEY = 'jio_store_settings';
const CURRENT_USER_ID_KEY = 'jio_store_current_uid';

// Helper to get data securely with auto-cleanup for bad data
const getStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultVal;
    
    const parsed = JSON.parse(data);
    
    // Basic validation: if array expected but got object, or vice versa, reset
    if (Array.isArray(defaultVal) && !Array.isArray(parsed)) {
        console.warn(`Data type mismatch for ${key}. Resetting to default.`);
        return defaultVal;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error parsing storage key "${key}":`, error);
    // If it's totally corrupted, don't crash, just return default
    return defaultVal;
  }
};

const setStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting storage key "${key}":`, error);
  }
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
    if (user.password && user.password !== password) {
        return { success: false, message: 'Incorrect Password' };
    }
    if (!user.password) {
        user.password = password;
        const index = users.findIndex(u => u.uid === uid);
        users[index] = user;
        setStorage(USERS_KEY, users);
    }
  } else {
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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (user.lastClaimDate === yesterdayStr) {
    user.streakDays += 1;
  } else {
    user.streakDays = 1;
  }

  user.tokens += 1;
  user.lastClaimDate = today;
  
  users[userIndex] = user;
  setStorage(USERS_KEY, users);
  notifyUpdate();
  
  return { success: true, message: `Claimed! +1 Token. Streak: ${user.streakDays} days`, newStreak: user.streakDays };
};

// --- Orders ---

export const createOrder = (order: Omit<Order, 'id' | 'status' | 'date'>): { success: boolean; message: string } => {
  const orders = getStorage<Order[]>(ORDERS_KEY, []);
  const users = getStorage<User[]>(USERS_KEY, []);
  const userIndex = users.findIndex(u => u.uid === order.userUid);

  if (userIndex === -1) return { success: false, message: 'User not found' };

  const user = users[userIndex];

  if (order.paymentMethod === 'Wallet') {
    if (user.balance < order.amount) {
      return { success: false, message: 'Insufficient Wallet Balance.' };
    }
    user.balance -= order.amount;
    users[userIndex] = user;
    setStorage(USERS_KEY, users);
    notifyUpdate();
  }

  const newOrder: Order = {
    ...order,
    id: `ORD${Date.now()}`,
    status: 'pending',
    date: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  setStorage(ORDERS_KEY, orders);
  
  return { success: true, message: 'Order Placed Successfully!' };
};

export const getOrders = (): Order[] => {
  return getStorage<Order[]>(ORDERS_KEY, []);
};

export const getUserOrders = (uid: string): Order[] => {
  return getOrders().filter(o => o.userUid === uid);
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getStorage<Order[]>(ORDERS_KEY, []);
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    setStorage(ORDERS_KEY, orders);
  }
};

// --- Deposits ---

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
  return { success: true, message: 'Deposit Request Submitted!' };
};

export const getDepositRequests = (): DepositRequest[] => {
  return getStorage<DepositRequest[]>(DEPOSITS_KEY, []);
};

export const getUserDeposits = (uid: string): DepositRequest[] => {
  return getDepositRequests().filter(d => d.userUid === uid);
};

export const updateDepositStatus = (depositId: string, status: DepositStatus) => {
  const deposits = getStorage<DepositRequest[]>(DEPOSITS_KEY, []);
  const depositIndex = deposits.findIndex(d => d.id === depositId);
  
  if (depositIndex === -1) return;
  
  const deposit = deposits[depositIndex];

  if (deposit.status === 'pending' && status === 'approved') {
    const users = getStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.uid === deposit.userUid);
    if (userIndex !== -1) {
      users[userIndex].balance += deposit.amount;
      setStorage(USERS_KEY, users);
      notifyUpdate();
    }
  }

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