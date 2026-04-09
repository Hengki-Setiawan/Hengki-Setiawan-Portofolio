import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Save, RefreshCw, Plus, Trash2, GripVertical, TrendingUp, PenTool, Code2, Layout, Share2, Zap } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Skill {
    id: string;
    category: string;
    title: string;
    items: string[];
    icon_name: string;
    order_index: number;
}

const iconOptions = [
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'PenTool', icon: PenTool },
    { name: 'Code2', icon: Code2 },
    { name: 'Layout', icon: Layout },
    { name: 'Share2', icon: Share2 },
    { name: 'Zap', icon: Zap },
];

const AdminSkills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const { data, error } = await db
                .from('skills')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setSkills(data || []);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAddSkill = () => {
        const newSkill: Skill = {
            id: `temp-${Date.now()}`,
            category: 'tech',
            title: 'New Skill Category',
            items: ['Skill 1', 'Skill 2'],
            icon_name: 'Code2',
            order_index: skills.length
        };
        setSkills([...skills, newSkill]);
    };

    const handleDeleteSkill = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill category?')) return;

        if (!id.startsWith('temp-')) {
            try {
                const { error } = await db.from('skills').delete().eq('id', id);
                if (error) throw error;
            } catch (err: any) {
                showToast(err.message, 'error');
                return;
            }
        }
        setSkills(skills.filter(s => s.id !== id));
    };

    const handleChange = (id: string, field: keyof Skill, value: any) => {
        setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleItemChange = (id: string, index: number, value: string) => {
        setSkills(skills.map(s => {
            if (s.id === id) {
                const newItems = [...s.items];
                newItems[index] = value;
                return { ...s, items: newItems };
            }
            return s;
        }));
    };

    const handleAddItem = (id: string) => {
        setSkills(skills.map(s => {
            if (s.id === id) {
                return { ...s, items: [...s.items, 'New Item'] };
            }
            return s;
        }));
    };

    const handleDeleteItem = (id: string, index: number) => {
        setSkills(skills.map(s => {
            if (s.id === id) {
                const newItems = s.items.filter((_, i) => i !== index);
                return { ...s, items: newItems };
            }
            return s;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const skill of skills) {
                const { id, ...data } = skill;
                if (id.startsWith('temp-')) {
                    const { error } = await db.from('skills').insert([data]);
                    if (error) throw error;
                } else {
                    const { error } = await db.from('skills').update(data).eq('id', id);
                    if (error) throw error;
                }
            }
            showToast('Skills saved successfully!', 'success');
            fetchSkills(); // Refresh to get real IDs
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><RefreshCw className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Skills Management</h1>
                    <p className="text-slate-500">Manage your skills and competencies</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
                        <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Category Title</label>
                            <input
                                type="text"
                                value={skill.title}
                                onChange={(e) => handleChange(skill.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Icon</label>
                            <div className="flex gap-2 flex-wrap">
                                {iconOptions.map((opt) => (
                                    <button
                                        key={opt.name}
                                        onClick={() => handleChange(skill.id, 'icon_name', opt.name)}
                                        className={`p-2 rounded-lg border ${skill.icon_name === opt.name ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 text-slate-400 hover:border-primary/50'}`}
                                    >
                                        <opt.icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-2">List Items</label>
                            <div className="space-y-2">
                                {skill.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleItemChange(skill.id, idx, e.target.value)}
                                            className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={() => handleDeleteItem(skill.id, idx)}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddItem(skill.id)}
                                    className="w-full py-1.5 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddSkill}
                    className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-100 hover:border-primary transition-colors group"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-medium text-slate-600">Add New Category</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSkills;
