import React, { useState } from 'react';
import { X, ShoppingBag, Star, CheckCircle, Sprout, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/fallbackData';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectCategory?: (catId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectCategory,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const categoryObj = CATEGORIES.find((c) => c.id === product.category);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleHomeClick = () => {
    if (onSelectCategory) onSelectCategory('all');
    onClose();
  };

  const handleCategoryClick = () => {
    if (onSelectCategory && product.category) {
      onSelectCategory(product.category);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-[#e8eadf]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#063d24] border border-[#e0e4d7] flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Media Box */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#f7faec] to-[#eef6d7] p-8 flex flex-col items-center justify-center relative min-h-[260px]">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-white text-[#176b38] px-3 py-1 rounded-full text-xs font-bold border border-[#dce8ca] shadow-xs">
                {product.badge}
              </span>
            )}
            <div className="text-8xl select-none drop-shadow-lg my-auto">{product.imageEmoji}</div>
            <div className="mt-4 text-xs font-bold text-[#405649] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#dce8ca]">
              বীজ প্যাক: {product.packSize}
            </div>
          </div>

          {/* Right Details Box */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Breadcrumb Trail */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-3 select-none flex-wrap">
                <button
                  onClick={handleHomeClick}
                  className="hover:text-[#176b38] transition-colors cursor-pointer flex items-center gap-0.5"
                >
                  হোম
                </button>
                <ChevronRight size={11} className="text-gray-400 shrink-0" />
                <button
                  onClick={handleCategoryClick}
                  className="hover:text-[#176b38] transition-colors cursor-pointer"
                >
                  {categoryObj ? categoryObj.name : 'সকল পণ্য'}
                </button>
                <ChevronRight size={11} className="text-gray-400 shrink-0" />
                <span className="text-[#176b38] font-bold truncate max-w-[150px]">{product.name}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#176b38] uppercase tracking-wider mb-1">
                <CheckCircle size={14} />
                <span>মানসম্মত বীজ</span>
              </div>

              <h2 className="text-2xl font-black text-[#063d24] leading-tight mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#e69b1c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#6a776e]">
                  ৫.০ ({product.reviewsCount} টি কাস্টমার রিভিউ)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6 p-3 rounded-2xl bg-[#f7f9f2] border border-[#eaeee4]">
                <span className="text-3xl font-black text-[#176b38]">৳ {product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-[#8c988e] line-through">
                    ৳ {product.originalPrice}
                  </span>
                )}
                <span className="ml-auto text-xs font-bold text-[#063d24] bg-[#e4f1cb] px-2.5 py-1 rounded-md">
                  ইন স্টক (স্টক প্রস্তুত)
                </span>
              </div>

              <p className="text-sm text-[#405649] leading-relaxed mb-6">{product.description}</p>

              {/* Seed Spec Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs bg-[#fafcf5] p-3 rounded-xl border border-[#eaf0dc]">
                <div className="flex items-center gap-2 text-[#063d24]">
                  <Sprout size={16} className="text-[#176b38]" />
                  <div>
                    <span className="block font-semibold text-[#6a776e]">গজানোর সময়:</span>
                    <strong className="font-bold">{product.germinationDays}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#063d24]">
                  <Calendar size={16} className="text-[#176b38]" />
                  <div>
                    <span className="block font-semibold text-[#6a776e]">উপযুক্ত ঋতু:</span>
                    <strong className="font-bold">{product.season}</strong>
                  </div>
                </div>
              </div>

              {/* Planting Tip Box */}
              <div className="p-3.5 bg-[#f0f7e6] border border-[#d6e8be] rounded-xl text-xs text-[#204a2c] mb-6 flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-[#176b38] mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">রোপণ টিপস:</strong>
                  <span>{product.plantingTip}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add Action */}
            <div className="pt-4 border-t border-[#edf0e7] flex items-center gap-4">
              <div className="flex items-center border border-[#dce2d2] rounded-full p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full hover:bg-[#f2f6eb] text-[#063d24] font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-10 text-center font-extrabold text-sm text-[#063d24]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full hover:bg-[#f2f6eb] text-[#063d24] font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 bg-gradient-to-r from-[#176b38] to-[#063d24] hover:from-[#1b7a40] hover:to-[#084a2c] text-white py-3.5 px-6 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>কার্টে যোগ করুন (৳ {product.price * quantity})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
