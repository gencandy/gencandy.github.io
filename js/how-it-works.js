/**
 * How It Works Section Animations
 * Handles step animations, connectors, physics effects, and hero section
 */

window.RPM = window.RPM || {};

/**
 * Initialize How It Works hero section animations
 */
window.RPM.initHowItWorksHero = function() {
    // Award-winning icon animation with 3D transforms, glow effects, and interactions
    const iconWrapper = document.querySelector('.how-it-works-icon');
    const iconImg = document.querySelector('.how-it-works-icon img');
    
    if (!iconWrapper || !iconImg) return;
    
    // Set initial state with 3D perspective
    gsap.set(iconWrapper, {
        perspective: 1000,
        transformStyle: 'preserve-3d'
    });
    
    gsap.set(iconImg, {
        scale: 0,
        opacity: 0,
        rotationY: -180,
        rotationX: -45,
        z: -500,
        filter: 'blur(20px) brightness(2)',
        transformOrigin: 'center center'
    });
    
    iconWrapper.style.position = 'relative';
    
    // Create glow element for dramatic effect
    const glowElement = document.createElement('div');
    glowElement.className = 'icon-glow';
    glowElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120%;
        height: 120%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(191,216,255,0.2) 30%, transparent 70%);
        filter: blur(20px);
        opacity: 0;
        pointer-events: none;
        z-index: 0;
    `;
    iconWrapper.appendChild(glowElement);
    iconImg.style.position = 'relative';
    iconImg.style.zIndex = '2';
    
    // Master timeline for award-winning entrance animation
    const masterTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.how-it-works',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        onComplete: () => {
            // Subtle floating animation loop
            gsap.to(iconImg, {
                y: -8,
                duration: 2.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });
            
            // Subtle rotation loop
            gsap.to(iconImg, {
                rotationZ: 2,
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });
            
            // Ambient glow pulse
            gsap.to(glowElement, {
                opacity: 0.6,
                scale: 1.1,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });
        }
    });
    
    // Main icon entrance with 3D transformation
    masterTL.to(iconImg, {
        scale: 1.2,
        opacity: 1,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        filter: 'blur(0px) brightness(1)',
        duration: 1.4,
        ease: 'expo.out'
    }, 0.2)
    
    // Elastic bounce with overshoot
    .to(iconImg, {
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.4')
    
    // Glow burst
    .to(glowElement, {
        opacity: 1,
        scale: 1.3,
        duration: 1,
        ease: 'expo.out'
    }, 0.3)
    
    .to(glowElement, {
        opacity: 0.3,
        scale: 1,
        duration: 0.6,
        ease: 'power2.inOut'
    }, '-=0.3');
    
    // Hover interaction - Award-winning micro-animation with slick rotation
    let rotationTween;
    
    iconWrapper.addEventListener('mouseenter', () => {
        gsap.to(iconImg, {
            scale: 1.15,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
        });
        
        // Slick continuous rotation on hover
        rotationTween = gsap.to(iconImg, {
            rotation: '+=360',
            duration: 1.2,
            ease: 'power2.inOut',
            repeat: -1,
            overwrite: 'auto'
        });
        
        gsap.to(glowElement, {
            opacity: 0.8,
            scale: 1.4,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
    
    iconWrapper.addEventListener('mouseleave', () => {
        // Stop rotation smoothly
        if (rotationTween) {
            rotationTween.kill();
        }
        
        // Get current rotation and snap to nearest 360 degree increment
        const currentRotation = gsap.getProperty(iconImg, 'rotation');
        const nearestComplete = Math.round(currentRotation / 360) * 360;
        
        gsap.to(iconImg, {
            scale: 1,
            rotation: nearestComplete,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)'
        });
        
        gsap.to(glowElement, {
            opacity: 0.3,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
    
    // Note: Subtitle (.how-it-works-subtitle) is a <p> tag and will be handled by animations-common.js initParagraphAnimations
    // Note: Title (.how-it-works-title) is an <h2> tag and will be handled by animations-common.js initH2Animations
    // Note: CTA button (.btn-primary-light) is handled by global-buttons.js
    
    // All entrance animations are now handled by the common animation system with automatic stagger
};

/**
 * Initialize How It Works step animations
 */
window.RPM.initHowItWorksSteps = function() {
    // Initialize DrawSVG for the connector paths
    gsap.set('.how-it-works-connector path', {
        drawSVG: '0% 0%'
    });

    // Set initial state for step description paragraphs
    gsap.set('.how-it-works-step-description', {
        opacity: 0,
        y: 30
    });

    // Create timeline for the How It Works animation
    const howItWorksTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.how-it-works-steps',
            start: 'top 70%',
            end: () => {
                const step3 = document.querySelector('.how-it-works-step.step-3');
                if (step3) {
                    const step3Top = step3.offsetTop + step3.offsetHeight / 2;
                    return `${step3Top}px 30%`;
                }
                return 'bottom 30%';
            },
            scrub: 1.5,
            // Add snap to prevent instant scrubbing on fast scrolls
            snap: {
                snapTo: 1 / 100, // Snap to 1% increments
                duration: { min: 0.1, max: 0.5 }, // Limit animation speed between 0.1s and 0.5s
                ease: "power1.inOut"
            },
            toggleActions: 'play none none none'
        }
    });

    // Helper function to animate a step
    const animateStep = (stepNum, startTime) => {
        const stepClass = `.step-${stepNum}`;
        
        // Card container
        howItWorksTimeline.to(`.how-it-works-step${stepClass}`, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, startTime);

        // Border stroke
        howItWorksTimeline.to(`${stepClass} .how-it-works-step-border-path`, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: 'power2.inOut'
        }, startTime + 0.3);

        // Background
        howItWorksTimeline.to(`.how-it-works-step${stepClass}`, {
            backgroundColor: '#fffef8',
            duration: 0.4,
            ease: 'power2.out'
        }, startTime + 0.7);

        // Content
        howItWorksTimeline.to(`${stepClass} .how-it-works-step-content`, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, startTime + 0.9);

        // Paragraph
        howItWorksTimeline.fromTo(`${stepClass} .how-it-works-step-description`, {
            opacity: 0,
            y: 10
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, startTime + 1.1);

        // Shadow (if not first step)
        if (stepNum !== 1) {
            howItWorksTimeline.to(`.how-it-works-step${stepClass}`, {
                '--shadow-opacity': 1,
                duration: 0.6,
                ease: 'power2.out'
            }, startTime + 1.3);
        }
    };

    // Helper function to animate connector
    const animateConnector = (connectorNum, startTime) => {
        // Draw connector line
        howItWorksTimeline.to(`.connector-${connectorNum} path`, {
            opacity: 1,
            drawSVG: '0% 100%',
            duration: 1,
            ease: 'power2.inOut'
        }, startTime);

        // End cap pop
        howItWorksTimeline.fromTo(`.end-cap-${connectorNum}`, {
            opacity: 0,
            scale: 0
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(3)',
            transformOrigin: 'center center'
        }, startTime + 0.9);

        // Sparks burst
        const sparkPositions = [
            { x: -12, y: -12 },
            { x: 12, y: -12 },
            { x: -12, y: 12 },
            { x: 12, y: 12 }
        ];

        sparkPositions.forEach((pos, i) => {
            howItWorksTimeline.to(`.spark-${connectorNum}-${i + 1}`, {
                opacity: 1,
                x: pos.x,
                y: pos.y,
                scale: 0.5,
                duration: 0.5,
                ease: 'power2.out'
            }, startTime + 0.9);
        });

        // Fade out sparks
        howItWorksTimeline.to([
            `.spark-${connectorNum}-1`,
            `.spark-${connectorNum}-2`,
            `.spark-${connectorNum}-3`,
            `.spark-${connectorNum}-4`
        ], {
            opacity: 0,
            duration: 0.3
        }, startTime + 1.2);
    };

    // Animate all steps and connectors
    animateStep(1, 0);
    howItWorksTimeline.to('.how-it-works-step.step-1', {
        '--shadow-opacity': 1,
        duration: 0.6,
        ease: 'power2.out'
    }, 0.6);
    
    animateConnector(1, 2.4);
    animateStep(2, 1.1);
    animateConnector(2, 3.6);
    animateStep(3, 2.7);
};

/**
 * Initialize physics-based string animation for connectors
 */
window.RPM.initConnectorPhysics = function() {
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let animationFrame;
    let jiggleOffset = 0;
    let jiggleVelocity = 0;

    // Function to calculate bent path with jiggle
    function getBentPath(path, bendAmount, connectorIndex, jiggleOffset, jiggleFactor) {
        const originalPath = path.getAttribute('data-original-path');
        if (!originalPath) {
            path.setAttribute('data-original-path', path.getAttribute('d'));
            return path.getAttribute('d');
        }
        
        const jiggle1 = jiggleOffset * 0.6 + jiggleFactor;
        const jiggle2 = jiggleOffset * -0.4 + jiggleFactor * -0.8;
        
        if (connectorIndex === 0) {
            const cp1x = bendAmount + jiggle1;
            const cp1y = 340 + jiggle2;
            const cp2x = 128 + bendAmount + jiggle2;
            const cp2y = 340 - jiggle1;
            return `M 0 226.5 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 128 453`;
        } else if (connectorIndex === 1) {
            const cp1x = bendAmount + jiggle1;
            const cp1y = 340 + jiggle2;
            const cp2x = 128 + bendAmount + jiggle2;
            const cp2y = 340 - jiggle1;
            return `M 0 453 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 128 226.5`;
        }
        
        return originalPath;
    }

    // Function to apply string physics to connectors
    function applyStringPhysics() {
        const connectors = document.querySelectorAll('.how-it-works-connector path');
        const currentScrollY = window.scrollY;
        
        const newVelocity = (currentScrollY - lastScrollY) * 1.5;
        const velocityChange = Math.abs(newVelocity - scrollVelocity);
        scrollVelocity = newVelocity;
        lastScrollY = currentScrollY;
        
        jiggleVelocity += velocityChange * 1.5;
        
        const jiggleSpring = -jiggleOffset * 0.15;
        const jiggleDamping = -jiggleVelocity * 0.35;
        jiggleVelocity += jiggleSpring + jiggleDamping;
        jiggleOffset += jiggleVelocity;
        
        jiggleOffset = Math.max(-25, Math.min(25, jiggleOffset));
        
        connectors.forEach((path, index) => {
            const pathOpacity = parseFloat(window.getComputedStyle(path).opacity);
            
            if (pathOpacity > 0) {
                const bendAmount = Math.min(Math.abs(scrollVelocity) * 0.8, 22);
                const direction = scrollVelocity > 0 ? 1 : -1;
                const jiggleFactor = Math.sin(Date.now() * 0.012) * Math.abs(jiggleOffset) * 0.45;
                
                gsap.to(path, {
                    attr: {
                        'd': getBentPath(path, bendAmount * direction, index, jiggleOffset, jiggleFactor)
                    },
                    duration: 0.18,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            }
        });
        
        scrollVelocity *= 0.86;
        jiggleVelocity *= 0.93;
        
        if (Math.abs(scrollVelocity) > 0.08 || Math.abs(jiggleOffset) > 0.4 || Math.abs(jiggleVelocity) > 0.08) {
            animationFrame = requestAnimationFrame(applyStringPhysics);
        }
    }

    // Listen to scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        animationFrame = requestAnimationFrame(applyStringPhysics);
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const connectors = document.querySelectorAll('.how-it-works-connector path');
            connectors.forEach((path) => {
                const originalPath = path.getAttribute('data-original-path');
                if (originalPath) {
                    gsap.to(path, {
                        attr: { 'd': originalPath },
                        duration: 0.8,
                        ease: 'elastic.out(1, 0.3)'
                    });
                }
            });
        }, 200);
    }, { passive: true });
};

/**
 * Initialize all How It Works animations
 */
window.RPM.initHowItWorks = function() {
    window.RPM.initHowItWorksHero();
    window.RPM.initHowItWorksSteps();
    window.RPM.initConnectorPhysics();
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initHowItWorks();
    console.log('How It Works animations initialized');
});
