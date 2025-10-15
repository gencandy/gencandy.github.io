/**
 * Hero Section Animations
 * Handles video background animation with smooth loading and parallax scrolling
 */

window.RPM = window.RPM || {};

/**
 * Initialize Hero Video Parallax Effect
 * Creates sophisticated parallax scrolling with performance optimizations
 */
window.RPM.initHeroParallax = function() {
    const heroSection = document.querySelector('.hero-section');
    const videoContainer = document.querySelector('.hero-video');
    const video = document.querySelector('.hero-video video');
    
    if (!heroSection || !videoContainer || !video) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    const parallaxIntensity = 0.1; // Adjust for more/less parallax effect
    const scaleIntensity = 0.1; // Subtle scale effect
    
    const updateParallax = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const heroRect = heroSection.getBoundingClientRect();
        const heroTop = heroRect.top + scrollY;
        const heroHeight = heroRect.height;
        
        // Only apply parallax when hero section is in view
        if (scrollY < heroTop + heroHeight && scrollY + window.innerHeight > heroTop) {
            // Calculate progress through hero section (0 to 1)
            const progress = Math.max(0, Math.min(1, (scrollY - heroTop + window.innerHeight) / (heroHeight + window.innerHeight)));
            
            // Calculate parallax offset
            const parallaxOffset = (scrollY - heroTop) * parallaxIntensity;
            
            // Calculate subtle scale effect
            const scale = 1 + (progress * scaleIntensity);
            
            // Apply transforms with performance optimizations
            const transform = `translate3d(0, ${parallaxOffset}px, 0) scale(${scale})`;
            
            video.style.transform = transform;
            videoContainer.style.transform = `translate3d(0, ${parallaxOffset * 0.3}px, 0)`;
        }
        
        lastScrollY = scrollY;
        ticking = false;
    };
    
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize position
    updateParallax();
    
    // Return cleanup function
    return () => {
        window.removeEventListener('scroll', onScroll);
    };
};

/**
 * Initialize Hero Video Animation
 * Starts video playback and creates overlay fade effect (called after page loader)
 */
window.RPM.initHeroVideo = function() {
    const videoContainer = document.querySelector('.hero-video');
    const video = document.querySelector('.hero-video video');
    
    if (!videoContainer || !video) return;
    
    // Start video playback now that loader is gone
    video.play().catch(e => {
        console.log('Video autoplay prevented:', e);
    });
    
    // Create blue overlay for smooth loading
    const overlay = document.createElement('div');
    overlay.className = 'hero-video-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-brand-500);
        z-index: 1;
        will-change: opacity;
        transform: translate3d(0, 0, 0);
        transition: opacity 0.3s ease-out;
    `;
    
    // Add overlay to video container
    videoContainer.appendChild(overlay);
    
    // Optimize video for performance
    video.style.willChange = 'opacity, transform';
    video.style.transform = 'translate3d(0, 0, 0)';
    
    // Handle video ready state
    const handleVideoReady = () => {
        requestAnimationFrame(() => {
            video.classList.add('loaded');
            
            // Fade out overlay immediately
            overlay.style.opacity = '0';
            
            // Remove overlay after fade completes
            overlay.addEventListener('transitionend', () => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                    video.style.willChange = 'auto';
                }
            }, { once: true });
        });
    };
    
    // Listen for video ready states
    if (video.readyState >= 3) {
        // Video already loaded
        handleVideoReady();
    } else {
        video.addEventListener('canplaythrough', handleVideoReady, { once: true });
    }
    
    // Fallback: Remove overlay immediately if video doesn't load quickly
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.opacity = '0';
        }
    }, 500);
};

// Wait for page loader to finish before starting hero animations
const initializeHero = () => {
    // These will be called by the page loader after it fades out
    // No need to initialize here anymore
    console.log('Hero animations ready to be triggered');
};

// Listen for page animations ready event
document.addEventListener('pageAnimationsReady', () => {
    console.log('Page loader finished - starting hero animations');
    // Hero animations will be triggered by RPM.triggerPageAnimations()
});

// Fallback: Initialize after a delay if page loader doesn't exist
setTimeout(() => {
    if (!document.getElementById('pageLoader')) {
        // Page loader not found, initialize normally
        if (window.RPM.initHeroVideo) {
            window.RPM.initHeroVideo();
        }
        if (window.RPM.initHeroParallax) {
            window.RPM.initHeroParallax();
        }
        console.log('Hero animations initialized (fallback)');
    }
}, 1000);