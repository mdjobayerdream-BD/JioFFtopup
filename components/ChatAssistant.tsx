import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2, Sparkles, Loader2, User, Trash2 } from 'lucide-react';
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
    const handleUserUpdate = () => {
        const updatedUser = getCurrentUser();
        if (updatedUser?.uid !== currentUser?.uid) {
            setCurrentUser(updatedUser);
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
    
    // Direct access to API_KEY as per guidelines
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'model', text: "Support Assistant is currently offline. Please contact us via WhatsApp." }]);
      setInput('');
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        if (!chatRef.current) {
             const userContext = currentUser 
                ? `The user's name is '${currentUser.name}' (UID: ${currentUser.uid}) with a balance of ${currentUser.balance} BDT.` 
                : "The user is browsing as a guest.";

             const ai = new GoogleGenAI({ apiKey });
             chatRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `You are the AI Assistant for 'Jio TopUp Store', a premier Free Fire and PUBG top-up platform in Bangladesh. 
                    ${userContext}
                    Guidelines:
                    - Only answer questions related to Free Fire, PUBG, game top-ups, pricing, and Jio Store support.
                    - If asked about other games or general topics, politely pivot back to gaming or Jio Store.
                    - Maintain a friendly, professional, and slightly enthusiastic 'gamer' tone.
                    - Use Bengali or English based on the user's language.
                    - Keep responses concise (under 3 sentences where possible).`,
                }
             });
        }

        const result = await chatRef.current.sendMessage({ message: userMsg });
        const responseText = result.text || "I'm having trouble connecting to the game servers. Please try again!";
        
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Network delay detected. Let's try that again in a moment." }]);
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
        aria-label="Toggle Chat"
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 duration-300 group ${isOpen ? 'bg-slate-700 text-gray-400 rotate-90' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/40'}`}
      >
        {isOpen ? <X size={24} /> : (
            <div className="relative">
                <Sparkles size={24} className="animate-pulse opacity-100 group-hover:opacity-0 transition-opacity" />
                <Bot size={24} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0" />
            </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[550px] max-h-[70vh] backdrop-blur-xl">
           {/* Header */}
           <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-violet-900 to-slate-900">
               <div className="flex items-center gap-3">
                   <div className="relative">
                       <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 rounded-lg shadow-lg">
                           <Bot size={20} className="text-white" />
                       </div>
                       <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-900"></span>
                        </span>
                   </div>
                   <div>
                       <h3 className="text-white font-bold text-sm font-heading tracking-wide">Jio Assistant</h3>
                       <p className="text-[10px] text-violet-200">
                           {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Ready to help'}
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
                           <Bot size={40} className="text-violet-500" />
                           <Sparkles size={20} className="text-yellow-400 absolute top-2 right-2 animate-pulse" />
                       </div>
                       <div className="space-y-1">
                           <p className="text-white font-bold text-lg">Hello Player!</p>
                           <p className="text-xs max-w-[200px] mx-auto text-gray-400">
                               Ask me about diamond packages, current offers, or top-up methods.
                           </p>
                       </div>
                   </div>
               )}
               {messages.map((msg, idx) => (
                   <div key={idx} className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                               <Bot size={14} className="text-violet-400" />
                           </div>
                       )}
                       <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md leading-relaxed ${
                           msg.role === 'user' 
                           ? 'bg-violet-600 text-white rounded-br-none' 
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
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={14} className="text-violet-400" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700 flex items-center">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
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
                      placeholder="Type your message..." 
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all placeholder-gray-500"
                   />
                   <button 
                      type="submit" 
                      disabled={loading || !input.trim()}
                      className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-violet-500/30 active:scale-95 flex items-center justify-center"
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