import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, Plus, Trash2, Edit2, X, Briefcase } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
    is_active: boolean;
}

const ICON_OPTIONS = ['Code', 'ShoppingBag', 'Users', 'TrendingUp', 'Briefcase', 'Globe', 'Palette', 'MessageCircle'];

const AdminServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', icon: 'Briefcase' });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setServices(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingService) {
                const { error } = await supabase
                    .from('services')
                    .update({ ...formData })
                    .eq('id', editingService.id);
                if (error) throw error;
                setSuccess('Layanan berhasil diupdate!');
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([{ ...formData, order_index: services.length }]);
                if (error) throw error;
                setSuccess('Layanan baru ditambahkan!');
            }
            await fetchServices();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus layanan ini?')) return;

        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            setServices(services.filter(s => s.id !== id));
            setSuccess('Layanan dihapus!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({ title: service.title, description: service.description, icon: service.icon });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', icon: 'Briefcase' });
        setEditingService(null);
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
                    <h1 className="text-3xl font-bold text-slate-900">Layanan</h1>
                    <p className="text-slate-500 mt-1">Kelola layanan yang ditampilkan di website</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Layanan
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
            {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{service.title}</h3>
                                    <p className="text-sm text-slate-500">Icon: {service.icon}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(service)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <Edit2 className="w-4 h-4 text-slate-600" />
                                </button>
                                <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-600 mt-3">{service.description}</p>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Belum ada layanan. Klik "Tambah Layanan" untuk memulai.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingService ? 'Edit Layanan' : 'Tambah Layanan'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                >
                                    {ICON_OPTIONS.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
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

export default AdminServices;
