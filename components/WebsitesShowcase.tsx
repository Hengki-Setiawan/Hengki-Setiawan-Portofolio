import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ExternalLink, Loader2, Globe, Star } from 'lucide-react';
import Reveal from './Reveal';

import { staticProjects, Website } from '../lib/projects';

const categoryColors: Record<string, string> = {
    ecommerce: 'from-orange-500 to-red-500',
    corporate: 'from-blue-500 to-indigo-500',
    portfolio: 'from-purple-500 to-pink-500',
    landing: 'from-green-500 to-teal-500',
    blog: 'from-yellow-500 to-orange-500',
    default: 'from-primary to-secondary',
};

const statusBadge: Record<string, { text: string; color: string }> = {
    live: { text: 'Live', color: 'bg-green-500' },
    maintenance: { text: 'Maintenance', color: 'bg-yellow-500' },
    archived: { text: 'Archived', color: 'bg-slate-500' },
};

const WebsitesShowcase: React.FC = () => {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi network delay minimal atau bisa langsung di set
        setWebsites(staticProjects.filter(p => p.is_active));
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-dark">
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (websites.length === 0) {
        return null;
    }

    return (
        <section id="websites" className="py-20 bg-gradient-to-b from-dark to-surface relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                            <Globe className="w-4 h-4" />
                            Website Saya
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4">
                            Website yang Pernah <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Saya Buat</span>
                        </h2>
                        <p className="text-textMuted max-w-2xl mx-auto">
                            Kumpulan website dan project yang telah saya kembangkan untuk berbagai kebutuhan bisnis.
                        </p>
                    </div>
                </Reveal>

                <Reveal width="100%">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websites.map((website) => {
                            const gradientColor = categoryColors[website.category] || categoryColors.default;
                            const statusInfo = statusBadge[website.status] || statusBadge.live;

                            return (
                                <div
                                    key={website.id}
                                    className="group relative bg-surface/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                        {website.thumbnail_url ? (
                                            <img
                                                src={website.thumbnail_url}
                                                alt={website.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                                <Globe className="w-16 h-16 text-slate-600" />
                                            </div>
                                        )}

                                        {/* Featured badge */}
                                        {website.featured && (
                                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                Featured
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${statusInfo.color} text-white text-xs font-medium flex items-center gap-1`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                            {statusInfo.text}
                                        </div>

                                        {/* Category badge */}
                                        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${gradientColor} text-white text-xs font-medium uppercase`}>
                                            {website.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-textMain mb-2">{website.title}</h3>
                                        <p className="text-textMuted text-sm mb-4 line-clamp-2">{website.description}</p>

                                        {/* Technologies */}
                                        {website.technologies && website.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {website.technologies.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {website.technologies.length > 3 && (
                                                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs">
                                                        +{website.technologies.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Visit button */}
                                        <a
                                            href={website.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradientColor} text-white text-sm font-medium hover:shadow-lg transition-shadow w-full justify-center`}
                                        >
                                            Kunjungi Website
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default WebsitesShowcase;
