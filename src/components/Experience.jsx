import React from 'react';
import {
    CheckSquare,
    Eye,
    ClipboardCheck,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';

function BookPlayIcon({ size = 24, className = '', ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Center spine */}
            <path d="M12 5v16" />
            {/* Left page */}
            <path d="M12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4a5 5 0 0 1 4 2" />
            {/* Right page top & outer edge */}
            <path d="M12 5a5 5 0 0 1 4-2h4a2 2 0 0 1 2 2v7.5" />
            {/* Right page bottom connecting to badge */}
            <path d="M12 21a5 5 0 0 0 2.2-.5" />
            {/* Play badge circle */}
            <circle cx="18" cy="17" r="4" />
            {/* Play button triangle */}
            <polygon
                points="16.5 15.2 19.8 17 16.5 18.8"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Experience() {
    const steps = [
        {
            numIcon: <BookPlayIcon />,
            title: 'Learn',
            text: 'Engaging concept videos & resources',
        },
        {
            numIcon: <CheckSquare />,
            title: 'Practice',
            text: 'Interactive quizzes & assignments',
        },
        {
            numIcon: <Eye />,
            title: 'Visualize',
            text: '3D, AR & immersive learning',
        },
        {
            numIcon: <ClipboardCheck />,
            title: 'Assess',
            text: 'Tests, evaluations & feedback',
        },
        {
            numIcon: <TrendingUp />,
            title: 'Improve',
            text: 'AI insights to boost performance',
        },
    ];

    return (
        <section className="experience-section">
            <div className="container text-center section-header">
                <div className="learning-journey-capsule">
                    <span className="capsule-line left-line" aria-hidden="true"></span>
                    <span className="capsule-text">OUR LEARNING JOURNEY</span>
                    <span className="capsule-line right-line" aria-hidden="true"></span>
                </div>
                <h2 className="section-title">A Complete Learning Experience</h2>
                <p className="section-subtitle experience-subtitle">
                    From curiosity to creation — every step of your learning journey, powered by technology.
                </p>
            </div>

            {/* Step Flow */}
            <div className="container step-flow-wrapper">
                <div className="steps-container">
                    {steps.map((step, idx) => (
                        <React.Fragment key={idx}>
                            <div className="step-card">
                                <div className="step-num">{step.numIcon}</div>
                                <h4>{step.title}</h4>
                                <p>{step.text}</p>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="step-arrow">
                                    <ArrowRight />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
