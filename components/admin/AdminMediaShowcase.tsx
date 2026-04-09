import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Plus, Trash2, Save, RefreshCw, Loader2, Film, Upload, ExternalLink, GripVertical } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    media_type: 'video' | 'gif' | 'image';
    media_url: string;
    thumbnail_url: string | null;
    platform: string;
    external_link: string | null;
    order_index: number;
    is_active: boolean;
}

const mediaTypeOptions = [
    { value: 'video', label: '🎬 Video' },
    { value: 'gif', label: '🎭 GIF' },
    { value: 'image', label: '🖼️ Image' },
];

const platformOptions = [
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'shopee', label: 'Shopee' },
    { value: 'tokopedia', label: 'Tokopedia' },
    { value: 'other', label: 'Lainnya' },
];

const AdminMediaShowcase: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const { data, error } = await db
                .from('media_showcase')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setMediaItems(data || []);
        } catch (err: any) {
            showToast(err.message || 'Failed to load media', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleChange = (id: string, field: keyof MediaItem, value: any) => {
        setMediaItems(prev =>
            prev.map(m => m.id === id ? { ...m, [field]: value } : m)
        );
    };

    const handleFileUpload = async (id: string, file: File) => {
        setUploading(id);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `media_${Date.now()}.${fileExt}`;
            const filePath = `media/${fileName}`;

            const { error: uploadError } = await db.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = db.storage
                .from('images')
                .getPublicUrl(filePath);

            handleChange(id, 'media_url', publicUrl);
            showToast('File berhasil diupload!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Upload failed', 'error');
        } finally {
            setUploading(null);
        }
    };

    const handleAdd = () => {
        const newMedia: MediaItem = {
            id: `new-${Date.now()}`,
            title: '',
            description: '',
            media_type: 'video',
            media_url: '',
            thumbnail_url: null,
            platform: 'tiktok',
            external_link: null,
            order_index: mediaItems.length + 1,
            is_active: true,
        };
        setMediaItems(prev => [...prev, newMedia]);
    };

    const handleDelete = async (id: string) => {
        if (id.startsWith('new-')) {
            setMediaItems(prev => prev.filter(m => m.id !== id));
            return;
        }

        try {
            const { error } = await db.from('media_showcase').delete().eq('id', id);
            if (error) throw error;
            setMediaItems(prev => prev.filter(m => m.id !== id));
            showToast('Media dihapus', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const media of mediaItems) {
                if (!media.title || !media.media_url) continue;

                const { id, ...data } = media;

                if (id.startsWith('new-')) {
                    const { error } = await db.from('media_showcase').insert(data);
                    if (error) throw error;
                } else {
                    const { error } = await db
                        .from('media_showcase')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Semua media berhasil disimpan!', 'success');
            fetchMedia();
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
                    <h1 className="text-3xl font-bold text-slate-900">Media Showcase</h1>
                    <p className="text-slate-500 mt-1">Kelola video, GIF, dan gambar yang tampil di website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchMedia}
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
                        Tambah Media
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
                {mediaItems.map((media) => (
                    <div key={media.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-slate-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Preview */}
                            <div className="flex-shrink-0 w-40 h-24 bg-slate-100 rounded-lg overflow-hidden">
                                {media.media_url ? (
                                    media.media_type === 'video' ? (
                                        <video src={media.media_url} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={media.media_url} alt="" className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Film className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Title & Description */}
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={media.title}
                                        onChange={(e) => handleChange(media.id, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                                        placeholder="Judul Media"
                                    />
                                    <input
                                        type="text"
                                        value={media.description}
                                        onChange={(e) => handleChange(media.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Deskripsi singkat"
                                    />
                                </div>

                                {/* Media URL & Upload */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={media.media_type}
                                            onChange={(e) => handleChange(media.id, 'media_type', e.target.value)}
                                            className="w-28 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {mediaTypeOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={media.platform}
                                            onChange={(e) => handleChange(media.id, 'platform', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {platformOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={media.media_url}
                                            onChange={(e) => handleChange(media.id, 'media_url', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                                            placeholder="URL media atau upload"
                                        />
                                        <label className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-slate-600 text-sm">
                                            {uploading === media.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                            <input
                                                type="file"
                                                accept="video/*,image/*,.gif"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(media.id, e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* External Link & Actions */}
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        value={media.external_link || ''}
                                        onChange={(e) => handleChange(media.id, 'external_link', e.target.value || null)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Link eksternal (optional)"
                                    />
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={media.is_active}
                                                onChange={(e) => handleChange(media.id, 'is_active', e.target.checked)}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm text-slate-600">Aktif</span>
                                        </label>
                                        <button
                                            onClick={() => handleDelete(media.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {mediaItems.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Film className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Belum ada media. Klik "Tambah Media" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMediaShowcase;
