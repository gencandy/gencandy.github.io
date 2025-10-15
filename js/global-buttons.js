/**
 * Global Button Interactions
 * Universal animated button system with icon swipe and sheen effects
 * Handles all button types: Primary Light, Primary Dark, Primary Dark XL, Secondary White, Secondary Outline
 * 
 * NO ENTRANCE ANIMATIONS - Clean slate for custom animations per section
 */

window.RPM = window.RPM || {};

/**
 * Initialize a single animated button with icon swipe effect
 * Works with: btn-primary-light, btn-primary-dark, btn-primary-dark-xl
 * NO entrance animation - only hover effects
 */
window.RPM.initAnimatedButton = function(options = {}) {
    const {
        buttonSelector,
        iconWrapperSelector = '.icon-wrapper',
        arrowIconSelector = '.arrow-icon',
        textSelector = '.cta-text',
        leftTextSelector = '.cta-text-left',
        rightPadding = 28,
        sheenEffect = true,
        rotateIcon = true
    } = options;

    const button = typeof buttonSelector === 'string' 
        ? document.querySelector(buttonSelector) 
        : buttonSelector;
    
    if (!button) return;
    
    const iconWrapper = button.querySelector(iconWrapperSelector);
    const arrowIcon = button.querySelector(arrowIconSelector);
    const textSpan = button.querySelector(textSelector);
    const leftTextSpan = button.querySelector(leftTextSelector);
    
    if (!iconWrapper) return;
    
    gsap.set(iconWrapper, { x: 0 });
    
    // Helper function to update text clipping
    const updateTextClipping = () => {
        const currentIconRect = iconWrapper.getBoundingClientRect();
        
        if (textSpan) {
            const textRect = textSpan.getBoundingClientRect();
            const clipAmount = Math.max(0, currentIconRect.right - textRect.left);
            const clipPercent = Math.min(100, (clipAmount / textRect.width) * 100);
            
            gsap.set(textSpan, {
                clipPath: `inset(0% 0% 0% ${clipPercent}%)`,
                opacity: 1 - (clipPercent / 100)
            });
        }
        
        if (leftTextSpan) {
            const leftTextRect = leftTextSpan.getBoundingClientRect();
            const uncoveredAmount = Math.max(0, currentIconRect.left - leftTextRect.left);
            const revealPercent = Math.min(100, (uncoveredAmount / leftTextRect.width) * 100);
            
            gsap.set(leftTextSpan, {
                clipPath: `inset(0% ${100 - revealPercent}% 0% 0%)`,
                opacity: revealPercent / 100
            });
        }
    };
    
    // NO entrance animation - button appears immediately
    // Only hover interactions below
    
    // Hover animation
    button.addEventListener('mouseenter', () => {
        // No need to pause iconTimeline since we removed entrance animation
        
        const buttonRect = button.getBoundingClientRect();
        const iconRect = iconWrapper.getBoundingClientRect();
        const targetPosition = buttonRect.width - iconRect.width - rightPadding;
        
        gsap.to(iconWrapper, {
            x: targetPosition,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
            onUpdate: updateTextClipping
        });
        
        if (rotateIcon && arrowIcon) {
            gsap.to(arrowIcon, {
                rotation: 45,
                duration: 0.7,
                ease: "back.out(1.7)",
                overwrite: true
            });
        }
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(iconWrapper, {
            x: 0,
            duration: 1,
            ease: "bounce.out",
            overwrite: true,
            onUpdate: updateTextClipping
        });
        
        if (rotateIcon && arrowIcon) {
            gsap.to(arrowIcon, {
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.6)",
                overwrite: true
            });
        }
    });
};

/**
 * Initialize all primary buttons (with icon swipe)
 * Auto-detects: .btn-primary-light, .btn-primary-dark, .btn-primary-dark-xl
 * NO entrance animations - only hover effects
 */
