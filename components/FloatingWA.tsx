import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWA: React.FC = () => {
  const phoneNumber = "62895803463032";
  const message = "Halo Kak Hengki, saya melihat portfolio Anda dan tertarik untuk berdiskusi/kerjasama.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Chat Sekarang!
        {/* Little triangle arrow */}
        <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white rotate-45"></span>
      </span>
      
      <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg shadow-green-500/30 hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30"></span>
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </div>
    </a>
  );
};

export default FloatingWA;