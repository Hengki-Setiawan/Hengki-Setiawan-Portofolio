import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Tag, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';

interface Project {
    id: number;
    category: string;
    title: string;
    image: string;
    description: string;
    link?: string;
    created_at?: string;
}

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching project:', error);
                    navigate('/404');
                } else {
                    setProject(data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <PageTransition>
            <SEO
                title={project.title}
                description={project.description}
                image={project.image}
                type="article"
            />
            <main className="min-h-screen bg-dark text-textMain font-sans">
                <Navbar />

                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className="max-w-7xl mx-auto">
                            <Reveal>
                                <Link to="/services" className="inline-flex items-center text-textMuted hover:text-primary mb-6 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali ke Portfolio
                                </Link>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                        {project.category}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-textMain mb-4 font-display">
                                    {project.title}
                                </h1>
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <Reveal delay={0.2}>
                                <div className="prose prose-lg max-w-none">
                                    <h3 className="text-2xl font-bold text-textMain mb-4">Tentang Project</h3>
                                    <p className="text-textMuted leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="mt-8 p-6 bg-surface rounded-2xl border border-slate-200">
                                        <h4 className="text-xl font-bold text-textMain mb-3">Tantangan & Solusi</h4>
                                        <p className="text-textMuted">
                                            Informasi detail mengenai tantangan teknis dan solusi yang diterapkan dalam project ini akan segera ditambahkan.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        {/* Right: Sidebar Info */}
                        <div className="lg:col-span-1">
                            <Reveal delay={0.4}>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
                                    <h3 className="text-xl font-bold text-textMain mb-6">Informasi Project</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-textMuted">Kategori</p>
                                                <p className="font-medium text-textMain">{project.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-textMuted">Tanggal</p>
                                                <p className="font-medium text-textMain">
                                                    {project.created_at ? new Date(project.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '2024'}
                                                </p>
                                            </div>
                                        </div>

                                        {project.link && (
                                            <div className="pt-6 border-t border-slate-200">
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primaryDark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
                                                >
                                                    Kunjungi Project <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </PageTransition>
    );
};

export default ProjectDetailPage;