window.RPM.initAllPrimaryButtons = function() {
    // Primary Light buttons (white background)
    gsap.utils.toArray('.btn-primary-light').forEach((button) => {
        window.RPM.initAnimatedButton({
            buttonSelector: button,
            rightPadding: 12,
            sheenEffect: true,
            rotateIcon: true
        });
    });

    // Primary Dark buttons (blue background)
    gsap.utils.toArray('.btn-primary-dark').forEach((button) => {
        window.RPM.initAnimatedButton({
            buttonSelector: button,
            rightPadding: 12,
            sheenEffect: true,
            rotateIcon: true
        });
    });

    // Primary Dark XL buttons (large buttons, typically in footer)
    gsap.utils.toArray('.btn-primary-dark-xl').forEach((button) => {
        window.RPM.initAnimatedButton({
            buttonSelector: button,
            rightPadding: 28,
            sheenEffect: true,
            rotateIcon: true
        });
    });
};

/**
 * Initialize all secondary buttons (no icon, simple hover)
 * Auto-detects: .btn-secondary-white, .btn-secondary-outline
 * NO entrance animations - buttons appear immediately
 */
window.RPM.initAllSecondaryButtons = function() {
    // Add cursor-reactive effect to outline buttons
    gsap.utils.toArray('.btn-secondary-outline').forEach((button) => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.add('is-hovered');
        });
        
        button.addEventListener('mouseleave', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.remove('is-hovered');
        });
    });
    
    // Add cursor-reactive effect to white buttons with GSAP text animation
    gsap.utils.toArray('.btn-secondary-white').forEach((button) => {
        const words = button.querySelectorAll('.cta-text .word');
        const isInsightsButton = button.classList.contains('btn-insights');
        
        // Determine timing based on button type
        const duration = isInsightsButton ? 0.75 : 0.95;
        const stagger = isInsightsButton ? 0.05 : 0.04;
        
        // Store timeline on button for cleanup
        button._textTimeline = null;
        
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.add('is-hovered');
            
            // Kill any existing timeline to prevent glitches
            if (this._textTimeline) {
                this._textTimeline.kill();
            }
            
            // Reset words to starting position
            gsap.set(words, { yPercent: 0 });
            
            // GSAP text animation - stagger clip up, then stagger clip in from bottom
            const tl = gsap.timeline();
            this._textTimeline = tl;
            
            // Stagger out the top - elegant expo ease
            tl.to(words, {
                yPercent: -110,
                duration: duration * 0.45,
                stagger: stagger,
                ease: "expo.inOut"
            });
            
            // Set to bottom position (no stagger, instant)
            tl.set(words, { yPercent: 110 });
            
            // Stagger in from bottom - smooth, refined ease
            tl.to(words, {
                yPercent: 0,
                duration: duration * 0.45,
                stagger: stagger,
                ease: "expo.out"
            });
        });
        
        button.addEventListener('mouseleave', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.remove('is-hovered');
            
            // Kill timeline and reset to default state
            if (this._textTimeline) {
                this._textTimeline.kill();
                this._textTimeline = null;
            }
            gsap.to(words, {
                yPercent: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        });
    });
    
    // Add cursor-reactive effect to outline buttons with GSAP text animation
    gsap.utils.toArray('.btn-secondary-outline').forEach((button) => {
        const words = button.querySelectorAll('.cta-text .word');
        const duration = 0.75;
        const stagger = 0.05;
        
        // Store timeline on button for cleanup
        button._textTimeline = null;
        
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.add('is-hovered');
            
            // Kill any existing timeline to prevent glitches
            if (this._textTimeline) {
                this._textTimeline.kill();
            }
            
            // Reset words to starting position
            gsap.set(words, { yPercent: 0 });
            
            // GSAP text animation - stagger clip up, then stagger clip in from bottom
            const tl = gsap.timeline();
            this._textTimeline = tl;
            
            // Stagger out the top - elegant expo ease
            tl.to(words, {
                yPercent: -110,
                duration: duration * 0.45,
                stagger: stagger,
                ease: "expo.inOut"
            });
            
            // Set to bottom position (no stagger, instant)
            tl.set(words, { yPercent: 110 });
            
            // Stagger in from bottom - smooth, refined ease
            tl.to(words, {
                yPercent: 0,
                duration: duration * 0.45,
                stagger: stagger,
                ease: "expo.out"
            });
        });
        
        button.addEventListener('mouseleave', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
            this.classList.remove('is-hovered');
            
            // Kill timeline and reset to default state
            if (this._textTimeline) {
                this._textTimeline.kill();
                this._textTimeline = null;
            }
            gsap.to(words, {
                yPercent: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        });
    });
};

