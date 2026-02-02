import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Wallet, ArrowRight, Send } from 'lucide-react';
import { getCurrentUser, getSettings, createDepositRequest } from '../mockApi';
import { AppSettings } from '../types';
import { TELEGRAM_LINK } from '../constants';

const AddWallet = () => {
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Binance'>('bKash');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
        window.location.hash = '#/login';
        return;
    }

    if (!amount || !trxId) return;

    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
        const result = createDepositRequest({
            userId: user.id,
            userUid: user.uid,
            amount: parseFloat(amount),
            method: method,
            trxId: trxId
        });

        setLoading(false);
        if (result.success) {
            alert(result.message);
            window.location.hash = '#/profile';
        }
    }, 1000);
  };

  if (!settings) return null;

  const currentNumber = method === 'bKash' ? settings.paymentNumbers.bkash 
                      : method === 'Nagad' ? settings.paymentNumbers.nagad 
                      : method === 'Rocket' ? settings.paymentNumbers.rocket
                      : settings.paymentNumbers.binance || "1210169527";

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-900/50 p-6 text-center border-b border-brand-800/50">
           <div className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
                <Wallet className="text-white" size={32} />
           </div>
           <h1 className="text-3xl font-bold font-heading text-white">Add Money</h1>
           <p className="text-brand-200 text-sm mt-1">Manual Deposit to Wallet</p>
        </div>
        
        <div className="p-6">
            {/* Step 1: Select Method */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">1. Select Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                    {['bKash', 'Nagad', 'Rocket', 'Binance'].map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMethod(m as any)}
                            className={`py-3 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all border-2 ${
                                method === m 
                                ? 'bg-brand-600 border-brand-500 text-white shadow-lg' 
                                : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-500'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2: Copy Number */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-300 mb-3">
                    2. {method === 'Binance' ? 'Send Crypto (Binance Pay)' : 'Send Money (Send Money/Cash In)'}
                </label>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="overflow-hidden">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            {method === 'Binance' ? 'Binance Pay ID / Wallet' : `${method} Personal Number`}
                        </div>
                        <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest mt-1 truncate">
                            {currentNumber}
                        </div>
                    </div>
                    <button 
                        onClick={() => handleCopy(currentNumber)}
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg transition-colors border border-slate-600 flex-shrink-0 ml-2"
                    >
                        <Copy size={20}/>
                    </button>
                </div>
                <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Minimum Deposit: {method === 'Binance' ? '1 USD' : '50 BDT'}
                </div>
            </div>

            {/* Step 3: Fill Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">3. Enter Amount (BDT)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3.5 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono text-lg"
                        placeholder={method === 'Binance' ? "Equivalent BDT Amount" : "e.g. 500"}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">4. Enter Transaction ID (TrxID)</label>
                    <input 
                        type="text" 
                        value={trxId}
                        onChange={e => setTrxId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3.5 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono uppercase tracking-wide"
                        placeholder="e.g. 8H3K9L2M"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">Copy the TrxID from the payment success SMS/App/Email and paste it here.</p>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-900/40 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? 'Verifying...' : 'Verify Deposit'} <ArrowRight size={20} />
                </button>
            </form>
            
            <div className="mt-6 text-center border-t border-slate-700 pt-4">
                <a 
                    href={TELEGRAM_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors hover:bg-slate-700/50 px-4 py-2 rounded-lg"
                >
                    <Send size={18} /> Need Help? Contact Telegram Support
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddWallet;