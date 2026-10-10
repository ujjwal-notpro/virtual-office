import React, { useState } from 'react';
import { motion } from 'framer-motion';
import brandLogo from '../../assets/image.png';
import {
  Send,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

const footerText = {
  newsletter_errorEmpty: 'Please enter an email address.',
  newsletter_errorInvalid: 'Please enter a valid email address.',
  newsletter_success: 'Subscribed successfully!',
  footer_tagline: 'Your Virtual Office, Anywhere.',
  'connect with us': 'Connect with us',
  'add your email here': 'Add your email here',
  copyright: 'All rights reserved.',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  cookieSettings: 'Cookie Settings',
  accessibility: 'Accessibility',
};

const Footer = () => {
  const t = (key) => footerText[key] ?? key;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

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
      style={{ backgroundColor: '#000000' }}
    >
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none overflow-hidden opacity-10">
        <svg width="100%" height="160" viewBox="0 0 1200 160" fill="none" preserveAspectRatio="none">
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${20 + i * 22} Q300 ${10 + i * 18 + Math.sin(i) * 12} 600 ${25 + i * 20} T1200 ${15 + i * 24}`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div
        className="w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-14">
       
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                style={{ border: '1.5px solid rgba(255,255,255,0.15)' }}
              >
                <img src={brandLogo} alt="Flow Bit logo" className="w-7 h-7 object-contain" />
              </div>
              <span
                className="text-xl tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                Flow Bit
              </span>
            </div>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {t("footer_tagline")}
            </p>

            <div className="flex flex-wrap gap-y-3 gap-x-8 md:gap-x-10 pt-1">
              {[
                { icon: Mail, text: 'hello@FlowBit.io' },
                { icon: Phone, text: '+1 (800) 123-4567' },
                { icon: MapPin, text: 'Ghaziabad, Uttar Pradesh, India' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <Icon size={16} className="text-white/80 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px] space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              {t("connect with us")}
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder={t("add your email here")}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 h-11 px-4 rounded-full text-sm focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="h-11 w-11 flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer transition-all duration-300"
                style={{
                  background: '#ffffff',
                  color: '#000000',
                }}
              >
                <Send size={15} />
              </motion.button>
            </form>
            {status && (
              <p className="text-xs" style={{ color: status.includes('✓') ? '#4ade80' : '#f43f5e' }}>
                {status}
              </p>
            )}
          </div>
        </div>

      
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026{' '}
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>FlowBit, Inc.</span>
            {' '}{t("copyright")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {[t("privacyPolicy"), t("termsOfService"), t("cookieSettings"), t("accessibility")].map((link, i, arr) => (
              <React.Fragment key={link}>
                <span
                  className="cursor-pointer transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {link}
                </span>
                {i < arr.length - 1 && <span style={{ opacity: 0.2 }}>·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
