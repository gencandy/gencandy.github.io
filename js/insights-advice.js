/**
 * ============================================
 * INSIGHTS AND ADVICE CAROUSEL
 * ============================================
 * Handles the pagination dots and content switching
 * for the Insights and Advice section
 */

(function() {
    'use strict';

    // Content data for each slide
    const insightsContent = [
        {
            badge: "Tips & Guides",
            title: "The top 5 workers' comp surprises and how to avoid them",
            description: "Every year, business owners get hit with unexpected workers' comp issues that cost time and money. Learn what those surprises are, why they happen, and what steps you can take now to avoid them...",
            link: "#"
        },
        {
            badge: "Industry News",
            title: "Understanding the new workers' comp regulations for 2025",
            description: "Stay ahead of the curve with our comprehensive guide to the latest regulatory changes affecting workers' compensation. Learn how these updates impact your business and what actions to take...",
            link: "#"
        },
        {
            badge: "Best Practices",
            title: "How to reduce workers' comp costs without cutting corners",
            description: "Discover proven strategies that successful businesses use to minimize workers' compensation expenses while maintaining comprehensive coverage and keeping employees protected...",
            link: "#"
        }
    ];

    let currentSlide = 0;
    let isAnimating = false;
    let autoAdvanceEnabled = false; // Track if auto-advance should be running

    // DOM Elements
    const elements = {
        subtitle: document.querySelector('.insights-advice-subtitle'),
        badge: document.querySelector('.insights-advice-badge'),
        badgeText: document.querySelector('.insights-badge-text'),
        title: document.querySelector('.insights-advice-title'),
        description: document.querySelector('.insights-advice-description'),
        button: document.querySelector('.btn-insights'),
        dots: document.querySelectorAll('.pagination-dot'),
        progressFills: document.querySelectorAll('.progress-fill'),
        cards: {
            card1: document.querySelector('.card-1'),
            card2: document.querySelector('.card-2'),
            card3: document.querySelector('.card-3')
        }
    };

    // Card position states for each carousel item
    const cardStates = {
        center: {
            zIndex: 5,
            left: 0,
            top: 0,
            transform: 'scale(1) translateX(0)',
            overlayOpacity: 0,
            overlayColor: '#005aea' // brand-500
        },
        middleRight: {
            zIndex: 4,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) scale(0.93) translateX(50px)',
            overlayOpacity: 1,
            overlayColor: '#4089ff' // brand-300
        },
        endRight: {
            zIndex: 3,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) scale(0.83) translateX(110px)',
            overlayOpacity: 1,
            overlayColor: '#6aa3ff' // brand-200
        },
        middleLeft: {
            zIndex: 2,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) scale(0.93) translateX(-50px)',
            overlayOpacity: 1,
            overlayColor: '#4089ff' // brand-300 (same as middleRight)
        },
        endLeft: {
            zIndex: 1,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) scale(0.83) translateX(-110px)',
            overlayOpacity: 1,
            overlayColor: '#6aa3ff' // brand-200 (same as endRight)
        }
    };

    // Card positions for each carousel item (0-indexed)
    const carouselLayouts = [
        // Item 1 (index 0): Card 1 center, Card 2 middle-right, Card 3 end-right
        {
            card1: 'center',
            card2: 'middleRight',
            card3: 'endRight'
        },
        // Item 2 (index 1): Card 2 center, Card 1 middle-left, Card 3 middle-right
        {
            card1: 'middleLeft',
            card2: 'center',
            card3: 'middleRight'
        },
        // Item 3 (index 2): Card 3 center, Card 1 end-left, Card 2 middle-left
        {
            card1: 'endLeft',
            card2: 'middleLeft',
            card3: 'center'
        }
    ];

    /**
     * Update content with GSAP animation
     */
    function updateContent(slideIndex) {
        if (isAnimating || slideIndex === currentSlide) return;
        
        isAnimating = true;
        const content = insightsContent[slideIndex];
        
        // Stop and clean up any existing timer/progress
        if (window.carouselTimer) {
            window.carouselTimer.stop();
        }
        
        // Immediately update active dot to prevent double active states
        updateActiveDot(slideIndex);
        
        // Trigger card rotation based on slide index (pass previous slide for special transitions)
        rotateCards(slideIndex, currentSlide);
        
        // Create master timeline
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                currentSlide = slideIndex;
                
                // Restart timer after animation completes
                if (window.carouselTimer) {
                    window.carouselTimer.start();
                }
            }
        });

        // Fade out and move up all elements (optimized timing)
        tl.to(elements.badge, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        }, 0)
        .to(elements.title, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        }, 0.05)
        .to(elements.description, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        }, 0.1);
        
        // Fade out button if it exists
        if (elements.button) {
            tl.to(elements.button, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: "power2.in"
            }, 0.15);
        }
        
        // Update content in the middle of animation
        tl.call(() => {
            elements.badgeText.textContent = content.badge;
            elements.title.textContent = content.title;
            elements.description.textContent = content.description;
            if (elements.button) {
                elements.button.setAttribute('data-link', content.link);
            }
        }, null, "+=0.1")
        
        // Set elements to starting position for fade in
        .set(elements.badge, { y: 20 })
        .set(elements.title, { y: 20 })
        .set(elements.description, { y: 20 });
        
        if (elements.button) {
            tl.set(elements.button, { y: 20 });
        }
        
        // Fade in and move to position (faster, smoother)
        tl.to(elements.badge, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        })
        .to(elements.title, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.55")
        .to(elements.description, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.55");
        
        // Fade in button if it exists (after description)
        if (elements.button) {
            tl.to(elements.button, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.45"); // Button comes in 0.1s after description starts
        }

        // Note: Active dot already updated at start of function
        // Note: Timer restart handled in timeline onComplete
    }

    /**
     * Update active pagination dot
     */
    function updateActiveDot(slideIndex) {
        // Update active states IMMEDIATELY
        elements.dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
        
        // Reset ALL progress fills
        elements.progressFills.forEach((fill, index) => {
            if (index === slideIndex) {
                // New active - reset to start
                gsap.set(fill, { 
                    width: '0%', 
                    opacity: 1,
                    backgroundColor: '#BBEAFF'
                });
            } else {
                // Old ones - just hide them
                gsap.set(fill, { 
                    width: '0%', 
                    opacity: 0
                });
            }
        });
    }

    /**
     * Rotate cards to positions based on the current slide index
     */
    function rotateCards(slideIndex, previousSlide) {
        if (!elements.cards.card1 || !elements.cards.card2 || !elements.cards.card3) {
            return;
        }

        const layout = carouselLayouts[slideIndex];
        
        // Detect if we're looping from card 3 back to card 1
        const isLoopingBack = previousSlide === 2 && slideIndex === 0;
        
        if (isLoopingBack) {
            // Smooth loop transition with fade and restack
            const card1State = cardStates[layout.card1];
            const card2State = cardStates[layout.card2];
            const card3State = cardStates[layout.card3];
            
            const tl = gsap.timeline();
            
            // Phase 1: Lift and fade all cards simultaneously (0.0 - 0.35s)
            tl.to([elements.cards.card1, elements.cards.card2, elements.cards.card3], {
                y: -40,
                scale: 0.96,
                opacity: 0.5,
                duration: 0.35,
                ease: "power2.out"
            }, 0)
            
            // Mid-point: Change z-index while lifted and faded
            .set(elements.cards.card1, { zIndex: card1State.zIndex }, 0.35)
            .set(elements.cards.card2, { zIndex: card2State.zIndex }, 0.35)
            .set(elements.cards.card3, { zIndex: card3State.zIndex }, 0.35)
            
            // Phase 2: Settle into new positions (0.35 - 0.9s)
            .to(elements.cards.card1, {
                left: card1State.left,
                top: card1State.top,
                transform: card1State.transform,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.55,
                ease: "power2.out"
            }, 0.35)
            .to(elements.cards.card1.querySelector('.card-overlay'), {
                opacity: card1State.overlayOpacity,
                backgroundColor: card1State.overlayColor,
                duration: 0.45,
                ease: "power2.inOut"
            }, 0.45)
            
            .to(elements.cards.card2, {
                left: card2State.left,
                top: card2State.top,
                transform: card2State.transform,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.55,
                ease: "power2.out"
            }, 0.35)
            .to(elements.cards.card2.querySelector('.card-overlay'), {
                opacity: card2State.overlayOpacity,
                backgroundColor: card2State.overlayColor,
                duration: 0.45,
                ease: "power2.inOut"
            }, 0.45)
            
            .to(elements.cards.card3, {
                left: card3State.left,
                top: card3State.top,
                transform: card3State.transform,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.55,
                ease: "power2.out"
            }, 0.35)
            .to(elements.cards.card3.querySelector('.card-overlay'), {
                opacity: card3State.overlayOpacity,
                backgroundColor: card3State.overlayColor,
                duration: 0.45,
                ease: "power2.inOut"
            }, 0.45);
            
        } else {
            // Normal transitions - optimized
            const duration = 0.8;
            const ease = "power2.inOut";
            
            // Animate all cards together
            const card1State = cardStates[layout.card1];
            const card2State = cardStates[layout.card2];
            const card3State = cardStates[layout.card3];
            
            // Use timeline for better performance control
            const tl = gsap.timeline();
            
            tl.to(elements.cards.card1, {
                zIndex: card1State.zIndex,
                left: card1State.left,
                top: card1State.top,
                transform: card1State.transform,
                duration,
                ease
            }, 0)
            .to(elements.cards.card1.querySelector('.card-overlay'), {
                opacity: card1State.overlayOpacity,
                backgroundColor: card1State.overlayColor,
                duration: duration * 0.75,
                ease: "power2.inOut"
            }, 0.1)

            .to(elements.cards.card2, {
                zIndex: card2State.zIndex,
                left: card2State.left,
                top: card2State.top,
                transform: card2State.transform,
                duration,
                ease
            }, 0)
            .to(elements.cards.card2.querySelector('.card-overlay'), {
                opacity: card2State.overlayOpacity,
                backgroundColor: card2State.overlayColor,
                duration: duration * 0.75,
                ease: "power2.inOut"
            }, 0.1)

            .to(elements.cards.card3, {
                zIndex: card3State.zIndex,
                left: card3State.left,
                top: card3State.top,
                transform: card3State.transform,
                duration,
                ease
            }, 0)
            .to(elements.cards.card3.querySelector('.card-overlay'), {
                opacity: card3State.overlayOpacity,
                backgroundColor: card3State.overlayColor,
                duration: duration * 0.75,
                ease: "power2.inOut"
            }, 0.1);
        }
    }

    /**
     * Initialize pagination dots
     */
    function initPagination() {
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!isAnimating && index !== currentSlide) {
                    // Temporarily disable auto-advance
                    if (window.carouselTimer) {
                        window.carouselTimer.stop();
                        autoAdvanceEnabled = false;
                    }
                    
                    updateContent(index);
                    
                    // Re-enable and restart after 5 seconds
                    setTimeout(() => {
                        autoAdvanceEnabled = true;
                        if (window.carouselTimer && !isAnimating) {
                            window.carouselTimer.start();
                        }
                    }, 5000);
                }
            });

            // Keyboard navigation
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isAnimating && index !== currentSlide) {
                        // Temporarily disable auto-advance
                        if (window.carouselTimer) {
                            window.carouselTimer.stop();
                            autoAdvanceEnabled = false;
                        }
                        
                        updateContent(index);
                        
                        // Re-enable and restart after 5 seconds
                        setTimeout(() => {
                            autoAdvanceEnabled = true;
                            if (window.carouselTimer && !isAnimating) {
                                window.carouselTimer.start();
                            }
                        }, 5000);
                    }
                }
            });
        });
    }

    /**
     * Auto-advance carousel with GSAP-driven progress bar
     */
    function initAutoAdvance() {
        const autoAdvanceInterval = 5000; // 5 seconds
        let timeoutId = null;
        let isRunning = false;
        let isPaused = false;
        let progressTween = null;
        let startTime = null;
        let remainingTime = autoAdvanceInterval;

        const timer = {
            start: function() {
                if (isRunning && !isPaused) {
                    return;
                }
                
                this.stop(); // Clear any existing timer
                isRunning = true;
                isPaused = false;
                remainingTime = autoAdvanceInterval;
                startTime = Date.now();
                
                // Get active dot and its progress fill
                const activeDot = elements.dots[currentSlide];
                const activeFill = elements.progressFills[currentSlide];
                if (!activeDot || !activeFill) return;
                
                // Ensure dot is active
                activeDot.classList.add('active');
                
                // Animate progress fill width with GSAP (real DOM element!)
                progressTween = gsap.to(activeFill, {
                    width: '100%',
                    duration: remainingTime / 1000,
                    ease: 'none',
                    onComplete: () => {
                        if (!isPaused && !isAnimating && autoAdvanceEnabled) {
                            // Simple fade out as completion effect
                            gsap.to(activeFill, {
                                opacity: 0,
                                duration: 0.4,
                                ease: 'power2.out',
                                onComplete: () => {
                                    const nextSlide = (currentSlide + 1) % insightsContent.length;
                                    updateContent(nextSlide);
                                }
                            });
                        }
                    }
                });
            },

            stop: function() {
                if (progressTween) {
                    progressTween.kill();
                    progressTween = null;
                }
                
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                
                isRunning = false;
                isPaused = false;
                remainingTime = autoAdvanceInterval;
                
                // Reset progress on all fills to prevent stuck states
                elements.progressFills.forEach(fill => {
                    gsap.killTweensOf(fill);
                    gsap.set(fill, { width: '0%', opacity: 1 });
                });
            },

            pause: function() {
                if (isRunning && !isPaused && progressTween) {
                    isPaused = true;
                    
                    // Pause the GSAP tween
                    progressTween.pause();
                    
                    // Calculate remaining time based on tween progress
                    const progress = progressTween.progress();
                    remainingTime = autoAdvanceInterval * (1 - progress);
                }
            },

            resume: function() {
                if (isRunning && isPaused && progressTween) {
                    isPaused = false;
                    
                    // Resume the GSAP tween
                    progressTween.resume();
                }
            },

            isActive: function() {
                return isRunning && !isPaused;
            }
        };

        // Store timer globally for access from other functions
        window.carouselTimer = timer;

        // Use ScrollTrigger to control auto-advance based on content area position
        const contentArea = document.querySelector('.insights-advice-content');
        if (contentArea) {
            ScrollTrigger.create({
                trigger: contentArea,
                start: "top 60%", // When content enters viewport at 60%
                end: "bottom 15%",   // When content exits viewport at 15%
                onEnter: () => {
                    // Delay to let entrance animations complete
                    setTimeout(() => {
                        autoAdvanceEnabled = true;
                        timer.start();
                    }, 1500);
                },
                onLeave: () => {
                    autoAdvanceEnabled = false;
                    timer.pause();
                },
                onEnterBack: () => {
                    autoAdvanceEnabled = true;
                    timer.resume();
                },
                onLeaveBack: () => {
                    autoAdvanceEnabled = false;
                    timer.pause();
                }
            });
        }

        // Pause only when hovering over the "Read more" button
        if (elements.button) {
            elements.button.addEventListener('mouseenter', () => {
                timer.pause();
            });
            
            elements.button.addEventListener('mouseleave', () => {
                // Only resume if auto-advance is enabled (content in view)
                if (autoAdvanceEnabled) {
                    timer.resume();
                }
            });
        }

        return timer;
    }

    /**
     * Handle cards container click navigation
     */
    function handleCardAreaClick(e) {
        if (isAnimating) return;
        
        const cardsContainer = document.querySelector('.insights-advice-right-column');
        const rect = cardsContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;
        const midpoint = containerWidth / 2;
        
        if (clickX < midpoint) {
            // Left half - navigate backward
            const prevSlide = (currentSlide - 1 + insightsContent.length) % insightsContent.length;
            updateContent(prevSlide);
        } else {
            // Right half - navigate forward
            const nextSlide = (currentSlide + 1) % insightsContent.length;
            updateContent(nextSlide);
        }
    }

    /**
     * Initialize card click handlers
     */
    function initCardNavigation() {
        const cardsContainer = document.querySelector('.insights-advice-right-column');
        if (!cardsContainer) return;
        
        // Add click handler to the cards container
        cardsContainer.addEventListener('click', handleCardAreaClick);
    }

    /**
     * Animate section entrance on scroll
     */
    function animateEntrance() {
        const contentArea = document.querySelector('.insights-advice-content');
        if (!contentArea) return;

        // Set initial states for GSAP animation
        if (elements.subtitle) {
            gsap.set(elements.subtitle, { y: 20, opacity: 0 });
        }
        gsap.set(elements.badge, { scale: 0.9, opacity: 0 });
        gsap.set(elements.title, { y: 20, opacity: 0 });
        gsap.set(elements.description, { y: 20, opacity: 0 });
        
        // Set button initial state if it exists
        if (elements.button) {
            gsap.set(elements.button, { y: 20, opacity: 0 });
        }
        
        // Set cards with scale + opacity for smooth entrance
        if (elements.cards.card1 && elements.cards.card2 && elements.cards.card3) {
            // Store original transforms
            const card1Transform = getComputedStyle(elements.cards.card1).transform;
            const card2Transform = getComputedStyle(elements.cards.card2).transform;
            const card3Transform = getComputedStyle(elements.cards.card3).transform;
            
            gsap.set([elements.cards.card1, elements.cards.card2, elements.cards.card3], { 
                opacity: 0,
                y: 30
            });
        }
        
        if (elements.dots.length > 0) {
            gsap.set(elements.dots, { opacity: 0, scale: 0.5 });
        }

        const entranceTL = gsap.timeline({
            scrollTrigger: {
                trigger: contentArea,
                start: 'top 60%',
                once: true
            }
        });

        // LEFT COLUMN: Animate text elements in sequence (order of placement)
        // Subtitle first if it exists
        if (elements.subtitle) {
            entranceTL.to(elements.subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, 0);
        }
        
        entranceTL
            .to(elements.badge, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.2)"
            }, 0.15)  // After subtitle
            .to(elements.title, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.25)  // After badge
            .to(elements.description, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.4);  // After title
        
        // Animate button if it exists
        if (elements.button) {
            entranceTL.to(elements.button, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.55);  // After description
        }

        // RIGHT COLUMN: Animate cards entrance with smooth scale + fade + lift
        if (elements.cards.card1 && elements.cards.card2 && elements.cards.card3) {
            entranceTL
                .to(elements.cards.card1, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                }, 0.6)  // Overlap with text
                .to(elements.cards.card2, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                }, 0.65)  // 0.15s after card1
                .to(elements.cards.card3, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                }, 0.8);  // 0.15s after card2
        }

        // BOTTOM: Animate pagination dots (left to right stagger)
        if (elements.dots.length > 0) {
            entranceTL.to(elements.dots, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,  // 0.1s between each dot
                ease: "back.out(1.7)"
            }, 1.3);  // Start near end of card animations
        }
    }

    /**
     * Initialize the Insights carousel
     */
    function init() {
        // Check if elements exist
        if (!elements.title || !elements.description || elements.dots.length === 0) {
            return;
        }

        // Animate entrance
        animateEntrance();

        // Initialize pagination
        initPagination();

        // Initialize card navigation (cursors and clicks)
        initCardNavigation();

        // Initialize auto-advance immediately - ScrollTrigger inside will handle timing
        initAutoAdvance();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
