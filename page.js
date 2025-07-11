import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    setDoc,
    query,
    orderBy,
    where,
    writeBatch
} from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual Firebase config
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Initialize Firebase ---
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    console.warn("Firebase initialization error:", error.message);
}

const auth = getAuth(app);
const db = getFirestore(app);

// --- SVG Icons & Illustrations ---
const BrainCircuitIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.993.142"/><path d="M18 5a3 3 0 1 0-5.993.142"/><path d="M12 19a3 3 0 1 0 5.993-.142"/><path d="M6 19a3 3 0 1 0 5.993-.142"/><path d="M12 12a3 3 0 1 0-5.993.142"/><path d="M18 12a3 3 0 1 0-5.993.142"/><path d="M14.5 10.5h-5"/><path d="M14.5 13.5h-5"/><path d="M10.5 7.5v-1"/><path d="M13.5 7.5v-1"/><path d="M10.5 17.5v-1"/><path d="M13.5 17.5v-1"/><path d="M7.5 10.5h-1"/><path d="M17.5 10.5h-1"/><path d="M7.5 13.5h-1"/><path d="M17.5 13.5h-1"/>
  </svg>
);
const RocketIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.33.04-3.18S5.34 15.66 4.5 16.5z"/><path d="m12 8.5-1.9-1.9c-1.2-1.2-3-1.2-4.2 0l-1.34 1.34c-1.2 1.2-1.2 3 0 4.2l1.9 1.9"/><path d="m18 2-1.5 1.5"/><path d="m22 6-1.5 1.5"/><path d="m19 9-1.5 1.5"/><path d="m15 13-1.5 1.5"/><path d="m13.5 5.5 4-4"/><path d="m17.5 9.5 4-4"/>
  </svg>
);
const GlobeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
  </svg>
);
const BarChartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);
const ExternalLinkIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const CloseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const PartnershipIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
const TransparencyIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 7 2 12s4.5 10 10 10 10-5 10-10S17.5 2 12 2Z"/><path d="m16 16-1.1-1.1a2 2 0 0 0-2.83 0L8 19"/>
        <path d="m20 4-3 3"/><path d="m17 7 1 1"/><path d="m14 4-1 1"/><path d="M10 8 9 9"/>
    </svg>
);
const InnovationIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l.34 2.28a2 2 0 0 0 1.8 1.8l2.28.34-2.28.34a2 2 0 0 0-1.8 1.8l-.34 2.28-.34-2.28a2 2 0 0 0-1.8-1.8l-2.28-.34 2.28-.34a2 2 0 0 0 1.8-1.8z"/>
        <path d="M3 12.31l.91 6.09a2 2 0 0 0 1.82 1.57h10.54a2 2 0 0 0 1.82-1.57l.91-6.09L12 2.69z"/>
    </svg>
);
const MissionIllustration = (props) => (
    <svg {...props} viewBox="0 0 100 100">
        <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="50" cy="50" r="15" fill="currentColor"/>
        <path d="M42 50 L58 50" stroke="#1F2937" strokeWidth="3"/>
        <path d="M50 42 L50 58" stroke="#1F2937" strokeWidth="3"/>
    </svg>
);
const VisionIllustration = (props) => (
    <svg {...props} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5"/>
        <circle cx="50" cy="50" r="10" fill="currentColor"/>
    </svg>
);
const TeamIllustration = (props) => (
    <svg {...props} viewBox="0 0 100 100">
        <circle cx="30" cy="35" r="10" fill="currentColor"/>
        <path d="M20 60 Q 30 45 40 60 Z" fill="currentColor"/>
        <circle cx="70" cy="35" r="10" fill="currentColor"/>
        <path d="M60 60 Q 70 45 80 60 Z" fill="currentColor"/>
        <path d="M25 80 Q 50 65 75 80" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
);
const SeoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17a5 5 0 0 0 5-5 5 5 0 0 0-5-5H7"/><path d="M7 17L17 7"/></svg>;
const PpcIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4h-6"/><path d="M12 18V6"/></svg>;
const BrandingIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18l-3-3 3-3 3 3-3 3z"/></svg>;
const SocialIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const WebDevIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="20" x2="12" y2="4"/></svg>;
const VideoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;

// --- Components ---

