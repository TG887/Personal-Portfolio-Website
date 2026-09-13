// 1. Grab the button element from the HTML using its ID
const toggleButton = document.getElementById("theme-toggle");

// 2. Function to apply a theme and update the button text
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = 'Toggle Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        toggleButton.textContent = 'Toggle Dark Mode';
    }
}

// 3. On page load: Check if the user previously saved a theme preference
const savedTheme = localStorage.getItem('theme');

// If a preference was saved, apply it (otherwise default to light mode)
if (savedTheme) {
    applyTheme(savedTheme);
}

// 4. Listen for button clicks to toggle and save the new preference
toggleButton.addEventListener('click', () => {
    // Check if dark mode is currently active
    const isDark = document.body.classList.contains('dark-mode');

    // Switch to the opposite theme
    const newTheme = isDark ? 'light' : 'dark';

    // Apply the theme and save it to localStorage
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

/* =========================================
   2. Typewriter Effect
   ========================================= */
const typewriterElement = document.getElementById('typewriter');
// Array of words/titles to cycle through
const words = [
    'Chartered Accountant',
    'Web Developer',
    'Tech Enthusiast',
    'Problem Solver'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeEffect() {
    const currentWord = words[wordIndex];

    // Determine the text to show
    if (isDeleting) {
        // Remove one character
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add one character
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    // Default typing speed
    let typeSpeed = isDeleting ? 60 : 120;
    // Word is completely typed
    if (!isDeleting && charIndex === currentWord.length) {
        // Pause at the end of the word before starting to erase
        typeSpeed = 1500;
        isDeleting = true;
    }
    // Word is completely erased
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to the next word in the array (loop back to start if at end)
        wordIndex = (wordIndex + 1) % words.length;
        // Small pause before typing the next word
        typeSpeed = 500;
    }
    // Schedule the next character
    setTimeout(typeEffect, typeSpeed);
}
// Start the animation once the page is loaded
if (typewriterElement) {
    typeEffect();
}
