import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Briefcase, Quote, Users, RefreshCw, Layers, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardStats {
    messages: number;
    projects: number;
    testimonials: number;
    subscribers: number;
}

interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

const mockChartData = [
    { name: 'Mon', visits: 120 },
    { name: 'Tue', visits: 180 },
    { name: 'Wed', visits: 250 },
    { name: 'Thu', visits: 190 },
    { name: 'Fri', visits: 310 },
    { name: 'Sat', visits: 280 },
    { name: 'Sun', visits: 220 },
];

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        messages: 0,
        projects: 0,
        testimonials: 0,
        subscribers: 0
    });
    const [recentMessages, setRecentMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [messagesData, projectsData, testimonialsData, subscribersData, recentMsgs] = await Promise.all([
                supabase.from('messages').select('id', { count: 'exact', head: true }),
                supabase.from('projects').select('id', { count: 'exact', head: true }),
                supabase.from('testimonials').select('id', { count: 'exact', head: true }),
                supabase.from('subscribers').select('id', { count: 'exact', head: true }),
                supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(3)
            ]);

            setStats({
                messages: messagesData.count || 0,
                projects: projectsData.count || 0,
                testimonials: testimonialsData.count || 0,
                subscribers: subscribersData.count || 0
            });
            
            setRecentMessages(recentMsgs.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const deleteMessage = async (id: number) => {
        if (!confirm('Hapus pesan ini?')) return;
        try {
            await supabase.from('messages').delete().eq('id', id);
            setRecentMessages(prev => prev.filter(m => m.id !== id));
            setStats(prev => ({...prev, messages: prev.messages - 1}));
        } catch (err) {
            console.error(err);
        }
    };

    const statCards = [
        { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/messages' },
        { label: 'Projects', value: stats.projects, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/projects' },
        { label: 'Testimonials', value: stats.testimonials, icon: Quote, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/testimonials' },
        { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/subscribers' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Selamat datang kembali! Ini ringkasan website Anda.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        to={card.link}
                        className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
                            <h3 className={`text-3xl font-bold ${card.color}`}>
                                {loading ? '...' : card.value}
                            </h3>
                        </div>
                        <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Charts & Analytics (2 cols wide) */}
                <div className="space-y-6 lg:col-span-2">
                    
                    {/* Traffic Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Visitor Trends (Mock)</h2>
                            <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">Last 7 Days</span>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                                    <Tooltip 
                                        cursor={{fill: '#F1F5F9'}} 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                    />
                                    <Bar dataKey="visits" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24 text-indigo-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">AI Weekly Insights</h2>
                                <p className="text-sm text-indigo-600 font-medium">Powered by Groq LLaMA 3.3</p>
                            </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed relative z-10 font-medium">
                            "Berdasarkan performa minggu ini, terjadi peningkatan interaksi pengunjung pada bagian <strong>Featured Projects</strong>. Dari 5 pesan terbaru, 2 di antaranya membicarakan potensi kolaborasi/proyek. 
                            Saya sarankan untuk memperbarui CV terbaru Anda dan menambahkan deskripsi teknis lebih detail pada project e-commerce."
                        </p>
                    </div>

                </div>

                {/* Right Column: Recent Activity & Actions */}
                <div className="space-y-6">
                    
                    {/* Recent Messages */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[500px]">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Pesan Masuk Baru</h2>
                            <Link to="/admin/messages" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2">
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Memuat pesan...</div>
                            ) : recentMessages.length > 0 ? (
                                <div className="space-y-1">
                                    {recentMessages.map((msg) => (
                                        <div key={msg.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors group relative">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-slate-800 text-sm truncate pr-8">{msg.name}</h3>
                                                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2 truncate">{msg.email}</p>
                                            <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">{msg.message}</p>
                                            
                                            <button 
                                                onClick={(e) => { e.preventDefault(); deleteMessage(msg.id); }}
                                                className="absolute top-3 right-3 text-red-500 hover:bg-red-50 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-200 m-4 rounded-lg">
                                    Tidak ada pesan baru minggu ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Shortcuts */}
                    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden text-white">
                        <div className="p-5 border-b border-slate-700">
                            <h2 className="text-lg font-bold">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-y divide-slate-700 border-t border-slate-700">
                            <Link to="/admin/profile" className="p-4 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2 text-center group">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-primary transition-colors"><Layers className="w-5 h-5 text-slate-300 group-hover:text-white" /></div>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white">Edit Profile</span>
                            </Link>
                            <Link to="/admin/projects" className="p-4 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2 text-center group">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-purple-500 transition-colors"><Briefcase className="w-5 h-5 text-slate-300 group-hover:text-white" /></div>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white">New Project</span>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
