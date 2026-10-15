import { ArrowRight, Zap } from 'lucide-react';
import dashboardImg from '../../assets/Screenshot 2026-10-09 170539.png';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative px-4 pb-20 pt-16 sm:px-6 sm:pt-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              border: '1px solid rgba(22,163,74,0.2)',
              backgroundColor: 'rgba(22,163,74,0.05)',
              color: '#16a34a',
            }}
          >
            <Zap className="w-4 h-4" />
            Virtual Office Platform
          </div>

          <div className="space-y-4">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ lineHeight: 1.05, color: '#111827' }}
            >
              Your{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #16a34a, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Virtual
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(to right, #16a34a, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Office,
              </span>
              <br />
              Anywhere.
            </h1>

            <p
              className="max-w-xl text-lg leading-relaxed"
              style={{ color: '#6b7280' }}
            >
              FlowBit brings your entire team into one seamless virtual workspace — with real-time collaboration, presence, and productivity tools built for the modern remote team.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 font-medium rounded-md h-12 px-8 text-base transition-all duration-200"
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-2 font-medium rounded-md h-12 px-8 text-base transition-all duration-200"
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                backgroundColor: '#ffffff',
                color: '#374151',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              Explore Showcase
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-sm" style={{ color: '#6b7280' }}>
            <span>Real-time collaboration</span>
            <span>AI-powered tools</span>
            <span>Video meetings</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <div
            className="overflow-hidden rounded-2xl bg-white"
            style={{
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            }}
          >
            <img
              src={dashboardImg}
              alt="Flow Bit Virtual Office Dashboard"
              loading="eager"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
