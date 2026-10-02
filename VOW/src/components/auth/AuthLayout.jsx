import React from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';

const AuthLayout = ({ children, title, showBack = true, backTo = '/' }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-400/20 dark:bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Navigation Actions */}
      <div className="absolute top-6 left-6 right-6 max-w-5xl mx-auto flex items-center justify-between pointer-events-auto z-10">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-blue-600 dark:text-white hover:opacity-85 transition-opacity flex items-center gap-2"
        >
          Flow Bit
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:scale-105 transition-all text-gray-700 dark:text-zinc-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-300" />
            )}
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[430px] z-10 mt-12 sm:mt-6"
      >
        <div className="bg-white/95 dark:bg-[#101010] backdrop-blur-xl rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 border border-gray-100 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          {/* Header Row with Back Button & Title */}
          <div className="relative flex items-center justify-center mb-7">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="absolute left-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
