# RPM Website Demo

A modern, responsive website for Reliable Premium Management built with Foundation framework.

## Project Structure

```
RPM DEMO/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Global styles and utilities
│   └── header.css      # Header and navigation styles
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Local image assets
├── assets/             # Additional assets (fonts, icons, etc.)
└── README.md          # This file
```

## Technologies Used

- **Foundation 6.8.1** - Responsive front-end framework
- **jQuery 3.6.0** - JavaScript library (required by Foundation)
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables

## Getting Started

### Option 1: Simple Local Server (Python)

```bash
cd ~/Documents/Development/RPM\ DEMO
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Option 2: Simple Local Server (Node.js)

```bash
cd ~/Documents/Development/RPM\ DEMO
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Design System

### Colors
- **Brand Primary**: `#005aea`
- **Brand Dark**: `#004abf`
- **Brand Light**: `#4089ff`
- **Brand Extra Light**: `#bfd8ff`
- **Dark Blue**: `#000059`
- **White**: `#ffffff`

### Typography
- **Primary Font**: Modern Era
- **Secondary Font**: Inter
- **Font Sizes**: 14px, 16px, 18px, 24px

### Spacing
Uses a consistent spacing scale from 2px to 64px

## Current Status

✅ Sub-header with navigation  
✅ Main header with logo and CTA button  
🔲 Hero section (placeholder)  
🔲 Content sections  
🔲 Footer (placeholder)  

## Next Steps

1. Build out hero section from Figma
2. Add "Who We Serve" section
3. Add "How It Works" section
4. Build footer with all links
5. Add mobile menu functionality
6. Optimize images and assets

## Notes

- Currently using placeholder images from Figma's localhost server
- Replace with actual hosted images before deployment
- Mobile responsive breakpoints at 768px and 1024px
- Foundation's grid system used throughout
