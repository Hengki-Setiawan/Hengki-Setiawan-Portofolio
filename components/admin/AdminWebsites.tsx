import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, RefreshCw, Loader2, Globe, Upload, GripVertical, Star } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Website {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail_url: string | null;
    category: string;
    technologies: string[];
    status: string;
    featured: boolean;
    order_index: number;
    is_active: boolean;
}

const categoryOptions = [
    { value: 'ecommerce', label: '🛒 E-commerce' },
    { value: 'corporate', label: '🏢 Corporate' },
    { value: 'portfolio', label: '💼 Portfolio' },
    { value: 'landing', label: '📄 Landing Page' },
    { value: 'blog', label: '📝 Blog' },
    { value: 'other', label: '🌐 Lainnya' },
];

const statusOptions = [
    { value: 'live', label: '✅ Live' },
    { value: 'maintenance', label: '🔧 Maintenance' },
    { value: 'archived', label: '📦 Archived' },
];

const AdminWebsites: React.FC = () => {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchWebsites = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('websites')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setWebsites(data || []);
        } catch (err: any) {
            showToast(err.message || 'Failed to load websites', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleChange = (id: string, field: keyof Website, value: any) => {
        setWebsites(prev =>
            prev.map(w => w.id === id ? { ...w, [field]: value } : w)
        );
    };

    const handleTechChange = (id: string, techString: string) => {
        const techArray = techString.split(',').map(t => t.trim()).filter(t => t);
        handleChange(id, 'technologies', techArray);
    };

    const handleFileUpload = async (id: string, file: File) => {
        setUploading(id);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `website_${Date.now()}.${fileExt}`;
            const filePath = `websites/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            handleChange(id, 'thumbnail_url', publicUrl);
            showToast('Thumbnail berhasil diupload!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Upload failed', 'error');
        } finally {
            setUploading(null);
        }
    };

    const handleAdd = () => {
        const newWebsite: Website = {
            id: `new-${Date.now()}`,
            title: '',
            description: '',
            url: '',
            thumbnail_url: null,
            category: 'ecommerce',
            technologies: [],
            status: 'live',
            featured: false,
            order_index: websites.length + 1,
            is_active: true,
        };
        setWebsites(prev => [...prev, newWebsite]);
    };

    const handleDelete = async (id: string) => {
        if (id.startsWith('new-')) {
            setWebsites(prev => prev.filter(w => w.id !== id));
            return;
        }

        try {
            const { error } = await supabase.from('websites').delete().eq('id', id);
            if (error) throw error;
            setWebsites(prev => prev.filter(w => w.id !== id));
            showToast('Website dihapus', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const website of websites) {
                if (!website.title || !website.url) continue;

                const { id, ...data } = website;

                if (id.startsWith('new-')) {
                    const { error } = await supabase.from('websites').insert(data);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('websites')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Semua website berhasil disimpan!', 'success');
            fetchWebsites();
        } catch (err: any) {
            showToast(err.message || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Website Showcase</h1>
                    <p className="text-slate-500 mt-1">Kelola website yang pernah Anda buat</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchWebsites}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Website
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {websites.map((website) => (
                    <div key={website.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-slate-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Preview */}
                            <div className="flex-shrink-0 w-40 h-24 bg-slate-100 rounded-lg overflow-hidden">
                                {website.thumbnail_url ? (
                                    <img src={website.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Globe className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Title & Description */}
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={website.title}
                                        onChange={(e) => handleChange(website.id, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                                        placeholder="Nama Website"
                                    />
                                    <textarea
                                        value={website.description}
                                        onChange={(e) => handleChange(website.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 resize-none"
                                        rows={2}
                                        placeholder="Deskripsi"
                                    />
                                </div>

                                {/* URL & Thumbnail */}
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        value={website.url}
                                        onChange={(e) => handleChange(website.id, 'url', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="https://example.com"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={website.thumbnail_url || ''}
                                            onChange={(e) => handleChange(website.id, 'thumbnail_url', e.target.value || null)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                                            placeholder="URL thumbnail"
                                        />
                                        <label className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-slate-600 text-sm">
                                            {uploading === website.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(website.id, e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={website.technologies.join(', ')}
                                        onChange={(e) => handleTechChange(website.id, e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                                        placeholder="Tech stack (pisahkan dengan koma)"
                                    />
                                </div>

                                {/* Category, Status, Toggles & Actions */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={website.category}
                                            onChange={(e) => handleChange(website.id, 'category', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {categoryOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={website.status}
                                            onChange={(e) => handleChange(website.id, 'status', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={website.featured}
                                                onChange={(e) => handleChange(website.id, 'featured', e.target.checked)}
                                                className="w-4 h-4 text-yellow-500 rounded"
                                            />
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm text-slate-600">Featured</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={website.is_active}
                                                onChange={(e) => handleChange(website.id, 'is_active', e.target.checked)}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm text-slate-600">Aktif</span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(website.id)}
                                        className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {websites.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Globe className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Belum ada website. Klik "Tambah Website" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWebsites;
