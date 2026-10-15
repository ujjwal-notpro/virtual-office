
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import WorkflowSection from '../components/home/WorkflowSection';
import FeatureShowcase from '../components/home/FeatureShowcase';
import FAQs from '../components/home/FAQs';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#fafbfc', color: '#1a1a2e' }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full"
          style={{ background: 'rgba(22,163,74,0.08)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full"
          style={{ background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full"
          style={{ background: 'rgba(22,163,74,0.05)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.35,
            backgroundImage: 'linear-gradient(to right, rgba(22,163,74,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,163,74,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <Navbar />
      <Hero />
      <WorkflowSection />
      <FeatureShowcase />
      <FAQs />
      <Footer />
    </div>
  );
}
