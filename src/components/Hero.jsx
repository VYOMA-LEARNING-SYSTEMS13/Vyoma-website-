import React, { useState, useEffect } from "react";
import { ChevronRight, Play, X, Cpu, Gamepad2, FlaskConical } from "lucide-react";
import "./hero-redesign.css";
import SolarSystemGLB from "./3d/SolarSystemGLB.jsx";
import MoleculeGLB from "./3d/MoleculeGLB.jsx";
import DnaHelixGLB from "./3d/DnaHelixGLB.jsx";
import AtomGLB from "./3d/AtomGLB.jsx";
import TrigonometryGLB from "./3d/TrigonometryGLB.jsx";
import CosineFunctionGLB from "./3d/CosineFunctionGLB.jsx";
import EarthGLB from "./3d/EarthGLB.jsx";

const FULL_TEXT = {
  line1: "Learning Beyond",
  line2: "the Limits of a",
  line3: "Classroom",
  dot: ".",
};
const TOTAL_CHARS = 40;

/* Floating glowing beads matching the reference image composition */
const PARTICLES = [
  /* Top right cyan bead near orbit curve */
  { top: "8%", left: "70%", size: 16, color: "#22d3ee", blur: 0, opacity: 0.9 },
  /* Right side purple bead below molecule */
  { top: "54%", left: "73%", size: 14, color: "#818cf8", blur: 1, opacity: 0.8 },
  /* Bottom center blurred purple orb */
  { top: "86%", left: "41%", size: 18, color: "#a855f7", blur: 2, opacity: 0.75 },
  /* Bottom left cyan bead near solar system */
  { top: "76%", left: "22%", size: 14, color: "#38bdf8", blur: 0, opacity: 0.9 },
  /* Lower bottom cyan bead */
  { top: "93%", left: "26%", size: 12, color: "#22d3ee", blur: 1, opacity: 0.85 },
  /* Upper left bead near DNA */
  { top: "37%", left: "8.5%", size: 12, color: "#38bdf8", blur: 0, opacity: 0.85 },
  /* Center subtle accents */
  { top: "45%", left: "19%", size: 10, color: "#6366f1", blur: 0, opacity: 0.7 },
  { top: "62%", left: "17%", size: 11, color: "#818cf8", blur: 1, opacity: 0.65 },
  { top: "80%", right: "17%", size: 13, color: "#38bdf8", blur: 0, opacity: 0.85 },
];

const FEATURES = [
  { label: "AI-Powered Learning", icon: <Cpu size={14} className="hero-feature-icon" /> },
  { label: "Immersive Technology", icon: <Gamepad2 size={14} className="hero-feature-icon" /> },
  { label: "Interactive STEM", icon: <FlaskConical size={14} className="hero-feature-icon" /> },
];

