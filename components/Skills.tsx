import React, { useState } from 'react';
import { Layout, Share2, TrendingUp, Code2, Zap, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
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

// Data based strictly on cv_reference.md "Keahlian Utama" line 13-21
const defaultSkills: Skill[] = [
  {
    id: '1',
    category: 'tech',
    title: 'Technology & AI',
    items: [
      'Fullstack Vibe Coding',
      'Prompt Engineering & Penguasaan Tools AI',
      'Pengembangan Platform Web'
    ],
    icon_name: 'Code2'
  },
  {
    id: '2',
    category: 'creative',
    title: 'Community & Automation',
    items: [
      'Pembangunan & Moderasi Komunitas Skala Besar',
      'Pembuatan Konten Viral & Meme',
      'Otomasi Telegram Bot'
    ],
    icon_name: 'Share2'
  },
  {
    id: '3',
    category: 'business',
    title: 'Business & CRM',
    items: [
      'Operasional E-Commerce & Marketplace',
      'Manajemen Hubungan Pelanggan (CRM)'
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
  // Bypass DB completely and force CV data
  const [skills] = useState<Skill[]>(defaultSkills);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Code2;
    return <Icon size={26} />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', glow: 'group-hover:shadow-[0_0_30px_-5px_var(--color-primary)]' };
      case 'creative': return { bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-500', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]' };
      case 'tech': return { bg: 'bg-secondary/10 border-secondary/20', text: 'text-secondary', glow: 'group-hover:shadow-[0_0_30px_-5px_var(--color-secondary)]' };
      default: return { bg: 'bg-slate-500/10 border-slate-500/20', text: 'text-slate-500', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(148,163,184,0.3)]' };
    }
  };

  return (
    <section id="skills" className="py-24 bg-darker relative border-t border-slate-200 dark:border-slate-800 scroll-mt-20 overflow-hidden">
      
      {/* Premium Background Decor - Adapted for light/dark mode */}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-textMain text-sm font-semibold mb-6 shadow-sm">
            <Zap size={14} className="text-primary" />
            <span className="tracking-wide text-textMain">Keahlian & Kompetensi</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-textMain mb-6 tracking-tight">
            {t('skills.title') || "Keahlian Utama"}
          </h2>
          <p className="text-textMuted text-lg md:text-xl leading-relaxed max-w-2xl">
            {t('skills.description') || "Kombinasi unik antara pemahaman bisnis, kreativitas konten, dan kemampuan teknis."}
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
                className={`group h-full relative p-8 md:p-10 rounded-[2rem] glass-card transition-all duration-300 flex flex-col ${colors.glow}`}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <motion.div 
                  className={`w-16 h-16 ${colors.bg} ${colors.text} border rounded-2xl flex items-center justify-center mb-8 shadow-sm relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                >
                  {getIcon(skill.icon_name)}
                </motion.div>
                
                <TranslatedText as="h3" className="text-2xl font-bold text-textMain mb-6 relative z-10 tracking-tight">
                  {skill.title}
                </TranslatedText>
                
                <motion.ul variants={containerVariants} className="space-y-4 relative z-10 mt-auto flex-grow flex flex-col justify-center">
                  {skill.items.map((item, itemIdx) => (
                    <motion.li 
                      key={itemIdx} 
                      variants={itemVariants}
                      className="flex items-start group/item p-2 -mx-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 cursor-default"
                    >
                      <div className={`mt-[6px] shrink-0 mr-4 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-150`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.text} opacity-50 group-hover/item:opacity-100 bg-current shadow-[0_0_8px_currentColor]`}></div>
                      </div>
                      <TranslatedText as="span" className="block text-[15px] font-medium text-textMuted group-hover/item:text-textMain transition-colors duration-200 leading-snug">
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