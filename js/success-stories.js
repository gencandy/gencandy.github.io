/**
 * Carousel Components
 * Handles Success Stories and Pay-As-You-Go carousels
 */

window.RPM = window.RPM || {};

/**
 * Animate Success Cards on Scroll
 */
function animateSuccessCards() {
    const cards = document.querySelectorAll('.success-card');
    
    cards.forEach((card, index) => {
        // FIRST CARD: Full 6-step animation sequence
        if (index === 0) {
            const imageWrapper = card.querySelector('.success-card-image-wrapper');
            const imageContent = card.querySelector('.success-card-overlay');
            const title = card.querySelector('.success-card-title');
            const quote = card.querySelector('.testimonial-quote');
            const author = card.querySelector('.testimonial-author');
            const watermark = card.querySelector('.success-card-logo-watermark');
            
            // Set initial states with immediate render
            gsap.set(card, { 
                opacity: 0, 
                y: 60,
                scale: 0.95,
                force3D: true, 
                immediateRender: true 
            });
            gsap.set(imageWrapper, { 
                clipPath: 'inset(0 100% 0 0 round 34px)',
                opacity: 0,
                force3D: true,
                immediateRender: true
            });
            gsap.set(imageContent, { opacity: 0, y: 30, force3D: true, immediateRender: true });
            gsap.set(title, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(quote, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(author, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(watermark, { opacity: 0, rotation: -15, scale: 0.95, force3D: true, immediateRender: true });
            
            // Create animation timeline with modern easing
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'top 40%',
                    toggleActions: 'play none none none'
                }
            });
            
            // 1. Card fades in and lifts up with scale
            tl.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.0,
                ease: 'expo.out'
            })
            
            // 1.5. Title fades in and up shortly after card (tied to container)
            .to(title, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                force3D: true
            }, '0.2')  // 0.2s after card starts appearing
            
            // 2. Image wrapper clips open from left to right WITH rounded borders
            .to(imageWrapper, {
                clipPath: 'inset(0 0% 0 0 round 34px)', // Maintains 34px border radius
                opacity: 1,
                duration: 1.2,
                ease: 'expo.inOut' // Modern smooth easing
            }, '0.3') // Earlier - starts at 0.3s instead of 0.6s+
            
            // 3. Image content fades in and up
            .to(imageContent, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '0.8') // Earlier - starts at 0.8s instead of 1.5s
            
            // 4. Testimonial quote fades in and up
            .to(quote, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                force3D: true
            }, '1.2') // Earlier - starts at 1.2s instead of 2.0s
            
            // 5. Author fades in and up (in sequence after quote)
            .to(author, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                force3D: true
            }, '1.5') // Earlier - starts at 1.5s instead of 2.3s
            
            // 6. Watermark fades, rotates and scales in
            .to(watermark, {
                opacity: 0.05,
                rotation: 0,
                scale: 1,
                duration: 1.4,
                ease: 'expo.out'
            }, '1.6'); // Earlier - starts at 1.6s instead of 2.5s
        } 
        // CARD 2: Full animation sequence with stagger delay
        else if (index === 1) {
            const imageWrapper = card.querySelector('.success-card-image-wrapper');
            const imageContent = card.querySelector('.success-card-overlay');
            const title = card.querySelector('.success-card-title');
            const quote = card.querySelector('.testimonial-quote');
            const author = card.querySelector('.testimonial-author');
            const watermark = card.querySelector('.success-card-logo-watermark');
            
            // Set initial states with immediate render
            gsap.set(card, { 
                opacity: 0, 
                y: 60,
                scale: 0.9,
                force3D: true, 
                immediateRender: true 
            });
            gsap.set(imageWrapper, { 
                clipPath: 'inset(0 100% 0 0 round 34px)',
                opacity: 0,
                force3D: true,
                immediateRender: true
            });
            gsap.set(imageContent, { opacity: 0, y: 30, force3D: true, immediateRender: true });
            gsap.set(title, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(quote, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(author, { opacity: 0, y: 20, force3D: true, immediateRender: true });
            gsap.set(watermark, { opacity: 0, rotation: -15, scale: 0.95, force3D: true, immediateRender: true });
            
            // Create animation timeline with stagger delay
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    end: 'top 40%',
                    toggleActions: 'play none none none'
                },
                delay: 1.6 // Increased stagger delay after card 2
            });
            
            // Same animation sequence as card 1 but card stays at 90% scale
            tl.to(card, {
                opacity: 0.6,
                y: 0,
                scale: 0.9,
                duration: 1.0,
                ease: 'expo.out'
            })
            .to(title, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                force3D: true
            }, '0.2')
            .to(imageWrapper, {
                clipPath: 'inset(0 0% 0 0 round 34px)',
                opacity: 1,
                duration: 1.2,
                ease: 'expo.inOut'
            }, '0.3')
            .to(imageContent, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '0.8')
            .to(quote, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                force3D: true
            }, '1.2')
            .to(author, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                force3D: true
            }, '1.5')
            .to(watermark, {
                opacity: 0.05,
                rotation: 0,
                scale: 1,
                duration: 1.4,
                ease: 'expo.out'
            }, '1.6');
        }
        // OTHER CARDS: Simple fade in
        else {
            gsap.set(card, { 
                opacity: 0, 
                y: 30,
                scale: 0.9
            });
            
            gsap.to(card, {
                opacity: 0.6,
                y: 0,
                scale: 0.9,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                delay: index * 0.15 // Stagger delay based on card position
            });
        }
    });
}

