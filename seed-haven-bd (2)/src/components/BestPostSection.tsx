import React from 'react';
import { Trophy, Heart, MessageCircle } from 'lucide-react';
import { BEST_POST } from '../data/fallbackData';

export const BestPostSection: React.FC = () => {
  return (
    <section className="px-3 mt-3">
      <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xs">
        {/* Banner Header */}
        <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 bg-amber-100/70 text-amber-900 text-[11px] font-bold uppercase tracking-wide">
          <span className="inline-flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-600" />
            <span>এই সপ্তাহের সেরা পোস্ট</span>
          </span>
        </div>

        {/* Post Card */}
        <div className="flex gap-3 p-3">
          {/* Post Image */}
          <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-amber-200">
            <img
              src={BEST_POST.postImage}
              alt="seed-haven-bd best post"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <img
                src={BEST_POST.avatar}
                alt={BEST_POST.author}
                className="w-5 h-5 rounded-full object-cover border border-amber-300"
              />
              <span className="text-xs font-bold text-gray-900 truncate">
                {BEST_POST.author}
              </span>
              <span className="text-[10px] text-gray-400">·</span>
              <span className="text-[10px] text-gray-500">{BEST_POST.timeAgo}</span>
            </div>

            <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
              {BEST_POST.content}
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-semibold">
              <span className="inline-flex items-center gap-1 text-rose-600">
                <Heart className="h-3 w-3 fill-rose-500" />
                <span>{BEST_POST.likes}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{BEST_POST.comments}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
