# 🚀 Cosmic Voyage

> An immersive, space-themed interactive website exploring the wonders of our universe.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

![Cosmic Voyage Preview](./preview.png)

## ✨ Features

- **🌌 Animated Starfield** - Dynamic canvas-based starfield with parallax effects, twinkling stars, and shooting stars
- **🪐 Interactive Solar System** - Clickable planets with detailed information panels
- **📱 Fully Responsive** - Mobile-first design that looks stunning on all devices
- **🎨 Modern Design** - Dark cosmic color palette with nebula gradients and glowing effects
- **⚡ Smooth Animations** - Scroll-triggered animations and hover effects
- **🎯 Single Page Experience** - Seamless scrolling between sections
- **🎮 Easter Egg** - Try the Konami code for a surprise!

## 🚀 Live Demo

Open `index.html` in your browser to explore the cosmos!

```bash
# Simply open the file
open index.html

# Or serve with a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
cosmic-voyage/
├── index.html          # Main HTML file with semantic structure
├── css/
│   └── styles.css      # All styling with cosmic theme
├── js/
│   └── space.js        # Interactive functionality
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties, animations, grid, flexbox
- **Vanilla JavaScript** - No build step, no dependencies
- **Canvas API** - For the starfield animation
- **Intersection Observer API** - For scroll animations
- **Google Fonts** - Orbitron & Exo 2

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Space | `#050508` | Background |
| Cosmic Black | `#0a0a0f` | Secondary background |
| Nebula Purple | `#1a0b2e` | Gradients |
| Accent Cyan | `#00d4ff` | Links, highlights |
| Accent Purple | `#9d4edd` | Gradients, accents |
| Planet Orange | `#ff6b35` | CTAs, warm accents |

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 🎯 Sections

### Hero
- Animated planet with orbiting moons and rings
- Gradient text effects
- Call-to-action buttons

### Solar System Explorer
- Interactive planetary orbits
- Hover tooltips with quick facts
- Detailed info panel on click

### Space Facts
- Grid of mind-blowing cosmic facts
- Hover animations with glow effects
- Responsive card layout

### Contact/Footer
- Newsletter subscription form
- Social media links
- Animated footer decoration

## 🔧 Customization

### Change Starfield Density
Edit `js/space.js` line 24:
```javascript
const starCount = Math.floor((this.canvas.width * this.canvas.height) / 3000);
// Lower number = more stars
```

### Change Planet Colors
Edit `css/styles.css` and modify the gradient backgrounds in the `.planet-body` classes.

### Add More Facts
Simply add more `.fact-card` elements to the `#facts` section in `index.html`.

## 🌟 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🙏 Acknowledgments

- Fonts by [Google Fonts](https://fonts.google.com)
- Inspired by the wonders of our universe
- Built with 💫 and stardust

---

<p align="center">Made with ❤️ by a fellow space enthusiast</p>
<p align="center">🌙 ⭐ 🪐 🚀 🌌</p>
