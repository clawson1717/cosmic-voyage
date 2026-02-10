/**
 * Cosmic Voyage - Main Entry Point
 * Initializes all modules
 */

import { Starfield } from './modules/Starfield.js';
import { Navbar } from './modules/Navbar.js';
import { MobileMenu } from './modules/MobileMenu.js';
import { PlanetInteraction } from './modules/PlanetInteraction.js';
import { NewsletterForm } from './modules/NewsletterForm.js';
import { SmoothScroll } from './modules/SmoothScroll.js';
import { ScrollAnimations } from './modules/ScrollAnimations.js';
import { EasterEggs } from './modules/EasterEggs.js';

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
      // Core visual effects
      this.modules.starfield = new Starfield('#starfield');

      // Navigation
      this.modules.navbar = new Navbar('.navbar');
      this.modules.mobileMenu = new MobileMenu('.hamburger', '.navbar-menu');

      // Interactive features
      this.modules.planetInteraction = new PlanetInteraction('.planet-body', '#planet-info');
      this.modules.newsletterForm = new NewsletterForm('#subscribe-form');

      // Utilities
      this.modules.smoothScroll = new SmoothScroll('a[href^="#"]');
      this.modules.scrollAnimations = new ScrollAnimations('.animate-on-scroll');

      // Fun stuff
      this.modules.easterEggs = new EasterEggs();

      console.log('🚀 Cosmic Voyage initialized! Welcome to space exploration.');
    } catch (error) {
      console.error('❌ Failed to initialize Cosmic Voyage:', error);
    }
  }
}

// Initialize the app
new CosmicVoyage();
