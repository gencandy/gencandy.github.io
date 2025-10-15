// Who We Serve Section JavaScript
class WhoWeServeSection {
    constructor() {
        this.section = document.querySelector('.who-we-serve-section');
        this.items = document.querySelectorAll('.who-we-serve-item');
        this.imageWrapper = document.querySelector('.who-we-serve-image-wrapper');
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        // Only proceed if GSAP and ScrollTrigger are available
        if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
            // Animate the section title and subtitle
            gsap.from('.who-we-serve-subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.who-we-serve-section',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            gsap.from('.who-we-serve-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                delay: 0.2,
                scrollTrigger: {
                    trigger: '.who-we-serve-section',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            // Animate the list items with stagger
            gsap.from('.who-we-serve-item', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.15,
                delay: 0.4,
                scrollTrigger: {
                    trigger: '.who-we-serve-list',
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            // Animate the image with a subtle scale effect
            gsap.from('.who-we-serve-image-wrapper', {
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.6,
                scrollTrigger: {
                    trigger: '.who-we-serve-image-wrapper',
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupHoverEffects() {
        // Add hover effects to each item
        this.items.forEach(item => {
            const arrow = item.querySelector('.who-we-serve-arrow-icon');
            const text = item.querySelector('.who-we-serve-item-text');

            item.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(arrow, {
                        scale: 1.1,
                        rotation: 5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(text, {
                        x: 10,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                // Change cursor if custom cursor is available
                if (window.customCursor) {
                    window.customCursor.setText('Learn More');
                }
            });

            item.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(arrow, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(text, {
                        x: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                // Reset cursor if custom cursor is available
                if (window.customCursor) {
                    window.customCursor.resetText();
                }
            });

            // Add click functionality (placeholder for future navigation)
            item.addEventListener('click', () => {
                const itemText = text.textContent.trim();
                console.log(`Clicked on: ${itemText}`);
                
                // You can add navigation logic here
                // For example:
                // window.location.href = `/solutions/${itemText.toLowerCase().replace(/\s+/g, '-')}`;
            });
        });
    }

    // Public method to refresh animations if needed
    refresh() {
        if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
            gsap.ScrollTrigger.refresh();
        }
    }

    // Public method to destroy the instance
    destroy() {
        // Remove event listeners
        this.items.forEach(item => {
            item.removeEventListener('mouseenter', () => {});
            item.removeEventListener('mouseleave', () => {});
            item.removeEventListener('click', () => {});
        });

        // Kill GSAP animations
        if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
            gsap.ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && trigger.trigger.closest('.who-we-serve-section')) {
                    trigger.kill();
                }
            });
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.whoWeServeSection = new WhoWeServeSection();
});

// Re-initialize on window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.whoWeServeSection) {
        window.whoWeServeSection.refresh();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhoWeServeSection;
}