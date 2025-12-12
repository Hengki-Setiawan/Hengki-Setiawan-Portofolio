import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import Reveal from './Reveal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface Article {
    id: string;
    title: string;
    content: string;
    cover_image: string;
    created_at: string;
    views: number;
}

const ArticleDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setArticle(data);

                // Increment views
                if (data) {
                    await supabase.rpc('increment_article_views', { article_id: data.id });
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Artikel tidak ditemukan</h2>
                <Link to="/blog" className="text-primary hover:underline">Kembali ke Blog</Link>
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <Reveal width="100%">
                <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Blog
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-slate-500 border-b border-slate-200 pb-8">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(article.created_at), 'dd MMMM yyyy', { locale: id })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {article.views} views
                        </span>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                    <img
                        src={article.cover_image || 'https://images.unsplash.com/photo-1499750310159-5b5f22138771?auto=format&fit=crop&q=80&w=1200'}
                        alt={article.title}
                        className="w-full h-[400px] object-cover"
                    />
                </div>

                <div className="prose prose-lg prose-slate max-w-none">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            </Reveal>
        </article>
    );
};

export default ArticleDetail;
