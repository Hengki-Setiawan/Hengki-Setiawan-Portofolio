import React from 'react';
import { Heart, Instagram, Linkedin, Github, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        
        <div className="mb-6">
           <h3 className="text-2xl font-bold text-slate-900">Hengki<span className="text-primary">.Setiawan</span></h3>
           <p className="text-slate-500 text-sm mt-2">Digital Entrepreneur & Developer</p>
        </div>

        <div className="flex space-x-6 mb-8">
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-pink-600 hover:bg-pink-50 shadow-sm hover:shadow-md transition-all">
            <Instagram size={20} />
          </a>
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all">
            <Linkedin size={20} />
          </a>
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm hover:shadow-md transition-all">
            <Github size={20} />
          </a>
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-blue-50 shadow-sm hover:shadow-md transition-all">
            <Globe size={20} />
          </a>
        </div>
        
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-6 opacity-50"></div>

        <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
          Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> di Makassar.
        </p>
        <p className="text-slate-400 text-xs mt-2">© {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;