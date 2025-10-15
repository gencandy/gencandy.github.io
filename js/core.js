/**
 * Core Initialization Module
 * Handles Foundation, GSAP, and Lenis smooth scroll configuration
 */

// Initialize Foundation
$(document).foundation();

// Initialize GSAP and register plugins
gsap.registerPlugin(
    ScrollTrigger, 
    TextPlugin, 
    Observer, 
    Draggable, 
    DrawSVGPlugin, 
    EaselPlugin, 
    Flip, 
    GSDevTools, 
    InertiaPlugin, 
    MotionPathHelper, 
    MotionPathPlugin, 
    MorphSVGPlugin, 
    Physics2DPlugin, 
    PhysicsPropsPlugin, 
    PixiPlugin, 
    ScrambleTextPlugin, 
    ScrollToPlugin, 
    SplitText, 
    CustomEase, 
    CustomBounce, 
    CustomWiggle
);

// GSAP Configuration
gsap.config({
    nullTargetWarn: false,
    trialWarn: false
});

// Set default ease for animations
gsap.defaults({
    ease: "power2.out",
    duration: 1
});

// Initialize Lenis Smooth Scroller
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
    normalizeWheel: true,
    lerp: 0.07,
    wheelMultiplier: 0.6,
    smartphone: {
        smooth: false
    },
    tablet: {
        smooth: false
    }
});

// Get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // Available for debugging if needed
});

// Lenis animation frame
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Disable native smooth scrolling to prevent conflicts
document.documentElement.style.scrollBehavior = 'auto';

// Smooth scroll to top functionality
window.scrollToTop = () => {
    lenis.scrollTo(0, {
        duration: 2.5,
        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -8 * t)
    });
};

// Premium scroll restoration
window.addEventListener('beforeunload', () => {
    lenis.destroy();
});

// Refined resize handling for consistent smoothness
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
    }, 100);
});

// Smooth scroll for anchor links with Lenis
$('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if(target.length) {
        e.preventDefault();
        lenis.scrollTo(target[0], {
            offset: -100,
            duration: 2.2,
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -8 * t),
            immediate: false,
            lock: true
        });
    }
});

// Add active class to navigation based on scroll position
$(window).on('scroll', function() {
    const scrollPosition = $(window).scrollTop();
    
    $('section[id]').each(function() {
        const sectionTop = $(this).offset().top - 120;
        const sectionBottom = sectionTop + $(this).outerHeight();
        const sectionId = $(this).attr('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            $('.main-nav .nav-item').removeClass('active');
            $(`.main-nav .nav-item[href="#${sectionId}"]`).addClass('active');
        }
    });
});

// Sticky header on scroll
$(window).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
        $('.main-header').addClass('sticky');
    } else {
        $('.main-header').removeClass('sticky');
    }
});

// Export for use in other modules
window.RPM = window.RPM || {};
window.RPM.lenis = lenis;
