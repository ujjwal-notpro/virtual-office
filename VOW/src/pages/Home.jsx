
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import WorkflowSection from '../components/home/WorkflowSection';
import FeatureShowcase from '../components/home/FeatureShowcase';
import FAQs from '../components/home/FAQs';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <Navbar />
      <Hero />
      <WorkflowSection />
      <FeatureShowcase />
      <FAQs />
      <Footer />
    </div>
  );
}
