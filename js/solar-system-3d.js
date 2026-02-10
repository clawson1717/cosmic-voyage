/**
 * SolarSystem3D - Interactive 3D Solar System Visualization
 * A Three.js powered module for Cosmic Voyage
 */

class SolarSystem3D {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        // Configuration
        this.config = {
            cameraDistance: options.cameraDistance || 250,
            orbitSpeed: options.orbitSpeed || 0.5,
            planetScale: options.planetScale || 1,
            showOrbits: options.showOrbits !== false,
            showLabels: options.showLabels !== false,
            autoRotate: options.autoRotate !== false,
            autoRotateSpeed: options.autoRotateSpeed || 0.1,
            ...options
        };

        // Scene setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Objects
        this.sun = null;
        this.planets = [];
        this.asteroidBelt = null;
        this.orbitLines = [];
        this.stars = null;
        
        // State
        this.selectedPlanet = null;
        this.isPaused = false;
        this.time = 0;
        this.animationId = null;
        
        // Planet data with realistic proportions (scaled for visualization)
        this.planetData = [
            {
                name: 'Mercury',
                radius: 1.5,
                distance: 35,
                speed: 4.1,
                color: 0x8C8C8C,
                emissive: 0x2a2a2a,
                textureType: 'rocky',
                description: 'The smallest planet, closest to the Sun',
                details: {
                    diameter: '4,879 km',
                    day: '59 Earth days',
                    year: '88 Earth days',
                    moons: 0,
                    temp: '167°C avg',
                    gravity: '3.7 m/s²'
                }
            },
            {
                name: 'Venus',
                radius: 2.8,
                distance: 50,
                speed: 1.6,
                color: 0xE6E6B8,
                emissive: 0x4a4a2a,
                textureType: 'cloudy',
                description: 'Hottest planet with thick toxic atmosphere',
                details: {
                    diameter: '12,104 km',
                    day: '243 Earth days',
                    year: '225 Earth days',
                    moons: 0,
                    temp: '464°C',
                    gravity: '8.87 m/s²'
                }
            },
            {
                name: 'Earth',
                radius: 3,
                distance: 70,
                speed: 1,
                color: 0x2233AA,
                emissive: 0x001133,
                textureType: 'earth',
                hasMoon: true,
                description: 'Our home, the only known planet with life',
                details: {
                    diameter: '12,742 km',
                    day: '24 hours',
                    year: '365.25 days',
                    moons: 1,
                    temp: '15°C avg',
                    gravity: '9.8 m/s²'
                }
            },
            {
                name: 'Mars',
                radius: 2.2,
                distance: 95,
                speed: 0.53,
                color: 0xC1440E,
                emissive: 0x3a1005,
                textureType: 'rocky',
                description: 'The Red Planet, target for human exploration',
                details: {
                    diameter: '6,779 km',
                    day: '24h 37m',
                    year: '687 Earth days',
                    moons: 2,
                    temp: '-65°C avg',
                    gravity: '3.71 m/s²'
                }
            },
            {
                name: 'Jupiter',
                radius: 10,
                distance: 140,
                speed: 0.08,
                color: 0xD4A574,
                emissive: 0x2a2010,
                textureType: 'gas',
                description: 'Largest planet, gas giant with Great Red Spot',
                details: {
                    diameter: '139,820 km',
                    day: '9h 56m',
                    year: '12 Earth years',
                    moons: 95,
                    temp: '-110°C',
                    gravity: '24.79 m/s²'
                }
            },
            {
                name: 'Saturn',
                radius: 8.5,
                distance: 190,
                speed: 0.03,
                color: 0xFAD5A5,
                emissive: 0x2a2520,
                textureType: 'gas',
                hasRings: true,
                description: 'Ringed beauty, less dense than water',
                details: {
                    diameter: '116,460 km',
                    day: '10h 42m',
                    year: '29 Earth years',
                    moons: 146,
                    temp: '-140°C',
                    gravity: '10.44 m/s²'
                }
            },
            {
                name: 'Uranus',
                radius: 5.5,
                distance: 240,
                speed: 0.01,
                color: 0x7DE3F4,
                emissive: 0x0a2a30,
                textureType: 'ice',
                description: 'Ice giant that rotates on its side',
                details: {
                    diameter: '50,724 km',
                    day: '17h 14m',
                    year: '84 Earth years',
                    moons: 27,
                    temp: '-195°C',
                    gravity: '8.69 m/s²'
                }
            },
            {
                name: 'Neptune',
                radius: 5.3,
                distance: 290,
                speed: 0.006,
                color: 0x5B7CFF,
                emissive: 0x0a1530,
                textureType: 'ice',
                description: 'Windiest planet, deep blue ice giant',
                details: {
                    diameter: '49,244 km',
                    day: '16h 6m',
                    year: '165 Earth years',
                    moons: 14,
                    temp: '-200°C',
                    gravity: '11.15 m/s²'
                }
            }
        ];

        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createStarfield();
        this.createSun();
        this.createPlanets();
        this.createAsteroidBelt();
        this.createControls();
        this.createUI();
        this.addEventListeners();
        this.animate();
        
