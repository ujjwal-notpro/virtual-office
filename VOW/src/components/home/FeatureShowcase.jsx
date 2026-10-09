import React from 'react';
import { motion } from 'framer-motion';
import dashboardPreview from "../../assets/Imageto.PNG";
import { Zap, CheckCircle2, Layers, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';

const featureList = [
  { icon: Layers, color: '#1ee065ff', text: 'Unified project & task management' },
  { icon: MessageSquare, color: '#1ee065ff', text: 'Real-time team chat & threads' },
  { icon: BarChart3, color: '#1ee065ff', text: 'Live performance dashboards' },
  { icon: ShieldCheck, color: '#1ee065ff', text: 'Enterprise-grade security & uptime' },
];

const FeatureShowcase = () => {
  return (
    <section
      id="showcase"
      className="w-full py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        <div className="text-center mb-16 md:mb-24 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              color: '#0d9488',
            }}
          >
            All-in-one platform
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
            style={{ color: 'var(--text-primary)' }}
          >
            Work Smarter.{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #aac2e9ff 0%, #74d4c8ff 50%, #6dcadfff 100%)' }}
            >
              Collaborate Faster.
            </span>
            <br />Grow Together.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            From planning and collaboration to deployment and performance tracking —
            everything in one platform.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'none',
          }}
        >

          <div className="grid lg:grid-cols-2 gap-0">

            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3
                  className="text-3xl md:text-4xl font-black leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  From Start to Success —{' '}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #b8e6daff, #288374ff)' }}
                  >
                    All in One Workspace
                  </span>
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  FlowBit streamlines your workflow from planning to execution. Manage projects,
                  tasks, chats, meetings, documents, attendance, and performance — all inside one
                  seamless and modern platform built to scale with your team.
                </p>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="space-y-3"
              >
                {featureList.map(({ icon: Icon, color, text }, i) => (
                  <motion.li
                    key={text}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.48 + i * 0.07 }}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                    >
                      <CheckCircle2 size={13} style={{ color }} />
                    </div>
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <div
              className="relative flex items-center justify-center p-6 md:p-10 lg:p-12"
              style={{ borderLeft: '1px solid var(--border-color)' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25 }}
                className="relative w-full"
              >
                <div
                  className="relative rounded-2xl overflow-hidden feature-img-frame"
                  style={{
                    boxShadow: 'none',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    padding: '6px',
                  }}
                >
                  <div className="rounded-xl overflow-hidden relative group">

                    <div className="absolute inset-0 bg-[var(--card-bg)] transition-colors duration-300"></div>

                    <img
                      src={dashboardPreview}
                      alt="FlowBit workspace — all in one platform"
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 w-full h-auto block transform group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                    />

                    <div className="absolute inset-0 z-30 pointer-events-none rounded-xl border border-black/5 dark:border-white/10" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;

