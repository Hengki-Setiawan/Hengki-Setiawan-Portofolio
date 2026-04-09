import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Save, RefreshCw, Image, Type, Loader2 } from 'lucide-react';
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

const AdminAbout: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await db
                .from('site_content')
                .select('*')
                .eq('section', 'about')
                .order('order_index', { ascending: true });

            if (error) throw error;

            const contentMap: Record<string, string> = {};
            data?.forEach((item: ContentItem) => {
                if (item.key.startsWith('image_')) {
                    contentMap[`${item.key}_caption`] = item.value || '';
                    contentMap[`${item.key}_url`] = item.image_url || '';
                } else {
                    contentMap[item.key] = item.value || item.image_url || '';
                }
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
            // Process regular content
            const regularKeys = Object.keys(content).filter(k => !k.includes('image_'));
            for (const key of regularKeys) {
                const { error } = await db
                    .from('site_content')
                    .upsert({
                        section: 'about',
                        key: key,
                        value: content[key],
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'section,key'
                    });
                if (error) throw error;
            }

            // Process image content (caption + url pairs)
            const imageKeys = ['image_1', 'image_2'];
            for (const imgKey of imageKeys) {
                const caption = content[`${imgKey}_caption`] || '';
                const url = content[`${imgKey}_url`] || '';

                if (caption || url) {
                    const { error } = await db
                        .from('site_content')
                        .upsert({
                            section: 'about',
                            key: imgKey,
                            value: caption,
                            image_url: url,
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'section,key'
                        });
                    if (error) throw error;
                }
            }

            showToast('About content berhasil disimpan!', 'success');
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
                    <h1 className="text-3xl font-bold text-slate-900">About Section</h1>
                    <p className="text-slate-500 mt-1">Edit konten yang tampil di bagian "Tentang Saya"</p>
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
                {/* Section Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Header Section</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Label Section</label>
                            <input
                                type="text"
                                value={content.section_label || ''}
                                onChange={(e) => handleChange('section_label', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Tentang Saya"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Bagian 1</label>
                                <input
                                    type="text"
                                    value={content.title_1 || ''}
                                    onChange={(e) => handleChange('title_1', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                    placeholder="Lebih dari sekadar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Highlight (Warna)</label>
                                <input
                                    type="text"
                                    value={content.title_highlight || ''}
                                    onChange={(e) => handleChange('title_highlight', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                    placeholder="Mahasiswa."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Bagian 2</label>
                                <input
                                    type="text"
                                    value={content.title_2 || ''}
                                    onChange={(e) => handleChange('title_2', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                    placeholder="Seorang Praktisi Digital."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descriptions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Deskripsi</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Paragraf 1</label>
                            <textarea
                                value={content.description_1 || ''}
                                onChange={(e) => handleChange('description_1', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Halo! Saya Hengki Setiawan..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Paragraf 2</label>
                            <textarea
                                value={content.description_2 || ''}
                                onChange={(e) => handleChange('description_2', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900"
                                placeholder="Sebagai mahasiswa Bisnis Digital..."
                            />
                        </div>
                    </div>
                </div>

                {/* Carousel Images */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Image className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Gambar Carousel</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image 1 */}
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-medium text-slate-700 mb-3">Gambar 1</h3>
                            <ImageUpload
                                currentImage={content.image_1_url}
                                onUpload={(url) => handleChange('image_1_url', url)}
                                folder="about"
                            />
                            <div className="mt-3">
                                <label className="block text-sm text-slate-600 mb-1">Caption</label>
                                <input
                                    type="text"
                                    value={content.image_1_caption || ''}
                                    onChange={(e) => handleChange('image_1_caption', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                    placeholder="🏆 Juara 1 - Tim Achievement"
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm text-slate-600 mb-1">Atau URL Manual</label>
                                <input
                                    type="text"
                                    value={content.image_1_url || ''}
                                    onChange={(e) => handleChange('image_1_url', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                                    placeholder="/images/hengki-team.jpg"
                                />
                            </div>
                        </div>

                        {/* Image 2 */}
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-medium text-slate-700 mb-3">Gambar 2</h3>
                            <ImageUpload
                                currentImage={content.image_2_url}
                                onUpload={(url) => handleChange('image_2_url', url)}
                                folder="about"
                            />
                            <div className="mt-3">
                                <label className="block text-sm text-slate-600 mb-1">Caption</label>
                                <input
                                    type="text"
                                    value={content.image_2_caption || ''}
                                    onChange={(e) => handleChange('image_2_caption', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                    placeholder="✨ Pencapaian & Prestasi"
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm text-slate-600 mb-1">Atau URL Manual</label>
                                <input
                                    type="text"
                                    value={content.image_2_url || ''}
                                    onChange={(e) => handleChange('image_2_url', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                                    placeholder="/images/hengki-award.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Info Cards</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Card 1 - Pendidikan */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="font-medium text-blue-800 mb-3">📚 Card 1</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={content.card_1_title || ''}
                                    onChange={(e) => handleChange('card_1_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-slate-900"
                                    placeholder="Pendidikan"
                                />
                                <input
                                    type="text"
                                    value={content.card_1_desc || ''}
                                    onChange={(e) => handleChange('card_1_desc', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-slate-900"
                                    placeholder="Mahasiswa Bisnis Digital (UNM)"
                                />
                                <input
                                    type="text"
                                    value={content.card_1_subdesc || ''}
                                    onChange={(e) => handleChange('card_1_subdesc', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-slate-900"
                                    placeholder="Alumni SMK 4 Makassar"
                                />
                            </div>
                        </div>

                        {/* Card 2 - Fokus */}
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <h3 className="font-medium text-orange-800 mb-3">🎯 Card 2</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={content.card_2_title || ''}
                                    onChange={(e) => handleChange('card_2_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-slate-900"
                                    placeholder="Fokus Utama"
                                />
                                <input
                                    type="text"
                                    value={content.card_2_desc || ''}
                                    onChange={(e) => handleChange('card_2_desc', e.target.value)}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-slate-900"
                                    placeholder="Business Development & Tech"
                                />
                            </div>
                        </div>

                        {/* Card 3 - Pengalaman */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <h3 className="font-medium text-green-800 mb-3">💼 Card 3</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={content.card_3_title || ''}
                                    onChange={(e) => handleChange('card_3_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-green-200 rounded-lg text-slate-900"
                                    placeholder="Pengalaman"
                                />
                                <input
                                    type="text"
                                    value={content.card_3_desc || ''}
                                    onChange={(e) => handleChange('card_3_desc', e.target.value)}
                                    className="w-full px-3 py-2 border border-green-200 rounded-lg text-slate-900"
                                    placeholder="Owner, Admin & Ex-Retail"
                                />
                            </div>
                        </div>

                        {/* Card 4 - Domisili */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <h3 className="font-medium text-purple-800 mb-3">📍 Card 4</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={content.card_4_title || ''}
                                    onChange={(e) => handleChange('card_4_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg text-slate-900"
                                    placeholder="Domisili"
                                />
                                <input
                                    type="text"
                                    value={content.card_4_desc || ''}
                                    onChange={(e) => handleChange('card_4_desc', e.target.value)}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg text-slate-900"
                                    placeholder="Makassar, Indonesia"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAbout;
