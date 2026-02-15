/**
 * Cosmic Voyage - Main Entry Point
 * Initializes all modules
 */

// Import all CSS
import '../css/_variables.css';
import '../css/_base.css';
import '../css/_typography.css';
import '../css/_layout.css';
import '../css/_components.css';
import '../css/_animations.css';
import '../css/_responsive.css';
import '../css/main.css';
import '../css/styles.css';
import '../css/apod-skeleton.css';

import { Starfield } from './modules/Starfield.js';
import { DarkMode } from './modules/DarkMode.js';
import { FactsSearch } from './modules/FactsSearch.js';

/**
 * Mobile Menu Handler
 */
class MobileMenu {
  constructor(hamburgerSelector, menuSelector) {
    this.hamburger = document.querySelector(hamburgerSelector);
    this.menu = document.querySelector(menuSelector);
    this.isOpen = false;
    
    if (this.hamburger && this.menu) {
      this.init();
    }
  }
  
  init() {
    this.hamburger.addEventListener('click', () => this.toggle());
    
    // Close on link click
    const links = this.menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('active', this.isOpen);
    this.menu.classList.toggle('active', this.isOpen);
    document.body.classList.toggle('menu-open', this.isOpen);
  }
  
  close() {
    this.isOpen = false;
    this.hamburger.classList.remove('active');
    this.menu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
}

/**
 * Planet Interaction Handler
 */
class PlanetInteraction {
  constructor(planetSelector, infoSelector) {
    this.planets = document.querySelectorAll(planetSelector);
    this.infoPanel = document.querySelector(infoSelector);
    this.planetData = {
      mercury: {
        name: 'Mercury',
        diameter: '4,879 km',
        distance: '57.9 million km from Sun',
        temperature: '167°C avg',
        moons: '0',
        day: '59 Earth days',
        year: '88 Earth days',
        description: 'The smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth\'s Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.'
      },
      venus: {
        name: 'Venus',
        diameter: '12,104 km',
        distance: '108.2 million km from Sun',
        temperature: '464°C',
        moons: '0',
        day: '243 Earth days',
        year: '225 Earth days',
        description: 'Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system with a thick atmosphere that traps heat in a runaway greenhouse effect.'
      },
      earth: {
        name: 'Earth',
        diameter: '12,742 km',
        distance: '149.6 million km from Sun',
        temperature: '15°C avg',
        moons: '1',
        day: '24 hours',
        year: '365.25 days',
        description: 'Our home planet is the only place we know of so far that\'s inhabited by living things. It\'s also the only planet in our solar system with liquid water on the surface.'
      },
      mars: {
        name: 'Mars',
        diameter: '6,779 km',
        distance: '227.9 million km from Sun',
        temperature: '-65°C avg',
        moons: '2',
        day: '24.6 hours',
        year: '687 Earth days',
        description: 'Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence that Mars was – billions of years ago – wetter and warmer, with a thick atmosphere.'
      },
      jupiter: {
        name: 'Jupiter',
        diameter: '139,820 km',
        distance: '778.5 million km from Sun',
        temperature: '-110°C avg',
        moons: '95',
        day: '9.9 hours',
        year: '11.9 Earth years',
        description: 'Jupiter is more than twice as massive as all the other planets combined. The Great Red Spot is a centuries-old storm bigger than Earth.'
      },
      saturn: {
        name: 'Saturn',
        diameter: '116,460 km',
        distance: '1.4 billion km from Sun',
        temperature: '-140°C avg',
        moons: '146',
        day: '10.7 hours',
        year: '29.5 Earth years',
        description: 'Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn\'s.'
      },
      uranus: {
        name: 'Uranus',
        diameter: '50,724 km',
        distance: '2.9 billion km from Sun',
        temperature: '-195°C avg',
        moons: '27',
        day: '17.2 hours',
        year: '84 Earth years',
        description: 'Uranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side.'
      },
      neptune: {
        name: 'Neptune',
        diameter: '49,244 km',
        distance: '4.5 billion km from Sun',
        temperature: '-200°C avg',
        moons: '14',
        day: '16.1 hours',
        year: '165 Earth years',
        description: 'Neptune is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations rather than by telescope.'
      }
    };
    
    this.init();
  }
  