/**
 * Initialize Image Hover Effects for Success Cards
 */
function initSuccessCardImageHover() {
    const cards = document.querySelectorAll('.success-card');
    
    cards.forEach((card) => {
        const imageWrapper = card.querySelector('.success-card-image-wrapper');
        const overlay = card.querySelector('.success-card-overlay');
        const testimonialWrapper = card.querySelector('.success-card-testimonial-wrapper');
        const watermark = card.querySelector('.success-card-logo-watermark');
        const arrow = card.querySelector('.card-arrow');
        
        if (!imageWrapper || !overlay || !testimonialWrapper || !watermark || !arrow) return;
        
        // Hover in - expand image wrapper and fade out testimonial (triggered by overlay hover)
        overlay.addEventListener('mouseenter', () => {
            gsap.to(imageWrapper, {
                width: '100%',
                maxWidth: '100%',
                minWidth: '100%',
                duration: 1.2,
                ease: 'expo.inOut' // Award-winning Apple-style easing
            });
            
            gsap.to([testimonialWrapper], {
                opacity: 0,
                duration: 1.0,
                marginBottom: '-30px',
                ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Sophisticated ease-in-out-quad
            });
            gsap.to([watermark], {
                opacity: 0,
                duration: 1.2,
                top: '-230px',
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)' // Smooth custom ease with gentle deceleration
            });
            
            // Arrow shoots out diagonally top-right
            gsap.to(arrow, {
                x: 30,
                y: -30,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });
        });
        
        // Hover out - return image wrapper to 70% and fade in testimonial
        overlay.addEventListener('mouseleave', () => {
            gsap.to(imageWrapper, {
                width: '70%',
                maxWidth: '798px',
                minWidth: '70%',
                duration: 1.2,
                ease: 'expo.inOut' // Award-winning Apple-style easing
            });
            
            gsap.to(testimonialWrapper, {
                opacity: 1,
                duration: 1.0,
                marginBottom: '0',
                ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Smooth bounce-out for natural feel
                delay: 0.3
            });
            
            gsap.to(watermark, {
                opacity: 0.05,
                duration: 1.2,
                top: '-200px',
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth custom ease with gentle acceleration
                delay: 0.3
            });
            
            // Arrow shoots up from bottom-left
            gsap.fromTo(arrow, 
                {
                    x: -30,
                    y: 30,
                    opacity: 0
                },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: 0.1
                }
            );
        });
    });
}

/**
 * Initialize Success Stories Carousel
 */
