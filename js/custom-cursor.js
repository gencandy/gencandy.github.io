/**
 * Custom Cursor Module
 * Handles custom animated cursors for interactive elements
 */

window.RPM = window.RPM || {};

/**
 * Setup custom animated cursor for insights advice cards
 * Includes left/right directional arrows
 */
window.RPM.setupInsightsCursor = function() {
    const cardsContainer = document.querySelector('.insights-advice-right-column');
    if (!cardsContainer) return;
    
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    // Create arrow container
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'custom-cursor-arrow';
    
    // Create arrow image element
    const arrowImg = document.createElement('img');
    arrowImg.src = 'assets/icons/Arrows/chevron-right.svg';
    arrowImg.alt = 'Arrow';
    
    arrowContainer.appendChild(arrowImg);
    cursor.appendChild(arrowContainer);
    document.body.appendChild(cursor);
    
    let currentDirection = null;
    
    // Track mouse position and update cursor
    cardsContainer.addEventListener('mousemove', (e) => {
        const rect = cardsContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const containerWidth = rect.width;
        const midpoint = containerWidth / 2;
        
        // Update cursor position
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Determine direction
        const newDirection = mouseX < midpoint ? 'left' : 'right';
        
        // Update direction class if changed
        if (newDirection !== currentDirection) {
            currentDirection = newDirection;
            cursor.classList.remove('arrow-left', 'arrow-right');
            cursor.classList.add('arrow-' + newDirection);
        }
    });
    
    // Show cursor on enter
    cardsContainer.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    // Hide cursor on leave
    cardsContainer.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        currentDirection = null;
    });
    
    // Click animation
    cardsContainer.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });
    
    cardsContainer.addEventListener('mouseup', () => {
        setTimeout(() => {
            cursor.classList.remove('clicking');
        }, 500); // Match animation duration
    });
};

/**
 * Setup custom animated cursor for success stories image containers
 * Simple cursor without directional logic
 */
window.RPM.setupSuccessCursor = function() {
    const overlays = document.querySelectorAll('.success-card-overlay');
    if (overlays.length === 0) return;
    
    // Create custom cursor element (single cursor for all overlays)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor success-cursor';
    
    // Create arrow container
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'custom-cursor-arrow';
    
    // Create arrow image element - using diagonal up-right arrow
    const arrowImg = document.createElement('img');
    arrowImg.src = 'assets/icons/Arrows/arrow-up-right.svg';
    arrowImg.alt = 'View case study';
    
    arrowContainer.appendChild(arrowImg);
    cursor.appendChild(arrowContainer);
    document.body.appendChild(cursor);
    
    // Track mouse position and update cursor for each overlay
    overlays.forEach(overlay => {
        overlay.addEventListener('mousemove', (e) => {
            // Update cursor position
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Show cursor on enter
        overlay.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        
        // Hide cursor on leave
        overlay.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
        
        // Click animation
        overlay.addEventListener('mousedown', () => {
            cursor.classList.add('clicking');
        });
        
        overlay.addEventListener('mouseup', () => {
            setTimeout(() => {
                cursor.classList.remove('clicking');
            }, 500); // Match animation duration
        });
    });
};

/**
 * Initialize all custom cursors
 */
window.RPM.initCustomCursors = function() {
    window.RPM.setupInsightsCursor();
    window.RPM.setupSuccessCursor();
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.RPM.initCustomCursors();
});
