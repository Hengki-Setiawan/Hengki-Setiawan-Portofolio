import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Skills from './components/Skills';
import Connect from './components/Connect';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import N8nChatWidget from './components/N8nChatWidget';
import BackToTop from './components/ui/BackToTop';
import ScrollProgress from './components/ui/ScrollProgress';
import LoadingScreen from './components/ui/LoadingScreen';
import SocialProofBar from './components/SocialProofBar';
import SEO from './components/SEO';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/ui/CustomCursor';
import ParticlesBackground from './components/ui/ParticlesBackground';

// Pages
import ServicesPage from './pages/ServicesPage';
import ExperiencePage from './pages/ExperiencePage';
import WebsitesPage from './pages/WebsitesPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Admin imports
import AdminMessages from './components/admin/AdminMessages';
import AdminSubscribers from './components/admin/AdminSubscribers';
import AdminProjects from './components/admin/AdminProjects';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminStats from './components/admin/AdminStats';
import AdminProfile from './components/admin/AdminProfile';
import AdminServices from './components/admin/AdminServices';
import AdminFAQ from './components/admin/AdminFAQ';
import AdminExperience from './components/admin/AdminExperience';
import AdminHero from './components/admin/AdminHero';
import AdminAbout from './components/admin/AdminAbout';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './components/NotFound';
import AdminAchievements from './components/admin/AdminAchievements';
import AdminMediaShowcase from './components/admin/AdminMediaShowcase';
import AdminWebsites from './components/admin/AdminWebsites';
import AdminSkills from './components/admin/AdminSkills';
import AdminCV from './components/admin/AdminCV';
import CVPage from './pages/CVPage';

// HomePage - combines Home + About
const HomePage = () => (
  <>
    <SEO
      title="Home"
      description="Hengki Setiawan - Web Developer, Digital Creator, and Community Builder. Explore my portfolio and projects."
    />
    <LoadingScreen />
    <CustomCursor />
    <ScrollProgress />
    <PageTransition>
      <main className="min-h-screen bg-dark text-textMain font-sans selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <Hero />
        <TechStack />
        <Stats />
        <About />
        <Skills />
        <Connect />
        <Footer />
        <BackToTop />
        <SocialProofBar />
      </main>
    </PageTransition>
  </>
);

import { ThemeProvider } from './lib/ThemeContext';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/websites" element={<WebsitesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cv" element={<CVPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="hero" element={<AdminHero />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="stats" element={<AdminStats />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="faq" element={<AdminFAQ />} />
                  <Route path="experience" element={<AdminExperience />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="subscribers" element={<AdminSubscribers />} />
                  <Route path="achievements" element={<AdminAchievements />} />
                  <Route path="media" element={<AdminMediaShowcase />} />
                  <Route path="websites" element={<AdminWebsites />} />
                  <Route path="skills" element={<AdminSkills />} />
                  <Route path="cv" element={<AdminCV />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <N8nChatWidget />
              <ParticlesBackground />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;