  init() {
    this.planets.forEach(planet => {
      planet.addEventListener('click', (e) => {
        const planetKey = e.currentTarget.dataset.planet;
        this.showInfo(planetKey);
      });
    });
    
    // Close button
    const closeBtn = this.infoPanel?.querySelector('.close-info');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideInfo());
    }
  }
  
  showInfo(planetKey) {
    const data = this.planetData[planetKey];
    if (!data || !this.infoPanel) return;
    
    this.infoPanel.innerHTML = `
      <button class="close-info" aria-label="Close">×</button>
      <h2>${data.name}</h2>
      <p class="planet-description">${data.description}</p>
      <div class="planet-stats">
        <div class="stat"><span class="stat-label">Diameter:</span> ${data.diameter}</div>
        <div class="stat"><span class="stat-label">Distance from Sun:</span> ${data.distance}</div>
        <div class="stat"><span class="stat-label">Temperature:</span> ${data.temperature}</div>
        <div class="stat"><span class="stat-label">Moons:</span> ${data.moons}</div>
        <div class="stat"><span class="stat-label">Day Length:</span> ${data.day}</div>
        <div class="stat"><span class="stat-label">Year Length:</span> ${data.year}</div>
      </div>
    `;
    
    this.infoPanel.classList.add('active');
    
    // Re-bind close button
    const closeBtn = this.infoPanel.querySelector('.close-info');
    closeBtn.addEventListener('click', () => this.hideInfo());
  }
  
  hideInfo() {
    this.infoPanel?.classList.remove('active');
  }
}

/**
 * Contact Form Handler with Validation
 */
class ContactForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.successMessage = document.getElementById('success-message');
    this.resetBtn = document.getElementById('reset-form-btn');
    this.fields = {
      name: {
        input: document.getElementById('contact-name'),
        error: document.getElementById('name-error'),
        validate: (value) => {
          if (!value.trim()) return 'Name is required';
          if (value.trim().length < 2) return 'Name must be at least 2 characters';
          return null;
        }
      },
      email: {
        input: document.getElementById('contact-email'),
        error: document.getElementById('email-error'),
        validate: (value) => {
          if (!value.trim()) return 'Email is required';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Please enter a valid email address';
          return null;
        }
      },
      message: {
        input: document.getElementById('contact-message'),
        error: document.getElementById('message-error'),
        validate: (value) => {
          if (!value.trim()) return 'Message is required';
          if (value.trim().length < 10) return 'Message must be at least 10 characters';
          return null;
        }
      }
    };
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    // Real-time validation on blur
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      field.input.addEventListener('blur', () => this.validateField(fieldName));
      field.input.addEventListener('input', () => this.clearError(fieldName));
    });
    
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetForm());
    }
    
    // Add spinner to submit button
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      const spinner = document.createElement('div');
      spinner.className = 'btn-spinner';
      spinner.innerHTML = '<div class="spinner"></div>';
      submitBtn.appendChild(spinner);
    }
  }
  
  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.input.value;
    const error = field.validate(value);
    
    if (error) {
      this.showError(fieldName, error);
      return false;
    } else {
      this.showSuccess(fieldName);
      return true;
    }
  }
  
  showError(fieldName, message) {
    const field = this.fields[fieldName];
    field.input.classList.remove('success');
    field.input.classList.add('error');
    field.error.textContent = message;
    field.error.classList.add('visible');
  }
  
  showSuccess(fieldName) {
    const field = this.fields[fieldName];
    field.input.classList.remove('error');
    field.input.classList.add('success');
    field.error.textContent = '';
    field.error.classList.remove('visible');
  }
  
  clearError(fieldName) {
    const field = this.fields[fieldName];
    field.input.classList.remove('error');
    field.error.textContent = '';
    field.error.classList.remove('visible');
  }
  
  clearAllErrors() {
    Object.keys(this.fields).forEach(fieldName => {
      this.clearError(fieldName);
      this.fields[fieldName].input.classList.remove('success');
    });
  }
  
  validateAll() {
    let isValid = true;
    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous states
    this.clearAllErrors();
    
    // Validate all fields
    if (!this.validateAll()) {
      // Focus first invalid field
      const firstInvalid = Object.keys(this.fields).find(fieldName => {
        return this.fields[fieldName].input.classList.contains('error');
      });
      if (firstInvalid) {
        this.fields[firstInvalid].input.focus();
      }
      return;
    }
    
    // Show loading state
    const submitBtn = this.form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    await this.simulateSubmission();
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset button state
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
  
  simulateSubmission() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  showSuccessMessage() {
    // Fade out form
    this.form.classList.add('fading-out');
    
    setTimeout(() => {
      this.form.classList.add('hidden');
      this.form.classList.remove('fading-out');
      
      // Show success message
      this.successMessage.classList.add('visible');
    }, 300);
  }
  
  resetForm() {
    // Reset form fields
    this.form.reset();
    this.clearAllErrors();
    
    // Hide success message
    this.successMessage.classList.remove('visible');
    
    // Show form
    this.form.classList.remove('hidden');
    
    // Focus first field
    this.fields.name.input.focus();
  }
}

