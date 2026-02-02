import React, { useState, useEffect } from 'react';
import { getCurrentUser, getOrders, updateOrderStatus, getSettings, updateSettings, getDepositRequests, updateDepositStatus } from '../mockApi';
import { User, Order, DepositRequest } from '../types';
import { ADMIN_UID } from '../constants';
import { Check, X, Shield, Settings, ShoppingBag, Edit3, Wallet, DollarSign, Download, Database } from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'deposits' | 'settings'>('orders');
  const [marqueeText, setMarqueeText] = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.uid !== ADMIN_UID) {
      window.location.hash = '#/';
      return;
    }
    setUser(u);
    refreshData();
    setMarqueeText(getSettings().marqueeNotice);
  }, []);

  const refreshData = () => {
      setOrders(getOrders());
      setDeposits(getDepositRequests());
  };

  const handleStatusUpdate = (orderId: string, status: 'completed' | 'rejected') => {
    updateOrderStatus(orderId, status);
    refreshData();
  };

  const handleDepositUpdate = (depositId: string, status: 'approved' | 'rejected') => {
    if(window.confirm(`Are you sure you want to ${status} this deposit?`)) {
        updateDepositStatus(depositId, status);
        refreshData();
        alert(`Deposit ${status} successfully!`);
    }
  };

  const saveSettings = () => {
    updateSettings({ ...getSettings(), marqueeNotice: marqueeText });
    alert('Settings Saved');
  };

  const handleDownloadBackup = () => {
    const backup = {
        users: JSON.parse(localStorage.getItem('jio_store_users') || '[]'),
        orders: JSON.parse(localStorage.getItem('jio_store_orders') || '[]'),
        deposits: JSON.parse(localStorage.getItem('jio_store_deposits') || '[]'),
        settings: JSON.parse(localStorage.getItem('jio_store_settings') || '{}'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jio_store_backup_" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-600/20 p-3 rounded-full">
            <Shield size={32} className="text-red-500" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-heading text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Manage Orders & Wallet Requests</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-700 pb-4">
        <button 
           onClick={() => setActiveTab('orders')}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'}`}
        >
            <ShoppingBag size={18} /> Orders
            <span className="bg-slate-900 px-2 py-0.5 rounded text-xs ml-1">{orders.filter(o => o.status === 'pending').length}</span>
        </button>
        <button 
           onClick={() => setActiveTab('deposits')}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'deposits' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'}`}
        >
            <Wallet size={18} /> Wallet Requests
            <span className="bg-slate-900 px-2 py-0.5 rounded text-xs ml-1">{deposits.filter(d => d.status === 'pending').length}</span>
        </button>
        <button 
           onClick={() => setActiveTab('settings')}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'settings' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'}`}
        >
            <Settings size={18} /> Settings
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-slate-900 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Player ID</th>
                            <th className="px-4 py-3">Package</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Pay Info</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-700/50">
                                <td className="px-4 py-3">
                                    <div className="text-white text-xs">{order.userUid}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-mono font-bold text-white text-sm">{order.targetPlayerId}</div>
                                    {order.targetPlayerName && <div className="text-[10px] text-gray-500">{order.targetPlayerName}</div>}
                                </td>
                                <td className="px-4 py-3 text-brand-200 text-xs">{order.packageDetails}</td>
                                <td className="px-4 py-3 font-bold text-white text-xs">
                                    ৳ {order.amount}
                                    <div className="text-[10px] text-gray-500 font-normal">Base: {order.basePrice} | Tax: {order.tax}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`text-xs font-bold mb-1 ${
                                        order.paymentMethod === 'Wallet' ? 'text-brand-400' : 'text-yellow-400'
                                    }`}>{order.paymentMethod}</div>
                                    
                                    {order.paymentMethod !== 'Wallet' && (
                                        <div className="text-[10px] space-y-0.5">
                                            <div>Trx: <span className="text-white select-all">{order.trxId}</span></div>
                                            {order.senderNumber && <div>Sender: <span className="text-white select-all">{order.senderNumber}</span></div>}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {order.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded"
                                                title="Complete"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(order.id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'deposits' && (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
             <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                 <h3 className="text-white font-bold flex items-center gap-2"><DollarSign size={18} className="text-green-500"/> Incoming Money Requests</h3>
                 <span className="text-xs text-gray-500">Check TrxID with actual payment before approving.</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-slate-900 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">TrxID</th>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {deposits.map(dep => (
                            <tr key={dep.id} className="hover:bg-slate-700/50">
                                <td className="px-4 py-3 font-mono text-xs">{dep.userUid}</td>
                                <td className="px-4 py-3 font-bold text-white">৳ {dep.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                        dep.method === 'bKash' ? 'border-pink-500/50 text-pink-400' :
                                        dep.method === 'Nagad' ? 'border-orange-500/50 text-orange-400' :
                                        dep.method === 'Rocket' ? 'border-purple-500/50 text-purple-400' :
                                        'border-yellow-500/50 text-yellow-400'
                                    }`}>{dep.method}</span>
                                </td>
                                <td className="px-4 py-3 font-mono text-white select-all">{dep.trxId}</td>
                                <td className="px-4 py-3 text-xs">{new Date(dep.date).toLocaleTimeString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        dep.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                        dep.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {dep.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {dep.status === 'pending' ? (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleDepositUpdate(dep.id, 'approved')}
                                                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded shadow shadow-green-900/50"
                                                title="Confirm Payment"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDepositUpdate(dep.id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded shadow shadow-red-900/50"
                                                title="Fake/Invalid"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-gray-600">Archived</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {deposits.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-500">No deposit requests found.</td></tr>
                        )}
                    </tbody>
                </table>
             </div>
        </div>
      )}

      {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Edit3 size={20}/> Site Content</h2>
                  <div className="mb-4">
                      <label className="block text-gray-400 mb-2">Marquee Notice</label>
                      <textarea 
                        value={marqueeText}
                        onChange={(e) => setMarqueeText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-brand-500 outline-none h-32"
                      />
                  </div>
                  <button 
                    onClick={saveSettings}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-brand-500/30"
                  >
                      Save Changes
                  </button>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Database size={20}/> Data Management</h2>
                  <p className="text-gray-400 text-sm mb-6">
                      Download a complete backup of all Users, Orders, and Transactions. Keep this file safe.
                  </p>
                  <button 
                    onClick={handleDownloadBackup}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg border border-slate-600 flex items-center justify-center gap-2 hover:border-slate-500 transition-colors"
                  >
                      <Download size={20} /> Download Database Backup (.json)
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;