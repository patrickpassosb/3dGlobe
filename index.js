import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { drawThreeGeo } from "./src/threeGeoJSON.js";

// ==========================================
// SCENE SETUP
// ==========================================
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = null;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 5);

const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true 
});
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvas.appendChild(renderer.domElement);

// ==========================================
// CONTROLS
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 15;
controls.autoRotate = false; // Will control this via scroll
controls.autoRotateSpeed = 0.5;

// ==========================================
// LIGHTING
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// Additional rim light for dramatic effect
const rimLight = new THREE.DirectionalLight(0x66b3ff, 0.5);
rimLight.position.set(-5, 0, -5);
scene.add(rimLight);

// ==========================================
// EARTH GROUP
// ==========================================
const earthGroup = new THREE.Group();
scene.add(earthGroup);
earthGroup.rotation.z = THREE.MathUtils.degToRad(23.4); // Earth's axial tilt

// Wireframe helper (shown until textures load)
const geometry = new THREE.SphereGeometry(2, 32, 32);
const lineMat = new THREE.LineBasicMaterial({ 
  color: 0x0b3d91,
  transparent: true,
  opacity: 0.4, 
});
const edges = new THREE.EdgesGeometry(geometry, 1);
const line = new THREE.LineSegments(edges, lineMat);
line.visible = true;
earthGroup.add(line);

// ==========================================
// VISUAL TOGGLES
// ==========================================
const SHOW_CLOUDS = true;
const SHOW_COASTLINES = true;
const SHOW_BORDERS = true;

// ==========================================
// STARFIELD
// ==========================================
const stars = getStarfield({ numStars: 2000, fog: false });
scene.add(stars);

// ==========================================
// TEXTURE LOADING
// ==========================================
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url, 
      (tex) => { 
        tex.colorSpace = THREE.SRGBColorSpace; 
        tex.anisotropy = 8; 
        resolve(tex); 
      }, 
      undefined, 
      reject
    );
  });
}

async function loadAny(urls) {
  for (let i = 0; i < urls.length; i++) {
    try {
      const tex = await loadTexture(urls[i]);
      console.log('✓ Loaded texture from:', urls[i]);
      return tex;
    } catch (e) {
      console.warn('✗ Failed texture URL:', urls[i]);
    }
  }
  throw new Error('All texture URLs failed');
}

let cloudMesh = null;
let countries = null;
let atmosphere = null;
let earthMesh = null;
let earthMat = null;
let isLoaded = false;

