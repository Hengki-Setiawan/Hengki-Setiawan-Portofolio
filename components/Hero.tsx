import React from 'react';
import { ArrowRight, Download, Linkedin, Instagram, Github } from 'lucide-react';
import Reveal from './Reveal';

const Hero: React.FC = () => {
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
    <section className="relative min-h-screen flex items-center bg-light overflow-hidden pt-32 pb-20 md:pt-40">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50/50 skew-x-12 translate-x-20"></div>
      <div className="absolute left-0 top-20 -z-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-20 -z-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
          
          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
            <Reveal>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary font-semibold text-sm mb-6 shadow-sm">
                👋 Selamat Datang di Portofolio Saya
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-4xl font-medium text-slate-600 mb-2">
                Hello,
              </h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                Saya <span className="text-primary">Hengki</span> <br />
                <span className="text-slate-800">Setiawan</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-lg font-medium text-slate-500 mb-6">
                <span>Digital Business Student</span>
                <span className="hidden md:inline">•</span>
                <span>Creative Strategist</span>
                <span className="hidden md:inline">•</span>
                <span>Web Developer</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                Mahasiswa Universitas Negeri Makassar yang menggabungkan naluri bisnis, kreativitas konten, dan teknologi untuk menciptakan dampak nyata.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a 
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primaryDark transition-all shadow-lg shadow-primary/30 flex items-center gap-2 hover:-translate-y-1"
                >
                  Ayo Bicara
                  <ArrowRight className="w-5 h-5" />
                </a>
                {/* 
                  Note: Jika nanti punya CV PDF, ganti href="#" dengan link file PDF-nya 
                */}
                <a 
                  href="#" 
                  className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  Download CV
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors hover:scale-110 transform duration-200">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors hover:scale-110 transform duration-200">
                  <Github size={24} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative order-1 md:order-2">
            <Reveal delay={0.2}>
              <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px]">
                {/* Yellow Circle Background */}
                <div className="absolute top-10 -right-4 md:-right-10 w-full h-full bg-accent rounded-[3rem] rotate-6 z-0"></div>
                
                {/* Image Container */}
                <div className="absolute inset-0 bg-slate-200 rounded-[3rem] overflow-hidden z-10 shadow-2xl border-[6px] border-white">
                  {/* 
                     PENTING: Ganti URL gambar di bawah ini dengan foto asli Anda.
                     Saran: Gunakan foto portrait dengan latar belakang bersih/polos, 
                     memakai pakaian rapi (kemeja/jas almamater) atau smart casual.
                  */}
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Hengki Setiawan" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-green-100 p-2 rounded-full">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">Mahasiswa</p>
                    <p className="text-sm font-bold text-slate-800">Bisnis Digital</p>
                  </div>
                </div>

                 {/* Floating Badge 2 */}
                 <div className="absolute top-10 -left-10 z-20 bg-white p-3 rounded-2xl shadow-lg hidden md:flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <span className="text-lg">👑</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Owner Kaos Kami</p>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;