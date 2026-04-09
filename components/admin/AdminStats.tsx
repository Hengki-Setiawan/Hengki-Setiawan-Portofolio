import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Save, RefreshCw, BarChart3, Users, ShoppingBag, Globe } from 'lucide-react';

interface SocialStat {
    id: string;
    key: string;
    label: string;
    value: number;
    category: string;
    updated_at: string;
}

const AdminStats: React.FC = () => {
    const [stats, setStats] = useState<SocialStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState<Record<string, number>>({});

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await db
                .from('social_stats')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;
            setStats(data || []);

            // Initialize edited values
            const values: Record<string, number> = {};
            data?.forEach(stat => {
                values[stat.key] = stat.value;
            });
            setEditedValues(values);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleValueChange = (key: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedValues(prev => ({ ...prev, [key]: numValue }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Update all changed values
            const updates = stats.filter(stat => stat.value !== editedValues[stat.key]);

            for (const stat of updates) {
                const { error } = await db
                    .from('social_stats')
                    .update({ value: editedValues[stat.key], updated_at: new Date().toISOString() })
                    .eq('key', stat.key);

                if (error) throw error;
            }

            setSuccess(`Berhasil menyimpan ${updates.length} perubahan!`);
            await fetchStats();
        } catch (err: any) {
            setError(err.message || 'Failed to save stats');
        } finally {
            setSaving(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'community': return <Users className="w-5 h-5 text-blue-500" />;
            case 'store': return <ShoppingBag className="w-5 h-5 text-orange-500" />;
            case 'social': return <Globe className="w-5 h-5 text-green-500" />;
            default: return <BarChart3 className="w-5 h-5 text-slate-500" />;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'community': return 'Facebook Groups';
            case 'store': return 'E-commerce Stores';
            case 'social': return 'Social Media';
            default: return category;
        }
    };

    const groupedStats = stats.reduce((acc, stat) => {
        if (!acc[stat.category]) acc[stat.category] = [];
        acc[stat.category].push(stat);
        return acc;
    }, {} as Record<string, SocialStat[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Statistik</h1>
                    <p className="text-slate-500 mt-1">Edit angka-angka yang tampil di website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchStats}
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
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Menyimpan...' : 'Simpan Semua'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                    {success}
                </div>
            )}

            <div className="space-y-8">
                {(Object.entries(groupedStats) as [string, SocialStat[]][]).map(([category, categoryStats]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                            {getCategoryIcon(category)}
                            <h2 className="text-lg font-semibold text-slate-800">{getCategoryLabel(category)}</h2>
                            <span className="text-sm text-slate-500">({categoryStats.length} items)</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {categoryStats.map(stat => (
                                <div key={stat.key} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-slate-900">{stat.label}</h3>
                                        <p className="text-sm text-slate-500">Key: {stat.key}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={editedValues[stat.key] || 0}
                                            onChange={(e) => handleValueChange(stat.key, e.target.value)}
                                            className="w-32 px-4 py-2 text-right font-bold text-lg text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                        {stat.value !== editedValues[stat.key] && (
                                            <span className="text-xs text-orange-500 font-medium">Diubah</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {stats.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Belum ada data statistik.</p>
                    <p className="text-sm text-slate-400 mt-1">Pastikan tabel social_stats sudah dibuat di Supabase.</p>
                </div>
            )}
        </div>
    );
};

export default AdminStats;
