import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import homeImg from '../../assets/home.PNG';

const Hero = () => {
  return (
    <section id="home" className="w-full pt-10 md:pt-16 pb-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500">Virtual</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-700">Office,</span><br />
              Anywhere.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-xl mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              FlowBit brings your entire team into one seamless virtual workspace - with real-time collaboration, presence, and productivity tools built for the modern remote team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link to="/sign-up" className="w-full sm:w-auto">
                <button className="group relative flex items-center justify-center gap-2 px-8 py-3.5 w-full sm:w-auto text-sm font-bold text-white dark:text-black rounded-xl overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 cursor-pointer">
                  <span className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  Get Started Free <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center relative">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/30 dark:bg-blue-600/20 rounded-full blur-[80px] z-0 pointer-events-none"
            />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} className="relative z-10 w-full flex justify-center">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-2 sm:p-2.5  backdrop-blur-sm group">
                <img src={homeImg} alt="Flow Bit Virtual Office Dashboard" loading="eager" className="w-full h-auto max-h-[480px] object-contain rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
