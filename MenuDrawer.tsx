import React, { useState, useEffect } from 'react';
import {
  X,
  Home,
  Sprout,
  LayoutGrid,
  ShoppingCart,
  User,
  Phone,
  Heart,
  ChevronRight,
  Truck,
  ShieldCheck,
  FileText,
} from 'lucide-react';


interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onSelectCategory: (catId: string) => void;
  onOpenContact: (tab?: 'about' | 'contact') => void;
  onOpenPolicy?: (tab?: 'privacy' | 'terms' | 'refund' | 'shipping') => void;
  onOpenAdmin?: () => void;
  currentUser?: { name: string; phone: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onSelectCategory,
  onOpenContact,
  onOpenPolicy,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-[70%] sm:w-1/2 max-w-[320px] min-w-[240px] h-full bg-white flex flex-col justify-between overflow-y-auto shadow-2xl animate-slide-left border-r border-[#e3ebe0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header Section */}
          <div className="bg-[#f4f7f2] p-3 sm:p-4 flex items-center justify-between border-b border-[#e3ebe0]">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Logo Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl border border-emerald-100 flex items-center justify-center text-xl shadow-2xs shrink-0">
                🌱
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black text-[#1c3822] leading-tight truncate">
                  Seed Haven BD
                </h2>
                <p className="text-[10px] sm:text-xs font-semibold text-[#2b5019] flex items-center gap-0.5 truncate">
                  <span>ভালো বীজ</span>
                  <span>🍃</span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-xs transition-colors cursor-pointer shrink-0 ml-1"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* User Auth Section inside Menu Drawer */}
          <div className="p-3 bg-emerald-50/60 border-b border-emerald-100">
            {currentUser ? (
              <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-emerald-200 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUser.photoUrl ? (
                    <img
                      src={currentUser.photoUrl}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-300 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#118137] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {currentUser.name ? currentUser.name[0] : 'ব'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] font-semibold text-[#118137] truncate">
                      {currentUser.email || currentUser.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  title="লগআউট"
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full h-10 rounded-xl bg-[#118137] hover:bg-[#0d6b2c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <User size={16} />
                <span>লগইন / সাইন আপ করুন</span>
              </button>
            )}
          </div>

          {/* Menu Items List */}
          <div className="p-2.5 sm:p-3 space-y-1">
            {/* 1. হোম (Home - Active) */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onClose();
              }}
              className="w-full bg-[#f0f5ee] rounded-xl px-3 py-2.5 text-[#1c3822] font-bold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Home size={18} className="text-[#1c3822] fill-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#1c3822] truncate">হোম</span>
              </div>
              <ChevronRight size={16} className="text-[#1c3822] shrink-0" />
            </button>

            {/* 2. সব পণ্য */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onClose();
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full hover:bg-gray-50 rounded-xl px-3 py-2.5 text-gray-800 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sprout size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">সব পণ্য</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>

            {/* 3. ক্যাটাগরি */}
            <button
              onClick={() => {
                onClose();
                const element = document.getElementById('categories');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full hover:bg-gray-50 rounded-xl px-3 py-2.5 text-gray-800 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutGrid size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">ক্যাটাগরি</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>

            {/* 4. কার্ট */}
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="w-full hover:bg-gray-50 rounded-xl px-3 py-2.5 text-gray-800 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShoppingCart size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">কার্ট</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {cartCount > 0 && (
                  <span className="bg-[#1c3822] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>

            {/* উইশলিস্ট */}
            <button
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="w-full hover:bg-gray-50 rounded-xl px-3 py-2.5 text-gray-800 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Heart size={18} className="text-rose-500 fill-rose-500 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">উইশলিস্ট (Wishlist)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>



            {/* 5. আমাদের সম্পর্কে */}
            <button
              onClick={() => {
                onClose();
                onOpenContact('about');
              }}
              className="w-full hover:bg-[#f0f5ee] rounded-xl px-3 py-2.5 text-[#1c3822] font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <User size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">আমাদের সম্পর্কে</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>

            {/* 6. যোগাযোগ */}
            <button
              onClick={() => {
                onClose();
                onOpenContact('contact');
              }}
              className="w-full hover:bg-[#f0f5ee] rounded-xl px-3 py-2.5 text-[#1c3822] font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">যোগাযোগ</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>

            {/* 7. পলিসি ও শর্তাবলী */}
            <button
              onClick={() => {
                onClose();
                if (onOpenPolicy) onOpenPolicy('privacy');
              }}
              className="w-full hover:bg-[#f0f5ee] rounded-xl px-3 py-2.5 text-[#1c3822] font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">পলিসি ও শর্তাবলী</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1.5" />

            {/* 7. প্রিয় তালিকা */}
            <button
              onClick={() => {
                onClose();
              }}
              className="w-full hover:bg-gray-50 rounded-xl px-3 py-2.5 text-gray-800 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Heart size={18} className="text-[#1c3822] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#1c3822] truncate">প্রিয় তালিকা</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
