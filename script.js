/* =======================================================
   1. Dark Mode Toggle with localStorage
   ======================================================= */
const toggleButton = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = 'Toggle Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        toggleButton.textContent = 'Toggle Dark Mode';
    }
}

// Check saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
}

// Toggle on click
toggleButton.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});


/* =======================================================
   2. Live Typewriter Animation
   ======================================================= */
const typewriterElement = document.getElementById('typewriter');
const words = [
    'Chartered Accountant',
    'Financial Analyst',
    'Web & Software Developer',
    'Fintech Innovator'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400; // Pause before typing next
    }

    setTimeout(typeEffect, speed);
}

if (typewriterElement) {
    typeEffect();
}

/* =======================================================
   4. Interactive Contact Form
   ======================================================= */
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name').value.trim();
        const emailInput = document.getElementById('email').value.trim();
        const messageInput = document.getElementById('message').value.trim();

        if (!nameInput || !emailInput || !messageInput) {
            alert('Please fill out all fields.');
            return;
        }

        formFeedback.textContent = `Thank you, ${nameInput}! Your message has been sent successfully.`;
        formFeedback.className = 'form-feedback success';

        contactForm.reset();

        setTimeout(() => {
            formFeedback.style.display = 'none';
            formFeedback.className = 'form-feedback';
        }, 5000);
    });
}


/* =======================================================
   5. Floating Scroll to Top Button
   ======================================================= */
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}