import React, { useState, useEffect } from 'react';
import { ChevronRight, Flame, Zap, Star, Trophy, Users, Shield, ArrowRight, Gamepad2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { getSettings, getOrders } from '../mockApi';
import { Category } from '../types';

const CategoryCard = ({ cat }: { cat: Category }) => (
  <a href={`#/topup/${cat.id}`} className="group relative block h-80 w-full perspective-1000">
    <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/5 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 group-hover:border-violet-500/30 group-hover:shadow-[0_0_50px_rgba(124,58,237,0.15)] group-hover:-translate-y-2">
      
      {/* Image Overlay */}
      <div className="absolute inset-0">
        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
            {cat.id === 'ff-id' && (
               <div className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 shadow-lg shadow-red-500/40 animate-pulse">
                 <Flame size={10} fill="currentColor" /> HOT SELLER
               </div>
            )}
            
            <h3 className="text-2xl font-black font-heading text-white uppercase italic tracking-wide mb-1 leading-none group-hover:text-violet-300 transition-colors">
                {cat.title}
            </h3>
            
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                    Instant delivery directly to your account. Safe, secure, and fast.
                </p>
                <div className="mt-4 flex items-center text-violet-400 text-sm font-bold gap-2">
                    Purchase Now <ArrowRight size={16} />
                </div>
            </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12 group-hover:rotate-0">
          <Zap size={20} className="text-yellow-400 fill-current" />
      </div>
    </div>
  </a>
);

// Ticker Component
const LiveTicker = () => {
    const [text, setText] = useState('');
    useEffect(() => {
        setText(getSettings().marqueeNotice);
    }, []);
    return (
        <div className="bg-violet-900/20 border-y border-white/5 backdrop-blur-sm overflow-hidden py-2 relative z-20">
             <div className="flex gap-8 animate-marquee whitespace-nowrap text-sm font-medium text-violet-200">
                 {[1,2,3,4].map(i => (
                     <span key={i} className="flex items-center gap-4">
                         <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                         {text}
                         <span className="text-white/20">|</span>
                     </span>
                 ))}
             </div>
        </div>
    );
};

const Home = () => {
  const groups = {
    'FreeFire': CATEGORIES.filter(c => c.group === 'FreeFire'),
    'PUBG': CATEGORIES.filter(c => c.group === 'PUBG'),
    'Subscription': CATEGORIES.filter(c => c.group === 'Subscription'),
  };

  return (
    <div className="pb-20">
      <LiveTicker />
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 overflow-hidden">
         {/* Background Glows */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 
                 {/* Text Content */}
                 <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-bold tracking-wide">
                        <Star size={14} className="fill-current text-violet-500" />
                        PREMIUM TOP UP STORE
                     </div>
                     
                     <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-heading text-white leading-[0.9] uppercase italic">
                         Level Up <br/>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-white">Instantly</span>
                     </h1>
                     
                     <p className="text-lg text-gray-400 max-w-lg border-l-2 border-violet-500/50 pl-6">
                         The most trusted marketplace for gamers. Instant delivery for Free Fire, PUBG, and premium subscriptions.
                     </p>
                     
                     <div className="flex flex-wrap gap-4">
                         <a href="#/topup/ff-id" className="group bg-white text-slate-950 px-8 py-4 rounded-xl font-bold font-heading text-xl uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/10">
                             Start TopUp <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                         </a>
                         <a href="#/recent-orders" className="px-8 py-4 rounded-xl font-bold font-heading text-xl uppercase tracking-wider text-white border border-white/20 hover:bg-white/5 transition-colors">
                             Live Orders
                         </a>
                     </div>

                     {/* Stats Row */}
                     <div className="pt-8 flex gap-8 border-t border-white/5">
                         <div>
                             <div className="text-2xl font-black font-heading text-white">24/7</div>
                             <div className="text-xs text-gray-500 uppercase tracking-wider">Support</div>
                         </div>
                         <div>
                             <div className="text-2xl font-black font-heading text-white">5M+</div>
                             <div className="text-xs text-gray-500 uppercase tracking-wider">Diamonds</div>
                         </div>
                         <div>
                             <div className="text-2xl font-black font-heading text-white">100%</div>
                             <div className="text-xs text-gray-500 uppercase tracking-wider">Secure</div>
                         </div>
                     </div>
                 </div>

                 {/* Hero Image / 3D Element */}
                 <div className="relative hidden lg:block perspective-1000">
                     <div className="relative z-10 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out">
                         <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-2xl opacity-40 animate-pulse-slow"></div>
                         <img 
                            src="https://wallpapers.com/images/hd/garena-free-fire-max-clash-squad-ranked-match-8k4w458217357497.jpg" 
                            alt="Hero" 
                            className="relative rounded-3xl border border-white/10 shadow-2xl shadow-violet-500/20 w-full object-cover h-[600px] mask-gradient-b"
                         />
                         
                         {/* Floating Cards */}
                         <div className="absolute -bottom-10 -left-10 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 animate-float">
                             <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                 <Zap size={24} fill="currentColor"/>
                             </div>
                             <div>
                                 <div className="text-white font-bold text-lg">Instant Delivery</div>
                                 <div className="text-xs text-gray-500">Average 30 seconds</div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* CATEGORIES GRID */}
      <div className="max-w-7xl mx-auto px-4 space-y-32 relative z-10">
        
        {/* FREE FIRE */}
        <section>
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
             <div>
                 <div className="text-violet-500 font-bold tracking-[0.2em] text-sm uppercase mb-2">Most Popular</div>
                 <h2 className="text-4xl md:text-5xl font-black font-heading text-white uppercase italic">Free Fire <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Max</span></h2>
             </div>
             <a href="#/topup/ff-id" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                View All <ChevronRight size={16} />
             </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groups['FreeFire'].map(cat => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        </section>

        {/* PROMO BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900 to-indigo-900 border border-white/10">
            <div className="absolute inset-0 bg-[url('https://wallpapers.com/images/hd/purple-gaming-background-3f71c4n2055627s6.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div className="relative p-12 md:p-20 text-center">
                <h3 className="text-4xl md:text-6xl font-black font-heading text-white uppercase italic mb-6">Need Help?</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Our support team is online 24/7 to assist you with your orders. Join our Telegram for exclusive deals.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-white text-violet-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        Contact Support
                    </button>
                    <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                        Join Telegram
                    </button>
                </div>
            </div>
        </div>

        {/* PUBG & SUBS */}
        <section className="grid md:grid-cols-2 gap-12">
            <div>
                 <div className="flex items-center gap-4 mb-8">
                     <h2 className="text-3xl font-black font-heading text-white uppercase italic">PUBG Mobile</h2>
                     <div className="h-px flex-1 bg-white/10"></div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {groups['PUBG'].map(cat => <CategoryCard key={cat.id} cat={cat} />)}
                 </div>
            </div>
            <div>
                 <div className="flex items-center gap-4 mb-8">
                     <h2 className="text-3xl font-black font-heading text-white uppercase italic">Subscriptions</h2>
                     <div className="h-px flex-1 bg-white/10"></div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {groups['Subscription'].map(cat => <CategoryCard key={cat.id} cat={cat} />)}
                 </div>
            </div>
        </section>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .mask-gradient-b {
            mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default Home;