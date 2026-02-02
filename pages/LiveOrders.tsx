import React, { useState, useEffect } from 'react';
import { getOrders } from '../mockApi';
import { Order } from '../types';
import { Activity } from 'lucide-react';

const LiveOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Poll for new orders every 5 seconds
    const fetchOrders = () => {
        const all = getOrders();
        // Just show last 20 public orders
        setOrders(all.slice(0, 20));
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const maskUid = (uid: string) => {
    if (!uid) return '******';
    return uid.substring(0, 2) + '****' + uid.substring(uid.length - 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <Activity className="text-brand-500 animate-pulse" size={28} />
        <h1 className="text-3xl font-bold font-heading text-white">Live Orders</h1>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-slate-900 text-xs uppercase font-medium">
                    <tr>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 font-mono text-white">{maskUid(order.userUid)}</td>
                            <td className="px-4 py-3 text-brand-200">{order.packageDetails}</td>
                            <td className="px-4 py-3 text-xs">{new Date(order.date).toLocaleTimeString()}</td>
                            <td className="px-4 py-3 text-right">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                    order.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-8">No live orders yet.</td></tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default LiveOrders;