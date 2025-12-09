import React from 'react';
import { Shirt, MessageCircle, ArrowUpRight } from 'lucide-react';
import { VentureItem } from '../types';
import Reveal from './Reveal';

const ventures: VentureItem[] = [
  {
    title: 'Kaos Kami',
    role: 'Clothing Brand',
    description: 'Brand fashion lokal dengan desain yang relevan untuk Gen Z. Fokus pada kualitas bahan dan pesan visual yang unik.',
    color: 'bg-orange-500',
    link: '#'
  },
  {
    title: 'Kami Depresi dan Bahagia',
    role: 'Digital Community',
    description: 'Ruang aman digital untuk berekspresi. Menggabungkan humor (meme) dengan dukungan komunitas (peer support).',
    color: 'bg-blue-500',
    link: '#'
  }
];

const Ventures: React.FC = () => {
  return (
    <section id="ventures" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bisnis & Proyek</h2>
              <p className="text-slate-600 max-w-xl">
                Inisiatif yang saya bangun dan kelola secara langsung.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ventures.map((venture, idx) => (
            <Reveal key={idx} delay={idx * 0.2}>
              <div className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="text-slate-400" />
                </div>
                
                <div className={`w-14 h-14 rounded-xl ${venture.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                   {idx === 0 ? <Shirt className={`w-7 h-7 ${venture.color.replace('bg-', 'text-')}`} /> : <MessageCircle className={`w-7 h-7 ${venture.color.replace('bg-', 'text-')}`} />}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">{venture.title}</h3>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{venture.role}</p>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {venture.description}
                </p>

                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ventures;