import React, { useState } from 'react';
import { Gift, Percent, Copy, Check } from 'lucide-react';

interface PromoSectionProps {
  title?: string;
  subtext?: string;
  buttonText?: string;
  couponCode?: string;
  onCopyCoupon?: (code: string) => void;
}

export const PromoSection: React.FC<PromoSectionProps> = ({ title, subtext, buttonText, couponCode, onCopyCoupon }) => {
  const [copied, setCopied] = useState(false);
  const code = (couponCode || 'SEED10').toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopyCoupon) onCopyCoupon(code);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="px-3 my-4">
      <div className="bg-gradient-to-r from-[#edf2dc] via-[#e5eed5] to-[#f2f6e9] rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-[#dce4c7] relative overflow-hidden shadow-2xs">
        
        {/* Left Gift Box Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#2b5019] text-white flex items-center justify-center shadow-2xs">
          <Gift size={20} className="text-amber-300" />
        </div>

        {/* Center Text & Coupon Code */}
        <div className="text-center space-y-0.5 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#386221] uppercase tracking-wider block truncate">
            {subtext || 'নতুন গ্রাহকদের জন্য বিশেষ কুপন'}
          </span>

          <h3 className="text-sm sm:text-base font-black text-[#1c3822] tracking-tight truncate">
            {title || '১০% ডিসকাউন্ট পেতে ব্যবহার করুন'}
          </h3>

          <div className="pt-0.5 flex items-center justify-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-700">কুপন কোড:</span>
            <button
              onClick={handleCopy}
              className="bg-[#2b5019] hover:bg-[#1c3822] text-white font-extrabold text-xs px-2.5 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
              title="কপি করতে ক্লিক করুন"
            >
              <span>{code}</span>
              {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Right Percent Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-2xs">
          <Percent size={20} />
        </div>

      </div>
    </section>
  );
};

