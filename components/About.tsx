import React from 'react';
import { GraduationCap, MapPin, Target, Briefcase } from 'lucide-react';
import Reveal from './Reveal';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Image/Visual */}
          <div className="order-2 md:order-1 relative">
            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-2xl z-0"></div>
                <div className="relative bg-slate-100 rounded-2xl overflow-hidden shadow-xl z-10 aspect-[4/5] md:aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80" 
                      alt="Hengki Setiawan Workspace" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <p className="text-white font-medium">"Mengubah Kopi menjadi Strategi & Kode"</p>
                    </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Content */}
          <div className="order-1 md:order-2">
            <Reveal>
              <h4 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">Tentang Saya</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Lebih dari sekadar <span className="text-primary">Mahasiswa.</span><br/>
                Seorang Praktisi Digital.
              </h2>
            </Reveal>
            
            <Reveal delay={0.1}>
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                Halo! Saya <strong>Hengki Setiawan</strong>. Saya percaya bahwa era digital membutuhkan generalis yang spesifik. 
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Sebagai mahasiswa <strong>Bisnis Digital di Universitas Negeri Makassar</strong>, saya tidak hanya belajar teori. 
                Saya mempraktikkannya dengan membangun brand clothing sendiri, mengelola komunitas online yang aktif, 
                dan mengembangkan skill teknis dalam pengembangan web & otomasi.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Reveal delay={0.2}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Pendidikan</h3>
                    <p className="text-sm text-slate-500">Mahasiswa Bisnis Digital (UNM)</p>
                    <p className="text-xs text-slate-400 mt-1">Alumni SMK 4 Makassar</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Fokus Utama</h3>
                    <p className="text-sm text-slate-500">Business Development & Tech</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Pengalaman</h3>
                    <p className="text-sm text-slate-500">Owner, Admin & Ex-Retail</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Domisili</h3>
                    <p className="text-sm text-slate-500">Makassar, Indonesia</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;