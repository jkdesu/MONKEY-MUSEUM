import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('three-container');
container.appendChild(renderer.domElement);
camera.position.z = 5;

const positions = [];
const originalPositions = [];
const colors = [];

const img = new Image();
img.src = 'assets/monkey000.png'; // ✅ Make sure this path is correct
img.onload = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imgWidth = 100;
  const imgHeight = 100;
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

  const data = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
  const geometry = new THREE.BufferGeometry();

  for (let y = 0; y < imgHeight; y += 1) {
    for (let x = 0; x < imgWidth; x += 1) {
      const i = (y * imgWidth + x) * 4;
      const alpha = data[i + 3];
      if (alpha > 100) {
        const px = (x - imgWidth / 2) / 20;
        const py = (imgHeight / 2 - y) / 20;
        const pz = 0;

        positions.push(px, py, pz);
        originalPositions.push(px, py, pz);

        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        colors.push(r, g, b);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true // ✅ THIS makes each particle take color from the color attribute
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Animation: explode and reassemble
  setTimeout(() => {
    const newPositions = [];
    for (let i = 0; i < positions.length; i += 3) {
      newPositions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
    }

    gsap.to(geometry.attributes.position.array, {
      duration: 2,
      endArray: newPositions,
      onUpdate: () => geometry.attributes.position.needsUpdate = true,
      onComplete: () => {
        gsap.to(geometry.attributes.position.array, {
          duration: 2,
          endArray: originalPositions,
          onUpdate: () => geometry.attributes.position.needsUpdate = true
        });
      }
    });
  }, 2000);
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

