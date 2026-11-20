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
        formStatus.innerHTML = '<span class="status-sending"><i class="bx bx-loader-alt bx-spin"></i> Sending message directly to <strong>workstation112130@gmail.com</strong>...</span>';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://formsubmit.co/ajax/workstation112130@gmail.com', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                formStatus.innerHTML = `<span class="status-success"><i class="bx bxs-check-circle" style="font-size:2rem;"></i> Thank you, <strong>${name}</strong>! Your inquiry has been sent directly to <strong>workstation112130@gmail.com</strong>. I will get back to you shortly!</span>`;
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
            window.location.href = `mailto:workstation112130@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            formStatus.innerHTML = `<span class="status-success"><i class="bx bxs-envelope" style="font-size:2rem;"></i> Opening email to send directly to <strong>workstation112130@gmail.com</strong>...</span>`;
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalBtnHtml;
        }
    });
}
