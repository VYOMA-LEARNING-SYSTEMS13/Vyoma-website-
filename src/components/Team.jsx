import React from 'react';

// Custom inline LinkedIn icon
const LinkedinIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

export default function Team() {
    const members = [
        {
            name: 'Jesa Kodiyatar',
            role: 'FOUNDER & CEO',
            img: '/images/team/jesa.jpg',
            ln: 'https://www.linkedin.com/in/jesa-kodiyatar-512774281/',
            style: { objectPosition: 'center 40%' },
        },
        {
            name: 'Muskaan Rughvani',
            role: 'CO-FOUNDER & CBO',
            img: '/images/team/muskan.jpg',
            ln: 'https://www.linkedin.com/in/muskaan-rughvani-773649297/',
            style: { objectPosition: 'center 25%' },
        },
        {
            name: 'Parth Parmar',
            role: 'Founding Engineer (App. Dev.)',
            img: '/images/team/parth.jpg',
            ln: 'https://www.linkedin.com/in/parthparmar7-gec-ldce-it-dte/',
            style: { objectPosition: 'center 40%' },
        },

        {
            name: 'Vinay Vaja',
            role: 'Founding Engineer',
            img: '/images/team/vinay.png',
            ln: 'https://www.linkedin.com/in/vinayvaja/',
            style: { objectPosition: 'center 15%' },
        },
    ];

    return (
        <section id="team" className="team-section">
            <div className="container team-header-flex">
                <div className="team-header-left">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">
                        A diverse group of educators, engineers, and visionaries dedicated to transforming learning.
                    </p>
                </div>
                <div className="team-header-right">
                    <a href="#contact" className="btn btn-dark-mission">Join Our Mission</a>
                </div>
            </div>

            <div className="container team-grid">
                {members.map((member, idx) => (
                    <div className="team-card" key={idx}>
                        <img
                            src={member.img}
                            alt={member.name}
                            className="member-img"
                            style={member.style}
                        />
                        <div className="member-info">
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                            <a
                                href={member.ln}
                                className="linkedin-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name} LinkedIn`}
                            >
                                <LinkedinIcon size={18} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
