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