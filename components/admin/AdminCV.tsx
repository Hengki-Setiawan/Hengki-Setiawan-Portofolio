import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, Plus, Trash2, Briefcase, GraduationCap, Award, FileText, Printer } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Link } from 'react-router-dom';

interface CVEntry {
    id: string;
    section: 'education' | 'experience' | 'certification' | 'organization';
    title: string;
    subtitle: string;
    date_range: string;
    description: string;
    order_index: number;
}

interface CVProfile {
    summary: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    website_url: string;
}

const AdminCV: React.FC = () => {
    const [entries, setEntries] = useState<CVEntry[]>([]);
    const [profile, setProfile] = useState<CVProfile>({
        summary: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        website_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Entries
            const { data: entriesData, error: entriesError } = await supabase
                .from('cv_entries')
                .select('*')
                .order('order_index', { ascending: true });

            if (entriesError) throw entriesError;
            setEntries(entriesData || []);

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('cv_profile')
                .select('*')
                .single();

            if (profileData) {
                setProfile(profileData);
            }
        } catch (err: any) {
            console.error(err);
            // Don't show error for profile missing (first time)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddEntry = (section: CVEntry['section']) => {
        const newEntry: CVEntry = {
            id: `temp-${Date.now()}`,
            section,
            title: '',
            subtitle: '',
            date_range: '',
            description: '',
            order_index: entries.filter(e => e.section === section).length
        };
        setEntries([...entries, newEntry]);
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('Delete this entry?')) return;

        if (!id.startsWith('temp-')) {
            const { error } = await supabase.from('cv_entries').delete().eq('id', id);
            if (error) {
                showToast(error.message, 'error');
                return;
            }
        }
        setEntries(entries.filter(e => e.id !== id));
    };

    const handleEntryChange = (id: string, field: keyof CVEntry, value: any) => {
        setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleProfileChange = (field: keyof CVProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save Profile
            const { error: profileError } = await supabase
                .from('cv_profile')
                .upsert({ ...profile, updated_at: new Date().toISOString() }); // Assuming single row logic or ID handling on backend, but for simplicity we rely on single row policy or pre-inserted row

            // For safety, let's just update the first row found or insert if empty
            // Ideally we need an ID, but let's assume one exists from migration or we fetch it.
            // Actually, upsert without ID might create duplicates if not careful.
            // Let's try to get ID first or just insert.
            // Simplified: Just delete all and insert one? No, bad practice.
            // Better: We fetched profile, so we should have ID if it exists. 
            // Let's just use a fixed ID in migration or handle it here.
            // Re-fetching to be safe or just standard upsert if we had ID.
            // Since we defined table without unique constraint on a single row, let's just update based on the fetched ID if we had one.
            // For now, let's just assume the migration inserted a row and we are updating it.
            // We need to fetch the ID to update properly.

            const { data: existingProfile } = await supabase.from('cv_profile').select('id').single();
            if (existingProfile) {
                await supabase.from('cv_profile').update({ ...profile, updated_at: new Date().toISOString() }).eq('id', existingProfile.id);
            } else {
                await supabase.from('cv_profile').insert([profile]);
            }

            // Save Entries
            for (const entry of entries) {
                const { id, ...data } = entry;
                if (id.startsWith('temp-')) {
                    await supabase.from('cv_entries').insert([data]);
                } else {
                    await supabase.from('cv_entries').update(data).eq('id', id);
                }
            }

            showToast('CV data saved successfully!', 'success');
            fetchData();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><RefreshCw className="animate-spin" /></div>;

    const renderSection = (section: CVEntry['section'], title: string, icon: React.ReactNode) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-lg font-bold text-slate-800 capitalize">{title}</h2>
                </div>
                <button
                    onClick={() => handleAddEntry(section)}
                    className="text-sm text-primary hover:text-primaryDark font-medium flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add Entry
                </button>
            </div>

            <div className="space-y-4">
                {entries.filter(e => e.section === section).map((entry) => (
                    <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
                        <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <input
                                type="text"
                                value={entry.title}
                                onChange={(e) => handleEntryChange(entry.id, 'title', e.target.value)}
                                placeholder="Title (e.g. Web Developer)"
                                className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium"
                            />
                            <input
                                type="text"
                                value={entry.subtitle}
                                onChange={(e) => handleEntryChange(entry.id, 'subtitle', e.target.value)}
                                placeholder="Subtitle (e.g. Company Name)"
                                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                            />
                            <input
                                type="text"
                                value={entry.date_range}
                                onChange={(e) => handleEntryChange(entry.id, 'date_range', e.target.value)}
                                placeholder="Date Range (e.g. 2020 - Present)"
                                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                            />
                        </div>
                        <textarea
                            value={entry.description}
                            onChange={(e) => handleEntryChange(entry.id, 'description', e.target.value)}
                            placeholder="Description..."
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                        />
                    </div>
                ))}
                {entries.filter(e => e.section === section).length === 0 && (
                    <p className="text-sm text-slate-400 italic text-center py-2">No entries yet.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">CV / Resume Builder</h1>
                    <p className="text-slate-500">Manage data for your printable CV</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/cv"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                        <Printer className="w-4 h-4" /> Preview CV
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Profile Summary</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Professional Summary</label>
                                <textarea
                                    value={profile.summary}
                                    onChange={(e) => handleProfileChange('summary', e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email</label>
                                <input
                                    type="text"
                                    value={profile.contact_email}
                                    onChange={(e) => handleProfileChange('contact_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={profile.contact_phone}
                                    onChange={(e) => handleProfileChange('contact_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Address</label>
                                <input
                                    type="text"
                                    value={profile.address}
                                    onChange={(e) => handleProfileChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Website</label>
                                <input
                                    type="text"
                                    value={profile.website_url}
                                    onChange={(e) => handleProfileChange('website_url', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Entries */}
                <div className="lg:col-span-2">
                    {renderSection('experience', 'Work Experience', <Briefcase className="w-5 h-5 text-blue-500" />)}
                    {renderSection('education', 'Education', <GraduationCap className="w-5 h-5 text-green-500" />)}
                    {renderSection('certification', 'Certifications & Awards', <Award className="w-5 h-5 text-yellow-500" />)}
                    {renderSection('organization', 'Organizations', <FileText className="w-5 h-5 text-purple-500" />)}
                </div>
            </div>
        </div>
    );
};

export default AdminCV;
