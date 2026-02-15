/**
 * Cosmic Voyage - Space Quote Generator
 * Displays inspirational space quotes with animations
 */

import { spaceQuotes } from '../data/spaceQuotes.js';

/**
 * QuoteGenerator - Manages the space quote widget
 */
export class QuoteGenerator {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      autoRotate: true,
      rotateInterval: 20000, // 20 seconds
      animateOnLoad: true,
      ...options
    };
    
    this.currentIndex = 0;
    this.isAnimating = false;
    this.rotationTimer = null;
    
    if (this.container) {
      this.init();
    }
  }
  
  init() {
    // Create the quote generator structure
    this.createStructure();
    
    // Bind event listeners
    this.bindEvents();
    
    // Show initial quote
    this.showRandomQuote();
    
    // Start auto-rotation if enabled
    if (this.options.autoRotate) {
      this.startAutoRotation();
    }
    
    console.log('🌟 Quote Generator initialized');
  }
  
  createStructure() {
    this.container.innerHTML = `
      <div class="quote-generator">
        <div class="quote-stars" aria-hidden="true">
          <div class="quote-star quote-star-1"></div>
          <div class="quote-star quote-star-2"></div>
          <div class="quote-star quote-star-3"></div>
          <div class="quote-star quote-star-4"></div>
          <div class="quote-star quote-star-5"></div>
        </div>
        <div class="quote-content">
          <span class="quote-mark quote-mark-open">"</span>
          <p class="quote-text" id="quote-text"></p>
          <span class="quote-mark quote-mark-close">"</span>
        </div>
        <div class="quote-attribution">
          <span class="quote-author" id="quote-author"></span>
          <span class="quote-source" id="quote-source"></span>
        </div>
        <div class="quote-controls">
          <button class="quote-btn quote-btn-new" id="quote-btn-new" aria-label="Get new quote">
            <span class="quote-btn-icon">🌟</span>
            <span class="quote-btn-text">New Quote</span>
          </button>
          <button class="quote-btn quote-btn-copy" id="quote-btn-copy" aria-label="Copy quote to clipboard">
            <span class="quote-btn-icon">📋</span>
            <span class="quote-btn-text">Copy</span>
          </button>
          <button class="quote-btn quote-btn-tweet" id="quote-btn-tweet" aria-label="Share on Twitter">
            <span class="quote-btn-icon">🐦</span>
            <span class="quote-btn-text">Tweet</span>
          </button>
        </div>
        <div class="quote-progress" id="quote-progress" aria-hidden="true">
          <div class="quote-progress-bar"></div>
        </div>
      </div>
    `;
    
    // Cache DOM references
    this.quoteText = this.container.querySelector('#quote-text');
    this.quoteAuthor = this.container.querySelector('#quote-author');
    this.quoteSource = this.container.querySelector('#quote-source');
    this.newBtn = this.container.querySelector('#quote-btn-new');
    this.copyBtn = this.container.querySelector('#quote-btn-copy');
    this.tweetBtn = this.container.querySelector('#quote-btn-tweet');
    this.progressBar = this.container.querySelector('#quote-progress');
    this.progressBarInner = this.progressBar.querySelector('.quote-progress-bar');
  }
  
  bindEvents() {
    // New quote button
    this.newBtn.addEventListener('click', () => {
      this.showRandomQuote();
      this.resetAutoRotation();
    });
    
    // Copy button
    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    
    // Tweet button
    this.tweetBtn.addEventListener('click', () => this.shareOnTwitter());
    
    // Pause auto-rotation on hover
    this.container.addEventListener('mouseenter', () => this.pauseAutoRotation());
    this.container.addEventListener('mouseleave', () => this.resumeAutoRotation());
  }
  
  showRandomQuote() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Get random quote (different from current)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * spaceQuotes.length);
    } while (newIndex === this.currentIndex && spaceQuotes.length > 1);
    
    this.currentIndex = newIndex;
    const quote = spaceQuotes[this.currentIndex];
    
    // Fade out current content
    this.container.classList.add('quote-fading-out');
    
    setTimeout(() => {
      // Update content
      this.quoteText.textContent = quote.quote;
      this.quoteAuthor.textContent = quote.author;
      this.quoteSource.textContent = quote.source || '';
      
      // Fade in new content
      this.container.classList.remove('quote-fading-out');
      this.container.classList.add('quote-fading-in');
      
      setTimeout(() => {
        this.container.classList.remove('quote-fading-in');
        this.isAnimating = false;
      }, 500);
    }, 300);
  }
  
  async copyToClipboard() {
    const quote = spaceQuotes[this.currentIndex];
    const text = `"${quote.quote}" — ${quote.author}`;
    
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Quote copied to clipboard! 📋');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showToast('Quote copied to clipboard! 📋');
    }
  }
  
  shareOnTwitter() {
    const quote = spaceQuotes[this.currentIndex];
    const text = encodeURIComponent(`"${quote.quote}" — ${quote.author}`);
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'quote-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    
    this.container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('quote-toast-visible');
    });
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.add('quote-toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  startAutoRotation() {
    if (!this.options.autoRotate) return;
    
    this.rotationTimer = setInterval(() => {
      this.showRandomQuote();
    }, this.options.rotateInterval);
    
    // Start progress bar animation
    this.animateProgressBar();
  }
  
  stopAutoRotation() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
    this.progressBarInner.style.animation = 'none';
  }
  
  pauseAutoRotation() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
    this.progressBarInner.style.animationPlayState = 'paused';
  }
  
  resumeAutoRotation() {
    if (this.options.autoRotate && !this.rotationTimer) {
      this.rotationTimer = setInterval(() => {
        this.showRandomQuote();
      }, this.options.rotateInterval);
    }
    this.progressBarInner.style.animationPlayState = 'running';
  }
  
  resetAutoRotation() {
    this.stopAutoRotation();
    this.startAutoRotation();
  }
  
  animateProgressBar() {
    this.progressBarInner.style.animation = 'none';
    // Force reflow
    this.progressBarInner.offsetHeight;
    this.progressBarInner.style.animation = `quoteProgress ${this.options.rotateInterval}ms linear infinite`;
  }
  
  destroy() {
    this.stopAutoRotation();
    this.container.innerHTML = '';
  }
}

export default QuoteGenerator;
