import React from 'react';
import { Monitor, Users, PenTool, ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';

const services = [
  {
    id: 1,
    title: 'Web Development',
    icon: Monitor,
    description: 'Pembuatan website modern (Landing Page, Portfolio, UMKM) yang cepat, responsif, dan SEO-friendly menggunakan teknologi terbaru.',
    features: ['Responsive Design', 'SEO Optimization', 'Modern Tech Stack (React)'],
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  {
    id: 2,
    title: 'Community Management',
    icon: Users,
    description: 'Strategi membangun dan mengelola komunitas online yang loyal. Dari moderasi grup hingga strategi engagement anggota.',
    features: ['Group Moderation', 'Engagement Strategy', 'Event Planning'],
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100'
  },
  {
    id: 3,
    title: 'Content Strategy',
    icon: PenTool,
    description: 'Perencanaan konten kreatif (Meme Marketing & Copywriting) untuk meningkatkan Brand Awareness dan interaksi audiens.',
    features: ['Meme Marketing', 'Copywriting', 'Social Media Plan'],
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Apa yang saya tawarkan?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Layanan Profesional</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Solusi digital yang menggabungkan teknis coding dan strategi bisnis untuk membantu pertumbuhan proyek Anda.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Reveal key={service.id} delay={idx * 0.1}>
              <div className={`h-full p-8 rounded-2xl bg-white border ${service.border} shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}>
                <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-500">
                      <CheckCircle2 className={`w-4 h-4 mr-2 ${service.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="#contact" className={`inline-flex items-center text-sm font-bold ${service.color} hover:underline`}>
                  Konsultasi Sekarang <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;