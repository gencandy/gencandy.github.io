/**
 * Common Animation Utilities
 * Reusable animation functions for headings, paragraphs, buttons, and badges
 */

window.RPM = window.RPM || {};

/**
 * Set Initial GSAP States Immediately
 * This runs when the script loads to prevent flash of unstyled content
 */
window.RPM.setInitialStates = function() {
    // Wait for GSAP to be available, but don't wait too long
    if (typeof gsap === 'undefined') {
        if (window.RPM.gsapWaitCount < 20) { // Max 1 second wait
            window.RPM.gsapWaitCount = (window.RPM.gsapWaitCount || 0) + 1;
            setTimeout(window.RPM.setInitialStates, 50);
        }
        return;
    }
    
    // Set initial states immediately for all animated elements
    // H2 animations - use CSS class to hide temporarily until SplitText is ready
    gsap.utils.toArray("h2").forEach((h2) => {
        if (!h2.closest('.how-it-works-step-content') && 
            !h2.closest('.footer-blue-section') &&
            !h2.closest('.footer-nav-links') &&
            !h2.closest('.footer-bottom') &&
            !h2.closest('.pay-as-you-go-carousel-track') &&
            !h2.closest('.social-proof-bar') &&
            !h2.closest('.success-card-testimonial') &&
            !h2.closest('.insights-advice-highlights') &&
            !h2.classList.contains('rpm-title')) {
            h2.style.visibility = 'hidden';  // Use visibility instead of opacity
        }
    });
    
    // H1 animations - hero headline uses SplitText, hide temporarily
    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline) {
        heroHeadline.style.visibility = 'hidden';  // Use visibility instead of opacity
    }
    gsap.utils.toArray("h1:not(.main-header):not(.hero-headline)").forEach((h1) => {
        if (!h1.closest('.footer-nav-links') && 
            !h1.closest('.footer-bottom') &&
            !h1.closest('.pay-as-you-go-carousel-track') &&
            !h1.closest('.social-proof-bar')) {
            gsap.set(h1, { y: 40, opacity: 0 });
        }
    });
    
    // H3, H4 animations
    gsap.utils.toArray("h3, h4").forEach((heading) => {
        if (!heading.closest('.how-it-works-step-content') && 
            !heading.closest('.footer-blue-section') &&
            !heading.closest('.footer-nav-links') &&
            !heading.closest('.footer-bottom') &&
            !heading.closest('.social-proof-bar') &&
            !heading.closest('.success-card-testimonial') &&
            !heading.classList.contains('success-card-title')) {
            gsap.set(heading, { y: 30, opacity: 0 });
        }
    });
    
    // Paragraph animations
    gsap.utils.toArray("p:not(.rpm-stat-number):not(.rpm-stat-label):not(.social-proof-subtitle):not(.testimonial-quote):not(.testimonial-author)").forEach((paragraph) => {
        if (!paragraph.closest('.how-it-works-step-content') && 
            !paragraph.closest('.footer-blue-section') && 
            !paragraph.closest('.footer-rpm-container') &&
            !paragraph.closest('.footer-nav-links') &&
            !paragraph.closest('.footer-bottom') &&
            !paragraph.closest('.pay-as-you-go-carousel-track') &&
            !paragraph.closest('.social-proof-bar') &&
            !paragraph.closest('.footer-phone-section') &&
            !paragraph.closest('.success-card-testimonial') &&
            !paragraph.closest('.insights-advice-highlights') &&
            !paragraph.closest('.btn-text-link')) {
            gsap.set(paragraph, { y: 20, opacity: 0 });
        }
    });
    
    // Footer phone section
    gsap.utils.toArray(".footer-phone-section").forEach((section) => {
        gsap.set(section, { y: 30, opacity: 0 });
    });
    
    console.log('Initial GSAP states set');
};

// Set initial states immediately when script loads
window.RPM.setInitialStates();



/**
 * Intelligent Section-Based Stagger System
 * Automatically detects elements within sections and staggers their animations
 */
