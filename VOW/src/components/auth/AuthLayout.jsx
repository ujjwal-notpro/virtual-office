import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import authLogo from '../../assets/image.png';

const AuthLayout = ({ children, title, subtitle, showBack = true, backTo = '/', showBrandImage = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300 relative overflow-hidden" style={{ backgroundColor: '#F2F2F2', color: '#1a1a1a' }}>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-500" style={{ backgroundColor: 'rgba(203,203,203,0.3)' }} />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-500" style={{ backgroundColor: 'rgba(23,77,56,0.08)' }} />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-500" style={{ backgroundColor: 'rgba(77,23,23,0.06)' }} />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 max-w-5xl mx-auto px-6 py-5 flex items-center justify-between pointer-events-auto z-20">
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-bold tracking-tight text-xl transition-opacity hover:opacity-90"
          style={{ color: '#174D38' }}
        >
          {showBrandImage ? (
            <img
              src={authLogo}
              alt=""
              className="w-8 h-8 rounded-xl object-contain shadow-md group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <span className="font-extrabold" style={{ color: '#174D38' }}>
            Flow Bit
          </span>
        </Link>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[430px] z-10 my-16 sm:my-8"
      >
        <div className="rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 relative transition-all duration-200" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', boxShadow: '0 20px 50px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)' }}>
          <div className="relative flex flex-col items-center justify-center mb-6 text-center">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="absolute left-0 top-0.5 w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer"
                style={{ backgroundColor: '#F2F2F2', color: '#1a1a1a' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight" style={{ color: '#1a1a1a' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-[13px] font-medium mt-1.5" style={{ color: '#CBCBCB' }}>
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default AuthLayout;
