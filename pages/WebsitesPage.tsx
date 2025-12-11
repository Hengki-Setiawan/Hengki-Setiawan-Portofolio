import React from 'react';
import Navbar from '../components/Navbar';
import WebsitesShowcase from '../components/WebsitesShowcase';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import CustomCursor from '../components/ui/CustomCursor';

const WebsitesPage: React.FC = () => {
    return (
        <PageTransition>
            <CustomCursor />
            <SEO
                title="Web Saya"
                description="Koleksi website dan proyek yang telah dikembangkan oleh Hengki Setiawan."
            />
            <main className="min-h-screen bg-dark text-textMain font-sans">
                <Navbar />
                <div className="pt-24">
                    <WebsitesShowcase />
                </div>
                <Footer />
                <BackToTop />
            </main>
        </PageTransition>
    );
};

export default WebsitesPage;
