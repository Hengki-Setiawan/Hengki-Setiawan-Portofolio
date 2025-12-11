import React, { useState, useEffect, useRef } from 'react';
import {
    ShoppingBag,
    Users,
    Instagram,
    Linkedin,
    Github,
    MessageCircle,
    Mail,
    ExternalLink,
    Star,
    Heart,
    Globe,
    TrendingUp,
    Eye
} from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

// Default stats values (used as fallback)
const DEFAULT_STATS: Record<string, number> = {
    fb_depresi: 365100,
    fb_bahagia: 237400,
    fb_skizo: 57600,
    shopee_sold: 1250,
    tokopedia_chat: 98,
    instagram: 1200,
    tiktok: 5400,
    linkedin: 500,
    github: 15,
};

// Hook to fetch social stats from Supabase
const useSocialStats = () => {
    const [stats, setStats] = useState<Record<string, number>>(DEFAULT_STATS);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase
                    .from('social_stats')
                    .select('key, value');

                if (error) {
                    console.log('Using default stats (table may not exist yet)');
                    return;
                }

                if (data && data.length > 0) {
                    const statsMap: Record<string, number> = { ...DEFAULT_STATS };
                    data.forEach((item: { key: string; value: number }) => {
                        statsMap[item.key] = item.value;
                    });
                    setStats(statsMap);
                }
            } catch (err) {
                console.log('Using default stats');
            }
        };

        fetchStats();
    }, []);

    return stats;
};

// Helper for counting animation
const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

            setCount(Math.floor(easeOutQuart(percentage) * end));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isVisible]);

    return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

