/* ============================================
   BUNA HOUSE — 3D Background + Interactions
   ============================================ */

(() => {
  // --- Three.js 3D Background ---
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d0705, 8, 25);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0d0705, 1);

  // Lights
  const ambient = new THREE.AmbientLight(0xfff0d0, 0.5);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0xe8a93a, 1.2);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xc9302c, 2, 20);
  rimLight.position.set(-5, -3, 3);
  scene.add(rimLight);

  // --- Particle field (coffee bean-like) ---
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const palette = [
    new THREE.Color(0xe8a93a), // gold
    new THREE.Color(0xc9302c), // red
    new THREE.Color(0xf4d27a), // light gold
    new THREE.Color(0x8b2c1f), // dark red
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 30;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
    sizes[i] = Math.random() * 0.08 + 0.02;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // --- Floating coffee bean shapes ---
  const beans = [];
  const beanGeo = new THREE.SphereGeometry(0.25, 16, 16);
  beanGeo.scale(1, 0.6, 0.8);

  for (let i = 0; i < 18; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x5a2a0c : 0x8b2c1f,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x2a1810,
      emissiveIntensity: 0.2,
    });
    const bean = new THREE.Mesh(beanGeo, mat);
    bean.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8 - 2
    );
    bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    bean.userData = {
      rotSpeed: (Math.random() - 0.5) * 0.01,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: bean.position.y,
    };
    scene.add(bean);
    beans.push(bean);
  }

  // --- Big central glowing sphere (sun/orb) ---
  const orbGeo = new THREE.IcosahedronGeometry(2, 2);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0xe8a93a,
    emissive: 0xc9302c,
    emissiveIntensity: 0.4,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: true,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(4, 0, -5);
  scene.add(orb);

  // Inner solid orb
  const innerOrbGeo = new THREE.SphereGeometry(1.3, 32, 32);
  const innerOrbMat = new THREE.MeshStandardMaterial({
    color: 0xc9302c,
    emissive: 0xe8a93a,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1,
  });
  const innerOrb = new THREE.Mesh(innerOrbGeo, innerOrbMat);
  innerOrb.position.copy(orb.position);
  scene.add(innerOrb);

  // --- Mouse parallax ---
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // --- Scroll-based camera movement ---
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // --- Animation loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth camera follow
    targetX = mouseX * 0.8;
    targetY = -mouseY * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY + scrollY * 0.001 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Particle swirl
    particles.rotation.y = t * 0.05;
    particles.rotation.x = Math.sin(t * 0.1) * 0.1;

    // Beans float
    beans.forEach((bean) => {
      bean.position.y = bean.userData.baseY + Math.sin(t * bean.userData.floatSpeed + bean.userData.floatOffset) * 0.5;
      bean.rotation.x += bean.userData.rotSpeed;
      bean.rotation.y += bean.userData.rotSpeed * 0.5;
    });

    // Orb pulse
    const pulse = 1 + Math.sin(t * 1.2) * 0.08;
    orb.scale.set(pulse, pulse, pulse);
    orb.rotation.y = t * 0.2;
    orb.rotation.x = t * 0.1;
    innerOrb.rotation.y = -t * 0.3;
    innerOrb.scale.set(pulse, pulse, pulse);

    // Rim light orbit
    rimLight.position.x = Math.cos(t * 0.5) * 6;
    rimLight.position.z = Math.sin(t * 0.5) * 6;

    renderer.render(scene, camera);
  }
  animate();

  // --- Resize ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // --- Hide loader ---
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 600);
  });

  // --- Tilt on dish cards (mouse 3D) ---
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });

  // --- Smooth nav active state ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--accent)';
    });
  });
})();