window.RPM.initSuccessStoriesCarousel = function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('stories-prev');
    const nextBtn = document.getElementById('stories-next');
    const cards = document.querySelectorAll('.success-card');
    
    if (!track || !prevBtn || !nextBtn || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    function getCardWidth() {
        return cards[0].offsetWidth;
    }
    
    function getGap() {
        return 20; // var(--spacing-2xl)
    }
    
    function updateCarousel() {
        const cardWidth = getCardWidth();
        const gap = getGap();
        const carouselWidth = track.parentElement.offsetWidth;
        
        // Calculate offset to center the card
        const centerOffset = (carouselWidth - cardWidth) / 2;
        const offset = -currentIndex * (cardWidth + gap) + centerOffset;
        
        gsap.to(track, {
            x: offset,
            duration: 0.8,
            ease: "power3.out"
        });
        
        // Update button states - prev button is disabled at start
        prevBtn.disabled = currentIndex === 0;
        prevBtn.classList.toggle('active', currentIndex > 0);
        
        // Next button is disabled at end
        nextBtn.disabled = currentIndex === totalCards - 1;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            // Animate previous active card back to inactive state
            gsap.to(cards[currentIndex], {
                opacity: 0.6,
                scale: 0.9,
                duration: 0.6,
                ease: 'expo.inOut'
            });
            
            currentIndex--;
            
            // Animate new active card to active state
            gsap.to(cards[currentIndex], {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'expo.inOut'
            });
            
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            // Animate current active card to inactive state
            gsap.to(cards[currentIndex], {
                opacity: 0.6,
                scale: 0.9,
                duration: 0.6,
                ease: 'expo.inOut'
            });
            
            currentIndex++;
            
            // Animate new active card to active state
            gsap.to(cards[currentIndex], {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'expo.inOut'
            });
            
            updateCarousel();
        }
    });
    
    updateCarousel();
    
    // Animate cards on scroll into view
    animateSuccessCards();
    
    // Initialize image hover effects
    initSuccessCardImageHover();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 200);
    });
};

/**
 * Initialize Pay-As-You-Go Carousel with 3D effects
 */
