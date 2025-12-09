import React from 'react';
import { Briefcase, ShoppingBag, Users } from 'lucide-react';
import { ExperienceItem } from '../types';
import Reveal from './Reveal';

const experiences: ExperienceItem[] = [
  {
    id: 1,
    title: 'Kaos Kami',
    role: 'Owner & Founder',
    period: 'Sekarang',
    description: 'Membangun brand clothing dari nol. Mengelola seluruh aspek bisnis mulai dari desain produk, manajemen produksi, hingga strategi pemasaran digital.',
    icon: Briefcase
  },
  {
    id: 2,
    title: 'Komunitas "Kami Depresi dan Bahagia"',
    role: 'Lead Admin & Owner',
    period: 'Sekarang',
    description: 'Bertanggung jawab atas moderasi konten dan manajemen komunitas online. Menciptakan lingkungan yang aman dan menghibur bagi anggota.',
    icon: Users
  },
  {
    id: 3,
    title: 'PT Midi Utama Indonesia Tbk (Alfamidi)',
    role: 'Staff Operasional',
    period: '± 1 Tahun',
    description: 'Pengalaman profesional pertama dalam lingkungan ritel fast-paced. Mempelajari standar pelayanan pelanggan (SOP), manajemen inventaris, dan disiplin kerja korporat.',
    icon: ShoppingBag
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perjalanan Karir</h2>
             <p className="text-slate-600">Jejak langkah dalam dunia profesional dan wirausaha</p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 md:left-1/2 md:-ml-px"></div>

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <Reveal key={exp.id} delay={idx * 0.1}>
                <div className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Icon Marker */}
                  <div className="absolute left-8 -translate-x-1/2 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary shadow-sm z-10 flex items-center justify-center"></div>

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold mb-3">
                        {exp.period}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{exp.title}</h3>
                      <p className="text-md font-medium text-slate-700 mb-3">{exp.role}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;