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
    Info,
    Film,
    Globe,
    Zap,
    FileText,
    Rocket,
    BookOpen,
    Mail,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

interface MenuGroup {
    label: string;
    items: { icon: any; label: string; path: string; badge?: number }[];
}

const AdminLayout: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Content': true,
        'Showcase': true,
        'Publishing': true,
        'Communication': true,
        'Settings': true,
    });

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const menuGroups: MenuGroup[] = [
        {
            label: 'Content',
            items: [
                { icon: User, label: 'Profile & Hero', path: '/admin/profile' },
                { icon: Info, label: 'About', path: '/admin/about' },
                { icon: Award, label: 'Experience', path: '/admin/experience' },
                { icon: Zap, label: 'Skills', path: '/admin/skills' },
            ],
        },
        {
            label: 'Showcase',
            items: [
                { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
                { icon: Globe, label: 'Websites', path: '/admin/websites' },
                { icon: Film, label: 'Media', path: '/admin/media' },
                { icon: Rocket, label: 'Ventures', path: '/admin/ventures' },
            ],
        },
        {
            label: 'Publishing',
            items: [
                { icon: BookOpen, label: 'Articles', path: '/admin/articles' },
                { icon: Quote, label: 'Testimonials', path: '/admin/testimonials' },
            ],
        },
        {
            label: 'Communication',
            items: [
                { icon: Mail, label: 'Messages', path: '/admin/messages' },
                { icon: Users, label: 'Subscribers', path: '/admin/subscribers' },
                { icon: MessageSquare, label: 'Guestbook', path: '/admin/guestbook' },
            ],
        },
        {
            label: 'Settings',
            items: [
                { icon: BarChart3, label: 'Stats', path: '/admin/stats' },
                { icon: FileText, label: 'CV / Resume', path: '/admin/cv' },
                { icon: HelpCircle, label: 'FAQ', path: '/admin/faq' },
                { icon: Layers, label: 'Services', path: '/admin/services' },
            ],
        },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
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
                    <p className="text-sm text-slate-500">Portfolio CMS</p>
                </div>

                {/* Navigation - scrollable */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {/* Dashboard (always visible) */}
                    <Link
                        to="/admin"
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive('/admin') && location.pathname === '/admin'
                            ? 'bg-primary text-white'
                            : 'text-slate-600 hover:bg-primary/10 hover:text-primary'
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    {/* Grouped Menu Items */}
                    {menuGroups.map((group) => (
                        <div key={group.label} className="mt-3">
                            <button
                                onClick={() => toggleGroup(group.label)}
                                className="flex items-center justify-between w-full px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
                            >
                                {group.label}
                                {expandedGroups[group.label]
                                    ? <ChevronDown className="w-3.5 h-3.5" />
                                    : <ChevronRight className="w-3.5 h-3.5" />
                                }
                            </button>
                            {expandedGroups[group.label] && (
                                <div className="mt-1 space-y-0.5">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={handleNavClick}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${isActive(item.path)
                                                ? 'bg-primary text-white'
                                                : 'text-slate-600 hover:bg-primary/10 hover:text-primary'
                                            }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                            {item.badge && item.badge > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Logout Button - fixed at bottom */}
                <div className="p-4 border-t border-slate-100">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors mb-2 text-sm"
                    >
                        <Globe className="w-4 h-4" />
                        <span>View Website →</span>
                    </a>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm"
                    >
                        <LogOut className="w-4 h-4" />
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
