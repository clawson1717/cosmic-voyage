/**
 * KeyboardShortcuts - Power-user keyboard navigation for Cosmic Voyage
 * Inspired by GitHub's keyboard shortcuts
 * 
 * Features:
 * - Press '?' to show help modal
 * - Press 'G' then section letter to jump to section (GH=home, GS=solar, etc.)
 * - Press '/' to focus search input
 * - Press 'T' to toggle dark/light theme
 * - Press 'Esc' to close modals/help
 */

export class KeyboardShortcuts {
  constructor() {
    this.modal = null;
    this.isGKeyActive = false;
    this.gKeyTimeout = null;
    this.isModalOpen = false;
    
    // Section navigation map (G-key sequences)
    this.sectionMap = {
      'h': '#hero',           // GH = Home/Hero
      's': '#solar-system',   // GS = Solar System
      'm': '#mission-control',// GM = Mission Control
      'a': '#apod',          // GA = APOD
      'r': '#mars',          // GR = Mars Rover
      'g': '#gallery',       // GG = Gallery
      'f': '#facts',         // GF = Facts
      'c': '#contact',       // GC = Contact
      '3': 'solar-system-3d.html' // G3 = 3D Explorer
    };
    
    // Shortcut definitions for the help modal
    this.shortcuts = [
      { key: '?', description: 'Show/hide this help modal' },
      { key: 'Esc', description: 'Close modals and help' },
      { key: 'G H', description: 'Go to Home section' },
      { key: 'G S', description: 'Go to Solar System' },
      { key: 'G M', description: 'Go to Mission Control' },
      { key: 'G A', description: 'Go to NASA APOD' },
      { key: 'G R', description: 'Go to Mars Rover' },
      { key: 'G G', description: 'Go to Gallery' },
      { key: 'G F', description: 'Go to Space Facts' },
      { key: 'G C', description: 'Go to Contact' },
      { key: 'G 3', description: 'Open 3D Explorer' },
      { key: '/', description: 'Focus Space Facts search' },
      { key: 'T', description: 'Toggle dark/light theme' }
    ];
    
    this.init();
  }
  
  init() {
    this.createModal();
    this.bindEvents();
    console.log('⌨️ Keyboard shortcuts initialized - Press ? for help');
  }
  
  /**
   * Create the keyboard shortcuts help modal
   */
  createModal() {
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.className = 'keyboard-shortcuts-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-label', 'Keyboard shortcuts');
    this.modal.setAttribute('aria-modal', 'true');
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'keyboard-shortcuts-content';
    
    // Header
    const header = document.createElement('div');
    header.className = 'keyboard-shortcuts-header';
    header.innerHTML = `
      <h2 class="keyboard-shortcuts-title">⌨️ Keyboard Shortcuts</h2>
      <button class="keyboard-shortcuts-close" aria-label="Close keyboard shortcuts">×</button>
    `;
    
    // Shortcuts list
    const shortcutsList = document.createElement('div');
    shortcutsList.className = 'keyboard-shortcuts-list';
    
    // Group shortcuts by category
    const categories = [
      {
        title: 'Navigation',
        items: this.shortcuts.filter(s => s.key.startsWith('G ') || s.key === 'Esc')
      },
      {
        title: 'Actions',
        items: this.shortcuts.filter(s => ['?', '/', 'T'].includes(s.key))
      }
    ];
    
    categories.forEach(category => {
      const categorySection = document.createElement('div');
      categorySection.className = 'keyboard-shortcuts-category';
      
      const categoryTitle = document.createElement('h3');
      categoryTitle.className = 'keyboard-shortcuts-category-title';
      categoryTitle.textContent = category.title;
      categorySection.appendChild(categoryTitle);
      
      const categoryList = document.createElement('ul');
      categoryList.className = 'keyboard-shortcuts-items';
      
      category.items.forEach(shortcut => {
        const item = document.createElement('li');
        item.className = 'keyboard-shortcuts-item';
        
        // Format key display
        const keyDisplay = shortcut.key.split(' ').map(k => 
          `<kbd class="keyboard-key">${k}</kbd>`
        ).join(' <span class="keyboard-key-separator">then</span> ');
        
        item.innerHTML = `
          <div class="keyboard-shortcuts-keys">${keyDisplay}</div>
          <div class="keyboard-shortcuts-desc">${shortcut.description}</div>
        `;
        
        categoryList.appendChild(item);
      });
      
      categorySection.appendChild(categoryList);
      shortcutsList.appendChild(categorySection);
    });
    
