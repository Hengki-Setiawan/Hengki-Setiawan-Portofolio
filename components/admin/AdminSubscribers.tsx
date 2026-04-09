import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Subscriber {
    id: number;
    created_at: string;
    email: string;
}

const AdminSubscribers: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from('subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (subscribers.length === 0) return;
        const headers = ['ID', 'Email', 'Subscribed At'];
        const csvContent = [
            headers.join(','),
            ...subscribers.map(s => `${s.id},${s.email},${new Date(s.created_at).toISOString()}`)
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'subscribers_export.csv';
        link.click();
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} subscribers?`)) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('subscribers')
                .delete()
                .in('id', selectedIds);

            if (error) throw error;
            setSubscribers(subscribers.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
        } catch (error) {
            console.error('Error deleting subscribers:', error);
            alert('Failed to delete selected subscribers');
        } finally {
            setLoading(false);
        }
    };
    
    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(subscribers.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Newsletter Subscribers</h1>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={handleBulkDelete}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                        >
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button 
                        onClick={handleExportCSV}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primaryDark transition-colors"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input 
                                    type="checkbox"
                                    checked={selectedIds.length === subscribers.length && subscribers.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded text-primary focus:ring-primary cursor-pointer w-4 h-4"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                    No subscribers yet.
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((sub) => (
                                <tr key={sub.id} className={selectedIds.includes(sub.id) ? 'bg-blue-50/50' : ''}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.includes(sub.id)}
                                            onChange={() => toggleSelect(sub.id)}
                                            className="rounded text-primary focus:ring-primary cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{sub.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(sub.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSubscribers;
