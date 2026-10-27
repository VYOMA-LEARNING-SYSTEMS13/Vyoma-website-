import React from 'react';
import {
    CheckSquare,
    Eye,
    ClipboardCheck,
    TrendingUp,
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
            num: '01',
            numIcon: <BookPlayIcon size={20} />,
            title: 'Learn',
            text: 'Engaging concept videos & resources',
        },
        {
            num: '02',
            numIcon: <CheckSquare size={20} />,
            title: 'Practice',
            text: 'Interactive quizzes & assignments',
        },
        {
            num: '03',
            numIcon: <Eye size={20} />,
            title: 'Visualize',
            text: '3D, AR & immersive learning',
        },
        {
            num: '04',
            numIcon: <ClipboardCheck size={20} />,
            title: 'Assess',
            text: 'Tests, evaluations & feedback',
        },
        {
            num: '05',
            numIcon: <TrendingUp size={20} />,
            title: 'Improve',
            text: 'AI insights to boost performance',
        },
    ];

    return (
        <section className="experience-section" id="learning-journey">
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

            {/* Vertical Zigzag Timeline */}
            <div className="container journey-timeline-wrapper">
                {/* Continuous central vertical line passing through all 5 junctions */}
                <div className="journey-central-line" aria-hidden="true"></div>

                <div className="journey-timeline-list" role="list">
                    {steps.map((step, idx) => {
                        const isLeft = idx % 2 === 0;
                        return (
                            <div
                                key={step.num}
                                className={`journey-row ${isLeft ? 'journey-row--left' : 'journey-row--right'}`}
                                role="listitem"
                            >
                                <div className="journey-cell">
                                    <div className="journey-content">
                                        <div className="journey-header">
                                            <span className="journey-icon" aria-hidden="true">{step.numIcon}</span>
                                            <h3 className="journey-title">{step.title}</h3>
                                        </div>
                                        <p className="journey-desc">{step.text}</p>
                                    </div>

                                    <div
                                        className="journey-circle"
                                        aria-label={`Step ${step.num}: ${step.title}`}
                                    >
                                        <span className="journey-num">{step.num}</span>
                                    </div>

                                    <div className="journey-connector" aria-hidden="true">
                                        <span className="journey-dot"></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
