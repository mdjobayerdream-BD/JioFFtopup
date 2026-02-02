import React, { useState, useEffect } from 'react';
import { CATEGORIES, PACKAGES, DEFAULT_PAYMENT_NUMBERS, TELEGRAM_LINK } from '../constants';
import { getCurrentUser, createOrder, getSettings } from '../mockApi';
import { Package, User, AppSettings } from '../types';
import { Check, AlertCircle, ShieldCheck, Info, Copy, Wallet, User as UserIcon, Tag, Zap } from 'lucide-react';

const TopUp = () => {
  const categoryId = window.location.hash.split('/topup/')[1];
  const category = CATEGORIES.find(c => c.id === categoryId);
  const packages = PACKAGES.filter(p => p.categoryId === categoryId);
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [payMethod, setPayMethod] = useState<'Wallet' | 'bKash' | 'Nagad' | 'Binance' | ''>('');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setSettings(getSettings());
  }, []);

  if (!category) return <div className="text-white text-center pt-20">Category not found</div>;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const calculateTotal = (price: number) => {
      const tax = Math.ceil(price * 0.05);
      return { base: price, tax: tax, total: price + tax };
  };

  const handleBuy = () => {
    if (!user) { window.location.hash = '#/login'; return; }
    if (!selectedPackage) { setError('Select a package'); return; }
    if (!playerId.trim()) { setError('Enter Player ID'); return; }
    if (!payMethod) { setError('Select Payment Method'); return; }
    if (payMethod !== 'Wallet' && !trxId) { setError('Enter Transaction ID'); return; }
    if (payMethod !== 'Wallet' && payMethod !== 'Binance' && !senderNumber) { setError('Enter Sender Number'); return; }

    const { base, tax, total } = calculateTotal(selectedPackage.priceBDT);
    const result = createOrder({
        userId: user.id, userUid: user.uid, categoryId: category.id, packageDetails: selectedPackage.diamonds,
        amount: total, basePrice: base, tax: tax, paymentMethod: payMethod,
        trxId: payMethod !== 'Wallet' ? trxId : undefined,
        senderNumber: payMethod !== 'Wallet' ? senderNumber : undefined,
        targetPlayerId: playerId, targetPlayerName: playerName
    });

    if (result.success) {
        setSuccess(true);
        setTimeout(() => window.location.hash = '#/profile', 2000);
    } else {
        setError(result.message);
    }
  };

  const getPaymentNumber = (method: string) => {
      const nums = settings?.paymentNumbers || DEFAULT_PAYMENT_NUMBERS;
      if (method === 'bKash') return nums.bkash;
      if (method === 'Nagad') return nums.nagad;
      if (method === 'Binance') return nums.binance;
      return '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-500/50">
              <img src={category.image} className="w-full h-full object-cover" alt={category.title} />
          </div>
          <div>
              <h1 className="text-3xl md:text-4xl font-black font-heading text-white uppercase italic">{category.title}</h1>
              <div className="flex items-center gap-2 text-green-400 text-sm font-bold mt-1">
                  <Zap size={14} fill="currentColor"/> Instant Delivery
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* 1. Packages */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-brand-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">1</div>
                    <h2 className="text-xl font-bold text-white">Select Pack</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {packages.map(pkg => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                            <button
                                key={pkg.id}
                                onClick={() => { setSelectedPackage(pkg); setError(''); }}
                                className={`relative group p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                                    isSelected 
                                    ? 'bg-brand-900/40 border-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                {pkg.tag && (
                                    <div className={`absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        pkg.tag === 'HOT' ? 'bg-red-600 text-white' : 'bg-brand-500 text-white'
                                    }`}>
                                        {pkg.tag}
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/8146/8146767.png" className="w-8 h-8 opacity-80" alt="Diamond"/>
                                    {isSelected && <Check size={16} className="text-brand-400" />}
                                </div>
                                <div className="text-sm font-medium text-gray-300 group-hover:text-white">{pkg.diamonds}</div>
                                <div className={`text-xl font-bold font-heading mt-1 ${isSelected ? 'text-brand-400' : 'text-white'}`}>
                                    ৳ {pkg.priceBDT}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </section>

            {/* 2. Player ID */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-brand-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">2</div>
                    <h2 className="text-xl font-bold text-white">Player Info</h2>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Player ID</label>
                        <input 
                            type="text" 
                            value={playerId}
                            onChange={(e) => setPlayerId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-11 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-lg"
                            placeholder="12345678"
                        />
                        <UserIcon className="absolute left-4 top-8 text-gray-500" size={18} />
                    </div>
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Name (Optional)</label>
                        <input 
                            type="text" 
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-11 text-white focus:border-brand-500 outline-none"
                            placeholder="NickName"
                        />
                        <Tag className="absolute left-4 top-8 text-gray-500" size={18} />
                    </div>
                </div>
            </section>

            {/* 3. Payment */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-brand-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">3</div>
                    <h2 className="text-xl font-bold text-white">Payment</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {['Wallet', 'bKash', 'Nagad', 'Binance'].map(m => (
                        <button
                            key={m}
                            onClick={() => setPayMethod(m as any)}
                            className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
                                payMethod === m 
                                ? 'bg-slate-800 border-brand-500 text-brand-400' 
                                : 'bg-slate-900 border-slate-700 text-gray-400 hover:bg-slate-800'
                            }`}
                        >
                            <span className="font-bold">{m}</span>
                            {m === 'Wallet' && <span className="text-[10px] text-gray-500 mt-1">৳ {user?.balance}</span>}
                        </button>
                    ))}
                </div>

                {payMethod && payMethod !== 'Wallet' && (
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-dashed border-slate-600 mb-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Send Money To</div>
                                <div className="text-lg font-mono text-white font-bold">{getPaymentNumber(payMethod)}</div>
                            </div>
                            <button onClick={() => handleCopy(getPaymentNumber(payMethod))} className="p-2 hover:bg-white/10 rounded-lg text-brand-400"><Copy size={18}/></button>
                        </div>
                        <div className="space-y-3">
                            {payMethod !== 'Binance' && (
                                <input type="text" placeholder="Sender Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-brand-500 outline-none"/>
                            )}
                            <input type="text" placeholder="Transaction ID (TrxID)" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-brand-500 outline-none uppercase font-mono"/>
                        </div>
                    </div>
                )}
            </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sticky top-24 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Wallet size={20} className="text-brand-400"/> Summary</h3>
                
                {selectedPackage ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-400">{selectedPackage.diamonds}</span>
                            <span className="text-white font-mono">৳ {selectedPackage.priceBDT}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-400">Fee (5%)</span>
                            <span className="text-white font-mono">৳ {calculateTotal(selectedPackage.priceBDT).tax}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-2xl font-bold text-brand-400 font-heading">৳ {calculateTotal(selectedPackage.priceBDT).total}</span>
                        </div>

                        {error && <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
                        {success && <div className="bg-green-500/10 text-green-400 text-xs p-3 rounded-lg flex items-center gap-2"><Check size={14} /> Order Success!</div>}

                        <button onClick={handleBuy} disabled={success} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {success ? 'Processing...' : 'PAY NOW'}
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">Select a package to view summary</div>
                )}

                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                    <div className="flex gap-3 text-xs text-gray-400">
                        <ShieldCheck size={16} className="text-green-500 shrink-0"/> <span>Secure SSL Encrypted Payment</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                        <Info size={16} className="text-blue-500 shrink-0"/> <span>Delivery typically takes 2-5 minutes</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;