import React, { useState, useEffect } from 'react';
import LogoIntro from './components/LogoIntro.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Vision from './components/Vision.jsx';
import Platform from './components/Platform.jsx';
import Features from './components/Features.jsx';
import Products from './components/Products.jsx';
import Experience from './components/Experience.jsx';
import Team from './components/Team.jsx';
import Partners from './components/Partners.jsx';
import FAQ from './components/FAQ.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Modals from './components/Modals.jsx';
import OurStory from './components/OurStory.jsx';

export default function App() {
    const [introFinished, setIntroFinished] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // Initialize intro-active body class at load
    useEffect(() => {
        document.body.classList.add('intro-active');
        return () => {
            document.body.classList.remove('intro-active');
        };
    }, []);

    // Listen to popstate event for back/forward navigation
    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const handleIntroFinished = () => {
        document.body.classList.remove('intro-active');
        setIntroFinished(true);
    };

    const navigateTo = (path) => {
        window.history.pushState({}, '', path);
        const pathname = path.split('#')[0] || '/';
        setCurrentPath(pathname);
        if (!path.includes('#')) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    // Global listener to redirect hash link clicks (like #vision) from /our-story to the home page anchors
    useEffect(() => {
        const handleGlobalHashClick = (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (href && href.startsWith('#')) {
                const normalizedPath = currentPath.replace(/\/$/, '') || '/';
                if (normalizedPath === '/our-story') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    navigateTo('/#' + targetId);
                }
            }
        };
        document.addEventListener('click', handleGlobalHashClick);
        return () => document.removeEventListener('click', handleGlobalHashClick);
    }, [currentPath]);

    // Handle auto-scroll to hash when landing on home page from another route
    useEffect(() => {
        const normalizedPath = currentPath.replace(/\/$/, '') || '/';
        if (normalizedPath === '/') {
            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.substring(1);
                const scrollToTarget = () => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        return true;
                    }
                    return false;
                };

                // Attempt scrolling immediately, and then retry with minor timeouts to handle React's dynamic mount latency
                if (!scrollToTarget()) {
                    const t1 = setTimeout(scrollToTarget, 80);
                    const t2 = setTimeout(scrollToTarget, 200);
                    const t3 = setTimeout(scrollToTarget, 450);
                    return () => {
                        clearTimeout(t1);
                        clearTimeout(t2);
                        clearTimeout(t3);
                    };
                }
            }
        }
    }, [currentPath]);

    const normalizedPath = currentPath.replace(/\/$/, '') || '/';
    const isOurStory = normalizedPath === '/our-story';

    return (
        <>
            <LogoIntro onFinished={handleIntroFinished} />
            <Header currentPath={currentPath} navigateTo={navigateTo} />
            <main>
                {isOurStory ? (
                    <OurStory />
                ) : (
                    <>
                        <Hero introFinished={introFinished} />
                        <Vision />
                        <Platform />
                        <Features />
                        <Products onOpenModal={setActiveModal} />
                        <Experience />
                        <Team />
                        <Partners />
                        <FAQ />
                        <Contact />
                    </>
                )}
            </main>
            {!isOurStory && <Footer />}
            <Modals activeModal={activeModal} onClose={() => setActiveModal(null)} />
        </>
    );
}