/**
 * Global entrance animation for ALL buttons
 * Fade in up animation at 85% viewport with stagger delay
 * Buttons come in last after other content in their section
 * 
 * EXCEPTIONS:
 * - .btn-header (header button has custom/no animation)
 * - .btn-social-proof (social proof button has custom animation)
 * - .btn-text-link (text link buttons have their own system)
 */
window.RPM.initGlobalButtonEntranceAnimations = function() {
    gsap.utils.toArray('.btn:not(.btn-text-link)').forEach((button) => {
        // Skip header button - it should be immediately visible or has custom animation
        if (button.classList.contains('btn-header')) {
            gsap.set(button, { opacity: 1, y: 0 }); // Ensure it's visible
            return;
        }
        
        // Skip social proof button - it has custom animation in social-proof.js
        if (button.classList.contains('btn-social-proof')) {
            gsap.set(button, { opacity: 1, y: 0 }); // Ensure it's visible
            return;
        }
        
        // Set initial state for all other buttons
        gsap.set(button, { 
            opacity: 0, 
            y: 30 
        });
        
        // Calculate stagger delay
        // Buttons appear after other elements, so add base delay
        const staggerDelay = window.RPM.calculateStaggerDelay ? 
            window.RPM.calculateStaggerDelay(button) : 0;
        const buttonExtraDelay = 0.3; // Extra delay so buttons come in after text/images
        const totalDelay = staggerDelay + buttonExtraDelay;
        
        // Create entrance animation timeline
        const entranceTimeline = gsap.timeline({ 
            paused: true, 
            delay: totalDelay 
        });
        
        entranceTimeline.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        // Trigger on scroll
        ScrollTrigger.create({
            trigger: button,
            start: "top 85%",
            onEnter: () => entranceTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) entranceTimeline.play();
            }
        });
    });
};

/**
 * Text link button entrance animations
 * Simple fade in for text link buttons with section-specific handling
 */
window.RPM.initTextLinkButtonEntranceAnimations = function() {
    gsap.utils.toArray('.btn-text-link').forEach((button) => {
        // Set initial state
        gsap.set(button, { 
            opacity: 0, 
            y: 20  // Smaller y offset for text links
        });
        
        // Calculate stagger delay
        const staggerDelay = window.RPM.calculateStaggerDelay ? 
            window.RPM.calculateStaggerDelay(button) : 0;
        const buttonExtraDelay = 0.2; // Slightly less delay than primary buttons
        const totalDelay = staggerDelay + buttonExtraDelay;
        
        // Create entrance animation timeline
        const entranceTimeline = gsap.timeline({ 
            paused: true, 
            delay: totalDelay 
        });
        
        entranceTimeline.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        });
        
        // Trigger on scroll
        ScrollTrigger.create({
            trigger: button,
            start: "top 85%",
            onEnter: () => entranceTimeline.play(),
            onRefresh: (self) => {
                if (self.isActive) entranceTimeline.play();
            }
        });
    });
};

/**
 * Initialize ALL global buttons
 * Call this once in main.js
 */
window.RPM.initAllGlobalButtons = function() {
    window.RPM.initAllPrimaryButtons();
    window.RPM.initAllSecondaryButtons();
    window.RPM.initGlobalButtonEntranceAnimations();
    window.RPM.initTextLinkButtonEntranceAnimations();
    
    console.log('✓ Global button system initialized with entrance animations');
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.RPM.initAllGlobalButtons();
    });
} else {
    window.RPM.initAllGlobalButtons();
}
