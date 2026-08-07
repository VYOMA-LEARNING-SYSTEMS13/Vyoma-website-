import React from 'react';
import {
    Video,
    CheckSquare,
    Eye,
    ClipboardCheck,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';

export default function Experience() {
    const steps = [
        {
            numIcon: <Video />,
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
                <h2 className="section-title">A Complete Learning Experience</h2>
            </div>

            {/* Step Flow */}
            <div className="container step-flow-wrapper">
                <div className="step-line-bg"></div>
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
