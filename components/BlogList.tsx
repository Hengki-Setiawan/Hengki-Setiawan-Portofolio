import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    created_at: string;
    views: number;
}

const BlogList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await db
                    .from('articles')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setArticles(data || []);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Reveal width="100%">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Artikel & <span className="text-primary">Wawasan</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Berbagi pengetahuan seputar teknologi, coding, dan pengalaman digital.
                    </p>
                </div>
            </Reveal>

            {articles.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-lg">Belum ada artikel yang diterbitkan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <Reveal key={article.id} delay={index * 0.1}>
                            <Link to={`/blog/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 h-full flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={article.cover_image || 'https://images.unsplash.com/photo-1499750310159-5b5f22138771?auto=format&fit=crop&q=80&w=800'}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(article.created_at), 'dd MMM yyyy', { locale: id })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {article.views} views
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center text-primary font-bold text-sm mt-auto group/link">
                                        Baca Selengkapnya
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
