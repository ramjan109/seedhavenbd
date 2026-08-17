import React, { useState } from 'react';
import { Crown, Sparkles, Trophy, Medal, Award, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { LEADERBOARD_USERS } from '../data/fallbackData';

export const LeaderboardSection: React.FC = () => {
  const [showFullModal, setShowFullModal] = useState(false);

  return (
    <section className="px-3 py-4">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
        {/* Top Gold Bar accent */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-[#386221] to-amber-600" />

        {/* Section Header */}
        <div className="p-3 pb-2 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
              <Crown size={18} className="fill-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1c3822] leading-tight">
                সেরা কাস্টমার
              </h2>
              <p className="text-[10px] text-gray-500 font-medium">
                লাস্ট ৩০ দিনের লিডারবোর্ড
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-extrabold uppercase tracking-wider animate-pulse">
            <Sparkles size={10} /> Live
          </span>
        </div>

        {/* Leaderboard Ranks */}
        <div className="p-2.5 space-y-2">
          {LEADERBOARD_USERS.map((user) => {
            const isRank1 = user.rank === 1;
            const isRank2 = user.rank === 2;
            const isRank3 = user.rank === 3;

            return (
              <div
                key={user.rank}
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                  isRank1
                    ? 'border-yellow-300 bg-amber-50/60 shadow-2xs'
                    : isRank2
                    ? 'border-slate-200 bg-slate-50'
                    : isRank3
                    ? 'border-amber-200 bg-orange-50/30'
                    : 'border-gray-100 bg-white'
                }`}
              >
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    isRank1
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-2xs'
                      : isRank2
                      ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white'
                      : isRank3
                      ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isRank1 ? (
                    <Trophy size={14} />
                  ) : isRank2 ? (
                    <Medal size={14} />
                  ) : isRank3 ? (
                    <Award size={14} />
                  ) : (
                    <span>{user.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-300"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-gray-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1 font-semibold">
                    <span className="font-mono">{user.phone}</span>
                    <span>•</span>
                    <span>{user.location}</span>
                  </div>
                </div>

                {/* Amount & Orders */}
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-xs text-[#2b5019]">
                    ৳{user.totalAmount.toLocaleString('bn-BD')}
                  </div>
                  <div className="text-[9px] text-gray-400 font-semibold flex items-center justify-end gap-0.5">
                    <ShoppingBag size={9} />
                    <span>{user.ordersCount} অর্ডার</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Leaderboard CTA Button */}
          <button
            onClick={() => setShowFullModal(true)}
            className="mt-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2b5019] to-[#1c3822] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            <Crown size={14} className="text-amber-400" />
            <span>সম্পূর্ণ লিডারবোর্ড</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Full Leaderboard Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowFullModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3 text-[#1c3822]">
              <Crown size={22} className="text-amber-500" />
              <h3 className="font-black text-base">শীর্ষ কাস্টমার লিডারবোর্ড</h3>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_USERS.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-[#1c3822] w-4">#{user.rank}</span>
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs">{user.name}</div>
                      <div className="text-[10px] text-gray-500">{user.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xs text-[#2b5019]">৳{user.totalAmount}</div>
                    <div className="text-[10px] text-gray-400">{user.ordersCount}টি অর্ডার</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFullModal(false)}
              className="w-full mt-4 bg-[#2b5019] text-white py-2 rounded-xl text-xs font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
