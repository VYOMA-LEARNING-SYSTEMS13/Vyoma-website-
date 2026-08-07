import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronRight } from 'lucide-react';
import MagicRings from './MagicRings';

export default function Hero({ introFinished }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [typedHtml, setTypedHtml] = useState(
        window.innerWidth <= 768
            ? 'Building the <span class="text-highlight">Future</span> of Learning.'
            : 'Building the <span class="text-highlight">Future</span><br />of Learning.'
    );
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoSrc, setVideoSrc] = useState('/hero_desktop.mp4');
    const heroContentRef = useRef(null);
    const timerRef = useRef(null);

    const handleWatchDemoClick = (e) => {
        e.preventDefault();
        const isDesktop = window.innerWidth > 768;
        setVideoSrc(isDesktop ? '/hero_desktop.mp4' : '/hero_mobile.mp4');
        setIsVideoModalOpen(true);
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const rawText = isMobile
            ? 'Building the <span class="text-highlight">Future</span> of Learning.'
            : 'Building the <span class="text-highlight">Future</span><br />of Learning.';

        // Parse HTML string into typewriter character states
        const getHtmlStates = (htmlString) => {
            const states = [];
            let idx = 0;
            const tokens = [];

            while (idx < htmlString.length) {
                if (htmlString[idx] === '<') {
                    const closingIdx = htmlString.indexOf('>', idx);
                    if (closingIdx !== -1) {
                        tokens.push({ type: 'tag', content: htmlString.substring(idx, closingIdx + 1) });
                        idx = closingIdx + 1;
                    } else {
                        tokens.push({ type: 'text', content: htmlString[idx] });
                        idx++;
                    }
                } else {
                    tokens.push({ type: 'text', content: htmlString[idx] });
                    idx++;
                }
            }

            let currentHtml = '';
            const openTags = [];
            states.push('');

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token.type === 'tag') {
                    currentHtml += token.content;
                    if (token.content.startsWith('</')) {
                        openTags.pop();
                    } else if (!token.content.endsWith('/>')) {
                        const match = token.content.match(/<([a-zA-Z0-9\-]+)/);
                        if (match) {
                            openTags.push(match[1]);
                        }
                    }
                } else {
                    currentHtml += token.content;
                }

                let stateWithClosedTags = currentHtml;
                for (let j = openTags.length - 1; j >= 0; j--) {
                    stateWithClosedTags += `</${openTags[j]}>`;
                }
                states.push(stateWithClosedTags);
            }

            // Filter unique states
            const uniqueStates = [];
            for (let i = 0; i < states.length; i++) {
                if (i === 0 || states[i] !== states[i - 1]) {
                    uniqueStates.push(states[i]);
                }
            }
            return uniqueStates;
        };

        const states = getHtmlStates(rawText);
        let currentIndex = 0;
        let isTyping = true;

        // Reset initial text so animation starts typing after load
        setTypedHtml('');

        const tick = () => {
            if (isTyping) {
                if (currentIndex < states.length - 1) {
                    currentIndex++;
                    setTypedHtml(states[currentIndex]);
                    timerRef.current = setTimeout(tick, 45); // Adjust typing speed slightly (45ms)
                } else {
                    isTyping = false;
                    timerRef.current = setTimeout(tick, 5000); // Hold typing display longer (5s)
                }
            } else {
                if (currentIndex > 0) {
                    currentIndex--;
                    setTypedHtml(states[currentIndex]);
                    timerRef.current = setTimeout(tick, 20); // Erase fast
                } else {
                    isTyping = true;
                    timerRef.current = setTimeout(tick, 800); // Pause before typing again
                }
            }
        };

        const startTypewriter = () => {
            timerRef.current = setTimeout(tick, 500);
        };

        let observer = null;
        if (introFinished !== false) {
            if (heroContentRef.current) {
                observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                observer.unobserve(heroContentRef.current);
                                startTypewriter();
                            }
                        });
                    },
                    { threshold: 0.1 }
                );
                observer.observe(heroContentRef.current);
            } else {
                startTypewriter();
            }
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (observer && heroContentRef.current) {
                observer.disconnect();
            }
        };
    }, [introFinished, isMobile]);

    return (
        <section id="home" className="hero-section">
            {/* SVG Animated Energy Ring Portal */}
            <div className="hero-svg-bg" aria-hidden="true">
                {!isMobile && (
                    <MagicRings
                        color="#fc42ff"
                        colorTwo="#42fcff"
                        ringCount={6}
                        speed={0.5}
                        attenuation={10}
                        lineThickness={2}
                        baseRadius={0.35}
                        radiusStep={0.1}
                        scaleRate={0.1}
                        opacity={0.8}
                        blur={0}
                        noiseAmount={0.03}
                        rotation={0}
                        ringGap={1.6}
                        fadeIn={0.7}
                        fadeOut={0.5}
                        followMouse={true}
                        mouseInfluence={0.2}
                        hoverScale={1.1}
                        parallax={0.05}
                        clickBurst={true}
                    />
                )}
            </div>

            <div className="container hero-container-center">
                <div className="hero-content" ref={heroContentRef}>
                    <div className="hero-badge">{isMobile ? 'Future-Ready Learning Hub' : 'THE FUTURE OF EDUCATION'}</div>
                    <h1 className="hero-title">
                        <span className="inline-block min-h-[1.2em]" style={{ minWidth: '100%' }}>
                            <span
                                id="hero-typewriter"
                                dangerouslySetInnerHTML={{ __html: typedHtml }}
                            />
                            <span className="typewriter-cursor">|</span>
                        </span>
                    </h1>
                    <p className="hero-subtitle">
                        {isMobile
                            ? 'Vyoma Learning Systems Pvt. Ltd. builds intelligent EdTech ecosystems that bridge classrooms and careers through AI and real-world engagements.'
                            : 'Empowering schools through AI, Spatial Computing, Immersive 3D Learning, and Personalized Education.'}
                    </p>
                    <div className="hero-actions">
                        <a href="#products" className="btn btn-primary btn-lg btn-explore">
                            <span>{isMobile ? 'Step into Our World' : 'Explore Platform'}</span>
                            <ChevronRight className="icon-chevron" size={16} />
                        </a>
                        <a href="#demo" className="btn btn-outline btn-lg btn-demo" onClick={handleWatchDemoClick}>
                            <span className="play-icon-circle-wrapper">
                                <Play className="icon-play-small" size={10} fill="#f97316" stroke="#f97316" />
                            </span>
                            <span>{isMobile ? 'Witness the future' : 'Watch Demo'}</span>
                        </a>
                    </div>

                </div>
            </div>

            {/* Video Modal Popup */}
            {isVideoModalOpen && (
                <div className="video-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="video-modal-close" onClick={() => setIsVideoModalOpen(false)} aria-label="Close video">
                            <X size={24} />
                        </button>
                        <div className="video-player-wrapper">
                            <video
                                src={videoSrc}
                                controls
                                autoPlay
                                playsInline
                                className="video-player-element"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
