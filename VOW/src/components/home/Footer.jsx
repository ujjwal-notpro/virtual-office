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
        backgroundColor: '#245F73',
        borderTop: '1px solid rgba(242,240,239,0.1)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={brandLogo} alt="Flow Bit logo" className="w-6 h-6 object-contain" />
              <span
                className="text-sm font-medium"
                style={{ color: '#F2F0EF' }}
              >
                Flow Bit
              </span>
            </div>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: 'rgba(242,240,239,0.7)' }}
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
                  style={{ color: 'rgba(242,240,239,0.6)' }}
                >
                  <Icon size={14} style={{ color: '#BBBDBC' }} className="flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px] space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#F2F0EF' }}>
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
                  background: 'rgba(242,240,239,0.1)',
                  border: '1px solid rgba(242,240,239,0.2)',
                  color: '#F2F0EF',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#733E24';
                  e.target.style.boxShadow = '0 0 0 3px rgba(115,62,36,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(242,240,239,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-md flex-shrink-0 cursor-pointer transition-all duration-200"
                style={{
                  background: '#733E24',
                  color: '#F2F0EF',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5e3220'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#733E24'}
              >
                <Send size={14} />
              </button>
            </form>
            {status && (
              <p className="text-xs" style={{ color: status.includes('✓') ? '#BBBDBC' : '#ef4444' }}>
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
