
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import WorkflowSection from '../components/home/WorkflowSection';
import FeatureShowcase from '../components/home/FeatureShowcase';
import FAQs from '../components/home/FAQs';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F2F0EF', color: '#2c2c2c' }}>
      <Navbar />
      <Hero />
      <WorkflowSection />
      <FeatureShowcase />
      <FAQs />
      <Footer />
    </div>
  );
}
