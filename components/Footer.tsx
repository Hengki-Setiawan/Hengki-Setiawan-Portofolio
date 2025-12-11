import React, { useState } from 'react';
import { Heart, Instagram, Linkedin, Github, Globe, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [clickCount, setClickCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const lastClickTime = React.useRef<number>(0);

  const handleLogoClick = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime.current;

    // Reset if more than 3 seconds between clicks
    if (timeDiff > 3000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }

    lastClickTime.current = now;

    // Show admin button after 5 clicks
    if (clickCount + 1 >= 5) {
      setShowAdmin(true);
      setTimeout(() => setShowAdmin(false), 10000); // Hide after 10 seconds
      setClickCount(0);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          alert('Email ini sudah terdaftar!');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-50 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">

        <div className="mb-6 flex flex-col items-center">
          <div
            onClick={handleLogoClick}
            className="mb-4 cursor-pointer hover:scale-110 transition-transform duration-300 group"
          >
            <img src="/images/logo-neco.png" alt="Logo" className="w-16 h-16 object-contain group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h3
            className="text-2xl font-bold text-slate-900 cursor-pointer select-none"
          >
            Hengki<span className="text-primary">.Setiawan</span>
          </h3>
          <p className="text-slate-500 text-sm mt-2">Digital Entrepreneur & Developer</p>
        </div>

        {/* Newsletter Form */}
        <div className="w-full max-w-md mb-10">
          <p className="text-slate-600 mb-4 text-sm">Dapatkan update terbaru tentang project & artikel saya.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Masukkan email Anda"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primaryDark transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && <p className="text-green-600 text-xs mt-2">Terima kasih telah berlangganan!</p>}
          {status === 'error' && <p className="text-red-600 text-xs mt-2">Gagal berlangganan. Silakan coba lagi.</p>}
        </div>

        <div className="flex space-x-6 mb-8">
          <a href="https://www.instagram.com/hengkimiau?igsh=MW9ycDR2NW1ueXZ0eg==" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-pink-600 hover:bg-pink-50 shadow-sm hover:shadow-md transition-all">
            <Instagram size={20} />
          </a>
          <a href="https://www.linkedin.com/in/hengki-setiawan-8064a6353" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all">
            <Linkedin size={20} />
          </a>
          <a href="https://github.com/Hengki-Setiawan" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm hover:shadow-md transition-all">
            <Github size={20} />
          </a>
          <a href="https://www.tiktok.com/@hengki.skizo?_r=1&_t=ZS-925xeJRk7dd" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-blue-50 shadow-sm hover:shadow-md transition-all">
            <Globe size={20} />
          </a>
        </div>

        <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-6 opacity-50"></div>

        {/* Hidden Admin Button - Easter Egg */}
        {showAdmin && (
          <div className="mb-6 animate-bounce">
            <a
              href="/admin/login"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🔐 Admin Access
            </a>
          </div>
        )}

        <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
          Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> di Makassar.
        </p>
        <p className="text-slate-400 text-xs mt-2">© {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;