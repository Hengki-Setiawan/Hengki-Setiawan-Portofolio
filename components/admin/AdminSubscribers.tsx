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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Newsletter Subscribers</h1>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                                    No subscribers yet.
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="px-6 py-4 text-sm text-slate-900">{sub.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(sub.created_at).toLocaleDateString()}
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
