import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const logoImg = "/vyoma final logo.png";

export default function Header({ currentPath, navigateTo }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

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

    // Handle outside clicks and keyboard navigation (Escape to close)
    useEffect(() => {
        if (!dropdownOpen) return;

        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
                if (triggerRef.current) {
                    triggerRef.current.focus();
                }
            }
        };

        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dropdownOpen]);

    // Close dropdown whenever the mobile menu drawer is closed
    useEffect(() => {
        if (!menuOpen) {
            setDropdownOpen(false);
        }
    }, [menuOpen]);

    // Desktop hover handlers
    const handleMouseEnter = () => {
        if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            setDropdownOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            setDropdownOpen(false);
        }
    };

    // Click toggle handler
    const handleDropdownToggle = (e) => {
        e.stopPropagation();
        setDropdownOpen((prev) => !prev);
    };

    // Keyboard toggle support (Enter or Space)
    const handleDropdownKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDropdownOpen((prev) => !prev);
        }
    };

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
                    onClick={(e) => handleSectionClick(e, 'home')}
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
                    <div
                        ref={dropdownRef}
                        className={`nav-dropdown ${dropdownOpen ? 'open' : 'closed'}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            ref={triggerRef}
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                            aria-controls="ecosystem-dropdown-menu"
                            className={`dropdown-trigger ${['vision', 'platform', 'why-schools', 'products'].includes(activeSection) && currentPath !== '/our-story' ? 'active' : ''}`}
                            onClick={handleDropdownToggle}
                            onKeyDown={handleDropdownKeyDown}
                        >
                            Ecosystem <ChevronDown size={14} />
                        </button>
                        <div
                            id="ecosystem-dropdown-menu"
                            role="menu"
                            aria-label="Ecosystem"
                            className="dropdown-content"
                        >
                            <a
                                href="#vision"
                                role="menuitem"
                                className={`dropdown-item ${activeSection === 'vision' && currentPath !== '/our-story' ? 'active' : ''}`}
                                onClick={(e) => {
                                    setDropdownOpen(false);
                                    handleSectionClick(e, 'vision');
                                }}
                            >
                                Vision
                            </a>
                            <a
                                href="#platform"
                                role="menuitem"
                                className={`dropdown-item ${activeSection === 'platform' && currentPath !== '/our-story' ? 'active' : ''}`}
                                onClick={(e) => {
                                    setDropdownOpen(false);
                                    handleSectionClick(e, 'platform');
                                }}
                            >
                                Platform
                            </a>
                            <a
                                href="#why-schools"
                                role="menuitem"
                                className={`dropdown-item ${activeSection === 'why-schools' && currentPath !== '/our-story' ? 'active' : ''}`}
                                onClick={(e) => {
                                    setDropdownOpen(false);
                                    handleSectionClick(e, 'why-schools');
                                }}
                            >
                                Features
                            </a>
                            <a
                                href="#products"
                                role="menuitem"
                                className={`dropdown-item ${activeSection === 'products' && currentPath !== '/our-story' ? 'active' : ''}`}
                                onClick={(e) => {
                                    setDropdownOpen(false);
                                    handleSectionClick(e, 'products');
                                }}
                            >
                                Products
                            </a>
                        </div>
                    </div>

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
