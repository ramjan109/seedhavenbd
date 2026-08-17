import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { FooterSettings } from '../lib/firestoreProducts';

interface FooterProps {
  onSelectCategory?: (catId: string) => void;
  onOpenContact?: () => void;
  onOpenPolicy?: (tab?: 'privacy' | 'terms' | 'refund' | 'shipping') => void;
  settings?: FooterSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenPolicy }) => {
  if (settings && settings.footerEnabled === false) {
    return null;
  }

  const brandName = settings?.brandName || 'Seed Haven BD';
  const hotline = settings?.hotline || '09617443377';
  const whatsapp = settings?.whatsapp || '01410136900';
  const address = settings?.address || 'দেবীগঞ্জ, পঞ্চগড় | সারা দেশে ক্যাশ অন ডেলিভারি';
  const copyright = settings?.copyright || '© 2026 Seed Haven BD। সর্বস্বত্ব সংরক্ষিত।';

  const facebook = settings?.facebook;
  const tiktok = settings?.tiktok;
  const instagram = settings?.instagram;

  const hotlineClean = hotline.replace(/[^0-9+]/g, '');
  const whatsappClean = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = whatsappClean ? (whatsappClean.startsWith('88') ? `https://wa.me/${whatsappClean}` : `https://wa.me/88${whatsappClean}`) : '';

  return (
    <footer className="bg-[#72b01d] text-white py-5 border-t-2 border-[#5f9616] shadow-inner" id="contact">
      <div className="px-4 text-center space-y-3 max-w-xl mx-auto">
        {/* Brand & Hotline */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <span className="font-extrabold text-sm text-white">
            {brandName.includes('BD') ? (
              <>
                {brandName.replace('BD', '').trim()} <span className="text-yellow-200 font-black">BD</span>
              </>
            ) : (
              brandName
            )}
          </span>
          {hotline && (
            <>
              <span className="text-white/60">•</span>
              <a href={`tel:${hotlineClean}`} className="flex items-center gap-1 font-bold text-white hover:text-yellow-200 transition-colors">
                <Phone size={13} className="text-yellow-300" />
                <span>{hotline}</span>
              </a>
            </>
          )}
          {whatsapp && (
            <>
              <span className="text-white/60">•</span>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-white hover:text-yellow-200 transition-colors">
                <MessageCircle size={13} className="text-white" />
                <span>{whatsapp}</span>
              </a>
            </>
          )}
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          {facebook && (
            <a
              href={facebook.startsWith('http') ? facebook : `https://${facebook}`}
              target="_blank"
              rel="noreferrer"
              title="Facebook Page"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          )}

          {tiktok && (
            <a
              href={tiktok.startsWith('http') ? tiktok : `https://${tiktok}`}
              target="_blank"
              rel="noreferrer"
              title="TikTok Profile"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V9.01a6.34 6.34 0 0 0-3.5 1.01 6.33 6.33 0 1 0 10.18 5.06V9.22a8.17 8.17 0 0 0 4.88 1.6V7.37a4.85 4.85 0 0 1-1.45-.68z"/>
              </svg>
            </a>
          )}

          {instagram && (
            <a
              href={instagram.startsWith('http') ? instagram : `https://${instagram}`}
              target="_blank"
              rel="noreferrer"
              title="Instagram Profile"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#E4405F] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp Chat"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#25D366] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Short Address */}
        {address && (
          <div className="flex items-center justify-center gap-1 text-[11px] text-white/90 font-medium">
            <MapPin size={12} className="text-yellow-200 shrink-0" />
            <span>{address}</span>
          </div>
        )}

        {/* Policy Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-white/90 pt-1">
          <button
            onClick={() => onOpenPolicy?.('privacy')}
            className="hover:text-yellow-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            প্রাইভেসি পলিসি
          </button>
          <span className="text-white/40">•</span>
          <button
            onClick={() => onOpenPolicy?.('terms')}
            className="hover:text-yellow-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            শর্তাবলী
          </button>
          <span className="text-white/40">•</span>
          <button
            onClick={() => onOpenPolicy?.('refund')}
            className="hover:text-yellow-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            রিটার্ন ও রিফান্ড
          </button>
          <span className="text-white/40">•</span>
          <button
            onClick={() => onOpenPolicy?.('shipping')}
            className="hover:text-yellow-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            শিপিং পলিসি
          </button>
        </div>

        {/* Copyright */}
        {copyright && (
          <div className="text-[10px] text-white/80 border-t border-white/20 pt-2 text-center font-medium">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
};


