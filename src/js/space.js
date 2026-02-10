/**
 * Cosmic Voyage - Interactive Space Experience
 * Starfield animation, parallax effects, planet interactions
 */

// ============================================
// STARFIELD CANVAS ANIMATION
// ============================================
class Starfield {
    constructor() {
        this.canvas = document.getElementById('starfield');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.nebulas = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createStars();
        this.createNebulas();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 3000);
        this.stars = [];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                speed: Math.random() * 0.5 + 0.1,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: this.getStarColor()
            });
        }
    }
    
    getStarColor() {
        const colors = [
            '255, 255, 255',    // White
            '200, 220, 255',    // Blue-ish
            '255, 240, 200',    // Yellow-ish
            '255, 200, 200'     // Red-ish
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createNebulas() {
        // Create subtle nebula clouds in the background
        this.nebulas = [
            { x: 0.2, y: 0.8, radius: 300, color: '157, 78, 221', opacity: 0.08 },   // Purple
            { x: 0.8, y: 0.2, radius: 250, color: '0, 212, 255', opacity: 0.06 },    // Cyan
            { x: 0.5, y: 0.5, radius: 400, color: '255, 107, 53', opacity: 0.04 }    // Orange
        ];
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
        
        // Create shooting star on click
        this.canvas.addEventListener('click', (e) => {
            this.createShootingStar(e.clientX, e.clientY);
        });
        
        // Random shooting stars
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createShootingStar();
            }
        }, 3000);
    }
    
    createShootingStar(startX, startY) {
        const x = startX || Math.random() * this.canvas.width;
        const y = startY || Math.random() * (this.canvas.height / 2);
        
        this.shootingStars.push({
            x: x,
            y: y,
            length: Math.random() * 80 + 50,
            speed: Math.random() * 10 + 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
            opacity: 1,
            life: 1
        });
    }
    
    drawNebulas() {
        this.nebulas.forEach(nebula => {
            const x = nebula.x * this.canvas.width + this.mouseX * 20;
            const y = nebula.y * this.canvas.height + this.mouseY * 20 - this.scrollY * 0.1;
            
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, nebula.radius
            );
            gradient.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
            gradient.addColorStop(0.5, `rgba(${nebula.color}, ${nebula.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }
    
    drawStars() {
        this.stars.forEach(star => {
            // Parallax effect
            const parallaxX = this.mouseX * star.size * 2;
            const parallaxY = this.mouseY * star.size * 2 + this.scrollY * star.speed * 0.5;
            
            let x = star.x + parallaxX;
            let y = star.y + parallaxY;
            
            // Wrap around screen
            if (x < 0) x += this.canvas.width;
            if (x > this.canvas.width) x -= this.canvas.width;
            if (y < 0) y += this.canvas.height;
            if (y > this.canvas.height) y -= this.canvas.height;
            
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
            const opacity = star.opacity * twinkle;
            
            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${star.color}, ${opacity})`;
            this.ctx.fill();
            
            // Glow for larger stars
            if (star.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${star.color}, ${opacity * 0.3})`;
                this.ctx.fill();
            }
        });
    }
    
    drawShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.life -= 0.02;
            star.opacity = star.life;
            
            if (star.life <= 0) return false;
            
            // Draw shooting star
            const tailX = star.x - Math.cos(star.angle) * star.length;
            const tailY = star.y - Math.sin(star.angle) * star.length;
            
            const gradient = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(tailX, tailY);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Head glow
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
            
            return true;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawNebulas();
        this.drawStars();
        this.drawShootingStars();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PARALLAX EFFECTS
// ============================================
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.update());
        window.addEventListener('resize', () => this.update());
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fact-card, .section-header, .planet-info-panel');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animateEntry(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.animatedElements.forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });
    }
    
    animateEntry(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
class NavbarEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
}

// ============================================
// MOBILE MENU
// ============================================
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }
    
    toggle() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// ============================================
// PLANET INTERACTION
// ============================================
class PlanetInteraction {
    constructor() {
        this.planets = document.querySelectorAll('.planet-body');
        this.infoPanel = document.getElementById('planet-info');
        this.infoName = document.getElementById('info-name');
        this.infoStats = document.getElementById('info-stats');
        this.closeBtn = document.querySelector('.close-info');
        
        this.planetData = {
            mercury: {
                name: 'Mercury',
                distance: '57.9 million km from Sun',
                diameter: '4,879 km',
                day: '59 Earth days',
                year: '88 Earth days',
                moons: 0,
                temp: '-173°C to 427°C',
                description: 'Mercury is the smallest planet and closest to the Sun. It has no atmosphere to retain heat, causing extreme temperature variations.'
            },
            venus: {
                name: 'Venus',
                distance: '108.2 million km from Sun',
                diameter: '12,104 km',
                day: '243 Earth days',
                year: '225 Earth days',
                moons: 0,
                temp: '462°C (surface)',
                description: 'Venus is the hottest planet with a thick, toxic atmosphere that traps heat. It rotates backwards compared to most planets.'
            },
            earth: {
                name: 'Earth',
                distance: '149.6 million km from Sun',
                diameter: '12,742 km',
                day: '24 hours',
                year: '365.25 days',
                moons: 1,
                temp: '-88°C to 58°C',
                description: 'Earth is the only known planet to support life. It has liquid water, a protective atmosphere, and a magnetic field.'
            },
            mars: {
                name: 'Mars',
                distance: '227.9 million km from Sun',
                diameter: '6,779 km',
                day: '24h 37m',
                year: '687 Earth days',
                moons: 2,
                temp: '-153°C to 20°C',
                description: 'Mars, the Red Planet, has the largest volcano and canyon in the solar system. It may have once supported microbial life.'
            },
            jupiter: {
                name: 'Jupiter',
                distance: '778.5 million km from Sun',
                diameter: '139,820 km',
                day: '9h 56m',
                year: '11.86 Earth years',
                moons: 95,
                temp: '-110°C (cloud tops)',
                description: 'Jupiter is the largest planet, a gas giant with the Great Red Spot—a storm larger than Earth that has raged for centuries.'
            },
            saturn: {
                name: 'Saturn',
                distance: '1.4 billion km from Sun',
                diameter: '116,460 km',
                day: '10h 42m',
                year: '29.45 Earth years',
                moons: 146,
                temp: '-140°C',
                description: 'Saturn is famous for its spectacular ring system. It\'s less dense than water and would float if placed in a giant bathtub!'
            },
            uranus: {
                name: 'Uranus',
                distance: '2.9 billion km from Sun',
                diameter: '50,724 km',
                day: '17h 14m',
                year: '84 Earth years',
                moons: 27,
                temp: '-195°C',
                description: 'Uranus rotates on its side, likely due to a massive collision. It has a faint ring system and appears blue-green from methane.'
            },
            neptune: {
                name: 'Neptune',
                distance: '4.5 billion km from Sun',
                diameter: '49,244 km',
                day: '16h 6m',
                year: '164.8 Earth years',
                moons: 14,
                temp: '-200°C',
                description: 'Neptune has the strongest winds in the solar system, reaching 2,100 km/h. It was the first planet predicted by mathematics.'
            }
        };
        
        this.init();
    }
    
    init() {
        this.planets.forEach(planet => {
            planet.addEventListener('click', (e) => {
                const planetKey = planet.dataset.planet;
                this.showInfo(planetKey);
            });
        });
        
        this.closeBtn.addEventListener('click', () => {
            this.infoPanel.classList.remove('active');
        });
    }
    
    showInfo(planetKey) {
        const data = this.planetData[planetKey];
        if (!data) return;
        
        this.infoName.textContent = data.name;
        this.infoStats.innerHTML = `
            <p><strong>📏 Diameter:</strong> ${data.diameter}</p>
            <p><strong>🌡️ Temperature:</strong> ${data.temp}</p>
            <p><strong>☀️ Distance from Sun:</strong> ${data.distance}</p>
            <p><strong>📅 Day Length:</strong> ${data.day}</p>
            <p><strong>🗓️ Year Length:</strong> ${data.year}</p>
            <p><strong>🌙 Moons:</strong> ${data.moons}</p>
            <p style="margin-top: 1rem; font-style: italic;">${data.description}</p>
        `;
        
        this.infoPanel.classList.add('active');
        this.infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ============================================
// NEWSLETTER FORM
// ============================================
class NewsletterForm {
    constructor() {
        this.form = document.getElementById('subscribe-form');
        this.emailInput = document.getElementById('email');
        this.message = document.getElementById('form-message');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    handleSubmit() {
        const email = this.emailInput.value;
        
        if (this.validateEmail(email)) {
            this.showMessage('🚀 Welcome aboard, space explorer! Check your inbox for confirmation.', 'success');
            this.emailInput.value = '';
        } else {
            this.showMessage('⚠️ Please enter a valid email address.', 'error');
        }
    }
    
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `form-message ${type}`;
        
        setTimeout(() => {
            this.message.textContent = '';
            this.message.className = 'form-message';
        }, 5000);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = 80; // Account for fixed navbar
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// MISSION CONTROL DASHBOARD
// ============================================
class MissionControl {
    constructor() {
        this.missionStartTime = Date.now();
        this.launchTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        this.isLaunched = false;
        this.telemetry = {
            altitude: 0,
            velocity: 0,
            acceleration: 0,
            tempExt: -270,
            tempInt: 21.5,
            pressure: 101.3,
            o2Level: 21.0,
            radiation: 0.12
        };
        this.logEntries = [];
        this.init();
    }

    init() {
        this.bindElements();
        this.startClocks();
        this.startTelemetry();
        this.drawTrajectory();
        this.addEventListeners();
        this.addLogEntry('info', 'Mission Control dashboard initialized');
        console.log('🎯 Mission Control systems online');
    }

    bindElements() {
        this.elements = {
            missionTime: document.getElementById('mission-time'),
            uptime: document.getElementById('uptime'),
            countdownDays: document.getElementById('countdown-days'),
            countdownHours: document.getElementById('countdown-hours'),
            countdownMinutes: document.getElementById('countdown-minutes'),
            countdownSeconds: document.getElementById('countdown-seconds'),
            launchBtn: document.getElementById('launch-btn'),
            fuelGauge: document.querySelector('.fuel-gauge'),
            fuelPercent: document.getElementById('fuel-percent'),
            powerMain: document.getElementById('power-main'),
            powerAux: document.getElementById('power-aux'),
            powerEmergency: document.getElementById('power-emergency'),
            powerMainVal: document.getElementById('power-main-val'),
            powerAuxVal: document.getElementById('power-aux-val'),
            powerEmergencyVal: document.getElementById('power-emergency-val'),
            voltage: document.getElementById('voltage'),
            current: document.getElementById('current'),
            altitude: document.getElementById('telemetry-altitude'),
            velocity: document.getElementById('telemetry-velocity'),
            acceleration: document.getElementById('telemetry-acceleration'),
            tempExt: document.getElementById('telemetry-temp-ext'),
            tempInt: document.getElementById('telemetry-temp-int'),
            pressure: document.getElementById('telemetry-pressure'),
            o2Level: document.getElementById('telemetry-o2'),
            radiation: document.getElementById('telemetry-radiation'),
            apoapsis: document.getElementById('apoapsis'),
            periapsis: document.getElementById('periapsis'),
            inclination: document.getElementById('inclination'),
            eccentricity: document.getElementById('eccentricity'),
            missionLog: document.getElementById('mission-log')
        };
    }

    startClocks() {
        // Update every 100ms for smooth display
        setInterval(() => this.updateClocks(), 100);
    }

    updateClocks() {
        const now = Date.now();
        const elapsed = now - this.missionStartTime;
        
        // Mission time (T+ format)
        const missionSeconds = Math.floor(elapsed / 1000);
        const missionHours = Math.floor(missionSeconds / 3600);
        const missionMinutes = Math.floor((missionSeconds % 3600) / 60);
        const missionSecs = missionSeconds % 60;
        
        if (this.elements.missionTime) {
            this.elements.missionTime.textContent = 
                `T+${String(missionHours).padStart(2, '0')}:${String(missionMinutes).padStart(2, '0')}:${String(missionSecs).padStart(2, '0')}`;
        }

        // Uptime
        if (this.elements.uptime) {
            this.elements.uptime.textContent = 
                `${String(missionHours).padStart(2, '0')}:${String(missionMinutes).padStart(2, '0')}:${String(missionSecs).padStart(2, '0')}`;
        }

        // Countdown
        const timeUntilLaunch = this.launchTime - now;
        
        if (timeUntilLaunch > 0 && !this.isLaunched) {
            const days = Math.floor(timeUntilLaunch / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilLaunch % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeUntilLaunch % (1000 * 60)) / 1000);

            if (this.elements.countdownDays) {
                this.elements.countdownDays.textContent = String(days).padStart(2, '0');
                this.elements.countdownHours.textContent = String(hours).padStart(2, '0');
                this.elements.countdownMinutes.textContent = String(minutes).padStart(2, '0');
                this.elements.countdownSeconds.textContent = String(seconds).padStart(2, '0');
            }

            // Critical countdown (less than 1 minute)
            if (timeUntilLaunch < 60000 && timeUntilLaunch > 0) {
                this.elements.countdownSeconds.classList.add('critical');
            }
        } else if (!this.isLaunched) {
            // Launch time reached but not launched
            if (this.elements.countdownDays) {
                this.elements.countdownDays.textContent = '00';
                this.elements.countdownHours.textContent = '00';
                this.elements.countdownMinutes.textContent = '00';
                this.elements.countdownSeconds.textContent = '00';
            }
        }
    }

    startTelemetry() {
        // Update telemetry every 2 seconds
        setInterval(() => this.updateTelemetry(), 2000);
        
        // Update power systems every 3 seconds
        setInterval(() => this.updatePowerSystems(), 3000);
        
        // Update trajectory every 5 seconds
        setInterval(() => this.updateTrajectory(), 5000);
    }

    updateTelemetry() {
        if (this.isLaunched) {
            // Simulate ascent data
            this.telemetry.altitude += Math.random() * 50;
            this.telemetry.velocity += Math.random() * 200;
            this.telemetry.acceleration = 2.5 + Math.random() * 1.5;
            this.telemetry.tempExt = -50 - Math.random() * 20;
            this.telemetry.tempInt = 20 + Math.random() * 4;
            this.telemetry.pressure = Math.max(0, this.telemetry.pressure - Math.random() * 5);
            this.telemetry.o2Level = Math.max(19, 21 - Math.random() * 0.5);
            this.telemetry.radiation = 0.12 + Math.random() * 0.1;
        } else {
            // Pre-launch fluctuations
            this.telemetry.tempInt = 21 + (Math.random() - 0.5) * 0.5;
            this.telemetry.pressure = 101.3 + (Math.random() - 0.5) * 0.2;
            this.telemetry.o2Level = 21 + (Math.random() - 0.5) * 0.1;
        }

        // Update display
        if (this.elements.altitude) {
            this.elements.altitude.textContent = `${this.telemetry.altitude.toFixed(1)} km`;
        }
        if (this.elements.velocity) {
            this.elements.velocity.textContent = `${this.telemetry.velocity.toFixed(0)} km/h`;
        }
        if (this.elements.acceleration) {
            this.elements.acceleration.textContent = `${this.telemetry.acceleration.toFixed(1)} m/s²`;
        }
        if (this.elements.tempExt) {
            this.elements.tempExt.textContent = `${this.telemetry.tempExt.toFixed(0)}°C`;
        }
        if (this.elements.tempInt) {
            this.elements.tempInt.textContent = `${this.telemetry.tempInt.toFixed(1)}°C`;
        }
        if (this.elements.pressure) {
            this.elements.pressure.textContent = `${this.telemetry.pressure.toFixed(1)} kPa`;
        }
        if (this.elements.o2Level) {
            this.elements.o2Level.textContent = `${this.telemetry.o2Level.toFixed(1)}%`;
        }
        if (this.elements.radiation) {
            this.elements.radiation.textContent = `${this.telemetry.radiation.toFixed(2)} mSv`;
        }
    }

    updatePowerSystems() {
        // Simulate power fluctuations
        const mainPower = 95 + Math.random() * 5;
        const auxPower = 90 + Math.random() * 8;
        const emergencyPower = 99 + Math.random();

        if (this.elements.powerMainVal) {
            this.elements.powerMainVal.textContent = `${mainPower.toFixed(0)}%`;
        }
        if (this.elements.powerAuxVal) {
            this.elements.powerAuxVal.textContent = `${auxPower.toFixed(0)}%`;
        }
        if (this.elements.powerEmergencyVal) {
            this.elements.powerEmergencyVal.textContent = `${Math.min(100, emergencyPower).toFixed(0)}%`;
        }

        // Update voltage and current
        const voltage = 118 + Math.random() * 4;
        const current = 40 + Math.random() * 10;

        if (this.elements.voltage) {
            this.elements.voltage.textContent = `${voltage.toFixed(1)} V`;
        }
        if (this.elements.current) {
            this.elements.current.textContent = `${current.toFixed(1)} A`;
        }
    }

    updateTrajectory() {
        if (this.isLaunched) {
            const apo = 200 + this.telemetry.altitude * 0.1;
            const peri = 200 + Math.random() * 10;
            
            if (this.elements.apoapsis) {
                this.elements.apoapsis.textContent = `${apo.toFixed(0)} km`;
            }
            if (this.elements.periapsis) {
                this.elements.periapsis.textContent = `${peri.toFixed(0)} km`;
            }
        }
    }

    drawTrajectory() {
        const canvas = document.getElementById('trajectory-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw Earth
        ctx.beginPath();
        ctx.arc(60, height / 2, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#1e3a5f';
        ctx.fill();
        ctx.strokeStyle = '#4a90d9';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw orbit path
        ctx.beginPath();
        ctx.ellipse(200, height / 2, 120, 60, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw spacecraft position
        const angle = (Date.now() / 5000) % (Math.PI * 2);
        const spacecraftX = 200 + Math.cos(angle) * 120;
        const spacecraftY = height / 2 + Math.sin(angle) * 60;

        ctx.beginPath();
        ctx.arc(spacecraftX, spacecraftY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw direction arrow
        const arrowX = spacecraftX + Math.cos(angle) * 15;
        const arrowY = spacecraftY + Math.sin(angle) * 15;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8, arrowY - 4);
        ctx.lineTo(arrowX - 8, arrowY + 4);
        ctx.closePath();
        ctx.fillStyle = '#00ff88';
        ctx.fill();

        // Request next frame
        requestAnimationFrame(() => this.drawTrajectory());
    }

    addLogEntry(type, message) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <span class="log-time">[${hours}:${minutes}:${seconds}]</span>
            <span class="log-type">[${type.toUpperCase()}]</span>
            <span class="log-message">${message}</span>
        `;

        if (this.elements.missionLog) {
            this.elements.missionLog.appendChild(entry);
            this.elements.missionLog.scrollTop = this.elements.missionLog.scrollHeight;

            // Keep only last 50 entries
            while (this.elements.missionLog.children.length > 50) {
                this.elements.missionLog.removeChild(this.elements.missionLog.firstChild);
            }
        }
    }

    initiateLaunch() {
        if (this.isLaunched) return;

        this.isLaunched = true;
        this.addLogEntry('success', 'Launch sequence initiated!');
        this.addLogEntry('info', 'Main engines ignited');
        this.addLogEntry('info', 'Liftoff confirmed');

        // Update button
        if (this.elements.launchBtn) {
            this.elements.launchBtn.textContent = 'LAUNCH IN PROGRESS';
            this.elements.launchBtn.disabled = true;
        }

        // Animate fuel gauge
        if (this.elements.fuelGauge && this.elements.fuelPercent) {
            let fuel = 87;
            const fuelInterval = setInterval(() => {
                fuel -= 0.5;
                if (fuel <= 0) {
                    fuel = 0;
                    clearInterval(fuelInterval);
                }
                const offset = 251.2 * (1 - fuel / 100);
                this.elements.fuelGauge.style.strokeDashoffset = offset;
                this.elements.fuelPercent.textContent = `${fuel.toFixed(0)}%`;
            }, 500);
        }

        // Simulate launch events
        setTimeout(() => this.addLogEntry('info', 'Max Q passed'), 3000);
        setTimeout(() => this.addLogEntry('success', 'Stage separation confirmed'), 8000);
        setTimeout(() => this.addLogEntry('info', 'Second stage ignition'), 9000);
        setTimeout(() => this.addLogEntry('success', 'Orbit insertion successful!'), 15000);
    }

    addEventListeners() {
        if (this.elements.launchBtn) {
            this.elements.launchBtn.addEventListener('click', () => this.initiateLaunch());
        }

        // Random system events
        setInterval(() => {
            if (Math.random() > 0.8) {
                const events = [
                    { type: 'info', message: 'Telemetry update received' },
                    { type: 'info', message: 'Ground station handover' },
                    { type: 'success', message: 'System check passed' },
                    { type: 'info', message: 'Navigation calibration complete' }
                ];
                const event = events[Math.floor(Math.random() * events.length)];
                this.addLogEntry(event.type, event.message);
            }
        }, 10000);
    }
}

// ============================================
// NASA DATA COMPONENTS INITIALIZATION
// ============================================
class NASAComponents {
    constructor() {
        this.init();
    }
    
    async init() {
        // Initialize APOD Component
        const apodContainer = document.getElementById('apod-container');
        if (apodContainer && typeof APODComponent !== 'undefined') {
            const apod = new APODComponent('apod-container', {
                showExplanation: true,
                maxExplanationLength: 400
            });
            await apod.render();
            console.log('🌌 NASA APOD loaded');
        }
        
        // Initialize Mars Rover Component
        const marsContainer = document.getElementById('mars-container');
        if (marsContainer && typeof MarsRoverComponent !== 'undefined') {
            const mars = new MarsRoverComponent('mars-container', {
                rover: 'curiosity',
                maxPhotos: 6
            });
            await mars.render();
            console.log('🔴 Mars Rover photos loaded');
        }
        
        // Initialize Gallery Component
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer && typeof NASAGalleryComponent !== 'undefined') {
            const gallery = new NASAGalleryComponent('gallery-container', {
                count: 8
            });
            await gallery.render();
            console.log('📸 NASA Gallery loaded');
        }
        
        // Initialize Live Feed Component
        const liveContainer = document.getElementById('nasa-live-container');
        if (liveContainer && typeof NASALiveFeed !== 'undefined') {
            const liveFeed = new NASALiveFeed('nasa-live-container');
            await liveFeed.render();
            console.log('🛰️ Live space data loaded');
        }
    }
}

// ============================================
// COSMIC VOYAGE APP
// ============================================
class CosmicVoyage {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize all modules
        new Starfield();
        new ParallaxEffects();
        new ScrollAnimations();
        new NavbarEffect();
        new MobileMenu();
        new PlanetInteraction();
        new NewsletterForm();
        new SmoothScroll();
        new MissionControl();
        
        // Initialize NASA API Components
        new NASAComponents();
        
        console.log('🚀 Cosmic Voyage initialized! Welcome to space exploration.');
        console.log('🌌 NASA API integration active - Real space data incoming!');
        console.log('🎯 Mission Control dashboard ready for launch sequence');
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CosmicVoyage();
});

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.style.animation = 'hueRotate 5s linear infinite';
            alert('🌈 Cosmic mode activated! You found the secret!');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add hue rotate animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes hueRotate {
        from { filter: hue-rotate(0deg); }
        to { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
