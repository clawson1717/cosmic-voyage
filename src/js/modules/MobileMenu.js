/**
 * Mobile Menu Module
 * Handles mobile navigation toggle
 */

export class MobileMenu {
  /**
   * @param {string} toggleSelector - CSS selector for the toggle button
   * @param {string} menuSelector - CSS selector for the menu
   * @param {Object} options - Configuration options
   */
  constructor(toggleSelector, menuSelector, options = {}) {
    this.toggle = document.querySelector(toggleSelector);
    this.menu = document.querySelector(menuSelector);

    if (!this.toggle || !this.menu) {
      console.warn('MobileMenu: Toggle or menu element not found');
      return;
    }

    this.config = {
      activeClass: options.activeClass || 'active',
      closeOnClick: options.closeOnClick !== false,
      ...options,
    };

    this.init();
  }

  /**
   * Initialize the mobile menu
   */
  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());

    if (this.config.closeOnClick) {
      const links = this.menu.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }

    // Close on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  /**
   * Toggle the menu open/closed
   */
  toggleMenu() {
    this.toggle.classList.toggle(this.config.activeClass);
    this.menu.classList.toggle(this.config.activeClass);

    // Update ARIA attributes
    const isOpen = this.menu.classList.contains(this.config.activeClass);
    this.toggle.setAttribute('aria-expanded', isOpen);
    this.menu.setAttribute('aria-hidden', !isOpen);
  }

  /**
   * Close the menu
   */
  closeMenu() {
    this.toggle.classList.remove(this.config.activeClass);
    this.menu.classList.remove(this.config.activeClass);
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
  }

  /**
   * Open the menu
   */
  openMenu() {
    this.toggle.classList.add(this.config.activeClass);
    this.menu.classList.add(this.config.activeClass);
    this.toggle.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');
  }
}
