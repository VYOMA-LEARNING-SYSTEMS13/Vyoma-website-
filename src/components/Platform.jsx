import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function Platform() {
    return (
        <section id="platform" className="why-section">
            <div className="container text-center section-header">
                <h2 className="section-title">Why Vyoma?</h2>
                <p className="section-subtitle">Reimagining the way the world learns.</p>
            </div>

            <div className="container comparison-wrapper">
                <div className="comparison-grid">
                    {/* Traditional Learning */}
                    <div className="comparison-card traditional">
                        <h3 className="comparison-header">Traditional Learning</h3>
                        <ul className="comparison-list">
                            <li>
                                <XCircle className="icon-no" size={18} /> Passive video lectures
                            </li>
                            <li>
                                <XCircle className="icon-no" size={18} /> One-size-fits-all approach
                            </li>
                            <li>
                                <XCircle className="icon-no" size={18} /> Limited interaction
                            </li>
                            <li>
                                <XCircle className="icon-no" size={18} /> Difficult to visualize concepts
                            </li>
                            <li>
                                <XCircle className="icon-no" size={18} /> Low retention & engagement
                            </li>
                        </ul>
                    </div>

                    {/* VS Divider */}
                    <div className="vs-divider">
                        <span>VS</span>
                    </div>

                    {/* AI-Powered Learning */}
                    <div className="comparison-card ai-powered">
                        <h3 className="comparison-header">AI-Powered Learning</h3>
                        <ul className="comparison-list">
                            <li>
                                <CheckCircle2 className="icon-yes" size={18} /> Personalized AI tutor
                            </li>
                            <li>
                                <CheckCircle2 className="icon-yes" size={18} /> Adaptive learning paths
                            </li>
                            <li>
                                <CheckCircle2 className="icon-yes" size={18} /> Interactive & engaging content
                            </li>
                            <li>
                                <CheckCircle2 className="icon-yes" size={18} /> 3D, AR & immersive experiences
                            </li>
                            <li>
                                <CheckCircle2 className="icon-yes" size={18} /> Better understanding & retention
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
