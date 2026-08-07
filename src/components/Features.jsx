import React from 'react';
import {
    Sparkles,
    Bot,
    Box,
    LayoutDashboard,
    LineChart,
    ClipboardCheck,
    Award,
    ShieldCheck,
} from 'lucide-react';

export default function Features() {
    const cards = [
        {
            icon: <Sparkles />,
            ring: 'ring-blue',
            title: 'Increase Engagement',
            text: 'Immersive gamified pathways and media that keep students actively curious and learning.',
        },
        {
            icon: <Bot />,
            ring: 'ring-indigo',
            title: 'AI-Powered Learning',
            text: 'Tailored AI tutoring that adapts in real-time to each student\'s learning velocity and requirements.',
        },
        {
            icon: <Box />,
            ring: 'ring-cyan',
            title: 'Interactive 3D & VR Lessons',
            text: 'Visualize complex science and math topics with photorealistic 3D models and VR environments.',
        },
        {
            icon: <LayoutDashboard />,
            ring: 'ring-purple',
            title: 'Teacher Dashboard',
            text: 'Live classroom analytics, customized lesson planners, and automated grading aids for teachers.',
        },
        {
            icon: <LineChart />,
            ring: 'ring-teal',
            title: 'Parent Progress Reports',
            text: 'A transparent portal showing student concepts mastered, strengths, and recommended improvements.',
        },
        {
            icon: <ClipboardCheck />,
            ring: 'ring-orange',
            title: 'Exam Readiness',
            text: 'Rich mock test generators, interactive practice runs, and revision paths to boost confidence.',
        },
        {
            icon: <Award />,
            ring: 'ring-amber',
            title: 'Skill Development',
            text: 'Fosters practical critical thinking, conceptual problem-solving, and future digital skills.',
        },
        {
            icon: <ShieldCheck />,
            ring: 'ring-emerald',
            title: 'NEP 2020 Aligned',
            text: 'Fully certified and designed in alignment with national education policies and competency structures.',
        },
    ];

    return (
        <section id="why-schools" className="why-schools-section">
            <div className="container text-center section-header">
                <div className="badge-schools">For Institutions</div>
                <h2 className="section-title">
                    Why Schools Choose <span className="brand-highlight">Vyoma</span>
                </h2>
                <p className="section-subtitle">
                    Empowering schools, educators, and students with India's most advanced NEP-aligned smart ecosystem.
                </p>
            </div>

            <div className="container schools-grid">
                {cards.map((card, index) => (
                    <div className="school-card" key={index}>
                        <div className={`school-icon-wrapper ${card.ring}`}>
                            {card.icon}
                        </div>
                        <h4>{card.title}</h4>
                        <p>{card.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