window.RPM.initPayAsYouGoCarousel = function() {
    const track = document.querySelector('.pay-as-you-go-carousel-track');
    const prevBtn = document.getElementById('paygo-prev');
    const nextBtn = document.getElementById('paygo-next');
    const cards = document.querySelectorAll('.pay-as-you-go-card');
    
    if (!track || !prevBtn || !nextBtn || !cards.length) return;
    
    let hoverEnabled = false;
    
    // Disable hover effects and pointer events initially on entire cards
    cards.forEach(card => {
        card.classList.add('hover-disabled');
        const cardImage = card.querySelector('.pay-as-you-go-card-image');
        if (cardImage) {
            cardImage.classList.add('hover-disabled');
        }
    });
    
    let currentIndex = 0;
    const cardWidth = 450;
    const gap = 20;
    const cardsToShow = 3;
    const maxIndex = Math.max(0, cards.length - cardsToShow);
    
    function updateCarousel() {
        const offset = -currentIndex * (cardWidth + gap);
        gsap.to(track, {
            x: offset,
            duration: 0.2,
            ease: "power3.out"
        });
        
        prevBtn.classList.toggle('active', currentIndex > 0);
        prevBtn.disabled = currentIndex === 0;
        
        nextBtn.classList.toggle('active', currentIndex < maxIndex);
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    updateCarousel();
    
    // Set initial states for entrance animation
    cards.forEach((card, index) => {
        const content = card.querySelector('.pay-as-you-go-card-content');
        const cardImage = card.querySelector('.pay-as-you-go-card-image');
        
        if (content) {
            gsap.set(content, { opacity: 0, y: 20 });
        }
        
        // Progressive background colors for stacked effect
        if (cardImage) {
            const colors = [
                'rgba(15, 70, 211, 1)',
                '#255debff',
                '#478dfdff',
                '#71a5f8ff',
                '#6AA3FF',
                '#BFD8FF'
            ];
            cardImage.style.backgroundColor = colors[Math.min(index, colors.length - 1)];
        }
    });
    
    // Initial stacked position
    gsap.set(cards, {
        opacity: 0,
        x: (index) => {
            const trackWidth = track.offsetWidth;
            const centerX = trackWidth / 2 - cardWidth / 2;
            return centerX - (index * (cardWidth + gap));
        },
        y: 60,
        scale: 0.95,
        rotation: (index) => {
            if (index === 0) return 0;
            if (index === 1) return -5;
            if (index === 2) return 5;
            return 0;
        },
        zIndex: (index) => cards.length - index
    });
    
    // Phase 1: Cards enter stacked
    ScrollTrigger.create({
        trigger: '.pay-as-you-go-carousel',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out"
            });
        }
    });
    
    // Phase 2: Cards fan out
    ScrollTrigger.create({
        trigger: '.pay-as-you-go-carousel',
        start: 'top 40%',
        once: true,
        onEnter: () => {
            gsap.to(cards, {
                x: 0,
                rotation: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.inOut",
                clearProps: "x,y,scale,zIndex"
            });
            
            // Animate backgrounds back to original
            cards.forEach((card) => {
                const cardImage = card.querySelector('.pay-as-you-go-card-image');
                if (cardImage) {
                    gsap.to(cardImage, {
                        backgroundColor: '#011F8B',
                        duration: 0.8,
                        ease: "power3.inOut"
                    });
                }
            });
            
            // Glow trail effect
            setTimeout(() => {
                const cardImages = Array.from(cards)
                    .map(card => card.querySelector('.pay-as-you-go-card-image'))
                    .filter(img => img);
                
                const numberOfCards = cardImages.length;
                const staggerDelay = 0.12; // 120ms between each card
                const glowInDuration = 0.5; // 500ms
                const pauseDuration = 0.15; // 150ms
                const glowOutDuration = 0.6; // 600ms
                
                // Calculate when the last card's animation completes
                const lastCardDelay = (numberOfCards - 1) * staggerDelay;
                const totalTrailDuration = (lastCardDelay + glowInDuration + pauseDuration + glowOutDuration) * 1000; // Convert to ms
                
                cardImages.forEach((cardImage, index) => {
                    const glowTimeline = gsap.timeline({ delay: index * staggerDelay });
                    
                    glowTimeline
                        .to(cardImage, {
                            boxShadow: '0 0 12.3px -1px #EAF2FF inset, 0 0 60px -10px #6AA3FF inset, 0 0 60px 18px #005AEA inset',
                            duration: glowInDuration,
                            ease: "circ.out"
                        })
                        .to(cardImage, {
                            boxShadow: '',
                            duration: glowOutDuration,
                            ease: "sine.inOut"
                        }, `+=${pauseDuration}`);
                });
                
                // Enable hover after trail completes (reduced buffer for faster enable)
                setTimeout(() => {
                    hoverEnabled = true;
                    cards.forEach(card => {
                        card.classList.remove('hover-disabled');
                        const cardImage = card.querySelector('.pay-as-you-go-card-image');
                        if (cardImage) {
                            cardImage.classList.remove('hover-disabled');
                        }
                    });
                }, totalTrailDuration - 200); // Reduced: enable 200ms before trail fully completes
            }, 0);
            
            // Reveal content
            setTimeout(() => {
                const contents = Array.from(cards)
                    .map(card => card.querySelector('.pay-as-you-go-card-content'))
                    .filter(c => c);
                
                const contentTimeline = gsap.timeline({ paused: true });
                contentTimeline.to(contents, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out"
                });
                
                ScrollTrigger.create({
                    onReverseComplete: () => {
                        hoverEnabled = false;
                        cards.forEach(card => {
                            card.classList.add('hover-disabled');
                            const cardImage = card.querySelector('.pay-as-you-go-card-image');
                            if (cardImage) {
                                cardImage.classList.add('hover-disabled');
                            }
                        });
                    }
                });
                
                ScrollTrigger.create({
                    trigger: '.pay-as-you-go-carousel',
                    start: 'top 40%',
                    end: 'bottom 15%',
                    onEnter: () => contentTimeline.play()
                });
            }, 800);
        }
    });
    
    // 3D Mouse-tracking effect
    window.RPM.init3DCardEffects(cards, hoverEnabled);
};

/**
 * Initialize 3D card hover effects
 */