window.RPM.calculateStaggerDelay = function(element) {
    // Exclude elements from sections that should not have stagger
    if (element.closest('.footer-nav-links') || 
        element.closest('.footer-bottom') ||
        element.closest('.pay-as-you-go-carousel-track') ||
        element.closest('.social-proof-bar') ||
        element.closest('.success-card-testimonial') ||
        element.classList.contains('testimonial-quote') ||
        element.classList.contains('testimonial-author')) {
        return 0; // No stagger for these sections
    }
    
    // Find the parent section
    const section = element.closest('section');
    if (!section) return 0;
    
    // Get all animated elements within this section (in DOM order)
    const animatedElements = Array.from(section.querySelectorAll('p, h1, h2:not(.rpm-title), h3, h4, .btn, .badge, [class*="badge"]'));
    
    // Find the index of current element
    const index = animatedElements.indexOf(element);
    if (index === -1) return 0;
    
    // Calculate delay based on position
    // First element = 0, second = 0.15s, third = 0.3s, etc.
    let baseDelay = index * 0.15;
    
    // Add extra delay for hero buttons to animate after paragraph
    if (element.closest('.hero-buttons')) {
        baseDelay += 1.5; // Extra delay for hero buttons
    }
    
    return baseDelay;
};

/**
 * Initialize H2 split text animations
 */
window.RPM.initH2Animations = function() {
    gsap.utils.toArray("h2:not(.social-proof-title):not(.rpm-title)").forEach((h2) => {
        // Skip if in excluded sections
        if (h2.closest('.footer-nav-links') || 
            h2.closest('.footer-bottom') ||
            h2.closest('.pay-as-you-go-carousel-track') ||
            h2.closest('.social-proof-bar') ||
            h2.closest('.success-card-testimonial') ||
            h2.closest('.insights-advice-highlights')) {  // Skip insights advice section
            return;
        }
        
        // Store original height to prevent layout shift
        const originalHeight = h2.offsetHeight;
        
        // Split text into words and lines for better control
        const split = new SplitText(h2, {
            type: "lines,words",
            linesClass: "line",
            wordsClass: "word"
        });
        
        // Wrap each word in a clipping container
        const wordWrappers = [];
        split.words.forEach(word => {
            // Create wrapper for clipping
            const wrapper = document.createElement('div');
            wrapper.className = 'word-wrapper';
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';
            
            // Create inner element for animation
            const inner = document.createElement('div');
            inner.className = 'word-inner';
            inner.style.display = 'inline-block';
            inner.innerHTML = word.innerHTML;
            
            // Replace word content with wrapped version
            word.innerHTML = '';
            word.appendChild(wrapper);
            wrapper.appendChild(inner);
            
            wordWrappers.push(inner);
        });
        
        // Set h2 to maintain its original height
        h2.style.minHeight = originalHeight + 'px';
        
        // Make the h2 visible now that SplitText structure is ready
        h2.style.visibility = 'visible';

        // Set initial state - words clipped and transformed
        gsap.set(wordWrappers, {
            y: '100%',
            opacity: 0
        });

        // Calculate stagger delay based on section position
        const staggerDelay = window.RPM.calculateStaggerDelay(h2);

        // Create the reveal animation with ScrollTrigger - play once on enter
        const headingTimeline = gsap.timeline({ paused: true, delay: staggerDelay });
        headingTimeline.to(wordWrappers, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out"
        });

        ScrollTrigger.create({
            trigger: h2,
            start: "top 85%",
            onEnter: () => headingTimeline.play(),
            onRefresh: (self) => {
                // If already in view on page load, play immediately
                if (self.isActive) {
                    headingTimeline.play();
                }
            }
        });
    });
};

/**
 * Initialize H3 and H4 animations
 */
window.RPM.initHeadingAnimations = function() {
    gsap.utils.toArray("h3, h4").forEach((heading) => {
        if (heading.closest('.how-it-works-step-content') || 
            heading.closest('.footer-blue-section') ||
            heading.closest('.footer-nav-links') ||
            heading.closest('.footer-bottom') ||
            heading.closest('.social-proof-bar') ||
            heading.closest('.success-card-testimonial') ||
            heading.classList.contains('success-card-title')) {  // Exclude success card titles
            return;
        }
        
        gsap.set(heading, { y: 30, opacity: 0 });
        
        const staggerDelay = window.RPM.calculateStaggerDelay(heading);
        
        const headingTimeline = gsap.timeline({ paused: true, delay: staggerDelay });
        headingTimeline.to(heading, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: heading,
            start: "top 85%",
            onEnter: () => headingTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) headingTimeline.play();
            }
        });
    });
};

/**
 * Initialize H1 animations (if any outside header)
 */
