import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Linkedin, Github, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darker py-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/images/logo-neco.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="text-lg font-bold text-textMain">
              Hengki<span className="text-primary">.Setiawan</span>
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/hengki-setiawan-8064a6353" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-textMuted hover:text-blue-600 hover:border-blue-300 transition-all">
              <Linkedin size={16} />
            </a>
            <a href="https://github.com/Hengki-Setiawan" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-textMuted hover:text-slate-900 hover:border-slate-400 transition-all">
              <Github size={16} />
            </a>
            <a href="https://www.instagram.com/hengkimiau" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-textMuted hover:text-pink-500 hover:border-pink-300 transition-all">
              <Instagram size={16} />
            </a>
            <a href="mailto:hengkisetiawan461@gmail.com"
              className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/30 transition-all">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-textMuted">
          <p className="flex items-center gap-1 font-medium">
            Made by hengki stiawan
          </p>
          <p>
            © {currentYear} <Link to="/admin/login" className="cursor-text" title="">Hengki Setiawan</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;