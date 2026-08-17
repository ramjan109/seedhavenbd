import React, { useState, useEffect } from 'react';
import { Truck, PlayCircle, Search, X, Check, ArrowRight, Package } from 'lucide-react';

interface QuickActionsBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenSearch?: () => void;
  onOpenTracker?: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  searchQuery = '',
  onSearchChange,
  onOpenSearch,
  onOpenTracker,
}) => {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(Boolean(searchQuery));

  useEffect(() => {
    if (searchQuery) {
      setIsSearchExpanded(true);
    }
  }, [searchQuery]);

  const handleStartSearch = () => {
    setIsSearchExpanded(true);
    if (onOpenSearch) onOpenSearch();
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    if (onSearchChange) onSearchChange('');
  };

  return (
    <>
      <div className="px-3 pt-3 pb-1">
        {isSearchExpanded ? (
          /* Expanded Inline Search Bar occupying the full row */
          <div className="relative flex items-center w-full animate-in fade-in duration-200">
            <Search size={16} className="absolute left-3 text-[#386221] pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="বীজের নাম বা ক্যাটাগরি অনুসন্ধান করুন..."
              className="w-full pl-9 pr-20 py-2 bg-white border border-[#386221]/50 rounded-full text-xs text-[#1c3822] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5019] shadow-xs font-medium"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange && onSearchChange('')}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                  title="ক্লিয়ার করুন"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseSearch}
                className="bg-[#2b5019] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-[#1c3822] transition-colors cursor-pointer shadow-2xs"
              >
                <span>বন্ধ</span>
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          /* Standard Quick Action Buttons Grid (4 buttons) */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Order Tracker Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTracker) onOpenTracker();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
            >
              <Truck size={14} className="text-[#386221]" />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            {/* Delivery Charges Button */}
            <button
              type="button"
              onClick={() => setShowDeliveryModal(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Package size={14} className="text-[#386221]" />
              <span>চার্জ দেখুন</span>
            </button>

            {/* Order Rules Button */}
            <button
              type="button"
              onClick={() => setShowRulesModal(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            >
              <PlayCircle size={14} className="text-[#386221]" />
              <span>অর্ডার নিয়ম</span>
            </button>

            {/* Search Button (Triggers Expanded Inline Search) */}
            <button
              type="button"
              onClick={handleStartSearch}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-full border border-[#386221]/30 bg-[#f4f7f0] text-xs font-bold text-[#1c3822] hover:bg-[#e8efe0] transition-colors shadow-2xs cursor-pointer"
            >
              <Search size={14} className="text-[#386221]" />
              <span>পণ্য খুঁজুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Delivery Charge Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowDeliveryModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3 text-[#1c3822]">
              <Truck size={22} className="text-[#386221]" />
              <h3 className="font-extrabold text-base">ডেলিভারি চার্জ তালিকা</h3>
            </div>

            <div className="space-y-2 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-3">
              <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                <span>২০০ টাকার নিচে অর্ডার:</span>
                <span className="font-bold text-[#1c3822]">৳ ১২০</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                <span>২০০ - ৩৯৯ টাকা অর্ডার:</span>
                <span className="font-bold text-[#1c3822]">৳ ৭০</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                <span>৪০০ - ৫৯৯ টাকা অর্ডার:</span>
                <span className="font-bold text-[#1c3822]">৳ ৫০</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span>৬০০+ টাকার উপরে অর্ডার:</span>
                <span className="font-bold text-emerald-800">🎉 ফ্রি ডেলিভারি!</span>
              </div>
            </div>

            <button
              onClick={() => setShowDeliveryModal(false)}
              className="w-full mt-4 bg-[#2b5019] text-white py-2 rounded-xl text-xs font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Order Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3 text-[#1c3822]">
              <PlayCircle size={22} className="text-[#386221]" />
              <h3 className="font-extrabold text-base">কীভাবে অর্ডার করবেন?</h3>
            </div>

            <div className="space-y-2 text-xs text-gray-700 border-t border-gray-100 pt-3">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#e5eed5] text-[#1c3822] flex items-center justify-center font-bold shrink-0">১</span>
                <span>পছন্দের বীজ নির্বাচন করে "কার্টে যুক্ত করুন" বোতামে চাপুন।</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#e5eed5] text-[#1c3822] flex items-center justify-center font-bold shrink-0">২</span>
                <span>কার্ট ওপেন করে "অর্ডার সম্পন্ন করুন" এ ক্লিক করুন।</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#e5eed5] text-[#1c3822] flex items-center justify-center font-bold shrink-0">৩</span>
                <span>আপনার নাম, মোবাইল নম্বর ও সম্পূর্ণ ঠিকানা প্রদান করে ক্যাশ অন ডেলিভারিতে কনফার্ম করুন।</span>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full mt-4 bg-[#2b5019] text-white py-2 rounded-xl text-xs font-bold"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
