import React from 'react';
import { ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';

const AuthLayout = ({ children, title, subtitle, showBack = true, backTo = '/' }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#f8fafc] dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/25 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none transition-all duration-500" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-300/25 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none transition-all duration-500" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-blue-300/20 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-500" />

      {/* Subtle grid pattern for light & dark */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 dark:opacity-20 pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 max-w-5xl mx-auto px-6 py-5 flex items-center justify-between pointer-events-auto z-20">
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-bold tracking-tight text-xl text-slate-900 dark:text-white transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold bg-gradient-to-r from-slate-950 via-blue-900 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            Flow Bit
          </span>
        </Link>

        {/* Segmented Dual Theme Switcher (Bright vs Dark) */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <button
            type="button"
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              !isDark
                ? 'bg-amber-500 text-white shadow-[0_2px_8px_rgba(245,158,11,0.35)] scale-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Bright theme"
          >
            <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Bright</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isDark
                ? 'bg-zinc-800 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] scale-100'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            aria-label="Dark theme"
          >
            <Moon className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Dark</span>
          </button>
        </div>
      </header>

      {/* Main Card Container */}
      <motion.main
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[430px] z-10 my-16 sm:my-8"
      >
        <div className="bg-white dark:bg-[#0f0f12] rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 border border-slate-200/90 dark:border-zinc-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative transition-all duration-200">
          {/* Header Row with Back Button & Title */}
          <div className="relative flex flex-col items-center justify-center mb-6 text-center">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="absolute left-0 top-0.5 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-zinc-400 mt-1.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default AuthLayout;


