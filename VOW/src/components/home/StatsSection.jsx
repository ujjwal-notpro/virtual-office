import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="w-full py-8 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        <motion.div
          whileHover="hover"
          initial="initial"
          className="relative mb-12 p-6 md:p-10 lg:p-12 rounded-[2rem] overflow-hidden group max-w-6xl mx-auto transition-all duration-500 hover:-translate-y-1"
          style={{
            background: "linear-gradient(145deg, rgba(128, 128, 128, 0.08) 0%, rgba(128, 128, 128, 0.02) 100%)",
            border: "1px solid rgba(128, 128, 128, 0.15)",
            boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.03)",
            backdropFilter: "blur(20px)",
            transformStyle: "preserve-3d",
            perspective: 1200
          }}
        >
          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.8, rotate: 0 },
              hover: {
                opacity: 0.15,
                scale: 1.5,
                rotate: 90,
                transition: { duration: 10, ease: "linear", repeat: Infinity }
              }
            }}
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.5) 0%, rgba(168, 85, 247, 0.4) 30%, transparent 70%)",
              filter: "blur(60px)",
              zIndex: 0
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 lg:gap-10">

            <div className="w-full text-center md:text-left max-w-4xl mx-auto md:mx-0 flex flex-col items-center md:items-start">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-6 shadow-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-black tracking-[0.2em] uppercase">Stats Growth</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tighter mb-6 leading-[1.1]"
                style={{ color: 'var(--text-primary)' }}
              >
                Trusted by Teams Worldwide
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
              </motion.p>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-6 md:gap-8 mt-2 max-w-4xl mx-auto">

              <motion.div
                variants={{
                  initial: { y: 0 },
                  hover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
                className="relative p-6 md:p-8 rounded-3xl flex-1 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] group-hover:bg-indigo-500/40 transition-colors duration-700" />
                <div className="flex flex-col items-start text-left relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5 shadow-sm border border-indigo-500/20">
                    <Users className="w-6 h-6 text-indigo-500" strokeWidth={2.5} />
                  </div>
                  <h3
                    className="text-[40px] md:text-5xl lg:text-6xl font-black mb-2 tracking-tighter"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    2M+
                  </h3>
                  <div className="h-[2px] w-10 bg-indigo-500/40 mb-3 rounded-full" />
                  <p className="text-sm md:text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Active users across the globe
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  initial: { y: 0 },
                  hover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
                className="relative p-6 md:p-8 rounded-3xl flex-1 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(20, 184, 166, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)",
                  border: "1px solid rgba(20, 184, 166, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-[40px] group-hover:bg-teal-500/40 transition-colors duration-700" />
                <div className="flex flex-col items-start text-left relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5 shadow-sm border border-teal-500/20">
                    <TrendingUp className="w-6 h-6 text-teal-500" strokeWidth={2.5} />
                  </div>
                  <h3
                    className="text-[40px] md:text-5xl lg:text-6xl font-black mb-2 tracking-tighter"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    98%
                  </h3>
                  <div className="h-[2px] w-10 bg-teal-500/40 mb-3 rounded-full" />
                  <p className="text-sm md:text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
                    User satisfaction rating from our community
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;
