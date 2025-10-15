/**
 * Social Proof Bar Animations
 * Handles scroll-based diagonal logo animations with 3D transformation timeline
 * Note: Content animations (subtitle, h2, button) are handled by animations-common.js
 */

window.RPM = window.RPM || {};

/**
 * Initialize social proof bar animations
 */
window.RPM.initSocialProof = function() {
    if (!document.querySelector('.social-proof-bar')) return;
    
    const logoContainer = document.querySelector('.social-proof-logos');
    const logoGridWrapper = document.querySelector('.logo-grid-wrapper');
    const logoRows = gsap.utils.toArray('.logo-row');
    
    if (!logoContainer || !logoGridWrapper) return;
    
    // =====================================================
    // PIN: Logo container to top of screen
    // =====================================================
    
    ScrollTrigger.create({
        trigger: '.social-proof-logos',
        start: 'top top',
        end: 'bottom bottom',
        endTrigger: '.social-proof-bar',
        pin: true,
        pinSpacing: false,
        // markers: true
    });
    
    // =====================================================
    // PIN: Content container - stays pinned until 500px from bottom
    // =====================================================
    
    const contentContainer = document.querySelector('.social-proof-container');
    if (contentContainer) {
        ScrollTrigger.create({
            trigger: '.social-proof-bar',
            start: 'top top',
            end: 'bottom-=0 bottom',     // Unpin 500px before section ends
            pin: contentContainer,
            pinSpacing: false,
            // markers: true
        });
    }
    
    // =====================================================
    // MASTER TIMELINE: Full logo animation sequence
    // =====================================================
    
    const masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.social-proof-bar',
            start: 'top bottom',        // Start when section enters viewport
            end: 'bottom bottom',       // End at bottom of section
            scrub: 1.5,
            // markers: true
        }
    });
    
    // Set initial state - invisible and off to the left
    gsap.set(logoGridWrapper, {
        x: -200,
        marginRight: '70%',         // Start far right
        rotateZ: 0,
        rotateX: 0,
        skewX: 0,
        scale: 1
    });
    
    // Set initial opacity for each row - descending opacity (70%, 40%, 10% for rows 2-4)
    gsap.set(logoRows[0], { opacity: 0.1 });      // Row 1: 100%
    gsap.set(logoRows[1], { opacity: 0.1 });    // Row 2: 70%
    gsap.set(logoRows[2], { opacity: 0.1 });    // Row 3: 40%
    gsap.set(logoRows[3], { opacity: 0.1 });    // Row 4: 10%
    
    // PHASE 1: Fade in and slide in from left (15% of timeline)
    masterTimeline.to(logoGridWrapper, {
        x: 0,
        opacity: 1,
        duration: 0.15,              // 15% of scroll
        ease: "power2.out"
    });
    
    // Row opacity fade-ins - staggered to approximate when each enters viewport
    // Using "<" to start at beginning of previous animation, with delay offsets
    masterTimeline.to(logoRows[0], { opacity: 1, duration: 0.1, ease: "power2.out" }, "<0.1");         // Row 1: starts with Phase 1
    masterTimeline.to(logoRows[1], { opacity: 1, duration: 0.1, ease: "power2.out" }, "<0.1");     // Row 2: +0.05s delay
    masterTimeline.to(logoRows[2], { opacity: 1, duration: 0.1, ease: "power2.out" }, "<0.12");      // Row 3: +0.1s delay
    masterTimeline.to(logoRows[3], { opacity: 1, duration: 0.1, ease: "power2.out" }, "<0.1");     // Row 4: +0.15s delay
    
    // PHASE 2: Hold position (20% of timeline) - starts at 0.15 (after Phase 1)
    masterTimeline.to(logoGridWrapper, {
        x: 0,                       // Stay in place
        duration: 0.2,              // 20% hold
        ease: "none"
    }, 0.15);                       // Explicit position after Phase 1
    
    // PHASE 3: Smooth perspective transformation + margin shift (30% of timeline) - starts at 0.35
    masterTimeline.to(logoGridWrapper, {
        rotateZ: -34,
        rotateX: 15,
        skewX: 20,
        scale: 0.95,
        marginRight: '-10%',
        marginTop: '10%',         // Final position
        duration: 0.3,              // 30% smooth transform
        ease: "power1.inOut"        // Smooth easing
    }, 0.35);                       // Explicit position after Phase 2
    
    // PHASE 4: Hold at resting position (15% of timeline - reaches 80% total) - starts at 0.65
    masterTimeline.to(logoGridWrapper, {
        rotateZ: -34,               // Maintain final rotation
        rotateX: 15,
        skewX: 20,
        scale: 0.95,
        marginRight: '-10%',
        marginTop: '10%',
        duration: 0.15,              // 15% hold (total now 80%)
        ease: "none"
    }, 0.65);                       // Explicit position after Phase 3
    
    // PHASE 5: Content animations (auto-play, not scrubbed)
    // Note: Button animations are handled by global-buttons.js with exclusion for this section
    const subtitle = document.querySelector('.social-proof-subtitle');
    const h2 = document.querySelector('.social-proof-title');
    
    // Subtitle animation (paragraph style: y: 20, opacity: 0 -> y: 0, opacity: 1)
    if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0, clearProps: 'none' });
        
        const subtitleTimeline = gsap.timeline({ paused: true });
        subtitleTimeline.to(subtitle, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: '.social-proof-bar',
            start: 'top+=60% bottom',
            end: 'bottom+=200 top',
            onEnter: () => {
                subtitleTimeline.timeScale(1); // Normal speed forward
                subtitleTimeline.play();
            },
            onLeaveBack: () => {
                subtitleTimeline.timeScale(5); // 200% speed for reverse
                subtitleTimeline.reverse();
            }
        });
    }
    
    // H2 animation (word-by-word split text)
    if (h2) {
        const originalHeight = h2.offsetHeight;
        
        // Split text into words
        const split = new SplitText(h2, {
            type: "lines,words",
            linesClass: "line",
            wordsClass: "word"
        });
        
        // Wrap each word in a clipping container
        const wordWrappers = [];
        split.words.forEach(word => {
            const wrapper = document.createElement('div');
            wrapper.className = 'word-wrapper';
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';
            
            const inner = document.createElement('div');
            inner.className = 'word-inner';
            inner.style.display = 'inline-block';
            inner.innerHTML = word.innerHTML;
            
            word.innerHTML = '';
            word.appendChild(wrapper);
            wrapper.appendChild(inner);
            
            wordWrappers.push(inner);
        });
        
        h2.style.minHeight = originalHeight + 'px';
        
        // Set initial state - words clipped
        gsap.set(wordWrappers, {
            y: '100%',
            opacity: 0,
            clearProps: 'none'
        });
        
        // Animate words in with stagger
        const h2Timeline = gsap.timeline({ paused: true });
        h2Timeline.to(wordWrappers, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: '.social-proof-bar',
            start: 'top+=72% bottom',
            end: 'bottom+=200 top',
            onEnter: () => {
                h2Timeline.timeScale(1); // Normal speed forward
                h2Timeline.play();
            },
            onLeaveBack: () => {
                h2Timeline.timeScale(5); // 200% speed for reverse
                h2Timeline.reverse();
            }
        });
    }
    
    // Button animation (synced with content entrance timing)
    const button = document.querySelector('.btn-social-proof');
    if (button) {
        // Set initial state
        gsap.set(button, { y: 30, opacity: 0, clearProps: 'none' });
        
        const buttonTimeline = gsap.timeline({ paused: true });
        buttonTimeline.to(button, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        ScrollTrigger.create({
            trigger: '.social-proof-bar',
            start: 'top+=80% bottom', // Comes in after h2 (which starts at 72%)
            end: 'bottom+=200 top',
            onEnter: () => {
                buttonTimeline.timeScale(1); // Normal speed forward
                buttonTimeline.play();
            },
            onLeaveBack: () => {
                buttonTimeline.timeScale(5); // 200% speed for reverse
                buttonTimeline.reverse();
            }
        });
    }
    
    // =====================================================
    // PARALLAX: Horizontal row movement with varying speeds
    // =====================================================
    
    logoRows.forEach((row, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        
        // Different distance and speed for each row
        const distances = [400, 300, 500, 350];  // Varying distances
        const speeds = [1.2, 1.8, 1.0, 1.5];     // Varying scrub speeds
        
        const distance = distances[index] || 300;
        const scrubSpeed = speeds[index] || 1.5;
        
        // Parallax horizontal movement
        gsap.to(row, {
            x: direction * distance,
            ease: "none",
            scrollTrigger: {
                trigger: '.social-proof-bar',
                start: 'top bottom',    // Start when section enters viewport
                end: 'bottom bottom',   // Continue throughout entire section
                scrub: scrubSpeed,      // Different speed per row
            }
        });
    });
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initSocialProof();
    console.log('Social proof animations initialized');
});
