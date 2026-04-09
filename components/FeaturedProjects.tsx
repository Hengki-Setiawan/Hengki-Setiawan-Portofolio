import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ExternalLink, Github, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { staticProjects, Website } from '../lib/projects';

const FeaturedProjects: React.FC = () => {
    const [projects, setProjects] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await db
                    .from('projects')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (error) throw error;
                
                if (data && data.length > 0) {
                    const formatted = data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        thumbnail_url: p.image_url,
                        url: p.link,
                        github_url: p.github_link,
                        technologies: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []),
                        status: 'live',
                        featured: !!p.is_featured,
                        category: p.category,
                        is_active: true
                    } as any));
                    
                    const featured = formatted.filter((p: any) => p.featured).slice(0, 4);
                    setProjects(featured.length > 0 ? featured : formatted.slice(0, 4));
                } else {
                    // Fallback to static if DB is empty (though we just seeded it)
                    const activeProjects = staticProjects.filter(p => p.is_active);
                    let featured = activeProjects.filter(p => p.featured);
                    setProjects(featured.length > 0 ? featured.slice(0, 4) : activeProjects.slice(0, 4));
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-dark">
                <div className="max-w-6xl mx-auto px-4 flex justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </section>
        );
    }

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="py-24 bg-dark relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                        Portfolio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-textMain mt-3">
                        Featured <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Projects</span>
                    </h2>
                    <p className="text-textMuted mt-4 max-w-lg mx-auto">
                        Proyek-proyek terbaik yang telah saya bangun — dari MoodLab hingga sistem SCM
                    </p>
                </motion.div>

                {/* Projects Grid — Bento-style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group relative glass-card rounded-2xl overflow-hidden ${
                                index === 0 ? 'md:col-span-2' : ''
                            }`}
                        >
                            {/* Thumbnail */}
                            <div className={`relative overflow-hidden ${index === 0 ? 'h-64 md:h-80' : 'h-52'}`}>
                                {project.thumbnail_url ? (
                                    <img
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                        <span className="text-4xl opacity-30">🌐</span>
                                    </div>
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent" />

                                {/* Status badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                                        project.status === 'live'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : project.status === 'maintenance'
                                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                        {project.status === 'live' ? '● Live' : project.status === 'maintenance' ? '● Maintenance' : '● Archived'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-textMain group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-textMuted text-sm mt-2 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                    {project.url && (
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/50 transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {/* Tech Stack Badges */}
                                {(project as any).technologies && (project as any).technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {(project as any).technologies.slice(0, 5).map((tech: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/5 text-primary border border-primary/10"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/websites"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-textMain font-medium hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                        View All Projects
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
