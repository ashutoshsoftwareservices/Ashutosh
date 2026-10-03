/* ==========================================================================
   INTERACTIVE 3D WEBGL PARTICLE GALAXY CANVAS (THREE.JS)
   ========================================================================== */

(function () {
  let scene, camera, renderer, particlesMesh;
  let particleCount = 700;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Default Colors - Founder Mode Initialized (#ffb703 & #ff0055)
  let primaryColor = new THREE.Color(0xffb703);
  let secondaryColor = new THREE.Color(0xff0055);

  function initThree() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060d, 0.0015);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 800;

    // 3. Particles Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const mixedColor = primaryColor.clone().lerp(secondaryColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 4 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 4. Material
    const canvasTexture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      map: canvasTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // 5. Mesh
    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 6. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Event Listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Dynamic Theme Color Observer
    window.addEventListener('modeChanged', function (e) {
      if (e.detail && e.detail.mode === 'engineer') {
        updateParticleColors(new THREE.Color(0x00f0ff), new THREE.Color(0x7000ff));
      } else {
        updateParticleColors(new THREE.Color(0xffb703), new THREE.Color(0xff0055));
      }
    });

    animate();
  }

  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function updateParticleColors(col1, col2) {
    if (!particlesMesh) return;
    const colors = particlesMesh.geometry.attributes.color.array;
    for (let i = 0; i < particleCount; i++) {
      const mixedColor = col1.clone().lerp(col2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    particlesMesh.geometry.attributes.color.needsUpdate = true;
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (particlesMesh) {
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0008;

      particlesMesh.rotation.y += (targetX * 0.0001 - particlesMesh.rotation.y) * 0.05;
      particlesMesh.rotation.x += (targetY * 0.0001 - particlesMesh.rotation.x) * 0.05;
    }

    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();
