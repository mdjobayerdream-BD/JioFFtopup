import React, { useState, useEffect } from 'react';
import { ChevronRight, Flame, Gamepad2, Tv, Zap, Star, Trophy, Users, Shield, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { getSettings, getOrders } from '../mockApi';
import { Category } from '../types';

const Card = ({ cat }: { cat: Category }) => (
  <a href={`#/topup/${cat.id}`} className="group relative h-64 rounded-3xl overflow-hidden bg-slate-900 border border-white/5 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-2">
    {/* Image Background with Ken Burns on hover */}
    <div className="absolute inset-0 overflow-hidden">
        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>
    </div>
    
    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        {/* Badges */}
        <div className="flex gap-2 mb-2">
             {cat.id === 'ff-id' && (
               <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow-lg shadow-red-500/30">
                 <Flame size={10} fill="currentColor" /> HOT
               </div>
             )}
             <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                INSTANT
             </div>
        </div>

        <h3 className="font-bold text-xl text-white font-heading tracking-wide uppercase leading-tight mb-1">{cat.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 mb-4">
            Get instant delivery to your account. 100% Safe & Trusted.
        </p>
        
        <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
           Top Up Now <ArrowRight size={16} />
        </div>
      </div>
    </div>

    {/* Floating Icon */}
    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12 group-hover:rotate-0">
        <Zap size={18} className="text-yellow-400" fill="currentColor" />
    </div>
  </a>
);

// Simulated "Live" component
const LiveActivity = () => {
    const [activities, setActivities] = useState<string[]>([]);

    useEffect(() => {
        const orders = getOrders().slice(0, 5);
        const templates = [
            "User ***89 purchased 115 Diamonds",
            "Player ***21 claimed Monthly Membership",
            "User ***99 purchased 50 Diamonds",
            "Player ***05 just redeemed 60 UC",
        ];
        const realData = orders.map(o => `Player ***${o.userUid.slice(-2)} bought ${o.packageDetails}`);
        setActivities([...realData, ...templates].slice(0, 5));

        const interval = setInterval(() => {
            setActivities(prev => {
                const [first, ...rest] = prev;
                return [...rest, first];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-white/5 py-2.5 overflow-hidden flex justify-center">
            <div className="flex items-center gap-3 px-4 py-1 bg-slate-950/50 rounded-full border border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE
                </div>
                <div className="h-5 overflow-hidden w-64 relative">
                     {activities.map((act, i) => (
                         <div key={i} className={`absolute w-full transition-all duration-500 text-xs font-medium text-gray-300 flex items-center gap-2 ${i === 0 ? 'top-0 opacity-100' : 'top-6 opacity-0'}`}>
                             <div className="w-4 h-4 rounded-full bg-brand-500/20 flex items-center justify-center">
                                <Zap size={10} className="text-brand-400" />
                             </div>
                             {act}
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marqueeText, setMarqueeText] = useState('');

  const slides = [
    { id: 1, image: 'https://wallpapers.com/images/hd/free-fire-4k-characters-collage-v121510l8s8m2k5e.jpg', title: 'Top Up & Win', subtitle: 'Get 10% Bonus on First Deposit' },
    { id: 2, image: 'https://wallpapers.com/images/hd/pubg-mobile-4k-3840-x-2160-u281656877-y0p7q8m0j8k9l1n2.jpg', title: 'Level Up Pass', subtitle: 'Instant Delivery Guaranteed' },
    { id: 3, image: 'https://wallpapers.com/images/hd/cool-gaming-setup-4k-8j3k4l5m6n7o8p9.jpg', title: 'Elite Pass', subtitle: 'Pre-order Now Available' },
  ];

  useEffect(() => {
    setMarqueeText(getSettings().marqueeNotice);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const groups = {
    'FreeFire': CATEGORIES.filter(c => c.group === 'FreeFire'),
    'PUBG': CATEGORIES.filter(c => c.group === 'PUBG'),
    'Subscription': CATEGORIES.filter(c => c.group === 'Subscription'),
  };

  return (
    <div className="pb-20">
      {/* Marquee */}
      <div className="bg-brand-900 text-white py-1.5 overflow-hidden relative whitespace-nowrap border-b border-white/10 z-20">
         <div className="animate-marquee inline-block px-4 text-xs font-bold font-mono tracking-widest uppercase">
           {marqueeText}
         </div>
      </div>

      <LiveActivity />
      
      {/* Hero Slider */}
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Image with subtle zoom animation (Ken Burns) */}
            <img 
                src={slide.image} 
                alt={slide.title} 
                className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 z-20">
              <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="inline-flex items-center gap-2 bg-brand-600/20 backdrop-blur-md border border-brand-500/50 text-brand-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                    <Star size={12} fill="currentColor"/> Feature Event
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black font-heading text-white mb-6 leading-none drop-shadow-2xl uppercase italic">
                    {slide.title}
                  </h2>
                  <p className="text-gray-300 text-lg md:text-2xl font-medium border-l-4 border-brand-500 pl-6 mb-8 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <a href="#/topup/ff-id" className="group relative inline-flex items-center gap-3 bg-white text-brand-950 px-8 py-4 rounded-xl font-black font-heading text-xl uppercase tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                      Order Now
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </a>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'bg-brand-500 w-16' : 'bg-white/20 w-8 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges - Floating overlap */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">
        <div className="grid grid-cols-3 gap-px bg-slate-800/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-1">
           {[
               { icon: Shield, title: "Trusted Platform", desc: "100% Safe Delivery", color: "text-blue-400", bg: "bg-blue-500/10" },
               { icon: Zap, title: "Instant TopUp", desc: "30s - 10m Delivery", color: "text-yellow-400", bg: "bg-yellow-500/10" },
               { icon: Users, title: "24/7 Support", desc: "Always Online", color: "text-green-400", bg: "bg-green-500/10" }
           ].map((badge, idx) => (
               <div key={idx} className="bg-slate-900/80 p-6 flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors rounded-2xl">
                   <div className={`${badge.bg} p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                       <badge.icon size={28} className={badge.color} />
                   </div>
                   <div className="text-white font-bold font-heading text-lg">{badge.title}</div>
                   <div className="text-xs text-gray-500 mt-1">{badge.desc}</div>
               </div>
           ))}
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 mt-20 space-y-24">
        
        {/* Free Fire */}
        <section>
          <div className="flex items-end justify-between mb-10">
             <div>
                 <div className="text-brand-500 font-bold tracking-widest text-sm uppercase mb-2">Popular Games</div>
                 <h2 className="text-4xl md:text-5xl font-black font-heading text-white uppercase italic">Free Fire <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Max</span></h2>
             </div>
             <a href="#/all" className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                View All Games <ChevronRight size={16} />
             </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {groups['FreeFire'].map(cat => <Card key={cat.id} cat={cat} />)}
          </div>
        </section>

        {/* PUBG */}
        <section>
          <div className="flex items-end gap-6 mb-10">
             <div>
                 <div className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-2">Battle Royale</div>
                 <h2 className="text-4xl md:text-5xl font-black font-heading text-white uppercase italic">PUBG <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Mobile</span></h2>
             </div>
             <div className="h-px flex-1 bg-gradient-to-r from-blue-900/50 to-transparent mb-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {groups['PUBG'].map(cat => <Card key={cat.id} cat={cat} />)}
          </div>
        </section>

        {/* Stats */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { label: "Happy Gamers", val: "15K+", icon: Users },
                    { label: "Orders Completed", val: "85K+", icon: Trophy },
                    { label: "Avg Delivery", val: "2 Min", icon: Zap },
                    { label: "Support", val: "24/7", icon: Shield },
                ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="text-gray-500 mb-2"><stat.icon size={24}/></div>
                        <div className="text-3xl md:text-4xl font-black text-white font-heading">{stat.val}</div>
                        <div className="text-sm text-brand-400 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Premium */}
        <section>
          <div className="flex items-center gap-4 mb-10">
             <h2 className="text-3xl font-black font-heading text-white uppercase italic">Subscriptions</h2>
             <div className="h-px flex-1 bg-white/10"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {groups['Subscription'].map(cat => <Card key={cat.id} cat={cat} />)}
          </div>
        </section>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;