window.RPM.init3DCardEffects = function(cards) {
    cards.forEach(card => {
        const cardImage = card.querySelector('.pay-as-you-go-card-image');
        if (!cardImage) return;
        
        // Create SVG overlay
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'card-perspective-lines');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        cardImage.appendChild(svg);
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);
        
        const lines = [];
        const cardId = Math.random().toString(36).substr(2, 9);
        
        for (let i = 0; i < 16; i++) {
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', `line-gradient-${cardId}-${i}`);
            gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
            
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('style', 'stop-color:rgba(186, 234, 255, 0.25); stop-opacity:1');
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('style', 'stop-color:rgba(186, 234, 255, 0); stop-opacity:0');
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', `url(#line-gradient-${cardId}-${i})`);
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
            lines.push({ element: line, gradient: gradient });
        }
        
        cardImage.addEventListener('mouseenter', function() {
            // Check if hover is disabled
            if (cardImage.classList.contains('hover-disabled')) return;
            
            cardImage.style.transition = 'none';
            svg.style.opacity = '1';
        });
        
        cardImage.addEventListener('mousemove', function(e) {
            // Check if hover is disabled
            if (cardImage.classList.contains('hover-disabled')) return;
            const rect = cardImage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            const xFromCenter = (xPercent - 0.5) * 2;
            const yFromCenter = (yPercent - 0.5) * 2;
            
            const depthIntensity = 25;
            const spreadVariation = 25;
            
            const shadowX = xFromCenter * depthIntensity;
            const shadowY = yFromCenter * depthIntensity;
            
            const spread = 18 + (Math.abs(xFromCenter) + Math.abs(yFromCenter)) * spreadVariation;
            
            cardImage.style.boxShadow = `
                0 0 12.3px -1px var(--color-brand-25, #EAF2FF) inset,
                ${shadowX * 0.5}px ${shadowY * 0.5}px 60px -10px var(--color-brand-200, #6AA3FF) inset,
                ${shadowX}px ${shadowY}px 70px ${spread}px var(--color-brand-500, #005AEA) inset
            `;
            
            // Update perspective lines
            const width = rect.width;
            const height = rect.height;
            
            const vanishX = xPercent * width;
            const vanishY = yPercent * height;
            
            const depthFactor = 0.3;
            const convergenceX = vanishX + (width * 0.5 - vanishX) * depthFactor;
            const convergenceY = vanishY + (height * 0.5 - vanishY) * depthFactor;
            
            const points = [
                { x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height },
                { x: width * 0.5, y: 0 }, { x: width, y: height * 0.5 },
                { x: width * 0.5, y: height }, { x: 0, y: height * 0.5 },
                { x: width * 0.25, y: 0 }, { x: width * 0.75, y: 0 },
                { x: width, y: height * 0.25 }, { x: width, y: height * 0.75 },
                { x: width * 0.75, y: height }, { x: width * 0.25, y: height },
                { x: 0, y: height * 0.75 }, { x: 0, y: height * 0.25 }
            ];
            
            points.forEach((point, i) => {
                const line = lines[i];
                const dx = convergenceX - point.x;
                const dy = convergenceY - point.y;
                const stopPercent = 0.3;
                const x2 = point.x + (dx * stopPercent);
                const y2 = point.y + (dy * stopPercent);
                
                line.element.setAttribute('x1', point.x);
                line.element.setAttribute('y1', point.y);
                line.element.setAttribute('x2', x2);
                line.element.setAttribute('y2', y2);
                
                line.gradient.setAttribute('x1', point.x);
                line.gradient.setAttribute('y1', point.y);
                line.gradient.setAttribute('x2', x2);
                line.gradient.setAttribute('y2', y2);
            });
        });
        
        cardImage.addEventListener('mouseleave', function() {
            // Check if hover is disabled (always allow cleanup)
            cardImage.style.transition = 'box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardImage.style.boxShadow = '';
            svg.style.opacity = '0';
        });
    });
};

/**
 * Initialize all carousel components
 */
window.RPM.initCarousels = function() {
    window.RPM.initSuccessStoriesCarousel();
    window.RPM.initPayAsYouGoCarousel();
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initCarousels();
    console.log('Carousels initialized');
});

