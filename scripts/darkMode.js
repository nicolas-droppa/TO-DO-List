import { DARK_MODE_STORAGE_KEY } from './constants.js';

const button = document.getElementById('dayNightButton');

/**
 * Applies darkmode based on local storage
 */
function applyDarkMode() {
    const darkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

applyDarkMode();

button.addEventListener('click', () => {
    const darkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);

    if (darkMode === 'enabled') { 
        document.body.classList.remove('dark-mode');
        localStorage.setItem(DARK_MODE_STORAGE_KEY, 'disabled');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem(DARK_MODE_STORAGE_KEY, 'enabled');
    }
});