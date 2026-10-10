import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What is FlowBit and how does it help my team?",
    answer: "FlowBit is an all-in-one workspace that brings together project management, real-time chat, video meetings, document collaboration, attendance tracking, and performance analytics. Instead of juggling multiple tools, your team gets everything in a single, unified platform — so nothing falls through the cracks."
  },
  {
    question: "Does FlowBit support video meetings?",
    answer: "Yes! FlowBit has built-in meeting scheduling with automatic Google Meet link generation. You can schedule meetings, view upcoming calls on your calendar, and join video conferences directly from the platform — no need to switch between tools."
  },
  {
    question: "Is my data secure on FlowBit?",
    answer: "Absolutely. We use industry-standard encryption for all data in transit and at rest. FlowBit supports two-step verification for added account security, and our platform undergoes regular security audits to ensure your team's data stays protected."
  },
  {
    question: "Can I use FlowBit on mobile devices?",
    answer: "Yes, FlowBit is fully responsive and works seamlessly across desktops, tablets, and mobile devices. Access your projects, chat with your team, join meetings, and manage tasks from any device with a modern web browser."
  },
  {
    question: "Does FlowBit support multiple languages?",
    answer: "Yes! FlowBit currently supports English, Hindi, and Spanish, with more languages coming soon. You can switch languages anytime from your Settings page to use the platform in your preferred language."
  },
  {
    question: "How do I get started with FlowBit?",
    answer: "Getting started is easy — just click 'Start Free' to create your account. Once signed up, you can set up your first project, invite team members, and start collaborating right away. No credit card required for the free plan."
  }
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const itemId = `faq-item-${index}`;
  const contentId = `faq-content-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
    >
      <div
        className="rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: isOpen ? '#1a1a1a' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${isOpen ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <button
          id={itemId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(index)}
          className="w-full flex items-center justify-between py-4 px-5 md:py-4.5 md:px-6 text-left group cursor-pointer transition-all duration-300"
        >
          <span
            className="text-sm md:text-base font-semibold pr-4 leading-relaxed transition-colors duration-300"
            style={{ color: isOpen ? '#ffffff' : '#111827' }}
          >
            {faq.question}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            }}
          >
            <ChevronDown
              size={16}
              style={{ color: isOpen ? '#ffffff' : '#4b5563' }}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={contentId}
              role="region"
              aria-labelledby={itemId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, type: "spring", bounce: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="text-sm leading-relaxed pb-5 px-5 md:px-6 pt-1 text-white/70"
              >
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const leftCol = faqData.filter((_, idx) => idx % 2 === 0);
  const rightCol = faqData.filter((_, idx) => idx % 2 !== 0);

  return (
    <section
      id="faqs"
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: '#f5f3f0' }}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              fontStyle: 'normal',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#111827',
            }}
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-4 text-neutral-600"
          >
            Everything you need to know about FlowBit. Can't find the answer you're looking for? Feel free to contact our support team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-4">
            {leftCol.map((faq, i) => {
              const actualIndex = i * 2;
              return (
                <FAQItem
                  key={actualIndex}
                  faq={faq}
                  index={actualIndex}
                  isOpen={openIndex === actualIndex}
                  onToggle={handleToggle}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            {rightCol.map((faq, i) => {
              const actualIndex = i * 2 + 1;
              return (
                <FAQItem
                  key={actualIndex}
                  faq={faq}
                  index={actualIndex}
                  isOpen={openIndex === actualIndex}
                  onToggle={handleToggle}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
