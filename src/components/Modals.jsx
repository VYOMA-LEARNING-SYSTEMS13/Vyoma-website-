import React, { useEffect } from 'react';

export default function Modals({ activeModal, onClose }) {
    // Prevent background scrolling when modal is active
    useEffect(() => {
        if (activeModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [activeModal]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (activeModal) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeModal, onClose]);

    if (!activeModal) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('product-modal-overlay')) {
            onClose();
        }
    };

    return (
        <>
            {/* 1. NOVA MODAL */}
            {activeModal === 'nova' && (
                <div className="product-modal-overlay active" onClick={handleOverlayClick}>
                    <div className="product-modal-container">
                        <button className="product-modal-close" onClick={onClose} aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="product-modal-header purple">
                            <div className="product-modal-logo-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                            </div>
                            <div className="product-modal-title-area">
                                <h2>NOVA</h2>
                                <p className="product-modal-subtitle">The Future of Learning for Class 9 & 10 🚀</p>
                            </div>
                        </div>

                        <div className="product-modal-body">
                            <div className="product-modal-intro purple">
                                <h4>Quick Introduction</h4>
                                <p>Nova is a foundational learning platform designed exclusively for Class 9 and 10 students. It combines
                                    immersive 3D models, interactive quizzes, and deep performance analysis to make complex concepts simple,
                                    engaging, and future-ready.</p>
                            </div>

                            <div className="product-modal-grid">
                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="6"></circle>
                                            <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        <h3>Why Nova?</h3>
                                    </div>
                                    <ul className="product-modal-features-list">
                                        <li>
                                            <strong>Conceptual Clarity:</strong>
                                            <span>Visualize tough topics with interactive 3D models that bring textbooks to life.</span>
                                        </li>
                                        <li>
                                            <strong>Curiosity Driven:</strong>
                                            <span>Explore beyond rote learning with simulations that spark curiosity and deeper
                                                understanding.</span>
                                        </li>
                                        <li>
                                            <strong>Academic Readiness:</strong>
                                            <span>Strengthen foundations for board exams and beyond with structured, adaptive learning.</span>
                                        </li>
                                        <li>
                                            <strong>Performance Insights:</strong>
                                            <span>Detailed analysis helps students track progress, identify gaps, and improve effectively.</span>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        <h3>Who Is It For?</h3>
                                    </div>
                                    <ul className="product-modal-features-list for-who">
                                        <li>
                                            <span className="bullet-dot purple"></span>
                                            <div>
                                                <strong>Students (Class 9 & 10):</strong>
                                                <span>Build strong foundations and prepare for exams with confidence.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot purple"></span>
                                            <div>
                                                <strong>Teachers:</strong>
                                                <span>Use Nova as a teaching aid to explain complex concepts visually.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot purple"></span>
                                            <div>
                                                <strong>Parents:</strong>
                                                <span>Ensure your child learns effectively with measurable outcomes.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2">
                                            </path>
                                        </svg>
                                        <h3>Key Features</h3>
                                    </div>
                                    <ul className="product-modal-features-list key">
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Immersive 3D Models:</strong>
                                                <span>Physics, Chemistry, Biology, and Math concepts explained visually.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Interactive Quizzes:</strong>
                                                <span>Test knowledge instantly with gamified assessments.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Smart Analytics:</strong>
                                                <span>Personalized reports that highlight strengths and areas for improvement.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Engaging Interface:</strong>
                                                <span>A modern, student-friendly design that makes learning enjoyable.</span>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M3 3v18h18"></path>
                                            <path d="m19 9-5 5-4-4-3 3"></path>
                                        </svg>
                                        <h3>Advantages</h3>
                                    </div>
                                    <ul className="product-modal-features-list advantages">
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>From Foundations to Futures:</strong>
                                                <span>Covers the entire learning journey from school readiness to career pathways.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>Interactive & Visual:</strong>
                                                <span>Moves beyond traditional learning with immersive experiences.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>Data-Driven Growth:</strong>
                                                <span>Every quiz and activity feeds into smart analytics for continuous improvement.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. CURIO MODAL */}
            {activeModal === 'curio' && (
                <div className="product-modal-overlay active" onClick={handleOverlayClick}>
                    <div className="product-modal-container">
                        <button className="product-modal-close" onClick={onClose} aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="product-modal-header blue">
                            <div className="product-modal-logo-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                    <polyline points="2 17 12 22 22 17"></polyline>
                                    <polyline points="2 12 12 17 22 12"></polyline>
                                </svg>
                            </div>
                            <div className="product-modal-title-area">
                                <div className="product-modal-title-row">
                                    <h2>CURIO</h2>
                                    <a href="https://www.curioteach.com/" target="_blank" rel="noopener noreferrer"
                                        className="btn btn-visit-platform">
                                        <span>Visit Platform</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </a>
                                </div>
                                <p className="product-modal-subtitle">Advanced Science Learning for Class 11 & 12 🔬</p>
                            </div>
                        </div>

                        <div className="product-modal-body">
                            <div className="product-modal-intro blue">
                                <h4>Quick Introduction</h4>
                                <p>Curio is a specialized learning platform crafted for Class 11 and 12 science students. It blends immersive
                                    3D models, interactive quizzes, and in-depth performance analysis to simplify complex scientific concepts
                                    and prepare learners for competitive exams and higher studies.</p>
                            </div>

                            <div className="product-modal-grid">
                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="6"></circle>
                                            <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        <h3>Why Curio?</h3>
                                    </div>
                                    <ul className="product-modal-features-list">
                                        <li>
                                            <strong>Conceptual Depth:</strong>
                                            <span>Break down advanced Physics, Chemistry, Biology, and Math topics with clear, visual
                                                explanations.</span>
                                        </li>
                                        <li>
                                            <strong>Curiosity Unleashed:</strong>
                                            <span>Explore science beyond textbooks through interactive 3D simulations and experiments.</span>
                                        </li>
                                        <li>
                                            <strong>Exam Readiness:</strong>
                                            <span>Strengthen preparation for board exams, NEET, JEE, and other competitive tests.</span>
                                        </li>
                                        <li>
                                            <strong>Analytical Insights:</strong>
                                            <span>Smart reports highlight strengths, weaknesses, and progress for targeted improvement.</span>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        <h3>Who Is It For?</h3>
                                    </div>
                                    <ul className="product-modal-features-list for-who">
                                        <li>
                                            <span className="bullet-dot blue"></span>
                                            <div>
                                                <strong>Students (Class 11 & 12 Science):</strong>
                                                <span>Build mastery in core subjects and prepare for competitive exams.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot blue"></span>
                                            <div>
                                                <strong>Teachers:</strong>
                                                <span>Use Curio as a teaching aid to explain advanced concepts visually.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot blue"></span>
                                            <div>
                                                <strong>Parents:</strong>
                                                <span>Ensure effective learning outcomes with measurable progress tracking.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2">
                                            </path>
                                        </svg>
                                        <h3>Key Features</h3>
                                    </div>
                                    <ul className="product-modal-features-list key">
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Immersive 3D Science Models:</strong>
                                                <span>Visualize molecules, reactions, anatomy, and physics phenomena in detail.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Interactive Quizzes:</strong>
                                                <span>Reinforce learning with adaptive assessments aligned to exam patterns.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Performance Analytics:</strong>
                                                <span>Track readiness with detailed dashboards and personalized recommendations.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot orange"></span>
                                            <div>
                                                <strong>Engaging Interface:</strong>
                                                <span>A sleek, student-friendly design that makes advanced science approachable.</span>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="title-svg">
                                            <path d="M3 3v18h18"></path>
                                            <path d="m19 9-5 5-4-4-3 3"></path>
                                        </svg>
                                        <h3>The Curio Advantage</h3>
                                    </div>
                                    <ul className="product-modal-features-list advantages">
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>From Concepts to Careers:</strong>
                                                <span>Bridges school learning with competitive exam readiness.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>Immersive & Interactive:</strong>
                                                <span>Moves beyond rote memorization with hands-on 3D experiences.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot green"></span>
                                            <div>
                                                <strong>Data-Driven Success:</strong>
                                                <span>Every quiz and activity feeds into analytics for smarter preparation.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Subscription Plans */}
                            <div className="product-subscription-section">
                                <div className="subscription-section-header">
                                    <h3>SUBSCRIPTION PLAN</h3>
                                </div>

                                <div className="subscription-plans-grid">
                                    {/* Plan 1 */}
                                    <div className="subscription-plan-card">
                                        <div className="plan-card-top">
                                            <h4>BASIC</h4>
                                            <div className="plan-price-badge">Rs.69/Month</div>
                                        </div>
                                        <ul className="plan-features-list">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> 3D/AR Models
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Topic Quiz
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Basic Analysis
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Technical Support
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Plan 2 */}
                                    <div className="subscription-plan-card featured">
                                        <div className="plan-card-top">
                                            <h4>STANDARD</h4>
                                            <div className="plan-price-badge">Rs.149/Month</div>
                                        </div>
                                        <ul className="plan-features-list">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> 3D/AR Models
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Topic Quiz
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Test Quiz
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> AI Chat Bot
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Student Analysis Dashboard
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Technical Support
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Plan 3 */}
                                    <div className="subscription-plan-card">
                                        <div className="plan-card-top">
                                            <h4>PRO</h4>
                                            <div className="plan-price-badge">Rs.299/Month</div>
                                        </div>
                                        <ul className="plan-features-list">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> 3D/AR Models
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Topic/Test Quiz
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> AI Voice Assistant
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> AI Chat Bot
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Advance Analysis Student Dashboard
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg> Technical Support
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. VIBE MODAL */}
            {activeModal === 'vibe' && (
                <div className="product-modal-overlay active" onClick={handleOverlayClick}>
                    <div className="product-modal-container">
                        <button className="product-modal-close" onClick={onClose} aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="product-modal-header orange">
                            <div className="product-modal-logo-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                            <div className="product-modal-title-area">
                                <h2>VIBE</h2>
                                <p className="product-modal-subtitle">Connecting Students and Startups Through Internships 💼</p>
                            </div>
                        </div>

                        <div className="product-modal-body">
                            <div className="product-modal-intro orange">
                                <h4>Quick Introduction</h4>
                                <p>Vibe is an internship provider platform designed to bridge the gap between students and the industry. It
                                    connects Class 11, 12, and beyond learners with SMEs and startups, offering real-world experience while
                                    giving businesses access to fresh talent quickly and efficiently.</p>
                            </div>

                            <div className="product-modal-grid">
                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="title-svg">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="6"></circle>
                                            <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        <h3>Why Vibe?</h3>
                                    </div>
                                    <ul className="product-modal-features-list">
                                        <li>
                                            <strong>For Students:</strong>
                                            <span>Gain hands-on exposure, build skills, and prepare for future careers.</span>
                                        </li>
                                        <li>
                                            <strong>For Industry:</strong>
                                            <span>Access a pool of motivated interns to support growth and innovation.</span>
                                        </li>
                                        <li>
                                            <strong>For Startups & SMEs:</strong>
                                            <span>Simplify hiring with a platform that matches interns to your needs.</span>
                                        </li>
                                        <li>
                                            <strong>For Education:</strong>
                                            <span>Extend learning beyond classrooms into practical, industry-ready experiences.</span>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="title-svg">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        <h3>Who Is It For?</h3>
                                    </div>
                                    <ul className="product-modal-features-list for-who">
                                        <li>
                                            <span className="bullet-dot orange"></span>
                                            <div>
                                                <strong>Students:</strong>
                                                <span>Looking to gain practical experience and boost employability.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot orange"></span>
                                            <div>
                                                <strong>Startups & SMEs:</strong>
                                                <span>Seeking interns to support projects, innovation, and growth.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="bullet-dot orange"></span>
                                            <div>
                                                <strong>Educational Institutions:</strong>
                                                <span>Partnering to provide students with industry exposure.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="product-modal-col">
                                    <div className="product-modal-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="title-svg">
                                            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2">
                                            </path>
                                        </svg>
                                        <h3>Key Features</h3>
                                    </div>
                                    <ul className="product-modal-features-list key">
                                        <li>
                                            <span className="accent-dot blue"></span>
                                            <div>
                                                <strong>Internship Matching:</strong>
                                                <span>Smart algorithms connect students with relevant opportunities in SMEs and startups.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot blue"></span>
                                            <div>
                                                <strong>Skill Development:</strong>
                                                <span>Students gain practical knowledge aligned with their academic background.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot blue"></span>
                                            <div>
                                                <strong>Industry Access:</strong>
                                                <span>Businesses can easily post, manage, and select interns.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot blue"></span>
                                            <div>
                                                <strong>Analytics & Tracking:</strong>
                                                <span>Monitor student performance and internship outcomes with detailed insights.</span>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="product-modal-section-title mt-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="title-svg">
                                            <path d="M3 3v18h18"></path>
                                            <path d="m19 9-5 5-4-4-3 3"></path>
                                        </svg>
                                        <h3>The Vibe Advantage</h3>
                                    </div>
                                    <ul className="product-modal-features-list advantages">
                                        <li>
                                            <span className="accent-dot purple"></span>
                                            <div>
                                                <strong>Bridging Education & Industry:</strong>
                                                <span>Connects academic learning with real-world application.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot purple"></span>
                                            <div>
                                                <strong>Easy Access for SMEs:</strong>
                                                <span>Simplifies the process of finding and onboarding interns.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot purple"></span>
                                            <div>
                                                <strong>Empowering Students:</strong>
                                                <span>Builds confidence, skills, and career readiness.</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="accent-dot purple"></span>
                                            <div>
                                                <strong>Fueling Startups:</strong>
                                                <span>Provides fresh talent to drive innovation and productivity.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
