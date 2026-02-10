/**
 * Starfield Canvas Animation Module
 * Creates an interactive animated starfield background
 */

export class Starfield {
  /**
   * @param {string} selector - CSS selector for the canvas element
   * @param {Object} options - Configuration options
   */
  constructor(selector, options = {}) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) {
      console.warn(`Starfield: Canvas element '${selector}' not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.nebulas = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;

    // Configuration
    this.config = {
      starDensity: options.starDensity || 3000,
      nebulaCount: options.nebulaCount || 3,
      shootingStarInterval: options.shootingStarInterval || 3000,
      parallaxStrength: options.parallaxStrength || 2,
      ...options,
    };

    this.init();
  }

  /**
   * Initialize the starfield
   */
  init() {
    this.resize();
    this.createStars();
    this.createNebulas();
    this.bindEvents();
    this.animate();
  }

  /**
   * Resize canvas to match window size
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Create random stars
   */
  createStars() {
    const starCount = Math.floor((this.canvas.width * this.canvas.height) / this.config.starDensity);
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
        color: this.getStarColor(),
      });
    }
  }

  /**
   * Get a random star color
   * @returns {string} RGB color string
   */
  getStarColor() {
    const colors = [
      '255, 255, 255', // White
      '200, 220, 255', // Blue-ish
      '255, 240, 200', // Yellow-ish
      '255, 200, 200', // Red-ish
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Create nebula clouds
   */
  createNebulas() {
    this.nebulas = [
      { x: 0.2, y: 0.8, radius: 300, color: '157, 78, 221', opacity: 0.08 }, // Purple
      { x: 0.8, y: 0.2, radius: 250, color: '0, 212, 255', opacity: 0.06 }, // Cyan
      { x: 0.5, y: 0.5, radius: 400, color: '255, 107, 53', opacity: 0.04 }, // Orange
    ];
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Handle resize
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
    });

    // Mouse parallax
    window.addEventListener('mousemove', e => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Scroll parallax
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    // Click to create shooting stars
    this.canvas.addEventListener('click', e => {
      this.createShootingStar(e.clientX, e.clientY);
    });

    // Random shooting stars
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.createShootingStar();
      }
    }, this.config.shootingStarInterval);
  }

  /**
   * Create a shooting star
   * @param {number} [startX] - Starting X position
   * @param {number} [startY] - Starting Y position
   */
  createShootingStar(startX, startY) {
    const x = startX || Math.random() * this.canvas.width;
    const y = startY || Math.random() * (this.canvas.height / 2);

    this.shootingStars.push({
      x,
      y,
      length: Math.random() * 80 + 50,
      speed: Math.random() * 10 + 8,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
      opacity: 1,
      life: 1,
    });
  }

  /**
   * Draw nebula backgrounds
   */
  drawNebulas() {
    this.nebulas.forEach(nebula => {
      const x = nebula.x * this.canvas.width + this.mouseX * 20;
      const y = nebula.y * this.canvas.height + this.mouseY * 20 - this.scrollY * 0.1;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, nebula.radius);
      gradient.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
      gradient.addColorStop(0.5, `rgba(${nebula.color}, ${nebula.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });
  }

  /**
   * Draw all stars
   */
  drawStars() {
    this.stars.forEach(star => {
      // Parallax effect
      const parallaxX = this.mouseX * star.size * this.config.parallaxStrength;
      const parallaxY = this.mouseY * star.size * this.config.parallaxStrength + this.scrollY * star.speed * 0.5;

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

  /**
   * Draw shooting stars
   */
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

  /**
   * Main animation loop
   */
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawNebulas();
    this.drawStars();
    this.drawShootingStars();

    requestAnimationFrame(() => this.animate());
  }
}
