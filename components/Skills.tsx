import React, { useState, useEffect } from 'react';
import { Layout, Share2, TrendingUp, Code2, Zap, PenTool, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

// Data based strictly on cv_reference.md "Keahlian Utama"
const defaultSkills: Skill[] = [
  {
    id: '1',
    category: 'tech',
    title: 'Development & AI',
    items: [
      'Fullstack Vibe Coding',
      'Prompt Engineering & Tools AI',
      'Pengembangan Platform Web',
      'TypeScript, JavaScript, HTML/CSS'
    ],
    icon_name: 'Code2'
  },
  {
    id: '2',
    category: 'creative',
    title: 'Community & Automation',
    items: [
      'Pembangunan Komunitas Skala Besar',
      'Moderasi Komunitas (>500k members)',
      'Pembuatan Konten Viral & Meme',
      'Otomasi Telegram Bot'
    ],
    icon_name: 'Share2'
  },
  {
    id: '3',
    category: 'business',
    title: 'Business & E-Commerce',
    items: [
      'Operasional E-Commerce & Marketplace',
      'Manajemen Hubungan Pelanggan (CRM)',
      'Shopee & Tokopedia Seller',
      'Manajemen Rantai Pasok Dasar'
    ],
    icon_name: 'TrendingUp'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
          
          // Use DB if it has at least 3 categories, otherwise keep the pristine CV data as fallback
          if (formattedData.length >= 3) {
            setSkills(formattedData);
          }
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
    return <Icon size={26} />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' };
      case 'creative': return { bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-500', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]' };
      case 'tech': return { bg: 'bg-secondary/10 border-secondary/20', text: 'text-secondary', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]' };
      default: return { bg: 'bg-slate-800/50 border-slate-700', text: 'text-slate-300', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(148,163,184,0.2)]' };
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-24 bg-[#0B1120] border-t border-slate-800 scroll-mt-20">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-32 bg-[#0B1120] relative border-t border-slate-800 scroll-mt-20 overflow-hidden">
      
      {/* Premium Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <Zap size={14} className="text-secondary" />
            <span className="tracking-wide">Keahlian & Kompetensi</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 tracking-tight">
            {t('skills.title') || "Keahlian Utama"}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl">
            {t('skills.description') || "Kombinasi unik antara pemahaman bisnis, kreativitas konten, dan kemampuan teknis tingkat lanjut."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, idx) => {
            const colors = getCategoryColor(skill.category);

            return (
              <motion.div 
                key={skill.id} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: idx * 0.15, ease: "easeOut" } 
                  }
                }}
                whileHover={{ y: -8 }}
                className={`group h-full relative p-8 md:p-10 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-slate-800 transition-all duration-300 flex flex-col ${colors.glow}`}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <motion.div 
                  className={`w-16 h-16 ${colors.bg} ${colors.text} border rounded-2xl flex items-center justify-center mb-8 shadow-inner relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                >
                  {getIcon(skill.icon_name)}
                </motion.div>
                
                <TranslatedText as="h3" className="text-2xl font-bold text-white mb-8 relative z-10 tracking-tight">
                  {skill.title}
                </TranslatedText>
                
                <motion.ul variants={containerVariants} className="space-y-4 relative z-10 mt-auto flex-grow flex flex-col justify-center">
                  {skill.items.map((item, itemIdx) => (
                    <motion.li 
                      key={itemIdx} 
                      variants={itemVariants}
                      className="flex items-center group/item p-2 -mx-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 cursor-default"
                    >
                      <div className={`shrink-0 mr-4 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-150`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.text} opacity-50 group-hover/item:opacity-100 bg-current shadow-[0_0_8px_currentColor]`}></div>
                      </div>
                      <TranslatedText as="span" className="block text={15px} font-medium text-slate-300 group-hover/item:text-white transition-colors duration-200">
                        {item}
                      </TranslatedText>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;