/**
 * Smooth Scroll Handler
 */
class SmoothScroll {
  constructor(linkSelector) {
    this.links = document.querySelectorAll(linkSelector);
    this.init();
  }
  
  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
}

/**
 * Scroll Animations
 */
class ScrollAnimations {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });

    this.elements.forEach(el => observer.observe(el));
  }
}

/**
 * Solar System Scroll Animations
 * Handles fade-in animations for solar system elements
 */
class SolarSystemScrollAnimations {
  constructor() {
    this.solarSystem = document.querySelector('.solar-system');
    this.animatedElements = [];
    this.observer = null;

    if (this.solarSystem) {
      this.init();
    }
  }

  init() {
    // Collect all elements to animate
    this.animatedElements = [
      this.solarSystem.querySelector('.section-header'),
      this.solarSystem.querySelector('.sun'),
      ...this.solarSystem.querySelectorAll('.orbit'),
      this.solarSystem.querySelector('.planet-info-panel')
    ].filter(el => el !== null); // Filter out any null elements

    // Create Intersection Observer with 20% threshold
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.2, // Trigger when element is 20% in view
        rootMargin: '0px 0px -50px 0px' // Slightly early trigger for smoother feel
      }
    );

    // Observe each element
    this.animatedElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger animation
        entry.target.classList.add('visible');

        // Unobserve after animation triggers (animate only once)
        this.observer.unobserve(entry.target);
      }
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Easter Eggs
 */
class EasterEggs {
  constructor() {
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.inputSequence = [];
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      this.inputSequence.push(e.key);
      this.inputSequence = this.inputSequence.slice(-10);

      if (this.inputSequence.join(',') === this.konamiCode.join(',')) {
        this.activateRainbowMode();
      }
    });
  }

  activateRainbowMode() {
    document.body.classList.add('rainbow-mode');
    console.log('🌈 Rainbow mode activated!');

    setTimeout(() => {
      document.body.classList.remove('rainbow-mode');
    }, 10000);
  }
}

/**
 * Scroll to Top Button
 */
class ScrollToTop {
  constructor(buttonSelector, options = {}) {
    this.button = document.querySelector(buttonSelector);
    this.options = {
      showAfter: 300,
      smoothBehavior: 'smooth',
      ...options
    };

    if (this.button) {
      this.init();
    }
  }

  init() {
    // Bind scroll event with throttling for performance
    this.throttledScrollHandler = this.throttle(() => this.handleScroll(), 100);
    window.addEventListener('scroll', this.throttledScrollHandler);

    // Bind click event
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > this.options.showAfter) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: this.options.smoothBehavior
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  destroy() {
    window.removeEventListener('scroll', this.throttledScrollHandler);
    this.button.removeEventListener('click', () => this.scrollToTop());
  }
}

/**
 * Main application class
 */
class CosmicVoyage {
  constructor() {
    this.modules = {};
    this.init();
  }

  /**
   * Initialize all application modules
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  /**
   * Bootstrap all modules
   */
  bootstrap() {
    try {
      // Initialize dark mode first (before any visual effects)
      this.modules.darkMode = new DarkMode('#theme-toggle');
      
      // Core visual effects
      this.modules.starfield = new Starfield('#starfield');

      // Navigation
      this.modules.mobileMenu = new MobileMenu('.hamburger', '.nav-menu');

      // Interactive features
      this.modules.planetInteraction = new PlanetInteraction('.planet-body', '#planet-info');
      this.modules.contactForm = new ContactForm('#contact-form');
      this.modules.factsSearch = new FactsSearch();

      // Utilities
      this.modules.smoothScroll = new SmoothScroll('a[href^="#"]');
      
      // Animate elements on scroll
      const animatedElements = document.querySelectorAll('.fact-card, .section-header');
      animatedElements.forEach((el, i) => {
        // Skip section headers inside solar system (handled separately)
        if (!el.closest('.solar-system')) {
          el.classList.add('animate-on-scroll');
          el.style.animationDelay = `${i * 100}ms`;
        }
      });
      this.modules.scrollAnimations = new ScrollAnimations('.animate-on-scroll');

      // Initialize solar system scroll animations
      this.modules.solarSystemScrollAnimations = new SolarSystemScrollAnimations();

      // Fun stuff
      this.modules.easterEggs = new EasterEggs();

      // Scroll to top button
      this.modules.scrollToTop = new ScrollToTop('#scroll-to-top');

      console.log('🚀 Cosmic Voyage initialized! Welcome to space exploration.');
    } catch (error) {
      console.error('❌ Failed to initialize Cosmic Voyage:', error);
    }
  }
}

// Initialize the app
new CosmicVoyage();
