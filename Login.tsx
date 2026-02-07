import React, { useState } from 'react';
import { loginUser } from '../mockApi';
import { Gamepad2, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim() || !password.trim()) {
      setError("UID and Password are required");
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      const result = loginUser(uid, password);
      
      if (result.success) {
        onLogin();
        setLoading(false);
        window.location.hash = '#/profile';
      } else {
        setLoading(false);
        setError(result.message || "Login failed");
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-900/50 text-brand-400 mb-4 ring-2 ring-brand-500/50">
            <Gamepad2 size={32} />
          </div>
          <h1 className="text-3xl font-bold font-heading text-white">Player Login</h1>
          <p className="text-gray-400 mt-2">Enter your ID and Password to start</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-300 mb-2">Player ID (UID)</label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-gray-600 font-mono text-lg"
              placeholder="e.g. 12345678"
              required
            />
          </div>

          <div>
            <label htmlFor="pass" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="********"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
            <p className="text-xs text-gray-500 mt-2">New user? Enter any password to register automatically.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>Let's Go <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;