import React, { useState, useEffect, useRef } from 'react';

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);

    const testimonials = [
        {
            text: "Curio's 3D models make difficult topics so easy to understand. It feels like learning in the future!",
            img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
            name: 'Aaran Mehta',
            title: 'JEE Aspirant',
        },
        {
            text: 'The AI tutor personalizes learning like never before. My students are more engaged and confident.',
            img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100&h=100',
            name: 'Priya Nair',
            title: 'Physics Teacher',
        },
        {
            text: 'Finally, a platform that combines technology and pedagogy beautifully.',
            img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100',
            name: 'Rahul Verma',
            title: 'School Principal',
        },
    ];

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
    };

    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, []);

    const handleDotClick = (index) => {
        setActiveIndex(index);
        startAutoSlide(); // reset timer
    };

    return (
        <section className="testimonials-section">
            <div className="container text-center section-header">
                <h2 className="section-title">What Learners & Educators Say</h2>
            </div>

            <div className="container testimonials-wrapper">
                <div className="testimonials-slider">
                    {testimonials.map((t, idx) => (
                        <div
                            className={`testimonial-card ${idx === activeIndex ? 'active' : ''}`}
                            key={idx}
                        >
                            <div className="quote-mark">“</div>
                            <p className="testimonial-text">{t.text}</p>
                            <div className="testimonial-author">
                                <div
                                    className="author-avatar"
                                    style={{ backgroundImage: `url('${t.img}')` }}
                                />
                                <div>
                                    <h5>{t.name}</h5>
                                    <span>{t.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="slider-controls">
                    {testimonials.map((_, idx) => (
                        <span
                            className={`control-dot ${idx === activeIndex ? 'active' : ''}`}
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
