import React, { useState, useEffect } from 'react';
import { getCurrentUser, getUserOrders, claimDailyReward, getUserDeposits } from '../mockApi';
import { User, Order, DepositRequest } from '../types';
import { Wallet, Gift, Share2, List, PlusCircle, History, CreditCard, Sparkles } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [claimMsg, setClaimMsg] = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { window.location.hash = '#/login'; return; }
    setUser(u);
    setOrders(getUserOrders(u.uid));
    setDeposits(getUserDeposits(u.uid));
  }, []);

  const handleClaim = () => {
    if (!user) return;
    const result = claimDailyReward(user.uid);
    setClaimMsg(result.message);
    if (result.success) {
      const updatedUser = getCurrentUser();
      if(updatedUser) setUser(updatedUser);
    }
    setTimeout(() => setClaimMsg(''), 3000);
  };

  const copyRef = () => {
    if (user) {
        navigator.clipboard.writeText(`${window.location.origin}/?ref=${user.referralCode}`);
        alert(`Link copied!`);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome & ID */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white font-heading">Dashboard</h1>
           <p className="text-gray-400 text-sm">Manage your wallet and orders</p>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={copyRef} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-700 transition-colors">
                <Share2 size={16} className="text-brand-400"/> Invite
             </button>
             <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
                 <div className="text-[10px] text-gray-500 uppercase font-bold">Player ID</div>
                 <div className="text-white font-mono font-bold leading-none">{user.uid}</div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Holographic Wallet Card */}
        <div className="md:col-span-2 relative h-56 rounded-3xl overflow-hidden group shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-brand-900"></div>
           {/* Abstract Shapes */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
           
           {/* Glass Content */}
           <div className="relative h-full p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                  <div>
                      <div className="text-white/70 text-sm font-medium tracking-wider mb-1">Total Balance</div>
                      <div className="text-4xl font-black text-white font-mono tracking-tight">৳ {user.balance.toFixed(2)}</div>
                  </div>
                  <Wallet className="text-white/30" size={40} />
              </div>
              
              <div className="flex gap-4">
                  <a href="#/profile/addwallet" className="flex-1 bg-white text-brand-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
                      <PlusCircle size={18} /> Add Money
                  </a>
                  <a href="#/" className="flex-1 bg-white/10 backdrop-blur-md text-white font-bold py-3 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                      Buy Diamonds
                  </a>
              </div>
           </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 relative">
                <Gift size={32} className="text-yellow-500" />
                <Sparkles size={16} className="text-white absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Daily Reward</h3>
            <div className="text-sm text-gray-400 mb-4">Streak: <b className="text-white">{user.streakDays} Days</b></div>
            
            <button onClick={handleClaim} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition-colors mb-2">
                Claim Token
            </button>
            <div className="text-xs font-bold text-brand-400">Balance: {user.tokens} Tokens</div>
            {claimMsg && <div className="absolute bottom-2 text-green-400 text-xs font-bold animate-bounce">{claimMsg}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* History Tables */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
             <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                <h3 className="font-bold text-white flex items-center gap-2"><History size={18} className="text-gray-400"/> Deposits</h3>
             </div>
             <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                   <tbody className="divide-y divide-slate-700">
                      {deposits.length > 0 ? deposits.map(d => (
                          <tr key={d.id} className="hover:bg-slate-700/50">
                              <td className="px-6 py-4">
                                  <div className="text-white font-bold">{d.method}</div>
                                  <div className="text-[10px] text-gray-500">{new Date(d.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="text-white font-mono">৳ {d.amount}</div>
                                  <div className={`text-[10px] font-bold uppercase ${d.status==='approved'?'text-green-500':d.status==='rejected'?'text-red-500':'text-yellow-500'}`}>{d.status}</div>
                              </td>
                          </tr>
                      )) : <tr><td className="p-6 text-center text-gray-500 text-xs">No records found</td></tr>}
                   </tbody>
                </table>
             </div>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
             <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                <h3 className="font-bold text-white flex items-center gap-2"><List size={18} className="text-gray-400"/> Recent Orders</h3>
                <a href="#/recent-orders" className="text-xs text-brand-400 hover:text-white font-bold">View Live</a>
             </div>
             <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                   <tbody className="divide-y divide-slate-700">
                      {orders.length > 0 ? orders.slice(0,5).map(o => (
                          <tr key={o.id} className="hover:bg-slate-700/50">
                              <td className="px-6 py-4">
                                  <div className="text-white font-bold text-xs">{o.packageDetails}</div>
                                  <div className="text-[10px] text-gray-500">{new Date(o.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${o.status==='completed'?'bg-green-500/20 text-green-500':o.status==='rejected'?'bg-red-500/20 text-red-500':'bg-yellow-500/20 text-yellow-500'}`}>{o.status}</span>
                              </td>
                          </tr>
                      )) : <tr><td className="p-6 text-center text-gray-500 text-xs">No orders yet</td></tr>}
                   </tbody>
                </table>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;