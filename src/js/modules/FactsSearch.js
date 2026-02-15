/**
 * FactsSearch - Search and filter functionality for Space Facts section
 * Provides real-time filtering, result count, and keyword highlighting
 */

export class FactsSearch {
  constructor() {
    this.searchInput = document.getElementById('facts-search-input');
    this.searchClear = document.getElementById('facts-search-clear');
    this.searchResults = document.getElementById('facts-search-results');
    this.factsGrid = document.getElementById('facts-grid');
    this.noResults = document.getElementById('facts-no-results');
    this.factCards = [];
    
    if (this.searchInput && this.factsGrid) {
      this.init();
    }
  }
  
  init() {
    // Collect all fact cards with their data
    this.collectFactCards();
    
    // Bind events
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    if (this.searchClear) {
      this.searchClear.addEventListener('click', () => this.clearSearch());
    }
    
    // Initialize with empty search (show all)
    this.updateResults('');
    
    console.log('🔭 FactsSearch initialized');
  }
  
  collectFactCards() {
    const cards = this.factsGrid.querySelectorAll('.fact-card');
    this.factCards = Array.from(cards).map((card, index) => {
      const titleEl = card.querySelector('.fact-title');
      const textEl = card.querySelector('.fact-text');
      
      return {
        element: card,
        index: index,
        title: titleEl ? titleEl.textContent.trim() : '',
        text: textEl ? textEl.textContent.trim() : '',
        icon: card.querySelector('.fact-icon') ? card.querySelector('.fact-icon').textContent : ''
      };
    });
  }
  
  handleSearch(e) {
    const query = e.target.value.trim();
    this.updateResults(query);
  }
  
  handleKeydown(e) {
    // Clear on Escape
    if (e.key === 'Escape') {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.searchInput.value = '';
    this.searchInput.focus();
    this.updateResults('');
  }
  
  updateResults(query) {
    const normalizedQuery = query.toLowerCase().trim();
    let visibleCount = 0;
    
    // Show/hide clear button
    if (this.searchClear) {
      this.searchClear.style.opacity = normalizedQuery ? '1' : '0';
      this.searchClear.style.pointerEvents = normalizedQuery ? 'auto' : 'none';
    }
    
    // Filter fact cards
    this.factCards.forEach((fact) => {
      const matches = this.matchesSearch(fact, normalizedQuery);
      
      if (matches) {
        fact.element.style.display = '';
        fact.element.classList.remove('fact-hidden');
        
        // Highlight matching keywords if there's a query
        if (normalizedQuery) {
          this.highlightMatches(fact, normalizedQuery);
        } else {
          this.clearHighlights(fact);
        }
        
        visibleCount++;
      } else {
        fact.element.style.display = 'none';
        fact.element.classList.add('fact-hidden');
      }
    });
    
    // Update results count
    this.updateResultsCount(visibleCount, normalizedQuery);
    
    // Show/hide no results message
    if (this.noResults) {
      if (visibleCount === 0 && normalizedQuery) {
        this.noResults.classList.add('visible');
      } else {
        this.noResults.classList.remove('visible');
      }
    }
  }
  
  matchesSearch(fact, query) {
    if (!query) return true;
    
    const searchText = `${fact.title} ${fact.text} ${fact.icon}`.toLowerCase();
    return searchText.includes(query);
  }
  
  highlightMatches(fact, query) {
    // Restore original content first
    this.clearHighlights(fact);
    
    if (!query) return;
    
    const titleEl = fact.element.querySelector('.fact-title');
    const textEl = fact.element.querySelector('.fact-text');
    
    // Highlight in title
    if (titleEl) {
      titleEl.innerHTML = this.highlightText(titleEl.textContent, query);
    }
    
    // Highlight in text
    if (textEl) {
      textEl.innerHTML = this.highlightText(textEl.textContent, query);
    }
  }
  
  clearHighlights(fact) {
    const titleEl = fact.element.querySelector('.fact-title');
    const textEl = fact.element.querySelector('.fact-text');
    
    if (titleEl) {
      titleEl.textContent = fact.title;
    }
    if (textEl) {
      textEl.textContent = fact.text;
    }
  }
  
  highlightText(text, query) {
    if (!query) return text;
    
    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return text.replace(regex, '<mark class="fact-highlight">$1</mark>');
  }
  
  updateResultsCount(count, query) {
    if (!this.searchResults) return;
    
    if (!query) {
      this.searchResults.textContent = `${this.factCards.length} cosmic facts`;
      this.searchResults.classList.remove('has-results');
    } else {
      const factWord = count === 1 ? 'fact' : 'facts';
      this.searchResults.textContent = `${count} ${factWord} found`;
      this.searchResults.classList.add('has-results');
    }
  }
}
