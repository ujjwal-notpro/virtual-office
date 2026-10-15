import React, { useEffect, useState } from 'react';
import { Home, Mail, LogIn, ArrowRight, Menu, X, Layers, Sparkles, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import brandLogo from '../../assets/image.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    } else if (location.hash) {
      const id = location.hash.replace('#', '');
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      const sections = ['contact', 'faqs', 'showcase', 'workspace'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'showcase', label: 'Features', icon: Sparkles },
    { id: 'workspace', label: 'Work Space', icon: Layers },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 shadow-xs border-b border-black/5'
        : 'bg-white/80 border-b border-black/5'
        }`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 h-16 items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => {
            if (location.pathname !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src={brandLogo} alt="Flow Bit logo" className="w-8 h-8 object-contain" />
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: '#111827' }}
          >
            Flow Bit
          </span>
        </div>

        <nav className="flex items-center gap-6 lg:gap-8">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollToSection(e, id)}
              className="text-sm transition-colors duration-200 outline-none focus:outline-none"
              style={{
                color: activeSection === id ? '#070707ff' : '#6b7280',
                fontWeight: activeSection === id ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (activeSection !== id) e.target.style.color = '#070707ff';
              }}
              onMouseLeave={(e) => {
                if (activeSection !== id) e.target.style.color = '#6b7280';
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
            style={{
              color: '#374151',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#15803d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }}
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={brandLogo} alt="Flow Bit logo" className="w-7 h-7 object-contain" />
            <span
              className="text-base font-semibold tracking-tight"
              style={{ color: '#111827' }}
            >
              Flow Bit
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-md cursor-pointer"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" style={{ color: '#374151' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: '#374151' }} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="px-4 pb-4 space-y-1"
            style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
          >
            {navLinks.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: activeSection === id ? '#111827' : '#6b7280',
                  backgroundColor: activeSection === id ? 'rgba(22,163,74,0.06)' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { navigate("/sign-in"); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md cursor-pointer"
                style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#374151' }}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => { navigate("/sign-up"); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md cursor-pointer"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
