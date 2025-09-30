/**
 * Terra Configuration File
 * 
 * Customize the visual appearance and behavior of your 3D globe
 * without modifying the main code. Import this in index.js.
 */

export const GLOBE_CONFIG = {
  // ==========================================
  // VISUAL FEATURES
  // ==========================================
  features: {
    showClouds: true,        // Cloud layer over Earth
    showCoastlines: true,    // Geographic coastlines
    showBorders: true,       // Country political borders
    showAtmosphere: true,    // Atmospheric glow effect
    showStarfield: true,     // Background stars
    showNightLights: true,   // City lights on dark side
  },

  // ==========================================
  // STARFIELD SETTINGS
  // ==========================================
  starfield: {
    numStars: 2000,          // Number of stars (reduce for performance)
    numStarsMobile: 500,     // Stars on mobile devices
    size: 0.2,               // Star point size
    colorHue: 0.6,           // Color hue (0-1)
    colorSaturation: 0.2,    // Color saturation (0-1)
  },

  // ==========================================
  // GLOBE APPEARANCE
  // ==========================================
  globe: {
    radius: 2,                    // Base radius of Earth
    cloudRadius: 2.01,            // Cloud layer radius (slightly larger)
    atmosphereRadius: 2.08,       // Atmosphere glow radius
    segments: 64,                 // Sphere geometry segments (lower = better performance)
    segmentsMobile: 32,           // Segments on mobile
    
    // Rotation
    axialTilt: 23.4,              // Earth's axial tilt in degrees
    baseRotationSpeed: 0.0005,    // Base rotation speed
    cloudRotationSpeed: 0.0003,   // Cloud rotation (independent)
    
    // Material properties
    cloudOpacity: 0.85,
    atmosphereColor: 0x66b3ff,    // Hex color
    atmosphereIntensity: 0.75,
    
    // Shader enhancements
    oceanTint: 0x1c4fb8,          // Ocean color tint
    oceanTintIntensity: 0.62,
    landTint: 0x5f9f6a,           // Land color tint
    landTintIntensity: 0.12,
    saturationStrength: 1.22,     // Color saturation boost
  },

  // ==========================================
  // LIGHTING
  // ==========================================
  lighting: {
    ambientColor: 0xffffff,
    ambientIntensity: 0.6,
    
    sunColor: 0xffffff,
    sunIntensity: 1.2,
    sunPosition: { x: 5, y: 3, z: 5 },
    
    rimLightColor: 0x66b3ff,
    rimLightIntensity: 0.5,
    rimLightPosition: { x: -5, y: 0, z: -5 },
  },

  // ==========================================
  // CAMERA & CONTROLS
  // ==========================================
  camera: {
    fov: 75,                      // Field of view
    near: 0.1,                    // Near clipping plane
    far: 1000,                    // Far clipping plane
    
    // Initial position
    startPosition: { x: 0, y: 0, z: 5 },
    startPositionMobile: { x: 0, y: 0, z: 7 },
    
    // Control limits
    minDistance: 3,
    maxDistance: 15,
    minDistanceMobile: 5,
    maxDistanceMobile: 20,
    
    // Control behavior
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    enablePan: false,
    autoRotate: false,
    autoRotateSpeed: 0.5,
  },

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  scrollAnimations: {
    // About section
    about: {
      cameraZ: 3.5,
      cameraX: 0,
      cameraY: 0,
      globeRotationY: Math.PI * 0.5,
      scrub: 1,
    },
    
    // Features section
    features: {
      cameraZ: 6,
      cameraX: 1,
      cameraY: 0,
      globeRotationY: Math.PI * 1.2,
      scrub: 1,
    },
    
    // Data section
    data: {
      cameraZ: 4,
      cameraX: 0,
      cameraY: 0.5,
      globeRotationY: Math.PI * 2,
      scrub: 1,
    },
    
    // Explore section
    explore: {
      cameraZ: 8,
      cameraX: 0,
      cameraY: 0,
      scrub: 1,
    },
    
    // Content fade-in timing
    fadeIn: {
      startTrigger: 'top 80%',
      endTrigger: 'top 50%',
      duration: 1,
      ease: 'power2.out',
    },
  },

  // ==========================================
  // RENDERING
  // ==========================================
  rendering: {
    antialias: true,
    alpha: true,
    pixelRatioMax: 2,             // Cap pixel ratio for performance
    toneMapping: 'ACESFilmic',    // 'ACESFilmic', 'Linear', 'Reinhard', 'Cineon'
    toneMappingExposure: 1.2,
  },

  // ==========================================
  // PERFORMANCE
  // ==========================================
  performance: {
    mobileBreakpoint: 768,        // px width for mobile detection
    textureQuality: 2048,         // Texture resolution (2048, 1024, 512)
    enableLOD: false,             // Level of Detail (future feature)
    frustumCulling: true,
  },

  // ==========================================
  // GEOJSON DATA SOURCES
  // ==========================================
  geoData: {
    coastlines: './geojson/ne_110m_coastline.json',
    countries: './geojson/countries.json',
    
    // Material options for overlays
    coastlineMaterial: {
      color: 0x9ec6ff,
      linewidth: 1,
      opacity: 0.5,
    },
    
    borderMaterial: {
      color: 0x1a73e8,
      linewidth: 1.5,
      opacity: 0.8,
    },
  },

  // ==========================================
  // TEXTURE URLS (CDN Fallbacks)
  // ==========================================
  textures: {
    earth: [
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_atmos_2048.jpg',
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    ],
    normal: [
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_normal_2048.jpg',
      'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    ],
    specular: [
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_specular_2048.jpg',
      'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
    ],
    clouds: [
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/cloud_combined_2048.jpg',
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/clouds_2048.png',
      'https://threejs.org/examples/textures/planets/clouds_2048.png',
    ],
    nightLights: [
      'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_lights_2048.png',
      'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
    ],
  },

  // ==========================================
  // UI THEME
  // ==========================================
  theme: {
    colors: {
      background: '#000000',
      backgroundSecondary: '#0a0a0f',
      primary: '#66b3ff',
      accent: '#9d84ff',
      text: '#e8e8f0',
      textDim: '#8a8a9e',
    },
    
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      secondary: "'Inter', sans-serif",
    },
  },

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  loading: {
    showLoadingScreen: true,
    minimumLoadTime: 500,         // ms - minimum time to show loader
    fadeOutDuration: 800,         // ms - fade out animation duration
  },
};