    // Footer with tip
    const footer = document.createElement('div');
    footer.className = 'keyboard-shortcuts-footer';
    footer.innerHTML = `
      <p class="keyboard-shortcuts-tip">
        <span class="tip-icon">💡</span>
        <span>Press <kbd class="keyboard-key">?</kbd> anytime to toggle this help</span>
      </p>
    `;
    
    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(shortcutsList);
    modalContent.appendChild(footer);
    this.modal.appendChild(modalContent);
    
    // Add to document
    document.body.appendChild(this.modal);
    
    // Bind close button
    const closeBtn = this.modal.querySelector('.keyboard-shortcuts-close');
    closeBtn.addEventListener('click', () => this.closeModal());
    
    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }
  
  /**
   * Bind keyboard events
   */
  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  
  /**
   * Handle keydown events
   */
  handleKeydown(e) {
    const target = e.target;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;
    
    // Handle Escape key globally (closes modals)
    if (e.key === 'Escape') {
      if (this.isModalOpen) {
        e.preventDefault();
        this.closeModal();
        return;
      }
      // Also close other modals like planet info
      const planetInfo = document.getElementById('planet-info');
      if (planetInfo && planetInfo.classList.contains('active')) {
        planetInfo.classList.remove('active');
        return;
      }
    }
    
    // Don't intercept shortcuts when typing in inputs (except Escape and /)
    if (isInput && e.key !== '/') {
      // Reset G-key state when typing
      this.resetGKeyState();
      return;
    }
    
    // Handle '?' to toggle help
    if (e.key === '?' && !isInput) {
      e.preventDefault();
      this.toggleModal();
      return;
    }
    
    // Handle 'G' key for navigation sequences
    if (e.key === 'g' || e.key === 'G') {
      if (!isInput) {
        e.preventDefault();
        this.activateGKey();
      }
      return;
    }
    
    // Handle section navigation when G is active
    if (this.isGKeyActive) {
      const key = e.key.toLowerCase();
      if (this.sectionMap[key]) {
        e.preventDefault();
        this.navigateToSection(this.sectionMap[key]);
        this.resetGKeyState();
        return;
      }
      // Any other key cancels the G-key state
      this.resetGKeyState();
    }
    
    // Handle '/' to focus search
    if (e.key === '/') {
      e.preventDefault();
      this.focusSearch();
      return;
    }
    
    // Handle 'T' to toggle theme
    if ((e.key === 't' || e.key === 'T') && !isInput && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      this.toggleTheme();
      return;
    }
  }
  
  /**
   * Activate G-key navigation mode
   */
  activateGKey() {
    this.isGKeyActive = true;
    
    // Show visual feedback (optional - could add a toast/indicator)
    document.body.classList.add('g-key-active');
    
    // Clear any existing timeout
    if (this.gKeyTimeout) {
      clearTimeout(this.gKeyTimeout);
    }
    
    // Reset after 2 seconds of inactivity
    this.gKeyTimeout = setTimeout(() => {
      this.resetGKeyState();
    }, 2000);
  }
  
  /**
   * Reset G-key navigation state
   */
  resetGKeyState() {
    this.isGKeyActive = false;
    document.body.classList.remove('g-key-active');
    if (this.gKeyTimeout) {
      clearTimeout(this.gKeyTimeout);
      this.gKeyTimeout = null;
    }
  }
  
  /**
   * Navigate to a section
   */
  navigateToSection(target) {
    if (target.endsWith('.html')) {
      // External page navigation
      window.location.href = target;
    } else {
      // Section scroll
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update URL hash without jumping
        history.pushState(null, null, target);
      }
    }
  }
  
  /**
   * Focus the facts search input
   */
  focusSearch() {
    const searchInput = document.getElementById('facts-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
      
      // Scroll to facts section if not visible
      const factsSection = document.getElementById('facts');
      if (factsSection) {
        const rect = factsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          factsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }
  
  /**
   * Toggle dark/light theme
   */
  toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.click();
    }
  }
  
  /**
   * Toggle the help modal
   */
  toggleModal() {
    if (this.isModalOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }
  
  /**
   * Open the help modal
   */
  openModal() {
    if (!this.modal) return;
    
    this.isModalOpen = true;
    this.modal.classList.add('open');
    document.body.classList.add('modal-open');
    
    // Focus the close button for accessibility
    const closeBtn = this.modal.querySelector('.keyboard-shortcuts-close');
    if (closeBtn) {
      closeBtn.focus();
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('keyboardshortcuts:open'));
  }
  
  /**
   * Close the help modal
   */
  closeModal() {
    if (!this.modal) return;
    
    this.isModalOpen = false;
    this.modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('keyboardshortcuts:close'));
  }
  
  /**
   * Destroy the keyboard shortcuts handler
   */
  destroy() {
    this.resetGKeyState();
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }
}
