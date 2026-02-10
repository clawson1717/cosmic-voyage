/**
 * NASA API Service Module
 * Fetches and caches data from NASA's public APIs
 * APOD, Mars Rover Photos, and more
 */

class NASAAPIService {
    constructor() {
        // NASA API key - DEMO_KEY has rate limits (30 requests/hour, 50/day)
        // For production, get a free API key from https://api.nasa.gov
        this.apiKey = 'DEMO_KEY';
        this.baseURL = 'https://api.nasa.gov';
        
        // Cache configuration
        this.cache = new Map();
        this.cacheDuration = {
            apod: 1000 * 60 * 60, // 1 hour for APOD (changes daily)
            mars: 1000 * 60 * 30,  // 30 minutes for Mars photos
            epic: 1000 * 60 * 60 * 2 // 2 hours for EPIC
        };
        
        // Initialize from localStorage if available
        this.loadCacheFromStorage();
    }
    
    /**
     * Load cached data from localStorage
     */
    loadCacheFromStorage() {
        try {
            const stored = localStorage.getItem('nasa_api_cache');
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.entries(parsed).forEach(([key, value]) => {
                    this.cache.set(key, value);
                });
            }
        } catch (e) {
            console.warn('Failed to load NASA cache:', e);
        }
    }
    
    /**
     * Save cache to localStorage
     */
    saveCacheToStorage() {
        try {
            const cacheObj = {};
            this.cache.forEach((value, key) => {
                cacheObj[key] = value;
            });
            localStorage.setItem('nasa_api_cache', JSON.stringify(cacheObj));
        } catch (e) {
            console.warn('Failed to save NASA cache:', e);
        }
    }
    
    /**
     * Check if cache entry is still valid
     */
    isCacheValid(key, duration) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        return (Date.now() - cached.timestamp) < duration;
    }
    
    /**
     * Make API request with caching
     */
    async fetchWithCache(endpoint, cacheKey, duration) {
        // Check cache first
        if (this.isCacheValid(cacheKey, duration)) {
            console.log(`🚀 Using cached data for ${cacheKey}`);
            return this.cache.get(cacheKey).data;
        }
        
        try {
            const url = `${this.baseURL}${endpoint}&api_key=${this.apiKey}`;
            console.log(`🌌 Fetching from NASA API: ${endpoint.split('?')[0]}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Store in cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            // Save to localStorage
            this.saveCacheToStorage();
            
            return data;
        } catch (error) {
            console.error('NASA API fetch failed:', error);
            
            // Return cached data even if expired (graceful degradation)
            const cached = this.cache.get(cacheKey);
            if (cached) {
                console.log('Using expired cache as fallback');
                return cached.data;
            }
            
            throw error;
        }
    }
    
    /**
     * Get Astronomy Picture of the Day
     * @param {string} date - Optional date in YYYY-MM-DD format
     * @returns {Promise<Object>} APOD data
     */
    async getAPOD(date = null) {
        let endpoint = '/planetary/apod?';
        if (date) {
            endpoint += `date=${date}&`;
        }
        endpoint += 'thumbs=true';
        
        const cacheKey = date ? `apod_${date}` : 'apod_today';
        return this.fetchWithCache(endpoint, cacheKey, this.cacheDuration.apod);
    }
    
    /**
     * Get multiple APOD entries for a date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Array>} Array of APOD data
     */
    async getAPODRange(startDate, endDate) {
        const endpoint = `/planetary/apod?start_date=${startDate}&end_date=${endDate}&thumbs=true`;
        const cacheKey = `apod_range_${startDate}_${endDate}`;
        return this.fetchWithCache(endpoint, cacheKey, this.cacheDuration.apod);
    }
    
    /**
     * Get Mars Rover photos
     * @param {string} rover - Rover name (curiosity, opportunity, spirit, perseverance)
     * @param {string} sol - Martian sol (day)
     * @param {string} camera - Optional camera identifier
     * @returns {Promise<Object>} Mars photos data
     */
    async getMarsPhotos(rover = 'curiosity', sol = null, camera = null) {
        // If no sol specified, use recent sol (Curiosity is around sol 4000+)
        const targetSol = sol || '4000';
        
        let endpoint = `/mars-photos/api/v1/rovers/${rover}/photos?sol=${targetSol}`;
        if (camera) {
            endpoint += `&camera=${camera}`;
        }
        
        const cacheKey = `mars_${rover}_${targetSol}_${camera || 'all'}`;
        return this.fetchWithCache(endpoint, cacheKey, this.cacheDuration.mars);
    }
    
    /**
     * Get latest Mars Rover photos
     * @param {string} rover - Rover name
     * @returns {Promise<Object>} Latest Mars photos
     */
    async getLatestMarsPhotos(rover = 'curiosity') {
        // Get photos from the last few sols
        const recentSols = ['4000', '3995', '3990', '3985'];
        
        for (const sol of recentSols) {
            try {
                const data = await this.getMarsPhotos(rover, sol);
                if (data.photos && data.photos.length > 0) {
                    return data;
                }
            } catch (e) {
                continue;
            }
        }
        
        throw new Error('No recent Mars photos available');
    }
    
    /**
     * Get EPIC (Earth Polychromatic Imaging Camera) images
     * @returns {Promise<Array>} EPIC data
     */
    async getEPIC() {
        const endpoint = '/EPIC/api/natural/images';
        const cacheKey = 'epic_natural';
        return this.fetchWithCache(endpoint, cacheKey, this.cacheDuration.epic);
    }
    
    /**
     * Get NASA Image of the Day (from NASA Images API)
     * @returns {Promise<Object>} Image data
     */
    async getNASAImageOfTheDay() {
        // This uses a different endpoint structure
        const endpoint = '/planetary/apod?count=5&thumbs=true';
        const cacheKey = 'nasa_random_5';
        return this.fetchWithCache(endpoint, cacheKey, this.cacheDuration.apod);
    }
    
    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
        localStorage.removeItem('nasa_api_cache');
        console.log('🗑️ NASA API cache cleared');
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        const stats = {
            entries: this.cache.size,
            items: []
        };
        
        this.cache.forEach((value, key) => {
            const age = Date.now() - value.timestamp;
            const ageMinutes = Math.round(age / 1000 / 60);
            stats.items.push({
                key,
                ageMinutes,
                isExpired: false
            });
        });
        
        return stats;
    }
}

// Create global instance
const nasaAPI = new NASAAPIService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NASAAPIService;
}
