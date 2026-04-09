import React, { useState, useEffect } from 'react';
import { Shirt, MessageCircle, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';

interface VentureItem {
  id: string;
  title: string;
  role: string;
  description: string;
  link: string;
  icon_name: string;
  color_class: string;
  order_index: number;
  image_url?: string;
  features?: string[];
  cta_text?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shirt, MessageCircle, ArrowUpRight
};

const Ventures: React.FC = () => {
  const [ventures, setVentures] = useState<VentureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const { data, error } = await db
          .from('ventures')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const formatted = data.map((v: any) => ({
            ...v,
            features: typeof v.features === 'string' ? JSON.parse(v.features) : (v.features || [])
          }));
          setVentures(formatted);
        }
      } catch (error) {
        console.error('Error fetching ventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  if (loading) {
    return (
      <section id="ventures" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (ventures.length === 0) return null;

  return (
    <section id="ventures" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Bisnis & Komunitas</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Proyek Unggulan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Inisiatif yang saya bangun dan kelola secara langsung dengan penuh dedikasi.
            </p>
          </div>
        </Reveal>

        <div className="space-y-24">
          {ventures.map((venture, idx) => {
            const IconComponent = iconMap[venture.icon_name] || ArrowUpRight;
            const isEven = idx % 2 === 0;

            return (
              <Reveal key={venture.id} delay={0.1} width="100%">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>

                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div className={`absolute inset-0 ${venture.color_class} opacity-10 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500`}></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white aspect-video lg:aspect-[4/3]">
                      {venture.image_url ? (
                        <img
                          src={venture.image_url}
                          alt={venture.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                          <IconComponent className="w-24 h-24 opacity-20" />
                        </div>
                      )}

                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${venture.color_class} bg-opacity-20`}>
                          <IconComponent className={`w-4 h-4 ${venture.color_class.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{venture.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{venture.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-8">
                      {venture.description}
                    </p>

                    {venture.features && venture.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {venture.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${venture.color_class.replace('bg-', 'text-')} flex-shrink-0 mt-0.5`} />
                            <span className="text-slate-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <a
                      href={venture.link}
                      target={venture.link !== '#' ? '_blank' : undefined}
                      rel={venture.link !== '#' ? 'noreferrer' : undefined}
                      className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all ${venture.color_class}`}
                    >
                      {venture.cta_text || 'Lihat Detail'}
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Ventures;