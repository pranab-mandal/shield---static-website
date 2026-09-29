import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LetterGlitch from '../components/react-bits/LetterGlitch';
import BorderGlow from '../components/BorderGlow';

const ScrollRevealCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`h-full transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

const Home = () => (
  <main className="bg-neutral-950 min-h-screen">
    {/* Hero Section */}
    <div className="w-full h-screen relative overflow-hidden">
      {/* Animated Glitch Background */}
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={["#2b4539","#61dca3","#61b3dc"]}
        />
      </div>
      
      {/* Simple Gradient Mask for Readability */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-r from-black/90 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 md:px-24 flex flex-col justify-center pointer-events-none">
        <div className="max-w-2xl flex flex-col items-start text-left space-y-6 pt-20">
          
          <p className="text-[#61dca3] font-mono text-sm tracking-wider uppercase">
            NIT Hamirpur
          </p>

          <div>
            <h1 className="text-white text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight">
              SHIELD
            </h1>
            <h2 className="text-gray-200 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-1">
              CYBER SOCIETY
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 font-medium leading-snug">
            Society for Hacking Intelligence and Ethical Learning and Defense
          </p>
          
          <p className="text-gray-400 text-base md:text-lg">
            People · Ideas · A Safer Digital World
          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
            A community focused on learning, ethical security research, practical problem solving, and building a safer digital world.
          </p>

          <div className="pt-6 flex flex-wrap gap-4 pointer-events-auto">
            <Link 
              to="/activities#latest-events" 
              className="px-6 py-3 bg-[#61dca3] text-neutral-950 font-semibold rounded transition-colors duration-200 hover:bg-[#4fbe8b]"
            >
              Register for Event
            </Link>
            
            <Link 
              to="/about" 
              className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
            >
              Explore SHIELD
            </Link>
          </div>
          
        </div>
      </div>
    </div>

    {/* Core Mission Section */}
    <div className="w-full py-24 px-6 sm:px-12 md:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16">
          <p className="text-[#61dca3] font-mono text-sm tracking-wider uppercase mb-3">
            Core Mission
          </p>
          <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            What We Do at SHIELD
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed border-l-2 border-[#61b3dc]/50 pl-4">
            Bridging academic concepts with industrial cyber defense through continuous hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          <ScrollRevealCard delay={0}>
            <BorderGlow
              className="h-full"
              backgroundColor="#0a0a0a"
              glowColor="150 65 62"
              colors={['#61dca3', '#61b3dc', '#2b4539']}
              borderRadius={8}
            >
              <div className="h-full flex flex-col items-start p-8 group">
                <h3 className="text-2xl text-white font-semibold mb-3">8 Specialized Domains</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  From Web & Cloud to AI Security and Digital Forensics, build comprehensive expertise across modern security disciplines.
                </p>
                <Link to="/domains" className="relative text-[#61b3dc] group-hover:text-white font-medium inline-flex items-center transition-colors pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:bg-current after:transition-all after:duration-300">
                  Explore All Domains <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </BorderGlow>
          </ScrollRevealCard>

          <ScrollRevealCard delay={150}>
            <BorderGlow
              className="h-full"
              backgroundColor="#0a0a0a"
              glowColor="150 65 62"
              colors={['#61dca3', '#61b3dc', '#2b4539']}
              borderRadius={8}
            >
              <div className="h-full flex flex-col items-start p-8 group">
                <h3 className="text-2xl text-white font-semibold mb-3">Practical CTFs & Workshops</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  Get hands-on in sandboxed environments, solve real-world vulnerabilities, and participate in collegiate cybersecurity leagues.
                </p>
                <Link to="/activities" className="relative text-[#61b3dc] group-hover:text-white font-medium inline-flex items-center transition-colors pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:bg-current after:transition-all after:duration-300">
                  View Activities <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </BorderGlow>
          </ScrollRevealCard>

          <ScrollRevealCard delay={0}>
            <BorderGlow
              className="h-full"
              backgroundColor="#0a0a0a"
              glowColor="150 65 62"
              colors={['#61dca3', '#61b3dc', '#2b4539']}
              borderRadius={8}
            >
              <div className="h-full flex flex-col items-start p-8 group">
                <h3 className="text-2xl text-white font-semibold mb-3">Real-World Tool Development</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  Build open-source security tools, detection daemons, and defensive scripts that solve real engineering challenges.
                </p>
                <Link to="/projects" className="relative text-[#61b3dc] group-hover:text-white font-medium inline-flex items-center transition-colors pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:bg-current after:transition-all after:duration-300">
                  Discover Projects <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </BorderGlow>
          </ScrollRevealCard>

          <ScrollRevealCard delay={150}>
            <BorderGlow
              className="h-full"
              backgroundColor="#0a0a0a"
              glowColor="150 65 62"
              colors={['#61dca3', '#61b3dc', '#2b4539']}
              borderRadius={8}
            >
              <div className="h-full flex flex-col items-start p-8 group">
                <h3 className="text-2xl text-white font-semibold mb-3">Recruitment & Community</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  Join a tight-knit community of curious technologists, ethical hackers, and defensive engineers at NIT Hamirpur.
                </p>
                <Link to="/team" className="relative text-[#61b3dc] group-hover:text-white font-medium inline-flex items-center transition-colors pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:bg-current after:transition-all after:duration-300">
                  Join the Society <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </BorderGlow>
          </ScrollRevealCard>

        </div>
      </div>
    </div>
  </main>
);

export default Home;
