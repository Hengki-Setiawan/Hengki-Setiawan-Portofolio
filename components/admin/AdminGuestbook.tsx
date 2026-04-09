import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Trash2, Search, Loader2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    created_at: string;
    is_hidden: boolean;
}

const AdminGuestbook: React.FC = () => {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEntries = async () => {
        try {
            const { data, error } = await db
                .from('guestbook')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching guestbook:', error);
            toast.error('Gagal memuat buku tamu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

        try {
            const { error } = await db
                .from('guestbook')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEntries(entries.filter(entry => entry.id !== id));
            toast.success('Pesan berhasil dihapus');
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error('Gagal menghapus pesan');
        }
    };

    const filteredEntries = entries.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Buku Tamu</h1>
                    <p className="text-slate-400">Kelola pesan dari pengunjung</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-xl p-6">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari pesan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 px-4 text-slate-400 font-medium">Tanggal</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium">Nama</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium">Pesan</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                                            {format(new Date(entry.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                        </td>
                                        <td className="py-4 px-4 text-white font-medium">{entry.name}</td>
                                        <td className="py-4 px-4 text-slate-300 max-w-md truncate">{entry.message}</td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEntries.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500">
                                            Tidak ada pesan ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGuestbook;
