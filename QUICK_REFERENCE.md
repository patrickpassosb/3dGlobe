# Terra Quick Reference

One-page cheat sheet for common tasks and settings.

---

## 🚀 Getting Started

```bash
# Start local server (choose one):
python -m http.server 8000    # Python
npx http-server -p 8000       # Node.js
php -S localhost:8000         # PHP

# Or use the scripts:
./start.sh                    # Mac/Linux
start.bat                     # Windows
npm start                     # With npm

# Then open: http://localhost:8000
```

---

## ⚙️ Configuration Quick Toggles

**In `index.js`:**

```javascript
// Features
const SHOW_CLOUDS = true;      // Cloud layer
const SHOW_COASTLINES = true;  // Coastlines
const SHOW_BORDERS = true;     // Country borders

// Stars
const stars = getStarfield({ numStars: 2000 }); // Adjust count

// Rotation speed
let baseRotationSpeed = 0.0005;  // Earth
cloudMesh.rotation.y += 0.0003;  // Clouds
```

---

## 🎨 Colors & Theme

**CSS Variables (in `index.html` `<style>`):**

```css
:root {
  --color-bg: #000000;        /* Background */
  --color-primary: #66b3ff;   /* Blue accent */
  --color-accent: #9d84ff;    /* Purple accent */
  --color-text: #e8e8f0;      /* Main text */
  --color-text-dim: #8a8a9e;  /* Dimmed text */
}
```

**Three.js Colors (in `index.js`):**

```javascript
// Atmosphere
color: new THREE.Color(0x66b3ff)  // Hex color

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
const rimLight = new THREE.DirectionalLight(0x66b3ff, 0.5);
```

---

## 📹 Camera Controls

```javascript
// Position
camera.position.set(x, y, z);  // Default: (0, 0, 5)

// Limits
controls.minDistance = 3;
controls.maxDistance = 15;

// Behavior
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;
```

---

## 🎬 Scroll Animation Template

```javascript
gsap.to(camera.position, {
  z: 4,                      // Target value
  scrollTrigger: {
    trigger: '#section-id',  // HTML element
    start: 'top bottom',     // When to start
    end: 'top center',       // When to end
    scrub: 1,                // Smoothness (0-3)
  }
});
```

**Common Trigger Points:**
- `start: 'top bottom'` → Section enters viewport
- `start: 'top center'` → Section at center
- `start: 'top top'` → Section at top
- `end: 'bottom bottom'` → Section exits

**Scrub Values:**
- `0` = Instant (no smoothing)
- `1` = Normal smoothing
- `2-3` = Very smooth

---

## 🎯 Add New Section

**1. HTML (in `index.html`):**

```html
<section id="my-section">
  <div class="content fade-in">
    <h2 class="section-title">Title</h2>
    <p class="section-text">Content...</p>
  </div>
</section>
```

**2. Animation (in `index.js`):**

```javascript
// In initScrollAnimations()
gsap.to(camera.position, {
  z: 6,
  scrollTrigger: {
    trigger: '#my-section',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
  }
});
```

**3. Navigation (in `index.html`):**

```html
<ul class="nav-links">
  <li><a href="#my-section">MY SECTION</a></li>
</ul>
```

---

## 💡 Lighting Presets

**Bright & Clear:**
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
```

**Dramatic & Moody:**
```javascript
const ambientLight = new THREE.AmbientLight(0x1a1a3e, 0.3);
const sunLight = new THREE.DirectionalLight(0xfff5e1, 2.0);
sunLight.position.set(10, 5, 8);
```

**Sunset Warmth:**
```javascript
const ambientLight = new THREE.AmbientLight(0x2a1a0a, 0.4);
const sunLight = new THREE.DirectionalLight(0xff8844, 1.8);
const rimLight = new THREE.DirectionalLight(0x4488ff, 0.6);
```

---

## 🌟 Starfield Options

```javascript
// In src/getStarfield.js

// Star count
numStars = 2000  // More = prettier, slower

// Star size
size: 0.2  // Larger = more visible

// Star distance
const radius = Math.random() * 25 + 25;  // 25-50 units

// Star color
col = new THREE.Color().setHSL(
  0.6,              // Hue (0-1)
  0.2,              // Saturation
  Math.random()     // Brightness
);
```

---

## 📱 Mobile Optimization

```javascript
// Detect mobile
const isMobile = window.innerWidth < 768;

