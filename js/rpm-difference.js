/**
 * RPM Difference Section
 * Handles stat scramble animations, scroll text reveal, and background image overlay fade
 */

window.RPM = window.RPM || {};

/**
 * Initialize background image overlay fade animation
 */
window.RPM.initRPMOverlayFade = function() {
    const overlay = document.querySelector('.rpm-image-overlay');
    const section = document.querySelector('.rpm-why-choose');
    const backgroundImage = document.querySelector('.rpm-background-image');
    const bgImg = backgroundImage ? backgroundImage.querySelector('img') : null;
    const bgVideo = backgroundImage ? backgroundImage.querySelector('video') : null;
    
    if (!overlay || !section || !backgroundImage) return;
    
    // Pin the background for the entire section duration
    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: backgroundImage,
        pinSpacing: false
    });
    
    // Only apply parallax if using image (not video)
    if (bgImg) {
        // Smooth vertical parallax effect on the image
        gsap.to(bgImg, {
            y: '15%', // Move image down by 15% as we scroll
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5, // Smooth scrubbing effect
            }
        });
    }
    
    // Fade out overlay: starts at 40% of section, completes at 60% (20% fade duration)
    ScrollTrigger.create({
        trigger: section,
        start: "300px top",  // Start fade when 40% of section reaches top of viewport
        end: "600px top",    // Complete fade when 60% of section reaches top (20% duration)
        scrub: 1,
        onUpdate: (self) => {
            // Fade from 1 to 0 based on progress through this 20% window
            gsap.to(overlay, {
                opacity: 1 - self.progress,
                duration: 0.1,
                overwrite: true
            });
        }
    });
};

/**
 * Initialize stat card animations (entrance animations only)
 * Scramble feature removed - text displays normally
 */
window.RPM.initStatCardScramble = function() {
    // Function kept for compatibility but does nothing
    // Stat cards will display text normally without scrambling
    return;
};

/**
 * Robust Lottie player initialization with multiple fallback strategies
 */
window.RPM.initLottiePlayer = function(lottiePlayer, maxRetries = 5, retryDelay = 500) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const tryPlay = () => {
            attempts++;
            
            // Strategy 1: Check if dotLottie API is ready
            if (lottiePlayer.dotLottie && typeof lottiePlayer.dotLottie.play === 'function') {
                try {
                    lottiePlayer.dotLottie.play();
                    console.log('✓ Lottie played successfully via dotLottie API');
                    resolve();
                    return true;
                } catch (e) {
                    console.warn('Lottie play attempt failed:', e);
                }
            }
            
            // Strategy 2: Try calling play method directly on element
            if (typeof lottiePlayer.play === 'function') {
                try {
                    lottiePlayer.play();
                    console.log('✓ Lottie played successfully via element.play()');
                    resolve();
                    return true;
                } catch (e) {
                    console.warn('Direct play attempt failed:', e);
                }
            }
            
            // Strategy 3: Check if component is defined and wait for ready event
            if (customElements.get('dotlottie-wc')) {
                if (lottiePlayer.isConnected) {
                    // Element is connected, wait for ready event
                    const readyHandler = () => {
                        if (lottiePlayer.dotLottie && typeof lottiePlayer.dotLottie.play === 'function') {
                            lottiePlayer.dotLottie.play();
                            console.log('✓ Lottie played after ready event');
                            resolve();
                        }
                    };
                    lottiePlayer.addEventListener('ready', readyHandler, { once: true });
                    
                    // Timeout fallback
                    setTimeout(() => {
                        if (attempts < maxRetries) {
                            console.log(`Retry ${attempts}/${maxRetries} for Lottie player`);
                            tryPlay();
                        } else {
                            reject(new Error('Max retries reached'));
                        }
                    }, retryDelay);
                    return false;
                }
            }
            
            // Strategy 4: Wait for custom element to be defined
            if (attempts < maxRetries) {
                setTimeout(() => {
                    console.log(`Waiting for Lottie to be ready... Attempt ${attempts}/${maxRetries}`);
                    tryPlay();
                }, retryDelay);
                return false;
            } else {
                reject(new Error('Lottie player could not be initialized'));
                return false;
            }
        };
        
        tryPlay();
    });
};

/**
 * Initialize stat card entrance animations
 */
