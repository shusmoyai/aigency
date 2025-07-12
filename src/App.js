/*
================================================================================
AI Agency Website - Full React Application
Version: 5.0 (Resource-Rich Homepage Update)
================================================================================
*/

// V5: App.js

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

// --- Firebase Configuration ---
// IMPORTANT: Replace these with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyA9-zRqB6xjbAIDwL8KzVJCBoIVBBPCOk0",
  authDomain: "aigency-portfolio.firebaseapp.com",
  projectId: "aigency-portfolio",
  storageBucket: "aigency-portfolio.firebasestorage.app",
  messagingSenderId: "889436522880",
  appId: "1:889436522880:web:aeb772ea945a18e6e19965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Authentication Context ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = { user, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

// --- Main App Component ---
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <main>
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

// --- Animated Routes for Page Transitions ---
const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/why-us" element={<WhyUsPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/book-a-slot" element={<BookSlotPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

// --- Page Transition Wrapper ---
const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
};

const PageWrapper = ({ children }) => (
    <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.4 }}
    >
        {children}
    </motion.div>
);


// --- COMPONENTS ---

// --- Header ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };
    
    const NavLink = ({ to, children }) => {
        const location = useLocation();
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                {children}
            </Link>
        );
    };

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">AI-GENIX</Link>
                <nav className={`nav ${isOpen ? 'open' : ''}`}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About Us</NavLink>
                    <NavLink to="/why-us">Why Us</NavLink>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    {user && <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>Admin</Link>}
                </nav>
                 <div className="header-actions">
                    <Link to="/book-a-slot" className="btn btn-primary">Book a Slot</Link>
                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- Footer ---
const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3 className="logo">AI-GENIX</h3>
                    <p>Blending AI efficiency with human creativity to scale your business.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/why-us">Why Us</Link></li>
                        <li><Link to="/portfolio">Our Work</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Get in Touch</h4>
                    <p>info@aigenix.com</p>
                    <p>Based in Chattogram, Serving the World</p>
                </div>
                <div className="footer-cta">
                     <h4>Ready to Grow?</h4>
                     <p>Let's discuss how our unique approach can revolutionize your marketing.</p>
                     <Link to="/book-a-slot" className="btn btn-secondary">Get a Free Consultation</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} AI-Genix. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


// --- PAGES ---

