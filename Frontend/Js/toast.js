// Frontend/Js/toast_utility.js

/**
 * Displays a toast notification.
 * @param {string} message - The message to display in the toast.
 * @param {'success' | 'error' | 'info'} type - The type of the toast (determines color).
 * @param {number} [duration=5000] - How long the toast should be visible in milliseconds (default: 5000ms).
 */
function showToast(message, type, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('Toast container not found. Please add <div id="toast-container"></div> to your HTML.');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Set CSS variable for animation delay
    toast.style.setProperty('--toast-delay', `${duration / 1000}s`);

    toastContainer.appendChild(toast);

    // Remove the toast after the duration + animation time
    setTimeout(() => {
        toast.style.animation = 'fadeOutSlideDown 0.5s forwards'; // Apply fade out animation
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, duration);
}

export {showToast}

// Example usage (for testing, you can remove this after integration)
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => showToast('Student record saved successfully!', 'success'), 1000);
    // setTimeout(() => showToast('Failed to load student data.', 'error', 5000), 3000);
    // setTimeout(() => showToast('Welcome to the student portal.', 'info'), 6000);
// });