// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            // active navbar links
            navLinks.forEach(links => {
                links.classList.remove('active');
                const activeNav = document.querySelector('header nav a[href*=' + id + ']');
                if (activeNav) activeNav.classList.add('active');
            });
            // active sections for animation on scroll
            sec.classList.add('show-animate');
        }
        // if want animation that repeats on scroll use this
        else {
            sec.classList.remove('show-animate');
        }
    });

    // sticky navbar
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle icon and navbar when click navbar links (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    // animation footer on scroll
    let footer = document.querySelector('footer');
    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}

// Close mobile navbar on click for any nav link (including external buttons)
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });
});

// ==================== PORTFOLIO EYE-O's CURSOR TRACKING ====================
const pupils = document.querySelectorAll('.eye-letter .pupil');
const eyeElements = document.querySelectorAll('.eye-letter .eye');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
}, { passive: true });

function animateEyes() {
    // Smooth lerp easing for organic cartoon motion
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    eyeElements.forEach((eye, index) => {
        const pupil = pupils[index];
        if (!pupil) return;

        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = currentX - eyeCenterX;
        const deltaY = currentY - eyeCenterY;

        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.hypot(deltaX, deltaY);

        // Max movement radius inside the eye
        const maxRadiusX = (rect.width - pupil.offsetWidth) / 2 - 4;
        const maxRadiusY = (rect.height - pupil.offsetHeight) / 2 - 4;

        // Smooth proximity scaling
        const intensity = Math.min(distance / 200, 1);

        const moveX = Math.cos(angle) * maxRadiusX * intensity;
        const moveY = Math.sin(angle) * maxRadiusY * intensity;

        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    requestAnimationFrame(animateEyes);
}

if (eyeElements.length > 0) {
    requestAnimationFrame(animateEyes);
}

// ==================== INTERACTIVE EYE WINK & MOBILE GAZE ====================
eyeElements.forEach(eye => {
    eye.addEventListener('click', () => {
        eye.classList.add('winking');
        setTimeout(() => eye.classList.remove('winking'), 380);
    });
});

let lastInteraction = Date.now();
window.addEventListener('touchstart', (e) => {
    lastInteraction = Date.now();
    if (e.touches && e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    lastInteraction = Date.now();
    if (e.touches && e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('mousemove', () => {
    lastInteraction = Date.now();
});

// Organic wandering gaze when idle on phone/desktop
setInterval(() => {
    if (Date.now() - lastInteraction > 3500 && eyeElements.length > 0) {
        const eyeRect = eyeElements[0].getBoundingClientRect();
        const wanderRadius = 130;
        const wanderAngle = Math.random() * Math.PI * 2;
        targetX = eyeRect.left + eyeRect.width / 2 + Math.cos(wanderAngle) * wanderRadius;
        targetY = eyeRect.top + eyeRect.height / 2 + Math.sin(wanderAngle) * wanderRadius;
    }
}, 3200);

// ==================== INTERACTIVE BUBBLE TAP REACTION ====================
const skillBubbles = document.querySelectorAll('.skill-bubble');
skillBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        bubble.classList.add('bubble-pop');
        const label = bubble.querySelector('.bubble-label');
        if (label) {
            label.style.opacity = '1';
            label.style.visibility = 'visible';
            label.style.transform = 'translateX(-50%) translateY(0)';
        }
        setTimeout(() => {
            bubble.classList.remove('bubble-pop');
            if (label) {
                label.style.opacity = '';
                label.style.visibility = '';
                label.style.transform = '';
            }
        }, 2200);
    });
});

// ==================== ABOUT STATS COUNTER ANIMATION ====================
const counterNums = document.querySelectorAll('.counter-num');
let statsCountersStarted = false;

function startStatsCounters() {
    if (statsCountersStarted) return;
    statsCountersStarted = true;

    counterNums.forEach(counter => {
        const target = +counter.getAttribute('data-target') || 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function stepCount(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Smooth easeOutCubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            counter.innerText = Math.floor(easeOut * target);

            if (progress < 1) {
                requestAnimationFrame(stepCount);
            } else {
                counter.innerText = target;
            }
        }
        requestAnimationFrame(stepCount);
    });
}

const statsGridElem = document.querySelector('.about-stats-grid');
if (statsGridElem && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startStatsCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    observer.observe(statsGridElem);
} else if (statsGridElem) {
    startStatsCounters();
}

// ==================== CONTACT FORM SUBMISSION TO WORKSTATION EMAIL ====================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const sendBtn = document.getElementById('send-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const phoneInput = document.getElementById('form-phone');
        const projectInput = document.getElementById('form-project');
        const messageInput = document.getElementById('form-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const project = projectInput ? projectInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            formStatus.innerHTML = '<span class="status-error"><i class="bx bx-error-circle"></i> Please fill in all required fields.</span>';
            return;
        }

        // Show sending state
        const originalBtnHtml = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span> <i class="bx bx-loader-alt bx-spin" style="margin-left:.8rem; font-size: 1.8rem;"></i>';
        formStatus.innerHTML = '<span class="status-sending"><i class="bx bx-loader-alt bx-spin"></i> Sending message...</span>';

        const formData = new FormData(contactForm);
        const formAction = contactForm.getAttribute('action') || 'https://formsubmit.co/workstation.arslan@gmail.com';
        const submitUrl = formAction.includes('formsubmit.co') ? formAction.replace('formsubmit.co/', 'formsubmit.co/ajax/') : formAction;

        try {
            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                formStatus.innerHTML = `<span class="status-success"><i class="bx bxs-check-circle" style="font-size:2rem;"></i> Thank you, <strong>${name}</strong>! Your inquiry has been sent successfully. I will get back to you shortly!</span>`;
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Direct mailto fallback so user can send immediately through their default mail app
            const mailtoSubject = encodeURIComponent(`New Project Inquiry from ${name} (${project || 'Design Project'})`);
            const mailtoBody = encodeURIComponent(
                `Full Name: ${name}\n` +
                `Email: ${email}\n` +
                `Mobile / WhatsApp: ${phone}\n` +
                `Project Type: ${project}\n\n` +
                `Project Requirements:\n${message}`
            );
            const mailtoLink = document.querySelector('a[href^="mailto:"]');
            const targetEmail = mailtoLink ? mailtoLink.getAttribute('href').replace('mailto:', '').split('?')[0] : 'workstation.arslan@gmail.com';
            window.location.href = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

            formStatus.innerHTML = `<span class="status-success"><i class="bx bxs-envelope" style="font-size:2rem;"></i> Opening email to send your message directly...</span>`;
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalBtnHtml;
        }
    });
}