if (isMobile) {
  // Fewer stars
  const stars = getStarfield({ numStars: 500 });
  
  // Lower quality
  const geo = new THREE.SphereGeometry(2, 32, 32); // 32 instead of 64
  
  // Pull camera back
  camera.position.z = 7;
  
  // Adjust limits
  controls.minDistance = 5;
  controls.maxDistance = 20;
  
  // Disable features
  const SHOW_CLOUDS = false;
}
```

---

## 🎨 Material Properties

```javascript
earthMat = new THREE.MeshPhongMaterial({
  map: earthMap,              // Main texture
  normalMap: normalMap,       // Bumps
  specularMap: specMap,       // Reflections
  specular: new THREE.Color(0x333333),  // Reflection color
  shininess: 18,              // Shine amount (0-100)
  emissiveMap: nightMap,      // Glow map
  emissiveIntensity: 0.0,     // Glow strength
  bumpScale: 0.15,            // Bump depth
  opacity: 1.0,               // Transparency
  transparent: false,
});
```

---

## 🔍 Debug & Performance

```javascript
// FPS Monitor
import Stats from 'jsm/libs/stats.module.js';
const stats = Stats();
document.body.appendChild(stats.dom);

// In animate()
stats.begin();
// ... your code ...
stats.end();

// Console logs
console.log('Camera:', camera.position);
console.log('FPS:', Math.round(1000 / deltaTime));
console.log('Triangles:', renderer.info.render.triangles);

// Renderer info
console.log(renderer.capabilities);
console.log(renderer.info);
```

---

## ⚡ Performance Tips

**Reduce Quality:**
```javascript
// Stars
numStars: 1000  // From 2000

// Segments
new THREE.SphereGeometry(2, 32, 32)  // From 64

// Pixel ratio
renderer.setPixelRatio(1)  // From 2

// Antialiasing
antialias: false  // From true
```

**Disable Features:**
```javascript
const SHOW_CLOUDS = false;
const SHOW_COASTLINES = false;
const SHOW_BORDERS = false;
```

**Optimize Animations:**
```javascript
// Throttle frame rate
const targetFPS = 30;
const frameTime = 1000 / targetFPS;
// ... throttle logic ...
```

---

## 🐛 Common Fixes

### Globe is Black
```javascript
// Check lights are added
scene.add(ambientLight);
scene.add(sunLight);

// Verify textures loaded
console.log(earthMat.map);
```

### Choppy Animations
```javascript
// Increase scrub value
scrub: 2  // From 1

// Reduce stars
numStars: 500  // From 2000
```

### Sections Don't Animate
```javascript
// Ensure GSAP loaded (in HTML)
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

// Register plugin
gsap.registerPlugin(ScrollTrigger);
```

### Textures Won't Load
```bash
# Must use web server, not file://
python -m http.server 8000

# Check CORS in console
# Verify CDN URLs are accessible
```

---

## 📐 Useful Coordinates

```javascript
// Camera positions
{ x: 0, y: 0, z: 5 }    // Front view
{ x: 5, y: 0, z: 0 }    // Side view
{ x: 0, y: 5, z: 0 }    // Top view
{ x: 3, y: 3, z: 3 }    // Angled view

// Globe rotation (radians)
Math.PI * 0.5   // 90°
Math.PI         // 180°
Math.PI * 1.5   // 270°
Math.PI * 2     // 360°

// Convert degrees to radians
THREE.MathUtils.degToRad(45)  // 45 degrees
```

---

## 🎯 Quick Customization Checklist

- [ ] Change colors (CSS variables)
- [ ] Update title and tagline
- [ ] Adjust section content
- [ ] Modify camera animations
- [ ] Change rotation speed
- [ ] Toggle visual features
- [ ] Optimize for target device
- [ ] Test on mobile
- [ ] Add custom GeoJSON data
- [ ] Customize lighting

---

## 📚 File Quick Access

| File | Purpose |
|------|---------|
| `index.html` | Structure, UI, CSS |
| `index.js` | 3D scene, animations |
| `config.js` | Settings & presets |
| `src/getStarfield.js` | Star generation |
| `src/threeGeoJSON.js` | GeoJSON loader |
| `geojson/*.json` | Geographic data |

---

## 🔗 Essential URLs

- **Three.js Docs**: https://threejs.org/docs/
- **GSAP Docs**: https://greensock.com/docs/
- **ScrollTrigger**: https://greensock.com/scrolltrigger/
- **WebGL Check**: https://get.webgl.org/
- **Natural Earth**: https://www.naturalearthdata.com/

---

## 🎓 Learning Path

1. **Beginner**: Change colors, text, rotation speeds
2. **Intermediate**: Add sections, modify animations, adjust lighting
3. **Advanced**: Custom shaders, interactive hotspots, real-time data

---

**Pro Tip:** Always test in the browser console first before making permanent changes!

```javascript
// Test in console:
camera.position.z = 10;
earthGroup.rotation.y = Math.PI;
controls.autoRotate = true;
```

---

*Keep this file open while coding for instant reference!*
