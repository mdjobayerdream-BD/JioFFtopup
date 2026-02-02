import React, { useState, useEffect } from 'react';
import { Menu, X, Wallet, User as UserIcon, LogOut, ShieldCheck, Zap, Download, Sparkles } from 'lucide-react';
import { User } from '../types';
import { logoutUser } from '../mockApi';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    onLogout();
    window.location.hash = '#/';
    setIsOpen(false);
  };

  const handleDownloadApp = () => {
    alert("Android App Download Started! (Demo)");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg py-1' : 'bg-transparent py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-brand-600 to-indigo-600 p-2 rounded-xl transform group-hover:rotate-6 transition-transform border border-white/10">
                  <Zap className="text-white fill-white" size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-heading text-white tracking-wider leading-none">JIO<span className="text-brand-400">STORE</span></span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Premium TopUp</span>
              </div>
            </a>
            
            <div className="hidden md:flex ml-12 items-center space-x-1">
              {['Home', 'Live Orders'].map((item) => (
                <a 
                  key={item}
                  href={item === 'Home' ? '#/' : '#/recent-orders'} 
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  {item}
                </a>
              ))}
              {user?.role === 'admin' && (
                  <a href="#/admin" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-red-500/10 transition-colors">
                    <ShieldCheck size={16} /> Admin
                  </a>
              )}
            </div>
          </div>
          
          {/* Desktop Right */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              <button 
                onClick={handleDownloadApp}
                className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-500/50 transition-all text-xs font-bold hover:bg-white/5"
              >
                <Download size={14} /> App
              </button>

              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-brand-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] group hover:shadow-brand-500/30 transition-shadow">
                    <Wallet size={16} className="text-brand-400 group-hover:animate-bounce" />
                    <span className="text-sm font-bold text-white font-mono">৳ {user.balance.toFixed(2)}</span>
                  </div>
                  
                  <div className="relative group">
                    <a href="#/profile" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                <UserIcon size={18} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                            <span className="text-[10px] text-gray-500">Player</span>
                        </div>
                    </a>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <a href="#/login" className="relative group overflow-hidden bg-brand-600 text-white px-8 py-2.5 rounded-xl font-bold font-heading uppercase tracking-wide transition-all hover:scale-105 shadow-lg shadow-brand-600/20">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                  Login
                </a>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800/50 inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none backdrop-blur-sm border border-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-white/10 backdrop-blur-xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-4 py-3 rounded-xl hover:bg-white/5 text-base font-bold">Home</a>
            <a href="#/recent-orders" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-4 py-3 rounded-xl hover:bg-white/5 text-base font-bold">Live Orders</a>
            
            <div className="my-4 border-t border-white/10"></div>

            {user ? (
              <div className="space-y-3">
                 <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-xl border border-white/5">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400">
                             <UserIcon size={20} />
                         </div>
                         <div>
                             <div className="text-white font-bold">{user.name}</div>
                             <div className="text-xs text-gray-500 font-mono">{user.uid}</div>
                         </div>
                     </div>
                     <div className="text-brand-400 font-bold font-mono">৳ {user.balance}</div>
                 </div>

                 <a href="#/profile" onClick={() => setIsOpen(false)} className="text-white block px-4 py-3 rounded-xl bg-brand-600/10 border border-brand-500/20 text-center font-bold">
                    View Profile
                 </a>

                 <button onClick={handleLogout} className="w-full text-left text-red-400 hover:text-red-300 block px-4 py-3 rounded-xl hover:bg-red-500/10 text-base font-bold flex items-center gap-2">
                   <LogOut size={18} /> Logout
                 </button>
              </div>
            ) : (
              <a href="#/login" onClick={() => setIsOpen(false)} className="text-center block w-full bg-brand-600 text-white px-4 py-3 rounded-xl text-base font-bold shadow-lg shadow-brand-600/20">
                  Login / Register
              </a>
            )}
            
            <button onClick={() => { handleDownloadApp(); setIsOpen(false); }} className="w-full text-center text-gray-500 text-xs py-4 flex items-center justify-center gap-2">
                <Download size={14} /> Download Android App
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;