import React from 'react';
import { Brain, GraduationCap, Rocket, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function ScrollAnimatedContainer({ children, className }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
        >
            {children}
        </motion.div>
    );
}

export default function OurStory() {
    return (
        <section className="our-story-page">
            {/* Section 1: What We Do */}
            <ScrollAnimatedContainer className="story-section bg-white">
                <div className="container story-grid">
                    {/* Left Column: What We Do Text and Features */}
                    <div className="story-content-left">
                        <div className="story-badge-header">
                            <span className="story-mini-title">WHAT WE DO</span>
                        </div>
                        <h2 className="story-main-title">What We Do</h2>
                        <p className="story-intro-desc">
                            We're building an intelligent learning ecosystem that makes education more immersive, engaging, and effective for every learner.
                        </p>
                        <p className="story-intro-desc sec-paragraph">
                            By combining AI, immersive technologies, and interactive experiences, we help students understand complex concepts better and prepare them for a future full of possibilities.
                        </p>

                        {/* 2x2 Detailed Feature Grid */}
                        <div className="story-features-grid">
                            <div className="story-feature-item">
                                <div className="story-feature-icon-wrapper circle-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-cpu">
                                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                        <rect x="9" y="9" width="6" height="6"></rect>
                                        <line x1="9" y1="1" x2="9" y2="4"></line>
                                        <line x1="15" y1="1" x2="15" y2="4"></line>
                                        <line x1="9" y1="20" x2="9" y2="23"></line>
                                        <line x1="15" y1="20" x2="15" y2="23"></line>
                                        <line x1="20" y1="9" x2="23" y2="9"></line>
                                        <line x1="20" y1="15" x2="23" y2="15"></line>
                                        <line x1="1" y1="9" x2="4" y2="9"></line>
                                        <line x1="1" y1="15" x2="4" y2="15"></line>
                                        <text x="12" y="13.5" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">AI</text>
                                    </svg>
                                </div>
                                <div className="story-feature-text">
                                    <h4>AI-Powered Learning</h4>
                                    <p>Personalized learning that adapts to every student's pace, style, and strengths.</p>
                                </div>
                            </div>

                            <div className="story-feature-item">
                                <div className="story-feature-icon-wrapper circle-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-vr">
                                        <path d="M2 10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a3 3 0 0 1-3 3h-3.2a2 2 0 0 0-1.6.8l-.8 1a1 1 0 0 1-1.6 0l-.8-1a2 2 0 0 0-1.6-.8H5a3 3 0 0 1-3-3v-5z"></path>
                                        <path d="M8 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                        <path d="M16 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                        <path d="M12 8v2"></path>
                                    </svg>
                                </div>
                                <div className="story-feature-text">
                                    <h4>Immersive AR/VR</h4>
                                    <p>Interactive 3D experiences and simulations that bring abstract concepts to life.</p>
                                </div>
                            </div>

                            <div className="story-feature-item">
                                <div className="story-feature-icon-wrapper circle-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-atom">
                                        <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)"></ellipse>
                                        <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)"></ellipse>
                                        <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
                                    </svg>
                                </div>
                                <div className="story-feature-text">
                                    <h4>Interactive STEM</h4>
                                    <p>Connecting Science, Technology, Engineering, and Mathematics through experiential learning.</p>
                                </div>
                            </div>

                            <div className="story-feature-item">
                                <div className="story-feature-icon-wrapper circle-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-gamepad">
                                        <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                                        <path d="M6 12h4m-2-2v4"></path>
                                        <circle cx="15.5" cy="10.5" r="1" fill="currentColor"></circle>
                                        <circle cx="15.5" cy="13.5" r="1" fill="currentColor"></circle>
                                        <circle cx="18.5" cy="12" r="1" fill="currentColor"></circle>
                                    </svg>
                                </div>
                                <div className="story-feature-text">
                                    <h4>Gamified Learning</h4>
                                    <p>Engaging challenges and activities that encourage curiosity, motivation, and problem-solving.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Image */}
                    <div className="story-image-side">
                        <div className="story-img-wrapper shadow-premium">
                            <img
                                src="/images/story/what_we_do.png"
                                alt="Team collaborating around smart whiteboard display showing analytics"
                                className="story-img"
                                onError={(e) => {
                                    // Soft fallback styling if file isn't uploaded yet
                                    e.target.style.display = 'none';
                                    e.target.parentNode.classList.add('img-fallback-active');
                                }}
                            />
                            <div className="img-fallback-message">
                                <span>Image Placeholder: what_we_do.png</span>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollAnimatedContainer>

            {/* Section 2: Who We Are */}
            <ScrollAnimatedContainer className="story-section bg-light-translucent border-section-divider">
                <div className="container">
                    {/* Top Row: Image + Text Side-by-Side */}
                    <div className="story-grid reverse-mobile align-start">
                        {/* Left Column: Image */}
                        <div className="story-image-side">
                            <div className="story-img-wrapper shadow-premium">
                                <img
                                    src="/images/story/who_we_are.png"
                                    alt="Vyoma team collaborating in open office space"
                                    className="story-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.classList.add('img-fallback-active');
                                    }}
                                />
                                <div className="img-fallback-message">
                                    <span>Image Placeholder: who_we_are.png</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Who We Are Text */}
                        <div className="story-content-right">
                            <div className="story-badge-header">
                                <span className="story-mini-title">WHO WE ARE</span>
                            </div>
                            <h2 className="story-main-title">Who We Are</h2>
                            <p className="story-intro-desc mb-paragraphs">
                                We are a team of educators, engineers, designers, and innovators passionate about transforming education through technology.
                            </p>
                            <p className="story-intro-desc mb-paragraphs">
                                At the heart of our mission is <strong>CURIO.AI</strong>, our flagship platform that delivers AI-powered, AR/VR-enabled learning experiences for schools and institutions.
                            </p>
                            <p className="story-intro-desc mb-paragraphs">
                                Alongside CURIO.AI, we are developing two additional platforms that will expand opportunities for learners and connect them with the real world.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Row: 3 horizontal platforms */}
                    <div className="story-horizontal-platforms">
                        <div className="platform-card-item">
                            <div className="platform-bullet bullet-curio">
                                <img src="/images/story/product-curio.png" alt="Curio Logo" className="platform-logo-bullet" />
                            </div>
                            <div className="platform-card-details">
                                <h4>CURIO.AI</h4>
                                <p>
                                    Our flagship AI-powered immersive learning platform that enables students to understand complex concepts through interactive 3D experiences, spatial learning, and intelligent analytics.
                                </p>
                            </div>
                        </div>

                        <div className="platform-card-item">
                            <div className="platform-bullet bullet-nova">
                                <img src="/images/story/product-nova.png" alt="Nova Logo" className="platform-logo-bullet" />
                            </div>
                            <div className="platform-card-details">
                                <h4>NOVA <span className="sub-tag">(Under Development)</span></h4>
                                <p>
                                    A foundational learning platform designed for students of Classes 9 and 10, focused on strengthening conceptual understanding through visual learning, adaptive practice, and personalized progress tracking.
                                </p>
                            </div>
                        </div>

                        <div className="platform-card-item">
                            <div className="platform-bullet bullet-vibe">
                                <img src="/images/story/product-vibe.png" alt="Vibe Logo" className="platform-logo-bullet" />
                            </div>
                            <div className="platform-card-details">
                                <h4>VIBE <span className="sub-tag">(Under Development)</span></h4>
                                <p>
                                    An internship and industry-connect platform that bridges students with startups and SMEs, helping learners gain practical experience while supporting organizations with emerging talent.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Concluding text */}
                    <div className="story-concluding-note text-center">
                        Together, <strong>CURIO.AI</strong>, <strong>NOVA</strong>, and <strong>VIBE</strong> form the Vyoma ecosystem—supporting learners from the classroom to successful careers.
                    </div>
                </div>
            </ScrollAnimatedContainer>

            {/* Section 3: Join Our Team (Card Container) */}
            <ScrollAnimatedContainer className="story-section bg-white story-join-section">
                <div className="container">
                    <div className="story-join-card shadow-premium">
                        <div className="story-badge-header centered">
                            <span className="story-mini-title dark-overlay">JOIN OUR TEAM</span>
                        </div>
                        <h2 className="story-main-title card-title">Help Shape the Future of Education</h2>
                        <p className="story-join-desc text-center">
                            We're always looking for curious minds, creative thinkers, and passionate problem-solvers who want to make a real impact through education and technology.
                        </p>

                        <div className="story-btn-wrapper text-center">
                            <a
                                href="https://careers.curioteach.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-join-our-team"
                                style={{ textDecoration: 'none' }}
                            >
                                <Users size={18} /> Join Our Team
                            </a>
                        </div>

                        <div className="story-join-tags">
                            <span>Innovation</span>
                            <span className="tag-dot">•</span>
                            <span>Collaboration</span>
                            <span className="tag-dot">•</span>
                            <span>Continuous Learning</span>
                            <span className="tag-dot">•</span>
                            <span>Impact</span>
                        </div>
                    </div>
                </div>
            </ScrollAnimatedContainer>

            {/* Section 4: Life At Vyoma (Photo Gallery) */}
            <ScrollAnimatedContainer className="story-section bg-light-translucent border-section-divider story-life-section">
                <div className="container text-center">
                    <div className="story-badge-header">
                        <span className="story-mini-title">LIFE AT VYOMA</span>
                    </div>
                    <h2 className="story-main-title gallery-title">Where Passion Meets Purpose</h2>

                    {/* 4-Column Gallery Grid */}
                    <div className="story-gallery-grid">
                        {[1, 2, 3, 4].map((num) => (
                            <div className="story-gallery-item shadow-premium" key={num}>
                                <img
                                    src={`/images/story/life_${num}.png`}
                                    alt={`Life at Vyoma photo detail ${num}`}
                                    className="story-gallery-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.classList.add('img-fallback-active');
                                    }}
                                />
                                <div className="img-fallback-message">
                                    <span>life_{num}.png</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollAnimatedContainer>
        </section>
    );
}
