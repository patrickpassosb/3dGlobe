# Terra Customization Guide

Complete guide to customizing and extending your Terra interactive globe experience.

---

## Table of Contents

1. [Quick Customization](#quick-customization)
2. [Visual Appearance](#visual-appearance)
3. [Scroll Animations](#scroll-animations)
4. [Performance Optimization](#performance-optimization)
5. [Adding Custom Content](#adding-custom-content)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

---

## Quick Customization

### Using the Config File

The easiest way to customize Terra is through `config.js`:

```javascript
// In index.js, import and use config
import { GLOBE_CONFIG, applyPreset } from './config.js';

// Use default config
const config = GLOBE_CONFIG;

// Or apply a preset
const config = applyPreset('QUALITY_HIGH');
```

### Quick Toggles

Enable/disable features instantly:

```javascript
const SHOW_CLOUDS = true;       // Cloud layer
const SHOW_COASTLINES = true;   // Geographic coastlines
const SHOW_BORDERS = true;      // Country borders
```

---

## Visual Appearance

### 1. Color Scheme

#### CSS Variables (index.html)

```css
:root {
  --color-bg: #000000;           /* Background */
  --color-primary: #66b3ff;      /* Primary accent (blue) */
  --color-accent: #9d84ff;       /* Secondary accent (purple) */
  --color-text: #e8e8f0;         /* Main text */
  --color-text-dim: #8a8a9e;     /* Dimmed text */
}
```

**Example: Dark Purple Theme**
```css
:root {
  --color-bg: #0a0014;
  --color-primary: #a855f7;      /* Purple */
  --color-accent: #ec4899;       /* Pink */
  --color-text: #f3e8ff;
  --color-text-dim: #c4b5fd;
}
```

#### Three.js Scene Colors (index.js)

```javascript
// Atmosphere color
const atmosphereMat = new THREE.ShaderMaterial({
  uniforms: { 
    color: { value: new THREE.Color(0x66b3ff) },  // Change this
    intensity: { value: 0.75 } 
  },
  // ...
});

// Starfield colors
// Edit in src/getStarfield.js
col = new THREE.Color().setHSL(
  hue,      // 0-1 (0=red, 0.33=green, 0.66=blue)
  0.2,      // saturation
  Math.random() // brightness
);
```

### 2. Lighting

#### Adjust Light Intensity

```javascript
// Ambient light (overall scene brightness)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increase to 1.0 for brighter

// Sun light (main directional light)
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2); // Reduce to 0.8 for dimmer

// Rim light (accent from behind)
const rimLight = new THREE.DirectionalLight(0x66b3ff, 0.5); // Change color/intensity
```

#### Change Light Positions

```javascript
sunLight.position.set(5, 3, 5);    // x, y, z coordinates
rimLight.position.set(-5, 0, -5);  // Opposite side for rim effect
```

**Dramatic Lighting Example:**
```javascript
const ambientLight = new THREE.AmbientLight(0x1a1a3e, 0.3); // Very dim, bluish ambient
const sunLight = new THREE.DirectionalLight(0xfff5e1, 2.0); // Bright warm sun
sunLight.position.set(10, 5, 8); // Strong side lighting
```

### 3. Globe Materials

#### Earth Material Properties

```javascript
earthMat = new THREE.MeshPhongMaterial({
  map: earthMap,
  normalMap: normalMap,
  specularMap: specMap,
  specular: new THREE.Color(0x333333),  // Ocean shine color
  shininess: 18,                         // Shine intensity (0-100)
  emissiveIntensity: 0.0,               // Night lights brightness (0-1)
  bumpScale: 0.15,                      // Terrain height effect
});
```

**Example: More Dramatic Ocean Reflections**
```javascript
specular: new THREE.Color(0x88ccff),  // Brighter blue
shininess: 35,                         // More shine
```

#### Cloud Opacity

```javascript
const cloudsMat = new THREE.MeshPhongMaterial({
  map: cloudMap,
  transparent: true,
  depthWrite: false,
  opacity: 0.85,  // Reduce to 0.5 for subtle, increase to 1.0 for opaque
});
```

### 4. Starfield Customization

Edit `src/getStarfield.js`:

```javascript
export default function getStarfield({ numStars = 500, sprite } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25; // Distance range: 25-50 units
    // ...
  }
  
  const mat = new THREE.PointsMaterial({
    size: 0.2,              // Star size (try 0.1 for smaller, 0.5 for larger)
    vertexColors: true,
    fog: false,
  });
}
```

**Multi-colored Starfield:**
```javascript
// Change this line in getStarfield.js
col = new THREE.Color().setHSL(
  Math.random(),  // Random colors instead of fixed hue
  0.8,            // Higher saturation
  Math.random() * 0.5 + 0.5  // Brightness range 0.5-1.0
);
```

---

## Scroll Animations

### Understanding ScrollTrigger

Each section has a scroll trigger configuration:

```javascript
gsap.to(camera.position, {
  z: 3.5,                    // Target value
  scrollTrigger: {
    trigger: '#about',       // Element that triggers animation
    start: 'top bottom',     // When animation starts
    end: 'top center',       // When animation ends
    scrub: 1,                // Smoothness (0=instant, 3=very smooth)
  }
});
```

### Trigger Points Explained

```
Trigger Positions:
┌─────────────────┐
│                 │ ← 'top top'     (section top hits viewport top)
│                 │
│   VIEWPORT      │ ← 'top center'  (section top hits viewport center)
│                 │
│                 │ ← 'top bottom'  (section top hits viewport bottom)
└─────────────────┘

Common Patterns:
- start: 'top bottom'  → Animation begins when section enters view
- end: 'top center'    → Animation completes when section is centered
- scrub: 1            → Tied to scroll position (higher = smoother)
```

### Custom Scroll Animations

#### Example: Dramatic Zoom

```javascript
// Hero to About: Fast zoom-in
gsap.to(camera.position, {
  z: 2,  // Very close
  scrollTrigger: {
    trigger: '#about',
    start: 'top bottom',
    end: 'top top',      // Faster transition
    scrub: 0.5,          // Snappier
  }
});
```

#### Example: Orbit Camera Around Globe

```javascript
// Circle around the globe
gsap.to(camera.position, {
  x: 5,
  z: 0,
  scrollTrigger: {
    trigger: '#features',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  }
});

// Make camera look at globe
gsap.to(camera, {
  onUpdate: () => camera.lookAt(0, 0, 0),
  scrollTrigger: {
    trigger: '#features',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  }
});
```

#### Example: Globe Tilt Animation

```javascript
// Tilt the globe forward
gsap.to(earthGroup.rotation, {
  x: Math.PI * 0.3,  // Tilt forward
  scrollTrigger: {
    trigger: '#data',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
  }
});
```

### Content Fade-In Patterns

Current pattern:

```javascript
gsap.utils.toArray('.fade-in').forEach((elem) => {
  gsap.fromTo(elem, 
    { opacity: 0, y: 50 },        // From state
    {
      opacity: 1, y: 0,           // To state
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elem,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});
```

**Custom: Scale + Fade**
```javascript
gsap.fromTo(elem,
  { opacity: 0, scale: 0.8 },
  {
    opacity: 1, scale: 1,
    duration: 1.2,
    ease: 'back.out(1.4)',  // Bounce effect
    scrollTrigger: { trigger: elem, start: 'top 80%' }
  }
);
```

---

## Performance Optimization

### Mobile Detection & Optimization

```javascript
const isMobile = window.innerWidth < 768;

if (isMobile) {
  // Reduce quality
  const stars = getStarfield({ numStars: 500 });
  
  // Lower geometry detail
  const earthGeo = new THREE.SphereGeometry(2, 32, 32); // Instead of 64
  
  // Pull camera back
  camera.position.z = 7;
  
  // Disable expensive features
  const SHOW_CLOUDS = false;
}
```

### Texture Optimization

#### Progressive Loading

```javascript
// Load low-res first, then high-res
async function progressiveLoad() {
  const lowRes = await loadTexture('earth_512.jpg');
  earthMat.map = lowRes;
  earthMat.needsUpdate = true;
  
  const highRes = await loadTexture('earth_2048.jpg');
  earthMat.map = highRes;
  earthMat.needsUpdate = true;
}
```

#### Texture Compression

```javascript
// Use compressed formats when available
loader.load('earth.basis', (texture) => {
  // .basis files are much smaller
});
```

### Rendering Optimizations

```javascript
// Cap pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Reduce shadow map size (if using shadows)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.width = 1024;
renderer.shadowMap.height = 1024;

// Enable frustum culling (default, but explicit)
earthMesh.frustumCulled = true;
```

### Animation Performance

```javascript
// Throttle animations on slow devices
let lastTime = 0;
const targetFPS = 30; // Lower for mobile
const frameTime = 1000 / targetFPS;

function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = currentTime - lastTime;
  if (deltaTime < frameTime) return;
  
  lastTime = currentTime - (deltaTime % frameTime);
  
  // Your animation code...
  renderer.render(scene, camera);
}
```

---

## Adding Custom Content

### 1. New Sections

#### Add HTML Section

```html
<!-- In index.html, after #explore -->
<section id="custom-section">
  <div class="content fade-in">
    <h2 class="section-title">Custom Title</h2>
    <p class="section-text">Your content here...</p>
  </div>
</section>
```

#### Add Scroll Animation

```javascript
// In index.js, in initScrollAnimations()
gsap.to(camera.position, {
  z: 10,
  x: 2,
  scrollTrigger: {
    trigger: '#custom-section',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
  }
});
```

### 2. Interactive Hotspots

Add clickable markers on the globe:

```javascript
// Create hotspot marker
function createHotspot(lat, lon, name) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -2 * Math.sin(phi) * Math.cos(theta);
  const z = 2 * Math.sin(phi) * Math.sin(theta);
  const y = 2 * Math.cos(phi);
  
  const markerGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  marker.position.set(x, y, z);
  marker.userData = { name, lat, lon };
  
  earthGroup.add(marker);
  return marker;
}

// Add hotspots
const paris = createHotspot(48.8566, 2.3522, 'Paris');
const tokyo = createHotspot(35.6762, 139.6503, 'Tokyo');

// Raycasting for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(earthGroup.children);
  
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (obj.userData.name) {
      alert(`You clicked: ${obj.userData.name}`);
    }
  }
});
```

### 3. Data Overlays

Visualize custom data:

```javascript
// Load GeoJSON and add custom styling
fetch('./geojson/custom-data.json')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const value = feature.properties.dataValue;
      const color = valueToColor(value); // Custom color function
      
      const overlay = drawThreeGeo({
        json: { type: 'FeatureCollection', features: [feature] },
        radius: 2.01,
        materialOptions: { color, linewidth: 2, opacity: 0.8 },
      });
      
      earthGroup.add(overlay);
    });
  });

function valueToColor(value) {
  // Map data value to color (e.g., 0-100 → blue to red)
  const hue = (1 - value / 100) * 240; // 240=blue, 0=red
  return new THREE.Color().setHSL(hue / 360, 1, 0.5).getHex();
}
```

---

## Advanced Features

### 1. Post-Processing Effects

Add bloom, vignette, etc.:

```javascript
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// In animate() loop:
composer.render();  // Instead of renderer.render()
```

### 2. Particle Effects

Add animated particles:

```javascript
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0x66b3ff,
  size: 0.1,
  transparent: true,
  opacity: 0.6,
});

const particleSystem = new THREE.Points(particles, particleMat);
scene.add(particleSystem);

// Animate particles
function animate() {
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.01; // Move up
    if (positions[i + 1] > 5) positions[i + 1] = -5; // Reset
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
}
```

### 3. Sound Integration

Add ambient audio:

```javascript
// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;
let sourceNode;

// Load audio file
fetch('./audio/ambient-space.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(decodedAudio => {
    audioBuffer = decodedAudio;
  });

// Play on user interaction
document.querySelector('.cta-button').addEventListener('click', () => {
  if (audioBuffer && !sourceNode) {
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3; // Volume
    
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    sourceNode.start(0);
  }
});
```

---

## Troubleshooting

### Common Issues

#### Globe appears black
- **Cause**: Textures failed to load or lights are off
- **Solution**: Check browser console, verify texture URLs, ensure lights are added to scene

#### Choppy animations
- **Cause**: Too many particles, high polygon count, or device limitations
- **Solution**: Reduce `numStars`, lower sphere segments, disable clouds on mobile

#### Scroll doesn't trigger animations
- **Cause**: GSAP or ScrollTrigger not loaded, or sections have no height
- **Solution**: Verify CDN links, ensure sections have `min-height: 100vh`

#### Mobile performance issues
- **Cause**: Full-quality rendering on low-end device
- **Solution**: Implement mobile detection, reduce quality automatically

### Debug Mode

Add this to see performance stats:

```javascript
import Stats from 'jsm/libs/stats.module.js';

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // ... your code ...
  stats.end();
}
```

---

## Best Practices

1. **Always test on mobile devices** - Performance varies significantly
2. **Use lazy loading** for textures and data
3. **Cap framerate** on low-end devices
4. **Provide fallbacks** for failed asset loads
5. **Use config files** for easy customization
6. **Comment your modifications** for future reference
7. **Version control** - commit before major changes

---

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [Natural Earth Data](https://www.naturalearthdata.com/)

---

Happy customizing! 🌍✨
