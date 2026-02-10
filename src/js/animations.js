/**
 * Cosmic Voyage - Premium Scroll Animations & Page Transitions
 * Using GSAP with ScrollTrigger for performant, professional animations
 * Respects reduced-motion preferences for accessibility
 */

// ============================================
// MOTION PREFERENCES CHECK
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

// ============================================
// GSAP IMPORTS (Dynamic import for module support)
// ============================================
let gsap, ScrollTrigger;

async function initGSAP() {
    if (prefersReducedMotion) {
        console.log('🎭 Reduced motion preferred - skipping animations');
        return false;
    }
    
    try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');
        
        gsap = gsapModule.gsap || gsapModule.default;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
        
        gsap.registerPlugin(ScrollTrigger);
        return true;
    } catch (e) {
        console.warn('GSAP not available, using fallback animations');
        return false;
    }
}

// ============================================
// SMOOTH SCROLL NAVIGATION SYSTEM
// ============================================
class SmoothScrollNav {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.currentSection = null;
        
        this.init();
    }
    
    init() {
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });
        
        // Update active nav on scroll
        if (!prefersReducedMotion) {
            window.addEventListener('scroll', () => this.updateActiveNav(), { passive: true });
        }
        
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.scrollToSection('#solar-system');
            });
        }
    }
    
    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const offset = this.navbar?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        if (prefersReducedMotion) {
            window.scrollTo({ top: targetPosition, behavior: 'auto' });
        } else {
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }
    
    updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }
}

// ============================================
// PARALLAX BACKGROUND SYSTEM
// ============================================
class ParallaxSystem {
    constructor() {
        this.layers = [];
        this.init();
    }
    
    init() {
        if (prefersReducedMotion || isTouchDevice) return;
        
        // Create parallax layers for space depth
        this.createParallaxLayers();
        this.bindEvents();
    }
    
    createParallaxLayers() {
        // Deep space layer (slowest)
        const deepLayer = this.createLayer('parallax-deep', 0.1, [
            { type: 'nebula', x: '10%', y: '20%', size: 400, color: '157, 78, 221', opacity: 0.05 },
            { type: 'nebula', x: '80%', y: '60%', size: 350, color: '0, 212, 255', opacity: 0.04 }
        ]);
        
        // Mid space layer
        const midLayer = this.createLayer('parallax-mid', 0.3, [
            { type: 'nebula', x: '60%', y: '30%', size: 300, color: '255, 107, 53', opacity: 0.03 },
            { type: 'nebula', x: '20%', y: '80%', size: 250, color: '157, 78, 221', opacity: 0.04 }
        ]);
        
        // Foreground layer (fastest)
        const foreLayer = this.createLayer('parallax-fore', 0.5, [
            { type: 'nebula', x: '40%', y: '50%', size: 200, color: '0, 212, 255', opacity: 0.02 }
        ]);
        
        this.layers = [
            { element: deepLayer, speed: 0.1 },
            { element: midLayer, speed: 0.3 },
            { element: foreLayer, speed: 0.5 }
        ];
        
        document.body.insertBefore(deepLayer, document.body.firstChild);
        document.body.insertBefore(midLayer, document.body.firstChild);
        document.body.insertBefore(foreLayer, document.body.firstChild);
    }
    
