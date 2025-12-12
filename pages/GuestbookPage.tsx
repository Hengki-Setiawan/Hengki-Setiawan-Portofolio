import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Guestbook from '../components/Guestbook';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import BackToTop from '../components/ui/BackToTop';
import CustomCursor from '../components/ui/CustomCursor';
import ScrollProgress from '../components/ui/ScrollProgress';

const GuestbookPage: React.FC = () => {
    return (
        <>
            <SEO
                title="Buku Tamu"
                description="Tinggalkan pesan, saran, atau sekadar menyapa di Buku Tamu Hengki Setiawan."
            />
            <CustomCursor />
            <ScrollProgress />
            <PageTransition>
                <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/30 selection:text-primary">
                    <Navbar />
                    <div className="pt-24 pb-12">
                        <Guestbook />
                    </div>
                    <Footer />
                    <BackToTop />
                </main>
            </PageTransition>
        </>
    );
};

export default GuestbookPage;
