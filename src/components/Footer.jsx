import React from 'react';

const logoImg = "/vyoma final logo.png";

export default function Footer({ navigateTo }) {
    const handleLogoClick = (e) => {
        if (navigateTo) {
            e.preventDefault();
            navigateTo('/');
            setTimeout(() => {
                const el = document.getElementById('home');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <footer className="footer">
            <div className="container footer-main-wrapper">
                {/* Column 1: Brand details */}
                <div className="footer-brand">
                    <div className="footer-logo-block">
                        <a
                            href="#home"
                            className="footer-logo-link"
                            aria-label="Vyoma Home"
                            onClick={handleLogoClick}
                        >
                            <img
                                src={logoImg}
                                alt="Vyoma Logo"
                                className="logo-img footer-logo-img"
                            />
                        </a>
                    </div>
                    <h4 className="footer-brand-firm-name">Vyoma Learning Systems Pvt. Ltd.</h4>
                    <p className="footer-desc">
                        An education ecosystem integrating academics, skills, and industry exposure to shape the future of learning.
                    </p>
                    <div className="footer-socials">
                        <a href="#" aria-label="LinkedIn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-linkedin"
                            >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect width="4" height="12" x="2" y="9"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-twitter"
                            >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-instagram"
                            >
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Explore links */}
                <div className="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li>
                            <a href="#vision">Vision</a>
                        </li>
                        <li>
                            <a href="#platform">Platform</a>
                        </li>
                        <li>
                            <a href="#why-schools">Features</a>
                        </li>
                        <li>
                            <a href="#products">Products</a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Company links */}
                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li>
                            <a href="/our-story" onClick={(e) => { e.preventDefault(); navigateTo('/our-story'); }}>Our Story</a>
                        </li>
                        <li>
                            <a href="#contact">Contact</a>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Get in Touch Card Box */}
                <div className="footer-right-content">
                    <div className="contact-card-box" id="contact">
                        <div className="contact-box-header">
                            <h3 className="contact-box-title">Get in Touch</h3>
                            <span className="contact-header-code-btn">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    data-lucide="code-2"
                                    aria-hidden="true"
                                    className="lucide lucide-code-2"
                                >
                                    <path d="m18 16 4-4-4-4"></path>
                                    <path d="m6 8-4 4 4 4"></path>
                                    <path d="m14.5 4-5 16"></path>
                                </svg>
                            </span>
                        </div>

                        <div className="contact-details-grid">
                            {/* Full Width Card: Address (Clickable Google Maps link) */}
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=i-Hub,+KCG+Campus,+University+Area,+Ahmedabad+-+380015,+Gujarat,+India"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-detail-card full-width location-card-link"
                                aria-label="Open location in Google Maps"
                                title="Open in Google Maps"
                            >
                                <div className="contact-detail-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        data-lucide="map-pin"
                                        aria-hidden="true"
                                        className="lucide lucide-map-pin"
                                    >
                                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <div className="contact-detail-info">
                                    <p>i-Hub, KCG Campus, University Area</p>
                                    <p>Ahmedabad – 380015, Gujarat, India</p>
                                </div>
                            </a>

                            {/* Two Columns for Phone and Email */}
                            <div className="contact-details-row">
                                <div className="contact-detail-card half-width">
                                    <div className="contact-detail-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            data-lucide="phone"
                                            aria-hidden="true"
                                            className="lucide lucide-phone"
                                        >
                                            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                                        </svg>
                                    </div>
                                    <div className="contact-detail-info">
                                        <p>+91 87803 75687</p>
                                    </div>
                                </div>

                                <div className="contact-detail-card half-width">
                                    <div className="contact-detail-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            data-lucide="mail"
                                            aria-hidden="true"
                                            className="lucide lucide-mail"
                                        >
                                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        </svg>
                                    </div>
                                    <div className="contact-detail-info">
                                        <p><a href="mailto:info@vyomalearn.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@vyomalearn.com</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider & Bottom Copyright bar */}
            <div className="container footer-bottom">
                <div className="footer-bottom-divider"></div>
                <div className="footer-bottom-row">
                    <p className="copyright-text">&copy; 2026 Vyoma Learning Systems Pvt. Ltd. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