window.RPM.initH1Animations = function() {
    // Hero headline gets special split-text treatment like H2
    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline) {
        // Store original height to prevent layout shift
        const originalHeight = heroHeadline.offsetHeight;
        
        // Split text into words and lines for better control
        const split = new SplitText(heroHeadline, {
            type: "lines,words",
            linesClass: "line",
            wordsClass: "word"
        });
        
        // Wrap each word in a clipping container
        const wordWrappers = [];
        split.words.forEach(word => {
            // Create wrapper for clipping
            const wrapper = document.createElement('div');
            wrapper.className = 'word-wrapper';
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';
            
            // Create inner element for animation
            const inner = document.createElement('div');
            inner.className = 'word-inner';
            inner.style.display = 'inline-block';
            inner.innerHTML = word.innerHTML;
            
            // Replace word content with wrapped version
            word.innerHTML = '';
            word.appendChild(wrapper);
            wrapper.appendChild(inner);
            
            wordWrappers.push(inner);
        });
        
        // Set h1 to maintain its original height
        heroHeadline.style.minHeight = originalHeight + 'px';
        
        // Make the h1 visible now that SplitText structure is ready
        heroHeadline.style.visibility = 'visible';

        // Set initial state - words clipped and transformed
        gsap.set(wordWrappers, {
            y: '100%',
            opacity: 0
        });

        // Create the reveal animation with ScrollTrigger - play once on enter
        const headlineTimeline = gsap.timeline({ paused: true });
        headlineTimeline.to(wordWrappers, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out"
        });

        ScrollTrigger.create({
            trigger: heroHeadline,
            start: "top 85%",
            onEnter: () => headlineTimeline.play(),
            onRefresh: (self) => {
                // If already in view on page load, play immediately
                if (self.isActive) {
                    headlineTimeline.play();
                }
            }
        });
    }
    
    // Regular H1 animations for other H1s
    gsap.utils.toArray("h1:not(.main-header):not(.hero-headline)").forEach((h1) => {
        // Skip if in excluded sections
        if (h1.closest('.footer-nav-links') || 
            h1.closest('.footer-bottom') ||
            h1.closest('.pay-as-you-go-carousel-track') ||
            h1.closest('.social-proof-bar')) {
            return;
        }
        
        gsap.set(h1, {
            y: 40,
            opacity: 0
        });
        
        const staggerDelay = window.RPM.calculateStaggerDelay(h1);
        
        const h1Timeline = gsap.timeline({ paused: true, delay: staggerDelay });
        h1Timeline.to(h1, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: h1,
            start: "top 85%",
            onEnter: () => h1Timeline.play(),
            onRefresh: (self) => {
                if (self.isActive) {
                    h1Timeline.play();
                }
            }
        });
    });
};

/**
 * Initialize paragraph animations
 */
window.RPM.initParagraphAnimations = function() {
    gsap.utils.toArray("p:not(.rpm-stat-number):not(.rpm-stat-label):not(.social-proof-subtitle):not(.testimonial-quote):not(.testimonial-author)").forEach((paragraph) => {
        if (paragraph.closest('.how-it-works-step-content') || 
            paragraph.closest('.footer-blue-section') || 
            paragraph.closest('.footer-rpm-container') ||
            paragraph.closest('.footer-nav-links') ||
            paragraph.closest('.footer-bottom') ||
            paragraph.closest('.pay-as-you-go-carousel-track') ||
            paragraph.closest('.social-proof-bar') ||
            paragraph.closest('.footer-phone-section') ||
            paragraph.closest('.success-card-testimonial') ||
            paragraph.closest('.insights-advice-highlights') ||
            paragraph.closest('.btn-text-link')) {  // Skip text inside text link buttons - parent animates
            return;
        }
        
        gsap.set(paragraph, { y: 20, opacity: 0 });
        
        const staggerDelay = window.RPM.calculateStaggerDelay(paragraph);
        
        const paragraphTimeline = gsap.timeline({ paused: true, delay: staggerDelay });
        paragraphTimeline.to(paragraph, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: paragraph,
            start: "top 85%",
            onEnter: () => paragraphTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) paragraphTimeline.play();
            }
        });
    });
};

/**
 * Initialize badge animations
 */
