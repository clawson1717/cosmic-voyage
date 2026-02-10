# 🤝 Contributing to Cosmic Voyage

First off, thank you for considering contributing to Cosmic Voyage! 🚀 It's people like you that make this project a great tool for space enthusiasts around the world.

This document provides guidelines for contributing to the project. Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to:

- **Be respectful** - Treat everyone with respect. Healthy debate is encouraged, but harassment is not tolerated.
- **Be constructive** - Provide constructive feedback and be open to receiving it.
- **Be inclusive** - Welcome newcomers and help them learn.
- **Focus on what's best** - Consider what is best for the community and the project.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **Git** installed
- A **GitHub** account
- Basic knowledge of HTML, CSS, and JavaScript

### Quick Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/cosmic-voyage.git

# 3. Navigate to the project
cd cosmic-voyage

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000 in your browser
```

---

## 💡 How Can I Contribute?

### Reporting Bugs 🐛

Before creating a bug report, please:

1. **Check existing issues** - Search to see if the bug has already been reported
2. **Check if it's been fixed** - Try the latest `main` branch
3. **Collect information** - Browser version, OS, steps to reproduce

When creating a bug report, include:

```markdown
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 120.0]
```

### Suggesting Features ✨

Feature requests are welcome! Please:

1. **Check the roadmap** - See [ROADMAP.md](./ROADMAP.md) for planned features
2. **Search existing issues** - Someone may have already suggested it
3. **Provide details** - Explain the feature and its benefits

Use this template:

```markdown
**Feature Description:**
A clear description of the feature.

**Problem it Solves:**
What problem does this feature solve?

**Proposed Solution:**
How should this feature work?

**Alternatives:**
Any alternative solutions you've considered.

**Additional Context:**
Screenshots, mockups, or examples from other sites.
```

### Contributing Code 💻

1. **Check issues** - Look for issues labeled `good first issue` or `help wanted`
2. **Comment on the issue** - Let others know you're working on it
3. **Fork and branch** - Create a feature branch from `main`
4. **Make changes** - Follow our coding standards
5. **Test** - Ensure your changes work across browsers
6. **Submit PR** - Create a pull request with a clear description

### Improving Documentation 📝

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or screenshots
- Translate documentation
- Improve README structure

---

## 🔧 Development Setup

### Project Structure

```
cosmic-voyage/
├── 📄 index.html              # Main HTML entry point
├── 📁 src/
│   ├── 📁 js/
│   │   └── 📄 space.js        # Core JavaScript
│   └── 📁 css/
│       └── 📄 styles.css      # All styles
├── 📁 public/                 # Static assets
├── 📄 vite.config.js          # Vite configuration
├── 📄 package.json            # Dependencies
├── 📄 eslint.config.js        # Linting rules
└── 📄 .prettierrc             # Formatting config
```

### Development Workflow

```bash
# Start development server with hot reload
npm run dev

# Check code for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Checklist

Before submitting a PR, test your changes:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)
- [ ] Different screen sizes (responsive)
- [ ] Dark mode (if applicable)
- [ ] Keyboard navigation
- [ ] No console errors

---

## 📐 Coding Standards

### HTML

```html
<!-- Use semantic HTML -->
<section id="features">
  <h2>Features</h2>
  <article class="feature-card">
    <h3>Feature Title</h3>
    <p>Description</p>
  </article>
</section>

<!-- Include alt text for images -->
<img src="planet.png" alt="Animated planet with rings">

<!-- Use kebab-case for IDs and classes -->
<div id="solar-system" class="planet-container"></div>
```

### CSS

```css
/* Use CSS custom properties for colors */
.feature-card {
  background: var(--deep-space);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Use BEM-like naming for complex components */
.planet__body--large { }

/* Mobile-first media queries */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Group related properties */
.planet {
  /* Positioning */
  position: absolute;
  top: 50%;
  left: 50%;
  
  /* Display & Box Model */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  
  /* Visual */
  background: linear-gradient(...);
  box-shadow: ...;
  
  /* Animation */
  animation: rotate 20s linear infinite;
}
```

### JavaScript

```javascript
// Use ES6+ features
const planetData = {
  earth: {
    name: 'Earth',
    moons: 1
  }
};

// Use class-based architecture
class PlanetRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  // Use descriptive method names
  renderPlanet(planet, x, y) {
    // Implementation
  }
}

// Use async/await for asynchronous operations
async function fetchPlanetData(planetId) {
  try {
    const response = await fetch(`/api/planets/${planetId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch planet data:', error);
    return null;
  }
}

