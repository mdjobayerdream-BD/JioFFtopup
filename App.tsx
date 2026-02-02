import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TopUp from './pages/TopUp';
import AddWallet from './pages/AddWallet';
import Admin from './pages/Admin';
import LiveOrders from './pages/LiveOrders';
import ChatAssistant from './components/ChatAssistant';
import { getCurrentUser } from './mockApi';
import { User } from './types';
import { MessageCircle } from 'lucide-react';
import { SUPPORT_PHONE } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    refreshUser();
    
    // Listen for global data updates (balance changes, claims, etc)
    const handleDataUpdate = () => {
      refreshUser();
    };
    
    window.addEventListener('user_data_update', handleDataUpdate);
    return () => window.removeEventListener('user_data_update', handleDataUpdate);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Redirect logic for Login page
    const hash = currentHash.replace(/^#/, '') || '/';
    if (hash === '/login' && user) {
        window.location.hash = '#/profile';
    }
  }, [currentHash, user]);

  const getPage = () => {
    const hash = currentHash.replace(/^#/, '') || '/';
    
    if (hash === '/' || hash === '') return <Home />;
    if (hash === '/login') return user ? null : <Login onLogin={refreshUser} />;
    if (hash === '/profile') return <Profile />;
    if (hash === '/profile/addwallet') return <AddWallet />;
    if (hash.startsWith('/topup/')) return <TopUp />;
    if (hash === '/recent-orders') return <LiveOrders />;
    if (hash === '/admin') return <Admin />;
    
    return <Home />; // Fallback
  };

  return (
    <div className="min-h-screen flex flex-col bg-gaming-dark text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
        <Navbar user={user} onLogout={() => setUser(null)} />
        
        <main className="flex-grow relative z-0">
          {getPage()}
        </main>

        <Footer />
        
        <ChatAssistant />

        {/* Floating WhatsApp Button */}
        <a 
          href={`https://wa.me/${SUPPORT_PHONE}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <MessageCircle size={28} fill="white" className="text-green-500" />
        </a>
    </div>
  );
}

export default App;