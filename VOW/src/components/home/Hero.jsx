import dashboardImg from '../../assets/Screenshot 2026-10-09 170539.png';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative px-4 pb-20 pt-28 sm:px-6 sm:pt-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ lineHeight: 1.05, color: '#245F73' }}
            >
              Your{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #245F73, #733E24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Virtual
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(to right, #733E24, #245F73)',
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
              style={{ color: '#BBBDBC' }}
            >
              FlowBit brings your entire team into one seamless virtual workspace — with real-time collaboration, presence, and productivity tools built for the modern remote team.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-2 font-medium rounded-md h-12 px-8 text-base transition-all duration-200"
              style={{
                border: '1px solid rgba(36,95,115,0.2)',
                backgroundColor: '#ffffff',
                color: '#245F73',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#245F73';
                e.currentTarget.style.color = '#F2F0EF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#245F73';
              }}
            >
              Explore Showcase
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-sm" style={{ color: '#BBBDBC' }}>
            <span>Real-time collaboration</span>
            <span>AI-powered tools</span>
            <span>Video meetings</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(36,95,115,0.1)',
              boxShadow: '0 20px 50px rgba(36,95,115,0.1)',
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
