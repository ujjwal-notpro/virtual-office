import React, { useState } from 'react';
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
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: '#ffffff',
        border: `1px solid ${isOpen ? 'rgba(36,95,115,0.25)' : 'rgba(36,95,115,0.08)'}`,
        boxShadow: isOpen ? '0 4px 20px rgba(36,95,115,0.08)' : '0 1px 3px rgba(36,95,115,0.04)',
      }}
    >
      <button
        id={itemId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between py-4 px-5 md:px-6 text-left cursor-pointer transition-all duration-300"
      >
        <span
          className="text-sm md:text-base font-semibold pr-4 leading-relaxed"
          style={{ color: '#245F73' }}
        >
          {faq.question}
        </span>

        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isOpen ? 'rgba(36,95,115,0.1)' : 'rgba(36,95,115,0.05)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronDown
            size={16}
            style={{ color: isOpen ? '#245F73' : '#BBBDBC' }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={itemId}
          className="overflow-hidden"
        >
          <div
            className="text-sm leading-relaxed pb-5 px-5 md:px-6 pt-1"
            style={{ color: '#8a8c8b' }}
          >
            {faq.answer}
          </div>
        </div>
      )}
    </div>
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
      className="px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: '#245F73' }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-4"
            style={{ color: '#BBBDBC' }}
          >
            Everything you need to know about FlowBit. Can't find the answer you are looking for? Feel free to contact our support team.
          </p>
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
