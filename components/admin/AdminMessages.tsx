import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Loader2 } from 'lucide-react';

interface Message {
    id: number;
    created_at: string;
    name: string;
    email: string;
    message: string;
}

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessages(messages.filter((m) => m.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
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
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Messages</h1>

            {messages.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-slate-500">No messages yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                                    <p className="text-sm text-slate-500">{msg.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-slate-700">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