// ==================== MOBILE SERVICE CARDS SCROLL-FOCUS DEPTH BLUR ====================
function initMobileServiceCardFocus() {
    const servicesContainer = document.querySelector('.services-container');
    const serviceCards = document.querySelectorAll('.services-container .service-box');

    if (!servicesContainer || serviceCards.length === 0) return;

    let ticking = false;

    function updateActiveCard() {
        if (window.innerWidth > 768) {
            servicesContainer.classList.remove('has-scroll-focus');
            serviceCards.forEach(c => c.classList.remove('card-active'));
            ticking = false;
            return;
        }

        servicesContainer.classList.add('has-scroll-focus');
        const viewportCenter = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;

        serviceCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenter - viewportCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        serviceCards.forEach(card => {
            if (card === closestCard) {
                card.classList.add('card-active');
            } else {
                card.classList.remove('card-active');
            }
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateActiveCard);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActiveCard();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileServiceCardFocus);
} else {
    initMobileServiceCardFocus();
}

// ==================== SKILLS PROGRESS BARS SCROLL ANIMATION ====================
function initSkillsProgressAnimation() {
    const skillsSection = document.querySelector('#skills');
    const skillBarSpans = document.querySelectorAll('.skills-content .progress .bar span');
    if (!skillsSection || skillBarSpans.length === 0) return;

    function triggerFill() {
        skillsSection.classList.add('animate-skills');
        skillBarSpans.forEach((span, idx) => {
            const targetWidth = span.getAttribute('data-width');
            if (targetWidth) {
                setTimeout(() => {
                    span.style.width = targetWidth;
                }, idx * 60);
            }
        });
    }

    function triggerReset() {
        skillsSection.classList.remove('animate-skills');
        skillBarSpans.forEach(span => {
            span.style.width = '0%';
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerFill();
                } else {
                    triggerReset();
                }
            });
        }, {
            threshold: 0.15
        });
        observer.observe(skillsSection);
    } else {
        triggerFill();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillsProgressAnimation);
} else {
    initSkillsProgressAnimation();
}
