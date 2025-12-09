import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tentang', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Keahlian', href: '#skills' },
    { name: 'Karir', href: '#experience' },
    { name: 'Bisnis', href: '#ventures' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Offset untuk header fixed (sekitar 80px)
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-2' : 'bg-white/50 backdrop-blur-sm border-b border-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0">
            <a href="#" onClick={scrollToTop} className="flex items-center gap-2 group">
              <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-primaryDark transition-colors">
                 <Rocket className="h-5 w-5" />
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-slate-800' : 'text-slate-800'}`}>
                Hengki<span className="text-primary">.Setiawan</span>
              </span>
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${scrolled ? 'text-slate-600' : 'text-slate-700'}`}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://wa.me/62895803463032" 
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primaryDark hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
              >
                Hubungi Saya
              </a>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a
             href="https://wa.me/62895803463032"
             target="_blank"
             rel="noreferrer"
             className="block w-full text-center mt-4 px-3 py-3 rounded-md font-bold bg-primary text-white hover:bg-primaryDark"
          >
            WhatsApp Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;