
import React, { useState, useEffect } from 'react';
import { CATEGORIES, PACKAGES, DEFAULT_PAYMENT_NUMBERS } from '../constants';
import { getCurrentUser, createOrder, getSettings } from '../mockApi';
import { Package, User, AppSettings } from '../types';
import { Check, AlertCircle, ShieldCheck, Info, Copy, Wallet, User as UserIcon, Tag, Zap, ArrowRight, X } from 'lucide-react';

// Added missing default export and completed the component logic
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
    alert("Number copied!");
  };

  const calculateTotal = (price: number) => {
      const tax = Math.ceil(price * 0.05);
      return { base: price, tax: tax, total: price + tax };
  };

  const handleBuy = () => {
    if (!user) { window.location.hash = '#/login'; return; }
    if (!selectedPackage) { setError('Please select a package'); return; }
    if (!playerId.trim()) { setError('Player ID is required'); return; }
    if (!payMethod) { setError('Select a payment method'); return; }
    if (payMethod !== 'Wallet' && !trxId) { setError('Transaction ID is missing'); return; }
    if (payMethod !== 'Wallet' && payMethod !== 'Binance' && !senderNumber) { setError('Sender number is missing'); return; }

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
      {/* Page Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/40 to-transparent"></div>
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/5 shrink-0">
              <img src={category.image} className="w-full h-full object-cover" alt={category.title} />
          </div>
          <div className="relative text-center md:text-left">
              <div className="text-violet-400 font-bold tracking-widest text-xs uppercase mb-1">Top Up Zone</div>
              <h1 className="text-3xl md:text-5xl font-black font-heading text-white uppercase italic">{category.title}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                 <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-900/20 px-3 py-1 rounded-lg border border-green-500/20">
                     <Zap size={14} fill="currentColor"/> Instant Delivery
                 </div>
                 <div className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-500/20">
                     <ShieldCheck size={14} /> Official Distributor
                 </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - STEPS */}
        <div className="lg:col-span-2 space-y-12">
            
            {/* Step 1: Packages */}
            <section className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30">1</div>
                    <h2 className="text-2xl font-bold text-white font-heading">Select Package</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {packages.map(pkg => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                            <button
                                key={pkg.id}
                                onClick={() => { setSelectedPackage(pkg); setError(''); }}
                                className={`relative group p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                                    isSelected 
                                    ? 'bg-violet-900/20 border-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.15)]' 
                                    : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                                }`}
                            >
                                {pkg.tag && (
                                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider ${
                                        pkg.tag === 'HOT' ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' : 'bg-violet-600 text-white'
                                    }`}>
                                        {pkg.tag}
                                    </div>
                                )}
                                
                                <div className="mb-4 mt-2">
                                     <div className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{pkg.diamonds}</div>
                                     <div className={`text-2xl font-black font-heading mt-1 ${isSelected ? 'text-violet-400' : 'text-white'}`}>
                                         ৳ {pkg.priceBDT}
                                     </div>
                                </div>
                                {isSelected && <div className="absolute bottom-0 left-0 w-full h-1 bg-violet-500"></div>}
                            </button>
                        )
                    })}
                </div>
            </section>

            {/* Step 2: Player Info */}
            <section className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30">2</div>
                    <h2 className="text-2xl font-bold text-white font-heading">Player Details</h2>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Player ID (UID)</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-mono text-lg transition-all"
                                placeholder="12345678"
                            />
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-500 transition-colors" size={20} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nickname (Optional)</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                                placeholder="ProGamer"
                            />
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-500 transition-colors" size={20} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 3: Payment */}
            <section className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30">3</div>
                    <h2 className="text-2xl font-bold text-white font-heading">Payment Method</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(['Wallet', 'bKash', 'Nagad', 'Binance'] as const).map(method => (
                            <button
                                key={method}
                                onClick={() => setPayMethod(method)}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    payMethod === method 
                                    ? 'bg-violet-900/20 border-violet-500 text-white' 
                                    : 'bg-slate-800/50 border-white/5 text-gray-400 hover:bg-slate-800'
                                }`}
                            >
                                <div className="p-2 rounded-lg bg-white/5">
                                    {method === 'Wallet' ? <Wallet size={20} /> : <Zap size={20} />}
                                </div>
                                <span className="font-bold text-sm">{method}</span>
                            </button>
                        ))}
                    </div>

                    {payMethod && payMethod !== 'Wallet' && (
                        <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-violet-600/20 p-2 rounded-lg text-violet-400"><Info size={20}/></div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Payment Instructions</h4>
                                    <p className="text-gray-400 text-xs">
                                        Send the total amount to our {payMethod} {payMethod === 'Binance' ? 'ID' : 'Personal Number'}:
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-white/10 mb-8">
                                <span className="text-xl font-mono font-bold text-white tracking-widest">{getPaymentNumber(payMethod)}</span>
                                <button onClick={() => handleCopy(getPaymentNumber(payMethod))} className="bg-slate-800 p-2 rounded-lg text-violet-400 hover:text-white transition-colors">
                                    <Copy size={18}/>
                                </button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Transaction ID</label>
                                    <input 
                                        type="text" 
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none uppercase font-mono tracking-wide"
                                        placeholder="TrxID"
                                    />
                                </div>
                                {payMethod !== 'Binance' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Your Number</label>
                                        <input 
                                            type="text" 
                                            value={senderNumber}
                                            onChange={(e) => setSenderNumber(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                            placeholder="Sender Phone"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {payMethod === 'Wallet' && (
                        <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-violet-600/20 p-3 rounded-xl text-violet-400"><Wallet size={24}/></div>
                                <div>
                                    <div className="text-white font-bold">Wallet Payment</div>
                                    <div className="text-xs text-gray-400">Balance: ৳ {user?.balance.toFixed(2)}</div>
                                </div>
                            </div>
                            {user && selectedPackage && user.balance < calculateTotal(selectedPackage.priceBDT).total && (
                                <a href="#/profile/addwallet" className="text-xs font-bold text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">Insufficient Balance! Add Money →</a>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="space-y-6">
            <div className="bg-slate-800/80 border border-white/5 rounded-3xl p-8 sticky top-24 shadow-2xl backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white font-heading mb-6 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400 fill-current" /> Order Summary
                </h3>
                
                {selectedPackage ? (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Item</span>
                                <span className="text-white font-bold">{selectedPackage.diamonds}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Price</span>
                                <span className="text-white font-bold">৳ {selectedPackage.priceBDT}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Tax (5%)</span>
                                <span className="text-white font-bold">৳ {calculateTotal(selectedPackage.priceBDT).tax}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-white font-bold">Grand Total</span>
                            <div className="text-right">
                                <div className="text-3xl font-black text-violet-400 font-mono italic">৳ {calculateTotal(selectedPackage.priceBDT).total}</div>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in zoom-in-95 duration-200">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button 
                            onClick={handleBuy}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-violet-600/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                        >
                            Complete Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-sm">Select a package to see checkout details</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Success Animation */}
      {success && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-violet-500/30 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-90 duration-300">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                      <Check size={48} strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                      <h3 className="text-3xl font-black text-white font-heading uppercase italic tracking-wider">Success!</h3>
                      <p className="text-gray-400">Order placed successfully. Verifying payment...</p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TopUp;
