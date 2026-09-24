import * as THREE from 'three';
import gsap from 'gsap';
import { BottleModel } from './BottleModel.js';
import { MistParticleSystem } from './MistParticleSystem.js';

export class PerfumeScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = this.container.clientWidth || (window.innerWidth > 1024 ? 620 : Math.max(320, window.innerWidth - 40));
    this.height = this.container.clientHeight || 640;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = true;
    this.autoRotateSpeed = 0.004;

    this.clock = new THREE.Clock();

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLighting();
    this.initBottle();
    this.initMistSystem();
    this.initAmbientParticles();
    this.initEvents();

    setTimeout(() => {
      this.onResize();
    }, 150);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createStudioEnvironment() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Studio ambiance gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#242432');
    bgGrad.addColorStop(0.5, '#121218');
    bgGrad.addColorStop(1, '#08080c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Warm Key Softbox Light reflection
    const softbox = ctx.createRadialGradient(160, 90, 0, 160, 90, 130);
    softbox.addColorStop(0, 'rgba(255, 250, 240, 0.95)');
    softbox.addColorStop(0.35, 'rgba(245, 215, 140, 0.65)');
    softbox.addColorStop(1, 'rgba(36, 36, 50, 0)');
    ctx.fillStyle = softbox;
    ctx.fillRect(0, 0, 512, 256);

    // Gold Rim Strip reflection
    const rimGrad = ctx.createLinearGradient(340, 0, 430, 0);
    rimGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    rimGrad.addColorStop(0.5, 'rgba(245, 208, 97, 0.9)');
    rimGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(340, 10, 90, 236);

    const envTex = new THREE.CanvasTexture(canvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.needsUpdate = true;
    return envTex;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.environment = this.createStudioEnvironment();
  }

  initCamera() {
    const aspect = (this.height > 0) ? (this.width / this.height) : 1;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this.camera.position.set(0, 1.35, 6.2);
    this.camera.lookAt(0, 1.25, 0);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  initLighting() {
    // 1. Hemisphere light for rich natural studio ambiance
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x1a1a24, 1.2);
    this.scene.add(hemiLight);

    // 2. Ambient light
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    this.scene.add(ambientLight);

    // 3. Key Main Golden Sunlight
    this.keyLight = new THREE.DirectionalLight(0xfffaed, 3.5);
    this.keyLight.position.set(4.5, 6.5, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // 4. Gold Rim Light
    this.rimLight = new THREE.DirectionalLight(0xd4af37, 3.2);
    this.rimLight.position.set(-5, 4.5, -3);
    this.scene.add(this.rimLight);

    // 5. Back Rim Light for crystal facet brilliance
    this.backLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.backLight.position.set(0, 5, -4.5);
    this.scene.add(this.backLight);

    // 6. Fill Light for liquid illumination
    this.fillLight = new THREE.PointLight(0xf59e0b, 3.2, 12);
    this.fillLight.position.set(0, 1.0, 2.2);
    this.scene.add(this.fillLight);

    // 7. Crown Sparkle Light
    this.topLight = new THREE.PointLight(0xffffff, 2.5, 9);
    this.topLight.position.set(0, 4.8, 0.6);
    this.scene.add(this.topLight);

    // Luxury Circular Mirror Podium
    const podiumGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.16, 64);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x15151e,
      metalness: 0.85,
      roughness: 0.25
    });
    this.podium = new THREE.Mesh(podiumGeo, podiumMat);
    this.podium.position.y = -0.08;
    this.podium.receiveShadow = true;
    this.scene.add(this.podium);

    const ringGeo = new THREE.TorusGeometry(2.52, 0.035, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.2
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.position.y = -0.01;
    this.ringMesh.rotation.x = Math.PI / 2;
    this.scene.add(this.ringMesh);

    const innerRingGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    this.innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    this.innerRing.position.y = -0.005;
    this.innerRing.rotation.x = Math.PI / 2;
    this.scene.add(this.innerRing);
  }

  initBottle() {
    this.bottle = new BottleModel();
    this.scene.add(this.bottle.group);
  }

  initMistSystem() {
    this.mistSystem = new MistParticleSystem(this.scene);
  }

  initAmbientParticles() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = Math.random() * 5.5 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      scales[i] = Math.random() * 0.05 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  initEvents() {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const currentW = rect.width || this.width;
      const currentH = rect.height || this.height;
      this.mouseX = ((e.clientX - rect.left) / currentW) * 2 - 1;
      this.mouseY = -(((e.clientY - rect.top) / currentH) * 2 - 1);

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.bottle.group.rotation.y += deltaX * 0.008;
        this.bottle.group.rotation.x = Math.max(-0.4, Math.min(0.4, this.bottle.group.rotation.x + deltaY * 0.004));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
        this.bottle.triggerWobble();
      }
    });

    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    el.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.bottle.group.rotation.y += deltaX * 0.01;
        this.bottle.group.rotation.x = Math.max(-0.4, Math.min(0.4, this.bottle.group.rotation.x + deltaY * 0.006));

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  onResize() {
    if (!this.container) return;
    const newWidth = this.container.clientWidth || (window.innerWidth > 1024 ? 620 : Math.max(320, window.innerWidth - 40));
    const newHeight = this.container.clientHeight || 640;
    
    if (newWidth > 0 && newHeight > 0) {
      this.width = newWidth;
      this.height = newHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }
  }

  sprayMist() {
    const nozzlePos = this.bottle.getNozzleWorldPosition();
    const currentColor = this.bottle.currentFragrance 
      ? this.bottle.currentFragrance.colorScheme.liquid 
      : 0xd4af37;

    this.mistSystem.spray(nozzlePos, new THREE.Vector3(0, 0.2, 1), currentColor);

    gsap.to(this.bottle.capGroup.position, {
      y: 2.8,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    this.bottle.triggerWobble();
  }

  toggleExplodedView() {
    const isExp = this.bottle.toggleExplodedView();
    if (isExp) {
      gsap.to(this.camera.position, { z: 7.2, y: 1.6, duration: 1.2, ease: 'power2.out' });
      this.autoRotate = false;
    } else {
      gsap.to(this.camera.position, { z: 6.2, y: 1.35, duration: 1.2, ease: 'power2.out' });
      this.autoRotate = true;
    }
    return isExp;
  }

  setFragrance(fragrance) {
    this.bottle.setFragrance(fragrance);

    const lightCol = new THREE.Color(fragrance.colorScheme.liquid);
    gsap.to(this.fillLight.color, {
      r: lightCol.r,
      g: lightCol.g,
      b: lightCol.b,
      duration: 1.0
    });
  }

  setCapMaterial(materialId) {
    this.bottle.setCapMaterial(materialId);
  }

  setEngraving(text) {
    this.bottle.setEngraving(text);
  }

  setSize(sizeId) {
    this.bottle.setSize(sizeId);
  }

  rotateToFront() {
    gsap.to(this.bottle.group.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.0,
      ease: 'power3.out'
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.autoRotate) {
      this.bottle.group.rotation.y += this.autoRotateSpeed;
      this.bottle.group.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
    }

    this.bottle.updateGoldFlakes(elapsedTime);

    if (!this.isDragging) {
      this.camera.position.x += (this.mouseX * 0.45 - this.camera.position.x) * 0.05;
      this.camera.position.y += ((1.35 + this.mouseY * 0.3) - this.camera.position.y) * 0.05;
      this.camera.lookAt(0, 1.25, 0);
    }

    if (this.ringMesh && this.innerRing) {
      this.ringMesh.rotation.z = elapsedTime * 0.04;
      this.innerRing.rotation.z = -elapsedTime * 0.06;
    }

    this.mistSystem.update(delta);

    if (this.ambientParticles) {
      const positions = this.ambientParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002 + 0.001;
        if (positions[i * 3 + 1] > 5.0) {
          positions[i * 3 + 1] = -0.2;
        }
      }
      this.ambientParticles.geometry.attributes.position.needsUpdate = true;
      this.ambientParticles.rotation.y = elapsedTime * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
