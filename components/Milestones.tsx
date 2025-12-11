import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Calendar } from 'lucide-react';
import Reveal from './Reveal';

interface Milestone {
    id: string;
    year: string;
    month: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    order_index: number;
}

const defaultMilestones: Milestone[] = [
    { id: '1', year: '2024', month: 'Des', title: 'Portfolio Website Launch', description: 'Website portfolio profesional', icon: '🌐', category: 'personal', order_index: 1 },
    { id: '2', year: '2024', month: 'Okt', title: '365K Anggota Grup', description: 'Grup Kami Depresi terus berkembang', icon: '🎉', category: 'community', order_index: 2 },
    { id: '3', year: '2024', month: 'Jun', title: 'Star Seller Tokopedia', description: 'Mendapat badge Star Seller', icon: '⭐', category: 'business', order_index: 3 },
];

const categoryColors: Record<string, string> = {
    business: 'border-orange-500 bg-orange-500/10',
    education: 'border-blue-500 bg-blue-500/10',
    community: 'border-green-500 bg-green-500/10',
    personal: 'border-purple-500 bg-purple-500/10',
    default: 'border-primary bg-primary/10',
};

const Milestones: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const { data, error } = await supabase
                    .from('milestones')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    setMilestones(data);
                }
            } catch (error) {
                console.error('Error fetching milestones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMilestones();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-surface">
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    return (
        <section id="milestones" className="py-20 bg-surface relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
                            <Calendar className="w-4 h-4" />
                            Timeline
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Perjalanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Menuju Kesuksesan</span>
                        </h2>
                    </div>
                </Reveal>

                {/* Timeline */}
                <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

                    <div className="space-y-12 md:space-y-0">
                        {milestones.map((milestone, index) => {
                            const colorClass = categoryColors[milestone.category] || categoryColors.default;
                            const isEven = index % 2 === 0;

                            return (
                                <Reveal key={milestone.id}>
                                    <div className={`relative flex items-center md:justify-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} mb-8 md:mb-0`}>
                                        {/* Content */}
                                        <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-8 md:pl-0`}>
                                            <div className={`p-6 rounded-2xl border-l-4 md:border-l-0 ${isEven ? 'md:border-r-4' : 'md:border-l-4'} ${colorClass} backdrop-blur-sm bg-surface/50 hover:bg-surface/80 transition-colors duration-300`}>
                                                <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                                                    <span className="text-3xl">{milestone.icon}</span>
                                                    <div>
                                                        <span className="text-primary font-mono text-sm font-bold">{milestone.year}</span>
                                                        {milestone.month && (
                                                            <span className="text-slate-400 text-sm ml-1">• {milestone.month}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">{milestone.description}</p>
                                            </div>
                                        </div>

                                        {/* Center dot - Desktop */}
                                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-dark border-4 border-primary z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

                                        {/* Center dot - Mobile */}
                                        <div className="md:hidden absolute left-0 top-8 w-4 h-4 rounded-full bg-primary border-2 border-dark z-10" />

                                        {/* Mobile Line Connector */}
                                        <div className="md:hidden absolute left-2 top-10 bottom-[-40px] w-0.5 bg-white/10" />
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Milestones;
