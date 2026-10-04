import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Hero
      hero_title_line1: 'Your Virtual Office,',
      hero_title_line2: 'Anywhere.',
      hero_description:
        'VOW brings your entire team into one seamless virtual workspace — with real-time collaboration, presence, and productivity tools built for the modern remote team.',
      cta_getStarted: 'Get Started Free',
      cta_learnMore: 'Explore Features',

      // Navbar
      nav_home: 'Home',
      nav_features: 'Features',
      nav_pricing: 'Pricing',
      nav_about: 'About',
      nav_contact: 'Contact',
      nav_learn_more: 'Learn More',
      nav_login: 'Sign In',
      nav_signup: 'Get Started',

      // StatsSection
      stats_title: 'Trusted by',
      stats_title_highlight: 'Teams Worldwide',
      stats_subtitle: 'Join thousands of teams who have transformed their remote work experience with VOW.',
      stats_users: '50K+',
      stats_users_label: 'Active Users',
      stats_satisfaction: '98%',
      stats_satisfaction_label: 'Satisfaction Rate',
      stats_uptime: '99.9%',
      stats_uptime_label: 'Uptime SLA',
      stats_cta: 'Join the community →',

      // WorkflowSection
      workflow_title: 'How It Works',
      workflow_subtitle: 'Get your team set up and collaborating in minutes — not weeks.',
      workflow_step1_title: 'Create Your Workspace',
      workflow_step1_desc: 'Set up your virtual office in under 2 minutes. No IT team required.',
      workflow_step2_title: 'Invite Your Team',
      workflow_step2_desc: 'Send invites via email or link. Your team joins instantly.',
      workflow_step3_title: 'Start Collaborating',
      workflow_step3_desc: 'Chat, meet, manage projects and track progress — all in one place.',

      // ToolsGrid
      tools_title: 'Everything Your Team Needs',
      tools_subtitle: 'A complete virtual office platform with all the tools for seamless remote work.',

      // Testimonials
      testimonials_title: 'Loved by Remote Teams',
      testimonials_subtitle: 'See how VOW has transformed the way teams work together.',

      // FAQs
      faq_title: 'Frequently Asked Questions',
      faq_subtitle: 'Everything you need to know about VOW.',

      // Footer
      footer_tagline: 'Your Virtual Office, Anywhere.',
      footer_rights: '© 2026 VOW. All rights reserved.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
