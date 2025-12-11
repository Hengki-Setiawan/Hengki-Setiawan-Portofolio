import React from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Skills from '../components/Skills';
import Connect from '../components/Connect';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';

const AboutPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-dark text-textMain font-sans">
            <Navbar />
            <div className="pt-24">
                <About />
                <Skills />
                <Connect />
            </div>
            <Footer />
            <BackToTop />
        </main>
    );
};

export default AboutPage;
