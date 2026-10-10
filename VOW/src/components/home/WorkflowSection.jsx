import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import chatPreview from '../../assets/Screenshot 2026-10-09 170613.png';

const checklistItems = [
  { key: 'workflow_checklist_1', text: 'Unified inbox for tasks, chats & meetings' },
  { key: 'workflow_checklist_2', text: 'Real-time collaboration across all tools' },
  { key: 'workflow_checklist_3', text: 'AI-powered performance insights' },
  { key: 'workflow_checklist_4', text: 'Zero setup — ready in under 2 minutes' },
];

const WorkflowSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-60 pointer-events-none overflow-hidden opacity-15">
        <svg width="100%" height="240" viewBox="0 0 1200 240" fill="none" preserveAspectRatio="none">
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${200 - i * 25} Q200 ${180 - i * 20 + Math.sin(i * 2) * 15} 500 ${190 - i * 22} T1200 ${185 - i * 24}`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: '#ffffff' }}
              >
                Work smarter,{' '}
                <span className="text-white/60">
                  collaborate faster.
                </span>
              </h2>

              <p className="text-base leading-relaxed max-w-lg text-white/70">
                From planning to execution, everything happens in one place. No more switching between tools. No more lost messages.{' '}
                <span className="text-white font-semibold">
                  Just pure productivity.
                </span>
              </p>
            </div>

            <div
              className="rounded-2xl p-6 md:p-8 space-y-5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {checklistItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 size={16} style={{ color: '#ffffff', flexShrink: 0 }} />
                  <span className="text-sm font-medium text-white/80">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative"
          >
            <div
              className="rounded-2xl overflow-hidden group shadow-2xl"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={chatPreview}
                alt="FlowBit team chat and messaging"
                loading="lazy"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.4) 100%)',
                }}
              />
            </div>

            <div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full pointer-events-none hidden lg:block"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)',
              }}
            />
          </motion.div>
        </div>
      </div>
      <div
        className="w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
      />
    </section>
  );
};

export default WorkflowSection;