window.RPM.initStatCardAnimations = function() {
    const statCards = gsap.utils.toArray('.rpm-stat-card');
    
    if (statCards.length === 0) {
        console.log('No stat cards found');
        return;
    }
    
    console.log(`Found ${statCards.length} stat cards`);
    
    // Set initial state for cards
    gsap.set(statCards, {
        opacity: 1, // Changed from 0 to 1 to make visible immediately
        y: 0        // Changed from 40 to 0 to reset position
    });
    
    // Set initial state for icons
    const icons = gsap.utils.toArray('.rpm-stat-card-icon');
    gsap.set(icons, {
        opacity: 1,    // Changed from 0 to 1 to make visible immediately
        scale: 1,      // Changed from 0.5 to 1 to show at full size
        y: 0           // Changed from 20 to 0 to reset position
    });
    
    // Different parallax speeds for staggered parallax effect (more pronounced)
    const parallaxSpeeds = [-50, -50, -50]; // Increased from [-30, -60, -45]
    
    // Animate in on scroll with entrance animation
    statCards.forEach((card, index) => {
        const icon = card.querySelector('.rpm-stat-card-icon');
        const lottiePlayer = card.querySelector('dotlottie-wc');
        let hasPlayedLottie = false;
        
        ScrollTrigger.create({
            trigger: card,
            start: "top 70%", // Changed from 80% to 70%
            end: "bottom top",
            onEnter: () => {
                // Animate card
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.25,
                    ease: "power2.out"
                });
                
                // Animate icon with bounce effect
                gsap.to(icon, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.25 + 0.2, // Slight delay after card starts
                    ease: "back.out(1.7)" // Bouncy ease
                });

                // Play Lottie animation with robust retry logic
                if (lottiePlayer && !hasPlayedLottie) {
                    hasPlayedLottie = true;
                    const playDelay = 1 + (index * 0.5); // 1s base delay + stagger
                    
                    gsap.delayedCall(playDelay, () => {
                        window.RPM.initLottiePlayer(lottiePlayer)
                            .then(() => {
                                console.log(`✓ Lottie animation ${index + 1} started successfully`);
                            })
                            .catch((error) => {
                                console.error(`✗ Failed to start Lottie animation ${index + 1}:`, error);
                                // Fallback: Try setting autoplay attribute
                                lottiePlayer.setAttribute('autoplay', '');
                            });
                    });
                }
            }
        });
        
        // Add staggered parallax effect - each card moves at different speed on scroll
        gsap.to(card, {
            y: parallaxSpeeds[index] || -50,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
    });
};

/**
 * Initialize RPM stat scramble animations (Legacy - for old stat layout)
 */
