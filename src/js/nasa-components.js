/**
 * NASA Data Display Components
 * Beautiful components for showing NASA API data
 */

/**
 * APOD (Astronomy Picture of the Day) Component
 */
class APODComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showExplanation: true,
            showDate: true,
            showCopyright: true,
            maxExplanationLength: 300,
            ...options
        };
        this.nasaAPI = nasaAPI; // Uses global instance from nasa-api.js
    }
    
    async render(date = null) {
        if (!this.container) {
            console.error('APOD container not found:', this.container);
            return;
        }
        
        // Show loading state
        this.container.innerHTML = this.getLoadingHTML();
        
        try {
            const data = await this.nasaAPI.getAPOD(date);
            this.container.innerHTML = this.getAPODHTML(data);
            this.attachEventListeners();
        } catch (error) {
            this.container.innerHTML = this.getErrorHTML(error);
        }
    }
    
    getLoadingHTML() {
        return `
            <div class="nasa-loading">
                <div class="nasa-spinner"></div>
                <p>Loading cosmic imagery from NASA...</p>
            </div>
        `;
    }
    
    getErrorHTML(error) {
        return `
            <div class="nasa-error">
                <div class="nasa-error-icon">🛰️</div>
                <h3>Signal Lost</h3>
                <p>Unable to retrieve data from NASA. ${error.message}</p>
                <button class="btn btn-secondary" onclick="this.closest('.nasa-component').querySelector('.apod-component').reload()">
                    Retry Connection
                </button>
            </div>
        `;
    }
    
    getAPODHTML(data) {
        const isVideo = data.media_type === 'video';
        const mediaContent = isVideo 
            ? `<div class="apod-video-container">
                <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
               </div>`
            : `<div class="apod-image-container">
                <img src="${data.url}" alt="${data.title}" loading="lazy">
                <div class="apod-image-overlay">
                    <button class="apod-fullscreen-btn" title="View Full Size">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </button>
                </div>
               </div>`;
        
        const explanation = this.options.showExplanation 
            ? this.truncateText(data.explanation, this.options.maxExplanationLength)
            : '';
        
        const copyright = this.options.showCopyright && data.copyright 
            ? `<span class="apod-copyright">© ${data.copyright}</span>` 
            : '';
        
        const date = this.options.showDate 
            ? `<span class="apod-date">${this.formatDate(data.date)}</span>` 
            : '';
        
        return `
            <div class="apod-card nasa-card">
                <div class="apod-header">
                    <div class="apod-badge">
                        <span class="badge-icon">🌌</span>
                        <span class="badge-text">Astronomy Picture of the Day</span>
                    </div>
                    ${date}
                </div>
                
                ${mediaContent}
                
                <div class="apod-content">
                    <h3 class="apod-title">${data.title}</h3>
                    ${explanation ? `<p class="apod-explanation">${explanation}</p>` : ''}
                    <div class="apod-meta">
                        ${copyright}
                        ${data.hdurl && !isVideo ? `<a href="${data.hdurl}" target="_blank" class="apod-hd-link">View HD Version →</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    attachEventListeners() {
        const imgContainer = this.container.querySelector('.apod-image-container');
        if (imgContainer) {
            imgContainer.addEventListener('click', (e) => {
                if (e.target.closest('.apod-fullscreen-btn')) {
                    this.openFullscreen();
                } else {
                    this.openFullscreen();
                }
            });
        }
    }
    
    openFullscreen() {
        const img = this.container.querySelector('img');
        if (img) {
            const modal = document.createElement('div');
            modal.className = 'nasa-modal';
            modal.innerHTML = `
                <div class="nasa-modal-backdrop"></div>
                <div class="nasa-modal-content">
                    <button class="nasa-modal-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            modal.querySelector('.nasa-modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.nasa-modal-backdrop').addEventListener('click', () => {
                modal.remove();
            });
            
            document.body.appendChild(modal);
        }
    }
    
    async reload() {
        this.render();
    }
}

/**
 * Mars Rover Photos Component
 */
class MarsRoverComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            rover: 'curiosity',
            maxPhotos: 6,
            showCameraInfo: true,
            showSolInfo: true,
            ...options
        };
        this.nasaAPI = nasaAPI;
    }
    
    async render() {
        if (!this.container) return;
        
        this.container.innerHTML = this.getLoadingHTML();
        
        try {
            const data = await this.nasaAPI.getLatestMarsPhotos(this.options.rover);
            this.container.innerHTML = this.getMarsHTML(data);
            this.attachEventListeners();
        } catch (error) {
            this.container.innerHTML = this.getErrorHTML(error);
        }
    }
    
    getLoadingHTML() {
        return `
            <div class="nasa-loading">
                <div class="nasa-spinner mars-spinner"></div>
                <p>Connecting to Mars Rover...</p>
                <p class="loading-subtext">Signal travel time: ~5-20 minutes</p>
            </div>
        `;
    }
    
    getErrorHTML(error) {
        return `
            <div class="nasa-error">
                <div class="nasa-error-icon">🔴</div>
                <h3>Connection to Mars Lost</h3>
                <p>The Mars Rover is currently out of range or in sleep mode. ${error.message}</p>
            </div>
        `;
    }
    
    getMarsHTML(data) {
        if (!data.photos || data.photos.length === 0) {
            return `
                <div class="nasa-empty">
                    <div class="nasa-empty-icon">📡</div>
                    <h3>No Recent Photos</h3>
                    <p>The rover hasn't transmitted photos from this time period.</p>
                </div>
            `;
        }
        
        const photos = data.photos.slice(0, this.options.maxPhotos);
        const roverName = photos[0].rover.name;
        const sol = photos[0].sol;
        const earthDate = photos[0].earth_date;
        
        const photosGrid = photos.map((photo, index) => `
            <div class="mars-photo-card" data-index="${index}">
                <div class="mars-photo-image">
                    <img src="${photo.img_src}" alt="Mars surface - ${photo.camera.full_name}" loading="lazy">
                    <div class="mars-photo-overlay">
                        <button class="mars-expand-btn" title="View Full Size">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mars-photo-info">
                    ${this.options.showCameraInfo ? `<span class="mars-camera">${photo.camera.name}</span>` : ''}
                </div>
            </div>
        `).join('');
        
        return `
            <div class="mars-rover-container nasa-card">
                <div class="mars-header">
                    <div class="mars-badge">
                        <span class="badge-icon">🔴</span>
                        <span class="badge-text">Mars Rover Photos</span>
                    </div>
                    <div class="mars-rover-info">
                        <span class="rover-name">${roverName}</span>
                        ${this.options.showSolInfo ? `<span class="sol-badge">Sol ${sol}</span>` : ''}
                    </div>
                </div>
                
                <div class="mars-photos-grid">
                    ${photosGrid}
                </div>
                
                <div class="mars-footer">
                    <p class="mars-status">
                        <span class="status-indicator online"></span>
                        Rover Status: Active
                    </p>
                    <p class="mars-date">Earth Date: ${this.formatDate(earthDate)}</p>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const cards = this.container.querySelectorAll('.mars-photo-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                this.openFullscreen(img.src, img.alt);
            });
        });
    }
    
    openFullscreen(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'nasa-modal';
        modal.innerHTML = `
            <div class="nasa-modal-backdrop"></div>
            <div class="nasa-modal-content mars-modal">
                <button class="nasa-modal-close">&times;</button>
                <img src="${src}" alt="${alt}">
                <p class="mars-modal-caption">${alt}</p>
            </div>
        `;
        
        modal.querySelector('.nasa-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.nasa-modal-backdrop').addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

/**
 * NASA Gallery Component - Shows a grid of recent APOD images
 */
class NASAGalleryComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            count: 8,
            ...options
        };
        this.nasaAPI = nasaAPI;
    }
    
    async render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="nasa-loading">
                <div class="nasa-spinner"></div>
                <p>Loading gallery...</p>
            </div>
        `;
        
        try {
            // Get last 'count' days of APOD
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - this.options.count);
            
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            
            const data = await this.nasaAPI.getAPODRange(startStr, endStr);
            
            // Filter out videos for the gallery
            const images = data.filter(item => item.media_type === 'image').reverse();
            
            this.container.innerHTML = this.getGalleryHTML(images);
            this.attachEventListeners();
        } catch (error) {
            this.container.innerHTML = this.getErrorHTML(error);
        }
    }
    
    getGalleryHTML(images) {
        if (images.length === 0) {
            return `<div class="nasa-empty"><p>No images available</p></div>`;
        }
        
        const items = images.map(item => `
            <div class="gallery-item" data-date="${item.date}">
                <div class="gallery-image">
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <h4 class="gallery-title">${item.title}</h4>
                        <span class="gallery-date">${item.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="nasa-gallery">
                <div class="gallery-grid">
                    ${items}
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const items = this.container.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.addEventListener('click', async () => {
                const date = item.dataset.date;
                // Show APOD for this date
                const modal = document.createElement('div');
                modal.className = 'nasa-modal';
                modal.innerHTML = `
                    <div class="nasa-modal-backdrop"></div>
                    <div class="nasa-modal-content">
                        <button class="nasa-modal-close">&times;</button>
                        <div class="modal-apod-loading">Loading...</div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                modal.querySelector('.nasa-modal-close').addEventListener('click', () => {
                    modal.remove();
                });
                
                modal.querySelector('.nasa-modal-backdrop').addEventListener('click', () => {
                    modal.remove();
                });
                
                // Load APOD data
                try {
                    const data = await this.nasaAPI.getAPOD(date);
                    modal.querySelector('.nasa-modal-content').innerHTML = `
                        <button class="nasa-modal-close">&times;</button>
                        <h3>${data.title}</h3>
                        <img src="${data.url}" alt="${data.title}">
                        <p>${data.explanation}</p>
                        <p class="modal-date">${data.date}</p>
                    `;
                    
                    modal.querySelector('.nasa-modal-close').addEventListener('click', () => {
                        modal.remove();
                    });
                } catch (e) {
                    modal.querySelector('.modal-apod-loading').textContent = 'Failed to load';
                }
            });
        });
    }
    
    getErrorHTML(error) {
        return `
            <div class="nasa-error">
                <p>Failed to load gallery: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * NASA Live Feed Component - Shows current space events/stats
 */
class NASALiveFeed {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stats = {
            astronautsInSpace: 0,
            issSpeed: 27600, // km/h
            issAltitude: 408, // km
            lastUpdated: null
        };
    }
    
    async render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="nasa-live-feed">
                <div class="live-header">
                    <span class="live-indicator">
                        <span class="live-dot"></span>
                        LIVE
                    </span>
                    <span class="live-title">Space Activity</span>
                </div>
                <div class="live-stats">
                    <div class="live-stat">
                        <span class="stat-icon">👨‍🚀</span>
                        <span class="stat-value" id="astro-count">--</span>
                        <span class="stat-label">Humans in Space</span>
                    </div>
                    <div class="live-stat">
                        <span class="stat-icon">🛰️</span>
                        <span class="stat-value">27,600</span>
                        <span class="stat-label">ISS Speed (km/h)</span>
                    </div>
                    <div class="live-stat">
                        <span class="stat-icon">🌍</span>
                        <span class="stat-value">408</span>
                        <span class="stat-label">ISS Altitude (km)</span>
                    </div>
                </div>
            </div>
        `;
        
        // Try to fetch real astronaut count
        this.fetchAstronautCount();
    }
    
    async fetchAstronautCount() {
        try {
            // Using Open Notify API (free, no key required)
            const response = await fetch('http://api.open-notify.org/astros.json');
            if (response.ok) {
                const data = await response.json();
                const count = data.number;
                const astroEl = this.container.querySelector('#astro-count');
                if (astroEl) {
                    astroEl.textContent = count;
                }
            }
        } catch (e) {
            console.log('Could not fetch astronaut count');
            // Use fallback value
            const astroEl = this.container.querySelector('#astro-count');
            if (astroEl) {
                astroEl.textContent = '7';
            }
        }
    }
}

// Export components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APODComponent, MarsRoverComponent, NASAGalleryComponent, NASALiveFeed };
}
