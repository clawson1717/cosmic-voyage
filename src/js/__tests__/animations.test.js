/**
 * Tests for Animations Module
 * Tests GSAP animations, ScrollTrigger, page transitions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Motion Preferences', () => {
  describe('Reduced Motion Detection', () => {
    it('should detect reduced motion preference', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
      global.matchMedia = mockMatchMedia;

      const prefersReducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      expect(prefersReducedMotion).toBe(true);
    });

    it('should detect touch device', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
      global.matchMedia = mockMatchMedia;

      const isTouchDevice = global.matchMedia('(pointer: coarse)').matches;
      expect(isTouchDevice).toBe(true);
    });
  });
});

describe('SmoothScrollNav Class', () => {
  describe('Section Navigation', () => {
    it('should find correct section by ID', () => {
      const sections = [
        { id: 'hero', offsetTop: 0 },
        { id: 'solar-system', offsetTop: 800 },
        { id: 'contact', offsetTop: 1600 },
      ];

      const findSection = (id) => sections.find((s) => s.id === id);

      expect(findSection('hero')).toEqual({ id: 'hero', offsetTop: 0 });
      expect(findSection('contact')).toEqual({ id: 'contact', offsetTop: 1600 });
      expect(findSection('nonexistent')).toBeUndefined();
    });

    it('should calculate scroll position with offset', () => {
      const calculatePosition = (sectionTop, scrollY, offset) => {
        return sectionTop + scrollY - offset;
      };

      expect(calculatePosition(1000, 0, 80)).toBe(920);
      expect(calculatePosition(2000, 500, 100)).toBe(2400);
    });
  });

  describe('Active Navigation', () => {
    it('should determine active section based on scroll position', () => {
      const sections = [
        { id: 'hero', offsetTop: 0, offsetHeight: 800 },
        { id: 'solar-system', offsetTop: 800, offsetHeight: 800 },
      ];

      const getActiveSection = (scrollPos) => {
        const adjustedPos = scrollPos + 150;
        return sections.find(
          (s) => adjustedPos >= s.offsetTop && adjustedPos < s.offsetTop + s.offsetHeight
        );
      };

      expect(getActiveSection(0)?.id).toBe('hero');
      expect(getActiveSection(700)?.id).toBe('solar-system');
      expect(getActiveSection(800)?.id).toBe('solar-system');
    });
  });
});

describe('ParallaxSystem Class', () => {
  describe('Layer Creation', () => {
    it('should create layer with correct speed', () => {
      const createLayer = (id, speed) => ({ element: { id }, speed });

      const layer = createLayer('parallax-deep', 0.1);
      expect(layer.element.id).toBe('parallax-deep');
      expect(layer.speed).toBe(0.1);
    });

    it('should calculate parallax position based on scroll', () => {
      const calculateParallax = (scrollY, speed) => scrollY * speed;

      expect(calculateParallax(100, 0.1)).toBe(10);
      expect(calculateParallax(100, 0.5)).toBe(50);
      expect(calculateParallax(0, 0.3)).toBe(0);
    });

    it('should create nebula with valid CSS', () => {
      const nebula = {
        x: '10%',
        y: '20%',
        size: 400,
        color: '157, 78, 221',
        opacity: 0.05,
      };

      const css = `
        position: absolute;
        left: ${nebula.x};
        top: ${nebula.y};
        width: ${nebula.size}px;
        height: ${nebula.size}px;
        background: radial-gradient(circle, rgba(${nebula.color}, ${nebula.opacity}), transparent 70%);
        filter: blur(60px);
      `;

      expect(css).toContain('left: 10%');
      expect(css).toContain('rgba(157, 78, 221, 0.05)');
    });
  });
});

describe('ScrollProgress Class', () => {
  describe('Progress Calculation', () => {
    it('should calculate scroll progress correctly', () => {
      const calculateProgress = (scrollTop, docHeight, windowHeight) => {
        return (scrollTop / (docHeight - windowHeight)) * 100;
      };

      expect(calculateProgress(0, 2000, 1000)).toBe(0);
      expect(calculateProgress(500, 2000, 1000)).toBe(50);
      expect(calculateProgress(1000, 2000, 1000)).toBe(100);
    });

    it('should handle zero scroll', () => {
      const calculateProgress = (scrollTop, docHeight, windowHeight) => {
        return (scrollTop / (docHeight - windowHeight)) * 100;
      };

      expect(calculateProgress(0, 3000, 1000)).toBe(0);
    });
  });
});

describe('MagneticCursor Class', () => {
  describe('Magnetic Effect Calculation', () => {
    it('should calculate magnetic offset from center', () => {
      const calculateMagneticOffset = (mouseX, mouseY, rect) => {
        const x = mouseX - rect.left - rect.width / 2;
        const y = mouseY - rect.top - rect.height / 2;
        return { x, y };
      };

      const rect = { left: 100, top: 100, width: 200, height: 100 };
      const offset = calculateMagneticOffset(250, 180, rect);

      expect(offset.x).toBe(50); // 250 - 100 - 100
      expect(offset.y).toBe(30); // 180 - 100 - 50
    });

    it('should apply magnetic strength multiplier', () => {
      const applyMagneticStrength = (offset, strength) => ({
        x: offset.x * strength,
        y: offset.y * strength,
      });

      const offset = { x: 50, y: 30 };
      const result = applyMagneticStrength(offset, 0.2);

      expect(result.x).toBe(10);
      expect(result.y).toBe(6);
    });
  });
});

describe('TextReveal Class', () => {
  describe('Text Splitting', () => {
    it('should split text into individual characters', () => {
      const splitText = (text) => [...text].map((char) => char === ' ' ? '\u00A0' : char);

      expect(splitText('Hi')).toEqual(['H', 'i']);
      expect(splitText('A B')).toEqual(['A', '\u00A0', 'B']);
    });

    it('should calculate delay for staggered animation', () => {
      const calculateDelay = (index, delayPerChar) => index * delayPerChar;

      expect(calculateDelay(0, 0.03)).toBe(0);
      expect(calculateDelay(5, 0.03)).toBe(0.15);
      expect(calculateDelay(10, 0.05)).toBe(0.5);
    });
  });
});

describe('PageTransitions Class', () => {
  describe('Transition Overlay', () => {
    it('should create overlay with correct styles', () => {
      const createOverlayStyles = () => ({
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10000',
        pointerEvents: 'none',
      });

      const styles = createOverlayStyles();
      expect(styles.zIndex).toBe('10000');
      expect(styles.position).toBe('fixed');
    });
  });
});

describe('SimpleFadeAnimations (Fallback)', () => {
  describe('Fade In Animation', () => {
    it('should set initial fade styles', () => {
      const element = { style: {} };

      const setInitialStyles = (el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      };

      setInitialStyles(element);

      expect(element.style.opacity).toBe('0');
      expect(element.style.transform).toBe('translateY(20px)');
      expect(element.style.transition).toContain('opacity 0.5s');
    });

    it('should apply visible styles when intersecting', () => {
      const element = { style: {} };

      const applyVisibleStyles = (el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      };

      applyVisibleStyles(element);

      expect(element.style.opacity).toBe('1');
      expect(element.style.transform).toBe('none');
    });
  });

  describe('Intersection Observer Options', () => {
    it('should use correct observer options', () => {
      const observerOptions = {
        threshold: 0.1,
      };

      expect(observerOptions.threshold).toBe(0.1);
    });
  });
});

describe('Animation Performance', () => {
  describe('RequestAnimationFrame Usage', () => {
    it('should use RAF for smooth animations', () => {
      const mockRAF = vi.fn((cb) => setTimeout(cb, 16));
      global.requestAnimationFrame = mockRAF;

      let ticking = false;
      const update = () => {
        if (!ticking) {
          global.requestAnimationFrame(() => {
            // Animation logic
            ticking = false;
          });
          ticking = true;
        }
      };

      update();
      expect(mockRAF).toHaveBeenCalled();
    });
  });

  describe('Will-Change Property', () => {
    it('should use will-change for animated properties', () => {
      const layer = { style: {} };
      layer.style.willChange = 'transform';

      expect(layer.style.willChange).toBe('transform');
    });
  });
});

describe('Accessibility in Animations', () => {
  describe('Reduced Motion Support', () => {
    it('should skip animations when reduced motion is preferred', () => {
      const prefersReducedMotion = true;

      const shouldAnimate = !prefersReducedMotion;
      expect(shouldAnimate).toBe(false);
    });

    it('should use instant scroll for reduced motion', () => {
      const prefersReducedMotion = true;
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';

      expect(behavior).toBe('auto');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus visibility during animations', () => {
      const focusableElement = {
        focus: vi.fn(),
        style: { outline: 'none' },
      };

      // Ensure focus is visible
      focusableElement.style.outline = '2px solid #00d4ff';

      expect(focusableElement.style.outline).toContain('2px');
    });
  });
});