export default function Hero({ introFinished }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/hero_desktop.mp4");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (!isDeleting && charIndex < TOTAL_CHARS) {
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 55);
    } else if (!isDeleting && charIndex === TOTAL_CHARS) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 26);
    } else if (isDeleting && charIndex === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting]);

  const line1 = FULL_TEXT.line1.slice(0, Math.min(charIndex, 15));
  const line2 = charIndex > 15 ? FULL_TEXT.line2.slice(0, Math.min(charIndex - 15, 15)) : "";
  const line3Grad = charIndex > 30 ? FULL_TEXT.line3.slice(0, Math.min(charIndex - 30, 9)) : "";
  const line3Dot = charIndex >= 40 ? "." : "";
  const activeLine = charIndex <= 15 ? 1 : charIndex <= 30 ? 2 : 3;

  // Lock background scroll when video modal is open
  useEffect(() => {
    if (!isVideoModalOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVideoModalOpen]);

  const handleWatchDemoClick = (e) => {
    e.preventDefault();
    const isDesktop = window.innerWidth > 768;
    setVideoSrc(isDesktop ? "/hero_desktop.mp4" : "/hero_mobile.mp4");
    setIsVideoModalOpen(true);
  };

  return (
    <section id="home" className="hero-section">
      {/* ── Ambient Background Glows ── */}
      <div className="hero-glow hero-glow-heart" aria-hidden="true" />
      <div className="hero-glow hero-glow-sun" aria-hidden="true" />
      <div className="hero-glow hero-glow-earth" aria-hidden="true" />
      <div className="hero-glow hero-glow-molecule" aria-hidden="true" />
      <div className="hero-glow hero-glow-center" aria-hidden="true" />

      {/* ── Orbital Connector Lines (SVG) ── */}
      <svg
        className="hero-orbital-svg"
        viewBox="0 0 1600 900"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Upper right diagonal curve through molecule & beads down to earth */}
        <path
          d="M 1250,50 C 1180,180 1140,420 1380,720"
          stroke="rgba(99, 102, 241, 0.28)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <path
          d="M 1080,70 C 1200,280 1260,520 1480,820"
          stroke="rgba(34, 211, 238, 0.35)"
          strokeWidth="1.2"
        />
        {/* Left arc looping around heart from solar system */}
        <path
          d="M 120,850 C 60,650 90,380 260,250 C 360,180 420,280 340,440"
          stroke="rgba(168, 85, 247, 0.22)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {/* Soft horizontal connecting traverse */}
        <path
          d="M 280,360 C 580,240 1020,260 1340,380"
          stroke="rgba(199, 210, 254, 0.35)"
          strokeWidth="1"
        />
        <path
          d="M 240,740 C 600,680 1000,740 1320,620"
          stroke="rgba(199, 210, 254, 0.3)"
          strokeWidth="1"
        />
      </svg>

      {/* ── Floating Glowing Particles ── */}
      <div className="hero-particles-layer" aria-hidden="true">
        {PARTICLES.map((p, idx) => (
          <div
            key={idx}
            className="hero-particle-orb"
            style={{
              top: p.top,
              bottom: p.bottom,
              left: p.left,
              right: p.right,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, #ffffff 10%, ${p.color} 80%)`,
              boxShadow: `0 0 ${p.size * 1.6}px ${p.color}`,
              filter: p.blur ? `blur(${p.blur}px)` : "none",
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* ── Genuine 3D Scientific Renders Layer ── */}
      <div className="hero-3d-objects-layer" aria-hidden="true">
        {/* 1. DNA Double Helix (Top-Left) */}
        <div className="hero-obj hero-obj-dna">
          <DnaHelixGLB fallbackSrc="/images/hero_3d/dna_3d_enhanced.png" />
        </div>

        {/* 2. Anatomical Human Heart (Left-Center) */}
        <div className="hero-obj hero-obj-heart">
          <img
            src="/images/hero_3d/heart_3d_enhanced.png"
            alt="Human Heart 3D Model"
            loading="eager"
            className="hero-3d-img"
          />
        </div>

        {/* 3. Solar System with Sun & Planets (Bottom-Left) */}
        <div className="hero-obj hero-obj-solar">
          <SolarSystemGLB fallbackSrc="/images/hero_3d/solar_3d_enhanced.png" />
        </div>

        {/* 4. Molecule Ball-and-Stick (Top-Right) */}
        <div className="hero-obj hero-obj-molecule">
          <MoleculeGLB fallbackSrc="/images/hero_3d/molecule_3d_enhanced.png" />
        </div>

        {/* 5. 3D Atom Orbital Model (Right Top) */}
        <div className="hero-obj hero-obj-atom">
          <AtomGLB fallbackSrc="/images/hero_3d/atom_3d_enhanced.png" />
        </div>

        {/* 6. Trigonometry Mathematical Model (Right Center) */}
        <div className="hero-obj hero-obj-card">
          <TrigonometryGLB fallbackSrc="/images/hero_3d/card_3d_enhanced.png" />
        </div>

        {/* 7. Trigonometry Cosine Function Wave (Right Lower) */}
        <div className="hero-obj hero-obj-cosine">
          <CosineFunctionGLB fallbackSrc="/images/hero_3d/card_3d_enhanced.png" />
        </div>

        {/* 8. 3D Earth Globe with Atmosphere (Bottom-Right) */}
        <div className="hero-obj hero-obj-earth">
          <EarthGLB fallbackSrc="/images/hero_3d/earth_3d_enhanced.png" />
        </div>
      </div>

      {/* ── Central Hero Content ── */}
      <div className="container hero-container-center">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-pill-badge">
            AI + AR/VR + STEM
          </div>

          {/* Headline matching exact 3 lines with typewriter typography animation */}
          <h1
            className="hero-headline"
            aria-label="Learning Beyond the Limits of a Classroom."
          >
            <span className="hero-headline-line">
              {line1}
              {activeLine === 1 && <span className="hero-typewriter-cursor">|</span>}
            </span>
            <span className="hero-headline-line">
              {line2}
              {activeLine === 2 && <span className="hero-typewriter-cursor">|</span>}
            </span>
            <span className="hero-headline-line">
              <span className="hero-headline-gradient">{line3Grad}</span>
              <span className="hero-headline-dot">{line3Dot}</span>
              {activeLine === 3 && <span className="hero-typewriter-cursor">|</span>}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            Discover a smarter way to learn with AI tutors, immersive 3D experiences and interactive STEM simulations that turn complex concepts into unforgettable experiences.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <a href="#products" className="hero-btn-primary">
              <span>Explore the Platform</span>
              <ChevronRight size={17} strokeWidth={2.6} className="hero-btn-arrow" />
            </a>

            <a
              href="#demo"
              className="hero-btn-secondary"
              onClick={handleWatchDemoClick}
            >
              <span className="hero-play-icon-box">
                <Play size={11} fill="#4f46e5" stroke="#4f46e5" />
              </span>
              <span>Watch Demo</span>
            </a>
          </div>

          {/* Compact Feature Indicators Strip */}
          <div className="hero-features-strip">
            {FEATURES.map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="hero-feature-item">
                  <span className="hero-feature-icon-wrapper">{item.icon}</span>
                  <span className="hero-feature-text">{item.label}</span>
                </div>
                {i < FEATURES.length - 1 && (
                  <span className="hero-feature-separator" aria-hidden="true">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Video Modal ── */}
      {isVideoModalOpen && (
        <div
          className="video-modal-overlay"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Close video"
            >
              <X size={18} />
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