// ==========================================
// PRESET CONFIGURATIONS
// ==========================================

export const PRESETS = {
  // High quality for desktop
  QUALITY_HIGH: {
    starfield: { numStars: 3000 },
    globe: { segments: 128 },
    rendering: { antialias: true, pixelRatioMax: 2 },
  },

  // Balanced for most devices
  QUALITY_MEDIUM: {
    starfield: { numStars: 2000 },
    globe: { segments: 64 },
    rendering: { antialias: true, pixelRatioMax: 2 },
  },

  // Performance mode for low-end devices
  QUALITY_LOW: {
    starfield: { numStars: 500 },
    globe: { segments: 32 },
    rendering: { antialias: false, pixelRatioMax: 1 },
    features: { showClouds: false },
  },

  // Cinematic mode (auto-rotate, slower animations)
  CINEMATIC: {
    camera: { autoRotate: true, autoRotateSpeed: 0.3 },
    globe: { baseRotationSpeed: 0 },
    scrollAnimations: {
      about: { scrub: 2 },
      features: { scrub: 2 },
      data: { scrub: 2 },
      explore: { scrub: 2 },
    },
  },

  // Minimal UI (good for embedding)
  MINIMAL: {
    features: {
      showBorders: false,
      showCoastlines: false,
    },
    starfield: { numStars: 1000 },
  },
};

/**
 * Apply a preset configuration
 * @param {string} presetName - Name of preset from PRESETS
 * @returns {object} Merged configuration
 */
export function applyPreset(presetName) {
  const preset = PRESETS[presetName];
  if (!preset) {
    console.warn(`Preset "${presetName}" not found`);
    return GLOBE_CONFIG;
  }
  
  return deepMerge(GLOBE_CONFIG, preset);
}

/**
 * Deep merge utility
 */
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default GLOBE_CONFIG;
