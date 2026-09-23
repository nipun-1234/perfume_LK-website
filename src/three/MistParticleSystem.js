import * as THREE from 'three';

export class MistParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.maxParticles = 600;
    this.particles = [];
    
    // Create mist texture dynamically with canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(235, 215, 160, 0.7)');
    grad.addColorStop(0.7, 'rgba(200, 180, 120, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    this.mistTexture = new THREE.CanvasTexture(canvas);

    // Particle Geometry & Material
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);
    this.opacities = new Float32Array(this.maxParticles);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.material = new THREE.PointsMaterial({
      size: 0.2,
      map: this.mistTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    // Initialize all particles inactive
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        size: 0.1,
        color: new THREE.Color(0xffffff)
      });
      this.positions[i * 3] = 0;
      this.positions[i * 3 + 1] = -1000;
      this.positions[i * 3 + 2] = 0;
      this.sizes[i] = 0;
    }
  }

  spray(origin, forwardDir = new THREE.Vector3(0, 0.3, 1), sprayColor = 0xf5d061) {
    const sprayCount = 180;
    let activated = 0;
    const baseColor = new THREE.Color(sprayColor);

    for (let i = 0; i < this.maxParticles && activated < sprayCount; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.8 + Math.random() * 0.9;
        p.pos.copy(origin);

        // Conical spray dispersion
        const spreadX = (Math.random() - 0.5) * 0.65;
        const spreadY = (Math.random() - 0.2) * 0.55;
        const spreadZ = 0.6 + Math.random() * 0.8;

        const vel = new THREE.Vector3(spreadX, spreadY, spreadZ);
        vel.normalize();
        vel.multiplyScalar(3.5 + Math.random() * 4.5);
        p.vel.copy(vel);

        p.size = 0.12 + Math.random() * 0.25;

        // Color variation: mix between gold and mist white
        if (Math.random() > 0.4) {
          p.color.copy(baseColor);
        } else {
          p.color.setRGB(1, 0.95, 0.85);
        }

        activated++;
      }
    }
  }

  update(delta) {
    const posAttr = this.geometry.attributes.position;
    const colorAttr = this.geometry.attributes.color;
    const sizeAttr = this.geometry.attributes.size;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];
      if (p.active) {
        p.life += delta;
        if (p.life >= p.maxLife) {
          p.active = false;
          posAttr.setXYZ(i, 0, -1000, 0);
          sizeAttr.setX(i, 0);
          continue;
        }

        // Apply drag/air resistance and slight upward drift
        p.vel.multiplyScalar(0.94);
        p.vel.y += 0.4 * delta; // thermal lift
        p.pos.addScaledVector(p.vel, delta);

        const progress = p.life / p.maxLife;
        const currentSize = p.size * (1 + progress * 2.5); // expands as mist billows
        const alpha = Math.sin(progress * Math.PI) * (1 - progress * 0.4);

        posAttr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
        colorAttr.setXYZ(i, p.color.r * alpha, p.color.g * alpha, p.color.b * alpha);
        sizeAttr.setX(i, currentSize);
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  }
}