const Navbar = ({ setPage, isAdmin, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'About Us', page: 'about' },
    { name: 'Services', page: 'services' },
    { name: 'Why Us', page: 'why-us' },
    { name: 'Portfolio', page: 'portfolio' },
    { name: 'Insights', page: 'blog' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-purple-500/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-2xl cursor-pointer" onClick={() => setPage('home')}>
              <span className="text-purple-400">AI</span>.gency
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <button key={link.name} onClick={() => setPage(link.page)} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {link.name}
                </button>
              ))}
              {isAdmin ? (
                <>
                  <button onClick={() => setPage('admin')} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                </>
              ) : (
                 <button onClick={() => setPage('book-a-slot')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-transform transform hover:scale-105">
                    Book a Free Consultation
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-900/95">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => { setPage(link.page); setIsOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                {link.name}
              </button>
            ))}
            {isAdmin ? (
                <>
                  <button onClick={() => { setPage('admin'); setIsOpen(false); }} className="bg-green-500 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">Dashboard</button>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="bg-red-500 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                </>
              ) : (
                <button onClick={() => { setPage('book-a-slot'); setIsOpen(false); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                    Book a Free Consultation
                </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 70;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(167, 139, 250, ${Math.random() * 0.5 + 0.2})`;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.sqrt(
                        Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2)
                    );
                    if (distance < 100) {
                        opacityValue = 1 - (distance / 100);
                        ctx.strokeStyle = `rgba(196, 181, 253, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0"></canvas>;
};

const HomePage = ({ setPage, portfolioItems, blogPosts }) => {
    const trustedByLogos = [
        "https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg",
        "https://tailwindui.com/img/logos/158x48/reform-logo-white.svg",
        "https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg",
        "https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg",
        "https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg",
    ];

    const services = [
        { icon: <SeoIcon className="w-8 h-8 text-purple-400"/>, title: "SEO", description: "Dominate search rankings." },
        { icon: <PpcIcon className="w-8 h-8 text-purple-400"/>, title: "PPC", description: "Maximize your ROI." },
        { icon: <BrandingIcon className="w-8 h-8 text-purple-400"/>, title: "Branding", description: "Craft a memorable brand." },
        { icon: <SocialIcon className="w-8 h-8 text-purple-400"/>, title: "Social", description: "Build and engage community." },
    ];
    
    const testimonials = [
        { quote: "Working with AI.gency was a game-changer. Their data-driven approach increased our leads by 300% in one quarter.", author: "CEO, Tech Innovators" },
        { quote: "The level of strategic insight and efficiency is unparalleled. We finally have a marketing partner that understands our business.", author: "Marketing Director, FinCorp" },
        { quote: "I was skeptical about AI, but the results speak for themselves. Our ROI has never been higher.", author: "Founder, E-commerce Brand" },
    ];

    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                <ParticleCanvas />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900"></div>
                <div className="relative z-10 text-center px-4 flex-grow flex flex-col items-center justify-center">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down">
                        <span className="block">AI-Powered Results.</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Human-Driven Strategy.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-gray-300 animate-fade-in-up">
                        We merge cutting-edge artificial intelligence with expert human insight to scale your brand. Efficiency, creativity, and growth, delivered globally.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <button onClick={() => setPage('book-a-slot')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30">
                            Get a Free Growth Plan
                        </button>
                        <button onClick={() => setPage('services')} className="bg-gray-700/50 backdrop-blur-sm border border-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg">
                            Explore Our Services
                        </button>
                    </div>
                </div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <p className="text-center text-gray-400 text-sm font-semibold">TRUSTED BY THE WORLD'S MOST INNOVATIVE COMPANIES</p>
                    <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-5">
                        {trustedByLogos.map((logo, index) => (
                            <div key={index} className="col-span-1 flex justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <img className="h-10" src={logo} alt={`Client Logo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Snapshot */}
            <div className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">What We Do</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">A Growth Engine for Your Business</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map(service => (
                            <div key={service.title} className="bg-gray-800 p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500/10 text-white mx-auto mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-medium text-white">{service.title}</h3>
                                <p className="mt-2 text-base text-gray-400">{service.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <button onClick={() => setPage('services')} className="text-purple-400 font-semibold hover:text-purple-300">
                            See All Services &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Case Studies */}
            <div className="py-20 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Proven Results</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Success Stories</p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {portfolioItems.slice(0, 3).map(item => (
                            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg group">
                                <img src={item.imageUrl || `https://placehold.co/600x400/111827/a78bfa?text=${item.title}`} alt={item.title} className="w-full h-60 object-cover" />
                                <div className="p-6">
                                    <p className="text-sm text-purple-400 font-semibold">{item.category}</p>
                                    <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                                    <button onClick={() => setPage('portfolio')} className="text-sm font-semibold text-white group-hover:text-purple-400">View Case Study &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ROI Calculator Section */}
            <div className="py-20">
                <RoiCalculatorPage />
            </div>

            {/* Testimonials */}
            <div className="py-20 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                         <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">What Our Partners Say</h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <blockquote key={index} className="bg-gray-900 p-8 rounded-lg shadow-lg">
                                <p className="text-lg text-gray-300">"{testimonial.quote}"</p>
                                <footer className="mt-6">
                                    <p className="font-semibold text-white">{testimonial.author}</p>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest Insights */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Insights</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">From Our Workbench</p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogPosts.map(post => (
                            <div key={post.id} onClick={() => setPage('blog')} className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
                                <img src={post.featuredImageUrl || `https://placehold.co/600x400/111827/a78bfa?text=Insight`} alt={post.title} className="w-full h-60 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mt-2 mb-2">{post.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                                    <span className="text-sm font-semibold text-purple-400 group-hover:text-pink-500">Read More &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
             {/* Final CTA */}
            <div className="bg-gray-800">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to unlock your growth potential?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-gray-300">Let's build your success story together. Get a free, no-obligation growth plan from our experts.</p>
                    <button onClick={() => setPage('book-a-slot')} className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 sm:w-auto">
                        Book a Free Consultation
                    </button>
                </div>
            </div>

        </div>
    );
};

const AboutUsPage = ({ setPage }) => {
    const teamMembers = [
        { name: 'Jane Doe', title: 'CEO & Chief Strategist', imageUrl: 'https://placehold.co/400x400/a78bfa/ffffff?text=JD' },
        { name: 'John Smith', title: 'Head of AI Operations', imageUrl: 'https://placehold.co/400x400/a78bfa/ffffff?text=JS' },
        { name: 'Emily White', title: 'Creative Director', imageUrl: 'https://placehold.co/400x400/a78bfa/ffffff?text=EW' },
    ];
    
    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Our Story</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">We're Redefining the Agency Model</p>
                    <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
                        Founded on the belief that technology should amplify human potential, not replace it. We are a new breed of agency for a new era of business.
                    </p>
                </div>

                <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center mb-4">
                                <MissionIllustration className="w-10 h-10 mr-4 text-purple-400" />
                                Our Mission
                            </h3>
                            <p className="text-lg text-gray-300">
                                To empower businesses of all sizes with the intelligent, data-driven marketing strategies once reserved for the enterprise elite. We democratize growth by making cutting-edge AI effective, accessible, and affordable.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center mb-4">
                                <VisionIllustration className="w-10 h-10 mr-4 text-purple-400" />
                                Our Vision
                            </h3>
                            <p className="text-lg text-gray-300">
                                We envision a future where every business decision is informed by data and elevated by human creativity. Our goal is to be the catalyst for that future, building a world where technology and humanity collaborate to create unprecedented value.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700">
                         <h3 className="text-2xl font-bold text-white flex items-center mb-6">
                            <TeamIllustration className="w-10 h-10 mr-4 text-purple-400" />
                            The Human Element
                        </h3>
                        <p className="text-lg text-gray-300 mb-6">
                            Our AI is powerful, but our people are our soul. We are a team of passionate strategists, creatives, and technologists united by a single purpose: your success. We are the human minds that guide the artificial intelligence, ensuring every strategy is not only smart but also wise.
                        </p>
                    </div>
                </div>

                <div className="mt-24">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold tracking-tight">Meet the Human Strategists</h3>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">The minds behind the machine.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                                <img className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500/50" src={member.imageUrl} alt={member.name} />
                                <h4 className="text-xl font-bold text-white">{member.name}</h4>
                                <p className="text-purple-400">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesPage = ({ setPage }) => {
    const services = [
        { icon: <SeoIcon className="w-12 h-12 text-purple-400"/>, title: "Search Engine Optimization", description: "Dominate search rankings with AI-driven keyword research, technical optimization, and content strategy." },
        { icon: <PpcIcon className="w-12 h-12 text-purple-400"/>, title: "Performance Marketing (PPC)", description: "Maximize your ROI with intelligent ad campaign management across Google, Facebook, and more." },
        { icon: <BrandingIcon className="w-12 h-12 text-purple-400"/>, title: "Branding & Identity", description: "Craft a memorable brand that resonates with your audience, from logo design to complete brand guidelines." },
        { icon: <SocialIcon className="w-12 h-12 text-purple-400"/>, title: "Social Media Marketing", description: "Build and engage your community with data-informed content and targeted social campaigns." },
        { icon: <WebDevIcon className="w-12 h-12 text-purple-400"/>, title: "Web Design & Development", description: "Create high-performance, conversion-focused websites that serve as your digital flagship." },
        { icon: <VideoIcon className="w-12 h-12 text-purple-400"/>, title: "Video & Content Production", description: "Capture attention with compelling video ads, explainers, and a content strategy that builds authority." },
    ];

    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Our Capabilities</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">A Full-Spectrum Growth Engine</p>
                    <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
                        We offer a comprehensive suite of services designed to address every stage of your growth journey, each powered by our unique AI-Human synergy.
                    </p>
                </div>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-gray-800 p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-700 mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-gray-300">{service.description}</p>
                        </div>
                    ))}
                </div>
                 <div className="mt-20 text-center">
                    <p className="text-xl text-gray-300 mb-4">Ready to find the right solution for you?</p>
                    <button onClick={() => setPage('book-a-slot')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30">
                        Get Your Custom Growth Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

const WhyUsPage = ({ stats, setPage }) => {
  const processSteps = [
    { title: "1. AI-Powered Discovery", description: "Our process begins with AI. We deploy intelligent agents to analyze market trends, competitor landscapes, and audience behavior. This data-first approach uncovers hidden opportunities and ensures our strategy is built on a foundation of facts, not assumptions." },
    { title: "2. Human-Led Strategy", description: "Data is nothing without insight. Our human experts—strategists, marketers, and creatives—take the AI's findings and craft a bespoke growth plan. This is where we define your brand's voice, map the customer journey, and set clear, ambitious goals." },
    { title: "3. Hybrid Execution", description: "We combine the best of both worlds in execution. AI handles the heavy lifting—optimizing ad bids, personalizing outreach at scale—while our team focuses on creating compelling content, building genuine relationships, and ensuring every deliverable is flawless." },
    { title: "4. Measurable Growth", description: "Our partnership is judged by one metric: your success. We provide transparent, real-time dashboards showing exactly how our efforts translate into tangible results—more leads, higher conversions, and a stronger bottom line. We don't just promise growth; we prove it." }
  ];
  
  const corePhilosophies = [
    { icon: <PartnershipIcon className="h-10 w-10 text-purple-400 mb-4"/>, title: "Strategic Partnership", description: "We're not just a vendor; we're an extension of your team. We invest deeply in understanding your business to function as a true strategic partner." },
    { icon: <TransparencyIcon className="h-10 w-10 text-purple-400 mb-4"/>, title: "Radical Transparency", description: "You'll never be in the dark. We provide clear, honest communication and full access to performance data. Trust is built on transparency." },
    { icon: <InnovationIcon className="h-10 w-10 text-purple-400 mb-4"/>, title: "Continuous Innovation", description: "The digital world never stands still, and neither do we. We are relentlessly curious, constantly testing new technologies and strategies to keep you ahead." }
  ];

  const whyUsPoints = [
    { icon: <BrainCircuitIcon className="h-10 w-10 text-purple-400 mb-4" />, stat: stats?.automationEfficiency || '90%', statLabel: "Automation Efficiency" },
    { icon: <RocketIcon className="h-10 w-10 text-purple-400 mb-4" />, stat: stats?.deliverySpeed || '48-Hour', statLabel: "Average Turnaround" },
    { icon: <GlobeIcon className="h-10 w-10 text-purple-400 mb-4" />, stat: stats?.countriesReached || '25+', statLabel: "Countries Reached" },
    { icon: <BarChartIcon className="h-10 w-10 text-purple-400 mb-4" />, stat: stats?.roiIncrease || '300%', statLabel: "Average Client ROI" }
  ];

  return (
    <div className="bg-gray-900 text-white">
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Our Advantage</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">The AI-Human Synergy</p>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
            We've engineered a new kind of agency, one that fuses the analytical power of artificial intelligence with the creative and strategic intuition of human experts.
          </p>
        </div>
      </div>

      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold tracking-tight">Our Proven Process for Growth</h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">From data-driven insights to tangible business outcomes, here’s how we make it happen.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700/50 hidden md:block"></div>
            {processSteps.map((step, index) => (
              <div key={index} className={`mb-12 flex items-center w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:flex w-5/12"></div>
                <div className="hidden md:flex justify-center w-1/12">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-gray-900 z-10"></div>
                </div>
                <div className="w-full md:w-5/12 bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-500/10 transition-shadow border border-gray-700">
                   <h4 className="text-xl font-bold text-purple-400 mb-2">{step.title}</h4>
                   <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold tracking-tight">More Than an Agency, We're Your Partner</h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Our success is built on a foundation of core beliefs that guide every client relationship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {corePhilosophies.map((philosophy, index) => (
              <div key={index} className="bg-gray-800/50 p-8 rounded-2xl transform hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-purple-500/50">
                {philosophy.icon}
                <h4 className="text-2xl font-bold mb-3">{philosophy.title}</h4>
                <p className="text-gray-400">{philosophy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold tracking-tight">The Proof Is in the Numbers</h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Our model isn't just theory. It delivers quantifiable results.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {whyUsPoints.map((point, index) => (
              <div key={index} className="flex flex-col items-center">
                {point.icon}
                <span className="text-4xl font-extrabold text-white">{point.stat}</span>
                <span className="text-md text-gray-400 mt-1">{point.statLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 py-20 text-center px-4">
        <h3 className="text-3xl font-bold tracking-tight text-white">Ready to See What We Can Build Together?</h3>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Let's turn our process into your success story. Explore our work and see the results for yourself.</p>
        <div className="mt-8">
          <button onClick={() => setPage('portfolio')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30">
            View Our Case Studies
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-700" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10">
                    <CloseIcon className="w-8 h-8"/>
                </button>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                            <p className="text-purple-400 font-semibold mb-4">{project.clientName} &bull; {project.projectDate}</p>
                            <img 
                                src={project.imageUrl || `https://placehold.co/800x500/1f2937/a78bfa?text=Project+Image`} 
                                alt={project.title} 
                                className="w-full h-auto object-cover rounded-lg mb-6 shadow-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/800x500/1f2937/a78bfa?text=Image+Error`; }}
                            />
                             {project.testimonial && (
                                <div className="bg-gray-700/50 p-6 rounded-lg mb-6 border-l-4 border-purple-500">
                                    <p className="italic text-gray-300">"{project.testimonial}"</p>
                                </div>
                            )}
                            <div className="space-y-6 text-gray-300">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">The Challenge</h3>
                                    <p>{project.challenge}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Our Solution</h3>
                                    <p>{project.solution}</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider mb-3">Services</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.services?.map(service => (
                                        <span key={service} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{service}</span>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider mb-3">Results</h3>
                                <div className="space-y-3">
                                    {project.results?.map(result => (
                                        <div key={result.label} className="bg-gray-700/50 p-3 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-white">{result.value}</p>
                                            <p className="text-sm text-gray-400">{result.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition">
                                    View Live Project <ExternalLinkIcon className="ml-2 w-5 h-5"/>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const PortfolioPage = ({ portfolioItems }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const categories = ['All', ...new Set(portfolioItems.map(item => item.category).filter(Boolean))];

  const filteredItems = portfolioItems
    .filter(item => item.isVisible)
    .filter(item => filter === 'All' || item.category === filter);

  return (
    <>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Our Work</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Case Studies & Creations</p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              Explore how we've helped our clients overcome challenges and achieve remarkable results.
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group flex flex-col border border-gray-700/50 hover:border-purple-500/50">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.imageUrl || `https://placehold.co/600x400/111827/a78bfa?text=${item.title}`} 
                    alt={item.title} 
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/111827/a78bfa?text=Image+Error`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-purple-400 font-semibold">{item.category}</p>
                  <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm flex-grow mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-auto mb-4">
                      {item.services?.slice(0, 3).map(service => (
                          <span key={service} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{service}</span>
                      ))}
                  </div>
                  <button onClick={() => setSelectedProject(item)} className="mt-auto w-full bg-gray-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform group-hover:bg-purple-600">
                    View Case Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const BlogPage = ({ posts, setSelectedPost }) => {
    const visiblePosts = posts.filter(post => post.isVisible);
    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Insights & Ideas</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">From Our Digital Workbench</p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
                        Thoughts on AI, marketing, and the future of growth from our team of human strategists.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {visiblePosts.map(post => (
                        <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group flex flex-col border border-gray-700/50 hover:border-purple-500/50">
                            <div className="relative overflow-hidden">
                                <img 
                                    src={post.featuredImageUrl || `https://placehold.co/600x400/111827/a78bfa?text=Insight`} 
                                    alt={post.title} 
                                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/111827/a78bfa?text=Image+Error`; }}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mt-2 mb-2 text-white">{post.title}</h3>
                                <p className="text-gray-400 text-sm flex-grow mb-4">{post.excerpt}</p>
                                <div className="mt-auto text-sm text-purple-400 font-semibold group-hover:text-pink-500 transition-colors">
                                    Read More &rarr;
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostPage = ({ post, setSelectedPost }) => {
    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => setSelectedPost(null)} className="mb-8 text-purple-400 hover:text-purple-300">&larr; Back to Insights</button>
                <h1 className="text-4xl font-extrabold text-white mb-4">{post.title}</h1>
                <p className="text-gray-400 mb-8">By {post.author} on {new Date(post.publishedDate?.seconds * 1000).toLocaleDateString()}</p>
                <img 
                    src={post.featuredImageUrl || `https://placehold.co/1200x600/111827/a78bfa?text=Insight`} 
                    alt={post.title} 
                    className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg"
                />
                <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') }}>
                </div>
            </div>
        </div>
    );
};

const RoiCalculatorPage = () => {
    const [adSpend, setAdSpend] = useState(1000);
    const [cpc, setCpc] = useState(2.50);
    const [conversionRate, setConversionRate] = useState(2);
    const [saleValue, setSaleValue] = useState(150);
    const [results, setResults] = useState(null);

    const calculateRoi = (e) => {
        e.preventDefault();
        const clicks = adSpend / cpc;
        const conversions = clicks * (conversionRate / 100);
        const revenue = conversions * saleValue;
        const profit = revenue - adSpend;
        const roas = revenue / adSpend;

        // AI Optimization Assumptions
        const aiCpc = cpc * 0.75; // 25% reduction
        const aiConversionRate = conversionRate * 1.3; // 30% increase
        const aiClicks = adSpend / aiCpc;
        const aiConversions = aiClicks * (aiConversionRate / 100);
        const aiRevenue = aiConversions * saleValue;
        const aiProfit = aiRevenue - adSpend;
        const aiRoas = aiRevenue / adSpend;

        setResults({
            current: { revenue, profit, roas },
            ai: { revenue: aiRevenue, profit: aiProfit, roas: aiRoas }
        });
    };

    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">ROI Calculator</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Unlock Your Potential Growth</p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
                        Use our simple calculator to estimate the potential impact our AI-driven approach could have on your bottom line.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={calculateRoi} className="space-y-6 bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Monthly Ad Spend ($)</label>
                            <input type="number" value={adSpend} onChange={e => setAdSpend(parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-700 rounded-md py-3 px-4 text-white focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Average Cost Per Click (CPC) ($)</label>
                            <input type="number" step="0.01" value={cpc} onChange={e => setCpc(parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-700 rounded-md py-3 px-4 text-white focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Conversion Rate (%)</label>
                            <input type="number" step="0.1" value={conversionRate} onChange={e => setConversionRate(parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-700 rounded-md py-3 px-4 text-white focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Average Sale Value ($)</label>
                            <input type="number" value={saleValue} onChange={e => setSaleValue(parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-700 rounded-md py-3 px-4 text-white focus:ring-purple-500" />
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                Calculate ROI
                            </button>
                        </div>
                    </form>
                    <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50 flex flex-col justify-center">
                        {results ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-400">Current Estimated Results</h3>
                                    <p className="text-3xl font-bold text-white">${results.current.revenue.toFixed(2)} <span className="text-lg font-normal">Revenue</span></p>
                                    <p className="text-xl font-semibold text-green-400">${results.current.profit.toFixed(2)} <span className="text-lg font-normal">Profit</span></p>
                                </div>
                                <div className="border-t border-gray-700 my-4"></div>
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-400">AI-Optimized Potential</h3>
                                    <p className="text-3xl font-bold text-white">${results.ai.revenue.toFixed(2)} <span className="text-lg font-normal">Revenue</span></p>
                                    <p className="text-xl font-semibold text-green-400">${results.ai.profit.toFixed(2)} <span className="text-lg font-normal">Profit</span></p>
                                    <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                        +${(results.ai.profit - results.current.profit).toFixed(2)} Additional Profit
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <BarChartIcon className="w-16 h-16 mx-auto text-gray-600 mb-4"/>
                                <h3 className="text-xl font-bold">Your results will appear here.</h3>
                                <p className="text-gray-400">Fill out the form to see your potential.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactPage = ({ setPage }) => (
    <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Get In Touch</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">We're Here to Help</p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
                Have a general question or just want to say hello? Drop us a line. For project inquiries, please use our consultation booking form.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50 text-left">
                    <h3 className="text-2xl font-bold mb-4">Send us a Message</h3>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="contact-name" id="contact-name" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" name="contact-email" id="contact-email" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300">Your Message</label>
                            <textarea id="contact-message" name="contact-message" rows="4" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-600 hover:bg-gray-500">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-6">Ready to Start a Project?</h3>
                    <p className="text-lg text-gray-300 mb-6">
                        Let's dive into the details. Our free consultation is the first step towards a powerful partnership and measurable growth.
                    </p>
                    <button onClick={() => setPage('book-a-slot')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                        Book a Free Consultation
                    </button>
                    <div className="mt-10 text-left space-y-4">
                        <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> hello@aigency.com</p>
                        <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> +880 123 456 7890</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const BookSlotPage = () => {
    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Let's Build Together</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Book Your Free Consultation</p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
                        This is the first step. Tell us about your project, your goals, and your challenges. We're here to listen and map out a path to success. No obligations, just possibilities.
                    </p>
                </div>
                <form className="space-y-6 bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="book-name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="book-name" id="book-name" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="book-company" className="block text-sm font-medium text-gray-300">Company Name</label>
                            <input type="text" name="book-company" id="book-company" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="book-email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" name="book-email" id="book-email" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label htmlFor="service-type" className="block text-sm font-medium text-gray-300">What service are you interested in?</label>
                        <select id="service-type" name="service-type" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Select a service...</option>
                            <option>Branding & Identity</option>
                            <option>Social Media Marketing</option>
                            <option>Search Engine Optimization (SEO)</option>
                            <option>Performance Marketing (PPC)</option>
                            <option>Web Design & Development</option>
                            <option>Video Production</option>
                            <option>Full Growth Package</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="book-details" className="block text-sm font-medium text-gray-300">Tell us about your project</label>
                        <textarea id="book-details" name="book-details" rows="5" placeholder="What are your goals? What challenges are you facing?" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminLoginPage = ({ setPage, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_EMAIL = "admin@test.com";
  const ADMIN_PASSWORD = "password123";

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPage('admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={ADMIN_EMAIL} />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={ADMIN_PASSWORD} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ isVisible, onToggle }) => (
    <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isVisible ? 'bg-purple-600' : 'bg-gray-600'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
);

const AdminDashboard = ({ portfolioItems, setPortfolioItems, stats, blogPosts, setBlogPosts }) => {
    const [activeTab, setActiveTab] = useState('portfolio');
    
    const samplePortfolioData = { title: "Scaling E-commerce Sales for Apex Apparel", clientName: "Apex Apparel Ltd.", projectDate: "Q1 2025", category: "E-commerce", imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop", description: "A comprehensive performance marketing and SEO strategy to boost online sales for a leading Bangladeshi clothing brand.", challenge: "Apex Apparel faced stagnant online sales and low brand visibility outside of their physical stores. Their cost-per-acquisition on social media was unsustainably high.", solution: "We implemented an AI-driven PPC campaign targeting high-intent keywords and lookalike audiences. Simultaneously, a full-site SEO audit and content strategy were executed to capture organic traffic for relevant fashion terms.", services: "Performance Marketing, SEO, Conversion Rate Optimization", results: "+250%:Online Sales, -40%:Cost Per Acquisition, +180%:Organic Traffic", testimonial: "The results were phenomenal. AI.gency didn't just run ads; they built a predictable revenue engine for our online store. They are true partners in growth.", liveUrl: "https://example.com/apex-apparel" };
    const sampleBlogData = { title: "The Future is Hybrid: Why Human Strategy is Irreplaceable", author: "Jane Doe", excerpt: "Many fear AI will replace marketers. We believe it will augment them. Discover why the combination of machine intelligence and human creativity is the true key to unlocking unprecedented growth.", content: "The narrative around AI in marketing is often one of replacement. But this view is fundamentally flawed. While AI models can analyze data and execute tasks at a scale and speed humans can only dream of, they lack genuine creativity, strategic intuition, and the ability to build human relationships. \n\nAt our core, we believe the future is not AI *or* human, but AI *and* human. Our process is built on this synergy. AI handles the 'what'—analyzing vast datasets to identify opportunities. The human strategist handles the 'why' and 'how'—interpreting that data, crafting a compelling brand story, and making the final strategic decisions. This hybrid model allows us to operate with the efficiency of a machine and the wisdom of a seasoned expert.", featuredImageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=2070&auto=format&fit=crop" };
    
    const initialPortfolioFormState = { id: null, title: '', description: '', category: '', imageUrl: '', clientName: '', projectDate: '', services: '', challenge: '', solution: '', results: '', testimonial: '', liveUrl: '', isVisible: true, order: 0 };
    const [portfolioForm, setPortfolioForm] = useState(initialPortfolioFormState);
    
    const [statsForm, setStatsForm] = useState(stats || { automationEfficiency: '', deliverySpeed: '', countriesReached: '', roiIncrease: '' });
    useEffect(() => { setStatsForm(stats || { automationEfficiency: '', deliverySpeed: '', countriesReached: '', roiIncrease: '' }); }, [stats]);

    const initialBlogFormState = { id: null, title: '', author: '', excerpt: '', content: '', featuredImageUrl: '', isVisible: true, order: 0 };
    const [blogForm, setBlogForm] = useState(initialBlogFormState);

    const handlePortfolioChange = (e) => setPortfolioForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleStatsChange = (e) => setStatsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBlogChange = (e) => setBlogForm(prev => ({...prev, [e.target.name]: e.target.value}));

    const handlePortfolioSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioForm.title || !portfolioForm.category) return alert('Title and Category are required.');
        const servicesArray = portfolioForm.services.split(',').map(s => s.trim()).filter(Boolean);
        const resultsArray = portfolioForm.results.split(',').map(r => {
            const parts = r.split(':');
            return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || '' };
        }).filter(r => r.value && r.label);
        const dataToSave = { ...portfolioForm, services: servicesArray, results: resultsArray };
        delete dataToSave.id;
        try {
            if (portfolioForm.id) await updateDoc(doc(db, 'portfolio', portfolioForm.id), dataToSave);
            else await addDoc(collection(db, 'portfolio'), { ...dataToSave, order: portfolioItems.length });
            setPortfolioForm(initialPortfolioFormState);
        } catch (error) { console.error("Error saving portfolio:", error); alert('Failed to save portfolio.'); }
    };
    
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        if (!blogForm.title || !blogForm.author) return alert('Title and Author are required.');
        const dataToSave = { ...blogForm, publishedDate: new Date() };
        delete dataToSave.id;
        try {
            if (blogForm.id) await updateDoc(doc(db, 'blog', blogForm.id), dataToSave);
            else await addDoc(collection(db, 'blog'), { ...dataToSave, order: blogPosts.length });
            setBlogForm(initialBlogFormState);
        } catch (error) { console.error("Error saving blog post:", error); alert('Failed to save blog post.');}
    };

    const handleStatsSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'stats', 'whyUsStats'), statsForm);
            alert('Stats updated!');
        } catch (error) { console.error("Error updating stats:", error); alert('Failed to update stats.'); }
    };

    const handleDelete = async (collectionName, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try { await deleteDoc(doc(db, collectionName, id)); } 
            catch (error) { console.error("Error deleting:", error); alert('Failed to delete.'); }
        }
    };

    const handleEditClick = (item, type) => {
        if (type === 'portfolio') {
            const servicesString = Array.isArray(item.services) ? item.services.join(', ') : '';
            const resultsString = Array.isArray(item.results) ? item.results.map(r => `${r.value}:${r.label}`).join(', ') : '';
            setPortfolioForm({ ...item, services: servicesString, results: resultsString });
        } else if (type === 'blog') {
            setBlogForm(item);
        }
    };
    
    const loadSampleData = (type) => {
        if (type === 'portfolio') {
            setPortfolioForm({ ...initialPortfolioFormState, ...samplePortfolioData });
        } else if (type === 'blog') {
            setBlogForm({ ...initialBlogFormState, ...sampleBlogData });
        }
    };

    const handleToggleVisibility = async (collectionName, item) => {
        const docRef = doc(db, collectionName, item.id);
        await updateDoc(docRef, { isVisible: !item.isVisible });
    };

    const handleMove = async (collectionName, items, setItems, index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const itemToMove = newItems[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const itemToSwap = newItems[swapIndex];
        
        // Swap positions in local state for immediate UI update
        newItems[index] = itemToSwap;
        newItems[swapIndex] = itemToMove;
        setItems(newItems);

        // Update order in Firestore
        const batch = writeBatch(db);
        const item1Ref = doc(db, collectionName, itemToMove.id);
        batch.update(item1Ref, { order: swapIndex });
        const item2Ref = doc(db, collectionName, itemToSwap.id);
        batch.update(item2Ref, { order: index });
        
        try {
            await batch.commit();
        } catch (error) {
            console.error("Error reordering items:", error);
            alert("Failed to reorder items. Please refresh.");
            // Revert state if firestore update fails
            setItems(items);
        }
    };

    const tabs = ['portfolio', 'blog', 'stats'];

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-20">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <div className="border-b border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'portfolio' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-purple-400">{portfolioForm.id ? 'Edit Case Study' : 'Add New Case Study'}</h2>
                            <button onClick={() => loadSampleData('portfolio')} className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-semibold">Load Sample Data</button>
                        </div>
                        <form onSubmit={handlePortfolioSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input name="title" value={portfolioForm.title} onChange={handlePortfolioChange} placeholder="Project Title" className="w-full p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"/>
                            <input name="clientName" value={portfolioForm.clientName} onChange={handlePortfolioChange} placeholder="Client Name" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="projectDate" value={portfolioForm.projectDate} onChange={handlePortfolioChange} placeholder="Project Date (e.g., Q2 2025)" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="category" value={portfolioForm.category} onChange={handlePortfolioChange} placeholder="Category (e.g., Branding)" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="imageUrl" value={portfolioForm.imageUrl} onChange={handlePortfolioChange} placeholder="Image URL" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <textarea name="description" value={portfolioForm.description} onChange={handlePortfolioChange} placeholder="Short Description for card" className="w-full p-3 text-white bg-gray-700 rounded-md md:col-span-2" rows="2"/>
                            <textarea name="challenge" value={portfolioForm.challenge} onChange={handlePortfolioChange} placeholder="The Challenge" className="w-full p-3 text-white bg-gray-700 rounded-md md:col-span-2" rows="3"/>
                            <textarea name="solution" value={portfolioForm.solution} onChange={handlePortfolioChange} placeholder="Our Solution" className="w-full p-3 text-white bg-gray-700 rounded-md md:col-span-2" rows="3"/>
                            <input name="services" value={portfolioForm.services} onChange={handlePortfolioChange} placeholder="Services (comma-separated)" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="results" value={portfolioForm.results} onChange={handlePortfolioChange} placeholder="Results (e.g., +150%:Traffic, +30%:Conversion)" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <textarea name="testimonial" value={portfolioForm.testimonial} onChange={handlePortfolioChange} placeholder="Client Testimonial" className="w-full p-3 text-white bg-gray-700 rounded-md md:col-span-2" rows="2"/>
                            <input name="liveUrl" value={portfolioForm.liveUrl} onChange={handlePortfolioChange} placeholder="Live Project URL" className="w-full p-3 text-white bg-gray-700 rounded-md md:col-span-2"/>
                            <div className="md:col-span-2 flex gap-4">
                                <button type="submit" className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium">{portfolioForm.id ? 'Update Item' : 'Add Item'}</button>
                                {portfolioForm.id && <button type="button" onClick={() => setPortfolioForm(initialPortfolioFormState)} className="py-2 px-6 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-medium">Cancel Edit</button>}
                            </div>
                        </form>
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold mb-4 text-purple-400">Current Portfolio Items</h3>
                            <div className="space-y-4">
                                {portfolioItems.map((item, index) => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <button onClick={() => handleMove('portfolio', portfolioItems, index, 'up')} disabled={index === 0} className="disabled:opacity-25 text-xs">▲</button>
                                                <button onClick={() => handleMove('portfolio', portfolioItems, index, 'down')} disabled={index === portfolioItems.length - 1} className="disabled:opacity-25 text-xs">▼</button>
                                            </div>
                                            <span className={`w-3 h-3 rounded-full ${item.isVisible ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <p className="font-bold">{item.title}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <ToggleSwitch isVisible={item.isVisible} onToggle={() => handleToggleVisibility('portfolio', item)} />
                                            <button onClick={() => handleEditClick(item, 'portfolio')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                                            <button onClick={() => handleDelete('portfolio', item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'blog' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-purple-400">{blogForm.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                             <button onClick={() => loadSampleData('blog')} className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-semibold">Load Sample Data</button>
                        </div>
                        <form onSubmit={handleBlogSubmit} className="space-y-4">
                            <input name="title" value={blogForm.title} onChange={handleBlogChange} placeholder="Post Title" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="author" value={blogForm.author} onChange={handleBlogChange} placeholder="Author Name" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="featuredImageUrl" value={blogForm.featuredImageUrl} onChange={handleBlogChange} placeholder="Featured Image URL" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogChange} placeholder="Excerpt for card view" className="w-full p-3 text-white bg-gray-700 rounded-md" rows="3"/>
                            <textarea name="content" value={blogForm.content} onChange={handleBlogChange} placeholder="Full post content (Markdown supported)" className="w-full p-3 text-white bg-gray-700 rounded-md" rows="10"/>
                            <div className="flex gap-4">
                                <button type="submit" className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium">{blogForm.id ? 'Update Post' : 'Create Post'}</button>
                                {blogForm.id && <button type="button" onClick={() => setBlogForm(initialBlogFormState)} className="py-2 px-6 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-medium">Cancel Edit</button>}
                            </div>
                        </form>
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold mb-4 text-purple-400">Current Blog Posts</h3>
                            <div className="space-y-4">
                                {blogPosts.map((post, index) => (
                                    <div key={post.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between flex-wrap gap-4">
                                       <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <button onClick={() => handleMove('blog', blogPosts, index, 'up')} disabled={index === 0} className="disabled:opacity-25 text-xs">▲</button>
                                                <button onClick={() => handleMove('blog', blogPosts, index, 'down')} disabled={index === blogPosts.length - 1} className="disabled:opacity-25 text-xs">▼</button>
                                            </div>
                                            <span className={`w-3 h-3 rounded-full ${post.isVisible ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <p className="font-bold">{post.title}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <ToggleSwitch isVisible={post.isVisible} onToggle={() => handleToggleVisibility('blog', post)} />
                                            <button onClick={() => handleEditClick(post, 'blog')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                                            <button onClick={() => handleDelete('blog', post.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                     <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-400">Manage "Why Us" Stats</h2>
                        <form onSubmit={handleStatsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.keys(statsForm).map(key => (
                                <div key={key}>
                                    <label className="text-sm font-bold text-gray-300 block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input name={key} value={statsForm[key]} onChange={handleStatsChange} className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                                </div>
                            ))}
                            <div className="md:col-span-2">
                               <button type="submit" className="w-full md:w-auto py-2 px-6 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium">Save Stats</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer = ({ setPage }) => (
    <footer className="bg-gray-800 border-t border-gray-700 text-gray-400">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Solutions</h3>
                    <ul className="mt-4 space-y-4">
                        <li><button onClick={() => setPage('services')} className="text-base text-gray-400 hover:text-white">Our Services</button></li>
                        <li><button onClick={() => setPage('portfolio')} className="text-base text-gray-400 hover:text-white">Case Studies</button></li>
                        <li><button onClick={() => setPage('roi-calculator')} className="text-base text-gray-400 hover:text-white">ROI Calculator</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-4">
                         <li><button onClick={() => setPage('about')} className="text-base text-gray-400 hover:text-white">About Us</button></li>
                         <li><button onClick={() => setPage('blog')} className="text-base text-gray-400 hover:text-white">Insights</button></li>
                         <li><button onClick={() => setPage('contact')} className="text-base text-gray-400 hover:text-white">Contact Us</button></li>
                    </ul>
                </div>
                <div className="col-span-2 md:col-span-2">
                     <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Subscribe to our newsletter</h3>
                     <p className="mt-4 text-base text-gray-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
                     <form className="mt-4 sm:flex sm:max-w-md">
                         <label htmlFor="email-address" className="sr-only">Email address</label>
                         <input type="email" name="email-address" id="email-address" autoComplete="email" required className="appearance-none min-w-0 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Enter your email" />
                         <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                             <button type="submit" className="w-full bg-purple-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-purple-700">Subscribe</button>
                         </div>
                     </form>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                <p className="text-base text-gray-400">&copy; 2025 AI.gency. All rights reserved.</p>
                <div className="flex justify-center space-x-6 md:order-2">
                    <button onClick={() => setPage('login')} className="text-gray-400 hover:text-gray-300">
                        Admin Login
                    </button>
                </div>
            </div>
        </div>
    </footer>
);


// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionsToFetch = [
        { name: 'portfolio', setter: setPortfolioItems, options: [orderBy('order', 'asc')] },
        { name: 'blog', setter: setBlogPosts, options: [orderBy('order', 'asc')] },
    ];

    const unsubscribers = collectionsToFetch.map(c => {
        const q = query(collection(db, c.name), ...c.options);
        return onSnapshot(q, (snapshot) => {
            c.setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error(`Error fetching ${c.name}:`, error));
    });
    
    const unsubscribeStats = onSnapshot(doc(db, "stats", "whyUsStats"), (doc) => {
        if (doc.exists()) setStats(doc.data());
        else console.log("No stats document found!");
    }, (error) => console.error("Error fetching stats:", error));

    setLoading(false);

    return () => {
      unsubscribers.forEach(unsub => unsub());
      unsubscribeStats();
    };
  }, []); 

  const handleLogout = () => {
    setIsAdmin(false);
    setPage('home');
  };

  const renderPage = () => {
    if (loading) {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>;
    }
    
    if (page === 'blog' && selectedPost) {
        return <BlogPostPage post={selectedPost} setSelectedPost={setSelectedPost} />;
    }

    const visiblePortfolioItems = portfolioItems.filter(p => p.isVisible);
    const visibleBlogPosts = blogPosts.filter(p => p.isVisible);

    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} portfolioItems={visiblePortfolioItems} blogPosts={visibleBlogPosts} />;
      case 'about':
        return <AboutUsPage setPage={setPage} />;
      case 'services':
        return <ServicesPage setPage={setPage} />;
      case 'why-us':
        return <WhyUsPage stats={stats} setPage={setPage} />;
      case 'portfolio':
        return <PortfolioPage portfolioItems={visiblePortfolioItems} />;
      case 'blog':
        return <BlogPage posts={visibleBlogPosts} setSelectedPost={setSelectedPost} />;
      case 'roi-calculator':
        return <RoiCalculatorPage />;
      case 'contact':
        return <ContactPage setPage={setPage} />;
      case 'book-a-slot':
        return <BookSlotPage />;
      case 'login':
        return <AdminLoginPage setPage={setPage} setIsAdmin={setIsAdmin} />;
      case 'admin':
        return isAdmin ? <AdminDashboard portfolioItems={portfolioItems} setPortfolioItems={setPortfolioItems} stats={stats} blogPosts={blogPosts} setBlogPosts={setBlogPosts} /> : <AdminLoginPage setPage={setPage} setIsAdmin={setIsAdmin} />;
      default:
        return <HomePage setPage={setPage} portfolioItems={visiblePortfolioItems} blogPosts={visibleBlogPosts} />;
    }
  };

  return (
    <div className="bg-gray-900">
      <Navbar setPage={setPage} isAdmin={isAdmin} handleLogout={handleLogout} />
      <main>
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
