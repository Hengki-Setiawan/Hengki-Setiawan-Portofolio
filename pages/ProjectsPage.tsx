import React from 'react';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import MediaShowcase from '../components/MediaShowcase';
import Ventures from '../components/Ventures';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';

const ProjectsPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-dark text-textMain font-sans">
            <Navbar />
            <div className="pt-24">
                <Gallery />
                <MediaShowcase />
                <Ventures />
                <Testimonials />
            </div>
            <Footer />
            <BackToTop />
        </main>
    );
};

export default ProjectsPage;
