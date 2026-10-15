import React, { useState } from 'react';
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
      className="w-full"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={brandLogo} alt="Flow Bit logo" className="w-6 h-6 object-contain" />
              <span
                className="text-sm font-medium"
                style={{ color: '#111827' }}
              >
                Flow Bit
              </span>
            </div>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: '#6b7280' }}
            >
              {t("footer_tagline")}
            </p>

            <div className="flex flex-wrap gap-y-3 gap-x-6 pt-1">
              {[
                { icon: Mail, text: 'hello@FlowBit.io' },
                { icon: Phone, text: '+1 (800) 123-4567' },
                { icon: MapPin, text: 'Ghaziabad, Uttar Pradesh, India' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: '#6b7280' }}
                >
                  <Icon size={14} style={{ color: '#9ca3af' }} className="flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px] space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#111827' }}>
              {t("connect with us")}
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder={t("add your email here")}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 h-10 px-4 rounded-md text-sm focus:outline-none transition-all duration-200"
                style={{
                  background: '#f9fafb',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-md flex-shrink-0 cursor-pointer transition-all duration-200"
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                <Send size={14} />
              </button>
            </form>
            {status && (
              <p className="text-xs" style={{ color: status.includes('✓') ? '#16a34a' : '#ef4444' }}>
                {status}
              </p>
            )}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            © 2026{' '}
            <span className="font-medium" style={{ color: '#6b7280' }}>FlowBit, Inc.</span>
            {' '}{t("copyright")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: '#9ca3af' }}>
            {[t("privacyPolicy"), t("termsOfService"), t("cookieSettings"), t("accessibility")].map((link, i, arr) => (
              <React.Fragment key={link}>
                <span
                  className="cursor-pointer transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = '#111827'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  {link}
                </span>
                {i < arr.length - 1 && <span style={{ opacity: 0.3 }}>·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
