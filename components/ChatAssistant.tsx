import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2, Sparkles, Loader2, RefreshCcw, User, Trash2 } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { getCurrentUser } from '../mockApi';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  
  // Track user for context
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    // Listen for login/logout to update chat context
    const handleUserUpdate = () => {
        const updatedUser = getCurrentUser();
        if (updatedUser?.uid !== currentUser?.uid) {
            setCurrentUser(updatedUser);
            // Reset chat on user change to apply new system prompt
            chatRef.current = null;
            setMessages([]);
        }
    };
    window.addEventListener('user_data_update', handleUserUpdate);
    return () => window.removeEventListener('user_data_update', handleUserUpdate);
  }, [currentUser]);

  const toggleChat = () => setIsOpen(!isOpen);

  const resetChat = () => {
    setMessages([]);
    chatRef.current = null;
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        if (!chatRef.current) {
             const userContext = currentUser 
                ? `You are talking to a registered player named '${currentUser.name}' (UID: ${currentUser.uid}). Balance: ${currentUser.balance} BDT.` 
                : "You are talking to a guest user who hasn't logged in yet.";

             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
             chatRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `You are a specialized Free Fire assistant for 'Jio TopUp Store'. 
                    ${userContext}
                    Answer ONLY about Free Fire related info, game mechanics, characters, weapons, and store support (top-up, pricing). 
                    If the user asks unrelated questions, politely decline. 
                    Keep answers short, engaging, and helpful. Use emojis occasionally.`,
                }
             });
        }

        const result = await chatRef.current.sendMessage({ message: userMsg });
        const responseText = result.text || "I couldn't generate a response. Please try again.";
        
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again later." }]);
        // Reset chat ref on error to force reconnection next time
        chatRef.current = null;
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={toggleChat}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 duration-300 group ${isOpen ? 'bg-slate-700 text-gray-400 rotate-90' : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-brand-500/40'}`}
      >
        {isOpen ? <X size={24} /> : (
            <>
                <Sparkles size={24} className="animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity" />
                <Bot size={24} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[550px] max-h-[70vh] backdrop-blur-xl">
           {/* Header */}
           <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-brand-900 to-slate-900">
               <div className="flex items-center gap-3">
                   <div className="relative">
                       <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-lg shadow-lg">
                           <Bot size={20} className="text-white" />
                       </div>
                       <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-900"></span>
                        </span>
                   </div>
                   <div>
                       <h3 className="text-white font-bold text-sm font-heading tracking-wide">Jio Assistant</h3>
                       <p className="text-[10px] text-brand-200">
                           {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'How can I help?'}
                       </p>
                   </div>
               </div>
               <div className="flex items-center gap-1">
                 <button onClick={resetChat} className="text-gray-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Clear Chat">
                    <Trash2 size={16} />
                 </button>
                 <button onClick={toggleChat} className="text-gray-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Minimize2 size={18} />
                 </button>
               </div>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 scroll-smooth" ref={scrollRef}>
               {messages.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-5 opacity-80 animate-in fade-in zoom-in duration-500">
                       <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center relative">
                           <Bot size={40} className="text-brand-500" />
                           <Sparkles size={20} className="text-yellow-400 absolute top-2 right-2 animate-pulse" />
                       </div>
                       <div className="space-y-1">
                           <p className="text-white font-bold text-lg">Hello Player!</p>
                           <p className="text-xs max-w-[200px] mx-auto text-gray-400">
                               Ask me about diamond packages, game characters, or check your account status.
                           </p>
                       </div>
                       <div className="flex flex-wrap gap-2 justify-center w-full px-4">
                           <button onClick={() => setInput("Best top up offer?")} className="bg-slate-800/80 border border-slate-700 text-xs px-3 py-1.5 rounded-full hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all">🔥 Best Offers</button>
                           <button onClick={() => setInput("How to deposit?")} className="bg-slate-800/80 border border-slate-700 text-xs px-3 py-1.5 rounded-full hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all">💰 Deposit Help</button>
                       </div>
                   </div>
               )}
               {messages.map((msg, idx) => (
                   <div key={idx} className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                               <Bot size={14} className="text-brand-400" />
                           </div>
                       )}
                       <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md leading-relaxed ${
                           msg.role === 'user' 
                           ? 'bg-brand-600 text-white rounded-br-none' 
                           : 'bg-slate-800 text-gray-200 rounded-bl-none border border-slate-700'
                       }`}>
                           {msg.text}
                       </div>
                       {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={14} className="text-gray-300" />
                            </div>
                       )}
                   </div>
               ))}
               {loading && (
                   <div className="flex gap-3 justify-start animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={14} className="text-brand-400" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700 flex items-center">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                   </div>
               )}
           </div>

           {/* Input */}
           <div className="p-3 bg-slate-800 border-t border-slate-700">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                 className="flex gap-2 items-center"
               >
                   <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about Free Fire..." 
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder-gray-500"
                   />
                   <button 
                      type="submit" 
                      disabled={loading || !input.trim()}
                      className="bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-brand-500/30 active:scale-95 flex items-center justify-center"
                   >
                       {loading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                   </button>
               </form>
           </div>
        </div>
      )}
    </>
  );
};
export default ChatAssistant;