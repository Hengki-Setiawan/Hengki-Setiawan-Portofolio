import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, User, Camera } from 'lucide-react';

interface ContentItem {
    key: string;
    value: string;
}

const AdminProfile: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({
        hero_name: '',
        hero_roles: '',
        hero_tagline: '',
        about_bio: '',
        about_location: '',
        profile_image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('key, value');

            if (error) throw error;

            const contentMap: Record<string, string> = {};
            data?.forEach((item: ContentItem) => {
                contentMap[item.key] = item.value;
            });
            setContent(prev => ({ ...prev, ...contentMap }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            for (const [key, value] of Object.entries(content)) {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

                if (error) throw error;
            }
            setSuccess('Profil berhasil disimpan!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Profil & Website</h1>
                    <p className="text-slate-500 mt-1">Edit informasi profil dan konten Hero/About</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Hero Section</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={content.hero_name}
                                    onChange={(e) => handleChange('hero_name', e.target.value)}
                                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Roles (pisahkan dengan •)</label>
                                <input
                                    type="text"
                                    value={content.hero_roles}
                                    onChange={(e) => handleChange('hero_roles', e.target.value)}
                                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Digital Business Student • Web Developer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={content.hero_tagline}
                                    onChange={(e) => handleChange('hero_tagline', e.target.value)}
                                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Camera className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Foto Profil</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Foto</label>
                            <input
                                type="text"
                                value={content.profile_image}
                                onChange={(e) => handleChange('profile_image', e.target.value)}
                                className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="/images/profile.jpg"
                            />
                            {content.profile_image && (
                                <div className="mt-4">
                                    <img
                                        src={content.profile_image}
                                        alt="Preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - About */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">About Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                            <textarea
                                value={content.about_bio}
                                onChange={(e) => handleChange('about_bio', e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                            <input
                                type="text"
                                value={content.about_location}
                                onChange={(e) => handleChange('about_location', e.target.value)}
                                className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
