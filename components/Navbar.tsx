import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: 'Project', href: '/projects' },
    { name: t('nav.experience'), href: '/experience' },
    { name: t('nav.blog'), href: '/blog' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1 transition-all duration-300 hover:scale-110">
                <img src="/images/logo-neco.png" alt="Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
              </div>
              <span className="font-bold text-xl tracking-tight text-textMain">
                Hengki<span className="text-primary">.Setiawan</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors cursor-pointer relative group ${isActive(link.href) ? 'text-primary' : 'text-slate-500 hover:text-textMain'
                    }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              ))}
              <Link
                to="/contact"
                className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primaryDark hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
              >
                {t('nav.contact')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="-mr-2 flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-textMain hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-3 rounded-md text-base font-medium cursor-pointer ${isActive(link.href)
                ? 'text-primary bg-primary/10'
                : 'text-slate-600 hover:text-textMain hover:bg-slate-50'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center mt-4 px-3 py-3 rounded-md font-bold bg-primary text-white hover:bg-primaryDark"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
