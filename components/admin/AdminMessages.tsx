import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Loader2, Sparkles, CheckCircle, Mail, AlertTriangle, Briefcase } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Message {
    id: number;
    created_at: string;
    name: string;
    email: string;
    message: string;
}

// Local mock classification logic to fulfill the AI Classifier feature without altering DB schema
const classifyMessage = (msg: string) => {
    const text = msg.toLowerCase();
    
    // Simple heuristic-based classifier simulating an AI model
    if (text.includes('hire') || text.includes('project') || text.includes('freelance') || text.includes('kerja')) {
        return { type: 'Job Offer', priority: 'High', color: 'bg-green-100 text-green-700', icon: Briefcase };
    }
    if (text.includes('buy') || text.includes('seo') || text.includes('crypto') || text.includes('cheap')) {
        return { type: 'Spam', priority: 'Low', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    }
    return { type: 'Inquiry', priority: 'Medium', color: 'bg-blue-100 text-blue-700', icon: Mail };
};

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

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
            addToast('Message deleted', 'success');
        } catch (error) {
            console.error('Error deleting message:', error);
            addToast('Failed to delete message', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredMessages = messages.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-primary" />
                        Inbox Messages
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and classify incoming messages.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <input
                        type="text"
                        placeholder="Search name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full sm:w-64 shadow-sm"
                    />
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700">AI Auto-Classifier Active</span>
                    </div>
                </div>
            </div>

            {filteredMessages.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Inbox Empty</h3>
                    <p className="text-slate-500">You're all caught up! No new messages.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredMessages.map((msg) => {
                        const classification = classifyMessage(msg.message);
                        const Icon = classification.icon;

                        return (
                            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                                {/* Left indicator line based on priority */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                    classification.priority === 'High' ? 'bg-green-500' : 
                                    classification.priority === 'Spam' ? 'bg-red-500' : 'bg-blue-500'
                                }`} />

                                {/* Sender Info */}
                                <div className="md:w-1/4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg truncate pr-4">{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline truncate block w-full">
                                            {msg.email}
                                        </a>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">
                                            {new Date(msg.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-max ${classification.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {classification.type}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="md:w-3/4 flex flex-col">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 text-slate-700 text-sm leading-relaxed relative">
                                        {classification.priority === 'High' && (
                                            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-green-500 opacity-50" />
                                        )}
                                        {msg.message}
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a 
                                            href={`mailto:${msg.email}?subject=Reply: Inquiry via Portfolio`}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <Mail className="w-4 h-4" /> Reply
                                        </a>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
