import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import chatPreview from '../../assets/Screenshot 2026-10-09 170613.png';

const checklistItems = [
  { key: 'workflow_checklist_1', text: 'Unified inbox for tasks, chats & meetings' },
  { key: 'workflow_checklist_2', text: 'Real-time collaboration across all tools' },
  { key: 'workflow_checklist_3', text: 'AI-powered performance insights' },
  { key: 'workflow_checklist_4', text: 'Zero setup — ready in under 2 minutes' },
];

const WorkflowSection = () => {
  return (
    <section
      id="how-it-works"
      className="px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: '#245F73' }}
          >
            Work smarter,{' '}
            <span style={{ color: '#733E24' }}>collaborate faster.</span>
          </h2>
          <p className="mt-4" style={{ color: '#BBBDBC' }}>
            From planning to execution, everything happens in one place.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: '#BBBDBC' }}
            >
              No more switching between tools. No more lost messages.{' '}
              <span className="font-semibold" style={{ color: '#245F73' }}>
                Just pure productivity.
              </span>
            </p>

            <div
              className="rounded-2xl p-6 md:p-8 space-y-5"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(36,95,115,0.08)',
                boxShadow: '0 1px 3px rgba(36,95,115,0.06)',
              }}
            >
              {checklistItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 size={18} style={{ color: '#245F73', flexShrink: 0 }} />
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(36,95,115,0.1)',
                boxShadow: '0 20px 50px rgba(36,95,115,0.1)',
              }}
            >
              <img
                src={chatPreview}
                alt="FlowBit team chat and messaging"
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
