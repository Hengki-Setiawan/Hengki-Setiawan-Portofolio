import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Instagram, Github, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

interface HeroContent {
  greeting: string;
  hello_text: string;
  name_first: string;
  name_last: string;
  role_1: string;
  role_2: string;
  role_3: string;
  role_4: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
  cv_url: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
  main_image: string;
  badge_1_emoji: string;
  badge_1_title: string;
  badge_1_subtitle: string;
  badge_2_emoji: string;
  badge_2_text: string;
  badge_3_emoji: string;
  badge_3_text: string;
}

// Default content as fallback
const defaultContent: HeroContent = {
  greeting: '👋 Selamat Datang di Portofolio Saya',
  hello_text: 'Hello,',
  name_first: 'Hengki',
  name_last: 'Setiawan',
  role_1: 'Digital Business Student',
  role_2: 'Meme Creator',
  role_3: 'E-commerce Merchant',
  role_4: 'Web Developer',
  description: 'Mahasiswa Universitas Negeri Makassar yang menggabungkan naluri bisnis, kreativitas konten, dan teknologi untuk menciptakan dampak nyata.',
  cta_primary: 'Ayo Bicara',
  cta_secondary: 'Download CV',
  cv_url: '#',
  linkedin_url: 'https://www.linkedin.com/in/hengki-setiawan-8064a6353',
  instagram_url: 'https://www.instagram.com/hengkimiau?igsh=MW9ycDR2NW1ueXZ0eg==',
  github_url: 'https://github.com/Hengki-Setiawan',
  main_image: '/images/hengki-photo.jpg',
  badge_1_emoji: '🎓',
  badge_1_title: 'Mahasiswa',
  badge_1_subtitle: 'Bisnis Digital',
  badge_2_emoji: '👑',
  badge_2_text: 'Owner Kaos Kami',
  badge_3_emoji: '🛡️',
  badge_3_text: 'Admin Grup Kami'
};

const Hero: React.FC = () => {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', 'hero');

        if (error) throw error;

        if (data && data.length > 0) {
          const contentMap: Record<string, string> = {};
          data.forEach((item: any) => {
            contentMap[item.key] = item.value || item.image_url || '';
          });

          setContent(prev => ({
            ...prev,
            ...contentMap
          }));
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        // Keep default content on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
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
                {content.greeting}
              </div>
            </Reveal>

            <Reveal delay={0.1} width="100%">
              <h2 className="text-4xl font-medium text-textMuted mb-2 font-display">
                {content.hello_text}
              </h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight font-display">
                Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{content.name_first}</span> <br />
                <span className="text-slate-300">{content.name_last}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2} width="100%">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-lg font-medium text-textMuted mb-6">
                <span>{content.role_1}</span>
                <span className="hidden md:inline text-primary">•</span>
                <span>{content.role_2}</span>
                <span className="hidden md:inline text-primary">•</span>
                <span>{content.role_3}</span>
                <span className="hidden md:inline text-primary">•</span>
                <span>{content.role_4}</span>
              </div>
            </Reveal>

            <Reveal delay={0.3} width="100%">
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                {content.description}
              </p>
            </Reveal>

            <Reveal delay={0.4} width="100%">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primaryDark transition-all shadow-lg shadow-primary/30 flex items-center gap-2 hover:-translate-y-1"
                >
                  {content.cta_primary}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/cv"
                  className="px-8 py-4 rounded-full bg-transparent text-white font-bold border border-white/20 hover:border-primary hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  {content.cta_secondary}
                  <Download className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.5} width="100%">
              <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
                <a href={content.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                  <Linkedin size={24} />
                </a>
                <a href={content.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors hover:scale-110 transform duration-200">
                  <Instagram size={24} />
                </a>
                <a href={content.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
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
                  {/* Neon Circle Background */}
                  <div className="absolute top-10 -right-4 md:-right-10 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] rotate-6 z-0 blur-xl"></div>
                  <div className="absolute top-10 -right-4 md:-right-10 w-full h-full bg-surface border border-white/10 rounded-[3rem] rotate-6 z-0"></div>

                  {/* Image Container with Frame */}
                  <div className="absolute inset-0 bg-surface rounded-[3rem] overflow-hidden z-10 shadow-2xl border-[8px] border-white/10 group">
                    <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2.5rem] z-20 pointer-events-none"></div>
                    <img
                      src={content.main_image}
                      alt={`${content.name_first} ${content.name_last}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-60"></div>
                  </div>
                </div>
              </Reveal>

              {/* Floating Badge 1 */}
              <div className="absolute -bottom-6 -left-6 z-30 bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                  <span className="text-xl">{content.badge_1_emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">{content.badge_1_title}</p>
                  <p className="text-sm font-bold text-white">{content.badge_1_subtitle}</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute top-10 -left-10 z-30 bg-surface/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 hidden md:flex items-center gap-2">
                <div className="bg-accent/20 p-1.5 rounded-full text-accent">
                  <span className="text-lg">{content.badge_2_emoji}</span>
                </div>
                <p className="text-xs font-bold text-slate-200">{content.badge_2_text}</p>
              </div>

              {/* Floating Badge 3 */}
              <div className="absolute top-20 -right-12 z-30 bg-surface/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 hidden md:flex items-center gap-2 animate-pulse" style={{ animationDuration: '4s' }}>
                <div className="bg-green-500/20 p-1.5 rounded-full text-green-500">
                  <span className="text-lg">{content.badge_3_emoji}</span>
                </div>
                <p className="text-xs font-bold text-slate-200">{content.badge_3_text}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;