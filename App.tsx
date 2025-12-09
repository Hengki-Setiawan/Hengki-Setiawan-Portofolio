import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Services from './components/Services';
import Skills from './components/Skills';
import TechStack from './components/TechStack';
import Gallery from './components/Gallery';
import Experience from './components/Experience';
import Ventures from './components/Ventures';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWA from './components/FloatingWA';

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-light text-textMain font-sans">
      <Navbar />
      <Hero />
      <TechStack />
      <Stats />
      <About />
      <Services />
      <Skills />
      <Gallery />
      <Experience />
      <Ventures />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingWA />
    </main>
  );
};

export default App;