import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
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
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyA9-zRqB6xjbAIDwL8KzVJCBoIVBBPCOk0",
  authDomain: "aigency-portfolio.firebaseapp.com",
  projectId: "aigency-portfolio",
  storageBucket: "aigency-portfolio.firebasestorage.app",
  messagingSenderId: "889436522880",
  appId: "1:889436522880:web:aeb772ea945a18e6e19965"
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
const CheckIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ChatIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const LightbulbIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const SendIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;


// --- Components ---

const Navbar = ({ setPage, isAdmin, handleLogout, settings }) => {
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
    { name: 'AI & Consultancy', page: 'ai-consultancy' },
    { name: 'Pricing', page: 'pricing' },
    { name: 'Portfolio', page: 'portfolio' },
    { name: 'Insights', page: 'blog' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-purple-500/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-2xl cursor-pointer flex items-center gap-2" onClick={() => setPage('home')}>
              {settings?.logoUrl ? <img src={settings.logoUrl} alt="AI.gency Logo" className="h-8 w-auto"/> : <><span className="text-purple-400">AI</span>.gency</>}
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
                   <button onClick={() => setPage('book-a-slot')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-transform transform hover:scale-105 shadow-lg hover:shadow-purple-500/40">
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
        let mouse = { x: null, y: null, radius: 120 };

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2.5 + 1;
                this.density = (Math.random() * 30) + 1;
                this.color = `rgba(167, 139, 250, ${Math.random() * 0.5 + 0.2})`;
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
                    if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 10; }
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
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
                    let distance = Math.sqrt(Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2));
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
            particles.forEach(p => { p.update(); p.draw(); });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();
        
        window.addEventListener('resize', () => { resizeCanvas(); init(); });

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
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
                        <button onClick={() => setPage('book-a-slot')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
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
                            <div key={service.title} className="bg-gray-800 p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300 group hover:shadow-lg hover:shadow-purple-500/20">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500/10 text-white mx-auto mb-4 transition-transform group-hover:scale-110">
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

// v1.2 Feature: AboutUsPage is now dynamic
const AboutUsPage = ({ setPage, teamMembers }) => {
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
                                <img className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500/50 object-cover" src={member.imageUrl || 'https://placehold.co/400x400/a78bfa/ffffff?text=??'} alt={member.name} />
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

const PricingPage = ({ handleSetPage }) => {
    const tiers = [
        {
            name: 'Launchpad',
            price: '499',
            description: 'For new businesses establishing their digital presence.',
            features: [
                'Foundational SEO Setup',
                'Google Business Profile Optimization',
                'Social Media Page Setup (2 platforms)',
                'Monthly Content Calendar (12 posts)',
                'Basic Monthly Performance Report'
            ],
            cta: 'Choose Plan'
        },
        {
            name: 'Growth Engine',
            price: '1,299',
            description: 'For established businesses ready to scale aggressively.',
            features: [
                'Everything in Launchpad, plus:',
                'Comprehensive SEO & Content Strategy',
                'Performance Marketing (PPC) Campaigns',
                'AI-Powered Ad Creative Testing',
                'Advanced Analytics & Bi-weekly Strategy Calls'
            ],
            cta: 'Choose Plan',
            popular: true
        },
        {
            name: 'Market Leader',
            price: 'Custom',
            description: 'A full strategic partnership for market dominance.',
            features: [
                'Everything in Growth, plus:',
                'AI Transformation Consultancy',
                'Marketing Automation & CRM Integration',
                'Advanced Conversion Rate Optimization',
                'Dedicated Strategic Account Manager'
            ],
            cta: 'Contact Us'
        }
    ];

    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">Pricing Plans</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Transparent Pricing for Every Goal</p>
                    <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
                        Choose the plan that aligns with your business objectives. No hidden fees, just clear value and measurable results.
                    </p>
                    <div className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg">
                        <div className="bg-gray-800 px-4 py-2 rounded-md">
                            <p className="font-semibold text-white">🎉 Special Launch Offer: Get 50% OFF Your First Month!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`relative bg-gray-800 rounded-2xl p-8 shadow-lg border-2 ${tier.popular ? 'border-purple-500' : 'border-gray-700'}`}>
                            {tier.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 px-3 py-1 text-sm font-semibold text-white rounded-full">Most Popular</div>}
                            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                            <p className="mt-4 text-gray-400 h-12">{tier.description}</p>
                            <div className="mt-6">
                                <span className="text-4xl font-extrabold text-white">{tier.price === 'Custom' ? tier.price : `$${tier.price}`}</span>
                                {tier.price !== 'Custom' && <span className="text-base font-medium text-gray-400">/month</span>}
                            </div>
                            <ul className="mt-8 space-y-4">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CheckIcon className="h-6 w-6 text-green-400" />
                                        </div>
                                        <p className="ml-3 text-gray-300">{feature}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <button onClick={() => handleSetPage('book-a-slot', tier.name)} className={`w-full py-3 px-6 text-lg font-semibold rounded-lg transition-colors ${tier.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                                    {tier.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AIConsultancyPage = ({ setPage }) => {
    const services = [
        { icon: <BrainCircuitIcon className="w-10 h-10 text-purple-400 mb-4"/>, title: "Lead Generation as a Service (LGaaS)", description: "We build and manage a semi-autonomous, AI-powered lead generation system that delivers a consistent pipeline of qualified meetings directly to your sales team's calendar." },
        { icon: <SeoIcon className="w-10 h-10 text-purple-400 mb-4"/>, title: "AI-Enhanced Content Marketing", description: "A data-driven content strategy and execution service that uses AI to identify high-opportunity topics and ensure every piece of content is optimized to rank and perform." },
        { icon: <PpcIcon className="w-10 h-10 text-purple-400 mb-4"/>, title: "Intelligent Ad Management", description: "We manage your social media presence and paid ad campaigns with a focus on maximizing ROI through AI-powered optimization and creative testing." },
    ];

    const consultancyPhases = [
        { phase: 1, title: "Discovery & AI-Readiness Audit", duration: "2 Weeks", description: "We conduct deep-dive workshops with your teams and audit your existing tech stack to identify key gaps and opportunities. We deliver an 'AI-Readiness Scorecard'." },
        { phase: 2, title: "Custom Strategy & Stack Design", duration: "2 Weeks", description: "Based on the audit, we design a custom 'Agentic Stack' and strategic roadmap for your business, including software recommendations and implementation timelines." },
        { phase: 3, title: "Implementation & Integration", duration: "4-6 Weeks", description: "Our team provides hands-on support to set up, configure, and integrate your new AI tools with your existing CRM and workflows, building out the initial automated processes." },
        { phase: 4, title: "Team Training & Governance", duration: "2 Weeks", description: "We conduct hands-on training workshops to upskill your team and help you establish an ethical framework for AI use, delivering a final 'AI Playbook'." },
    ];

    return (
        <div className="bg-gray-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">AI Services & Consultancy</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">The Next Generation of Agency Services</p>
                    <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
                        Move beyond traditional marketing. We offer both done-for-you AI-powered services and strategic consultancy to build AI capabilities within your own team.
                    </p>
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-center mb-12">AI-Powered Service Portfolio</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map(service => (
                            <div key={service.title} className="bg-gray-800 p-8 rounded-lg">
                                {service.icon}
                                <h4 className="text-xl font-bold mt-4 mb-2">{service.title}</h4>
                                <p className="text-gray-400">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-purple-400 tracking-wide uppercase">High-Touch Partnership</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">The AI Transformation Consultancy</p>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
                            For businesses ready to build a lasting competitive advantage by embedding AI into their core operations. We don't just run your campaigns; we transform your team.
                        </p>
                    </div>

                    <div className="mt-16 relative">
                         <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700/50 hidden md:block"></div>
                        {consultancyPhases.map((phase, index) => (
                             <div key={phase.phase} className={`mb-12 flex items-center w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="hidden md:flex w-5/12"></div>
                                <div className="hidden md:flex justify-center w-1/12">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-gray-900 z-10 flex items-center justify-center font-bold">{phase.phase}</div>
                                </div>
                                <div className="w-full md:w-5/12 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                                   <p className="text-sm font-semibold text-purple-400">{phase.duration}</p>
                                   <h4 className="text-xl font-bold text-white mb-2">{phase.title}</h4>
                                   <p className="text-gray-300">{phase.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center bg-gray-800/50 p-10 rounded-2xl">
                    <h3 className="text-2xl font-bold">Is AI Consultancy Right For You?</h3>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        This high-touch service is designed for mid-to-large sized companies with an existing marketing team who are looking to make a foundational investment in their technological future.
                    </p>
                    <button onClick={() => setPage('contact')} className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                        Request a Strategy Session
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

// v1.2 Feature: BlogPage now has category filtering
const BlogPage = ({ posts, setSelectedPost }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', ...new Set(posts.map(item => item.category).filter(Boolean))];

    const visiblePosts = posts
        .filter(post => post.isVisible)
        .filter(post => filter === 'All' || post.category === filter);

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
                                <p className="text-sm text-purple-400 font-semibold">{post.category}</p>
                                <h3 className="text-xl font-bold mt-1 mb-2 text-white">{post.title}</h3>
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
    // v1.1 Feature: Render markdown content safely
    const createMarkup = (markdown) => {
        if (window.marked && window.DOMPurify) {
            const rawMarkup = window.marked.parse(markdown);
            const sanitizedHtml = window.DOMPurify.sanitize(rawMarkup);
            return { __html: sanitizedHtml };
        }
        return { __html: markdown.replace(/\n/g, '<br />') }; // Fallback
    };

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
                <div 
                    className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-a:text-purple-400 prose-strong:text-white prose-headings:text-white" 
                    dangerouslySetInnerHTML={createMarkup(post.content || '')}
                >
                </div>
            </div>
        </div>
    );
};

const RoiCalculatorPage = ({ setPage }) => {
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

const ContactPage = ({ setPage, settings }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus('Please fill out all fields.');
            return;
        }
        setFormStatus('Sending...');
        try {
            await addDoc(collection(db, 'submissions'), {
                ...formData,
                type: 'General Inquiry',
                createdAt: serverTimestamp(),
                status: 'New'
            });
            setFormStatus('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormStatus('An error occurred. Please try again.');
        }
    };

    return (
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Your Message</label>
                            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-600 hover:bg-gray-500">
                                Send
                            </button>
                            {formStatus && <p className="mt-4 text-center text-sm text-gray-400">{formStatus}</p>}
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
                        <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {settings?.contactEmail || 'hello@aigency.com'}</p>
                        <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {settings?.contactPhone || '+880 123 456 7890'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)};

const BookSlotPage = ({ selectedPackage }) => {
    const [serviceType, setServiceType] = useState(selectedPackage || 'Select a service...');
    const [formData, setFormData] = useState({ name: '', company: '', email: '', details: '' });
    const [formStatus, setFormStatus] = useState('');

    useEffect(() => {
        setServiceType(selectedPackage || 'Select a service...');
    }, [selectedPackage]);
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.company) {
            setFormStatus('Please fill out all required fields.');
            return;
        }
        setFormStatus('Submitting...');
        try {
            await addDoc(collection(db, 'submissions'), {
                ...formData,
                serviceType,
                type: 'Consultation Request',
                createdAt: serverTimestamp(),
                status: 'New'
            });
            setFormStatus('Request submitted successfully! We will be in touch shortly.');
            setFormData({ name: '', company: '', email: '', details: '' });
            setServiceType(selectedPackage || 'Select a service...');
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormStatus('An error occurred. Please try again.');
        }
    };

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
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-300">Company Name</label>
                            <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label htmlFor="service-type" className="block text-sm font-medium text-gray-300">What service are you interested in?</label>
                        <select id="service-type" name="service-type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Select a service...</option>
                            <option value="Launchpad">Launchpad Plan</option>
                            <option value="Growth Engine">Growth Engine Plan</option>
                            <option value="Market Leader">Market Leader Plan</option>
                            <option>Branding & Identity</option>
                            <option>Social Media Marketing</option>
                            <option>Search Engine Optimization (SEO)</option>
                            <option>Performance Marketing (PPC)</option>
                            <option>Web Design & Development</option>
                            <option>Video Production</option>
                            <option>AI & Consultancy</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300">Tell us about your project</label>
                        <textarea id="details" name="details" rows="5" value={formData.details} onChange={handleChange} placeholder="What are your goals? What challenges are you facing?" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
                            Submit Request
                        </button>
                        {formStatus && <p className="mt-4 text-center text-sm text-gray-400">{formStatus}</p>}
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

// v1.1 Feature: Simple Markdown Toolbar for Blog Editor
const MarkdownToolbar = ({ textareaRef, onContentChange }) => {
    const applyFormat = (format) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let newText;

        switch (format) {
            case 'bold':
                newText = `**${selectedText}**`;
                break;
            case 'italic':
                newText = `*${selectedText}*`;
                break;
            case 'link':
                const url = prompt("Enter the URL:");
                if (url) newText = `[${selectedText}](${url})`;
                else return;
                break;
            case 'quote':
                newText = `> ${selectedText}`;
                break;
            default:
                return;
        }

        const updatedValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        onContentChange({ target: { name: 'content', value: updatedValue } });
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-t-md border-b border-gray-700">
            <button type="button" onClick={() => applyFormat('bold')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold">B</button>
            <button type="button" onClick={() => applyFormat('italic')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic">I</button>
            <button type="button" onClick={() => applyFormat('link')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Link</button>
            <button type="button" onClick={() => applyFormat('quote')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">"</button>
        </div>
    );
};

// v1.3 Feature: Blog Idea Generator Component
const BlogIdeaGenerator = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateIdeas = async () => {
        if (!topic) return;
        setIsLoading(true);
        setIdeas('');

        const prompt = `You are a content strategy assistant for a marketing agency called AI.gency. Your tone is creative and professional. Given the topic "${topic}", generate 5 compelling blog post titles. For each title, provide a brief, one-sentence outline or hook. Format the entire output as a single block of text using markdown for titles (e.g., ### Title) and regular text for the outlines.`;
        
        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Leave empty
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setIdeas(result.candidates[0].content.parts[0].text);
            } else {
                setIdeas("Sorry, I couldn't generate ideas. Please try again.");
            }
        } catch (error) {
            console.error("Error generating blog ideas:", error);
            setIdeas("An error occurred while generating ideas. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Blog Idea Generator</h3>
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., 'AI in marketing')"
                    className="flex-grow p-3 text-white bg-gray-700 rounded-md"
                />
                <button onClick={generateIdeas} disabled={isLoading} className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium disabled:bg-gray-500">
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            {ideas && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md whitespace-pre-wrap">
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(ideas) : ideas }}></div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = ({ portfolioItems, setPortfolioItems, stats, blogPosts, setBlogPosts, settings, submissions, teamMembers, setTeamMembers }) => {
    const [activeTab, setActiveTab] = useState('portfolio');
    
    // Form states
    const initialPortfolioFormState = { id: null, title: '', description: '', category: '', imageUrl: '', clientName: '', projectDate: '', services: '', challenge: '', solution: '', results: '', testimonial: '', liveUrl: '', isVisible: true, order: 0 };
    const [portfolioForm, setPortfolioForm] = useState(initialPortfolioFormState);
    
    const initialBlogFormState = { id: null, title: '', author: '', category: '', excerpt: '', content: '', featuredImageUrl: '', isVisible: true, order: 0 };
    const [blogForm, setBlogForm] = useState(initialBlogFormState);
    const blogContentRef = useRef(null);

    const initialTeamFormState = { id: null, name: '', title: '', imageUrl: '', order: 0 };
    const [teamForm, setTeamForm] = useState(initialTeamFormState);

    const [statsForm, setStatsForm] = useState(stats || { automationEfficiency: '', deliverySpeed: '', countriesReached: '', roiIncrease: '' });
    useEffect(() => { setStatsForm(stats || { automationEfficiency: '', deliverySpeed: '', countriesReached: '', roiIncrease: '' }); }, [stats]);

    const [settingsForm, setSettingsForm] = useState(settings || { logoUrl: '', faviconUrl: '', contactEmail: '', contactPhone: '' });
    useEffect(() => { setSettingsForm(settings || { logoUrl: '', faviconUrl: '', contactEmail: '', contactPhone: '' }); }, [settings]);

    // Handlers
    const handlePortfolioChange = (e) => setPortfolioForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBlogChange = (e) => setBlogForm(prev => ({...prev, [e.target.name]: e.target.value}));
    const handleTeamChange = (e) => setTeamForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleStatsChange = (e) => setStatsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSettingsChange = (e) => setSettingsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Firestore Submit Handlers
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
        const dataToSave = { ...blogForm, publishedDate: serverTimestamp() };
        delete dataToSave.id;
        try {
            if (blogForm.id) await updateDoc(doc(db, 'blog', blogForm.id), dataToSave);
            else await addDoc(collection(db, 'blog'), { ...dataToSave, order: blogPosts.length });
            setBlogForm(initialBlogFormState);
        } catch (error) { console.error("Error saving blog post:", error); alert('Failed to save blog post.');}
    };

    const handleTeamSubmit = async (e) => {
        e.preventDefault();
        if (!teamForm.name || !teamForm.title) return alert('Name and Title are required.');
        const dataToSave = { ...teamForm };
        delete dataToSave.id;
        try {
            if (teamForm.id) await updateDoc(doc(db, 'team', teamForm.id), dataToSave);
            else await addDoc(collection(db, 'team'), { ...dataToSave, order: teamMembers.length });
            setTeamForm(initialTeamFormState);
        } catch (error) { console.error("Error saving team member:", error); alert('Failed to save team member.');}
    };

    const handleStatsSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'stats', 'whyUsStats'), statsForm);
            alert('Stats updated!');
        } catch (error) { console.error("Error updating stats:", error); alert('Failed to update stats.'); }
    };
    
    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'global'), settingsForm);
            alert('Global settings updated!');
        } catch (error) { console.error("Error updating settings:", error); alert('Failed to update settings.'); }
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
        } else if (type === 'team') {
            setTeamForm(item);
        }
    };
    
    const handleToggleVisibility = async (collectionName, item) => {
        const docRef = doc(db, collectionName, item.id);
        await updateDoc(docRef, { isVisible: !item.isVisible });
    };

    // Drag and Drop Logic
    const dragItem = useRef();
    const dragOverItem = useRef();
    const handleDragStart = (e, index) => { dragItem.current = index; e.target.style.opacity = '0.4'; };
    const handleDragEnter = (e, index) => { dragOverItem.current = index; };
    const handleDragEnd = (e) => { e.target.style.opacity = '1'; };
    const handleDrop = async (collectionName, items, setItems) => {
        const itemsCopy = [...items];
        const dragItemContent = itemsCopy[dragItem.current];
        itemsCopy.splice(dragItem.current, 1);
        itemsCopy.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setItems(itemsCopy);
        const batch = writeBatch(db);
        itemsCopy.forEach((item, index) => {
            const docRef = doc(db, collectionName, item.id);
            batch.update(docRef, { order: index });
        });
        await batch.commit();
    };

    const tabs = ['portfolio', 'blog', 'team', 'stats', 'submissions', 'settings'];

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-20">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <div className="border-b border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {activeTab === 'portfolio' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold text-purple-400 mb-4">{portfolioForm.id ? 'Edit Case Study' : 'Add New Case Study'}</h2>
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
                            <div className="space-y-2">
                                {portfolioItems.map((item, index) => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between flex-wrap gap-4 cursor-grab" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDrop={() => handleDrop('portfolio', portfolioItems, setPortfolioItems)} onDragOver={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-4"><span className={`w-3 h-3 rounded-full ${item.isVisible ? 'bg-green-500' : 'bg-gray-500'}`}></span><p className="font-bold">{item.title}</p></div>
                                        <div className="flex items-center gap-4"><ToggleSwitch isVisible={item.isVisible} onToggle={() => handleToggleVisibility('portfolio', item)} /><button onClick={() => handleEditClick(item, 'portfolio')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Edit</button><button onClick={() => handleDelete('portfolio', item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'blog' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold text-purple-400">{blogForm.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                        <form onSubmit={handleBlogSubmit} className="space-y-4 mt-4">
                            <input name="title" value={blogForm.title} onChange={handleBlogChange} placeholder="Post Title" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="category" value={blogForm.category} onChange={handleBlogChange} placeholder="Category (e.g., SEO)" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="author" value={blogForm.author} onChange={handleBlogChange} placeholder="Author Name" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="featuredImageUrl" value={blogForm.featuredImageUrl} onChange={handleBlogChange} placeholder="Featured Image URL" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogChange} placeholder="Excerpt for card view" className="w-full p-3 text-white bg-gray-700 rounded-md" rows="3"/>
                            <MarkdownToolbar textareaRef={blogContentRef} onContentChange={handleBlogChange} />
                            <textarea ref={blogContentRef} name="content" value={blogForm.content} onChange={handleBlogChange} placeholder="Full post content (Markdown supported)" className="w-full p-3 text-white bg-gray-700 rounded-b-md" rows="10"/>
                            <div className="flex gap-4">
                                <button type="submit" className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium">{blogForm.id ? 'Update Post' : 'Create Post'}</button>
                                {blogForm.id && <button type="button" onClick={() => setBlogForm(initialBlogFormState)} className="py-2 px-6 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-medium">Cancel Edit</button>}
                            </div>
                        </form>
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold mb-4 text-purple-400">Current Blog Posts</h3>
                            <div className="space-y-2">
                                {blogPosts.map((post, index) => (
                                    <div key={post.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between flex-wrap gap-4 cursor-grab" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDrop={() => handleDrop('blog', blogPosts, setBlogPosts)} onDragOver={(e) => e.preventDefault()}>
                                       <div className="flex items-center gap-4"><span className={`w-3 h-3 rounded-full ${post.isVisible ? 'bg-green-500' : 'bg-gray-500'}`}></span><p className="font-bold">{post.title}</p></div>
                                        <div className="flex items-center gap-4"><ToggleSwitch isVisible={post.isVisible} onToggle={() => handleToggleVisibility('blog', post)} /><button onClick={() => handleEditClick(post, 'blog')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Edit</button><button onClick={() => handleDelete('blog', post.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <BlogIdeaGenerator />
                    </div>
                )}

                {activeTab === 'team' && (
                     <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold text-purple-400">{teamForm.id ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                        <form onSubmit={handleTeamSubmit} className="space-y-4 mt-4">
                            <input name="name" value={teamForm.name} onChange={handleTeamChange} placeholder="Full Name" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="title" value={teamForm.title} onChange={handleTeamChange} placeholder="Job Title" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <input name="imageUrl" value={teamForm.imageUrl} onChange={handleTeamChange} placeholder="Image URL" className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            <div className="flex gap-4">
                                <button type="submit" className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium">{teamForm.id ? 'Update Member' : 'Add Member'}</button>
                                {teamForm.id && <button type="button" onClick={() => setTeamForm(initialTeamFormState)} className="py-2 px-6 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-medium">Cancel Edit</button>}
                            </div>
                        </form>
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold mb-4 text-purple-400">Current Team Members</h3>
                            <div className="space-y-2">
                                {teamMembers.map((member, index) => (
                                    <div key={member.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between flex-wrap gap-4 cursor-grab" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDrop={() => handleDrop('team', teamMembers, setTeamMembers)} onDragOver={(e) => e.preventDefault()}>
                                       <div className="flex items-center gap-4"><p className="font-bold">{member.name}</p></div>
                                        <div className="flex items-center gap-4"><button onClick={() => handleEditClick(member, 'team')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Edit</button><button onClick={() => handleDelete('team', member.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button></div>
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
                {activeTab === 'submissions' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-400">Contact & Booking Submissions</h2>
                        <div className="space-y-4">
                            {submissions.length > 0 ? submissions.map(sub => (
                                <div key={sub.id} className="bg-gray-700 p-4 rounded-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-lg">{sub.name} <span className="text-sm font-normal text-gray-400">- {sub.email}</span></p>
                                        <span className="text-xs text-gray-400">{new Date(sub.createdAt?.seconds * 1000).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-purple-400">{sub.type}</p>
                                    {sub.serviceType && <p className="text-sm text-gray-300">Interested in: {sub.serviceType}</p>}
                                    <p className="mt-2 text-gray-200">{sub.message || sub.details}</p>
                                </div>
                            )) : <p>No submissions yet.</p>}
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && (
                     <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-400">Global Site Settings</h2>
                        <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-sm font-bold text-gray-300 block mb-2">Logo URL</label>
                                <input name="logoUrl" value={settingsForm.logoUrl} onChange={handleSettingsChange} className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-bold text-gray-300 block mb-2">Favicon URL</label>
                                <input name="faviconUrl" value={settingsForm.faviconUrl} onChange={handleSettingsChange} className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Contact Email</label>
                                <input name="contactEmail" value={settingsForm.contactEmail} onChange={handleSettingsChange} className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            </div>
                             <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Contact Phone</label>
                                <input name="contactPhone" value={settingsForm.contactPhone} onChange={handleSettingsChange} className="w-full p-3 text-white bg-gray-700 rounded-md"/>
                            </div>
                            <div className="md:col-span-2">
                               <button type="submit" className="w-full md:w-auto py-2 px-6 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium">Save Settings</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer = ({ setPage, settings }) => (
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

// v1.3 Feature: AI-Powered Chatbot
const Chatbot = ({ setPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'ai', text: "Welcome to AI.gency! How can I help you grow your business today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const prompt = `You are a helpful AI assistant for a marketing agency called AI.gency. Your goal is to answer user questions and guide them to the right page or to book a consultation. Be friendly and concise. The agency's services include: SEO, Performance Marketing (PPC), Branding, Social Media Marketing, Web Design & Development, and AI Transformation Consultancy. Based on this, answer the user's query: "${input}"`;

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Leave empty
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I'm having trouble connecting. Please try again.";
            setMessages(prev => [...prev, { from: 'ai', text: aiText }]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            setMessages(prev => [...prev, { from: 'ai', text: "I'm experiencing technical difficulties. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <div className="bg-gray-800 w-80 sm:w-96 h-[500px] rounded-lg shadow-2xl flex flex-col transition-all duration-300 animate-fade-in-up">
                    <div className="bg-gray-700 p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="text-white font-bold">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <p className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${msg.from === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'}`}>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && <div className="flex justify-start"><p className="px-4 py-2 rounded-lg bg-purple-600 text-white">Thinking...</p></div>}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700 flex items-center gap-2">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="w-full bg-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button onClick={handleSend} className="bg-purple-600 p-2 rounded-lg hover:bg-purple-700 text-white"><SendIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(true)} className={`transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <div className="bg-purple-600 p-4 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-110 transition-transform">
                    <ChatIcon className="w-8 h-8 text-white"/>
                </div>
            </button>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className="bg-gray-900 min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-800 p-8 rounded-2xl">
                        <div className="h-16 w-16 bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mx-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // v1.2 state
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageContext, setPageContext] = useState(null);
  const [settings, setSettings] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [dataLoaded, setDataLoaded] = useState({
    portfolio: false,
    blog: false,
    stats: false,
    settings: false,
    submissions: false,
    team: false // v1.2 data loaded flag
  });

  useEffect(() => {
    const collectionsToFetch = [
        { name: 'portfolio', setter: setPortfolioItems, loadedKey: 'portfolio', options: [orderBy('order', 'asc')] },
        { name: 'blog', setter: setBlogPosts, loadedKey: 'blog', options: [orderBy('order', 'asc')] },
        { name: 'submissions', setter: setSubmissions, loadedKey: 'submissions', options: [orderBy('createdAt', 'desc')] },
        { name: 'team', setter: setTeamMembers, loadedKey: 'team', options: [orderBy('order', 'asc')] }, // v1.2 data fetch
    ];

    const unsubscribers = collectionsToFetch.map(c => {
        const q = query(collection(db, c.name), ...c.options);
        return onSnapshot(q, (snapshot) => {
            c.setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setDataLoaded(prev => ({ ...prev, [c.loadedKey]: true }));
        }, (error) => console.error(`Error fetching ${c.name}:`, error));
    });
    
    const unsubscribeStats = onSnapshot(doc(db, "stats", "whyUsStats"), (doc) => {
        if (doc.exists()) setStats(doc.data());
        setDataLoaded(prev => ({ ...prev, stats: true }));
    }, (error) => console.error("Error fetching stats:", error));

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "global"), (doc) => {
        if (doc.exists()) {
            const newSettings = doc.data();
            setSettings(newSettings);
            if (newSettings.faviconUrl) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = newSettings.faviconUrl;
            }
        }
        setDataLoaded(prev => ({ ...prev, settings: true }));
    }, (error) => console.error("Error fetching settings:", error));

    return () => {
      unsubscribers.forEach(unsub => unsub());
      unsubscribeStats();
      unsubscribeSettings();
    };
  }, []); 

  useEffect(() => {
    const allLoaded = Object.values(dataLoaded).every(status => status === true);
    if (allLoaded) {
        setTimeout(() => setLoading(false), 500);
    }
  }, [dataLoaded]);

  const handleLogout = () => {
    setIsAdmin(false);
    setPage('home');
  };
  
  const handleSetPage = (newPage, context = null) => {
      setPage(newPage);
      setPageContext(context);
  }

  const renderPage = () => {
    if (loading) {
        return <SkeletonLoader />;
    }
    
    if (page === 'blog' && selectedPost) {
        return <BlogPostPage post={selectedPost} setSelectedPost={setSelectedPost} />;
    }

    const visiblePortfolioItems = portfolioItems.filter(p => p.isVisible);
    const visibleBlogPosts = blogPosts.filter(p => p.isVisible);

    switch (page) {
      case 'home':
        return <HomePage setPage={handleSetPage} portfolioItems={visiblePortfolioItems} blogPosts={visibleBlogPosts} />;
      case 'about':
        return <AboutUsPage setPage={handleSetPage} teamMembers={teamMembers} />;
      case 'services':
        return <ServicesPage setPage={handleSetPage} />;
      case 'pricing':
        return <PricingPage handleSetPage={handleSetPage} />;
      case 'ai-consultancy':
        return <AIConsultancyPage setPage={handleSetPage} />;
      case 'why-us':
        return <WhyUsPage stats={stats} setPage={handleSetPage} />;
      case 'portfolio':
        return <PortfolioPage portfolioItems={visiblePortfolioItems} />;
      case 'blog':
        return <BlogPage posts={visibleBlogPosts} setSelectedPost={setSelectedPost} />;
      case 'roi-calculator':
        return <RoiCalculatorPage setPage={handleSetPage} />;
      case 'contact':
        return <ContactPage setPage={handleSetPage} settings={settings} />;
      case 'book-a-slot':
        return <BookSlotPage selectedPackage={pageContext} />;
      case 'login':
        return <AdminLoginPage setPage={handleSetPage} setIsAdmin={setIsAdmin} />;
      case 'admin':
        return isAdmin ? <AdminDashboard portfolioItems={portfolioItems} setPortfolioItems={setPortfolioItems} stats={stats} blogPosts={blogPosts} setBlogPosts={setBlogPosts} settings={settings} submissions={submissions} teamMembers={teamMembers} setTeamMembers={setTeamMembers} /> : <AdminLoginPage setPage={handleSetPage} setIsAdmin={setIsAdmin} />;
      default:
        return <HomePage setPage={handleSetPage} portfolioItems={visiblePortfolioItems} blogPosts={visibleBlogPosts} />;
    }
  };

  return (
    <div className="bg-gray-900">
      {/* Scripts for Markdown parsing and sanitization */}
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/dompurify@2.3.8/dist/purify.min.js"></script>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .page-transition {
            animation: fadeIn 0.5s ease-out forwards;
        }
        /* Styling for rendered markdown content */
        .prose a { text-decoration: underline; }
        .prose blockquote { border-left-color: #a78bfa; }
      `}</style>
      <Navbar setPage={handleSetPage} isAdmin={isAdmin} handleLogout={handleLogout} settings={settings} />
      <main>
        <div key={page} className="page-transition">
            {renderPage()}
        </div>
      </main>
      <Footer setPage={handleSetPage} settings={settings} />
      {page === 'home' && <Chatbot setPage={handleSetPage} />}
    </div>
  );
}
