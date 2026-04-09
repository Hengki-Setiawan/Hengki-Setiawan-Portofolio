import React from 'react';
import { Users, Shield, TrendingUp, Presentation } from 'lucide-react';
import Reveal from './Reveal';

const communityStats = [
  { 
    img: '/images/kami-depresi.png', 
    title: 'Kami Depresi', 
    members: 'Terbesar', 
    desc: 'Komunitas diskusi relatable dan organik terbesar di ekosistem kami.',
    link: 'https://www.facebook.com/groups/1066750060883536/'
  },
  { 
    img: '/images/kami-bahagia.png', 
    title: 'Kami Bahagia', 
    members: 'Aktif', 
    desc: 'Sirkel positif dan solid untuk daily sharing.',
    link: 'https://web.facebook.com/groups/610974693984891/'
  },
  { 
    img: '/images/kami-skizo.png', 
    title: 'Kami Skizo', 
    members: 'Aktif', 
    desc: 'Komunitas niche dengan interaksi otentik.',
    link: 'https://web.facebook.com/groups/3307589206129666/'
  }
];

const Communities: React.FC = () => {
  return (
    <section id="communities" className="py-24 bg-surface scroll-mt-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-textMain mb-4">Membangun Jaringan Komunitas</h2>
            <p className="text-textMuted text-lg">
              Berpengalaman mengembangkan dan memoderasi komunitas Facebook secara organik.
              Saat ini terdapat gabungan lebih dari <strong className="text-primary font-bold">500.000+ anggota</strong> aktif di 3 grup utama.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communityStats.map((stat, idx) => (
            <Reveal key={idx} delay={idx * 0.1} width="100%">
              <a href={stat.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
                <div className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={stat.img} alt={stat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 w-full p-4 flex items-end justify-between">
                      <h3 className="text-white font-bold text-xl drop-shadow-md">{stat.title}</h3>
                      <div className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded">
                         Lihat Grup
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={18} className="text-primary" />
                      <span className="font-bold text-slate-800">{stat.members}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{stat.desc}</p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Communities;
