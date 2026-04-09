import React, { useState, useEffect } from 'react';
import { Layout, Share2, TrendingUp, Code2, Zap, PenTool, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import TranslatedText from './TranslatedText';

interface Skill {
  id: string;
  category: string;
  title: string;
  items: string[];
  icon_name: string;
}

const iconMap: Record<string, React.FC<any>> = {
  TrendingUp,
  PenTool,
  Code2,
  Layout,
  Share2,
  Zap
};

const defaultSkills: Skill[] = [
  {
    id: '1',
    category: 'tech',
    title: 'Technology & Web',
    items: ['Pengembangan Platform Web', 'Fullstack Vibe Coding', 'Prompt Engineering (AI)'],
    icon_name: 'Code2'
  },
  {
    id: '2',
    category: 'business',
    title: 'Business & Commerce',
    items: ['Operasional E-Commerce (Shopee, Toped)', 'CRM & Kepuasan Pelanggan', 'Manajemen Rantai Pasok'],
    icon_name: 'TrendingUp'
  },
  {
    id: '3',
    category: 'creative',
    title: 'Community & Creative',
    items: ['Pembangunan Komunitas Skala Besar', 'Pembuatan Konten Viral & Meme', 'Otomasi Telegram Bot'],
    icon_name: 'Share2'
  }
];

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await db
          .from('skills')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData = data.map((s: any) => ({
            ...s,
            items: typeof s.items === 'string' ? JSON.parse(s.items) : (s.items || [])
          }));
          setSkills(formattedData);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Code2;
    return <Icon size={28} />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return { bg: 'bg-primary/10 border border-primary/20', text: 'text-primary', dot: 'bg-primary' };
      case 'creative': return { bg: 'bg-orange-500/10 border border-orange-500/20', text: 'text-orange-500', dot: 'bg-orange-500' };
      case 'tech': return { bg: 'bg-secondary/10 border border-secondary/20', text: 'text-secondary', dot: 'bg-secondary' };
      default: return { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-500', dot: 'bg-slate-400' };
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-24 bg-darker border-t border-slate-200 scroll-mt-20">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 bg-darker relative border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-textMain mb-4">{t('skills.title')}</h2>
            <p className="text-textMuted text-lg">
              {t('skills.description')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, idx) => {
            const colors = getCategoryColor(skill.category);

            return (
              <Reveal key={skill.id} delay={idx * 0.1} width="100%">
                <div className="h-full glass-card p-8 rounded-2xl">
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6`}>
                    {getIcon(skill.icon_name)}
                  </div>
                  <TranslatedText as="h3" className="text-xl font-bold text-textMain mb-4">{skill.title}</TranslatedText>
                  <ul className="space-y-4">
                    {skill.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start">
                        <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full mt-2 mr-3`}></div>
                        <TranslatedText as="span" className="block font-medium text-textMuted">{item}</TranslatedText>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;