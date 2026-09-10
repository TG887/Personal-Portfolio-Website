// 1. Grab the button element from the HTML using its ID
const toggleButton = document.getElementById("theme-toggle");

// 2. Add a 'click' event listener to the button
toggleButton.addEventListener('click', () => {
    // 3. Toggle the 'dark-mode' class on the <body>
    document.body.classList.toggle('dark-mode');

    // 4. Update the button text depending on whether dark mode is active
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Toggle Light Mode';
    } else {
        toggleButton.textContent = 'Toggle Dark Mode';
    }
});