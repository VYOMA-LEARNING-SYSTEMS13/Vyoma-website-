import React from 'react';
import { Globe, Target, Check } from 'lucide-react';

export default function Vision() {
    return (
        <section id="vision" className="vision-section">
            {/* Decorative background elements */}
            <div className="vision-decor-dots"></div>
            <div className="vision-decor-circles"></div>

            <div className="container text-center section-header">
                <div className="badge-foundation">OUR FOUNDATION</div>
                <h2 className="section-title">
                    Our <span className="text-vision">Vision</span> & <span className="text-mission">Mission</span>
                </h2>
                <p className="section-subtitle">
                    Guided by purpose, driven by impact. Here's what we strive to achieve today for a better tomorrow.
                </p>
            </div>

            <div className="container vision-grid">
                {/* Left Card: Vision */}
                <div className="vision-card left-card">
                    <div className="card-icon-container blue-theme">
                        <div className="icon-outer-ring">
                            <div className="icon-middle-ring">
                                <div className="icon-inner-circle">
                                    <Globe size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-text-block">
                        <h3>Our Vision</h3>
                        <div className="title-bar blue-bar"></div>
                        <p className="vision-intro-text">
                            To build a world where every learner can:
                        </p>
                        <ul className="vision-list">
                            <li className="vision-list-item">
                                <div className="vision-item-icon-wrapper">
                                    <Check size={16} className="vision-item-icon" />
                                </div>
                                <span className="vision-item-text">
                                    Understand, explore, and create without limits.
                                </span>
                            </li>
                            <li className="vision-list-item">
                                <div className="vision-item-icon-wrapper">
                                    <Check size={16} className="vision-item-icon" />
                                </div>
                                <span className="vision-item-text">
                                    Experience interactive and personalized learning through technology.
                                </span>
                            </li>
                            <li className="vision-list-item">
                                <div className="vision-item-icon-wrapper">
                                    <Check size={16} className="vision-item-icon" />
                                </div>
                                <span className="vision-item-text">
                                    Develop scientific curiosity, creativity, and innovation.
                                </span>
                            </li>
                            <li className="vision-list-item">
                                <div className="vision-item-icon-wrapper">
                                    <Check size={16} className="vision-item-icon" />
                                </div>
                                <span className="vision-item-text">
                                    Use immersive technologies to make complex concepts easier to understand.
                                </span>
                            </li>
                            <li className="vision-list-item">
                                <div className="vision-item-icon-wrapper">
                                    <Check size={16} className="vision-item-icon" />
                                </div>
                                <span className="vision-item-text">
                                    Become empowered to solve real-world challenges and shape the future.
                                </span>
                            </li>
                        </ul>
                    </div>
                    {/* Mountain SVG illustration decors */}
                    <svg className="card-bg-illust vision-bg-illust" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
                                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                            </linearGradient>
                        </defs>
                        <path d="M70,90 Q73,86 76,90 Q79,86 82,90" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
                        <path d="M95,105 Q98,101 101,105 Q104,101 107,105" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
                        <polygon points="30,180 90,110 150,180" fill="url(#blue-grad)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="80,180 160,82 240,180" fill="url(#blue-grad)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" strokeLinejoin="round" />
                        <line x1="160" y1="82" x2="160" y2="52" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" />
                        <path d="M160,52 L178,59 L160,66 Z" fill="rgba(59, 130, 246, 0.8)" />
                    </svg>
                </div>

                {/* Right Card: Mission */}
                <div className="vision-card right-card">
                    <div className="card-icon-container orange-theme">
                        <div className="icon-outer-ring">
                            <div className="icon-middle-ring">
                                <div className="icon-inner-circle">
                                    <Target size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-text-block">
                        <h3>Our Mission</h3>
                        <div className="title-bar orange-bar"></div>
                        <p className="mission-intro-text">
                            To redefine education through technology and innovation by:
                        </p>

                        <ul className="mission-list">
                            <li className="mission-list-item">
                                <div className="mission-item-icon-wrapper">
                                    <Check size={16} className="mission-item-icon" />
                                </div>
                                <span className="mission-item-text">
                                    Developing AI-powered and immersive platforms for engaging learning.
                                </span>
                            </li>
                            <li className="mission-list-item">
                                <div className="mission-item-icon-wrapper">
                                    <Check size={16} className="mission-item-icon" />
                                </div>
                                <span className="mission-item-text">
                                    Bridging theoretical knowledge and practical understanding through interactive technologies.
                                </span>
                            </li>
                            <li className="mission-list-item">
                                <div className="mission-item-icon-wrapper">
                                    <Check size={16} className="mission-item-icon" />
                                </div>
                                <span className="mission-item-text">
                                    Empowering students, educators, and institutions with next-generation tools.
                                </span>
                            </li>
                            <li className="mission-list-item">
                                <div className="mission-item-icon-wrapper">
                                    <Check size={16} className="mission-item-icon" />
                                </div>
                                <span className="mission-item-text">
                                    Building a collaborative ecosystem connecting education, research, and innovation.
                                </span>
                            </li>
                            <li className="mission-list-item">
                                <div className="mission-item-icon-wrapper">
                                    <Check size={16} className="mission-item-icon" />
                                </div>
                                <span className="mission-item-text">
                                    Investing in AI, AR/VR, robotics, and space technologies to accelerate progress.
                                </span>
                            </li>
                        </ul>
                    </div>
                    {/* Rocket SVG illustration decors */}
                    <svg className="card-bg-illust mission-bg-illust" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="orange-grad-body" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.2)" />
                                <stop offset="100%" stopColor="rgba(249, 115, 22, 0.02)" />
                            </linearGradient>
                        </defs>
                        <path d="M165,22 L167,24 L169,24 L168,26 L169,28 L166,27 L163,28 L164,26 L163,24 L165,24 Z" fill="rgba(249, 115, 22, 0.4)" />
                        <path d="M190,55 L191,57 L193,57 L192,59 L193,61 L190,60 L187,61 L188,59 L187,57 L189,57 Z" fill="rgba(249, 115, 22, 0.4)" />
                        <path d="M220,38 L221,40 L223,40 L222,42 L223,44 L220,43 L217,44 L218,42 L217,40 L219,40 Z" fill="rgba(249, 115, 22, 0.3)" />
                        <path d="M130,180 C125,172 132,160 145,160 C153,160 160,168 157,180" fill="none" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1.5" />
                        <path d="M148,180 C142,165 155,147 172,147 C185,147 193,163 185,180" fill="none" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" />
                        <path d="M172,180 C167,175 175,168 183,168 C188,168 192,174 190,180" fill="none" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1.5" />
                        <g transform="translate(182, 105) rotate(45)">
                            <path d="M-10,18 L-18,28 L-10,28 Z" fill="url(#orange-grad-body)" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M10,18 L18,28 L10,28 Z" fill="url(#orange-grad-body)" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M0,-25 C10,-12 10,18 10,18 L-10,18 C-10,18 -10,-12 0,-25 Z" fill="url(#orange-grad-body)" stroke="rgba(249, 115, 22, 0.8)" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M-5,20 L0,30 L5,20 Z" fill="rgba(249, 115, 22, 0.8)" />
                            <circle cx="0" cy="-2" r="4.5" fill="none" stroke="rgba(249, 115, 22, 0.8)" strokeWidth="1.5" />
                        </g>
                    </svg>
                </div>
            </div>

            <div className="container vision-conclusion-wrapper">
                <div className="mission-conclusion-box">
                    <p className="mission-conclusion-text">
                        We believe education should not only teach knowledge but also ignite imagination, innovation, and the confidence to build a better future.
                    </p>
                </div>
            </div>
        </section>
    );
}
