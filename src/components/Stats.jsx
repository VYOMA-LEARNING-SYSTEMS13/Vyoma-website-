import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 1500, suffix = "", startTrigger = false }) => {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!startTrigger || hasAnimated.current) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                hasAnimated.current = true;
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, startTrigger]);

    return <h3>{count}{suffix}</h3>;
};

export default function Stats() {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    const statsData = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <circle cx="9" cy="7" r="4" />
                </svg>
            ),
            target: 10,
            suffix: 'K+',
            label: 'Active Learners'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school" aria-hidden="true">
                    <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                    <path d="M18 4.933V21" />
                    <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
                    <path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11" />
                    <path d="M6 4.933V21" />
                    <circle cx="12" cy="9" r="2" />
                </svg>
            ),
            target: 500,
            suffix: '+',
            label: 'Institutions'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            ),
            target: 2500,
            suffix: '+',
            label: 'Hours of Content'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-check" aria-hidden="true">
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                    <path d="m9 15 2 2 4-4" />
                </svg>
            ),
            target: 150,
            suffix: 'K+',
            label: 'Assessments Taken'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent" aria-hidden="true">
                    <line x1="19" x2="5" y1="5" y2="19" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
            ),
            target: 95,
            suffix: '%',
            label: 'Success Rate'
        }
    ];

    return (
        <div className="stats-banner" ref={elementRef}>
            <div className="container stats-grid">
                {statsData.map((item, idx) => (
                    <div className="stat-item" key={idx}>
                        {item.icon}
                        <div>
                            <CountUp
                                end={item.target}
                                suffix={item.suffix}
                                startTrigger={isVisible}
                            />
                            <p>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
