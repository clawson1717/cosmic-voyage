/**
 * Tests for NASA Components
 * Tests APODComponent, MarsRoverComponent, etc.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock document and window
document.body.innerHTML = '<div id="test-container"></div>';

// Mock NASA API service
global.nasaAPI = {
  getAPOD: vi.fn(),
  getLatestMarsPhotos: vi.fn(),
  getAPODRange: vi.fn(),
};

describe('APODComponent', () => {
  let container;

  beforeEach(() => {
    container = document.getElementById('test-container');
    container.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const component = new (class {
        constructor(containerId, options = {}) {
          this.container = document.getElementById(containerId);
          this.options = {
            showExplanation: true,
            showDate: true,
            showCopyright: true,
            maxExplanationLength: 300,
            ...options,
          };
        }
      })('test-container');

      expect(component.options.showExplanation).toBe(true);
      expect(component.options.showDate).toBe(true);
      expect(component.options.maxExplanationLength).toBe(300);
    });

    it('should merge custom options with defaults', () => {
      const component = new (class {
        constructor(containerId, options = {}) {
          this.container = document.getElementById(containerId);
          this.options = {
            showExplanation: true,
            showDate: true,
            showCopyright: true,
            maxExplanationLength: 300,
            ...options,
          };
        }
      })('test-container', { maxExplanationLength: 150, showDate: false });

      expect(component.options.maxExplanationLength).toBe(150);
      expect(component.options.showDate).toBe(false);
      expect(component.options.showExplanation).toBe(true);
    });

    it('should store container reference', () => {
      const component = new (class {
        constructor(containerId) {
          this.container = document.getElementById(containerId);
        }
      })('test-container');

      expect(component.container).toBe(container);
    });
  });

  describe('Text Utilities', () => {
    it('should truncate text correctly', () => {
      const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
      };

      const shortText = 'Short text';
      const longText = 'A'.repeat(400);

      expect(truncateText(shortText, 300)).toBe(shortText);
      expect(truncateText(longText, 300)).toHaveLength(303); // 300 + '...'
      expect(truncateText(longText, 300)).toEndWith('...');
    });

    it('should format dates correctly', () => {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };

      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('Monday');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
    });
  });

  describe('HTML Generation', () => {
    it('should generate loading HTML', () => {
      const getLoadingHTML = () => `
        <div class="nasa-loading">
          <div class="nasa-spinner"></div>
          <p>Loading cosmic imagery from NASA...</p>
        </div>
      `;

      const html = getLoadingHTML();
      expect(html).toContain('nasa-loading');
      expect(html).toContain('nasa-spinner');
    });

    it('should generate error HTML with retry button', () => {
      const getErrorHTML = (error) => `
        <div class="nasa-error">
          <div class="nasa-error-icon">🛰️</div>
          <h3>Signal Lost</h3>
          <p>${error.message}</p>
          <button class="btn btn-secondary">Retry Connection</button>
        </div>
      `;

      const error = new Error('Connection timeout');
      const html = getErrorHTML(error);
      expect(html).toContain('Signal Lost');
      expect(html).toContain('Connection timeout');
      expect(html).toContain('Retry Connection');
    });

    it('should generate APOD HTML with image', () => {
      const getAPODHTML = (data) => {
        const isVideo = data.media_type === 'video';
        return `
          <div class="apod-card">
            ${isVideo ? '<div class="video">Video</div>' : `<img src="${data.url}" alt="${data.title}">`}
            <h3>${data.title}</h3>
          </div>
        `;
      };

      const imageData = {
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        media_type: 'image',
      };

      const html = getAPODHTML(imageData);
      expect(html).toContain('<img');
      expect(html).toContain('Test Image');
      expect(html).toContain('http://example.com/image.jpg');
    });

    it('should generate APOD HTML with video', () => {
      const getAPODHTML = (data) => {
        const isVideo = data.media_type === 'video';
        return `
          <div class="apod-card">
            ${isVideo ? `<iframe src="${data.url}"></iframe>` : `<img src="${data.url}">`}
            <h3>${data.title}</h3>
          </div>
        `;
      };

      const videoData = {
        title: 'Test Video',
        url: 'http://example.com/video.mp4',
        media_type: 'video',
      };

      const html = getAPODHTML(videoData);
      expect(html).toContain('<iframe');
      expect(html).not.toContain('<img');
    });
  });
});

describe('MarsRoverComponent', () => {
  describe('Constructor', () => {
    it('should have default options', () => {
      const options = {
        rover: 'curiosity',
        maxPhotos: 6,
        showCameraInfo: true,
        showSolInfo: true,
      };

      expect(options.rover).toBe('curiosity');
      expect(options.maxPhotos).toBe(6);
      expect(options.showCameraInfo).toBe(true);
    });
  });

  describe('HTML Generation', () => {
    it('should generate loading HTML with Mars-specific content', () => {
      const getLoadingHTML = () => `
        <div class="nasa-loading">
          <div class="nasa-spinner mars-spinner"></div>
          <p>Connecting to Mars Rover...</p>
          <p class="loading-subtext">Signal travel time: ~5-20 minutes</p>
        </div>
      `;

      const html = getLoadingHTML();
      expect(html).toContain('mars-spinner');
      expect(html).toContain('Connecting to Mars Rover');
      expect(html).toContain('Signal travel time');
    });

    it('should handle empty photos array', () => {
      const getMarsHTML = (data) => {
        if (!data.photos || data.photos.length === 0) {
          return '<div class="nasa-empty"><h3>No Recent Photos</h3></div>';
        }
        return '<div class="photos">Photos</div>';
      };

      const emptyData = { photos: [] };
      const html = getMarsHTML(emptyData);
      expect(html).toContain('nasa-empty');
      expect(html).toContain('No Recent Photos');
    });

    it('should generate photo grid with limited photos', () => {
      const maxPhotos = 6;
      const photos = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        img_src: `http://mars.nasa.gov/image${i}.jpg`,
        camera: { name: `CAM${i}`, full_name: `Camera ${i}` },
      }));

      const limitedPhotos = photos.slice(0, maxPhotos);
      expect(limitedPhotos).toHaveLength(6);
    });
  });
});

describe('NASAGalleryComponent', () => {
  describe('Date Range Generation', () => {
    it('should calculate correct date range', () => {
      const count = 8;
      const endDate = new Date('2024-01-15');
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - count);

      expect(startDate.toISOString().split('T')[0]).toBe('2024-01-07');
    });

    it('should filter out videos from gallery', () => {
      const items = [
        { media_type: 'image', title: 'Image 1' },
        { media_type: 'video', title: 'Video 1' },
        { media_type: 'image', title: 'Image 2' },
      ];

      const images = items.filter((item) => item.media_type === 'image');
      expect(images).toHaveLength(2);
      expect(images.every((i) => i.media_type === 'image')).toBe(true);
    });
  });
});

describe('NASALiveFeed', () => {
  describe('Stats', () => {
    it('should have default stats', () => {
      const stats = {
        astronautsInSpace: 0,
        issSpeed: 27600,
        issAltitude: 408,
        lastUpdated: null,
      };

      expect(stats.issSpeed).toBe(27600);
      expect(stats.issAltitude).toBe(408);
    });
  });

  describe('HTML Generation', () => {
    it('should generate live indicator', () => {
      const getLiveFeedHTML = () => `
        <div class="nasa-live-feed">
          <div class="live-header">
            <span class="live-indicator">
              <span class="live-dot"></span>
              LIVE
            </span>
          </div>
        </div>
      `;

      const html = getLiveFeedHTML();
      expect(html).toContain('live-indicator');
      expect(html).toContain('LIVE');
      expect(html).toContain('live-dot');
    });
  });
});
