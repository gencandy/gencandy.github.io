/**
 * Header and Footer Animations
 * Handles animations for header, footer, and RPM text effects
 */

window.RPM = window.RPM || {};

/**
 * Initialize mini header visibility on scroll
 */
window.RPM.initStickyHeader = function() {
    const miniHeader = document.querySelector('.mini-header');
    const miniHeaderContainer = document.querySelector('.mini-header-container');
    const miniLogo = document.querySelector('.mini-logo');
    const miniWordInners = gsap.utils.toArray('.mini-logo-text .mini-logo-word-inner');
    
    if (!miniHeader) return;
    
    const SHOW_THRESHOLD = 200; // Show mini header after 200px
    const HIDE_TEXT_THRESHOLD = 600; // Hide logo text after another 400px (200 + 400)
    
    let ticking = false;
    let isTextHidden = false;
    let isHovering = false;
    let shadowAnimated = false;
    
    function updateMiniHeader() {
        const scrollY = window.scrollY;
        
        // Show/hide mini header
        if (scrollY > SHOW_THRESHOLD) {
            miniHeader.classList.add('visible');
            
            // Animate shadow opacity in (only shadow, not backdrop-filter)
            if (!shadowAnimated && miniHeaderContainer) {
                shadowAnimated = true;
                
                // Animate to full opacity shadow without affecting backdrop-filter
                gsap.to(miniHeaderContainer, {
                    boxShadow: 'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px, inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    duration: 2,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            }
            
            // Hide logo text after another 100px
            if (scrollY > HIDE_TEXT_THRESHOLD && !isTextHidden && !isHovering) {
                miniHeader.classList.add('hide-text');
                isTextHidden = true;
                
                // Animate text out with GSAP
                gsap.to(miniWordInners, {
                    y: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.in",
                    overwrite: 'auto'
                });
            }
            // Show logo text when scrolling back
            else if (scrollY <= HIDE_TEXT_THRESHOLD && isTextHidden) {
                miniHeader.classList.remove('hide-text');
                isTextHidden = false;
                
                // Animate text back in with GSAP
                gsap.to(miniWordInners, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
            }
        } else {
            miniHeader.classList.remove('visible');
            miniHeader.classList.remove('hide-text');
            isTextHidden = false;
            
            // Animate shadow opacity out when header is hidden
            if (miniHeaderContainer && shadowAnimated) {
                gsap.to(miniHeaderContainer, {
                    boxShadow: 'rgba(17, 17, 26, 0) 0px 8px 24px, rgba(17, 17, 26, 0) 0px 16px 56px, rgba(17, 17, 26, 0) 0px 24px 80px, inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    duration: 2,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
                shadowAnimated = false;
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateMiniHeader);
            ticking = true;
        }
    }
    
    // Hover interactions for logo
    if (miniLogo) {
        miniLogo.addEventListener('mouseenter', () => {
            isHovering = true;
            if (isTextHidden) {
                // Show text on hover
                gsap.to(miniWordInners, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
            }
        });
        
        miniLogo.addEventListener('mouseleave', () => {
            isHovering = false;
            if (isTextHidden && window.scrollY > HIDE_TEXT_THRESHOLD) {
                // Hide text on mouse leave if still scrolled past threshold
                gsap.to(miniWordInners, {
                    y: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.in",
                    overwrite: 'auto'
                });
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial check
    updateMiniHeader();
};

/**
 * Initialize mini header logo icon hover effect
 */
window.RPM.initMiniLogoHoverEffect = function() {
    const miniLogoIcon = document.querySelector('.mini-logo-icon');
    let rotationTween;
    
    if (!miniLogoIcon) return;
    
    miniLogoIcon.addEventListener('mouseenter', () => {
        // Scale up with elastic bounce
        gsap.to(miniLogoIcon, {
            scale: 1.15,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
        });
        
        // Slick continuous rotation on hover (matching main header)
        rotationTween = gsap.to(miniLogoIcon, {
            rotation: '+=360',
            duration: 1.2,
            ease: 'power2.inOut',
            repeat: -1,
            overwrite: 'auto'
        });
    });
    
    miniLogoIcon.addEventListener('mouseleave', () => {
        // Stop rotation smoothly
        if (rotationTween) {
            rotationTween.kill();
        }
        
        // Get current rotation and snap to nearest 360 degree increment
        const currentRotation = gsap.getProperty(miniLogoIcon, 'rotation');
        const nearestComplete = Math.round(currentRotation / 360) * 360;
        
        gsap.to(miniLogoIcon, {
            scale: 1,
            rotation: nearestComplete,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)'
        });
    });
};

/**
 * Initialize header logo entrance animation
 */
window.RPM.initHeaderLogoAnimation = function() {
    const headerLogoIcon = document.querySelector('.header-logo-icon');
    const wordInners = gsap.utils.toArray('.header-logo-text .logo-word-inner');
    
    if (!headerLogoIcon || wordInners.length === 0) return;
    
    // Set initial states
    gsap.set(headerLogoIcon, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        transformOrigin: "center center"
    });
    
    gsap.set(wordInners, {
        y: 30,
        opacity: 0
    });
    
    // Create entrance timeline
    const logoTimeline = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
            // After entrance animation completes, enable hover interactions
            initHeaderIconHoverEffect();
        }
    });
    
    // Icon animation - sophisticated multi-phase entrance
    logoTimeline
        // Phase 1: Initial pop with rotation
        .to(headerLogoIcon, {
            scale: 1.2,
            rotation: -90,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        })
        // Phase 2: Rotate to center with slight overshoot
        .to(headerLogoIcon, {
            rotation: 5,
            duration: 0.5,
            ease: "power1.inOut"
        })
        // Phase 3: Settle into final position with elastic bounce
        .to(headerLogoIcon, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        });
    
    // Text words animation - always animate in for main header
    logoTimeline.to(wordInners, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1.0"); // Overlap with icon animation
    
    /**
     * Initialize header icon hover effect (called after entrance animation)
     */
    function initHeaderIconHoverEffect() {
        const headerLogoIcon = document.querySelector('.header-logo-icon');
        let rotationTween;
        
        if (!headerLogoIcon) return;
        
        headerLogoIcon.addEventListener('mouseenter', () => {
            // Scale up with elastic bounce
            gsap.to(headerLogoIcon, {
                scale: 1.15,
                duration: 0.6,
                ease: 'elastic.out(1, 0.4)',
                overwrite: 'auto'
            });
            
            // Slick continuous rotation on hover
            rotationTween = gsap.to(headerLogoIcon, {
                rotation: '+=360',
                duration: 1.2,
                ease: 'power2.inOut',
                repeat: -1,
                overwrite: 'auto'
            });
        });
        
        headerLogoIcon.addEventListener('mouseleave', () => {
            // Stop rotation smoothly
            if (rotationTween) {
                rotationTween.kill();
            }
            
            // Get current rotation and snap to nearest 360 degree increment
            const currentRotation = gsap.getProperty(headerLogoIcon, 'rotation');
            const nearestComplete = Math.round(currentRotation / 360) * 360;
            
            gsap.to(headerLogoIcon, {
                scale: 1,
                rotation: nearestComplete,
                duration: 0.8,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    }
};

/**
 * Initialize footer RPM text animations
 */
window.RPM.initFooterRPMAnimation = function() {
    // No entrance animations - RPM text is static
};

/**
 * Initialize footer blue content entrance animations
 */
window.RPM.initFooterBlueContentAnimation = function() {
    // Set initial state for container only
    gsap.set(".footer-blue-content", {
        opacity: 0,
        y: 60,
        scale: 0.95
    });

    // Simple, sophisticated entrance animation
    gsap.to(".footer-blue-content", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
            trigger: ".footer-blue-content",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
};

/**
 * Initialize footer blue arrow animations
 */
window.RPM.initFooterArrowEffects = function() {
    gsap.utils.toArray(".footer-blue-arrow").forEach(arrow => {
        arrow.addEventListener("mouseenter", () => {
            gsap.to(arrow, {
                scale: 1.1,
                rotation: 15,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });
        
        arrow.addEventListener("mouseleave", () => {
            gsap.to(arrow, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        // Magnetic effect
        arrow.addEventListener("mousemove", (e) => {
            const rect = arrow.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.2;
            const deltaY = (e.clientY - centerY) * 0.2;
            
            gsap.to(arrow, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        arrow.addEventListener("mouseleave", () => {
            gsap.to(arrow, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
};

/**
 * Initialize footer vector icon mouse-following effect
 */
window.RPM.initFooterVectorMouseFollow = function() {
    const footerBlueContent = document.querySelector('.footer-blue-content');
    const vectorImage = document.querySelector('.footer-vector-image');
    
    if (!footerBlueContent || !vectorImage) return;
    
    // Set initial state for smooth animation
    gsap.set(vectorImage, {
        x: 0,
        y: 0,
        rotation: 0
    });
    
    // Track mouse movement within the footer blue content area
    footerBlueContent.addEventListener('mousemove', (e) => {
        const rect = footerBlueContent.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the container
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate delta from center (normalized to -1 to 1 range)
        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;
        
        // Apply subtle movement (max 30px in each direction)
        const moveX = deltaX * 30;
        const moveY = deltaY * 30;
        
        // Apply subtle rotation based on mouse position
        const rotation = deltaX * 5; // Max 5 degrees rotation
        
        // Animate the vector image with smooth easing
        gsap.to(vectorImage, {
            x: moveX,
            y: moveY,
            rotation: rotation,
            duration: 0.8,
            ease: "power2.out"
        });
    });
    
    // Reset position when mouse leaves
    footerBlueContent.addEventListener('mouseleave', () => {
        gsap.to(vectorImage, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)"
        });
    });
};

/**
 * Initialize footer logo entrance animation
 */
window.RPM.initFooterLogoAnimation = function() {
    const footerLogoIcon = document.querySelector('.footer-logo-icon');
    const wordInners = gsap.utils.toArray('.footer-logo-text .logo-word-inner');
    
    if (!footerLogoIcon || wordInners.length === 0) return;
    
    // Set initial states
    gsap.set(footerLogoIcon, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        transformOrigin: "center center"
    });
    
    gsap.set(wordInners, {
        y: 30,
        opacity: 0
    });
    
    // Create entrance timeline
    const logoTimeline = gsap.timeline({ paused: true });
    
    // Icon animation - sophisticated multi-phase entrance
    logoTimeline
        // Phase 1: Initial pop with rotation
        .to(footerLogoIcon, {
            scale: 1.2,
            rotation: -90,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        })
        // Phase 2: Rotate to center with slight overshoot
        .to(footerLogoIcon, {
            rotation: 5,
            duration: 0.5,
            ease: "power1.inOut"
        })
        // Phase 3: Settle into final position with elastic bounce
        .to(footerLogoIcon, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        });
    
    // Text words animation - staggered slide up (starts during icon animation)
    logoTimeline.to(wordInners, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1.0"); // Overlap with icon animation
    
    // Trigger animation when footer logo reaches 60% of viewport
    ScrollTrigger.create({
        trigger: '.footer-logo',
        start: 'top 80%',
        end: 'bottom top',
        // markers: true,  // Uncomment to debug
        onEnter: () => {
            logoTimeline.play();
        },
        onLeave: () => {
            // Animate out when scrolling past bottom
            logoTimeline.reverse();
        },
        onEnterBack: () => {
            // Play again when scrolling back into view
            logoTimeline.play();
        },
        onLeaveBack: () => {
            // Animate out when scrolling back up above 85%
            logoTimeline.reverse();
        }
    });
};

/**
 * Initialize all header and footer animations
 */
window.RPM.initHeaderFooterAnimations = function() {
    window.RPM.initStickyHeader();
    window.RPM.initHeaderLogoAnimation();
    window.RPM.initMiniLogoHoverEffect();
    window.RPM.initFooterRPMAnimation();
    window.RPM.initFooterBlueContentAnimation();
    window.RPM.initFooterArrowEffects();
    window.RPM.initFooterVectorMouseFollow();
    window.RPM.initFooterLogoAnimation();
    // Footer button animations handled by global-buttons.js
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initHeaderFooterAnimations();
    console.log('Header/Footer animations initialized');
});
