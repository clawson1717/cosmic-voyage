/**
 * Junglefield Canvas Animation Module
 * Creates an interactive animated jungle background with cenotes, ferns, and Mayan ruins atmosphere
 */

export class Junglefield {
  /**
   * @param {string} selector - CSS selector for the canvas element
   * @param {Object} options - Configuration options
   */
  constructor(selector, options = {}) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) {
      console.warn(`Junglefield: Canvas element '${selector}' not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.leaves = [];
    this.waterRipples = [];
    this.fireflies = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.time = 0;

    // Configuration
    this.config = {
      leafDensity: options.leafDensity || 150,
      fireflyCount: options.fireflyCount || 25,
      waterRippleCount: options.waterRippleCount || 3,
      parallaxStrength: options.parallaxStrength || 3,
      ...options,
    };

    this.init();
  }

  /**
   * Initialize the jungle field
   */
  init() {
    this.resize();
    this.createLeaves();
    this.createWaterRipples();
    this.createFireflies();
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
   * Create floating jungle leaves/ferns
   */
  createLeaves() {
    const leafCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
    this.leaves = [];

    const leafColors = [
      { r: 34, g: 139, b: 34 },    // Forest green
      { r: 46, g: 125, b: 50 },    // Tropical green
      { r: 85, g: 107, b: 47 },    // Dark olive
      { r: 107, g: 142, b: 35 },    // Olive drab
      { r: 0, g: 100, b: 0 },       // Dark green
      { r: 34, g: 85, b: 34 },      // Dark jungle green
      { r: 72, g: 61, b: 139 },     // Dark slate blue (for depth)
    ];

    for (let i = 0; i < leafCount; i++) {
      this.leaves.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 30 + 10,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        opacity: Math.random() * 0.4 + 0.2,
        depth: Math.random() * 0.8 + 0.2, // For parallax
        type: Math.floor(Math.random() * 3), // 0: fern, 1: broad leaf, 2: palm
      });
    }
  }

  /**
   * Create cenote water ripples
   */
  createWaterRipples() {
    this.waterRipples = [];
    const colors = [
      { r: 0, g: 150, b: 180 },     // Turquoise cenote
      { r: 64, g: 224, b: 208 },    // Turquoise
      { r: 72, g: 209, b: 204 },    // Medium turquoise
    ];

    for (let i = 0; i < this.config.waterRippleCount; i++) {
      this.waterRipples.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 0,
        maxRadius: Math.random() * 200 + 100,
        speed: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.15 + 0.05,
        delay: Math.random() * 3000,
        active: false,
      });
    }
  }

  /**
   * Create fireflies
   */
  createFireflies() {
    this.fireflies = [];
    for (let i = 0; i < this.config.fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: Math.random() * 0.05 + 0.02,
        color: Math.random() > 0.5 ? '255, 220, 100' : '180, 255, 150', // Warm yellow or lime
      });
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Handle resize
    window.addEventListener('resize', () => {
      this.resize();
      this.createLeaves();
      this.createFireflies();
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

    // Click to create ripples
    this.canvas.addEventListener('click', e => {
      this.createRippleAt(e.clientX, e.clientY);
    });
  }

  /**
   * Create a water ripple at specific position
   */
  createRippleAt(x, y) {
    this.waterRipples.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 150 + 80,
      speed: 3,
      color: { r: 0, g: 180, b: 200 },
      opacity: 0.2,
      delay: 0,
      active: true,
    });
  }

  /**
   * Draw cenote-style water gradients in background
   */
  drawWaterPools() {
    // Create deep cenote water effect at bottom
    const gradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.6, 0, this.canvas.height);
    gradient.addColorStop(0, 'rgba(0, 80, 100, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 60, 90, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 40, 70, 0.5)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.5);

    // Add some horizontal light rays (like sunlight through jungle canopy)
    for (let i = 0; i < 5; i++) {
      const rayX = (this.canvas.width * 0.2) + (i * this.canvas.width * 0.15) + this.mouseX * 10;
      const rayGradient = this.ctx.createLinearGradient(rayX, 0, rayX + 50, this.canvas.height);
      rayGradient.addColorStop(0, 'rgba(255, 240, 180, 0.03)');
      rayGradient.addColorStop(0.5, 'rgba(255, 240, 180, 0.08)');
      rayGradient.addColorStop(1, 'rgba(255, 240, 180, 0)');
      
      this.ctx.fillStyle = rayGradient;
      this.ctx.fillRect(rayX, 0, 60, this.canvas.height);
    }
  }

  /**
   * Draw water ripples
   */
  drawRipples() {
    this.waterRipples = this.waterRipples.filter(ripple => {
      if (ripple.delay > 0) {
        ripple.delay -= 16;
        return true;
      }

      ripple.radius += ripple.speed;
      
      if (ripple.radius > ripple.maxRadius) {
        return false;
      }

      const opacity = ripple.opacity * (1 - ripple.radius / ripple.maxRadius);
      
      this.ctx.beginPath();
      this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${ripple.color.r}, ${ripple.color.g}, ${ripple.color.b}, ${opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Inner glow
      this.ctx.beginPath();
      this.ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${ripple.color.r}, ${ripple.color.g}, ${ripple.color.b}, ${opacity * 0.5})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      return true;
    });
  }

  /**
   * Draw jungle leaves
   */
  drawLeaves() {
    this.leaves.forEach(leaf => {
      // Parallax
      const parallaxX = this.mouseX * leaf.size * this.config.parallaxStrength * leaf.depth;
      const parallaxY = this.mouseY * leaf.size * this.config.parallaxStrength * leaf.depth + this.scrollY * leaf.depth * 0.3;

      let x = leaf.x + parallaxX;
      let y = leaf.y + parallaxY + this.time * leaf.speedY;

      // Wrap around
      if (y > this.canvas.height + leaf.size) y = -leaf.size;
      if (y < -leaf.size) y = this.canvas.height + leaf.size;
      if (x > this.canvas.width + leaf.size) x = -leaf.size;
      if (x < -leaf.size) x = this.canvas.width + leaf.size;

      // Rotation
      leaf.rotation += leaf.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(leaf.rotation);

      // Draw different leaf types
      if (leaf.type === 0) {
        // Fern leaf
        this.drawFern(leaf);
      } else if (leaf.type === 1) {
        // Broad leaf
        this.drawBroadLeaf(leaf);
      } else {
        // Palm leaf
        this.drawPalmLeaf(leaf);
      }

      this.ctx.restore();
    });
  }

  /**
   * Draw a fern leaf
   */
  drawFern(leaf) {
    this.ctx.fillStyle = `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, ${leaf.opacity})`;
    
    // Main stem
    this.ctx.beginPath();
    this.ctx.moveTo(0, -leaf.size / 2);
    this.ctx.quadraticCurveTo(leaf.size / 4, 0, 0, leaf.size / 2);
    this.ctx.quadraticCurveTo(-leaf.size / 4, 0, 0, -leaf.size / 2);
    this.ctx.fill();

    // Leaflets
    for (let i = 0; i < 5; i++) {
      const y = -leaf.size / 2 + (i * leaf.size / 5);
      const size = leaf.size / 3 * (1 - Math.abs(i - 2) / 3);
      
      // Right side
      this.ctx.beginPath();
      this.ctx.ellipse(leaf.size / 4, y, size / 2, size / 4, Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Left side
      this.ctx.beginPath();
      this.ctx.ellipse(-leaf.size / 4, y, size / 2, size / 4, -Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draw a broad tropical leaf
   */
  drawBroadLeaf(leaf) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, leaf.size / 2);
    gradient.addColorStop(0, `rgba(${leaf.color.r + 30}, ${leaf.color.g + 30}, ${leaf.color.b + 30}, ${leaf.opacity})`);
    gradient.addColorStop(1, `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, ${leaf.opacity * 0.5})`);
    
    this.ctx.fillStyle = gradient;
    
    // Heart/oval shape
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, leaf.size / 2, leaf.size / 3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Vein line
    this.ctx.strokeStyle = `rgba(${leaf.color.r - 20}, ${leaf.color.g - 20}, ${leaf.color.b - 20}, ${leaf.opacity * 0.5})`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -leaf.size / 3);
    this.ctx.lineTo(0, leaf.size / 3);
    this.ctx.stroke();
  }

  /**
   * Draw a palm leaf
   */
  drawPalmLeaf(leaf) {
    this.ctx.fillStyle = `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, ${leaf.opacity})`;
    
    // Central stem
    this.ctx.beginPath();
    this.ctx.moveTo(0, -leaf.size / 2);
    this.ctx.lineTo(0, leaf.size / 2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = `rgba(${leaf.color.r - 20}, ${leaf.color.g - 20}, ${leaf.color.b - 20}, ${leaf.opacity})`;
    this.ctx.stroke();

    // Leaflets
    for (let i = 0; i < 7; i++) {
      const angle = (i / 6) * Math.PI - Math.PI / 2;
      const len = leaf.size / 2 * (0.5 + Math.abs(i - 3) / 4);
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(
        Math.cos(angle) * len * 0.5,
        Math.sin(angle) * len * 0.5,
        Math.cos(angle) * len,
        Math.sin(angle) * len
      );
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, ${leaf.opacity})`;
      this.ctx.stroke();
    }
  }

  /**
   * Draw fireflies
   */
  drawFireflies() {
    this.fireflies.forEach(firefly => {
      // Movement
      firefly.x += firefly.vx;
      firefly.y += firefly.vy;

      // Random direction changes
      if (Math.random() < 0.02) {
        firefly.vx = (Math.random() - 0.5) * 2;
        firefly.vy = (Math.random() - 0.5) * 2;
      }

      // Wrap around
      if (firefly.x < 0) firefly.x = this.canvas.width;
      if (firefly.x > this.canvas.width) firefly.x = 0;
      if (firefly.y < 0) firefly.y = this.canvas.height;
      if (firefly.y > this.canvas.height) firefly.y = 0;

      // Glow effect
      firefly.glowPhase += firefly.glowSpeed;
      const glow = Math.sin(firefly.glowPhase) * 0.5 + 0.5;
      const opacity = glow * 0.8 + 0.2;

      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        firefly.x, firefly.y, 0,
        firefly.x, firefly.y, firefly.size * 4
      );
      gradient.addColorStop(0, `rgba(${firefly.color}, ${opacity * 0.8})`);
      gradient.addColorStop(0.3, `rgba(${firefly.color}, ${opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(${firefly.color}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(firefly.x, firefly.y, firefly.size * 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Core
      this.ctx.fillStyle = `rgba(255, 255, 220, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  /**
   * Main animation loop
   */
  animate() {
    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cenote water background
    this.drawWaterPools();
    
    // Draw leaves (behind)
    this.drawLeaves();
    
    // Draw ripples
    this.drawRipples();
    
    // Draw fireflies (front)
    this.drawFireflies();

    requestAnimationFrame(() => this.animate());
  }
}
