import React, { useState, useEffect } from 'react';
import { BANNER_IMAGE } from '../data/fallbackData';
import { Banner } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroProps {
  banners?: Banner[];
}

export const Hero: React.FC<HeroProps> = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only active valid banners with images
  const validBanners = banners.filter(b => b.image && b.active !== false);

  // Auto-slide effect if multiple banners
  useEffect(() => {
    if (validBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [validBanners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validBanners.length) % validBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validBanners.length);
  };

  const handleButtonClick = (link?: string) => {
    if (!link) {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else if (link.startsWith('#')) {
      const targetId = link.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback single image if no banners configured in Firestore
  if (!validBanners.length) {
    return (
      <section className="bg-[#f9faef] pt-3 pb-2 px-3">
        <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-200/80 bg-white">
          <img
            src={BANNER_IMAGE}
            alt="Seed Haven BD Banner"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[260px] sm:max-h-[380px] object-cover block"
          />
        </div>
      </section>
    );
  }

  const currentBanner = validBanners[currentIndex] || validBanners[0];

  return (
    <section className="bg-[#f9faef] pt-3 pb-2 px-3">
      <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-200/80 bg-slate-900 group">
        {/* Banner Image Container */}
        <div className="relative w-full overflow-hidden bg-slate-950">
          <img
            key={currentBanner.id || currentIndex}
            src={currentBanner.image}
            alt={currentBanner.title || 'Seed Haven Banner'}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[260px] sm:max-h-[380px] object-cover transition-all duration-500 block"
          />

          {/* Overlay gradient for text readability if title or subtitle exists */}
          {(currentBanner.title || currentBanner.subtitle) && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex flex-col justify-end p-3.5 sm:p-5 text-white">
              {currentBanner.title && (
                <h2 className="text-sm sm:text-lg font-black text-white drop-shadow-md line-clamp-1 leading-snug">
                  {currentBanner.title}
                </h2>
              )}
              {currentBanner.subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-200 opacity-90 line-clamp-1 mt-0.5 drop-shadow-xs">
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.buttonText && (
                <div className="mt-2.5">
                  <button
                    onClick={() => handleButtonClick(currentBanner.buttonLink)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#49a845] hover:bg-[#3b8c38] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>{currentBanner.buttonText}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Carousel Prev/Next Navigation Controls (Shown if >1 banner) */}
        {validBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>

            {/* Pagination Indicators / Dots */}
            <div className="absolute bottom-2 right-3 flex items-center gap-1 z-10">
              {validBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-5 bg-[#49a845]'
                      : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};






