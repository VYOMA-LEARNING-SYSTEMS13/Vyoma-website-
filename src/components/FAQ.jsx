import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);
    const contentRefs = useRef([]);

    const faqs = [
        {
            q: 'What is Vyoma Learning Systems?',
            a: 'Vyoma is an EdTech powerhouse building comprehensive learning infrastructure. We don\'t just provide courses; we create platforms like Nova, Curio, and Vibe to support students from grade 9 through industrial placement.',
        },
        {
            q: 'What products do you offer?',
            a: 'We offer Nova (foundations for classes 9-10), Curio (science immersive for classes 11-12), and Vibe (industry connection and internships for higher education).',
        },
        {
            q: 'Who can use the platforms?',
            a: 'Our platforms are designed for individual students, educational institutions, and corporate partners looking to hire vetted talent.',
        },
        {
            q: 'How does AI enhance learning on your platforms?',
            a: 'We use AI for personalized learning paths, smart assessments, virtual tutoring, and matching students to the best-fit industry opportunities based on their skill growth.',
        },
        {
            q: 'Can institutions partner with Vyoma?',
            a: 'Yes! We work with schools and universities to integrate our platforms into their curriculum and offer better outcomes for their students.',
        },
    ];

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section id="faq" className="faq-section">
            <div className="container faq-container">
                <div className="faq-header text-center">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-subtitle">Everything you need to know about Vyoma.</p>
                </div>

                <div className="accordion-group">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div className={`accordion-item ${isOpen ? 'active' : ''}`} key={idx}>
                                <button className="accordion-header" onClick={() => handleToggle(idx)}>
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className="accordion-icon"
                                        style={{
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        size={18}
                                    />
                                </button>
                                <div
                                    ref={(el) => (contentRefs.current[idx] = el)}
                                    className="accordion-content"
                                    style={{
                                        maxHeight: isOpen
                                            ? `${contentRefs.current[idx]?.scrollHeight || 200}px`
                                            : '0px',
                                    }}
                                >
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
