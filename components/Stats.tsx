import React, { useState, useEffect, useRef } from 'react';
import { Users, ShoppingBag, Zap, Award, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users, ShoppingBag, Zap, Award
};

// Color schemes for stats
const colorSchemes = [
  { color: 'text-blue-600', bg: 'bg-blue-50' },
  { color: 'text-orange-600', bg: 'bg-orange-50' },
  { color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { color: 'text-purple-600', bg: 'bg-purple-50' },
];

interface StatItem {
  id: number;
  labelKey: string;
  descKey: string;
  value: number;
  suffix: string;
  icon: string;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateValue(0, value, 2000);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const animateValue = (start: number, end: number, duration: number) => {
    const startTime = Date.now();

    const update = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (end - start) * easeOutQuart);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
  };

  return (
    <div ref={ref} className="text-3xl font-extrabold text-slate-900 mb-1">
      {value >= 1000 ? formatNumber(displayValue) : displayValue.toLocaleString()}{suffix}
    </div>
  );
};

const Stats: React.FC = () => {
  const { t } = useTranslation();

  const defaultStats: StatItem[] = [
    { id: 1, labelKey: 'stats.community', value: 5000, suffix: '+', icon: 'Users', descKey: 'stats.community_desc' },
    { id: 2, labelKey: 'stats.products', value: 200, suffix: '+', icon: 'ShoppingBag', descKey: 'stats.products_desc' },
    { id: 3, labelKey: 'stats.reach', value: 100, suffix: 'k+', icon: 'Zap', descKey: 'stats.reach_desc' },
    { id: 4, labelKey: 'stats.years', value: 3, suffix: '+', icon: 'Award', descKey: 'stats.years_desc' },
  ];

  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await db
          .from('social_stats')
          .select('*')
          .order('category', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const transformedStats: StatItem[] = [];
          const categories = ['community', 'store', 'social', 'experience'];

          categories.forEach((category, index) => {
            const categoryData = data.filter(d => d.category === category);
            if (categoryData.length > 0) {
              const totalValue = categoryData.reduce((sum, item) => sum + (item.value || 0), 0);
              const defaultStat = defaultStats[index];

              transformedStats.push({
                id: index + 1,
                labelKey: defaultStat?.labelKey || 'stats.community',
                value: totalValue,
                suffix: defaultStat?.suffix || '+',
                icon: defaultStat?.icon || 'Users',
                descKey: defaultStat?.descKey || 'stats.community_desc',
              });
            }
          });

          if (transformedStats.length > 0) {
            setStats(transformedStats);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const scheme = colorSchemes[index % colorSchemes.length];
                const IconComponent = iconMap[stat.icon] || Users;

                return (
                  <div key={stat.id} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className={`w-12 h-12 ${scheme.bg} ${scheme.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={24} />
                    </div>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t(stat.labelKey)}</div>
                    <div className="text-xs text-slate-500 mt-1">{t(stat.descKey)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default Stats;