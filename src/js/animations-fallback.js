/**
 * Cosmic Voyage - Fallback Animations (Non-module)
 * Simple scroll animations for browsers without GSAP support
 * Respects reduced-motion preferences
 */

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Simple Intersection Observer for fade-in animations
    function initSimpleAnimations() {
        const animatedElements = document.querySelectorAll(
            '.fact-card, .section-header, .planet-info-panel, .contact-form, .social-link'
        );
        
        // Set initial states
        animatedElements.forEach(el => {
            if (!el.classList.contains('animated')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Smooth scroll for navigation
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        const navbar = document.querySelector('.navbar');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = navbar?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    }
    
    // Update active nav link on scroll
    function initActiveNav() {
        if (prefersReducedMotion) return;
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = null;
        
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    if (currentSection !== sectionId) {
                        currentSection = sectionId;
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, { passive: true });
    }
    
    // Scroll progress indicator
    function initScrollProgress() {
        if (prefersReducedMotion) return;
        
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-fallback';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #9d4edd, #ff6b35);
            z-index: 10001;
            width: 0%;
            transition: width 0.1s linear;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }
    
    // Hover effects for cards
    function initHoverEffects() {
        const cards = document.querySelectorAll('.fact-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion) {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    // Initialize all fallback animations
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initSimpleAnimations();
                initSmoothScroll();
                initActiveNav();
                initScrollProgress();
                initHoverEffects();
            });
        } else {
            initSimpleAnimations();
            initSmoothScroll();
            initActiveNav();
            initScrollProgress();
            initHoverEffects();
        }
        
        console.log('🚀 Fallback animations initialized');
    }
    
    // Only run if GSAP animations aren't loaded
    if (!window.gsapLoaded) {
        init();
    }
    
})();