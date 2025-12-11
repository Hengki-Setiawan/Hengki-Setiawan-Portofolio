import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RefreshCw, Plus, Trash2, Edit2, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order_index: number;
    is_active: boolean;
}

const AdminFAQ: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setFaqs(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingFaq) {
                const { error } = await supabase
                    .from('faqs')
                    .update({ ...formData })
                    .eq('id', editingFaq.id);
                if (error) throw error;
                setSuccess('FAQ berhasil diupdate!');
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .insert([{ ...formData, order_index: faqs.length }]);
                if (error) throw error;
                setSuccess('FAQ baru ditambahkan!');
            }
            await fetchFaqs();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus FAQ ini?')) return;

        try {
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) throw error;
            setFaqs(faqs.filter(f => f.id !== id));
            setSuccess('FAQ dihapus!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFaq(faq);
        setFormData({ question: faq.question, answer: faq.answer });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ question: '', answer: '' });
        setEditingFaq(null);
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
                    <h1 className="text-3xl font-bold text-slate-900">FAQ</h1>
                    <p className="text-slate-500 mt-1">Kelola pertanyaan yang sering diajukan</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah FAQ
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
            {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

            <div className="space-y-3">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        >
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                <span className="font-medium text-slate-900">{faq.question}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleEdit(faq); }} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <Edit2 className="w-4 h-4 text-slate-600" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }} className="p-2 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                                {expandedId === faq.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                        </div>
                        {expandedId === faq.id && (
                            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                                <p className="text-slate-600 mt-3">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {faqs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Belum ada FAQ. Klik "Tambah FAQ" untuk memulai.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pertanyaan</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg"
                                    required
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

export default AdminFAQ;
