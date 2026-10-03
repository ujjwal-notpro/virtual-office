import React, { useEffect, useState } from 'react';
import { Sun, Moon, Home, Sparkles, CreditCard, Mail, LogIn, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../../hooks/useDarkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useDarkMode();
  const location = useLocation();
  const isLearnMoreActive = location.pathname === "/learn-more";
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    }
  }, [location.pathname]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
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

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Desktop/Tablet */}
      <div
        className="hidden md:flex max-w-7xl mx-auto px-6 h-20 items-center justify-between border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="gap-20 flex items-center">
          <div
            className="text-2xl font-bold text-white dark:text-black bg-black p-2 x-2 rounded-2xl dark:bg-white p-2 x-2 rounded-2xl"
          >
            Flow Bit
          </div>

          <nav
            className="flex items-center gap-1 p-1.5 rounded-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(128, 128, 128, 0.05) 0%, rgba(128, 128, 128, 0.01) 100%)",
              border: "1px solid rgba(128, 128, 128, 0.15)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              backdropFilter: "blur(10px)"
            }}
          >
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                backgroundColor: activeSection === 'home' ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(51, 102, 255, 0.1)') : '',
                color: activeSection === 'home' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_home")}
            </a>

            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                backgroundColor: activeSection === 'features' ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(51, 102, 255, 0.1)') : '',
                color: activeSection === 'features' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_features")}
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                backgroundColor: activeSection === 'contact' ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(51, 102, 255, 0.1)') : '',
                color: activeSection === 'contact' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_contact")}
            </a>
            <Link
              to="/learn-more"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                backgroundColor: isLearnMoreActive ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(51, 102, 255, 0.1)') : '',
                color: isLearnMoreActive ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_learn_more")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:opacity-70 btn-hover"
            aria-label={t("toggle_theme")}
          >
            {theme === 'light' ? (
              <Sun className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 bg-black rounded-xl px-3 py-3"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span className='text-white'>{t("nav_login")}</span>
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] cursor-pointer"
          >
            {t("start_free")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-6 py-5">
          {/* Logo */}
          <div className="text-[23px] font-bold tracking-tight text-black dark:text-white">
            Flow Bit
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/sign-in")}
              className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-all hover:opacity-70 text-black dark:text-white"
            >
              <LogIn className="w-4 h-4" />
              {t("nav_login")}
            </button>
          </div>

        </div>

        <div className="flex justify-center px-4 py-5 pb-3">
          <nav
            className="flex items-center gap-4 px-4 py-2.5 rounded-[15px] border overflow-x-auto w-full"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            {/* Home */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "home")}
              className="text-sm font-medium whitespace-nowrap border-b-2 pb-0.5 transition-all"
              style={{
                color:
                  activeSection === "home"
                    ? "var(--accent-color)"
                    : "var(--text-secondary)",
                borderColor:
                  activeSection === "home"
                    ? "var(--accent-color)"
                    : "transparent",
              }}
            >
              Home
            </a>

            {/* Features */}
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="text-sm font-medium whitespace-nowrap border-b-2 pb-0.5 transition-all"
              style={{
                color:
                  activeSection === "features"
                    ? "var(--accent-color)"
                    : "var(--text-secondary)",
                borderColor:
                  activeSection === "features"
                    ? "var(--accent-color)"
                    : "transparent",
              }}
            >
              Features
            </a>

            {/* Contact */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="text-sm font-medium whitespace-nowrap border-b-2 pb-0.5 transition-all"
              style={{
                color:
                  activeSection === "contact"
                    ? "var(--accent-color)"
                    : "var(--text-secondary)",
                borderColor:
                  activeSection === "contact"
                    ? "var(--accent-color)"
                    : "transparent",
              }}
            >
              Contact
            </a>

            {/* Learn More */}
            <Link
              to="/learn-more"
              className="text-sm font-medium whitespace-nowrap border-b-2 pb-0.5 transition-all"
              style={{
                color: isLearnMoreActive
                  ? "var(--accent-color)"
                  : "var(--text-secondary)",
                borderColor: isLearnMoreActive
                  ? "var(--accent-color)"
                  : "transparent",
              }}
            >
              {t("nav_learn_more")}
            </Link>
          </nav>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
