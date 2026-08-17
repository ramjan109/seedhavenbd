import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, User, LogOut } from 'lucide-react';
import { StoreSettings } from '../lib/firestoreProducts';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu?: () => void;
  storeSettings?: StoreSettings;
  currentUser?: { name: string; phone: string; email?: string; photoUrl?: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenMenu,
  storeSettings,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-2xs">
      {/* Main Navigation Header */}
      <header className="px-3 py-3 flex items-center justify-between gap-2">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu size={22} className="text-[#1c3822]" />
          </button>

          {/* Brand Logo */}
          <a href="#" className="flex items-center">
            {storeSettings?.logo ? (
              <img
                src={storeSettings.logo}
                alt={storeSettings.name || 'Seed Haven BD'}
                className="h-8 sm:h-9 max-w-[150px] sm:max-w-[180px] object-contain"
              />
            ) : storeSettings?.name && storeSettings.name !== 'Seed Haven BD' ? (
              <span className="font-black text-xl sm:text-2xl tracking-tight text-[#16331b]">
                {storeSettings.name}
              </span>
            ) : (
              <div className="font-black text-xl sm:text-3xl tracking-tight">
                <span className="text-[#16331b]">Seed</span>
                <span className="text-[#72b01d]">Haven</span>
                <span className="text-[#16331b] ml-1.5">BD</span>
              </div>
            )}
          </a>
        </div>

        {/* Right Actions: User Profile Pill & Cart Icon */}
        <div className="flex items-center gap-2">


          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={22} className={`text-[#1c3822] transition-transform ${isAnimating ? 'scale-125' : ''}`} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#118137] text-white rounded-full text-[10px] font-black flex items-center justify-center px-1 transition-all duration-300 ${
                  isAnimating ? 'scale-150 bg-emerald-600 ring-4 ring-emerald-200 animate-bounce' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </div>
  );
};