    createLayer(id, speed, nebulas) {
        const layer = document.createElement('div');
        layer.id = id;
        layer.className = 'parallax-layer';
        layer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 120vh;
            pointer-events: none;
            z-index: -2;
            will-change: transform;
        `;
        
        nebulas.forEach(nebula => {
            const el = document.createElement('div');
            el.className = 'parallax-nebula';
            el.style.cssText = `
                position: absolute;
                left: ${nebula.x};
                top: ${nebula.y};
                width: ${nebula.size}px;
                height: ${nebula.size}px;
                background: radial-gradient(circle, rgba(${nebula.color}, ${nebula.opacity}), transparent 70%);
                filter: blur(60px);
                transform: translate(-50%, -50%);
            `;
            layer.appendChild(el);
        });
        
        return layer;
    }
    
    bindEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.layers.forEach(layer => {
            const yPos = scrollY * layer.speed;
            layer.element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor(gsapInstance, scrollTriggerInstance) {
        this.gsap = gsapInstance;
        this.ST = scrollTriggerInstance;
        this.init();
    }
    
    init() {
        this.animateHero();
        this.animateSectionHeaders();
        this.animateFactCards();
        this.animateSolarSystem();
        this.animateContactSection();
        this.animateFooter();
        this.setupPinEffects();
    }
    
    animateHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Hero content stagger animation
        this.gsap.from('.hero-text > *', {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Planet animation
        this.gsap.from('.planet-container', {
            scale: 0.5,
            opacity: 0,
            rotation: -30,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.5
        });
        
        // Parallax scroll effect on hero
        this.gsap.to('.hero-text', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -100,
            opacity: 0.3,
            ease: 'none'
        });
        
        this.gsap.to('.planet-container', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            rotation: 15,
            scale: 1.1,
            ease: 'none'
        });
    }
    
    animateSectionHeaders() {
        const headers = document.querySelectorAll('.section-header');
        
        headers.forEach(header => {
            this.gsap.from(header.children, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        });
    }
    
    animateFactCards() {
        const cards = document.querySelectorAll('.fact-card');
        
        cards.forEach((card, index) => {
            this.gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 80,
                opacity: 0,
                rotationX: 10,
                duration: 0.7,
                delay: (index % 3) * 0.1,
                ease: 'power3.out'
            });
            
            // Hover glow effect
            card.addEventListener('mouseenter', () => {
                this.gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    boxShadow: '0 25px 50px rgba(0, 212, 255, 0.2)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                this.gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 0 0 rgba(0, 212, 255, 0)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    animateSolarSystem() {
        const container = document.querySelector('.solar-container');
        if (!container) return;
        
        // Sun entrance
        this.gsap.from('.sun', {
            scrollTrigger: {
                trigger: '.solar-system',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // Orbits entrance with stagger
        this.gsap.from('.orbit', {
            scrollTrigger: {
                trigger: '.solar-system',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            rotation: 90,
            duration: 0.8,
            stagger: 0.08,
            ease: 'back.out(1.7)'
        });
        
        // Scroll-based rotation speed increase
        this.gsap.to('.planet-body', {
            scrollTrigger: {
                trigger: '.solar-system',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            },
            rotation: 360,
            ease: 'none'
        });
    }
    
    animateContactSection() {
        // Form entrance
        this.gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Social links stagger
        this.gsap.from('.social-link', {
            scrollTrigger: {
                trigger: '.social-links',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    }
    
    animateFooter() {
        this.gsap.from('.footer-content', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    }
    
    setupPinEffects() {
        // Pin the hero visual while scrolling through hero
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual && window.innerWidth > 768) {
            this.ST.create({
                trigger: '.hero',
                start: 'top top',
                end: 'bottom center',
                pin: heroVisual,
                pinSpacing: false
            });
        }
    }
}

// ============================================
// PAGE TRANSITION SYSTEM
// ============================================
class PageTransitions {
    constructor(gsapInstance) {
        this.gsap = gsapInstance;
        this.init();
    }
    
    init() {
        // Entrance animation on page load
        this.animateEntrance();
        
        // Setup transition overlay
        this.createTransitionOverlay();
    }
    
    animateEntrance() {
        // Page fade in
        this.gsap.from('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        // Navbar slide down
        this.gsap.from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    }
    
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #050508 0%, #1a0b2e 50%, #0d1b2a 100%);
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-top-color: #00d4ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        `;
        
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    transitionToSection(targetId, callback) {
        const overlay = document.getElementById('page-transition-overlay');
        if (!overlay || prefersReducedMotion) {
            if (callback) callback();
            return;
        }
        
        const tl = this.gsap.timeline({
            onComplete: () => {
                if (callback) callback();
                this.gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.2,
                    onComplete: () => {
                        overlay.style.visibility = 'hidden';
                    }
                });
            }
        });
        
        tl.to(overlay, {
            visibility: 'visible',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut'
        });
    }
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
class ScrollProgress {
    constructor() {
        this.init();
    }
    
    init() {
        if (prefersReducedMotion) return;
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #9d4edd, #ff6b35);
            z-index: 10001;
            width: 0%;
            transition: width 0.1s linear;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        `;
        
        document.body.appendChild(progressBar);
        
        // Update on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }
}

// ============================================
// MAGNETIC CURSOR EFFECT (Desktop only)
// ============================================
class MagneticCursor {
    constructor() {
        if (isTouchDevice || prefersReducedMotion) return;
        this.init();
    }
    
    init() {
        const magneticElements = document.querySelectorAll('.btn, .nav-link, .social-link, .planet-body');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.onMouseMove(e, el));
            el.addEventListener('mouseleave', () => this.onMouseLeave(el));
        });
    }
    
    onMouseMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
    
    onMouseLeave(el) {
        el.style.transform = '';
    }
}

// ============================================
// TEXT REVEAL ANIMATION
// ============================================
class TextReveal {
    constructor(gsapInstance) {
        this.gsap = gsapInstance;
        this.init();
    }
    
    init() {
        // Split and animate hero title
        const title = document.querySelector('.hero-title');
        if (title) {
            this.animateTextReveal(title);
        }
    }
    
    animateTextReveal(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
            `;
            element.appendChild(span);
            
            this.gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.05,
                delay: i * 0.03,
                ease: 'power2.out'
            });
        });
    }
}

// ============================================
// FADE IN PLACEHOLDER (For reduced motion)
// ============================================
class SimpleFadeAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fact-card, .section-header, .planet-info-panel').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
async function initAnimations() {
    // Initialize smooth scroll nav (works with or without GSAP)
    new SmoothScrollNav();
    
    // Initialize parallax system
    new ParallaxSystem();
    
    // Initialize scroll progress
    new ScrollProgress();
    
    // Initialize magnetic cursor
    new MagneticCursor();
    
    // Try to initialize GSAP
    const gsapReady = await initGSAP();
    
    if (gsapReady) {
        // Full GSAP animations
        new ScrollAnimations(gsap, ScrollTrigger);
        new PageTransitions(gsap);
        new TextReveal(gsap);
        
        console.log('✨ Premium GSAP animations initialized');
    } else {
        // Fallback simple animations
        new SimpleFadeAnimations();
        console.log('✨ Simple animations initialized (GSAP unavailable or reduced motion)');
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// Mark GSAP as loaded to prevent fallback
window.gsapLoaded = true;

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SmoothScrollNav,
        ParallaxSystem,
        ScrollAnimations,
        PageTransitions,
        MagneticCursor
    };
}