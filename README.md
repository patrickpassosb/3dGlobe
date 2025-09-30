# Terra — Interactive 3D Earth Experience

A visually stunning, scroll-driven interactive web experience featuring a photorealistic 3D Earth globe. Inspired by immersive space-themed visualizations, this project combines Three.js, GSAP ScrollTrigger, and modern web technologies to create a captivating journey through our planet.

![Terra Preview](https://img.shields.io/badge/Three.js-0.170-blue) ![GSAP](https://img.shields.io/badge/GSAP-3.12-green) ![WebGL](https://img.shields.io/badge/WebGL-Enabled-orange)

## ✨ Features

### 🌍 **Photorealistic 3D Globe**
- High-resolution Earth textures (2048x2048)
- Normal mapping for terrain detail
- Specular maps for realistic ocean reflections
- Day/night city lights with custom shader
- Dynamic cloud layer with independent rotation
- Atmospheric glow using Fresnel rim lighting

### 🎬 **Scroll-Driven Animations**
- Smooth camera movements tied to scroll position
- Globe rotation and zoom effects
- Parallax starfield background
- GSAP ScrollTrigger integration
- Fade-in animations for content sections

### 🗺️ **Geographic Data Visualization**
- Country borders overlay (GeoJSON)
- Coastline mapping (Natural Earth data)
- Configurable layer visibility
- Accurate geographic projection on 3D sphere

### 🎨 **Dark Space Theme**
- Immersive deep-space color palette
- Glassmorphism UI elements
- Gradient text effects
- Smooth transitions and hover states
- Minimal, elegant design

### 📱 **Responsive & Performance Optimized**
- Mobile-friendly with adaptive quality
- Reduced particle count on smaller devices
- Touch-friendly controls
- Pixel ratio capping for performance
- Efficient texture loading with fallbacks

### 🎯 **Interactive Controls**
- Orbit controls (drag to rotate)
- Zoom in/out with mouse wheel
- Smooth damping for natural feel
- Auto-rotation (configurable)
- Scroll-to-navigate smooth scrolling

## 🚀 Quick Start

### Prerequisites
- A modern web browser with WebGL support
- Local web server (for loading textures and GeoJSON files)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3d-globe-with-threejs.git
   cd 3d-globe-with-threejs
   ```

2. **Start a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Project Structure

```
3d-globe-with-threejs/
│
├── index.html              # Main HTML file with sections & UI
├── index.js                # Three.js scene, animations, GSAP
├── README.md               # This file
├── LICENSE.md              # License information
│
├── src/
│   ├── getStarfield.js     # Starfield particle system generator
│   ├── threeGeoJSON.js     # GeoJSON to Three.js converter
│   └── circle.png          # Texture assets
│
└── geojson/
    ├── countries.json      # Country borders data
    ├── ne_110m_coastline.json  # Coastline data
    └── ...                 # Other geographic datasets
```

## 🎨 Customization

### Visual Toggles (in `index.js`)

```javascript
const SHOW_CLOUDS = true;       // Toggle cloud layer
const SHOW_COASTLINES = true;   // Toggle coastline overlay
const SHOW_BORDERS = true;      // Toggle country borders
```

### Camera Settings

```javascript
// Initial position
camera.position.set(0, 0, 5);

// Control limits
controls.minDistance = 3;  // Closest zoom
controls.maxDistance = 15; // Farthest zoom
```

### Rotation Speed

```javascript
// In animate() function
let baseRotationSpeed = 0.0005;  // Earth rotation
cloudMesh.rotation.y += 0.0003;  // Cloud rotation
```

### Color Scheme (in `index.html` CSS)

```css
:root {
  --color-bg: #000000;
  --color-primary: #66b3ff;     /* Light blue accent */
  --color-accent: #9d84ff;      /* Purple accent */
  --color-text: #e8e8f0;        /* Main text */
  --color-text-dim: #8a8a9e;    /* Secondary text */
}
```

### Scroll Animation Timing

Adjust scroll trigger points in `index.js`:

```javascript
scrollTrigger: {
  trigger: '#about',
  start: 'top bottom',    // When to start
  end: 'top center',      // When to end
  scrub: 1,               // Smoothness (0-3)
}
```

## 🎯 Scroll Animation Breakdown

### Hero Section
- **Effect**: Static globe with gentle rotation
- **Camera**: Default position (0, 0, 5)

### About Section
- **Effect**: Zoom to 3.5 units, rotate globe 90°
- **Trigger**: Starts when section enters bottom of viewport

### Features Section
- **Effect**: Pull back to 6 units, slight horizontal shift
- **Trigger**: Smooth continuation from About

### Data Section
- **Effect**: Zoom back in to 4 units, complete 360° rotation
- **Camera**: Slight vertical shift

### Explore Section
- **Effect**: Grand finale pullback to 8 units
- **Purpose**: Show full planet view

## 📊 Performance Considerations

### Desktop (Optimal)
- Full resolution textures (2048×2048)
- 2000 stars in starfield
- All visual effects enabled
- Full-quality antialiasing

### Mobile/Tablet (Optimized)
- Same texture quality (lazy-loaded)
- Reduced starfield (500 stars)
- Camera pulled back for better view
- Pixel ratio capped at 2x
- Simplified controls

### Optimization Tips

1. **Texture Optimization**
   - Use compressed textures (WebP where supported)
   - Implement progressive loading
   - Add lower-res fallbacks

2. **Geometry Optimization**
   - Reduce sphere segments on mobile
   - Use LOD (Level of Detail) for globe
   - Frustum culling for off-screen objects

3. **Shader Optimization**
   - Minimize `onBeforeCompile` modifications
   - Use simpler materials on low-end devices
   - Cache uniform values

4. **Rendering Optimization**
   ```javascript
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   ```

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Three.js** | 3D rendering engine (WebGL) |
| **GSAP** | Animation library |
| **ScrollTrigger** | Scroll-based animations |
| **GeoJSON** | Geographic data format |
| **ES6 Modules** | Modern JavaScript imports |
| **CSS3** | Styling, gradients, glassmorphism |

## 📦 External Dependencies (CDN)

All dependencies are loaded via CDN (no npm install required):

```html
<!-- Three.js -->
https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js

<!-- GSAP -->
https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js

<!-- Fonts -->
Google Fonts: Inter, Space Grotesk
```

## 🎓 Educational Value

This project demonstrates:

- **3D Graphics**: WebGL rendering, lighting, materials
- **Shader Programming**: Custom GLSL shaders for day/night
- **Animation**: Scroll-driven and time-based animations
- **Data Visualization**: GeoJSON mapping on 3D surfaces
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimization techniques for web 3D

## 🔧 Troubleshooting

### Globe doesn't appear
- Check browser console for texture loading errors
- Ensure you're running from a web server (not `file://`)
- Verify WebGL is supported: https://get.webgl.org/

### Scroll animations not working
- Ensure GSAP and ScrollTrigger are loaded
- Check browser console for JavaScript errors
- Try disabling browser extensions

### Poor performance
- Reduce `numStars` in starfield (line 54)
- Disable cloud layer (`SHOW_CLOUDS = false`)
- Lower sphere segment count (line 107)

### GeoJSON layers missing
- Check that `/geojson/` folder exists
- Verify JSON files are valid
- Check network tab for 404 errors

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | 14+ | ✅ Optimized |
| Chrome Mobile | 90+ | ✅ Optimized |

## 📝 Credits & Resources

### Textures
- NASA Visible Earth
- Three.js example textures
- Natural Earth Data

### Libraries
- [Three.js](https://threejs.org/) by Mr.doob and contributors
- [GSAP](https://greensock.com/gsap/) by GreenSock
- [Natural Earth](https://www.naturalearthdata.com/) for GeoJSON data

### Inspiration
- [Lunar Trek](https://mohammadhelaly.github.io/lunar-trek/) by Mohammad Helaly
- NASA's Eyes on the Earth
- Google Earth

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add interactive hotspots on globe (click for info)
- [ ] Implement search/location finder
- [ ] Add real-time satellite data
- [ ] Night sky constellations
- [ ] Post-processing effects (bloom, vignette)
- [ ] Sound design / ambient music
- [ ] Multi-language support
- [ ] Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🙏 Acknowledgments

Special thanks to:
- Three.js community for amazing documentation
- GSAP team for powerful animation tools
- Natural Earth for free geographic data
- You for checking out this project!

---

**Built with ❤️ and WebGL**

*For questions or suggestions, please open an issue on GitHub.*