window.RPM.initBadgeAnimations = function() {
    gsap.utils.toArray(".insights-advice-badge, .badge, [class*='badge']:not(.badge-dot)").forEach((badge) => {
        // Skip if in excluded sections
        if (badge.closest('.footer-nav-links') || 
            badge.closest('.footer-bottom') ||
            badge.closest('.pay-as-you-go-carousel-track') ||
            badge.closest('.social-proof-bar') ||
            badge.closest('.insights-advice-highlights')) { // Skip insights advice - it handles its own
            return;
        }
        
        // Badge will be initialized in CSS as opacity: 0, scale: 0.9
        
        const staggerDelay = window.RPM.calculateStaggerDelay(badge);
        
        const badgeTimeline = gsap.timeline({ paused: true, delay: staggerDelay });
        badgeTimeline.to(badge, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.2)"
        });
        
        ScrollTrigger.create({
            trigger: badge,
            start: "top 85%",
            onEnter: () => badgeTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) badgeTimeline.play();
            }
        });
    });
};

/**
 * Initialize footer phone section animation
 * Animates the entire phone section as one unit
 */
window.RPM.initFooterPhoneSection = function() {
    gsap.utils.toArray(".footer-phone-section").forEach((section) => {
        gsap.set(section, { y: 30, opacity: 0 });
        
        const staggerDelay = window.RPM.calculateStaggerDelay(section);
        // Add extra delay for phone section to stagger more
        const extendedDelay = staggerDelay + 0.2;
        
        const sectionTimeline = gsap.timeline({ paused: true, delay: extendedDelay });
        sectionTimeline.to(section, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: section,
            start: "top 85%",
            onEnter: () => sectionTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) sectionTimeline.play();
            }
        });
    });
};

/**
 * Initialize diagonal icon swap animation for text CTAs
 * Premium diagonal arrow swap effect with Awwwards-worthy easing
 */
window.RPM.initDiagonalIconSwap = function() {
    // Now targeting all text link buttons with the global class
    const ctas = gsap.utils.toArray('.btn-text-link');
        
        ctas.forEach((cta) => {
            // Don't set opacity here - let entrance animation handle it
            
            const icon = cta.querySelector('[class*="-icon"]');
            if (!icon) return;
            
            const iconSvg = icon.querySelector('svg');
            if (!iconSvg) return;
            
            // Ensure overflow hidden for clean clipping
            icon.style.overflow = 'hidden';
            
            // Set initial state
            gsap.set(iconSvg, { x: 0, y: 0, opacity: 1 });
            
            let hoverTimeline = null;
            
            // Hover in - sophisticated diagonal swap with momentum
            cta.addEventListener('mouseenter', () => {
                // Kill any existing animation
                if (hoverTimeline) hoverTimeline.kill();
                
                hoverTimeline = gsap.timeline();
                
                // Step 1: Arrow accelerates out with scale for depth
                hoverTimeline.to(iconSvg, {
                    x: 32,
                    y: -32,
                    opacity: 0,
                    duration: 0.35,
                    ease: 'power2.in',
                    onComplete: () => {
                        // Reset position instantly while invisible
                        gsap.set(iconSvg, { x: -32, y: 32 });
                    }
                });
                
                // Step 2: Brief pause for dramatic effect
                hoverTimeline.add(() => {}, '+=0.08');
                
                // Step 3: Replacement arrives with smooth deceleration and spring
                hoverTimeline.to(iconSvg, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    ease: 'expo.out'
                });
            });
            
            // Hover out - return to original with elegant timing
            cta.addEventListener('mouseleave', () => {
                // Kill any existing animation
                if (hoverTimeline) hoverTimeline.kill();
                
                hoverTimeline = gsap.timeline();
                
                // Quick exit
                hoverTimeline.to(iconSvg, {
                    x: 32,
                    y: -32,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        gsap.set(iconSvg, { x: -32, y: 32 });
                    }
                });
                
                hoverTimeline.add(() => {}, '+=0.08');
                
                // Smooth return
                hoverTimeline.to(iconSvg, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'expo.out'
                });
            });
        });
};

/**
 * Initialize all common animations
 */
window.RPM.initCommonAnimations = function() {
    window.RPM.initH2Animations();
    window.RPM.initHeadingAnimations();
    window.RPM.initH1Animations();
    window.RPM.initParagraphAnimations();
    window.RPM.initFooterPhoneSection();
    window.RPM.initBadgeAnimations();
    window.RPM.initDiagonalIconSwap();
};

// Wait for page loader to finish before starting common animations
document.addEventListener('pageAnimationsReady', () => {
    window.RPM.initCommonAnimations();
    console.log('Common animations initialized after page loader');
});

// Fallback: Initialize after delay if page loader doesn't exist
setTimeout(() => {
    if (!document.getElementById('pageLoader')) {
        // Page loader not found, initialize normally
        window.RPM.initCommonAnimations();
        console.log('Common animations initialized (fallback)');
    }
}, 1000);
