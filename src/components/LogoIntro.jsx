import React, { useState, useEffect } from 'react';

const logoImg = "/vyoma final logo.png";

export default function LogoIntro({ onFinished }) {
    const [status, setStatus] = useState('visible'); // 'visible', 'fading', 'hidden'

    useEffect(() => {
        // 800ms active intro screen
        const fadeTimer = setTimeout(() => {
            setStatus('fading');
        }, 800);

        // 400ms fade transition (1200ms total)
        const hideTimer = setTimeout(() => {
            setStatus('hidden');
            if (onFinished) onFinished();
        }, 1200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [onFinished]);

    if (status === 'hidden') return null;

    return (
        <div
            id="logo-intro"
            className={`logo-intro-overlay ${status === 'fading' ? 'fade-out' : ''}`}
        >
            <img src={logoImg} alt="Vyoma Logo" className="intro-logo-img" />
        </div>
    );
}
