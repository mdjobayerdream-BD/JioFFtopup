import React from 'react';
import { Phone, Mail, Shield, Zap, Clock, Send, Github } from 'lucide-react';
import { TELEGRAM_LINK, SUPPORT_PHONE } from '../constants';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-10 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
             <h3 className="text-2xl font-bold font-heading text-white mb-4">JIO<span className="text-brand-500">STORE</span></h3>
             <p className="text-gray-400 text-sm mb-4 max-w-sm">
               The most trusted digital goods platform in Bangladesh. We provide instant delivery for Free Fire diamonds, PUBG UC, and premium subscriptions.
             </p>
             <div className="flex gap-4">
               <div className="flex items-center gap-2 text-gray-400 text-sm">
                 <Shield size={16} className="text-green-500" /> Secure
               </div>
               <div className="flex items-center gap-2 text-gray-400 text-sm">
                 <Zap size={16} className="text-yellow-500" /> Instant
               </div>
               <div className="flex items-center gap-2 text-gray-400 text-sm">
                 <Clock size={16} className="text-blue-500" /> 24/7
               </div>
             </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone size={14} /> +{SUPPORT_PHONE}</li>
              <li className="flex items-center gap-2"><Mail size={14} /> support@jiostore.com</li>
              <li className="flex items-center gap-2">
                  <Send size={14} /> 
                  <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Telegram Support</a>
              </li>
              <li className="flex items-center gap-2">
                  <Github size={14} /> 
                  <a href="https://github.com/mdjobayerdream/jio-topup-store" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Repository</a>
              </li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-4">Payment Partners</h4>
             <div className="flex gap-3 flex-wrap">
               <div className="h-10 w-16 bg-pink-600/20 border border-pink-600/50 rounded flex items-center justify-center text-xs font-bold text-pink-500">bkash</div>
               <div className="h-10 w-16 bg-orange-600/20 border border-orange-600/50 rounded flex items-center justify-center text-xs font-bold text-orange-500">Nagad</div>
               <div className="h-10 w-16 bg-purple-600/20 border border-purple-600/50 rounded flex items-center justify-center text-xs font-bold text-purple-500">Rocket</div>
               <div className="h-10 w-16 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-xs font-bold text-yellow-500">Binance</div>
             </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Jio Top Up Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;