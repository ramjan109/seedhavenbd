import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/fallbackData';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" id="blogs">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#063d24]">🌱 বাগান ব্লগ ও গাইড টিপস</h2>
          <p className="text-sm text-[#6a776e] mt-1">বীজ রোপণ ও সঠিক যত্নের পরামর্শ জানুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-[#eaeee4] rounded-2xl overflow-hidden p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="h-40 rounded-xl bg-gradient-to-b from-[#f4f8eb] to-[#e8f2d5] flex items-center justify-center text-6xl mb-4 group-hover:scale-102 transition-transform">
                {post.imageEmoji}
              </div>

              <div className="flex items-center gap-3 text-xs text-[#6a776e] font-semibold mb-2">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {post.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#063d24] group-hover:text-[#176b38] transition-colors leading-snug mb-2">
                {post.title}
              </h3>

              <p className="text-xs text-[#526250] line-clamp-3 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            </div>

            <button
              onClick={() => setSelectedPost(post)}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#176b38] hover:text-[#063d24] transition-colors pt-2 border-t border-[#f0f3ea] cursor-pointer"
            >
              <span>সম্পূর্ণ নিবন্ধ পড়ুন</span>
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border border-[#e8eadf]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[#e0e4d7] flex items-center justify-center text-[#063d24] hover:bg-[#f0f4e8]"
            >
              <X size={18} />
            </button>

            <div className="text-5xl mb-3">{selectedPost.imageEmoji}</div>
            <span className="text-xs font-bold text-[#176b38] bg-[#e4f1cb] px-2.5 py-1 rounded-md">
              {selectedPost.category}
            </span>

            <h3 className="text-2xl font-black text-[#063d24] mt-2 mb-3">
              {selectedPost.title}
            </h3>

            <p className="text-xs text-[#6a776e] mb-4">
              প্রকাশের তারিখ: {selectedPost.date} | পড়ার সময়: {selectedPost.readTime}
            </p>

            <div className="space-y-3 text-sm text-[#405649] leading-relaxed border-t border-[#edf0e7] pt-4">
              <p>
                বীজ থেকে সুস্থ ও সবল চারা তৈরি করতে মাটি প্রস্তুতি সবচেয়ে গুরুত্বপূর্ণ ধাপ। দোআঁশ মাটির সাথে জৈব সার বা গোবর সার ভালো করে মিশিয়ে ঝুরঝুরে করে নিন।
              </p>
              <p>
                বীজ রোপণের পর হালকা আর্দ্রতা বজায় রাখুন, তবে অতিরিক্ত পানি নিষ্কাশনের ভালো ব্যবস্থা থাকতে হবে। সঠিক পরিমাণে আলো বাতাস ও যত্ন পেলে খুব দ্রুত বীজের অঙ্কুরোদ্গম ঘটবে।
              </p>
              <p className="bg-[#f0f7e6] p-3 rounded-xl border border-[#d6e8be] font-semibold text-xs text-[#063d24]">
                💡 পরামর্শ: যেকোনো বীজ সম্পর্কিত সমস্যায় আমাদের কল করুন অথবা ইনবক্স করুন।
              </p>
            </div>

            <button
              onClick={() => setSelectedPost(null)}
              className="mt-6 w-full bg-[#176b38] text-white py-3 rounded-full font-bold text-sm hover:bg-[#063d24]"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
