import React, { useState, useEffect } from 'react';
import { Menu, X, Wallet, User as UserIcon, LogOut, ShieldCheck, Zap, Download } from 'lucide-react';
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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center ${scrolled ? 'pt-4' : 'pt-6'}`}>
        <div className={`
          relative mx-4 w-full max-w-7xl rounded-2xl border border-white/5 
          transition-all duration-300 backdrop-blur-xl
          ${scrolled ? 'bg-slate-950/80 shadow-2xl py-2 px-4 shadow-violet-900/10' : 'bg-transparent border-transparent py-2 px-2'}
        `}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#/" className="flex items-center gap-3 group pl-2">
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-violet-500/20">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading text-white tracking-wide leading-none group-hover:text-violet-400 transition-colors">
                  JIO<span className="text-violet-500">STORE</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-[0.2em] uppercase">Gaming</span>
              </div>
            </a>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5">
              {['Home', 'Live Orders'].map((item) => (
                <a 
                  key={item}
                  href={item === 'Home' ? '#/' : '#/recent-orders'} 
                  className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {item}
                </a>
              ))}
              {user?.role === 'admin' && (
                  <a href="#/admin" className="px-5 py-2 rounded-full text-sm font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                    <ShieldCheck size={14} /> Admin
                  </a>
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4 pr-2">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download size={20} />
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)] flex items-center gap-2">
                    <Wallet size={16} className="text-violet-400" />
                    <span className="text-sm font-bold text-white font-mono">৳ {user.balance.toFixed(0)}</span>
                  </div>
                  
                  <div className="h-8 w-[1px] bg-white/10"></div>

                  <a href="#/profile" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[2px]">
                          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                              <UserIcon size={16} className="text-white" />
                          </div>
                      </div>
                  </a>
                  
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <a href="#/login" className="relative overflow-hidden bg-white text-slate-950 px-6 py-2.5 rounded-xl font-bold font-heading uppercase tracking-wider text-sm hover:scale-105 transition-transform">
                  Login
                </a>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl md:hidden pt-28 px-6 animate-in fade-in slide-in-from-bottom-10 duration-200">
          <div className="flex flex-col gap-4">
            <a href="#/" onClick={() => setIsOpen(false)} className="text-2xl font-heading font-bold text-white border-b border-white/5 pb-4">Home</a>
            <a href="#/recent-orders" onClick={() => setIsOpen(false)} className="text-2xl font-heading font-bold text-white border-b border-white/5 pb-4">Live Orders</a>
            
            {user ? (
              <div className="mt-4 space-y-4">
                 <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400">
                             <UserIcon size={20} />
                         </div>
                         <div>
                             <div className="text-white font-bold">{user.name}</div>
                             <div className="text-xs text-gray-500 font-mono">{user.uid}</div>
                         </div>
                     </div>
                     <div className="text-violet-400 font-bold font-mono">৳ {user.balance}</div>
                 </div>

                 <a href="#/profile" onClick={() => setIsOpen(false)} className="block w-full bg-violet-600 text-white text-center py-4 rounded-xl font-bold">
                    View Dashboard
                 </a>

                 <button onClick={handleLogout} className="w-full text-center text-red-400 py-4 font-bold">
                   Sign Out
                 </button>
              </div>
            ) : (
              <a href="#/login" onClick={() => setIsOpen(false)} className="mt-8 block w-full bg-white text-slate-950 text-center py-4 rounded-xl font-bold shadow-xl shadow-white/10">
                  Login / Register
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;