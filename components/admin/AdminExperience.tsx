import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { RefreshCw, Plus, Trash2, Edit2, X, Briefcase } from 'lucide-react';

interface Experience {
    id: string;
    title: string;
    role: string;
    period: string;
    description: string;
    order_index: number;
    is_active: boolean;
}

const AdminExperience: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [formData, setFormData] = useState({ title: '', role: '', period: '', description: '' });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const { data, error } = await db
                .from('experiences')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setExperiences(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingExp) {
                const { error } = await db
                    .from('experiences')
                    .update({ ...formData })
                    .eq('id', editingExp.id);
                if (error) throw error;
                setSuccess('Pengalaman berhasil diupdate!');
            } else {
                const { error } = await db
                    .from('experiences')
                    .insert([{ ...formData, order_index: experiences.length }]);
                if (error) throw error;
                setSuccess('Pengalaman baru ditambahkan!');
            }
            await fetchExperiences();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus pengalaman ini?')) return;

        try {
            const { error } = await db.from('experiences').delete().eq('id', id);
            if (error) throw error;
            setExperiences(experiences.filter(e => e.id !== id));
            setSuccess('Pengalaman dihapus!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (exp: Experience) => {
        setEditingExp(exp);
        setFormData({ title: exp.title, role: exp.role, period: exp.period, description: exp.description });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', role: '', period: '', description: '' });
        setEditingExp(null);
        setShowModal(false);
    };

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
                    <h1 className="text-3xl font-bold text-slate-900">Pengalaman</h1>
                    <p className="text-slate-500 mt-1">Kelola pengalaman kerja dan proyek</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Pengalaman
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
            {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

            <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                                        <p className="text-primary font-medium">{exp.role}</p>
                                        <p className="text-sm text-slate-500">{exp.period}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-slate-100 rounded-lg">
                                            <Edit2 className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <button onClick={() => handleDelete(exp.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-600 mt-2">{exp.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {experiences.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Belum ada pengalaman. Klik "Tambah Pengalaman" untuk memulai.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Perusahaan/Proyek</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Posisi/Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Periode</label>
                                <input
                                    type="text"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                    placeholder="2021 - Present"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExperience;
