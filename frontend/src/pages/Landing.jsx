import { Link } from 'react-router-dom';

const features = [
    { icon: '💳', title: 'Buy Now, Pay Later', desc: 'Make purchases instantly and settle your dues at your convenience.' },
    { icon: '🏪', title: 'Multi-Merchant Support', desc: 'Shop across multiple merchants, each with their own dynamic fee structure.' },
    { icon: '📊', title: 'Real-time Reports', desc: 'Track dues, fees, and credit usage with detailed analytics.' },
    { icon: '🔒', title: 'Secure & Reliable', desc: 'JWT-secured endpoints ensure your data stays protected.' },
];

export default function Landing() {
    return (
        <div className="landing">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-nav__brand">💸 PayLater</div>
                <div className="landing-nav__links">
                    <Link to="/signin" className="btn-nav-outline">Sign In</Link>
                    <Link to="/signup" className="btn-nav-solid">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero__badge">✨ Simple. Flexible. Powerful.</div>
                <h1 className="hero__title">
                    Buy Now,<br />
                    <span className="hero__title--accent">Pay Later</span>
                </h1>
                <p className="hero__subtitle">
                    A modern pay-later platform built for seamless credit management.
                    Shop with merchants, track dues, and pay back at your pace.
                </p>
                <div className="hero__cta">
                    <Link to="/signup" className="btn-primary-lg">Start for Free →</Link>
                    <Link to="/signin" className="btn-ghost-lg">Sign In</Link>
                </div>
                {/* Floating cards */}
                <div className="hero__float-cards">
                    <div className="float-card float-card--1">
                        <span>💳</span>
                        <div>
                            <div className="float-card__label">Credit Used</div>
                            <div className="float-card__val">₹750 / ₹1000</div>
                        </div>
                    </div>
                    <div className="float-card float-card--2">
                        <span>✅</span>
                        <div>
                            <div className="float-card__label">Transaction</div>
                            <div className="float-card__val">Success</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <h2 className="features__title">Everything you need</h2>
                <p className="features__sub">Built for users, merchants, and administrators alike.</p>
                <div className="features__grid">
                    {features.map((f) => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-card__icon">{f.icon}</div>
                            <h3 className="feature-card__title">{f.title}</h3>
                            <p className="feature-card__desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <h2>Ready to get started?</h2>
                <p>Join thousands managing their credit smarter.</p>
                <Link to="/signup" className="btn-primary-lg">Create Free Account →</Link>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>© 2026 PayLater. Built with FastAPI & React.</p>
            </footer>
        </div>
    );
}
