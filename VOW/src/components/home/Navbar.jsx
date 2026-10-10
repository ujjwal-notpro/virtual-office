import React, { useEffect, useState } from 'react';
import { Home, Mail, LogIn, ArrowRight, Menu, X } from 'lucide-react';
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
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header
      className="w-full sticky top-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(0,0,0,0.95)' : '#000000',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <div className="hidden md:flex max-w-7xl mx-auto px-8 h-20 items-center justify-between">
        <div className="flex items-center gap-14">
         
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
              style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              <img src={brandLogo} alt="Flow Bit logo" className="w-7 h-7 object-contain" />
            </div>
            <span
              className="text-xl tracking-tight transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              Flow Bit
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {navLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="relative px-5 py-2 text-[13px] font-medium tracking-wide uppercase transition-all duration-300"
                style={{
                  color: activeSection === id ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.08em',
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => {
                  if (activeSection !== id) e.target.style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                {label}
                {activeSection === id && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold tracking-wide rounded-full transition-all duration-300 cursor-pointer"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold tracking-wide rounded-full transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Free
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              <img src={brandLogo} alt="Flow Bit logo" className="w-6 h-6 object-contain" />
            </div>
            <span
              className="text-lg tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              Flow Bit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="px-5 pb-6 space-y-3 animate-fadeIn"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {navLinks.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: activeSection === id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  backgroundColor: activeSection === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { navigate("/sign-in"); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff' }}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => { navigate("/sign-up"); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full cursor-pointer"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
              >
                Start Free
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