// ==========================================
// EARTH CREATION
// ==========================================
Promise.all([
  loadAny([
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  ]),
  loadAny([
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  ]),
  loadAny([
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_specular_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  ]),
  loadAny([
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/cloud_combined_2048.jpg',
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/clouds_2048.png',
    'https://threejs.org/examples/textures/planets/clouds_2048.png',
  ]),
  loadAny([
    'https://cdn.jsdelivr.net/npm/three@0.170/examples/textures/planets/earth_lights_2048.png',
    'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
  ]),
]).then(([earthMap, normalMap, specMap, cloudMap, nightMap]) => {
  const earthGeo = new THREE.SphereGeometry(2, 64, 64);
  earthMat = new THREE.MeshPhongMaterial({
    map: earthMap,
    normalMap: normalMap,
    specularMap: specMap,
    specular: new THREE.Color(0x333333),
    shininess: 18,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: nightMap,
    emissiveIntensity: 0.0,
    bumpMap: normalMap,
    bumpScale: 0.15,
  });

  // Enhanced shader for day/night transition and color grading
  earthMat.onBeforeCompile = (shader) => {
    shader.uniforms.sunDirection = { value: new THREE.Vector3(1, 0, 0) };
    earthMat.userData.sunUniform = shader.uniforms.sunDirection;
    shader.uniforms.oceanTint = { value: new THREE.Color(0x1c4fb8) };
    shader.uniforms.oceanTintIntensity = { value: 0.62 };
    shader.uniforms.landTint = { value: new THREE.Color(0x5f9f6a) };
    shader.uniforms.landTintIntensity = { value: 0.12 };
    shader.uniforms.satStrength = { value: 1.22 };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float ndotl = max(dot(normalize(normal), normalize(sunDirection)), 0.0);
        totalEmissiveRadiance *= (1.0 - ndotl);
        `
      )
      .replace(
        '#include <specularmap_fragment>',
        `#include <specularmap_fragment>
        vec3 _tintOcean = mix(diffuseColor.rgb, oceanTint, specularStrength * oceanTintIntensity);
        vec3 _tinted = mix(_tintOcean, landTint, (1.0 - specularStrength) * landTintIntensity);
        float luma = dot(_tinted, vec3(0.299, 0.587, 0.114));
        vec3 gray = vec3(luma);
        diffuseColor.rgb = mix(gray, _tinted, satStrength);
        `
      );
  };

  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.rotation.x = -Math.PI * 0.5;
  earthGroup.add(earthMesh);
  line.visible = false;

  // Clouds
  if (SHOW_CLOUDS) {
    const cloudsGeo = new THREE.SphereGeometry(2.01, 64, 64);
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    cloudMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    cloudMesh.rotation.x = -Math.PI * 0.5;
    earthGroup.add(cloudMesh);
  }

  // Atmosphere glow with Fresnel effect
  const atmosphereGeo = new THREE.SphereGeometry(2.08, 64, 64);
  const atmosphereMat = new THREE.ShaderMaterial({
    uniforms: { 
      color: { value: new THREE.Color(0x66b3ff) }, 
      intensity: { value: 0.75 } 
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
        gl_FragColor = vec4(color * rim * intensity, rim * 0.9);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  atmosphere.rotation.x = -Math.PI * 0.5;
  earthGroup.add(atmosphere);

  // Mark as loaded
  isLoaded = true;
  hideLoadingScreen();
}).catch((err) => {
  console.error('Texture load error:', err);
  // Fallback solid Earth
  const earthGeo = new THREE.SphereGeometry(2, 64, 64);
  const fallbackMat = new THREE.MeshPhongMaterial({ 
    color: 0x224466, 
    shininess: 8 
  });
  earthMesh = new THREE.Mesh(earthGeo, fallbackMat);
  earthMesh.rotation.x = -Math.PI * 0.5;
  earthGroup.add(earthMesh);
  line.visible = false;
  isLoaded = true;
  hideLoadingScreen();
});

// ==========================================
// GEOJSON LAYERS
// ==========================================
if (SHOW_COASTLINES) {
  fetch('./geojson/ne_110m_coastline.json')
    .then(response => response.json())
    .then(data => {
      const coastlines = drawThreeGeo({
        json: data,
        radius: 2.005,
        materialOptions: { 
          color: 0x9ec6ff, 
          linewidth: 1, 
          opacity: 0.5 
        },
      });
      earthGroup.add(coastlines);
    })
    .catch(err => console.warn('Coastlines failed to load:', err));
}

if (SHOW_BORDERS) {
  fetch('./geojson/countries.json')
    .then(response => response.json())
    .then(data => {
      countries = drawThreeGeo({
        json: data,
        radius: 2.005,
        materialOptions: { 
          color: 0x1a73e8, 
          linewidth: 1.5, 
          opacity: 0.8 
        },
      });
      earthGroup.add(countries);
    })
    .catch(err => console.warn('Countries failed to load:', err));
}

// ==========================================
// LOADING SCREEN
// ==========================================
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      initScrollAnimations();
      initExploreMode();
    }, 500);
  }
}

// ==========================================
// SCROLL ANIMATIONS WITH GSAP
// ==========================================
function initScrollAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Fade in hero content
  gsap.to('.hero-content', {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: 'power3.out'
  });

  // ==========================================
  // HERO TO ABOUT: Zoom and rotate
  // ==========================================
  gsap.to(camera.position, {
    z: 3.5,
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  gsap.to(earthGroup.rotation, {
    y: Math.PI * 0.5,
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  // ==========================================
  // ABOUT TO FEATURES: Continue rotation
  // ==========================================
  gsap.to(earthGroup.rotation, {
    y: Math.PI * 1.2,
    scrollTrigger: {
      trigger: '#features',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  gsap.to(camera.position, {
    z: 6,
    x: 1,
    scrollTrigger: {
      trigger: '#features',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  // ==========================================
  // DATA SECTION: Zoom in closer
  // ==========================================
  gsap.to(camera.position, {
    z: 4,
    x: 0,
    y: 0.5,
    scrollTrigger: {
      trigger: '#data',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  gsap.to(earthGroup.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
      trigger: '#data',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  // ==========================================
  // EXPLORE SECTION: Pull back for grand view
  // ==========================================
  gsap.to(camera.position, {
    z: 8,
    x: 0,
    y: 0,
    scrollTrigger: {
      trigger: '#explore',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
    }
  });

  // ==========================================
  // CONTENT FADE-IN ANIMATIONS
  // ==========================================
  gsap.utils.toArray('.fade-in').forEach((elem) => {
    gsap.fromTo(elem, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  gsap.utils.toArray('.fade-in-left').forEach((elem) => {
    gsap.fromTo(elem,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  gsap.utils.toArray('.fade-in-right').forEach((elem) => {
    gsap.fromTo(elem,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Rotate starfield slowly as user scrolls
  gsap.to(stars.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    }
  });
}

// ==========================================
// ANIMATION LOOP
// ==========================================
let baseRotationSpeed = 0.0005;

function animate() {
  requestAnimationFrame(animate);

  // Gentle base rotation
  earthGroup.rotation.y += baseRotationSpeed;
  
  // Clouds rotate slightly faster
  if (cloudMesh) {
    cloudMesh.rotation.y += 0.0003;
  }

  // Update sun direction for day/night shader
  if (earthMat && earthMat.userData && earthMat.userData.sunUniform) {
    const sunDirWorld = new THREE.Vector3().copy(sunLight.position).normalize();
    const sunDirView = sunDirWorld.clone().transformDirection(camera.matrixWorldInverse);
    earthMat.userData.sunUniform.value.copy(sunDirView);
  }

  // Update GeoJSON animations if available
  if (countries && countries.userData.update) {
    countries.userData.update(performance.now());
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ==========================================
// RESPONSIVE HANDLING
// ==========================================
function handleWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  
  // Adjust camera on mobile
  if (width < 768) {
    camera.position.z = 7; // Pull back on mobile
    controls.minDistance = 5;
    controls.maxDistance = 20;
  } else {
    controls.minDistance = 3;
    controls.maxDistance = 15;
  }
}

window.addEventListener('resize', handleWindowResize, false);

// Initial mobile check
if (window.innerWidth < 768) {
  camera.position.z = 7;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  // Reduce star count for performance
  scene.remove(stars);
  const mobileStars = getStarfield({ numStars: 500 });
  scene.add(mobileStars);
}

// ==========================================
// SMOOTH SCROLL (Optional enhancement)
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// EXPLORE MODE
// ==========================================
let isExploreMode = false;

function enterExploreMode() {
  console.log('🌍 Entering Explore Mode...');
  
  // Immediately add the class to trigger CSS fade-out animations
  isExploreMode = true;
  document.body.classList.add('explore-mode');
  
  // Scroll to top instantly (no animation to avoid distraction)
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
  
  // Wait a moment for fade-out to complete, then enable interactions
  setTimeout(() => {
    // Enable auto-rotate for cinematic effect
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    
    // Smooth zoom to ideal viewing distance
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 5.5,
      duration: 2.5,
      ease: 'power2.inOut'
    });
    
    // Reset globe rotation for centered view
    gsap.to(earthGroup.rotation, {
      y: 0,
      duration: 2.5,
      ease: 'power2.inOut'
    });
    
    console.log('✨ Explore Mode: ACTIVE - UI faded out, globe ready for interaction!');
  }, 300); // Small delay for smooth transition
}

function exitExploreMode() {
  console.log('🚪 Exiting Explore Mode...');
  
  // Disable auto-rotate first
  controls.autoRotate = false;
  
  // Reset camera to initial position with smooth animation
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 5,
    duration: 1.5,
    ease: 'power2.inOut'
  });
  
  // Reset globe rotation
  gsap.to(earthGroup.rotation, {
    y: earthGroup.rotation.y, // Keep current rotation
    duration: 1,
    ease: 'power2.out'
  });
  
  // Remove explore mode class to trigger fade-in
  setTimeout(() => {
    isExploreMode = false;
    document.body.classList.remove('explore-mode');
    
    // Scroll back to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log('✅ Explore Mode: DEACTIVATED - UI restored');
  }, 500);
}

// Initialize explore mode event listeners
function initExploreMode() {
  const exploreButton = document.getElementById('explore-button');
  const exitExploreButton = document.getElementById('exit-explore');
  
  console.log('🔍 Initializing Explore Mode...', { exploreButton, exitExploreButton });
  
  if (exploreButton) {
    exploreButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🌍 Explore button clicked!');
      enterExploreMode();
    });
    console.log('✅ Explore button listener attached');
  } else {
    console.error('❌ Explore button not found!');
  }
  
  if (exitExploreButton) {
    exitExploreButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🚪 Exit button clicked!');
      exitExploreMode();
    });
    console.log('✅ Exit button listener attached');
  } else {
    console.error('❌ Exit button not found!');
  }
  
  // ESC key to exit explore mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExploreMode) {
      console.log('⌨️ ESC pressed - exiting explore mode');
      exitExploreMode();
    }
  });
  
  // Disable scroll when in explore mode
  let lastScrollPosition = 0;
  window.addEventListener('scroll', () => {
    if (isExploreMode) {
      window.scrollTo(0, lastScrollPosition);
    } else {
      lastScrollPosition = window.pageYOffset;
    }
  });
}

// ==========================================
// PERFORMANCE MONITORING (Development)
// ==========================================
console.log('%c🌍 Terra Interactive Globe', 'color: #66b3ff; font-size: 16px; font-weight: bold;');
console.log('Three.js version:', THREE.REVISION);
console.log('Renderer:', renderer.capabilities);