import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleDetail from '../components/ArticleDetail';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import BackToTop from '../components/ui/BackToTop';

const ArticlePage: React.FC = () => {
    return (
        <>
            <SEO
                title="Artikel"
                description="Baca artikel terbaru seputar teknologi dan web development."
            />
            <PageTransition>
                <main className="min-h-screen bg-dark text-textMain font-sans selection:bg-primary/30 selection:text-primary">
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
