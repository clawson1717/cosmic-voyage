/**
 * Planet Interaction Module
 * Handles planet clicks and info panel display
 */

export class PlanetInteraction {
  /**
   * @param {string} planetSelector - CSS selector for planet elements
   * @param {string} panelSelector - CSS selector for the info panel
   * @param {Object} options - Configuration options
   */
  constructor(planetSelector, panelSelector, options = {}) {
    this.planets = document.querySelectorAll(planetSelector);
    this.panel = document.querySelector(panelSelector);

    if (!this.planets.length) {
      console.warn('PlanetInteraction: No planet elements found');
      return;
    }

    this.config = {
      activeClass: options.activeClass || 'active',
      ...options,
    };

    // Planet data
    this.planetData = {
      mercury: {
        name: 'Mercury',
        distance: '57.9 million km from Sun',
        diameter: '4,879 km',
        day: '59 Earth days',
        year: '88 Earth days',
        moons: 0,
        temp: '-173°C to 427°C',
        description:
          'Mercury is the smallest planet and closest to the Sun. It has no atmosphere to retain heat, causing extreme temperature variations.',
      },
      venus: {
        name: 'Venus',
        distance: '108.2 million km from Sun',
        diameter: '12,104 km',
        day: '243 Earth days',
        year: '225 Earth days',
        moons: 0,
        temp: '462°C (surface)',
        description:
          'Venus is the hottest planet with a thick, toxic atmosphere that traps heat. It rotates backwards compared to most planets.',
      },
      earth: {
        name: 'Earth',
        distance: '149.6 million km from Sun',
        diameter: '12,742 km',
        day: '24 hours',
        year: '365.25 days',
        moons: 1,
        temp: '-88°C to 58°C',
        description:
          'Earth is the only known planet to support life. It has liquid water, a protective atmosphere, and a magnetic field.',
      },
      mars: {
        name: 'Mars',
        distance: '227.9 million km from Sun',
        diameter: '6,779 km',
        day: '24h 37m',
        year: '687 Earth days',
        moons: 2,
        temp: '-153°C to 20°C',
        description:
          'Mars, the Red Planet, has the largest volcano and canyon in the solar system. It may have once supported microbial life.',
      },
      jupiter: {
        name: 'Jupiter',
        distance: '778.5 million km from Sun',
        diameter: '139,820 km',
        day: '9h 56m',
        year: '11.86 Earth years',
        moons: 95,
        temp: '-110°C (cloud tops)',
        description:
          'Jupiter is the largest planet, a gas giant with the Great Red Spot—a storm larger than Earth that has raged for centuries.',
      },
      saturn: {
        name: 'Saturn',
        distance: '1.4 billion km from Sun',
        diameter: '116,460 km',
        day: '10h 42m',
        year: '29.45 Earth years',
        moons: 146,
        temp: '-140°C',
        description:
          "Saturn is famous for its spectacular ring system. It's less dense than water and would float if placed in a giant bathtub!",
      },
      uranus: {
        name: 'Uranus',
        distance: '2.9 billion km from Sun',
        diameter: '50,724 km',
        day: '17h 14m',
        year: '84 Earth years',
        moons: 27,
        temp: '-195°C',
        description:
          'Uranus rotates on its side, likely due to a massive collision. It has a faint ring system and appears blue-green from methane.',
      },
      neptune: {
        name: 'Neptune',
        distance: '4.5 billion km from Sun',
        diameter: '49,244 km',
        day: '16h 6m',
        year: '164.8 Earth years',
        moons: 14,
        temp: '-200°C',
        description:
          'Neptune has the strongest winds in the solar system, reaching 2,100 km/h. It was the first planet predicted by mathematics.',
      },
    };

    this.init();
  }

  /**
   * Initialize planet interactions
   */
  init() {
    this.planets.forEach(planet => {
      planet.addEventListener('click', e => {
        const planetKey = e.currentTarget.dataset.planet;
        this.showPlanetInfo(planetKey);
      });
    });

    // Close button
    const closeBtn = this.panel?.querySelector('.info-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closePanel());
    }
  }

  /**
   * Show planet information
   * @param {string} planetKey - The planet identifier
   */
  showPlanetInfo(planetKey) {
    const data = this.planetData[planetKey];
    if (!data || !this.panel) return;

    const nameEl = this.panel.querySelector('.info-name');
    const statsEl = this.panel.querySelector('.info-stats');

    if (nameEl) nameEl.textContent = data.name;
    if (statsEl) {
      statsEl.innerHTML = `
        <p><strong>📏 Diameter:</strong> ${data.diameter}</p>
        <p><strong>🌡️ Temperature:</strong> ${data.temp}</p>
        <p><strong>☀️ Distance from Sun:</strong> ${data.distance}</p>
        <p><strong>📅 Day Length:</strong> ${data.day}</p>
        <p><strong>🗓️ Year Length:</strong> ${data.year}</p>
        <p><strong>🌙 Moons:</strong> ${data.moons}</p>
        <p style="margin-top: 1rem; font-style: italic;">${data.description}</p>
      `;
    }

    this.panel.classList.add(this.config.activeClass);
    this.panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Close the info panel
   */
  closePanel() {
    this.panel?.classList.remove(this.config.activeClass);
  }
}
