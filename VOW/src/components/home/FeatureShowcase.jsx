import React from 'react';
import { motion } from 'framer-motion';
import meetingImg from '../../assets/Screenshot 2026-10-09 170539.png';
import chatImg from '../../assets/Screenshot 2026-10-09 170613.png';
import profileImg from '../../assets/Screenshot 2026-10-09 170708.png';
import aiNotesImg from '../../assets/Screenshot 2026-10-09 170742.png';
import { Layers, MessageSquare, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const featureList = [
  { icon: Layers, text: 'Unified project & task management' },
  { icon: MessageSquare, text: 'Real-time team chat & threads' },
  { icon: BarChart3, text: 'Live performance dashboards' },
  { icon: ShieldCheck, text: 'Enterprise-grade security & uptime' },
];

const workspaceItems = [
  { label: 'Meetings & Calls', img: meetingImg, desc: 'HD video conferencing and screen sharing' },
  { label: 'Team Chat', img: chatImg, desc: 'Real-time threaded channels & direct messages' },
  { label: 'AI Meeting Notes', img: aiNotesImg, desc: 'Automated summaries & actionable items' },
  { label: 'Profile & Team', img: profileImg, desc: 'Presence statuses and directory' },
];

const FeatureShowcase = () => {
  return (
    <section
      id="showcase"
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: '#f5f3f0' }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-28 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#111827',
              }}
            >
              Included In Your
              <br />
              Office Platform
            </h2>

            <p className="text-base leading-relaxed max-w-md text-neutral-600">
              FlowBit streamlines your workflow from planning to execution. Manage projects,
              tasks, chats, meetings, documents, attendance, and performance — all inside one
              seamless and modern platform built to scale with your team.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {featureList.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: '#1a1a1a',
                    }}
                  >
                    <Icon size={14} style={{ color: '#ffffff' }} />
                  </div>
                  <span className="text-sm font-medium leading-snug pt-1 text-neutral-800">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex items-center"
          >
            <div
              className="relative rounded-2xl overflow-hidden w-full group shadow-2xl"
              style={{
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={aiNotesImg}
                alt="FlowBit AI Meeting Notes Generator"
                loading="lazy"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </div>

        <div
          className="w-full h-[1px] mb-20 md:mb-28"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12), transparent)' }}
        />

        <div className="w-full mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.2,
                color: '#111827',
              }}
            >
              See Your Working Space
            </h3>
            <p className="text-sm mt-2 text-neutral-600 max-w-lg mx-auto">
              Explore the core workspaces built to power day-to-day collaboration across teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {workspaceItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="group flex flex-col bg-white rounded-2xl p-4 sm:p-5 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 mb-3.5">
                  <img
                    src={item.img}
                    alt={`FlowBit ${item.label} interface preview`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="w-full text-left pt-1">
                  <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-black">
                    {item.label}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h3
              className="mb-4 text-white"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.2,
              }}
            >
              Ready To Try FlowBit?
            </h3>
            <p className="text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto text-white/70">
              Experience the full platform with your team. Seamless real-time meetings, chat, and AI tools built for productivity.
            </p>
            <a
              href="/sign-in"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 shadow-md hover:shadow-lg hover:bg-neutral-100"
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;

