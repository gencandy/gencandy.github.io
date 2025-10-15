/**
 * Audit Reviews Section
 * Handles accordion with auto-timer, logo rotation, and video scrub
 */

window.RPM = window.RPM || {};

/**
 * Initialize Audit Reviews Accordion with Auto-Timer
 */
window.RPM.initAuditReviewsAccordion = function() {
    const accordionItems = document.querySelectorAll('[data-accordion-item]');
    
    if (!accordionItems.length) return;
    
    let currentIndex = 0;
    let autoTimerInterval = null;
    let progressBarTween = null;
    let isAnimating = false;
    let isAutoTimerActive = false;
    const AUTO_TIMER_DURATION = 7000;
    const ANIMATION_DURATION = 400;
    
    function activateItem(index, shouldAnimateProgressBar = false) {
        if (isAnimating || currentIndex === index) return;
        
        isAnimating = true;
        
        // Smoothly fade out and reset old item's progress bar
        const oldItem = accordionItems[currentIndex];
        if (oldItem) {
            oldItem.classList.remove('active');
            
            // Create a timeline for smooth disappearing animation
            const disappearTimeline = gsap.timeline();
            disappearTimeline
                .to(oldItem, {
                    '--progress-opacity': 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                })
                .to(oldItem, {
                    '--progress-width': '0%',
                    duration: 0.3,
                    ease: 'power2.out'
                }, '-=0.2'); // Start width animation slightly before opacity finishes
        }
        
        // Update current index
        currentIndex = index;
        
        // Activate new item with smooth fade in
        const newItem = accordionItems[currentIndex];
        if (newItem) {
            newItem.classList.add('active');
            
            // Set initial state
            gsap.set(newItem, {
                '--progress-width': '0%',
                '--progress-opacity': 0
            });
            
            // Fade in the new progress bar
            gsap.to(newItem, {
                '--progress-opacity': 1,
                duration: 0.4,
                ease: 'power2.out',
                delay: 0.1
            });
            
            // Start progress bar animation if requested
            if (shouldAnimateProgressBar) {
                setTimeout(() => {
                    animateProgressBar(newItem);
                }, 150);
            }
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, ANIMATION_DURATION);
    }
    
    function animateProgressBar(item) {
        // Kill any existing progress bar animation
        if (progressBarTween) {
            progressBarTween.kill();
        }
        
        // Animate progress bar from 0 to 100% over the timer duration
        progressBarTween = gsap.to(item, {
            '--progress-width': '100%',
            duration: AUTO_TIMER_DURATION / 1000, // Convert ms to seconds
            ease: 'none'
        });
    }
    
    function nextItem() {
        const nextIndex = (currentIndex + 1) % accordionItems.length;
        activateItem(nextIndex, true);
    }
    
    function startAutoTimer() {
        if (autoTimerInterval) {
            clearInterval(autoTimerInterval);
        }
        isAutoTimerActive = true;
        
        // Start progress bar animation for current item
        const currentItem = accordionItems[currentIndex];
        if (currentItem) {
            animateProgressBar(currentItem);
        }
        
        // Set interval to advance to next item
        autoTimerInterval = setInterval(nextItem, AUTO_TIMER_DURATION);
    }
    
    function stopAutoTimer() {
        if (autoTimerInterval) {
            clearInterval(autoTimerInterval);
            autoTimerInterval = null;
        }
        isAutoTimerActive = false;
        
        // Kill the progress bar animation
        if (progressBarTween) {
            progressBarTween.kill();
        }
    }
    
    // Click handlers
    accordionItems.forEach((item, index) => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        
        trigger.addEventListener('click', function() {
            if (isAnimating || currentIndex === index) return;
            
            // Stop current timer and progress
            stopAutoTimer();
            
            // Activate clicked item with progress bar
            activateItem(index, false);
            
            // Restart timer after brief delay
            setTimeout(() => {
                startAutoTimer();
            }, ANIMATION_DURATION);
        });
    });
    
    // Initialize all items
    accordionItems.forEach((item, i) => {
        gsap.set(item, {
            '--progress-opacity': 0,
            '--progress-width': '0%'
        });
        if (i !== 0) {
            item.classList.remove('active');
        }
    });
    
    // Activate first item
    accordionItems[0].classList.add('active');
    gsap.set(accordionItems[0], {
        '--progress-opacity': 1,
        '--progress-width': '0%'
    });
    currentIndex = 0;
    
    // Start auto-timer only when component reaches 40% of screen
    const accordionSection = document.querySelector('.audit-reviews');
    if (accordionSection) {
        ScrollTrigger.create({
            trigger: accordionSection,
            start: 'top 20%',  // When section top reaches 60% from top (40% from bottom)
            onEnter: () => {
                if (!isAutoTimerActive) {
                    startAutoTimer();
                }
            },
            onEnterBack: () => {
                if (!isAutoTimerActive) {
                    startAutoTimer();
                }
            },
            onLeaveBack: () => {
                stopAutoTimer();
            }
        });
    }
};

/**
 * Initialize Audit Reviews Logo Rotation
 */
