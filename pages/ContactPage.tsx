import React from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import CustomCursor from '../components/ui/CustomCursor';

const ContactPage: React.FC = () => {
    return (
        <PageTransition>
            <CustomCursor />
            <SEO
                title="Hubungi Saya"
                description="Hubungi Hengki Setiawan untuk kolaborasi proyek, konsultasi, atau sekadar berdiskusi."
            />
            <main className="min-h-screen bg-dark text-textMain font-sans">
                <Navbar />
                <div className="pt-24">
                    <Contact />
                </div>
                <Footer />
                <BackToTop />
            </main>
        </PageTransition>
    );
};

export default ContactPage;
