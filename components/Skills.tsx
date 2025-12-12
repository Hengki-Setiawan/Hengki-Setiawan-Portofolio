import React, { useState, useEffect } from 'react';
import { Layout, Share2, TrendingUp, Code2, Zap, PenTool, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';
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

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setSkills(data || []);
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
      case 'business': return { bg: 'bg-blue-100', text: 'text-primary', dot: 'bg-primary' };
      case 'creative': return { bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-500' };
      case 'tech': return { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-500' };
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('skills.title')}</h2>
            <p className="text-slate-600 text-lg">
              {t('skills.description')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, idx) => {
            const colors = getCategoryColor(skill.category);

            return (
              <Reveal key={skill.id} delay={idx * 0.1} width="100%">
                <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6`}>
                    {getIcon(skill.icon_name)}
                  </div>
                  <TranslatedText as="h3" className="text-xl font-bold text-slate-900 mb-4">{skill.title}</TranslatedText>
                  <ul className="space-y-4">
                    {skill.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start">
                        <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full mt-2 mr-3`}></div>
                        <TranslatedText as="span" className="block font-medium text-slate-800">{item}</TranslatedText>
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