// Document with JSDoc comments
/**
 * Creates a new starfield animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} starCount - Number of stars to create
 * @returns {Starfield} The starfield instance
 */
function createStarfield(canvas, starCount = 1000) {
  return new Starfield(canvas, starCount);
}
```

### Performance Guidelines

- ✅ Use `transform` and `opacity` for animations (GPU accelerated)
- ✅ Debounce scroll and resize event handlers
- ✅ Use `requestAnimationFrame` for canvas animations
- ✅ Lazy load images below the fold
- ✅ Minimize DOM manipulations
- ❌ Don't animate `width`, `height`, `top`, `left` properties
- ❌ Don't use `setInterval` for animations
- ❌ Don't forget to clean up event listeners

### Accessibility Guidelines

- ✅ Use semantic HTML elements
- ✅ Include `alt` text for images
- ✅ Ensure color contrast ratio ≥ 4.5:1
- ✅ Support keyboard navigation
- ✅ Add `aria-label` for icon buttons
- ✅ Use focus indicators
- ❌ Don't rely solely on color to convey information
- ❌ Don't use `outline: none` without replacement

---

## 📝 Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |

### Examples

```bash
# Feature
feat(planets): add hover tooltips to all planets

# Bug fix
fix(canvas): resolve starfield flickering on resize

# Documentation
docs(readme): update installation instructions

# Style
style(css): format with Prettier

# Refactor
refactor(js): extract planet data to separate module

# Performance
perf(animation): optimize starfield rendering with object pooling
```

### Commit Best Practices

- ✅ Use present tense ("Add feature" not "Added feature")
- ✅ Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- ✅ Limit first line to 72 characters
- ✅ Reference issues and PRs in the body
- ✅ Be descriptive but concise

---

## 🔀 Pull Request Process

### Before Creating a PR

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run quality checks**
   ```bash
   npm run lint
   npm run format:check
   ```

3. **Test your changes** - See testing checklist above

4. **Update documentation** - If your change affects usage

### Creating a PR

1. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository and click "New Pull Request"

3. Fill out the PR template:

   ```markdown
   ## Description
   Brief description of changes

   ## Related Issue
   Fixes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation
   - [ ] Refactoring

   ## Testing
   Describe how you tested your changes

   ## Screenshots
   If applicable, add screenshots

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No console errors
   ```

4. Request review from maintainers

### PR Review Process

- Maintainers will review within 3-5 business days
- Address any requested changes
- Once approved, a maintainer will merge your PR
- Your contribution will be acknowledged in the changelog!

---

## 🌟 Recognition

Contributors will be:

- Listed in the [CHANGELOG.md](./CHANGELOG.md)
- Mentioned in release notes
- Added to the contributors section (coming soon)

---

## 💬 Community

### Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and ideas
- **Discord** (coming soon) - Real-time chat

### Code of Conduct Reminders

- Be kind and respectful
- Assume good intentions
- Focus on constructive feedback
- Help others learn

---

## 📚 Resources

### Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [CSS-Tricks](https://css-tricks.com/) - CSS techniques and tips
- [Web.dev](https://web.dev/) - Google's web development guidance

### Project Resources

- [ROADMAP.md](./ROADMAP.md) - Future development plans
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [README.md](./README.md) - Project overview

---

## ❓ FAQ

**Q: Do I need to ask before working on an issue?**
A: For `good first issue` or `help wanted` labels, feel free to start. For others, comment to claim it.

**Q: Can I work on something not in the roadmap?**
A: Absolutely! Open an issue to discuss it first.

**Q: I found a security issue. What should I do?**
A: Please email security concerns directly rather than opening a public issue.

**Q: How do I get my PR merged faster?**
A: Follow our guidelines, write clear descriptions, and respond promptly to feedback.

---

## 🙏 Thank You!

Your contributions make Cosmic Voyage better for everyone. Whether you're fixing a typo or adding a major feature, we appreciate your time and effort.

Happy coding, and reach for the stars! 🚀✨

---

<p align="center">
  <a href="https://github.com/clawson1717/cosmic-voyage/issues">🐛 Report Bug</a> •
  <a href="https://github.com/clawson1717/cosmic-voyage/issues">✨ Request Feature</a> •
  <a href="https://github.com/clawson1717/cosmic-voyage/discussions">💬 Discuss</a>
</p>
