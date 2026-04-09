import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Trash2, Edit2, Plus, Loader2, X } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Project {
    id: number;
    category: string;
    title: string;
    image: string;
    description: string;
    link?: string;
}

const AdminProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        image: '',
        description: '',
        link: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await db
                .from('projects')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingProject) {
                // Update
                const { error } = await db
                    .from('projects')
                    .update(formData)
                    .eq('id', editingProject.id);

                if (error) throw error;
            } else {
                // Create
                const { error } = await db
                    .from('projects')
                    .insert([formData]);

                if (error) throw error;
            }

            await fetchProjects();
            resetForm();
            addToast('Project saved successfully', 'success');
        } catch (error) {
            console.error('Error saving project:', error);
            addToast('Failed to save project', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            category: project.category,
            title: project.title,
            image: project.image,
            description: project.description,
            link: project.link || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await db
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
            addToast('Project deleted', 'success');
        } catch (error) {
            console.error('Error deleting project:', error);
            addToast('Failed to delete project', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ category: '', title: '', image: '', description: '', link: '' });
        setEditingProject(null);
        setShowForm(false);
    };

    if (loading && projects.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const categories = Array.from(new Set(projects.map(p => p.category)));
    
    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-900">Projects Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primaryDark transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {!showForm && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Search projects by title or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg flex-1 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                    />
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white shadow-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button onClick={resetForm}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g., Fashion Brand"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Project title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    rows={3}
                                    placeholder="Brief description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Link (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primaryDark transition-colors disabled:opacity-70"
                                >
                                    {loading ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
                    No projects found matching the filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <span className="text-xs text-primary font-bold uppercase">{project.category}</span>
                            <h3 className="font-bold text-slate-900 mt-1">{project.title}</h3>
                            <p className="text-sm text-slate-600 mt-2">{project.description}</p>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                                    View Link
                                </a>
                            )}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default AdminProjects;
