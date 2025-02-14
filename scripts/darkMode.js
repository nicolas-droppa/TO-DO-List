const button = document.getElementById('dayNightButton');

/**
 * Applies darkmode based on local storage
 */
function applyDarkMode() {
    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

applyDarkMode();

button.addEventListener('click', () => {
    const darkMode = localStorage.getItem('dark-mode');

    if (darkMode === 'enabled') {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
    }
});