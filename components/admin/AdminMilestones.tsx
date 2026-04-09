import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Plus, Trash2, Save, RefreshCw, Loader2, Calendar, GripVertical } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Milestone {
    id: string;
    year: string;
    month: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    order_index: number;
    is_active: boolean;
}

const categoryOptions = [
    { value: 'business', label: '💼 Bisnis' },
    { value: 'education', label: '🎓 Pendidikan' },
    { value: 'community', label: '👥 Komunitas' },
    { value: 'personal', label: '✨ Personal' },
];

const monthOptions = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const AdminMilestones: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchMilestones = async () => {
        setLoading(true);
        try {
            const { data, error } = await db
                .from('milestones')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setMilestones(data || []);
        } catch (err: any) {
            showToast(err.message || 'Failed to load milestones', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, []);

    const handleChange = (id: string, field: keyof Milestone, value: any) => {
        setMilestones(prev =>
            prev.map(m => m.id === id ? { ...m, [field]: value } : m)
        );
    };

    const handleAdd = () => {
        const newMilestone: Milestone = {
            id: `new-${Date.now()}`,
            year: new Date().getFullYear().toString(),
            month: '',
            title: '',
            description: '',
            icon: '🎯',
            category: 'personal',
            order_index: milestones.length + 1,
            is_active: true,
        };
        setMilestones(prev => [...prev, newMilestone]);
    };

    const handleDelete = async (id: string) => {
        if (id.startsWith('new-')) {
            setMilestones(prev => prev.filter(m => m.id !== id));
            return;
        }

        try {
            const { error } = await db.from('milestones').delete().eq('id', id);
            if (error) throw error;
            setMilestones(prev => prev.filter(m => m.id !== id));
            showToast('Milestone dihapus', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const milestone of milestones) {
                const { id, ...data } = milestone;

                if (id.startsWith('new-')) {
                    const { error } = await db.from('milestones').insert(data);
                    if (error) throw error;
                } else {
                    const { error } = await db
                        .from('milestones')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Semua milestone berhasil disimpan!', 'success');
            fetchMilestones();
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
                    <h1 className="text-3xl font-bold text-slate-900">Timeline Milestone</h1>
                    <p className="text-slate-500 mt-1">Kelola perjalanan dan pencapaian penting</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchMilestones}
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
                {milestones.map((milestone) => (
                    <div key={milestone.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-slate-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Icon & Year/Month */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={milestone.icon}
                                            onChange={(e) => handleChange(milestone.id, 'icon', e.target.value)}
                                            className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-center text-2xl"
                                            placeholder="🎯"
                                        />
                                        <input
                                            type="text"
                                            value={milestone.year}
                                            onChange={(e) => handleChange(milestone.id, 'year', e.target.value)}
                                            className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-center"
                                            placeholder="2024"
                                        />
                                    </div>
                                    <select
                                        value={milestone.month}
                                        onChange={(e) => handleChange(milestone.id, 'month', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                    >
                                        {monthOptions.map((m, i) => (
                                            <option key={i} value={m}>{m || '-- Pilih Bulan --'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Title & Description */}
                                <div className="md:col-span-2 space-y-2">
                                    <input
                                        type="text"
                                        value={milestone.title}
                                        onChange={(e) => handleChange(milestone.id, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                                        placeholder="Judul Milestone"
                                    />
                                    <input
                                        type="text"
                                        value={milestone.description}
                                        onChange={(e) => handleChange(milestone.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                        placeholder="Deskripsi singkat"
                                    />
                                </div>

                                {/* Category & Actions */}
                                <div className="space-y-2">
                                    <select
                                        value={milestone.category}
                                        onChange={(e) => handleChange(milestone.id, 'category', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                    >
                                        {categoryOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={milestone.is_active}
                                                onChange={(e) => handleChange(milestone.id, 'is_active', e.target.checked)}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm text-slate-600">Aktif</span>
                                        </label>
                                        <button
                                            onClick={() => handleDelete(milestone.id)}
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

                {milestones.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Belum ada milestone. Klik "Tambah" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMilestones;
