import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User as UserIcon, Loader2, Lock } from 'lucide-react';
import { Product, UserProfile, OrderDetails } from '../types';

interface AIChatWidgetProps {
  products: Product[];
  currentUser: UserProfile | null;
  orders?: OrderDetails[];
  onOpenAuth?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ products, currentUser, orders = [], onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user specific orders
  const userOrders = currentUser ? orders.filter(o => o.customerPhone === currentUser.phone || o.customerName === currentUser.name) : [];

  // Load chat history for the logged-in user
  useEffect(() => {
    if (currentUser && currentUser.phone) {
      const savedKey = `seedhaven_chat_${currentUser.phone}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default greeting if no history
    setMessages([
      {
        role: 'assistant',
        content: `আসসালামু আলাইকুম ${currentUser ? currentUser.name : ''}! 🌱 আমি বীজ হাব এআই সহকারী। আপনার কেনাকাটার ইতিহাস বিশ্লেষণ করে সেরা বীজ ও বাগান করার পরামর্শ দিতে আমি প্রস্তুত।`
      }
    ]);
  }, [currentUser]);

  // Save chat history per user
  useEffect(() => {
    if (currentUser && currentUser.phone && messages.length > 1) {
      const savedKey = `seedhaven_chat_${currentUser.phone}`;
      localStorage.setItem(savedKey, JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          customerName: currentUser.name,
          userOrders: userOrders.map(o => ({
            orderId: o.id,
            items: o.items.map(i => `${i.productName} (${i.quantity} pcs)`),
            total: o.totalAmount,
            date: o.createdAt
          })),
          productsContext: products.map(p => ({
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
            stockStatus: p.stockStatus
          }))
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'দুঃখিত, উত্তর পাওয়া যায়নি।' }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'নেটওয়ার্ক ত্রুটি! অনুগ্রহ করে আবার চেষ্টা করুন।' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#118137] to-emerald-500 hover:from-[#0d6b2c] hover:to-emerald-400 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center border-2 border-white/80 hover:scale-105"
          title="এআই এগ্রিকালচার ও সিড এক্সপার্ট"
        >
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Bot className="w-5 h-5 text-white drop-shadow-sm group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#118137] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold">বীজ হাব এআই সহকারী</h3>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {currentUser ? `${currentUser.name} (${currentUser.phone})` : 'লগইন প্রয়োজন'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!currentUser ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-slate-50">
              <div className="w-14 h-14 bg-emerald-100 text-[#118137] rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">লগইন করা আবশ্যক</h4>
              <p className="text-xs text-slate-500 mb-4">এআই চ্যাটবট ব্যবহার করতে এবং আপনার চ্যাট হিস্টোরি সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAuth) {
                    onOpenAuth();
                  } else {
                    const authBtn = document.getElementById('auth-login-btn') || document.querySelector('[aria-label="User"]') || document.querySelector('button.auth-trigger');
                    if (authBtn) (authBtn as HTMLElement).click();
                  }
                }}
                className="bg-[#118137] hover:bg-[#0d6b2c] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                লগইন / সাইন আপ করুন
              </button>
            </div>
          ) : (
            <>
              {/* Shortcut Suggestions Bar */}
              <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setInput('সবচেয়ে বেশি বিক্রি হওয়া বীজ ও পণ্যগুলো সম্পর্কে বলুন।');
                  }}
                  className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-100 text-[#118137] text-[11px] font-bold rounded-lg border border-emerald-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                >
                  🔥 সবচেয়ে বেশি বিক্রি হওয়া
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput('চলমান গরম অফার এবং ডিসকাউন্ট সম্পর্কে বলুন।');
                  }}
                  className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-100 text-[#118137] text-[11px] font-bold rounded-lg border border-emerald-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                >
                  🏷️ গরম অফার
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-[#118137]/10 flex items-center justify-center shrink-0 border border-[#118137]/20 text-[#118137]">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                        m.role === 'user'
                          ? 'bg-[#118137] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {m.content}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2.5 items-center">
                    <div className="w-7 h-7 rounded-full bg-[#118137]/10 flex items-center justify-center shrink-0 text-[#118137]">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#118137]" />
                      <span>চিন্তা করছি...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="পণ্য বা বীজ সম্পর্কে কিছু জানতে চান..."
                  className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-hidden focus:border-[#118137] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-[#118137] hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
