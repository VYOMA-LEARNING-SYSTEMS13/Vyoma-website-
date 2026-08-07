import React from 'react';
import { Cpu, Layers, BarChart3 } from 'lucide-react';

export default function Products({ onOpenModal }) {
    return (
        <section id="products" className="products-section">
            <div className="container text-center section-header">
                <h2 className="section-title">Our Products</h2>
                <p className="section-subtitle">A complete ecosystem for learners, educators and institutions.</p>
            </div>

            <div className="container products-grid">
                {/* Product 1: Nova */}
                <div className="product-card card-nova">
                    <div className="product-info">
                        <div className="product-brand color-nova">
                            <Cpu className="product-icon" size={24} />
                            <span>Nova</span>
                        </div>
                        <p>AI-powered adaptive learning platform for schools, coaching centers and institutions.</p>
                        <button
                            onClick={() => onOpenModal('nova')}
                            className="btn btn-primary-alt"
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            Explore Nova
                        </button>
                    </div>
                    <div className="product-mockup">
                        <div className="macbook-frame">
                            <img src="/product-nova.png" alt="Nova dashboard interface" />
                        </div>
                    </div>
                </div>

                {/* Product 2: Curio */}
                <div className="product-card card-curio">
                    <div className="product-info">
                        <div className="product-brand color-curio">
                            <Layers className="product-icon" size={24} />
                            <span>Curio</span>
                        </div>
                        <p>Immersive 3D & AR learning experiences for students to visualize and understand complex concepts.</p>
                        <button
                            onClick={() => onOpenModal('curio')}
                            className="btn btn-primary"
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            Explore Curio
                        </button>
                    </div>
                    <div className="product-mockup">
                        <img src="/product-curio.png" alt="Curio interactive 3D heart model" className="heart-illustration" />
                    </div>
                </div>

                {/* Product 3: Vibe */}
                <div className="product-card card-vibe">
                    <div className="product-info">
                        <div className="product-brand color-vibe">
                            <BarChart3 className="product-icon" size={24} />
                            <span>Vibe</span>
                        </div>
                        <p>Next-gen assessment and analytics platform for better insights and outcomes.</p>
                        <button
                            onClick={() => onOpenModal('vibe')}
                            className="btn btn-teal"
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            Explore Vibe
                        </button>
                    </div>
                    <div className="product-mockup">
                        <div className="ipad-frame">
                            <img src="/product-vibe.png" alt="Vibe dashboard interface" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
