import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  onClose,
  duration = 2500
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#063d24] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-[#49a845]/60 backdrop-blur-xs">
        <CheckCircle2 size={18} className="text-[#49a845] shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 p-0.5 text-gray-300 hover:text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