window.RPM.initRPMStats = function() {
    const statNumbers = gsap.utils.toArray('.rpm-stat-number');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%';

    statNumbers.forEach((stat, index) => {
        const originalText = stat.textContent;
        stat.setAttribute('data-original-text', originalText);
        
        let scrambleInterval = null;
        
        const scrambleText = () => {
            return originalText
                .split('')
                .map((char) => {
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
        };
        
        const startScrambling = () => {
            if (scrambleInterval) return;
            scrambleInterval = setInterval(() => {
                stat.textContent = scrambleText();
            }, 100);
        };
        
        const unscramble = () => {
            if (scrambleInterval) {
                clearInterval(scrambleInterval);
                scrambleInterval = null;
            }
            
            const staggerDelay = index * 200;
            let scrambleCount = 0;
            const maxScrambles = 8;
            
            setTimeout(() => {
                const interval = setInterval(() => {
                    if (scrambleCount < maxScrambles) {
                        stat.textContent = scrambleText();
                        scrambleCount++;
                    } else {
                        clearInterval(interval);
                        stat.textContent = originalText;
                    }
                }, 100);
            }, staggerDelay);
        };
        
        stat.textContent = scrambleText();
        startScrambling();
        
        ScrollTrigger.create({
            trigger: stat,
            start: "top 100%",
            end: "bottom -200px",
            onEnter: () => unscramble(),
            onLeave: () => startScrambling(),
            onEnterBack: () => unscramble(),
            onLeaveBack: () => startScrambling()
        });
    });
    
    // Hover scramble effect
    const statContainers = gsap.utils.toArray('.rpm-stat');
    statContainers.forEach((container) => {
        const statNumber = container.querySelector('.rpm-stat-number');
        if (!statNumber) return;
        
        const originalText = statNumber.getAttribute('data-original-text');
        if (!originalText) return;
        
        let hoverInterval = null;
        let hoverTimeout = null;
        
        const stopScrambling = () => {
            if (hoverInterval) {
                clearInterval(hoverInterval);
                hoverInterval = null;
            }
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            statNumber.textContent = originalText;
        };
        
        container.addEventListener('mouseenter', () => {
            if (hoverInterval) clearInterval(hoverInterval);
            if (hoverTimeout) clearTimeout(hoverTimeout);
            
            hoverInterval = setInterval(() => {
                statNumber.textContent = originalText
                    .split('')
                    .map((char) => {
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
            }, 50);
            
            hoverTimeout = setTimeout(() => {
                stopScrambling();
            }, 500);
        });
        
        container.addEventListener('mouseleave', () => {
            stopScrambling();
        });
    });
    
    // Stat labels animation
    const statLabels = gsap.utils.toArray('.rpm-stat-label');
    if (statLabels.length > 0) {
        gsap.set(statLabels, {
            opacity: 0,
            y: 20
        });
        
        statLabels.forEach((label, index) => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(label, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: "power2.out"
            });
            
            ScrollTrigger.create({
                trigger: label,
                start: "top 95%",
                end: "bottom top",
                onEnter: () => tl.play()
            });
        });
    }
    
    // Stat top border line animation
    const statContainersForBorder = gsap.utils.toArray('.rpm-stat');
    if (statContainersForBorder.length > 0) {
        statContainersForBorder.forEach((stat, index) => {
            stat.style.setProperty('--line-width', '0%');
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                end: "bottom 0%",
                onEnter: () => {
                    setTimeout(() => {
                        stat.style.transition = 'none';
                        stat.style.setProperty('--line-width', '0%');
                        requestAnimationFrame(() => {
                            stat.style.transition = '--line-width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            stat.style.setProperty('--line-width', '100%');
                        });
                    }, index * 200);
                },
                onLeave: () => {
                    setTimeout(() => {
                        stat.style.transition = 'none';
                        stat.style.setProperty('--line-width', '100%');
                        requestAnimationFrame(() => {
                            stat.style.transition = '--line-width 0.8s ease-in-out';
                            stat.style.setProperty('--line-width', '0%');
                        });
                    }, (statContainersForBorder.length - index - 1) * 100);
                },
                onEnterBack: () => {
                    setTimeout(() => {
                        stat.style.transition = 'none';
                        stat.style.setProperty('--line-width', '0%');
                        requestAnimationFrame(() => {
                            stat.style.transition = '--line-width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            stat.style.setProperty('--line-width', '100%');
                        });
                    }, index * 200);
                },
                onLeaveBack: () => {
                    setTimeout(() => {
                        stat.style.transition = 'none';
                        stat.style.setProperty('--line-width', '100%');
                        requestAnimationFrame(() => {
                            stat.style.transition = '--line-width 0.8s ease-in-out';
                            stat.style.setProperty('--line-width', '0%');
                        });
                    }, (statContainersForBorder.length - index - 1) * 100);
                }
            });
        });
    }
};

/**
 * Initialize RPM scroll text reveal animation
 */
window.RPM.initRPMScrollText = function() {
    const textElement = document.getElementById('rpm-scroll-text');
    
    if (!textElement) return;
    
    const originalText = textElement.textContent;
    textElement.innerHTML = '';
    
    const words = originalText.split(' ');
    const wordSpans = [];
    
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = word;
        
        textElement.appendChild(span);
        wordSpans.push(span);
        
        if (index < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'space';
            space.innerHTML = '&nbsp;';
            textElement.appendChild(space);
        }
    });
    
    gsap.to(wordSpans, {
        color: '#181d27',
        duration: 0.1,
        stagger: {
            each: 0.05,
            from: "start"
        },
        ease: "none",
        scrollTrigger: {
            trigger: textElement,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 1.5,
            toggleActions: "play none none none"
        }
    });
    
    gsap.to(wordSpans, {
        scale: 1,
        duration: 0.1,
        stagger: {
            each: 0.05,
            from: "start"
        },
        ease: "power1.out",
        scrollTrigger: {
            trigger: textElement,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 2,
            toggleActions: "play none none none"
        }
    });
};

