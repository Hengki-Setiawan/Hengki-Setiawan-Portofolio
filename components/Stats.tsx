import React from 'react';
import { Users, ShoppingBag, Zap, Award } from 'lucide-react';
import Reveal from './Reveal';

const stats = [
  {
    id: 1,
    label: 'Anggota Komunitas',
    value: '5,000+',
    icon: Users,
    desc: 'Aktif & Solid',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    id: 2,
    label: 'Produk Terjual',
    value: '200+',
    icon: ShoppingBag,
    desc: 'Kaos & Merch',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    id: 3,
    label: 'Jangkauan Konten',
    value: '100k+',
    icon: Zap,
    desc: 'Views per Bulan',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    id: 4,
    label: 'Pengalaman',
    value: '3+',
    icon: Award,
    desc: 'Tahun Berkarya',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
];

const Stats: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Stats;