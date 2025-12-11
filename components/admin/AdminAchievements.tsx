import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, RefreshCw, Loader2, Trophy, ExternalLink, GripVertical } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Achievement {
    id: string;
    title: string;
    description: string;
    value: string;
    icon: string;
    platform: string;
    category: string;
    link: string | null;
    order_index: number;
    is_active: boolean;
}

const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'shopee', label: 'Shopee' },
    { value: 'tokopedia', label: 'Tokopedia' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'other', label: 'Lainnya' },
];

const categoryOptions = [
    { value: 'community', label: '👥 Komunitas' },
    { value: 'sales', label: '🛒 Penjualan' },
    { value: 'social', label: '📱 Social Media' },
    { value: 'certification', label: '🏆 Sertifikasi' },
    { value: 'other', label: '✨ Lainnya' },
];

const AdminAchievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setAchievements(data || []);
        } catch (err: any) {
            showToast(err.message || 'Failed to load achievements', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleChange = (id: string, field: keyof Achievement, value: any) => {
        setAchievements(prev =>
            prev.map(a => a.id === id ? { ...a, [field]: value } : a)
        );
    };

    const handleAdd = () => {
        const newAchievement: Achievement = {
            id: `new-${Date.now()}`,
            title: '',
            description: '',
            value: '',
            icon: '🏆',
            platform: 'other',
            category: 'other',
            link: null,
            order_index: achievements.length + 1,
            is_active: true,
        };
        setAchievements(prev => [...prev, newAchievement]);
    };

    const handleDelete = async (id: string) => {
        if (id.startsWith('new-')) {
            setAchievements(prev => prev.filter(a => a.id !== id));
            return;
        }

        try {
            const { error } = await supabase.from('achievements').delete().eq('id', id);
            if (error) throw error;
            setAchievements(prev => prev.filter(a => a.id !== id));
            showToast('Achievement dihapus', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const achievement of achievements) {
                const { id, ...data } = achievement;

                if (id.startsWith('new-')) {
                    const { error } = await supabase.from('achievements').insert(data);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('achievements')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Semua achievement berhasil disimpan!', 'success');
            fetchAchievements();
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
                    <h1 className="text-3xl font-bold text-slate-900">Achievements</h1>
                    <p className="text-slate-500 mt-1">Kelola pencapaian dan milestone yang tampil di website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchAchievements}
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
                        Tambah
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
                {achievements.map((achievement, index) => (
                    <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-slate-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Icon & Title */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={achievement.icon}
                                            onChange={(e) => handleChange(achievement.id, 'icon', e.target.value)}
                                            className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-center text-2xl"
                                            placeholder="🏆"
                                        />
                                        <input
                                            type="text"
                                            value={achievement.title}
                                            onChange={(e) => handleChange(achievement.id, 'title', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                            placeholder="Judul Achievement"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={achievement.description}
                                        onChange={(e) => handleChange(achievement.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Deskripsi singkat"
                                    />
                                </div>

                                {/* Value & Platform */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={achievement.value}
                                        onChange={(e) => handleChange(achievement.id, 'value', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                                        placeholder="365K+ atau ⭐"
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            value={achievement.platform}
                                            onChange={(e) => handleChange(achievement.id, 'platform', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {platformOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={achievement.category}
                                            onChange={(e) => handleChange(achievement.id, 'category', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        >
                                            {categoryOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Link & Status */}
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        value={achievement.link || ''}
                                        onChange={(e) => handleChange(achievement.id, 'link', e.target.value || null)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="https://... (optional)"
                                    />
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={achievement.is_active}
                                                onChange={(e) => handleChange(achievement.id, 'is_active', e.target.checked)}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm text-slate-600">Aktif</span>
                                        </label>
                                        <button
                                            onClick={() => handleDelete(achievement.id)}
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

                {achievements.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Belum ada achievement. Klik "Tambah" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAchievements;
