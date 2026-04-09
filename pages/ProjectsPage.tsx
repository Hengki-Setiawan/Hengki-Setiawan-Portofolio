import React from 'react';
import Navbar from '../components/Navbar';
import WebsitesShowcase from '../components/WebsitesShowcase';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/SEO';

const ProjectsPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-dark text-textMain font-sans">
            <SEO title="Projects Portfolio" description="Kumpulan proyek website yang pernah saya bangun." />
            <Navbar />
            <div className="pt-24 pb-12">
                <WebsitesShowcase />
            </div>
            <Footer />
            <BackToTop />
        </main>
    );
};

export default ProjectsPage;
