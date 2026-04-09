import React, { useState, useEffect } from 'react';
import { Monitor, Users, PenTool, ArrowRight, Code, ShoppingBag, TrendingUp, Briefcase, Globe, Palette, MessageCircle, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import TranslatedText from './TranslatedText';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor, Users, PenTool, Code, ShoppingBag, TrendingUp, Briefcase, Globe, Palette, MessageCircle
};

const defaultServices = [
  { id: '1', title: 'Web Development', description: 'Pembuatan website modern yang cepat, responsif, dan SEO-friendly.', icon: 'Monitor', order_index: 0 },
  { id: '2', title: 'Community Management', description: 'Strategi membangun dan mengelola komunitas online yang loyal.', icon: 'Users', order_index: 1 },
  { id: '3', title: 'Content Strategy', description: 'Perencanaan konten kreatif untuk meningkatkan Brand Awareness.', icon: 'PenTool', order_index: 2 }
];

const colorSchemes = [
  { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
];

interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceData[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await db
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">{t('services.section_label')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">{t('services.title')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t('services.description')}
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const scheme = colorSchemes[idx % colorSchemes.length];
              const IconComponent = iconMap[service.icon] || Monitor;

              return (
                <Reveal key={service.id} delay={idx * 0.1} width="100%">
                  <div className={`h-full p-8 rounded-2xl bg-white border ${scheme.border} shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}>
                    <div className={`w-14 h-14 ${scheme.bg} ${scheme.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={28} />
                    </div>

                    <TranslatedText as="h3" className="text-xl font-bold text-slate-900 mb-3">{service.title}</TranslatedText>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      <TranslatedText>{service.description}</TranslatedText>
                    </p>

                    <a href="#contact" className={`inline-flex items-center text-sm font-bold ${scheme.color} hover:underline`}>
                      {t('services.cta')} <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;