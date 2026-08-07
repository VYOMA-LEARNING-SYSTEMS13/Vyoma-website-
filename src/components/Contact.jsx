import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        messageText: '',
    });
    const [status, setStatus] = useState({ type: '', msg: '', visible: false });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSending) return; // Prevent duplicate submissions
        setIsSending(true);
        setStatus({ type: '', msg: '', visible: false });

        try {
            const response = await fetch('http://localhost:5001/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus({
                    type: 'success',
                    msg: 'Thank you! Your message has been sent successfully.',
                    visible: true,
                });
                setFormData({
                    fullName: '',
                    emailAddress: '',
                    messageText: '',
                });

                // Hide success banner after 5 seconds
                setTimeout(() => {
                    setStatus((prev) => ({ ...prev, visible: false }));
                }, 5000);
            } else {
                setStatus({
                    type: 'error',
                    msg: data.message || 'Unable to send your message right now. Please try again later.',
                    visible: true,
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                msg: 'Unable to send your message right now. Please try again later.',
                visible: true,
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container contact-container-wrapper">
                <div className="contact-left-info">
                    <h2 className="contact-main-title">
                        Let's Build the <span className="text-grad">Future</span> of Education Together.
                    </h2>
                    <p className="contact-text-desc">
                        Invite institutions, partners, investors, and learners to connect. Whether you have a question or a
                        partnership proposal, we're ready to talk.
                    </p>

                    <div className="contact-info-block">
                        {/* Row 1: Office */}
                        <div className="info-row">
                            <div className="info-badge badge-blue">
                                <MapPin size={24} />
                            </div>
                            <div className="info-text">
                                <h5>Our Office</h5>
                                <p>IHub, Ahmedabad, Gujarat, India</p>
                            </div>
                        </div>

                        {/* Row 2: Email */}
                        <div className="info-row">
                            <div className="info-badge badge-orange">
                                <Mail size={24} />
                            </div>
                            <div className="info-text">
                                <h5>Email Us</h5>
                                <p>
                                    <a href="mailto:info@vyoma.com">info@vyoma.com</a>
                                </p>
                            </div>
                        </div>

                        {/* Row 3: Call */}
                        <div className="info-row">
                            <div className="info-badge badge-cyan">
                                <Phone size={24} />
                            </div>
                            <div className="info-text">
                                <h5>Call Us</h5>
                                <p>
                                    <a href="tel:+918780375687">+91 87803 75687</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-right-form">
                    <form className="contact-interactive-form" onSubmit={handleSubmit}>
                        <div className="form-input-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                placeholder="Enter your name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-input-group">
                            <label htmlFor="emailAddress">Email Address</label>
                            <input
                                type="email"
                                id="emailAddress"
                                placeholder="name@company.com"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-input-group">
                            <label htmlFor="messageText">Your Message</label>
                            <textarea
                                id="messageText"
                                rows="5"
                                placeholder="How can we help you?"
                                value={formData.messageText}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit-message" disabled={isSending}>
                            <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
                            {!isSending && <Send size={18} />}
                        </button>

                        {status.visible && (
                            <div
                                className={`contact-form-status ${status.type}`}
                                style={{ display: 'block' }}
                            >
                                {status.msg}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
