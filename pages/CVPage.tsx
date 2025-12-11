import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Globe, Printer, Download, ExternalLink, Linkedin, Github, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

interface Skill {
    category: string;
    title: string;
    items: string[];
}

interface WebsiteExperience {
    id: string;
    title: string;
    role: string;
    period: string;
    description: string;
    order_index: number;
}

const CVPage: React.FC = () => {
    const [entries, setEntries] = useState<CVEntry[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [profile, setProfile] = useState<CVProfile | null>(null);
    const [heroData, setHeroData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Manual CV Entries
                const { data: entriesData } = await supabase
                    .from('cv_entries')
                    .select('*')
                    .order('order_index', { ascending: true });

                // 2. Fetch Website Experiences (Sync with "Perjalanan" section)
                const { data: websiteExpData } = await supabase
                    .from('experiences')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                // Merge experiences
                const syncedExperiences: CVEntry[] = (websiteExpData || []).map((exp: WebsiteExperience) => ({
                    id: `web-${exp.id}`,
                    section: 'experience',
                    title: exp.role,
                    subtitle: exp.title,
                    date_range: exp.period,
                    description: exp.description,
                    order_index: exp.order_index
                }));

                const manualExperiences = (entriesData || []).filter(e => e.section === 'experience');
                const otherEntries = (entriesData || []).filter(e => e.section !== 'experience');

                const allExperiences = [...syncedExperiences, ...manualExperiences].sort((a, b) => a.order_index - b.order_index);
                setEntries([...otherEntries, ...allExperiences]);

                // 3. Fetch CV Profile
                const { data: profileData } = await supabase
                    .from('cv_profile')
                    .select('*')
                    .single();
                setProfile(profileData);

                // 4. Fetch Skills
                const { data: skillsData } = await supabase
                    .from('skills')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });
                setSkills(skillsData || []);

                // 5. Fetch Hero Data
                const { data: heroContent } = await supabase
                    .from('site_content')
                    .select('*')
                    .eq('section', 'hero');

                const heroMap: any = {};
                heroContent?.forEach((item: any) => heroMap[item.key] = item.value);
                setHeroData(heroMap);

            } catch (error) {
                console.error('Error fetching CV data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        if (!cvRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(cvRef.current, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${heroData?.name_first || 'Resume'}_${heroData?.name_last || 'CV'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try printing instead.');
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const getEntriesBySection = (section: string) => entries.filter(e => e.section === section);

    return (
        <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
            {/* Toolbar - Hidden when printing */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 print:hidden">
                <Link to="/" className="text-slate-600 hover:text-primary font-medium flex items-center gap-2">
                    ← Back to Website
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark shadow-sm transition-all disabled:opacity-70"
                    >
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download PDF
                    </button>
                </div>
            </div>

            {/* A4 Paper Container */}
            <div ref={cvRef} className="max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none print:w-full print:max-w-none min-h-[297mm] relative overflow-hidden">

                {/* Header / Sidebar Layout */}
                <div className="flex flex-col md:flex-row h-full">

                    {/* Left Sidebar (Dark) */}
                    <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 print:w-1/3 print:bg-slate-900 print:text-white">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2 leading-tight">
                                {heroData?.name_first} <br />
                                <span className="text-primary">{heroData?.name_last}</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-lg">{heroData?.role_1}</p>
                        </div>

                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-700 pb-2">Contact</h3>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    {profile?.contact_email && (
                                        <li className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>{profile.contact_email}</span>
                                        </li>
                                    )}
                                    {profile?.contact_phone && (
                                        <li className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{profile.contact_phone}</span>
                                        </li>
                                    )}
                                    {profile?.address && (
                                        <li className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{profile.address}</span>
                                        </li>
                                    )}
                                    {profile?.website_url && (
                                        <li className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-primary" />
                                            <a href={profile.website_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                                Website
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-700 pb-2">Skills</h3>
                                <div className="space-y-4">
                                    {skills.map(skill => (
                                        <div key={skill.title}>
                                            <p className="text-primary font-bold text-sm mb-1">{skill.title}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {skill.items.map((item, idx) => (
                                                    <span key={idx} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Socials (Optional) */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-700 pb-2">Socials</h3>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {heroData?.linkedin_url && (
                                        <li>
                                            <a href={heroData.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                                                <Linkedin className="w-4 h-4" /> LinkedIn
                                            </a>
                                        </li>
                                    )}
                                    {heroData?.github_url && (
                                        <li>
                                            <a href={heroData.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                                                <Github className="w-4 h-4" /> GitHub
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Content (Light) */}
                    <div className="w-full md:w-2/3 p-8 print:w-2/3">
                        {/* Profile Summary */}
                        {profile?.summary && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-3 border-b-2 border-primary/20 pb-1 inline-block">Profile</h2>
                                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                                    {profile.summary}
                                </p>
                            </div>
                        )}

                        {/* Experience */}
                        {getEntriesBySection('experience').length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-primary/20 pb-1 inline-block">Work Experience</h2>
                                <div className="space-y-5">
                                    {getEntriesBySection('experience').map(entry => (
                                        <div key={entry.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900">{entry.title}</h3>
                                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{entry.date_range}</span>
                                            </div>
                                            <p className="text-sm font-medium text-primary mb-2">{entry.subtitle}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {entry.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {getEntriesBySection('education').length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-primary/20 pb-1 inline-block">Education</h2>
                                <div className="space-y-4">
                                    {getEntriesBySection('education').map(entry => (
                                        <div key={entry.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900">{entry.subtitle}</h3>
                                                <span className="text-xs font-medium text-slate-500">{entry.date_range}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">{entry.title}</p>
                                            {entry.description && <p className="text-xs text-slate-500 mt-1">{entry.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications & Organizations */}
                        <div className="grid grid-cols-1 gap-6">
                            {getEntriesBySection('certification').length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-primary/20 pb-1 inline-block">Certifications</h2>
                                    <ul className="space-y-2">
                                        {getEntriesBySection('certification').map(entry => (
                                            <li key={entry.id} className="text-sm text-slate-600">
                                                <span className="font-bold text-slate-800">{entry.title}</span>
                                                {entry.subtitle && <span className="text-slate-500"> - {entry.subtitle}</span>}
                                                {entry.date_range && <span className="text-xs text-slate-400 ml-2">({entry.date_range})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {getEntriesBySection('organization').length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-primary/20 pb-1 inline-block">Organizations</h2>
                                    <ul className="space-y-2">
                                        {getEntriesBySection('organization').map(entry => (
                                            <li key={entry.id} className="text-sm text-slate-600">
                                                <span className="font-bold text-slate-800">{entry.title}</span>
                                                {entry.subtitle && <span className="text-slate-500"> - {entry.subtitle}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVPage;
