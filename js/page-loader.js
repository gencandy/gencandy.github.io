/**
 * Page Loader
 * Simple page loader that fades out after page load
 */

window.RPM = window.RPM || {};



/**
 * Trigger Page Animations
 * Called after page loader fades out to start all page animations
 */
window.RPM.triggerPageAnimations = function() {
    console.log('Page loader finished - triggering animations');
    
    // Dispatch custom event that other scripts can listen for
    const animationEvent = new CustomEvent('pageAnimationsReady', {
        bubbles: true,
        detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(animationEvent);
    
    // Initialize GSAP animations first (sets initial states)
    if (window.RPM.initCommonAnimations) {
        window.RPM.initCommonAnimations();
    }
    
    // Then initialize other animations
    if (window.RPM.initHeroVideo) {
        window.RPM.initHeroVideo();
    }
    if (window.RPM.initHeroParallax) {
        window.RPM.initHeroParallax();
    }
    if (window.RPM.initHeaderAnimations) {
        window.RPM.initHeaderAnimations();
    }
};

/**
 * Initialize Page Loader
 * Handles the fade out animation after page load
 */
window.RPM.initPageLoader = function() {
    const loader = document.getElementById('pageLoader');
    const body = document.body;
    
    if (!loader) return;
    
    // Minimum display time for the loader (prevents flash)
    const minDisplayTime = 500; // 500ms minimum
    const startTime = Date.now();
    
    const hideLoader = () => {
        // Calculate how long the loader has been visible
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            // Add fade out class
            loader.classList.add('fade-out');
            
            // Remove loading class from body
            body.classList.remove('loading');
            
            // Remove loader from DOM after transition completes
            loader.addEventListener('transitionend', () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                    
                    // Trigger page animations after loader is completely gone
                    window.RPM.triggerPageAnimations();
                }
            }, { once: true });
            
        }, remainingTime);
    };
    
    // Hide loader when page is fully loaded
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
    
    // Fallback: Hide loader after maximum time (prevents infinite loading)
    setTimeout(() => {
        if (loader.parentNode && !loader.classList.contains('fade-out')) {
            hideLoader();
        }
    }, 3000); // 3 second maximum
};

// Initialize as early as possible
const initLoader = () => {
    window.RPM.initPageLoader();
};

// Run immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}