const Connect: React.FC = () => {
    const stats = useSocialStats();
    const totalCommunity = stats.fb_depresi + stats.fb_bahagia + stats.fb_skizo;

    return (
        <section id="connect" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Reveal width="100%">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Connect & <span className="text-primary">Collaborate</span>
                        </h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            Bergabung dengan komunitas kami yang terus berkembang. Data di bawah ini diupdate secara <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full text-sm animate-pulse">LIVE</span>
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Column 1: Official Store */}
                    <div className="space-y-8">
                        <Reveal delay={0.1} width="100%">
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-slate-800">Official Store</h3>
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </div>
                        </Reveal>

                        {/* Shopee Card */}
                        <Reveal delay={0.2} width="100%">
                            <a
                                href="https://shopee.co.id/kaos_kami"
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border border-orange-100 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                                    STAR SELLER
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-orange-200 shadow-lg p-2">
                                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                                            <path d="M33.614 15.3c0 .3.3.5.5.5h6.4c.3 0 .5-.2.5-.5 0-3.9-3.1-7.1-7-7.1H14c-3.9 0-7 3.2-7 7.1 0 .3.2.5.5.5h6.4c.3 0 .5-.2.5-.5 0-1.6 1.3-2.9 2.9-2.9h13.4c1.6 0 2.9 1.3 2.9 2.9z" fill="currentColor" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M33.614 15.3H14.386C6.44 15.3 0 21.74 0 29.686v3.628c0 7.946 6.44 14.386 14.386 14.386h19.228c7.946 0 14.386-6.44 14.386-14.386v-3.628c0-7.946-6.44-14.386-14.386-14.386zM25.5 35.5c-2.5 0-4.5-1.6-4.5-3.5s2-3.5 4.5-3.5 4.5 1.6 4.5 3.5-2 3.5-4.5 3.5z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 mb-1">Total Terjual</div>
                                        <div className="text-xl font-bold text-slate-800 flex items-center justify-end gap-1">
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            <CountUp end={stats.shopee_sold} suffix="+" />
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">Kaos Kami</h4>

                                <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4 bg-yellow-50 inline-flex px-2 py-1 rounded-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold text-slate-700">4.9</span>
                                    <span className="text-slate-400 text-xs ml-1">Rating Toko</span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-green-500" />
                                        <span className="text-xs"><span className="font-bold text-green-600">12</span> orang melihat</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </a>
                        </Reveal>

                        {/* Tokopedia Card */}
                        <Reveal delay={0.3} width="100%">
                            <a
                                href="https://www.tokopedia.com/kaos-kami"
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border border-green-100 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                                    POWER MERCHANT
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-green-200 shadow-lg p-2">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <path d="M21.7 10.2c-.1-.2-.2-.4-.4-.5-.2-.2-.5-.2-.7-.1l-1.3.5c-.3-1.6-1.1-3.1-2.2-4.3-.6-.6-1.3-1.1-2-1.5-1.1-.6-2.3-.9-3.6-.9s-2.5.3-3.6.9c-.7.4-1.4.9-2 1.5-1.1 1.2-1.9 2.7-2.2 4.3l-1.3-.5c-.2-.1-.5 0-.7.1-.2.1-.4.3-.4.5-.1.2-.1.5 0 .7l1.1 2.6c.1.2.3.3.5.3h.1c.2 0 .4-.1.5-.2l.6-.6c.7 2.2 2.3 4.1 4.5 5.1v.1c0 .1 0 .2.1.2.1.1.2.2.3.2h.1c.1 0 .2-.1.3-.2.1-.1.1-.2.1-.3v-.1c.6-.1 1.3-.3 1.9-.6.6.3 1.3.5 1.9.6v.1c0 .1 0 .2.1.3.1.1.2.2.3.2h.1c.1 0 .2-.1.3-.2.1-.1.1-.2.1-.2v-.1c2.2-1 3.8-2.9 4.5-5.1l.6.6c.1.1.3.2.5.2h.1c.2 0 .4-.1.5-.3l1.1-2.6c.2-.2.2-.5.1-.7zM8.5 11c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 mb-1">Performa Chat</div>
                                        <div className="text-xl font-bold text-slate-800">
                                            <CountUp end={stats.tokopedia_chat} suffix="%" />
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-green-500 transition-colors">Kaos Kami</h4>

                                <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4 bg-yellow-50 inline-flex px-2 py-1 rounded-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold text-slate-700">5.0</span>
                                    <span className="text-slate-400 text-xs ml-1">Perfect Score</span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-green-600 font-medium">Online Sekarang</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </a>
                        </Reveal>
                    </div>

                    {/* Column 2: Communities */}
                    <div className="space-y-6">
                        <Reveal delay={0.2} width="100%">
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-slate-800">Community</h3>
                                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    3 Groups
                                </span>
                            </div>
                        </Reveal>

                        {/* Depresi Group */}
                        <Reveal delay={0.3} width="100%">
                            <a
                                href="https://www.facebook.com/groups/1066750060883536"
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-slate-200 hover:-translate-y-1"
                            >
                                <div className="h-20 relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600">
                                    <img src="/images/kami-depresi.png" alt="Kami Depresi Cover" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-2 left-4 text-white">
                                        <div className="font-bold text-sm">Grup Publik · Facebook</div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Kami Depresi</h4>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 ring-2 ring-white flex items-center justify-center text-[8px] text-white font-bold">
                                                    {i}K
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600"><CountUp end={stats.fb_depresi} /></div>
                                            <div className="text-[10px] text-slate-500 uppercase font-semibold">Anggota</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Reveal>

                        {/* Bahagia Group */}
                        <Reveal delay={0.4} width="100%">
                            <a
                                href="https://www.facebook.com/groups/610974693984891"
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-slate-200 hover:-translate-y-1"
                            >
                                <div className="h-20 relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500">
                                    <img src="/images/kami-bahagia.png" alt="Kami Bahagia Cover" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-2 left-4 text-white">
                                        <div className="font-bold text-sm">Grup Publik · Facebook</div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">Kami Bahagia</h4>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-yellow-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Heart className="w-4 h-4 text-red-400" />
                                            <span>Komunitas positif</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-yellow-600"><CountUp end={stats.fb_bahagia} /></div>
                                            <div className="text-[10px] text-slate-500 uppercase font-semibold">Anggota</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Reveal>

                        {/* Skizo Group */}
                        <Reveal delay={0.5} width="100%">
                            <a
                                href="https://www.facebook.com/groups/3307589206129666"
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-slate-200 hover:-translate-y-1"
                            >
                                <div className="h-20 relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
                                    <img src="/images/kami-skizo.png" alt="Kami Skizo Cover" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-2 left-4 flex items-center gap-2">
                                        <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>
                                        <div className="text-white font-bold text-sm">Grup Publik</div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Kami Skizo</h4>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Users className="w-4 h-4 text-purple-400" />
                                            <span>Growing fast!</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-purple-600"><CountUp end={stats.fb_skizo} suffix="+" /></div>
                                            <div className="text-[10px] text-slate-500 uppercase font-semibold">Anggota</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Reveal>

                        {/* Total Stats Summary */}
                        <Reveal delay={0.6} width="100%">
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-xl p-5 text-white shadow-xl">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-1">
                                        <CountUp end={totalCommunity} suffix="+" />
                                    </div>
                                    <div className="text-sm opacity-90">Total Komunitas Member</div>
                                    <div className="text-xs opacity-70 mt-2">🚀 Meme Creator & Community Builder</div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Column 3: Socials & Contact */}
                    <div className="space-y-8">
                        <Reveal delay={0.3} width="100%">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-slate-800">Social & Contact</h3>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Instagram */}
                            <Reveal delay={0.4} width="100%">
                                <a href="https://www.instagram.com/hengkimiau?igsh=MW9ycDR2NW1ueXZ0eg==" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center group relative overflow-hidden">
                                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-600 group-hover:text-white transition-colors z-10">
                                        <Instagram className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm z-10">Instagram</span>
                                    <span className="text-xs text-slate-500 z-10">@hengkimiau</span>
                                    <div className="mt-2 text-sm font-bold text-slate-800 z-10"><CountUp end={stats.instagram} /> Followers</div>

                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </a>
                            </Reveal>

                            {/* TikTok */}
                            <Reveal delay={0.5} width="100%">
                                <a href="https://www.tiktok.com/@hengki.skizo?_r=1&_t=ZS-925xeJRk7dd" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center group relative overflow-hidden">
                                    <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors z-10">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm z-10">TikTok</span>
                                    <span className="text-xs text-slate-500 z-10">@hengki.skizo</span>
                                    <div className="mt-2 text-sm font-bold text-slate-800 z-10"><CountUp end={stats.tiktok} /> Likes</div>
                                </a>
                            </Reveal>

                            {/* LinkedIn */}
                            <Reveal delay={0.6} width="100%">
                                <a href="https://www.linkedin.com/in/hengki-setiawan-8064a6353" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center group">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">LinkedIn</span>
                                    <div className="mt-2 text-sm font-bold text-slate-800"><CountUp end={stats.linkedin} suffix="+" /> Conn</div>
                                </a>
                            </Reveal>

                            {/* GitHub */}
                            <Reveal delay={0.7} width="100%">
                                <a href="https://github.com/Hengki-Setiawan" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center group">
                                    <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                        <Github className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">GitHub</span>
                                    <div className="mt-2 text-sm font-bold text-slate-800"><CountUp end={stats.github} /> Repos</div>
                                </a>
                            </Reveal>
                        </div>

                        {/* Direct Contact List */}
                        <Reveal delay={0.8} width="100%">
                            <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-primary" />
                                    Direct Contact
                                </h4>
                                <div className="space-y-3">
                                    <a href="https://wa.me/62895803463032" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium">0895-8034-63032 (WA)</span>
                                    </a>
                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium">0895-8034-63032 (Telegram)</span>
                                    </div>
                                    <a href="mailto:Hengkisetiawam461@gmail.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                        <div className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium">Hengkisetiawam461@gmail.com</span>
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Connect;
