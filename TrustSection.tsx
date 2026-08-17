import React from 'react';
import { ShieldCheck, BadgeDollarSign, Globe, Wrench, Truck, Headset } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      color: 'before:bg-emerald-500',
      bg: 'bg-emerald-50',
      title: '১০০% আসল বীজ',
      desc: 'মাঠ পর্যায়ে পরীক্ষিত, উচ্চ অংকুরোদগম হারের নিশ্চয়তা।'
    },
    {
      icon: <BadgeDollarSign className="w-5 h-5 text-amber-600" />,
      color: 'before:bg-amber-500',
      bg: 'bg-amber-50',
      title: 'ন্যায্য মূল্য',
      desc: 'সেরা মানের বীজ সাশ্রয়ী মূল্যে আপনার দোরগোড়ায়।'
    },
    {
      icon: <Globe className="w-5 h-5 text-sky-600" />,
      color: 'before:bg-sky-500',
      bg: 'bg-sky-50',
      title: 'রেয়ার কালেকশন',
      desc: 'দেশি-বিদেশি বিরল বীজের বিশাল সংগ্রহ।'
    },
    {
      icon: <Wrench className="w-5 h-5 text-violet-600" />,
      color: 'before:bg-violet-500',
      bg: 'bg-violet-50',
      title: 'আধুনিক সরঞ্জাম',
      desc: 'চাষাবাদের ইনোভেটিভ টুলস ও সমাধান।'
    },
    {
      icon: <Truck className="w-5 h-5 text-rose-600" />,
      color: 'before:bg-rose-500',
      bg: 'bg-rose-50',
      title: 'দ্রুত ডেলিভারি',
      desc: 'সারা বাংলাদেশে দ্রুত ও নিরাপদ ডেলিভারি।'
    },
    {
      icon: <Headset className="w-5 h-5 text-teal-600" />,
      color: 'before:bg-teal-500',
      bg: 'bg-teal-50',
      title: 'কৃষি পরামর্শ',
      desc: 'অভিজ্ঞ কৃষিবিদদের কাছ থেকে যেকোনো সময় পরামর্শ।'
    }
  ];

  return (
    <section className="px-3 py-6 bg-white border-t border-gray-100 my-4" id="about">
      <div className="text-center mb-5">
        <p className="text-xs font-extrabold text-[#386221] uppercase tracking-wider mb-1">
          আমাদের বৈশিষ্ট্য
        </p>
        <h2 className="text-base sm:text-xl font-black text-[#1c3822] mb-1">
          কেন Seed Haven BD আপনার প্রথম পছন্দ?
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          আমাদের মূল লক্ষ্য শুধু বীজ বিক্রি করা নয়, বরং প্রতিটি কৃষকের অক্লান্ত পরিশ্রমের সঠিক মূল্য নিশ্চিত করে তাদের মুখে হাসি ফোটানো।
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden bg-white rounded-xl border border-gray-200 p-2.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${feat.color} before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1`}
          >
            <div className={`w-8 h-8 rounded-lg ${feat.bg} flex items-center justify-center mb-1.5`}>
              {feat.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-[#1c3822] mb-0.5 leading-snug">
                {feat.title}
              </h3>
              <p className="text-[10px] text-gray-500 leading-tight">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