// --- V5: Resource-Rich Home Page ---
const HomePage = () => {
    const [portfolio, setPortfolio] = useState([]);
    // In a real app, you'd fetch blog posts too
    const blogPosts = [
        { id: 1, title: 'The Future is Hybrid: Why Human Oversight on AI is Key', excerpt: 'AI is a powerful tool, but true marketing genius comes from the strategic guidance of a human expert...' },
        { id: 2, title: '5 AI Tools That Will Revolutionize Your Content Creation', excerpt: 'We pull back the curtain on some of the tech we use to deliver stunning results at unparalleled speed...' },
        { id: 3, title: 'From Cold Outreach to Hot Lead: Our AI-Powered Process', excerpt: 'Discover how we turn vast, cold data into genuine, high-quality leads for your business...' },
    ];


    useEffect(() => {
        const fetchPortfolio = async () => {
            const portfolioCol = collection(db, 'portfolio');
            const portfolioSnapshot = await getDocs(portfolioCol);
            const portfolioList = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPortfolio(portfolioList.slice(0, 3)); // Show 3 featured projects
        };
        fetchPortfolio();
    }, []);

    return (
        <PageWrapper>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>The New Era of Marketing is Here.</h1>
                        <p className="subtitle">We fuse Artificial Intelligence with Human Expertise to deliver unparalleled marketing results. Faster. Smarter. Better.</p>
                        <Link to="/book-a-slot" className="btn btn-primary btn-lg">Start Your Growth Story</Link>
                    </div>
                </div>
                <div className="hero-bg-animation">
                    {/* Placeholder for a cool, abstract animation */}
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
            </section>

             {/* Trusted By Section */}
            <section className="trusted-by-section">
                <div className="container">
                    <p>POWERING GROWTH FOR INNOVATIVE BRANDS WORLDWIDE</p>
                    <div className="logos">
                        {/* Replace with actual client logos */}
                        <div className="logo-placeholder">ClientLogo</div>
                        <div className="logo-placeholder">ClientLogo</div>
                        <div className="logo-placeholder">ClientLogo</div>
                        <div className="logo-placeholder">ClientLogo</div>
                        <div className="logo-placeholder">ClientLogo</div>
                    </div>
                </div>
            </section>

             {/* What We Do Section */}
            <section className="what-we-do-section section-padding">
                <div className="container text-center">
                    <h2 className="section-title">Our Core Services</h2>
                    <p className="section-subtitle">A holistic suite of services designed for impact.</p>
                    <div className="grid-3-col">
                        <div className="service-card">
                            <div className="service-icon"> {/* Placeholder for icon */} </div>
                            <h3>AI-Powered Lead Gen</h3>
                            <p>We build hyper-targeted lead lists and automate outreach to fill your pipeline.</p>
                        </div>
                         <div className="service-card">
                            <div className="service-icon"> {/* Placeholder for icon */} </div>
                            <h3>Content & Branding</h3>
                            <p>High-quality content, from blog posts to social media, crafted at scale.</p>
                        </div>
                         <div className="service-card">
                            <div className="service-icon"> {/* Placeholder for icon */} </div>
                            <h3>Performance Marketing</h3>
                            <p>Data-driven ad campaigns optimized by AI, managed by human strategists.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Featured Work Section */}
            <section className="featured-work-section section-padding bg-light">
                <div className="container">
                    <h2 className="section-title text-center">See The Results</h2>
                     <p className="section-subtitle text-center">We don't just talk the talk. Here's how we've helped businesses like yours.</p>
                    <div className="portfolio-grid">
                        {portfolio.map(item => (
                            <div key={item.id} className="portfolio-card-small">
                                <img src={item.imageUrl || 'https://via.placeholder.com/400x300'} alt={item.title} />
                                <div className="card-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="text-center" style={{marginTop: '2rem'}}>
                        <Link to="/portfolio" className="btn btn-secondary">View All Projects</Link>
                    </div>
                </div>
            </section>
            
            {/* ROI Calculator Section */}
            <RoiCalculatorSection />
            
            {/* Insights Section */}
            <section className="insights-section section-padding">
                 <div className="container">
                    <h2 className="section-title text-center">Our Latest Insights</h2>
                    <p className="section-subtitle text-center">Thoughts on the future of marketing, from the front lines.</p>
                    <div className="grid-3-col">
                        {blogPosts.map(post => (
                             <div key={post.id} className="blog-card">
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <a href="#" className="read-more">Read More &rarr;</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="testimonials-section section-padding bg-light">
                <div className="container">
                     <h2 className="section-title text-center">What Our Clients Say</h2>
                    <div className="testimonial">
                        <p className="testimonial-quote">"Working with AI-Genix was a game-changer. Their process is incredibly efficient, and the quality of leads we received was beyond our expectations. They doubled our inbound meetings in just one quarter."</p>
                        <p className="testimonial-author">- Sarah L., CEO of TechNova</p>
                    </div>
                </div>
            </section>

        </PageWrapper>
    );
};

// --- ROI Calculator (for homepage) ---
const RoiCalculatorSection = () => {
    const [investment, setInvestment] = useState(1500);
    const [roi, setRoi] = useState(300); // Default average ROI

    const revenue = investment * (roi / 100);
    const profit = revenue - investment;

    return (
        <section className="roi-calculator-section section-padding">
            <div className="container">
                <h2 className="section-title text-center">Calculate Your Potential ROI</h2>
                <p className="section-subtitle text-center">See the potential impact of our AI-driven approach on your bottom line.</p>
                <div className="calculator-wrapper">
                    <div className="calculator-inputs">
                        <div className="form-group">
                            <label>Your Monthly Marketing Investment ($)</label>
                            <input
                                type="range"
                                min="500"
                                max="10000"
                                step="100"
                                value={investment}
                                onChange={(e) => setInvestment(Number(e.target.value))}
                            />
                             <span>${investment.toLocaleString()}</span>
                        </div>
                         <div className="form-group">
                            <label>Expected ROI with AI-Genix (%)</label>
                             <input
                                type="range"
                                min="150"
                                max="800"
                                step="10"
                                value={roi}
                                onChange={(e) => setRoi(Number(e.target.value))}
                            />
                             <span>{roi}%</span>
                        </div>
                    </div>
                    <div className="calculator-results">
                        <h3>Potential Results</h3>
                        <div className="result-item">
                            <h4>Generated Revenue</h4>
                            <p>${revenue.toLocaleString()}</p>
                        </div>
                        <div className="result-item">
                            <h4>Net Profit</h4>
                             <p>${profit.toLocaleString()}</p>
                        </div>
                         <p className="disclaimer">*This is an estimate based on average client results. Actual ROI can vary.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- V4: About Us Page ---
const AboutPage = () => (
    <PageWrapper>
        <div className="container section-padding">
            <h1 className="page-title text-center">We Are Your Unfair Advantage.</h1>
            <p className="page-subtitle text-center">In a world of digital noise, we provide the clarity and power to rise above.</p>
            
            <div className="about-section">
                <div className="about-content">
                    <h2>Our Mission: Democratizing Growth</h2>
                    <p>High-level marketing shouldn't be reserved for corporate giants. Our mission is to equip ambitious businesses with the cutting-edge strategies and AI-powered tools needed to compete and win on a global scale. We believe in a future where great ideas, not just big budgets, determine success.</p>
                </div>
                <div className="about-visual">
                    {/* Placeholder for a mission-related SVG */}
                     <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#e0f7fa" /><path d="M50 20 l20 30 l-40 0 z" fill="#00796b" /></svg>
                </div>
            </div>

            <div className="about-section reverse">
                <div className="about-content">
                    <h2>The Human Strategists Behind the AI</h2>
                    <p>Our technology is powerful, but our people are our strength. Every campaign is overseen by experienced marketers who guide the AI, interpret the data, and build genuine relationships with our clients. We are prompt whisperers, data scientists, and creative storytellers—your dedicated partners in growth.</p>
                </div>
                 <div className="about-visual">
                     {/* Placeholder for a team-related SVG */}
                     <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#fce4ec" /><path d="M30 70 q 20 -40 40 0" stroke="#c2185b" strokeWidth="4" fill="none" /></svg>
                 </div>
            </div>
            
        </div>
    </PageWrapper>
);

// --- V3: Why Us Page ---
const WhyUsPage = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const docRef = doc(db, 'stats', 'whyUsStats');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStats(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };
        fetchStats();
    }, []);

    return (
        <PageWrapper>
            <div className="container section-padding">
                <h1 className="page-title text-center">The AI-Genix Difference</h1>
                <p className="page-subtitle text-center">It's not just about using AI. It's about using it right.</p>

                 {/* Our Process Section */}
                <div className="process-section">
                    <h2 className="section-title text-center">Our AI-Human Workflow</h2>
                    <div className="process-steps">
                        {/* Step 1 */}
                        <div className="process-step">
                            <div className="process-icon"> {/* Icon for Discovery */} </div>
                            <h3>1. AI Discovery</h3>
                            <p>Our AI scours millions of data points to identify your perfect customer profile and build hyper-targeted lead lists.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="process-step">
                            <div className="process-icon"> {/* Icon for Outreach */} </div>
                            <h3>2. Automated Outreach</h3>
                            <p>Personalized, automated email campaigns engage prospects at scale, warming them up for a real conversation.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="process-step">
                            <div className="process-icon"> {/* Icon for Human Strategy */} </div>
                            <h3>3. Human Strategy</h3>
                            <p>Once a lead shows interest, our human experts take over to craft strategy, build relationships, and define goals.</p>
                        </div>
                        {/* Step 4 */}
                        <div className="process-step">
                            <div className="process-icon"> {/* Icon for Execution */} </div>
                            <h3>4. AI-Assisted Execution</h3>
                            <p>We leverage AI tools to create high-quality content and campaigns with incredible speed, all guided by human creativity.</p>
                        </div>
                    </div>
                </div>

                {/* Core Philosophies Section */}
                 <div className="philosophies-section section-padding bg-light">
                    <h2 className="section-title text-center">Our Core Philosophies</h2>
                     <div className="grid-3-col">
                        <div className="philosophy-card">
                             <h3>Strategic Partnership</h3>
                            <p>We're not just a service provider; we're an extension of your team, deeply invested in your success.</p>
                        </div>
                         <div className="philosophy-card">
                            <h3>Radical Transparency</h3>
                            <p>You'll always know what we're doing, why we're doing it, and how it's performing. No black boxes.</p>
                        </div>
                         <div className="philosophy-card">
                            <h3>Continuous Innovation</h3>
                            <p>We are constantly testing new tools and strategies to ensure you always have a competitive edge.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section section-padding">
                     <h2 className="section-title text-center">The Proof Is in the Numbers</h2>
                    {stats ? (
                        <div className="stats-grid">
                            <div className="stat-item">
                                <h3><CountUp end={stats.automationEfficiency} duration={3} />%</h3>
                                <p>Increase in Team Efficiency</p>
                            </div>
                            <div className="stat-item">
                                <h3><CountUp end={stats.deliverySpeed} duration={3} />x</h3>
                                <p>Faster Campaign Delivery</p>
                            </div>
                             <div className="stat-item">
                                <h3><CountUp end={stats.countriesReached} duration={3} /></h3>
                                <p>Countries Reached</p>
                            </div>
                             <div className="stat-item">
                                <h3><CountUp end={stats.roiIncrease} duration={3} />%</h3>
                                <p>Average Client ROI Increase</p>
                            </div>
                        </div>
                    ) : <p>Loading stats...</p>}
                </div>
            </div>
        </PageWrapper>
    );
};

// --- Portfolio Page ---
const PortfolioPage = () => {
    const [portfolio, setPortfolio] = useState([]);
    useEffect(() => {
        const fetchPortfolio = async () => {
            const portfolioCol = collection(db, 'portfolio');
            const portfolioSnapshot = await getDocs(portfolioCol);
            const portfolioList = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPortfolio(portfolioList);
        };
        fetchPortfolio();
    }, []);

    return (
        <PageWrapper>
            <div className="container section-padding">
                <h1 className="page-title text-center">Our Work</h1>
                <p className="page-subtitle text-center">A showcase of the results we've driven for our clients.</p>
                <div className="portfolio-grid-full">
                    {portfolio.map(item => (
                        <div key={item.id} className="portfolio-item-full">
                            <img src={item.imageUrl || 'https://via.placeholder.com/600x400'} alt={item.title} />
                            <div className="portfolio-item-content">
                                <h3>{item.title}</h3>
                                <span>{item.category}</span>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};


// --- V4: Book a Slot Page ---
const BookSlotPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        serviceType: '',
        details: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // In a real app, you would save this to a 'leads' collection
            console.log("Form submitted:", formData);
            await addDoc(collection(db, "leads"), formData);
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert("There was an error submitting your request. Please try again.");
        }
    };

    if (submitted) {
        return (
            <PageWrapper>
                <div className="container section-padding text-center">
                    <h1 className="page-title">Thank You!</h1>
                    <p className="page-subtitle">Your request has been received. We'll be in touch within 24 hours to schedule your consultation.</p>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="container section-padding">
                <h1 className="page-title text-center">Book Your Free Consultation</h1>
                <p className="page-subtitle text-center">Fill out the form below, and let's talk about how we can help you grow. No pressure, no obligation.</p>
                <form onSubmit={handleSubmit} className="contact-form" style={{maxWidth: '700px', margin: '0 auto'}}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company Name</label>
                        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="serviceType">What service are you interested in?</label>
                        <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange}>
                            <option value="">Select a service...</option>
                            <option value="AI Lead Generation">AI Lead Generation</option>
                            <option value="Content & Branding">Content & Branding</option>
                            <option value="Performance Marketing">Performance Marketing</option>
                            <option value="Full Package">Full Package</option>
                            <option value="Not Sure Yet">Not Sure Yet</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label htmlFor="details">Tell us about your project</label>
                        <textarea id="details" name="details" rows="5" value={formData.details} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Request</button>
                </form>
            </div>
        </PageWrapper>
    );
};

// --- Contact Page ---
const ContactPage = () => (
     <PageWrapper>
        <div className="container section-padding">
            <h1 className="page-title text-center">Get in Touch</h1>
            <p className="page-subtitle text-center">Have a general question? We'd love to hear from you.</p>
            <div className="contact-info">
                <p><strong>Email:</strong> info@aigenix.com</p>
                <p><strong>Location:</strong> Chattogram, Bangladesh (Serving clients globally)</p>
                 <p>For project inquiries, please use our <Link to="/book-a-slot">consultation booking form</Link>.</p>
            </div>
        </div>
    </PageWrapper>
);

// --- Admin Page ---
const AdminPage = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    if (!user) {
        return (
            <PageWrapper>
                <div className="container section-padding">
                    <h1 className="page-title text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="container section-padding">
                <h1 className="page-title">Admin Dashboard</h1>
                <p>Welcome, admin. Here you can manage your site's content.</p>
                <StatsEditor />
                <PortfolioEditor />
            </div>
        </PageWrapper>
    );
};

// --- Admin Components ---
const StatsEditor = () => {
    const [stats, setStats] = useState({ automationEfficiency: 0, deliverySpeed: 0, countriesReached: 0, roiIncrease: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const docRef = doc(db, 'stats', 'whyUsStats');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStats(docSnap.data());
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = doc(db, 'stats', 'whyUsStats');
        await updateDoc(docRef, stats);
        alert('Stats updated successfully!');
    };
    
    if(loading) return <p>Loading stats editor...</p>

    return (
        <div className="admin-section">
            <h2>Edit 'Why Us' Statistics</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(stats).map(key => (
                    <div className="form-group" key={key}>
                        <label htmlFor={key}>{key}</label>
                        <input type="number" id={key} name={key} value={stats[key]} onChange={handleChange} />
                    </div>
                ))}
                <button type="submit" className="btn btn-secondary">Update Stats</button>
            </form>
        </div>
    );
};

const PortfolioEditor = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [newItem, setNewItem] = useState({ title: '', description: '', category: '', imageUrl: '' });
    
    useEffect(() => {
        const fetchPortfolio = async () => {
            const portfolioCol = collection(db, 'portfolio');
            const portfolioSnapshot = await getDocs(portfolioCol);
            setPortfolio(portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPortfolio();
    }, []);

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.title) return;
        const docRef = await addDoc(collection(db, "portfolio"), newItem);
        setPortfolio([...portfolio, {id: docRef.id, ...newItem}]);
        setNewItem({ title: '', description: '', category: '', imageUrl: '' });
        alert('Portfolio item added!');
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "portfolio", id));
        setPortfolio(portfolio.filter(item => item.id !== id));
        alert('Portfolio item deleted!');
    }

    return (
         <div className="admin-section">
            <h2>Manage Portfolio</h2>
            <form onSubmit={handleAddItem}>
                <h3>Add New Project</h3>
                <input type="text" name="title" value={newItem.title} onChange={handleNewItemChange} placeholder="Title" />
                <input type="text" name="category" value={newItem.category} onChange={handleNewItemChange} placeholder="Category (e.g., SEO, Branding)" />
                <textarea name="description" value={newItem.description} onChange={handleNewItemChange} placeholder="Description"></textarea>
                <input type="text" name="imageUrl" value={newItem.imageUrl} onChange={handleNewItemChange} placeholder="Image URL" />
                <button type="submit" className="btn btn-secondary">Add Item</button>
            </form>

            <div className="portfolio-list">
                <h3>Existing Projects</h3>
                {portfolio.map(item => (
                    <div key={item.id} className="portfolio-list-item">
                        <p>{item.title}</p>
                        <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- NotFound Page ---
const NotFoundPage = () => (
    <PageWrapper>
        <div className="container section-padding text-center">
            <h1>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go Home</Link>
        </div>
    </PageWrapper>
);


export default App;