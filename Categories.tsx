import React from 'react';
import { CATEGORIES } from '../data/fallbackData';
import { Category } from '../types';

interface CategoriesProps {
  categories?: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  isLoading?: boolean;
}

export const CategoriesSkeleton: React.FC = () => {
  return (
    <section className="px-3 pt-2 pb-1" id="categories">
      <div className="bg-white rounded-xl border border-gray-200/70 shadow-2xs p-2.5 animate-pulse">
        <div className="grid grid-cols-5 gap-1 divide-x divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center p-1.5 space-y-2">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 rounded-full" />
              <div className="w-10 h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Categories: React.FC<CategoriesProps> = ({
  categories = CATEGORIES,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}) => {
  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  const list = categories && categories.length ? categories : CATEGORIES;

  return (
    <section className="px-3 pt-2 pb-1" id="categories">
      <div className="bg-white rounded-xl border border-gray-200/70 shadow-2xs p-2.5">
        <div className="grid grid-cols-5 gap-1 divide-x divide-gray-100">
          {list.map((cat: Category) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-50/80 text-emerald-800 font-bold'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {/* Flat Vector Icon / Image / Emoji */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center mb-1 transition-transform group-hover:scale-110">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to emoji if icon image fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span
                    className="text-2xl sm:text-3xl"
                    style={{ display: cat.image ? 'none' : 'block' }}
                  >
                    {cat.iconEmoji}
                  </span>
                </div>

                {/* Text Label */}
                <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight text-gray-800 max-w-[70px] sm:max-w-none">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};




