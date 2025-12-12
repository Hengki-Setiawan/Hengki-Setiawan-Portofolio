import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit, Search, Loader2, FileText, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    is_published: boolean;
    created_at: string;
    views: number;
}

const AdminArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error('Gagal memuat artikel');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setArticles(articles.filter(article => article.id !== id));
            toast.success('Artikel berhasil dihapus');
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Gagal menghapus artikel');
        }
    };

    const handleSave = async () => {
        if (!currentArticle.title || !currentArticle.slug || !currentArticle.content) {
            toast.error('Mohon lengkapi data wajib (Judul, Slug, Konten)');
            return;
        }

        try {
            const articleData = {
                title: currentArticle.title,
                slug: currentArticle.slug,
                excerpt: currentArticle.excerpt,
                content: currentArticle.content,
                cover_image: currentArticle.cover_image,
                is_published: currentArticle.is_published || false,
                updated_at: new Date().toISOString(),
            };

            if (currentArticle.id) {
                // Update
                const { error } = await supabase
                    .from('articles')
                    .update(articleData)
                    .eq('id', currentArticle.id);
                if (error) throw error;
                toast.success('Artikel berhasil diperbarui');
            } else {
                // Create
                const { error } = await supabase
                    .from('articles')
                    .insert([articleData]);
                if (error) throw error;
                toast.success('Artikel berhasil dibuat');
            }

            setIsEditing(false);
            setCurrentArticle({});
            fetchArticles();
        } catch (error) {
            console.error('Error saving article:', error);
            toast.error('Gagal menyimpan artikel');
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        {currentArticle.id ? 'Edit Artikel' : 'Buat Artikel Baru'}
                    </h1>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="bg-surface border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Judul</label>
                            <input
                                type="text"
                                value={currentArticle.title || ''}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Slug (URL)</label>
                            <input
                                type="text"
                                value={currentArticle.slug || ''}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Cover Image URL</label>
                        <input
                            type="text"
                            value={currentArticle.cover_image || ''}
                            onChange={(e) => setCurrentArticle({ ...currentArticle, cover_image: e.target.value })}
                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Ringkasan (Excerpt)</label>
                        <textarea
                            value={currentArticle.excerpt || ''}
                            onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Konten (Markdown)</label>
                        <textarea
                            value={currentArticle.content || ''}
                            onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary h-64 font-mono text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={currentArticle.is_published || false}
                            onChange={(e) => setCurrentArticle({ ...currentArticle, is_published: e.target.checked })}
                            className="rounded border-white/10 bg-dark text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_published" className="text-white">Publikasikan</label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Artikel Blog</h1>
                    <p className="text-slate-400">Kelola artikel dan konten blog</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentArticle({});
                        setIsEditing(true);
                    }}
                    className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Buat Artikel
                </button>
            </div>

            <div className="bg-surface border border-white/10 rounded-xl p-6">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 px-4 text-slate-400 font-medium">Judul</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium">Status</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium">Views</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium">Tanggal</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-white font-medium">{article.title}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {article.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-300">{article.views}</td>
                                        <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                                            {format(new Date(article.created_at), 'dd MMM yyyy', { locale: id })}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setCurrentArticle(article);
                                                        setIsEditing(true);
                                                    }}
                                                    className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredArticles.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            Tidak ada artikel ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminArticles;