        console.log('🌌 Solar System 3D initialized');
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050508, 0.0005);
    }

    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
        this.camera.position.set(0, 80, this.config.cameraDistance);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
    }

    createLights() {
        // Ambient light for base visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Sun light (point light at center)
        this.sunLight = new THREE.PointLight(0xffffff, 2, 600);
        this.sunLight.position.set(0, 0, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.scene.add(this.sunLight);

        // Add subtle colored lights for atmosphere
        const purpleLight = new THREE.PointLight(0x9d4edd, 0.5, 200);
        purpleLight.position.set(100, 50, 100);
        this.scene.add(purpleLight);

        const cyanLight = new THREE.PointLight(0x00d4ff, 0.5, 200);
        cyanLight.position.set(-100, -50, -100);
        this.scene.add(cyanLight);
    }

    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const colorPalette = [
            new THREE.Color(0xffffff),
            new THREE.Color(0x87ceeb),
            new THREE.Color(0xffd700),
            new THREE.Color(0xff6b6b),
            new THREE.Color(0x9d4edd)
        ];

        for (let i = 0; i < starCount; i++) {
            // Random position in sphere
            const radius = 800 + Math.random() * 400;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random size
            sizes[i] = Math.random() * 2 + 0.5;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for twinkling stars
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    float twinkle = 0.8 + 0.2 * sin(time * 3.0 + position.x * 0.1);
                    gl_PointSize = size * pixelRatio * twinkle * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createSun() {
        const sunGroup = new THREE.Group();

        // Main sun sphere
        const sunGeometry = new THREE.SphereGeometry(15, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xff4500,
            emissiveIntensity: 0.5
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sunGroup.add(this.sun);

        // Inner glow
        const innerGlowGeometry = new THREE.SphereGeometry(18, 32, 32);
        const innerGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff8800) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    vec3 pos = position + normal * sin(time * 2.0 + position.y * 0.5) * 0.3;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, intensity * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.sunInnerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        sunGroup.add(this.sunInnerGlow);

        // Outer glow layers
        for (let i = 0; i < 3; i++) {
            const glowGeometry = new THREE.SphereGeometry(20 + i * 8, 32, 32);
            const glowMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(i === 0 ? 0xff6600 : i === 1 ? 0xff4400 : 0xff2200) },
                    intensity: { value: 0.3 - i * 0.08 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform float intensity;
                    varying vec3 vNormal;
                    void main() {
                        float glow = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
                        gl_FragColor = vec4(color, glow * intensity);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                depthWrite: false
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            sunGroup.add(glow);
        }

        // Corona particles
        const coronaGeometry = new THREE.BufferGeometry();
        const coronaCount = 1000;
        const coronaPositions = new Float32Array(coronaCount * 3);
        
        for (let i = 0; i < coronaCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 25 + Math.random() * 30;
            const height = (Math.random() - 0.5) * 10;
            
            coronaPositions[i * 3] = Math.cos(angle) * radius;
            coronaPositions[i * 3 + 1] = height;
            coronaPositions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        
        coronaGeometry.setAttribute('position', new THREE.BufferAttribute(coronaPositions, 3));
        
        const coronaMaterial = new THREE.PointsMaterial({
            color: 0xffaa44,
            size: 2,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.corona = new THREE.Points(coronaGeometry, coronaMaterial);
        sunGroup.add(this.corona);

        this.scene.add(sunGroup);
        this.sunGroup = sunGroup;
    }

    createPlanets() {
        this.planetData.forEach((data, index) => {
            const planetGroup = new THREE.Group();
            
            // Create orbit line
            if (this.config.showOrbits) {
                const orbitGeometry = new THREE.RingGeometry(data.distance - 0.5, data.distance + 0.5, 128);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.08,
                    side: THREE.DoubleSide
                });
                const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbitLine.rotation.x = Math.PI / 2;
                this.scene.add(orbitLine);
                this.orbitLines.push(orbitLine);
            }

            // Create planet mesh with appropriate material
            const geometry = new THREE.SphereGeometry(data.radius * this.config.planetScale, 32, 32);
            let material;

            switch (data.textureType) {
                case 'gas':
                    material = new THREE.MeshStandardMaterial({
                        color: data.color,
                        emissive: data.emissive,
                        emissiveIntensity: 0.1,
                        roughness: 0.6,
                        metalness: 0.2
                    });
                    break;
                case 'earth':
                    material = new THREE.MeshStandardMaterial({
                        color: data.color,
                        emissive: 0x112244,
                        emissiveIntensity: 0.1,
                        roughness: 0.4,
                        metalness: 0.1
                    });
                    break;
                case 'ice':
                    material = new THREE.MeshStandardMaterial({
                        color: data.color,
                        emissive: data.emissive,
                        emissiveIntensity: 0.15,
                        roughness: 0.2,
                        metalness: 0.3
                    });
                    break;
                default: // rocky
                    material = new THREE.MeshStandardMaterial({
                        color: data.color,
                        emissive: data.emissive,
                        emissiveIntensity: 0.05,
                        roughness: 0.9,
                        metalness: 0.1
                    });
            }

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = { ...data, type: 'planet' };

            // Add atmosphere glow for some planets
            if (['Earth', 'Venus', 'Neptune'].includes(data.name)) {
                const atmoGeometry = new THREE.SphereGeometry(data.radius * 1.2, 32, 32);
                const atmoMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        color: { value: new THREE.Color(data.color) }
                    },
                    vertexShader: `
                        varying vec3 vNormal;
                        void main() {
                            vNormal = normalize(normalMatrix * normal);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 color;
                        varying vec3 vNormal;
                        void main() {
                            float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                            gl_FragColor = vec4(color, intensity * 0.3);
                        }
                    `,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide
                });
                const atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
                mesh.add(atmosphere);
            }

            // Add rings to Saturn
            if (data.hasRings) {
                const ringGroup = new THREE.Group();
                
                // Multiple ring bands for realism
                const ringColors = [0xC4A35A, 0xB8934F, 0x8B7355, 0xC4A35A];
                const ringInnerRadii = [data.radius * 1.4, data.radius * 1.8, data.radius * 2.2, data.radius * 2.6];
                const ringOuterRadii = [data.radius * 1.7, data.radius * 2.1, data.radius * 2.5, data.radius * 3.0];
                
                for (let i = 0; i < 4; i++) {
                    const ringGeometry = new THREE.RingGeometry(
                        ringInnerRadii[i], 
                        ringOuterRadii[i], 
                        64
                    );
                    
                    // Create ring texture with gaps
                    const canvas = document.createElement('canvas');
                    canvas.width = 256;
                    canvas.height = 1;
                    const ctx = canvas.getContext('2d');
                    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
                    gradient.addColorStop(0, `rgba(${(ringColors[i] >> 16) & 255}, ${(ringColors[i] >> 8) & 255}, ${ringColors[i] & 255}, 0)`);
                    gradient.addColorStop(0.2, `rgba(${(ringColors[i] >> 16) & 255}, ${(ringColors[i] >> 8) & 255}, ${ringColors[i] & 255}, 0.8)`);
                    gradient.addColorStop(0.5, `rgba(${(ringColors[i] >> 16) & 255}, ${(ringColors[i] >> 8) & 255}, ${ringColors[i] & 255}, 0.4)`);
                    gradient.addColorStop(0.8, `rgba(${(ringColors[i] >> 16) & 255}, ${(ringColors[i] >> 8) & 255}, ${ringColors[i] & 255}, 0.9)`);
                    gradient.addColorStop(1, `rgba(${(ringColors[i] >> 16) & 255}, ${(ringColors[i] >> 8) & 255}, ${ringColors[i] & 255}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, 256, 1);
                    
                    const ringTexture = new THREE.CanvasTexture(canvas);
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        map: ringTexture,
                        transparent: true,
                        opacity: 0.9,
                        side: THREE.DoubleSide
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2;
                    ringGroup.add(ring);
                }
                
                mesh.add(ringGroup);
                this.saturnRings = ringGroup;
            }

            // Add moon to Earth
            if (data.hasMoon) {
                const moonGeometry = new THREE.SphereGeometry(data.radius * 0.27, 16, 16);
                const moonMaterial = new THREE.MeshStandardMaterial({
                    color: 0xC0C0C0,
                    roughness: 0.9
                });
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                moon.userData = { 
                    type: 'moon', 
                    parent: data.name,
                    orbitRadius: data.radius * 4,
                    orbitSpeed: 5
                };
                mesh.add(moon);
                this.moon = moon;
            }

            planetGroup.add(mesh);
            planetGroup.userData = {
                distance: data.distance,
                speed: data.speed * this.config.orbitSpeed * 0.01,
                angle: Math.random() * Math.PI * 2,
                planet: mesh
            };

            this.scene.add(planetGroup);
            this.planets.push(planetGroup);
        });
    }

    createAsteroidBelt() {
        const asteroidCount = 300;
        const asteroidGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(asteroidCount * 3);
        const sizes = new Float32Array(asteroidCount);

        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 115 + Math.random() * 20; // Between Mars and Jupiter
            const height = (Math.random() - 0.5) * 4;

            positions[i * 3] = Math.cos(angle) * distance;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * distance;
            sizes[i] = Math.random() * 0.8 + 0.2;
        }

        asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        asteroidGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const asteroidMaterial = new THREE.PointsMaterial({
            color: 0x8B7355,
            size: 0.8,
            transparent: true,
            opacity: 0.7
        });

        this.asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
        this.asteroidBelt.userData = { speed: 0.001 };
        this.scene.add(this.asteroidBelt);
    }

    createControls() {
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 30;
            this.controls.maxDistance = 600;
            this.controls.autoRotate = this.config.autoRotate;
            this.controls.autoRotateSpeed = this.config.autoRotateSpeed;
        }
    }

    createUI() {
        // Create info panel overlay
        const infoPanel = document.createElement('div');
        infoPanel.className = 'planet-info-overlay';
        infoPanel.innerHTML = `
            <div class="info-panel-content">
                <button class="close-panel">&times;</button>
                <h3 class="planet-name">Explore the Solar System</h3>
                <p class="planet-description">Click on any planet to learn more</p>
                <div class="planet-stats"></div>
            </div>
        `;
        this.container.appendChild(infoPanel);
        this.infoPanel = infoPanel;

        // Create controls overlay
        const controls = document.createElement('div');
        controls.className = 'solar-controls';
        controls.innerHTML = `
            <button class="control-btn" id="toggle-rotation" title="Toggle Rotation">
                <svg viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
            </button>
            <button class="control-btn" id="toggle-orbits" title="Toggle Orbits">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </button>
            <button class="control-btn" id="reset-view" title="Reset View">
                <svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            </button>
            <button class="control-btn" id="zoom-sun" title="Focus on Sun">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
        `;
        this.container.appendChild(controls);
        this.controlsPanel = controls;

        // Add loading indicator
        const loader = document.createElement('div');
        loader.className = 'solar-loader';
        loader.innerHTML = '<div class="loader-spinner"></div><span>Loading Solar System...</span>';
        this.container.appendChild(loader);
        this.loader = loader;

        // Hide loader after a brief delay
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }

    addEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Mouse events for planet selection
        this.renderer.domElement.addEventListener('click', (e) => this.onMouseClick(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // UI controls
        this.infoPanel.querySelector('.close-panel').addEventListener('click', () => {
            this.closeInfoPanel();
        });

        this.controlsPanel.querySelector('#toggle-rotation').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            if (this.controls) {
                this.controls.autoRotate = !this.isPaused && this.config.autoRotate;
            }
        });

        this.controlsPanel.querySelector('#toggle-orbits').addEventListener('click', () => {
            this.orbitLines.forEach(line => {
                line.visible = !line.visible;
            });
        });

        this.controlsPanel.querySelector('#reset-view').addEventListener('click', () => {
            this.resetView();
        });

        this.controlsPanel.querySelector('#zoom-sun').addEventListener('click', () => {
            this.focusOnObject(this.sun);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeInfoPanel();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.isPaused = !this.isPaused;
            }
        });
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onMouseClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check planet intersections
        const planetMeshes = this.planets.map(p => p.userData.planet);
        const intersects = this.raycaster.intersectObjects(planetMeshes);

        if (intersects.length > 0) {
            const planet = intersects[0].object;
            this.selectPlanet(planet);
        } else {
            this.closeInfoPanel();
        }
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const planetMeshes = this.planets.map(p => p.userData.planet);
        const intersects = this.raycaster.intersectObjects(planetMeshes);

        this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }

    selectPlanet(planet) {
        this.selectedPlanet = planet;
        const data = planet.userData;

        // Focus camera on planet
        this.focusOnObject(planet);

        // Update info panel
        this.showInfoPanel(data);

        // Highlight effect
        this.planets.forEach(p => {
            const mesh = p.userData.planet;
            if (mesh === planet) {
                mesh.material.emissiveIntensity = 0.3;
            } else {
                mesh.material.emissiveIntensity = mesh.userData.emissive ? 0.1 : 0.05;
            }
        });
    }

    focusOnObject(object) {
        const targetPosition = new THREE.Vector3();
        object.getWorldPosition(targetPosition);

        const offset = new THREE.Vector3(30, 20, 30);
        const endPosition = targetPosition.clone().add(offset);

        // Smooth camera animation
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls ? this.controls.target.clone() : new THREE.Vector3();
        const duration = 1500;
        const startTime = Date.now();

        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(startPosition, endPosition, easeProgress);
            if (this.controls) {
                this.controls.target.lerpVectors(startTarget, targetPosition, easeProgress);
            }

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
    }

    resetView() {
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls ? this.controls.target.clone() : new THREE.Vector3();
        const endPosition = new THREE.Vector3(0, 80, this.config.cameraDistance);
        const endTarget = new THREE.Vector3(0, 0, 0);
        const duration = 1500;
        const startTime = Date.now();

        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(startPosition, endPosition, easeProgress);
            if (this.controls) {
                this.controls.target.lerpVectors(startTarget, endTarget, easeProgress);
            }

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
        this.closeInfoPanel();
    }

    showInfoPanel(data) {
        const panel = this.infoPanel;
        const nameEl = panel.querySelector('.planet-name');
        const descEl = panel.querySelector('.planet-description');
        const statsEl = panel.querySelector('.planet-stats');

        nameEl.textContent = data.name;
        descEl.textContent = data.description;

        statsEl.innerHTML = `
            <div class="stat-grid">
                <div class="stat-item">
                    <span class="stat-label">Diameter</span>
                    <span class="stat-value">${data.details.diameter}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Day Length</span>
                    <span class="stat-value">${data.details.day}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Year Length</span>
                    <span class="stat-value">${data.details.year}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Moons</span>
                    <span class="stat-value">${data.details.moons}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Temperature</span>
                    <span class="stat-value">${data.details.temp}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Gravity</span>
                    <span class="stat-value">${data.details.gravity}</span>
                </div>
            </div>
        `;

        panel.classList.add('active');
    }

    closeInfoPanel() {
        this.infoPanel.classList.remove('active');
        this.selectedPlanet = null;

        // Reset planet highlighting
        this.planets.forEach(p => {
            const mesh = p.userData.planet;
            mesh.material.emissiveIntensity = mesh.userData.emissive ? 0.1 : 0.05;
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time += 0.01;

        // Update star twinkling
        if (this.stars) {
            this.stars.material.uniforms.time.value = this.time;
        }

        // Animate sun
        if (this.sunInnerGlow) {
            this.sunInnerGlow.material.uniforms.time.value = this.time;
        }
        if (this.corona) {
            this.corona.rotation.y = this.time * 0.05;
        }

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Animate planets
        if (!this.isPaused) {
            this.planets.forEach((planetGroup, index) => {
                const data = planetGroup.userData;
                
                // Orbit rotation
                data.angle += data.speed;
                planetGroup.position.x = Math.cos(data.angle) * data.distance;
                planetGroup.position.z = Math.sin(data.angle) * data.distance;

                // Planet self-rotation
                data.planet.rotation.y += 0.01 + index * 0.002;

                // Animate moon
                if (this.moon && data.planet.userData.hasMoon) {
                    const moonData = this.moon.userData;
                    const moonAngle = this.time * moonData.orbitSpeed;
                    this.moon.position.x = Math.cos(moonAngle) * moonData.orbitRadius;
                    this.moon.position.z = Math.sin(moonAngle) * moonData.orbitRadius;
                }

                // Animate Saturn's rings
                if (this.saturnRings && data.planet.userData.hasRings) {
                    this.saturnRings.rotation.z = this.time * 0.1;
                }
            });

            // Animate asteroid belt
            if (this.asteroidBelt) {
                this.asteroidBelt.rotation.y += this.asteroidBelt.userData.speed;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.controls) {
            this.controls.dispose();
        }

        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
        
        if (this.infoPanel) {
            this.container.removeChild(this.infoPanel);
        }
        
        if (this.controlsPanel) {
            this.container.removeChild(this.controlsPanel);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarSystem3D;
}