window.RPM.initAuditLogoRotation = function() {
    const auditLogo = document.querySelector('.audit-reviews-logo');
    const auditSection = document.querySelector('.audit-reviews');
    
    if (!auditLogo || !auditSection) return;
    
    gsap.set(auditLogo, {
        transformOrigin: 'center center'
    });
    
    let baseRotation = 0;
    let autoRotationTween = null;
    let lastProgress = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    function startAutoRotation() {
        const currentRotation = gsap.getProperty(auditLogo, 'rotation');
        baseRotation = currentRotation;
        
        if (autoRotationTween) {
            autoRotationTween.kill();
        }
        
        autoRotationTween = gsap.to(auditLogo, {
            rotation: baseRotation + 360,
            duration: 20,
            ease: 'none',
            repeat: -1,
            modifiers: {
                rotation: (rotation) => {
                    baseRotation = parseFloat(rotation);
                    return rotation;
                }
            }
        });
    }
    
    startAutoRotation();
    
    ScrollTrigger.create({
        trigger: auditSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const progressDelta = progress - lastProgress;
            const velocity = progressDelta * 100;
            
            if (Math.abs(velocity) > 0.01) {
                isScrolling = true;
                
                if (autoRotationTween) {
                    autoRotationTween.pause();
                }
                
                const currentRotation = gsap.getProperty(auditLogo, 'rotation');
                const additionalRotation = velocity * 15;
                
                gsap.to(auditLogo, {
                    rotation: currentRotation + additionalRotation,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: true
                });
                
                clearTimeout(scrollTimeout);
                
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    startAutoRotation();
                }, 200);
            }
            
            lastProgress = progress;
        }
    });
};

/**
 * Initialize Audit Reviews Video Scrub
 */
window.RPM.initAuditVideoScrub = function() {
    const auditVideo = document.querySelector('.audit-reviews-image');
    const auditSection = document.querySelector('.audit-reviews');
    
    if (!auditVideo || !auditSection) return;
    
    auditVideo.preload = "auto";
    auditVideo.muted = true;
    auditVideo.playsInline = true;
    auditVideo.disablePictureInPicture = true;
    
    let scrollTriggerInstance = null;
    let retryCount = 0;
    const maxRetries = 50;
    
    const initVideoScrub = () => {
        if (!auditVideo.duration || auditVideo.duration === Infinity || isNaN(auditVideo.duration)) {
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(initVideoScrub, 100);
            }
            return;
        }
        
        // Use slightly less than full duration to prevent edge case issues
        const videoDuration = auditVideo.duration;
        const maxPlayTime = videoDuration * 0.98; // Stop at 98% to avoid end stuttering
        auditVideo.currentTime = 0;
        
        const videoProgress = { value: 0 };
        let lastUpdateTime = Date.now();
        const updateInterval = 16; // ~60fps update rate limit
        
        const animation = gsap.to(videoProgress, {
            value: maxPlayTime,
            ease: "none",
            scrollTrigger: {
                trigger: auditSection,
                start: "top bottom",
                end: "center center",
                scrub: 1, // Slightly more responsive scrubbing
                onUpdate: (self) => {
                    const now = Date.now();
                    
                    // Throttle updates to avoid too many seeks
                    if (now - lastUpdateTime < updateInterval) {
                        return;
                    }
                    lastUpdateTime = now;
                    
                    const targetTime = videoProgress.value;
                    
                    // Clamp between 0 and max play time
                    const clampedTime = Math.min(Math.max(targetTime, 0), maxPlayTime);
                    
                    // Only seek if video is ready
                    if (auditVideo.readyState >= 2) {
                        const timeDiff = Math.abs(auditVideo.currentTime - clampedTime);
                        
                        // Dynamic threshold: smaller near the end for smoothness
                        const progress = self.progress;
                        const seekThreshold = progress > 0.9 ? 0.02 : 0.04;
                        
                        if (timeDiff > seekThreshold) {
                            try {
                                auditVideo.currentTime = clampedTime;
                            } catch (e) {
                                // Silently handle seek errors
                            }
                        }
                    }
                },
                onEnter: () => {
                    if (auditVideo.paused && auditVideo.readyState >= 2) {
                        auditVideo.currentTime = 0;
                    }
                },
                onLeave: () => {
                    // Smoothly approach the end without forcing a hard jump
                    if (auditVideo.readyState >= 2 && auditVideo.currentTime < maxPlayTime) {
                        gsap.to(auditVideo, {
                            currentTime: maxPlayTime,
                            duration: 0.3,
                            ease: "power1.out"
                        });
                    }
                },
                onEnterBack: () => {
                    // When scrolling back, ensure smooth continuation
                    if (auditVideo.readyState >= 2) {
                        const targetTime = Math.min(videoProgress.value, maxPlayTime);
                        const currentTime = auditVideo.currentTime;
                        
                        // Only update if significantly different
                        if (Math.abs(currentTime - targetTime) > 0.1) {
                            auditVideo.currentTime = targetTime;
                        }
                    }
                },
                invalidateOnRefresh: true
            }
        });
        
        scrollTriggerInstance = animation.scrollTrigger;
    };
    
    auditVideo.addEventListener('error', (e) => {
        // Silently handle video loading errors
    });
    
    auditVideo.addEventListener('stalled', () => {
        // Silently handle video stalls
    });
    
    if (auditVideo.readyState >= 1) {
        initVideoScrub();
    } else {
        auditVideo.addEventListener('loadedmetadata', initVideoScrub, { once: true });
        setTimeout(() => {
            if (!scrollTriggerInstance && auditVideo.readyState >= 1) {
                initVideoScrub();
            }
        }, 2000);
    }
    
    window.addEventListener('beforeunload', () => {
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
        }
    });
};

/**
 * Initialize all Audit Reviews animations
 */
window.RPM.initAuditReviews = function() {
    window.RPM.initAuditReviewsAccordion();
    window.RPM.initAuditLogoRotation();
    window.RPM.initAuditVideoScrub();
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initAuditReviews();
});
