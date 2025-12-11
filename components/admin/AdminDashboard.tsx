import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Briefcase, Quote, Users, BarChart3, RefreshCw, HelpCircle, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
    messages: number;
    projects: number;
    testimonials: number;
    subscribers: number;
    services: number;
    faqs: number;
    experiences: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        messages: 0,
        projects: 0,
        testimonials: 0,
        subscribers: 0,
        services: 0,
        faqs: 0,
        experiences: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [messages, projects, testimonials, subscribers, services, faqs, experiences] = await Promise.all([
                supabase.from('messages').select('id', { count: 'exact', head: true }),
                supabase.from('projects').select('id', { count: 'exact', head: true }),
                supabase.from('testimonials').select('id', { count: 'exact', head: true }),
                supabase.from('subscribers').select('id', { count: 'exact', head: true }),
                supabase.from('services').select('id', { count: 'exact', head: true }),
                supabase.from('faqs').select('id', { count: 'exact', head: true }),
                supabase.from('experiences').select('id', { count: 'exact', head: true }),
            ]);

            setStats({
                messages: messages.count || 0,
                projects: projects.count || 0,
                testimonials: testimonials.count || 0,
                subscribers: subscribers.count || 0,
                services: services.count || 0,
                faqs: faqs.count || 0,
                experiences: experiences.count || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/messages' },
        { label: 'Projects', value: stats.projects, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/projects' },
        { label: 'Testimonials', value: stats.testimonials, icon: Quote, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/testimonials' },
        { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/subscribers' },
        { label: 'Services', value: stats.services, icon: Layers, color: 'text-pink-600', bg: 'bg-pink-50', link: '/admin/services' },
        { label: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/admin/faq' },
        { label: 'Experiences', value: stats.experiences, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/experience' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        to={card.link}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div>
                                <h3 className="text-slate-500 text-sm font-medium">{card.label}</h3>
                                <p className={`text-3xl font-bold ${card.color} mt-1`}>
                                    {loading ? '...' : card.value}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/profile"
                        className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <h3 className="font-bold text-lg">Edit Profil</h3>
                        <p className="text-white/80 text-sm mt-1">Ubah nama, roles, dan bio Anda</p>
                    </Link>
                    <Link
                        to="/admin/stats"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <h3 className="font-bold text-lg">Update Stats</h3>
                        <p className="text-white/80 text-sm mt-1">Update angka member dan followers</p>
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <h3 className="font-bold text-lg">Lihat Website</h3>
                        <p className="text-white/80 text-sm mt-1">Buka website di tab baru</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
