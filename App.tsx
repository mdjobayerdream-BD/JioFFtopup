
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
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    try {
        const u = getCurrentUser();
        setUser(u);
    } catch (e) {
        console.error("User load error", e);
    }
  };

  useEffect(() => {
    if (!window.location.hash) {
        window.location.hash = '#/';
        setCurrentHash('#/');
    }

    refreshUser();
    setIsLoading(false);
    
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
    const hash = currentHash.replace(/^#/, '') || '/';
    
    if (hash === '/login' && user) {
        window.location.hash = '#/profile';
    }
    
    if ((hash === '/profile' || hash === '/profile/addwallet') && !user && !isLoading) {
        window.location.hash = '#/login';
    }
  }, [currentHash, user, isLoading]);

  const getPage = () => {
    if (isLoading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

    const hash = currentHash.replace(/^#/, '') || '/';
    
    if (hash === '/' || hash === '') return <Home />;
    if (hash === '/login') return <Login onLogin={refreshUser} />;
    if (hash === '/profile') return user ? <Profile /> : <Login onLogin={refreshUser} />;
    if (hash === '/profile/addwallet') return user ? <AddWallet /> : <Login onLogin={refreshUser} />;
    if (hash.startsWith('/topup/')) return <TopUp />;
    if (hash === '/recent-orders') return <LiveOrders />;
    if (hash === '/admin') return <Admin />;
    
    return <Home />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gaming-dark text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
        <Navbar user={user} onLogout={() => setUser(null)} />
        
        <main className="flex-grow relative z-0 pt-16">
          {getPage()}
        </main>

        <Footer />
        
        <ChatAssistant />

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
