import React, { useState, useEffect } from 'react';
import { Briefcase, ShoppingBag, Users, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import TranslatedText from './TranslatedText';

const defaultExperiences = [
  { 
    id: '1', 
    title: 'Kaos Kami', 
    role: 'Pemilik Toko Online & Brand', 
    period: 'Jun 2022 - Sekarang', 
    description: 'Mengelola operasional end-to-end brand pakaian melalui Shopee, Tokopedia, Facebook, dan TikTok. Mempertahankan kepuasan pelanggan 4,9/5,0.', 
    order_index: 0 
  },
  { 
    id: '2', 
    title: 'Komunitas Facebook', 
    role: 'Lead Admin & Manajer', 
    period: 'Nov 2021 - Sekarang', 
    description: 'Membangun dan mengelola jaringan komunitas Facebook dari nol hingga >500.000 anggota (Kami Depresi, Kami Bahagia).', 
    order_index: 1 
  },
  { 
    id: '3', 
    title: 'PT Midi Utama Indonesia Tbk (Alfamidi)', 
    role: 'Staff Operasional', 
    period: 'Sep 2021 - Agu 2022', 
    description: 'Memproses transaksi harian secara akurat serta mengelola planogram produk dan menjaga kebersihan toko.', 
    order_index: 2 
  },
];

interface ExperienceData {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  order_index: number;
}

const Experience: React.FC = () => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<ExperienceData[]>(defaultExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await db
          .from('experiences')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setExperiences(data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-24 bg-white scroll-mt-20">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('experience_section.title')}</h2>
            <p className="text-slate-600">{t('experience_section.description')}</p>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 md:left-1/2 md:-ml-px"></div>

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <Reveal key={exp.id} delay={idx * 0.1} width="100%">
                <div className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  <div className="absolute left-8 -translate-x-1/2 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary shadow-sm z-10 flex items-center justify-center"></div>

                  <div className={`ml-16 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      <TranslatedText as="span" className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold mb-3">
                        {exp.period}
                      </TranslatedText>
                      <TranslatedText as="h3" className="text-lg font-bold text-slate-900 mb-1">{exp.title}</TranslatedText>
                      <TranslatedText as="p" className="text-md font-medium text-slate-700 mb-3">{exp.role}</TranslatedText>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        <TranslatedText>{exp.description}</TranslatedText>
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