/**
 * Initialize bottom CTA text reveal animation with word-by-word split text
 */
window.RPM.initBottomTextAnimation = function() {
    const textElement = document.querySelector('.rpm-bottom-text');
    
    if (!textElement) return;
    
    // Store original height to prevent layout shift
    const originalHeight = textElement.offsetHeight;
    
    // Split text into words and lines
    const split = new SplitText(textElement, {
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
    
    // Maintain original height
    textElement.style.minHeight = originalHeight + 'px';
    
    // Set initial state - words clipped
    gsap.set(wordWrappers, {
        y: '100%',
        opacity: 0
    });
    
    // Create the reveal animation
    const textTimeline = gsap.timeline({ paused: true });
    textTimeline.to(wordWrappers, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out"
    });
    
    ScrollTrigger.create({
        trigger: textElement,
        start: "top 85%",
        onEnter: () => textTimeline.play(),
        onRefresh: (self) => {
            if (self.isActive) {
                textTimeline.play();
            }
        }
    });
};

/**
 * Initialize RPM heart animation
 */
window.RPM.initRPMHeart = function() {
    const heartContainer = document.querySelector('.rpm-heart-animation');
    const heartPlayer = document.getElementById('rpm-heart-lottie');
    
    if (!heartContainer || !heartPlayer) return;
    
    // Set initial state
    gsap.set(heartContainer, {
        opacity: 0,
        scale: 0.8
    });
    
    let hasPlayed = false;
    
    // Wait for web component to be ready
    const initAnimation = () => {
        heartPlayer.removeAttribute('autoplay');
        
        ScrollTrigger.create({
            trigger: heartContainer,
            start: "top 85%",
            end: "bottom top",
            onEnter: () => {
                if (!hasPlayed) {
                    gsap.to(heartContainer, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    });
                    
                    setTimeout(() => {
                        heartPlayer.setAttribute('autoplay', '');
                        heartPlayer.setAttribute('loop', '');
                    }, 200);
                    
                    hasPlayed = true;
                }
            },
            onLeaveBack: () => {
                gsap.to(heartContainer, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.4,
                    ease: "power2.in"
                });
                heartPlayer.removeAttribute('autoplay');
                hasPlayed = false;
            }
        });
    };
    
    // Wait for web component
    if (customElements.get('dotlottie-wc')) {
        setTimeout(() => initAnimation(), 100);
    } else {
        customElements.whenDefined('dotlottie-wc').then(() => {
            setTimeout(() => initAnimation(), 100);
        });
    }
};

/**
 * Initialize all RPM Difference animations
 */
window.RPM.initRPMDifference = function() {
    window.RPM.initRPMOverlayFade();
    window.RPM.initStatCardScramble();
    window.RPM.initStatCardAnimations();
    window.RPM.initRPMScrollText();
    window.RPM.initBottomTextAnimation();
    // Legacy functions commented out - remove if no longer needed
    // window.RPM.initRPMStats();
    // window.RPM.initRPMHeart();
};

/**
 * Wait for dotlottie-wc custom element to be defined before initializing
 */
function initWhenReady() {
    // Check if customElements API is available
    if (typeof customElements === 'undefined') {
        console.warn('Custom Elements API not available');
        // Fallback: Initialize anyway after a delay
        setTimeout(() => {
            window.RPM.initRPMDifference();
            console.log('RPM Difference animations initialized (fallback)');
        }, 1000);
        return;
    }

    // Wait for dotlottie-wc to be defined
    customElements.whenDefined('dotlottie-wc')
        .then(() => {
            console.log('✓ dotlottie-wc custom element is ready');
            // Small additional delay to ensure components are fully initialized
            setTimeout(() => {
                window.RPM.initRPMDifference();
                console.log('✓ RPM Difference animations initialized');
            }, 100);
        })
        .catch((error) => {
            console.error('Error waiting for dotlottie-wc:', error);
            // Fallback initialization
            window.RPM.initRPMDifference();
            console.log('RPM Difference animations initialized (error fallback)');
        });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
    // DOM is already ready
    initWhenReady();
}
