import React from 'react';
import ihubImg from '/images/partners/ihub.png';
import ssipImg from '/images/partners/ssip.png';
import gtuImg from '/images/partners/Gtu.png';
import nvidiaImg from '/images/partners/nvidia.png';
import startupImg from '/images/partners/startup.png';

export default function Partners() {
    const logos = [
        { name: 'iHub', src: ihubImg, cls: 'h-10 md:h-14' },
        { name: 'SSIP Gujarat', src: ssipImg, cls: 'h-10 md:h-14' },
        { name: 'GTU Ventures', src: gtuImg, cls: 'h-10 md:h-14' },
        { name: 'NVIDIA', src: nvidiaImg, cls: 'h-14 md:h-20' },
        { name: 'Startup India', src: startupImg, cls: 'h-18 md:h-26' },
    ];

    // Duplicate list to support continuous infinite-scroll loop
    const logoTape = [...logos, ...logos];

    return (
        <section id="partners" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                <h3 className="text-mutedSlate font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-8 md:mb-12">
                    Trusted By &amp; Partnered With
                </h3>
                <div className="relative overflow-hidden group py-4 md:py-6">
                    <div className="flex overflow-hidden">
                        <div className="partners-grid flex items-center gap-12 md:gap-16 lg:gap-28 whitespace-nowrap">
                            {logoTape.map((logo, idx) => (
                                <div
                                    className="flex-shrink-0 transition-all duration-500 px-4 opacity-80 hover:opacity-100"
                                    key={idx}
                                >
                                    <img
                                        alt={logo.name}
                                        className={`${logo.cls} w-auto object-contain max-w-[200px]`}
                                        loading="lazy"
                                        src={logo.src}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
