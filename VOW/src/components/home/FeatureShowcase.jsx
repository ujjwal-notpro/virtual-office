import React from 'react';
import meetingImg from '../../assets/Screenshot 2026-10-09 170539.png';
import chatImg from '../../assets/Screenshot 2026-10-09 170613.png';
import profileImg from '../../assets/Screenshot 2026-10-09 170708.png';
import aiNotesImg from '../../assets/Screenshot 2026-10-09 170742.png';
import { Layers, MessageSquare, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const featureList = [
  { icon: Layers, title: 'Unified Platform', text: 'Unified project & task management' },
  { icon: MessageSquare, title: 'Team Chat', text: 'Real-time team chat & threads' },
  { icon: BarChart3, title: 'Analytics', text: 'Live performance dashboards' },
  { icon: ShieldCheck, title: 'Security', text: 'Enterprise-grade security & uptime' },
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
      className="px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: '#111827' }}
          >
            Included In Your Office Platform
          </h2>
          <p className="mt-4" style={{ color: '#6b7280' }}>
            FlowBit streamlines your workflow from planning to execution. Manage projects,
            tasks, chats, meetings, documents, attendance, and performance — all inside one
            seamless and modern platform built to scale with your team.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {featureList.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl p-6 transition-all duration-300"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(22,163,74,0.08)';
                e.currentTarget.style.borderColor = 'rgba(22,163,74,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
              }}
            >
              <div
                className="mb-4 inline-flex w-11 h-11 items-center justify-center rounded-xl transition-colors duration-300"
                style={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: '#111827' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{text}</p>
            </article>
          ))}
        </div>

        <div id="workspace" className="mb-20 scroll-mt-24">
          <div className="text-center mb-10 md:mb-12">
            <h3
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: '#111827' }}
            >
              See Your Working Space
            </h3>
            <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: '#6b7280' }}>
              Explore the core workspaces built to power day-to-day collaboration across teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workspaceItems.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col rounded-2xl p-4 sm:p-5 transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3.5" style={{ backgroundColor: '#f3f4f6' }}>
                  <img
                    src={item.img}
                    alt={`FlowBit ${item.label} interface preview`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="w-full text-left pt-1">
                  <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>
                    {item.label}
                  </h4>
                  <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div
            className="rounded-3xl px-8 py-14 text-center relative overflow-hidden sm:px-12"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #10b981)',
            }}
          >
            <h3
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              style={{ color: '#ffffff' }}
            >
              Ready To Try FlowBit?
            </h3>
            <p
              className="text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Experience the full platform with your team. Seamless real-time meetings, chat, and AI tools built for productivity.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16a34a',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                Get started free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
