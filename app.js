/* ==========================================================================
   CURIO INTERACTIVITY SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide SVG Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuToggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');

        // Switch menu icon
        if (isOpen) {
            menuToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close mobile nav when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    });

    // 3. FAQ ACCORDION INTERACTIVITY
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current accordion
            item.classList.toggle('active');
            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Open the first FAQ accordion item by default
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) {
        firstAccordion.classList.add('active');
        const content = firstAccordion.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
    }

    // 4. TESTIMONIAL CAROUSEL
    let currentTestimonialIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const controlDots = document.querySelectorAll('.control-dot');
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach((card, i) => {
            card.classList.remove('active');
            controlDots[i].classList.remove('active');
        });

        testimonials[index].classList.add('active');
        controlDots[index].classList.add('active');
        currentTestimonialIndex = index;
    }

    // Set up click handlers on dots
    controlDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetTestimonialTimer();
        });
    });

    // Auto-slide testimonials
    function startTestimonialTimer() {
        testimonialInterval = setInterval(() => {
            let nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
            showTestimonial(nextIndex);
        }, 5000);
    }

    function resetTestimonialTimer() {
        clearInterval(testimonialInterval);
        startTestimonialTimer();
    }

    if (testimonials.length > 0) {
        startTestimonialTimer();
    }

    // Expose function globally for manual dot clicks if needed
    window.setTestimonial = (index) => {
        showTestimonial(index);
        resetTestimonialTimer();
    };

    // 5. ACTIVE NAVIGATION ON SCROLL
    const sections = document.querySelectorAll('section, footer');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id') || '';
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 6. CONTACT FORM SUBMISSION HOOK
    const contactForm = document.getElementById('contactSectionForm');
    const submitBtn = document.getElementById('contactSectionSubmitBtn');
    const statusDiv = document.getElementById('contactSectionFormStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Visual response feedback
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending Message...</span>';

            setTimeout(() => {
                statusDiv.className = 'contact-form-status success';
                statusDiv.innerText = 'Thank you! Your message has been sent successfully.';
                statusDiv.style.display = 'block';

                // Reset form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Disappear success message in 5 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // 7. PRODUCT DETAIL MODALS INTERACTIONS
    window.openProductModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        }
    };

    window.closeProductModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            // Check if any other modal is still active
            const activeModals = document.querySelectorAll('.product-modal-overlay.active');
            if (activeModals.length === 0) {
                document.body.style.overflow = ''; // restore background scrolling
            }
        }
    };

    // Close modal on overlay click
    const modalOverlays = document.querySelectorAll('.product-modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeProductModal(overlay.id);
            }
        });
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.product-modal-overlay.active');
            if (activeModal) {
                closeProductModal(activeModal.id);
            }
        }
    });

    // 8. HERO TYPEWRITER ANIMATION
    const titleEl = document.getElementById('hero-typewriter');

    if (titleEl) {
        const text = titleEl.getAttribute('data-text') || titleEl.innerHTML;
        titleEl.removeAttribute('data-text'); // prevent collision
        titleEl.innerHTML = '';

        // Create or find cursor
        let cursor = titleEl.nextElementSibling;
        if (!cursor || !cursor.classList.contains('typewriter-cursor')) {
            cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            cursor.innerHTML = '|';
            titleEl.parentNode.insertBefore(cursor, titleEl.nextSibling);
        }

        // Tokenize HTML and generate states
        const getHtmlStates = (htmlString) => {
            const states = [];
            let idx = 0;
            const tokens = [];

            while (idx < htmlString.length) {
                if (htmlString[idx] === '<') {
                    const closingIdx = htmlString.indexOf('>', idx);
                    if (closingIdx !== -1) {
                        tokens.push({ type: 'tag', content: htmlString.substring(idx, closingIdx + 1) });
                        idx = closingIdx + 1;
                    } else {
                        tokens.push({ type: 'text', content: htmlString[idx] });
                        idx++;
                    }
                } else {
                    tokens.push({ type: 'text', content: htmlString[idx] });
                    idx++;
                }
            }

            let currentHtml = '';
            const openTags = [];

            states.push('');

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token.type === 'tag') {
                    currentHtml += token.content;
                    if (token.content.startsWith('</')) {
                        openTags.pop();
                    } else if (!token.content.endsWith('/>')) {
                        const match = token.content.match(/<([a-zA-Z0-9\-]+)/);
                        if (match) {
                            openTags.push(match[1]);
                        }
                    }
                } else {
                    currentHtml += token.content;
                }

                let stateWithClosedTags = currentHtml;
                for (let j = openTags.length - 1; j >= 0; j--) {
                    stateWithClosedTags += `</${openTags[j]}>`;
                }
                states.push(stateWithClosedTags);
            }

            // Filter unique states
            const uniqueStates = [];
            for (let i = 0; i < states.length; i++) {
                if (i === 0 || states[i] !== states[i - 1]) {
                    uniqueStates.push(states[i]);
                }
            }
            return uniqueStates;
        };

        const states = getHtmlStates(text);
        let currentIndex = 0;
        let isTyping = true;
        let timer = null;

        const tick = () => {
            if (isTyping) {
                if (currentIndex < states.length - 1) {
                    currentIndex++;
                    titleEl.innerHTML = states[currentIndex];
                    // Type speed: 50ms per character
                    timer = setTimeout(tick, 50);
                } else {
                    // Fully typed. Pause for 2 seconds, then start erasing.
                    isTyping = false;
                    timer = setTimeout(tick, 2000);
                }
            } else {
                if (currentIndex > 0) {
                    currentIndex--;
                    titleEl.innerHTML = states[currentIndex];
                    // Erase speed: 30ms per character
                    timer = setTimeout(tick, 30);
                } else {
                    // Fully erased. Pause briefly (500ms), then start typing again.
                    isTyping = true;
                    timer = setTimeout(tick, 500);
                }
            }
        };

        // Manage Logo Intro Lifecycle
        const logoIntro = document.getElementById('logo-intro');
        let introFinished = false;
        let startTypewriterTimeout = null;

        if (logoIntro) {
            setTimeout(() => {
                logoIntro.classList.add('fade-out');
                document.body.classList.remove('intro-active');

                setTimeout(() => {
                    logoIntro.style.display = 'none';
                    introFinished = true;
                    // Trigger typewriter if scheduled
                    if (startTypewriterTimeout) {
                        startTypewriterTimeout();
                    }
                }, 800); // 800ms fade transition
            }, 4000); // 4 seconds screen reveal
        } else {
            introFinished = true;
        }

        const startTypewriter = () => {
            if (!introFinished) {
                startTypewriterTimeout = () => {
                    timer = setTimeout(tick, 500);
                };
            } else {
                timer = setTimeout(tick, 500);
            }
        };

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(heroContent);
                        startTypewriter();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(heroContent);
        } else {
            startTypewriter();
        }
    }
});
