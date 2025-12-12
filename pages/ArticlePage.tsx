import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleDetail from '../components/ArticleDetail';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import BackToTop from '../components/ui/BackToTop';
import CustomCursor from '../components/ui/CustomCursor';
import ScrollProgress from '../components/ui/ScrollProgress';

const ArticlePage: React.FC = () => {
    return (
        <>
            <SEO
                title="Artikel"
                description="Baca artikel terbaru seputar teknologi dan web development."
            />
            <CustomCursor />
            <ScrollProgress />
            <PageTransition>
                <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/30 selection:text-primary">
                    <Navbar />
                    <div className="pt-24 pb-12">
                        <ArticleDetail />
                    </div>
                    <Footer />
                    <BackToTop />
                </main>
            </PageTransition>
        </>
    );
};

export default ArticlePage;
