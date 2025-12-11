import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, Image, Type, Link as LinkIcon, Loader2, Upload } from 'lucide-react';
import { useToast } from '../ui/Toast';
import ImageUpload from '../ui/ImageUpload';

interface ContentItem {
    id: string;
    section: string;
    key: string;
    value: string | null;
    image_url: string | null;
    order_index: number;
}

const AdminHero: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('section', 'hero')
                .order('order_index', { ascending: true });

            if (error) throw error;

            const contentMap: Record<string, string> = {};
            data?.forEach((item: ContentItem) => {
                contentMap[item.key] = item.value || item.image_url || '';
            });
            setContent(contentMap);
        } catch (err: any) {
            showToast(err.message || 'Failed to fetch content', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            for (const [key, value] of Object.entries(content)) {
                const isImageField = key === 'main_image';
                const updateData = isImageField
                    ? { image_url: value, updated_at: new Date().toISOString() }
                    : { value: value, updated_at: new Date().toISOString() };

                const { error } = await supabase
                    .from('site_content')
                    .upsert({
                        section: 'hero',
                        key: key,
                        ...updateData
                    }, {
                        onConflict: 'section,key'
                    });

                if (error) throw error;
            }

            showToast('Hero content berhasil disimpan!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Gagal menyimpan content', 'error');
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
                    <h1 className="text-3xl font-bold text-slate-900">Hero Section</h1>
                    <p className="text-slate-500 mt-1">Edit konten yang tampil di bagian Hero website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchContent}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Menyimpan...' : 'Simpan Semua'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Teks Header</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Greeting Badge</label>
                            <input
                                type="text"
                                value={content.greeting || ''}
                                onChange={(e) => handleChange('greeting', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="👋 Selamat Datang..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hello Text</label>
                            <input
                                type="text"
                                value={content.hello_text || ''}
                                onChange={(e) => handleChange('hello_text', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Hello,"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Depan (Gradient)</label>
                            <input
                                type="text"
                                value={content.name_first || ''}
                                onChange={(e) => handleChange('name_first', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Hengki"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                            <input
                                type="text"
                                value={content.name_last || ''}
                                onChange={(e) => handleChange('name_last', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Setiawan"
                            />
                        </div>
                    </div>
                </div>

                {/* Roles Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Role / Profesi</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role 1</label>
                            <input
                                type="text"
                                value={content.role_1 || ''}
                                onChange={(e) => handleChange('role_1', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role 2</label>
                            <input
                                type="text"
                                value={content.role_2 || ''}
                                onChange={(e) => handleChange('role_2', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role 3</label>
                            <input
                                type="text"
                                value={content.role_3 || ''}
                                onChange={(e) => handleChange('role_3', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role 4</label>
                            <input
                                type="text"
                                value={content.role_4 || ''}
                                onChange={(e) => handleChange('role_4', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Deskripsi</h2>
                    </div>
                    <textarea
                        value={content.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                        placeholder="Deskripsi singkat tentang Anda..."
                    />
                </div>

                {/* Image Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Image className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Gambar Hero</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Gambar</label>
                            <ImageUpload
                                currentImage={content.main_image}
                                onUpload={(url) => handleChange('main_image', url)}
                                folder="hero"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Atau Masukkan URL</label>
                            <input
                                type="text"
                                value={content.main_image || ''}
                                onChange={(e) => handleChange('main_image', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="/images/photo.jpg atau https://..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Path relatif (/images/xxx) atau URL lengkap</p>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LinkIcon className="w-5 h-5 text-cyan-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Tombol & Link</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol Primary</label>
                            <input
                                type="text"
                                value={content.cta_primary || ''}
                                onChange={(e) => handleChange('cta_primary', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Ayo Bicara"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol Secondary</label>
                            <input
                                type="text"
                                value={content.cta_secondary || ''}
                                onChange={(e) => handleChange('cta_secondary', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Download CV"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Link CV (URL)</label>
                            <input
                                type="text"
                                value={content.cv_url || ''}
                                onChange={(e) => handleChange('cv_url', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LinkIcon className="w-5 h-5 text-pink-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Social Media Links</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                value={content.linkedin_url || ''}
                                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                            <input
                                type="url"
                                value={content.instagram_url || ''}
                                onChange={(e) => handleChange('instagram_url', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                value={content.github_url || ''}
                                onChange={(e) => handleChange('github_url', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Badges */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Floating Badges</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-medium text-slate-700 mb-3">Badge 1 (Kiri Bawah)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Emoji</label>
                                    <input
                                        type="text"
                                        value={content.badge_1_emoji || ''}
                                        onChange={(e) => handleChange('badge_1_emoji', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="🎓"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Judul</label>
                                    <input
                                        type="text"
                                        value={content.badge_1_title || ''}
                                        onChange={(e) => handleChange('badge_1_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Mahasiswa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.badge_1_subtitle || ''}
                                        onChange={(e) => handleChange('badge_1_subtitle', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Bisnis Digital"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-medium text-slate-700 mb-3">Badge 2 (Kiri Atas)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Emoji</label>
                                    <input
                                        type="text"
                                        value={content.badge_2_emoji || ''}
                                        onChange={(e) => handleChange('badge_2_emoji', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="👑"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Teks</label>
                                    <input
                                        type="text"
                                        value={content.badge_2_text || ''}
                                        onChange={(e) => handleChange('badge_2_text', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Owner Kaos Kami"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHero;
