import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import dashboardImg from '../../assets/Screenshot 2026-10-09 170539.png';

const Hero = () => {
  return (
    <section
      id="home"
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="absolute top-0 left-0 right-0 h-80 pointer-events-none overflow-hidden opacity-20">
        <svg width="100%" height="300" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${50 + i * 20} Q300 ${30 + i * 15 + Math.sin(i) * 30} 600 ${60 + i * 18} T1200 ${40 + i * 22}`}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-start text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.75rem, 5.5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              Your{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 50%, #c0c0c0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Virtual
              </span>
              <br />
              <span
                style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 50%, #a0a0a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Office,
              </span>
              <br />
              Anywhere.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base md:text-lg max-w-md mb-5 leading-relaxed text-white/70 font-normal"
            >
              FlowBit brings your entire team into one seamless virtual workspace — with real-time collaboration, presence, and productivity tools built for the modern remote team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center"
            >
              <a
                href="#showcase"
                aria-label="Explore FlowBit platform showcase"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-white text-black hover:bg-neutral-100 shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span>Explore Showcase</span>
                <ArrowDown className="w-4 h-4 text-black" aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative w-full flex justify-center"
          >
            <div className="relative w-full">
              <div
                className="relative rounded-2xl overflow-hidden group shadow-2xl"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src={dashboardImg}
                  alt="Flow Bit Virtual Office Dashboard"
                  loading="eager"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 75%, rgba(0,0,0,0.3) 100%)',
                  }}
                />
              </div>

              <div
                className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
      />
    </section>
  );
};

export default Hero;
