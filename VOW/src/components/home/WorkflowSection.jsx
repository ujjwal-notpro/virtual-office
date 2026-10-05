import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const checklistItems = [
  { key: 'workflow_checklist_1', text: 'Unified inbox for tasks, chats & meetings' },
  { key: 'workflow_checklist_2', text: 'Real-time collaboration across all tools' },
  { key: 'workflow_checklist_3', text: 'AI-powered performance insights' },
  { key: 'workflow_checklist_4', text: 'Zero setup — ready in under 2 minutes' },
];

const WorkflowSection = () => {
  const t = (_, fallback) => fallback;
  return (
    <section
      className="w-full py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24 items-center">

          <div className="space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))',
                border: '1px solid rgba(59,130,246,0.25)',
                color: '#60a5fa',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t('workflow_badge', 'Workflow')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('workflow_title_1', 'Work smarter,')}{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
              >
                {t('workflow_title_2', 'collaborate')}
              </span>
              <br />{t('workflow_title_3', 'faster.')}
            </motion.h2>

          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            />

            <div
              className="relative rounded-2xl p-8 md:p-10 space-y-8"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
              }}
            >
              <div
                className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent)' }}
              />

              <p
                className="text-base md:text-lg leading-relaxed font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('workflow_desc_p1', 'From planning to execution, everything happens in one place. No more switching between tools. No more lost messages.')}{' '}
                <span
                  className="font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                >
                  {t('workflow_desc_highlight', 'Just pure productivity.')}
                </span>
              </p>

              <ul className="space-y-3.5">
                {checklistItems.map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
                    {t(item.key, item.text)}
                  </motion.li>
                ))}
              </ul>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
