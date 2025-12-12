import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Instagram, Github, Mail } from 'lucide-react';
import Reveal from './Reveal';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = {
    linkedin: 'https://www.linkedin.com/in/hengki-setiawan-8064a6353',
    instagram: 'https://www.instagram.com/hengkimiau?igsh=MW9ycDR2NW1ueXZ0eg==',
    github: 'https://github.com/Hengki-Setiawan',
    cv: '/cv'
  };

  return (
    <section className="relative min-h-screen flex items-center bg-dark overflow-hidden pt-32 pb-20 md:pt-40">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary/5 skew-x-12 translate-x-20 blur-3xl"></div>
      <div className="absolute left-0 top-20 -z-10 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
      <div className="absolute right-0 bottom-20 -z-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
            <Reveal width="100%">
              <div className="inline-block px-4 py-1.5 rounded-full bg-surface border border-white/10 text-primary font-semibold text-sm mb-6 shadow-lg shadow-primary/10 backdrop-blur-sm">
                {t('hero.greeting')}
              </div>
            </Reveal>

            <Reveal delay={0.1} width="100%">
              <h2 className="text-4xl font-medium text-textMuted mb-2 font-display">
                Hello,
              </h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight font-display">
                Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Hengki</span> <br />
                <span className="text-slate-300">Setiawan</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2} width="100%">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-lg font-medium text-textMuted mb-6">
                <span>{t('hero.role')}</span>
              </div>
            </Reveal>

            <Reveal delay={0.3} width="100%">
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                {t('hero.description')}
              </p>
            </Reveal>

            <Reveal delay={0.4} width="100%">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primaryDark transition-all shadow-lg shadow-primary/30 flex items-center gap-2 hover:-translate-y-1"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to={socialLinks.cv}
                  className="px-8 py-4 rounded-full bg-transparent text-white font-bold border border-white/20 hover:border-primary hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  {t('hero.cta_secondary')}
                  <Download className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.5} width="100%">
              <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                  <Linkedin size={24} />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors hover:scale-110 transform duration-200">
                  <Instagram size={24} />
                </a>
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
                  <Github size={24} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-center relative order-1 md:order-2">
            <div className="relative">
              <Reveal delay={0.2} width="100%">
                <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px]">
                  <div className="absolute top-10 -right-4 md:-right-10 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] rotate-6 z-0 blur-xl"></div>
                  <div className="absolute top-10 -right-4 md:-right-10 w-full h-full bg-surface border border-white/10 rounded-[3rem] rotate-6 z-0"></div>

                  <div className="absolute inset-0 bg-surface rounded-[3rem] overflow-hidden z-10 shadow-2xl border-[8px] border-white/10 group">
                    <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2.5rem] z-20 pointer-events-none"></div>
                    <img
                      src="/images/hengki-photo.jpg"
                      alt="Hengki Setiawan"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-60"></div>
                  </div>
                </div>
              </Reveal>

              {/* Floating Badge 1 */}
              <div className="absolute -bottom-6 -left-6 z-30 bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                  <span className="text-xl">🎓</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">{t('hero.badge_student')}</p>
                  <p className="text-sm font-bold text-white">{t('hero.badge_business')}</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute top-10 -left-10 z-30 bg-surface/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 hidden md:flex items-center gap-2">
                <div className="bg-accent/20 p-1.5 rounded-full text-accent">
                  <span className="text-lg">👑</span>
                </div>
                <p className="text-xs font-bold text-slate-200">Owner Kaos Kami</p>
              </div>

              {/* Floating Badge 3 */}
              <div className="absolute top-20 -right-12 z-30 bg-surface/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 hidden md:flex items-center gap-2 animate-pulse" style={{ animationDuration: '4s' }}>
                <div className="bg-green-500/20 p-1.5 rounded-full text-green-500">
                  <span className="text-lg">🛡️</span>
                </div>
                <p className="text-xs font-bold text-slate-200">Admin Grup Kami</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;