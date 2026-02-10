/**
 * Navbar Scroll Effect Module
 * Adds scroll-based styling to the navbar
 */

export class Navbar {
  /**
   * @param {string} selector - CSS selector for the navbar
   * @param {Object} options - Configuration options
   */
  constructor(selector, options = {}) {
    this.navbar = document.querySelector(selector);
    if (!this.navbar) {
      console.warn(`Navbar: Element '${selector}' not found`);
      return;
    }

    this.config = {
      scrollThreshold: options.scrollThreshold || 100,
      scrolledClass: options.scrolledClass || 'scrolled',
      ...options,
    };

    this.lastScroll = 0;
    this.init();
  }

  /**
   * Initialize the navbar effect
   */
  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    // Initial check
    this.handleScroll();
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > this.config.scrollThreshold) {
      this.navbar.classList.add(this.config.scrolledClass);
    } else {
      this.navbar.classList.remove(this.config.scrolledClass);
    }

    this.lastScroll = currentScroll;
  }
}
