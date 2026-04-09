import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Communities from './components/Communities';
import OnlineStore from './components/OnlineStore';
import FeaturedProjects from './components/FeaturedProjects';
import ContactCTA from './components/ContactCTA';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import BackToTop from './components/ui/BackToTop';
import SEO from './components/SEO';
import PageTransition from './components/PageTransition';
import AIChatbot from './components/AIChatbot';

// Pages
const ExperiencePage = React.lazy(() => import('./pages/ExperiencePage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage'));
const CVPage = React.lazy(() => import('./pages/CVPage'));
const GuestbookPage = React.lazy(() => import('./pages/GuestbookPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ArticlePage = React.lazy(() => import('./pages/ArticlePage'));

// Admin imports
const AdminMessages = React.lazy(() => import('./components/admin/AdminMessages'));
const AdminSubscribers = React.lazy(() => import('./components/admin/AdminSubscribers'));
const AdminProjects = React.lazy(() => import('./components/admin/AdminProjects'));
const AdminTestimonials = React.lazy(() => import('./components/admin/AdminTestimonials'));
const AdminStats = React.lazy(() => import('./components/admin/AdminStats'));
const AdminProfile = React.lazy(() => import('./components/admin/AdminProfile'));
const AdminServices = React.lazy(() => import('./components/admin/AdminServices'));
const AdminFAQ = React.lazy(() => import('./components/admin/AdminFAQ'));
const AdminExperience = React.lazy(() => import('./components/admin/AdminExperience'));

const AdminAbout = React.lazy(() => import('./components/admin/AdminAbout'));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const ProtectedRoute = React.lazy(() => import('./components/admin/ProtectedRoute'));
const NotFound = React.lazy(() => import('./components/NotFound'));
const AdminAchievements = React.lazy(() => import('./components/admin/AdminAchievements'));
const AdminMediaShowcase = React.lazy(() => import('./components/admin/AdminMediaShowcase'));
const AdminWebsites = React.lazy(() => import('./components/admin/AdminWebsites'));
const AdminSkills = React.lazy(() => import('./components/admin/AdminSkills'));
const AdminCV = React.lazy(() => import('./components/admin/AdminCV'));
const AdminGuestbook = React.lazy(() => import('./components/admin/AdminGuestbook'));
const AdminArticles = React.lazy(() => import('./components/admin/AdminArticles'));
const AdminVentures = React.lazy(() => import('./components/admin/AdminVentures'));

// HomePage — clean, minimalist, light mode
const HomePage = () => (
  <>
    <SEO
      title="Home"
      description="Hengki Setiawan - Digital Entrepreneur & Web Developer. Membangun komunitas 500K+ dan brand e-commerce."
    />
    <PageTransition>
      <main className="min-h-screen bg-dark text-textMain font-sans selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <FeaturedProjects />
        <Communities />
        <OnlineStore />
        <ContactCTA />
        <Footer />
        <BackToTop />
      </main>
    </PageTransition>
  </>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/guestbook" element={<GuestbookPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<ArticlePage />} />
                <Route path="/cv" element={<CVPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
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
                  {/* AdminHero merged into AdminProfile */}
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
                  <Route path="ventures" element={<AdminVentures />} />
                  <Route path="cv" element={<AdminCV />} />
                  <Route path="guestbook" element={<AdminGuestbook />} />
                  <Route path="articles" element={<AdminArticles />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <AIChatbot />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;