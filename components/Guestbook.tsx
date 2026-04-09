import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Send, User, MessageSquare, Clock, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    created_at: string;
}

const Guestbook: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchEntries = async () => {
        try {
            const { data, error } = await db
                .from('guestbook')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching guestbook:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchEntries();

        const subscription = db
            .channel('guestbook')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
                setEntries((prev) => [payload.new as GuestbookEntry, ...prev]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        try {
            const { error } = await db
                .from('guestbook')
                .insert([{ name, message }]);

            if (error) throw error;

            setName('');
            setMessage('');
        } catch (error) {
            console.error('Error submitting message:', error);
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Reveal width="100%">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        {t('guestbook.title')} <span className="text-primary">{t('guestbook.title_highlight')}</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        {t('guestbook.description')}
                    </p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <Reveal delay={0.1}>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-primary" />
                                {t('guestbook.write_message')}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('guestbook.name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            placeholder="Nama kamu"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('guestbook.message')}</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[120px] resize-none"
                                            placeholder="Tulis pesanmu..."
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primaryDark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {t('guestbook.send')}
                                </button>
                            </form>
                        </div>
                    </Reveal>
                </div>

                {/* List Section */}
                <div className="md:col-span-2 space-y-4">
                    {fetching ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">{t('guestbook.no_messages')}</p>
                        </div>
                    ) : (
                        entries.map((entry, index) => (
                            <Reveal key={entry.id} delay={index * 0.05}>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-slate-800">{entry.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: i18n.language === 'id' ? id : undefined })}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed pl-10">
                                        {entry.message}
                                    </p>
                                </div>
                            </Reveal>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Guestbook;
