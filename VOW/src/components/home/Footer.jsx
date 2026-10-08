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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
              <span className="flex items-center gap-2.5 text-2xl font-bold text-black dark:text-white">
                Flow Bit
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              {t("footer_tagline")}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-6 pt-1">
              {[
                { icon: Mail, text: 'hello@FlowBit.io' },
                { icon: Phone, text: '+1 (800) 123-4567' },
                { icon: MapPin, text: 'Ghaziabad, Uttar Pradesh, India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={13} style={{ color: '#6366f1', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px] space-y-3">
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
                className="h-10 w-10 flex items-center justify-center rounded-xl text-white flex-shrink-0 cursor-pointer"
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
