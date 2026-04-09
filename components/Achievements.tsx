import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Loader2, Trophy, Users, ShoppingBag, Award, Star, TrendingUp } from 'lucide-react';
import Reveal from './Reveal';

interface Achievement {
    id: string;
    title: string;
    description: string;
    value: string;
    icon: string;
    platform: string;
    category: string;
    link: string | null;
    order_index: number;
}

const defaultAchievements: Achievement[] = [
    { id: '1', title: 'Grup Facebook', description: 'Komunitas aktif (+)', value: '500K+', icon: '👥', platform: 'facebook', category: 'community', link: null, order_index: 1 },
    { id: '2', title: 'Star Seller', description: 'Shopee', value: '⭐', icon: '🏆', platform: 'shopee', category: 'certification', link: null, order_index: 2 },
    { id: '3', title: 'Produk Terjual', description: 'Total penjualan Kaos Kami', value: '600+', icon: '🛒', platform: 'shopee', category: 'sales', link: null, order_index: 3 },
    { id: '4', title: 'Hengki Setiawan', description: 'Pengikut Facebook', value: '12K+', icon: '📱', platform: 'facebook', category: 'social', link: 'https://web.facebook.com/hengki.kena.algo/?_rdc=1&_rdr#', order_index: 4 },
];

// Animated value component
const AnimatedValue: React.FC<{ value: string }> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        animateValue();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateValue = () => {
        // Extract numeric part
        const numericMatch = value.match(/[\d,]+/);
        if (!numericMatch) {
            setDisplayValue(value);
            return;
        }

        const numericStr = numericMatch[0].replace(/,/g, '');
        const targetNum = parseInt(numericStr);
        const suffix = value.replace(numericMatch[0], '');
        const hasCommas = numericMatch[0].includes(',');

        const duration = 2000;
        const startTime = Date.now();

        const update = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(targetNum * easeOutQuart);

            const formatted = hasCommas ? currentValue.toLocaleString() : currentValue.toString();
            setDisplayValue(formatted + suffix);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    return <span ref={ref}>{displayValue}</span>;
};

const platformColors: Record<string, string> = {
    facebook: 'from-blue-500 to-blue-600',
    instagram: 'from-pink-500 to-purple-600',
    tiktok: 'from-slate-800 to-pink-500',
    shopee: 'from-orange-500 to-red-500',
    tokopedia: 'from-green-500 to-green-600',
    youtube: 'from-red-500 to-red-600',
    twitter: 'from-sky-400 to-sky-500',
    default: 'from-primary to-secondary',
};

const Achievements: React.FC = () => {
    // Statis untuk reliabilitas 100% tanpa risiko server Supabase ngedrop (Zero-Downtime Guarantee)
    const achievements = defaultAchievements;

    return (
        <section id="achievements" className="py-20 bg-gradient-to-b from-dark to-surface relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[150px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                            <Trophy className="w-4 h-4" />
                            Pencapaian
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Milestone</span> & Achievements
                        </h2>
                        <p className="text-textMuted max-w-2xl mx-auto">
                            Jejak perjalanan dan pencapaian dalam membangun komunitas, bisnis, dan personal branding.
                        </p>
                    </div>
                </Reveal>

                <Reveal width="100%">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {achievements.map((achievement, index) => {
                            const gradientColor = platformColors[achievement.platform] || platformColors.default;

                            return (
                                <div
                                    key={achievement.id}
                                    className="group relative bg-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Gradient top border */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${gradientColor}`} />

                                    {/* Icon */}
                                    <div className="text-4xl mb-3">{achievement.icon}</div>

                                    {/* Value */}
                                    <div className={`text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradientColor} mb-1`}>
                                        <AnimatedValue value={achievement.value} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-textMain font-semibold text-sm md:text-base mb-1">
                                        {achievement.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-textMuted text-xs md:text-sm">
                                        {achievement.description}
                                    </p>

                                    {/* Link */}
                                    {achievement.link && (
                                        <a
                                            href={achievement.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default Achievements;
