import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const logoImg = "/vyoma final logo.png";

export default function Header({ currentPath, navigateTo }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            // 1. Sticky header scroll effect
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // 2. Active navigation link scroll highlighting (only highlight if on home page)
            if (currentPath === '/our-story') {
                setActiveSection('');
                return;
            }

            const sections = ['home', 'vision', 'platform', 'why-schools', 'products', 'team', 'partners', 'faq', 'contact'];
            let current = 'home';
            const scrollPos = window.scrollY + 120; // 120px offset to accommodate header sizing

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        current = sectionId;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPath]);

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    const handleSectionClick = (e, sectionId) => {
        if (currentPath === '/our-story') {
            e.preventDefault();
            setMenuOpen(false);
            if (navigateTo) {
                navigateTo('/');
                // Wait for path transition to complete then scroll
                setTimeout(() => {
                    const el = document.getElementById(sectionId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 150);
            } else {
                window.location.href = `/#${sectionId}`;
            }
        } else {
            handleLinkClick();
        }
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <a
                    href="#home"
                    className="logo"
                    onClick={(e) => {
                        if (currentPath === '/our-story') {
                            e.preventDefault();
                            if (navigateTo) navigateTo('/');
                            else window.location.href = '/';
                        } else {
                            handleLinkClick();
                        }
                    }}
                >
                    <img src={logoImg} className="logo-img" alt="Vyoma Logo" />
                </a>

                <button
                    className="menu-toggle"
                    aria-label="Toggle Menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <a href="#home" className={`nav-link ${activeSection === 'home' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'home')}>Home</a>
                    <a href="#vision" className={`nav-link ${activeSection === 'vision' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'vision')}>Vision</a>
                    <a href="#platform" className={`nav-link ${activeSection === 'platform' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'platform')}>Platform</a>
                    <a href="#why-schools" className={`nav-link ${activeSection === 'why-schools' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'why-schools')}>Features</a>
                    <a href="#products" className={`nav-link ${activeSection === 'products' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'products')}>Products</a>

                    {/* Add Our Story page menu link */}
                    <a
                        href="/our-story"
                        className={`nav-link ${currentPath === '/our-story' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(false);
                            if (navigateTo) navigateTo('/our-story');
                            else window.location.href = '/our-story';
                        }}
                    >
                        Our Story
                    </a>

                    <a href="#team" className={`nav-link ${activeSection === 'team' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'team')}>Team</a>
                    <a href="#partners" className={`nav-link ${activeSection === 'partners' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'partners')}>Partners</a>
                    <a href="#faq" className={`nav-link ${activeSection === 'faq' && currentPath !== '/our-story' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'faq')}>FAQ</a>
                </nav>

                <div className="header-actions">
                    <a href="#contact" className="btn btn-primary" onClick={(e) => handleSectionClick(e, 'contact')}>Get in Touch</a>
                </div>
            </div>
        </header>
    );
}
