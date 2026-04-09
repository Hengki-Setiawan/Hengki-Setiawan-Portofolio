import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, RefreshCw, Loader2, Rocket, GripVertical } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Venture {
    id: string;
    title: string;
    description: string;
    role: string;
    url: string;
    image_url: string | null;
    status: string;
    order_index: number;
    is_active: boolean;
}

const statusOptions = [
    { value: 'active', label: '🟢 Active' },
    { value: 'building', label: '🔧 Building' },
    { value: 'paused', label: '⏸️ Paused' },
    { value: 'archived', label: '📦 Archived' },
];

const AdminVentures: React.FC = () => {
    const [ventures, setVentures] = useState<Venture[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchVentures = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ventures')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setVentures(data || []);
        } catch (err: any) {
            showToast(err.message || 'Failed to load ventures', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentures();
    }, []);

    const handleChange = (id: string, field: keyof Venture, value: any) => {
        setVentures(prev =>
            prev.map(v => v.id === id ? { ...v, [field]: value } : v)
        );
    };

    const handleAdd = () => {
        const newVenture: Venture = {
            id: `new-${Date.now()}`,
            title: '',
            description: '',
            role: '',
            url: '',
            image_url: null,
            status: 'building',
            order_index: ventures.length + 1,
            is_active: true,
        };
        setVentures(prev => [...prev, newVenture]);
    };

    const handleDelete = async (id: string) => {
        if (id.startsWith('new-')) {
            setVentures(prev => prev.filter(v => v.id !== id));
            return;
        }

        if (!confirm('Are you sure you want to delete this venture?')) return;

        try {
            const { error } = await supabase.from('ventures').delete().eq('id', id);
            if (error) throw error;
            setVentures(prev => prev.filter(v => v.id !== id));
            showToast('Venture deleted', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const venture of ventures) {
                if (!venture.title) continue;

                const { id, ...data } = venture;

                if (id.startsWith('new-')) {
                    const { error } = await supabase.from('ventures').insert(data);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('ventures')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Ventures berhasil disimpan!', 'success');
            fetchVentures();
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
                    <h1 className="text-3xl font-bold text-slate-900">Ventures</h1>
                    <p className="text-slate-500 mt-1">Kelola bisnis dan proyek venture Anda</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchVentures}
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
                        Add Venture
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
                {ventures.map((venture) => (
                    <div key={venture.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-slate-400 mt-2">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={venture.title}
                                        onChange={(e) => handleChange(venture.id, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                                        placeholder="Nama Venture"
                                    />
                                    <textarea
                                        value={venture.description}
                                        onChange={(e) => handleChange(venture.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 resize-none"
                                        rows={2}
                                        placeholder="Deskripsi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={venture.role}
                                        onChange={(e) => handleChange(venture.id, 'role', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Role (e.g., Founder, Co-founder)"
                                    />
                                    <input
                                        type="url"
                                        value={venture.url}
                                        onChange={(e) => handleChange(venture.id, 'url', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <select
                                        value={venture.status}
                                        onChange={(e) => handleChange(venture.id, 'status', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={venture.is_active}
                                            onChange={(e) => handleChange(venture.id, 'is_active', e.target.checked)}
                                            className="w-4 h-4 text-primary rounded"
                                        />
                                        <span className="text-sm text-slate-600">Active</span>
                                    </label>
                                    <button
                                        onClick={() => handleDelete(venture.id)}
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

                {ventures.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Rocket className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Belum ada ventures. Klik "Add Venture" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminVentures;
