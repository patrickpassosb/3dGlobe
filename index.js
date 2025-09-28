import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { drawThreeGeo } from "./src/threeGeoJSON.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = null;
const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights for realism
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// Group to rotate Earth, clouds, and outlines together
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const geometry = new THREE.SphereGeometry(2);
const lineMat = new THREE.LineBasicMaterial({ 
  color: 0x0b3d91,
  transparent: true,
  opacity: 0.4, 
});
const edges = new THREE.EdgesGeometry(geometry, 1);
const line = new THREE.LineSegments(edges, lineMat);
line.visible = true; // keep visible until textured Earth is ready
earthGroup.add(line);

const stars = getStarfield({ numStars: 1000, fog: false });
scene.add(stars);

// Textured Earth and cloud layer
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');
function loadTexture(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

let cloudMesh = null;
let countries = null;
let atmosphere = null;
let earthMesh = null;

Promise.all([
  loadTexture('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
  loadTexture('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
  loadTexture('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
  loadTexture('https://threejs.org/examples/textures/planets/clouds_2048.png'),
]).then(([earthMap, normalMap, specMap, cloudMap]) => {
  const earthGeo = new THREE.SphereGeometry(2, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthMap,
    normalMap: normalMap,
    specularMap: specMap,
    specular: new THREE.Color(0x333333),
    shininess: 12,
  });
  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  // Match GeoJSON orientation
  earthMesh.rotation.x = -Math.PI * 0.5;
  earthGroup.add(earthMesh);
  line.visible = false; // hide helper once Earth appears

  const cloudsGeo = new THREE.SphereGeometry(2.01, 64, 64);
  const cloudsMat = new THREE.MeshPhongMaterial({
    map: cloudMap,
    transparent: true,
    depthWrite: false,
    opacity: 0.9,
  });
  cloudMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
  cloudMesh.rotation.x = -Math.PI * 0.5;
  earthGroup.add(cloudMesh);

  // Simple atmospheric glow using a backface sphere with additive blending
  const atmosphereGeo = new THREE.SphereGeometry(2.1, 64, 64);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  atmosphere.rotation.x = -Math.PI * 0.5;
  earthGroup.add(atmosphere);
}).catch((err) => {
  console.error('Texture load error', err);
  // Fallback solid Earth so the globe is never missing
  const earthGeo = new THREE.SphereGeometry(2, 64, 64);
  const fallbackMat = new THREE.MeshPhongMaterial({ color: 0x224466, shininess: 8 });
  earthMesh = new THREE.Mesh(earthGeo, fallbackMat);
  earthMesh.rotation.x = -Math.PI * 0.5;
  earthGroup.add(earthMesh);
  line.visible = false;
});

// check here for more datasets ...
// https://github.com/martynafford/natural-earth-geojson
// non-geojson datasets: https://www.naturalearthdata.com/downloads/
// Landmass coastlines layer (thin, subtle)
fetch('./geojson/ne_110m_coastline.json')
  .then(response => response.text())
  .then(text => {
    const data = JSON.parse(text);
    const coastlines = drawThreeGeo({
      json: data,
      radius: 2,
      materialOptions: { color: 0x9ec6ff, linewidth: 1, opacity: 0.5 },
    });
    earthGroup.add(coastlines);
  });

// Country borders layer (darker lines on land)
fetch('./geojson/countries.json')
  .then(response => response.text())
  .then(text => {
    const data = JSON.parse(text);
    countries = drawThreeGeo({
      json: data,
      radius: 2,
      materialOptions: { color: 0x1a73e8, linewidth: 1.5, opacity: 0.8 },
    });
    earthGroup.add(countries);
  });

function animate() {
  requestAnimationFrame(animate);
  // Gentle rotation to simulate Earth's spin
  earthGroup.rotation.y += 0.0005;
  if (cloudMesh) cloudMesh.rotation.y += 0.0008;

  // Update any animated outlines if provided
  if (countries && countries.userData.update) {
    countries.userData.update(performance.now());
  }
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);