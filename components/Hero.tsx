import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Instagram, Github, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = {
    linkedin: 'https://www.linkedin.com/in/hengki-setiawan-8064a6353',
    instagram: 'https://www.instagram.com/hengkimiau',
    github: 'https://github.com/Hengki-Setiawan',
    email: 'mailto:hengkisetiawan461@gmail.com',
    cv: '/cv'
  };

  return (
    <section className="relative min-h-screen flex items-center bg-dark overflow-hidden pt-32 pb-20 md:pt-40">
      {/* Subtle light-mode accent blobs */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
            >
              🚀 Digital Entrepreneur & Developer
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-textMain mb-4 leading-tight font-display">
                Hengki <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Setiawan</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg font-medium text-textMuted mb-6 tracking-wide"
            >
              Digital Entrepreneur · Community Builder · Web Developer & Vibe Coder
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-textMuted mb-10 leading-relaxed max-w-lg mx-auto md:mx-0 font-light"
            >
              Mahasiswa S1 Bisnis Digital UNM. Membangun komunitas Facebook 500K+ anggota organik. Owner Kaos Kami — e-commerce brand dengan rating 4.9/5.0.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
            >
              <Link
                to="/contact"
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primaryDark transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5"
              >
                Contact Me
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="/cv/Hengki_CV_ID.docx"
                download
                className="px-6 py-3 rounded-xl bg-slate-100 text-textMain font-semibold border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-2"
              >
                CV (ID)
                <Download className="w-4 h-4" />
              </a>
              <a
                href="/cv/Hengki_CV_EN.docx"
                download
                className="px-6 py-3 rounded-xl bg-slate-100 text-textMain font-semibold border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-2"
              >
                CV (EN)
                <Download className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 flex items-center gap-5 justify-center md:justify-start"
            >
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
                <Linkedin size={18} />
              </a>
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
                <Github size={18} />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-300 transition-all">
                <Instagram size={18} />
              </a>
              <a href={socialLinks.email} className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                <Mail size={18} />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Photo */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative order-1 md:order-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative w-[300px] h-[380px] md:w-[420px] md:h-[520px]">
                <div className="absolute inset-0 bg-surface rounded-3xl overflow-hidden z-10 border border-slate-200 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-20"></div>
                  <img
                    src="/images/hengki-photo.jpg"
                    alt="Hengki Setiawan"
                    className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                    style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
                  />
                </div>
                {/* Behind accent lines */}
                <div className="absolute -inset-4 border border-primary/10 rounded-[2rem] z-0 pointer-events-none hidden md:block"></div>
                <div className="absolute -inset-8 border border-primary/5 rounded-[2.5rem] z-0 pointer-events-none hidden md:block opacity-50"></div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;