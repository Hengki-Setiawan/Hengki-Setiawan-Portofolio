import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
    LayoutDashboard,
    MessageSquare,
    Briefcase,
    Quote,
    Users,
    LogOut,
    BarChart3,
    User,
    Layers,
    HelpCircle,
    Award,
    Menu,
    X,
    Home,
    Info,
    Trophy,
    Calendar,
    Film,
    Globe,
    Zap,
    FileText,
    Rocket
} from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: User, label: 'Profil', path: '/admin/profile' },
        { icon: Home, label: 'Hero', path: '/admin/hero' },
        { icon: Info, label: 'About', path: '/admin/about' },
        { icon: BarChart3, label: 'Stats', path: '/admin/stats' },
        { icon: Trophy, label: 'Achievements', path: '/admin/achievements' },
        { icon: Film, label: 'Media', path: '/admin/media' },
        { icon: Globe, label: 'Websites', path: '/admin/websites' },
        { icon: Layers, label: 'Services', path: '/admin/services' },
        { icon: Award, label: 'Experience', path: '/admin/experience' },
        { icon: HelpCircle, label: 'FAQ', path: '/admin/faq' },
        { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
        { icon: Zap, label: 'Skills', path: '/admin/skills' },
        { icon: Rocket, label: 'Ventures', path: '/admin/ventures' },
        { icon: FileText, label: 'CV / Resume', path: '/admin/cv' },
        { icon: Quote, label: 'Testimonials', path: '/admin/testimonials' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
        { icon: Users, label: 'Subscribers', path: '/admin/subscribers' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleNavClick = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
                <h2 className="text-xl font-bold text-slate-900">Admin</h2>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50
                transform transition-all duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900">Admin</h2>
                    <p className="text-sm text-slate-500">Dashboard</p>
                </div>

                {/* Navigation - scrollable */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-primary text-white'
                                : 'text-slate-600 hover:bg-primary/10 hover:text-primary'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button - fixed at bottom */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
