import React from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import FAQ from '../components/FAQ';
import Gallery from '../components/Gallery';
import MediaShowcase from '../components/MediaShowcase';
import Ventures from '../components/Ventures';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import CustomCursor from '../components/ui/CustomCursor';

const ServicesPage: React.FC = () => {
    return (
        <PageTransition>
            <CustomCursor />
            <SEO
                title="Portofolio"
                description="Layanan profesional dan portofolio proyek Hengki Setiawan. Web Development, Design, dan lainnya."
            />
            <main className="min-h-screen bg-dark text-textMain font-sans">
                <Navbar />
                <div className="pt-24">
                    <Services />
                    <FAQ />
                    <Gallery />
                    <MediaShowcase />
                    <Ventures />
                    <Testimonials />
                </div>
                <Footer />
                <BackToTop />
            </main>
        </PageTransition>
    );
};

export default ServicesPage;
