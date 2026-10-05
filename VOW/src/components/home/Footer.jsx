import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import brandLogo from '../../assets/image.png';
import {
  Send, ArrowRight,
  MapPin, Mail, Phone,
} from 'lucide-react';

const socials = [
  { label: 'Facebook', href: '#', color: '#1877f2', logo: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64' },
  { label: 'Twitter', href: '#', color: '#1DA1F2', logo: 'https://www.google.com/s2/favicons?domain=x.com&sz=64' },
  { label: 'Instagram', href: '#', color: '#e1306c', logo: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64' },
  { label: 'LinkedIn', href: '#', color: '#0a66c2', logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64' },
  { label: 'YouTube', href: '#', color: '#ff0000', logo: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64' },
];

const footerText = {
  newsletter_errorEmpty: 'Please enter an email address.',
  newsletter_errorInvalid: 'Please enter a valid email address.',
  newsletter_success: 'Subscribed successfully!',
  footer_tagline: 'Your Virtual Office, Anywhere.',
  'connect with us': 'Connect with us',
  'add your email here': 'Add your email here',
  product: 'Product', features: 'Features', security: 'Security', roadmap: 'Roadmap', blog: 'Blog', contact: 'Contact',
  company: 'Company', about: 'About', careers: 'Careers', social: 'Social', footer_followUs: 'Follow Us',
  copyright: 'All rights reserved.', privacyPolicy: 'Privacy Policy', termsOfService: 'Terms of Service',
  cookieSettings: 'Cookie Settings', accessibility: 'Accessibility',
};

const ColHeading = ({ children }) => (
  <div className="mb-5">
    <h4 className="text-sm font-black tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h4>
    <div
      className="mt-1.5 h-[2px] w-8 rounded-full"
      style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
    />
  </div>
);

const NavLink = ({ children, href, to, onClick }) => (
  <li>
    {to ? (
      <Link to={to} onClick={onClick}>
        <motion.span
          whileHover={{ x: 4 }}
          className="flex items-center gap-1.5 text-sm cursor-pointer group transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6366f1' }} />
          <span className="group-hover:text-indigo-400 transition-colors">{children}</span>
        </motion.span>
      </Link>
    ) : (
      <a href={href} onClick={onClick}>
        <motion.span
          whileHover={{ x: 4 }}
          className="flex items-center gap-1.5 text-sm cursor-pointer group transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6366f1' }} />
          <span className="group-hover:text-indigo-400 transition-colors">{children}</span>
        </motion.span>
      </a>
    )}
  </li>
);

const Footer = () => {
  const t = (key) => footerText[key] ?? key;
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Stores the user's email input
  const [status, setStatus] = useState(''); // Stores success or error messages

  const scrollToSection = (e, sectionId) => {
    if (!sectionId) return;
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return setStatus(t("newsletter_errorEmpty"));

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus(t("newsletter_errorInvalid"));

    setStatus(`✓ ${t("newsletter_success")}`);
    setEmail('');

    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <footer
      id="contact"
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, #3b82f6, #4d3dffff, #8b5cf6, #ec4899, #f59e0b)' }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px]"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-14 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1.4fr] gap-12 lg:gap-16 mb-12">

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
              <span
                className="flex items-center gap-2.5 text-2xl font-bold text-black dark:text-white"
              >
                Flow Bit
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              {t("footer_tagline")}
            </p>

            <div className="space-y-2">
              {[
                { icon: Mail, text: 'hello@FlowBit.io' },
                { icon: Phone, text: '+1 (800) 123-4567' },
                { icon: MapPin, text: 'Ghaziabad, Uttar Pradesh, India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={13} style={{ color: '#6366f1', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                {t("connect with us")}
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("add your email here")}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-10 px-4 rounded-xl text-sm focus:outline-none"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-white flex-shrink-0"
                  style={{ background: 'black' }}
                >
                  <Send size={15} />
                </motion.button>
              </form>
              {status && (
                <p className="text-xs" style={{ color: status.includes('✓') ? '#22c55e' : '#f43f5e' }}>
                  {status}
                </p>
              )}
            </div>
          </div>

          <div>
            <ColHeading>{t("product")}</ColHeading>
            <ul className="space-y-3">
              {[
                { label: t("features") },
                { label: t("security") },
                { label: t("roadmap") },
                { label: t("blog") },
                { label: t("contact") }
              ].map((item) => (
                <NavLink key={item.label} to="#">
                  {item.label}
                </NavLink>
              ))}
            </ul>
          </div>

          <div>
            <ColHeading>{t("company")}</ColHeading>
            <ul className="space-y-3">
              <NavLink to="/about-us">{t("about")}</NavLink>
              <NavLink to="/learn-more">Learn More</NavLink>
              {[
                { label: t("blog") },
                { label: t("careers") },
                { label: t("contact") },
                { label: t("social") }
              ].map((item) => (
                <NavLink key={item.label} to="#">
                  {item.label}
                </NavLink>
              ))}
            </ul>
          </div>

          <div>
            <ColHeading>{t("footer_followUs")}</ColHeading>
            <div className="space-y-3">
              {socials.map(({ label, href, color, logo }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ x: 4, scale: 1.02 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}30`,
                      boxShadow: `0 2px 8px ${color}15`,
                    }}
                  >
                    <img src={logo} alt={`${label} logo`} className="w-4 h-4 object-contain" />
                  </div>
                  <span
                    className="text-sm font-medium group-hover:text-indigo-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            © 2026{' '}
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>FlowBit, Inc.</span>
            {' '}{t("copyright")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            {[t("privacyPolicy"), t("termsOfService"), t("cookieSettings"), t("accessibility")].map((link, i, arr) => (
              <React.Fragment key={link}>
                <span className="hover:text-indigo-400 cursor-pointer transition-colors">{link}</span>
                {i < arr.length - 1 && <span className="opacity-30">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
