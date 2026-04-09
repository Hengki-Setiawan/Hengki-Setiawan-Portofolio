import React from 'react';
import Navbar from '../components/Navbar';
import Experience from '../components/Experience';
import Achievements from '../components/Achievements';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const ExperiencePage: React.FC = () => {
    return (
        <PageTransition>
            <SEO
                title="Perjalanan"
                description="Pengalaman profesional, pencapaian, dan informasi kontak Hengki Setiawan."
            />
            <main className="min-h-screen bg-dark text-textMain font-sans">
                <Navbar />
                <div className="pt-24">
                    <Experience />
                    <Achievements />
                </div>
                <Footer />
                <BackToTop />
            </main>
        </PageTransition>
    );
};

export default ExperiencePage;
