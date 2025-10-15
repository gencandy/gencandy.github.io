/**
 * Button Interactions
 * Universal animated button system with icon swipe and sheen effects
 */

window.RPM = window.RPM || {};

/**
 * Initialize a single animated button
 */
window.RPM.initAnimatedButton = function(options = {}) {
    const {
        buttonSelector,
        iconWrapperSelector = '.icon-wrapper',
        arrowIconSelector = '.arrow-icon',
        textSelector = '.cta-text',
        leftTextSelector = '.cta-text-left',
        rightPadding = 28,
        entranceAnimation = true,
        scrollTrigger = true,
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
    
    // Entrance animation
    let iconTimeline;
    if (entranceAnimation) {
        iconTimeline = gsap.timeline({ paused: true });
        
        iconTimeline
            .to(iconWrapper, { x: 0, duration: 0.3, ease: "power2.out" })
            .to(iconWrapper, { duration: 0.5 })
            .to(iconWrapper, { x: 20, duration: 0.2, ease: "power2.out" })
            .to(iconWrapper, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        
        if (scrollTrigger) {
            ScrollTrigger.create({
                trigger: button,
                start: "top 85%",
                end: "bottom 15%",
                onEnter: () => iconTimeline.play(),
                onRefresh: (self) => {
                    if (self.isActive) iconTimeline.play();
                }
            });
        }
    }
    
    // Sheen effect
    if (sheenEffect) {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            button.style.setProperty('--mouse-x', `${x}%`);
            button.style.setProperty('--mouse-y', `${y}%`);
        });
    }
    
    // Hover animation
    button.addEventListener('mouseenter', () => {
        if (iconTimeline) iconTimeline.pause();
        
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
 * Initialize multiple animated buttons
 */
window.RPM.initMultipleAnimatedButtons = function(selector, options = {}) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
        window.RPM.initAnimatedButton({
            buttonSelector: button,
            ...options
        });
    });
};

/**
 * Initialize all button interactions
 */
window.RPM.initButtonInteractions = function() {
    const defaultOptions = {
        entranceAnimation: true,
        scrollTrigger: true,
        sheenEffect: true,
        rotateIcon: true
    };
    
    // Footer CTA buttons - standard blue version
    window.RPM.initMultipleAnimatedButtons('.footer-cta-button:not(.white-variant):not(.blue-variant)', {
        ...defaultOptions,
        rightPadding: 28
    });
    
    // Footer CTA buttons - white variant
    window.RPM.initMultipleAnimatedButtons('.footer-cta-button.white-variant', {
        ...defaultOptions,
        rightPadding: 12
    });
    
    // Footer CTA buttons - blue variant
    window.RPM.initMultipleAnimatedButtons('.footer-cta-button.blue-variant', {
        ...defaultOptions,
        rightPadding: 12
    });
    
    // Legacy how-it-works CTA
    window.RPM.initMultipleAnimatedButtons('.how-it-works-cta', {
        ...defaultOptions,
        rightPadding: 12
    });
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initButtonInteractions();
});
