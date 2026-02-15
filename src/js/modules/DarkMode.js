/**
 * Dark Mode Toggle Module
 * Handles theme switching with localStorage persistence
 */

export class DarkMode {
  constructor(toggleSelector = '#theme-toggle') {
    this.toggle = document.querySelector(toggleSelector);
    this.html = document.documentElement;
    this.STORAGE_KEY = 'cosmic-voyage-theme';
    
    // Check for saved theme preference or default to dark
    this.currentTheme = this.getStoredTheme() || 'dark';
    
    this.init();
  }
  
  init() {
    // Apply the initial theme
    this.applyTheme(this.currentTheme);
    
    // Bind toggle button click
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
    
    console.log(`🌙 Dark mode initialized: ${this.currentTheme} theme active`);
  }
  
  /**
   * Get stored theme from localStorage
   */
  getStoredTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('localStorage not available');
      return null;
    }
  }
  
  /**
   * Save theme to localStorage
   */
  setStoredTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }
  }
  
  /**
   * Apply the specified theme
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    
    if (theme === 'light') {
      this.html.setAttribute('data-theme', 'light');
    } else {
      this.html.removeAttribute('data-theme');
    }
    
    // Update button aria-label for accessibility
    if (this.toggle) {
      const label = theme === 'light' 
        ? 'Switch to dark mode' 
        : 'Switch to light mode';
      this.toggle.setAttribute('aria-label', label);
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.setStoredTheme(newTheme);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: newTheme } 
    }));
  }
  
  /**
   * Set up listener for system theme preference changes
   */
  setupSystemThemeListener() {
    // Only listen if no stored preference
    if (!this.getStoredTheme()) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      
      const handleChange = (e) => {
        const theme = e.matches ? 'light' : 'dark';
        this.applyTheme(theme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
    }
  }
  
  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }
  
  /**
   * Check if dark mode is active
   */
  isDark() {
    return this.currentTheme === 'dark';
  }
}
