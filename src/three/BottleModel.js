import * as THREE from 'three';
import gsap from 'gsap';

export class BottleModel {
  constructor() {
    this.group = new THREE.Group();
    this.currentFragrance = null;
    this.currentCapMaterialId = 'gold';
    this.engravedText = 'PERFUME.LK';
    this.subtitleText = 'EXTRAIT DE PARFUM';
    this.isExploded = false;

    this.labelCanvas = document.createElement('canvas');
    this.labelCanvas.width = 1024;
    this.labelCanvas.height = 1024;
    this.labelCtx = this.labelCanvas.getContext('2d');
    this.labelTexture = new THREE.CanvasTexture(this.labelCanvas);
    this.labelTexture.anisotropy = 8;

    this.initMaterials();
    this.createGeometry();
    this.initGoldFlakes();
    this.updateLabel();
  }

  initMaterials() {
    // Ultra-High Index Crystal Glass Material (Sparkling reflections + transparency)
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      roughness: 0.05,
      metalness: 0.05,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.8
    });

    // Fragrance Liquid Core Material (Vibrant glowing liquid)
    this.liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0xc67d26,
      emissive: 0x3d1f05,
      emissiveIntensity: 0.5,
      roughness: 0.12,
      metalness: 0.15,
      transparent: true,
      opacity: 0.96
    });

    // Cap / Metallic Collar Material (24K Gold default)
    this.capMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.96,
      roughness: 0.20,
      envMapIntensity: 2.0
    });

    this.collarMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 2.2
    });

    // Dip Tube Material
    this.dipTubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1
    });

    // Label Front Material
    this.labelMaterial = new THREE.MeshStandardMaterial({
      map: this.labelTexture,
      transparent: true,
      roughness: 0.35,
      metalness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    // 24K Gold Flake Material
    this.goldFlakeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdf78,
      metalness: 0.98,
      roughness: 0.1,
      emissive: 0x855f0d,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide
    });
  }

  createGeometry() {
    // 1. Crystal Bottle Body Outer
    const bottleShape = new THREE.Shape();
    const width = 1.45;
    const height = 2.05;
    const radius = 0.26;

    const x = -width / 2;
    const y = -height / 2;
    bottleShape.moveTo(x + radius, y);
    bottleShape.lineTo(x + width - radius, y);
    bottleShape.quadraticCurveTo(x + width, y, x + width, y + radius);
    bottleShape.lineTo(x + width, y + height - radius);
    bottleShape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    bottleShape.lineTo(x + radius, y + height);
    bottleShape.quadraticCurveTo(x, y + height, x, y + height - radius);
    bottleShape.lineTo(x, y + radius);
    bottleShape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: 0.92,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.14,
      bevelThickness: 0.14
    };

    const outerGeo = new THREE.ExtrudeGeometry(bottleShape, extrudeSettings);
    outerGeo.center();
    this.outerMesh = new THREE.Mesh(outerGeo, this.glassMaterial);
    this.outerMesh.position.y = 1.1;
    this.outerMesh.castShadow = true;
    this.outerMesh.receiveShadow = true;
    this.group.add(this.outerMesh);

    // 2. Liquid Core Mesh
    const liquidShape = new THREE.Shape();
    const lWidth = 1.22;
    const lHeight = 1.72;
    const lRadius = 0.19;
    const lx = -lWidth / 2;
    const ly = -lHeight / 2;

    liquidShape.moveTo(lx + lRadius, ly);
    liquidShape.lineTo(lx + lWidth - lRadius, ly);
    liquidShape.quadraticCurveTo(lx + lWidth, ly, lx + lWidth, ly + lRadius);
    liquidShape.lineTo(lx + lWidth, ly + lHeight - lRadius);
    liquidShape.quadraticCurveTo(lx + lWidth, ly + lHeight, lx + lWidth - lRadius, ly + lHeight);
    liquidShape.lineTo(lx + lRadius, ly + lHeight);
    liquidShape.quadraticCurveTo(lx, ly + lHeight, lx, ly + lHeight - lRadius);
    liquidShape.lineTo(lx, ly + lRadius);
    liquidShape.quadraticCurveTo(lx, ly, lx + lRadius, ly);

    const liquidExtrudeSettings = {
      depth: 0.74,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07
    };

    const liquidGeo = new THREE.ExtrudeGeometry(liquidShape, liquidExtrudeSettings);
    liquidGeo.center();
    this.liquidMesh = new THREE.Mesh(liquidGeo, this.liquidMaterial);
    this.liquidMesh.position.set(0, 1.0, 0);
    this.group.add(this.liquidMesh);

    // 3. Heavy Glass Base Reinforcement
    const baseGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.38, 32);
    this.baseMesh = new THREE.Mesh(baseGeo, this.glassMaterial);
    this.baseMesh.position.y = 0.15;
    this.group.add(this.baseMesh);

    // 4. Bottle Neck & Collar
    const neckGeo = new THREE.CylinderGeometry(0.33, 0.39, 0.45, 32);
    this.neckMesh = new THREE.Mesh(neckGeo, this.glassMaterial);
    this.neckMesh.position.y = 2.32;
    this.group.add(this.neckMesh);

    const collarGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.36, 32);
    this.collarMesh = new THREE.Mesh(collarGeo, this.collarMaterial);
    this.collarMesh.position.y = 2.48;
    this.group.add(this.collarMesh);

    // Atomizer Nozzle Tip
    const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16);
    this.nozzleMesh = new THREE.Mesh(nozzleGeo, this.collarMaterial);
    this.nozzleMesh.position.set(0, 2.70, 0.06);
    this.nozzleMesh.rotation.x = Math.PI / 2;
    this.group.add(this.nozzleMesh);

    // 5. Dip Tube inside the liquid
    const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.15, 16);
    this.tubeMesh = new THREE.Mesh(tubeGeo, this.dipTubeMaterial);
    this.tubeMesh.position.set(0.02, 1.3, 0);
    this.tubeMesh.rotation.z = 0.035;
    this.group.add(this.tubeMesh);

    // 6. Luxury Cap
    this.capGroup = new THREE.Group();
    
    // Main Cap Body
    const capMainGeo = new THREE.CylinderGeometry(0.53, 0.49, 0.92, 8);
    const capMainMesh = new THREE.Mesh(capMainGeo, this.capMaterial);
    capMainMesh.castShadow = true;
    this.capGroup.add(capMainMesh);

    // Cap Gold Crown Inlay
    const capCrownGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.09, 32);
    const capCrownMesh = new THREE.Mesh(capCrownGeo, this.collarMaterial);
    capCrownMesh.position.y = 0.47;
    this.capGroup.add(capCrownMesh);

    // Cap Ring Accent
    const capRingGeo = new THREE.TorusGeometry(0.50, 0.04, 16, 32);
    const capRingMesh = new THREE.Mesh(capRingGeo, this.collarMaterial);
    capRingMesh.position.y = -0.42;
    capRingMesh.rotation.x = Math.PI / 2;
    this.capGroup.add(capRingMesh);

    this.capGroup.position.set(0, 2.95, 0);
    this.group.add(this.capGroup);

    // 7. Front Label Mesh
    const labelPlaneGeo = new THREE.PlaneGeometry(1.18, 1.54);
    this.labelMesh = new THREE.Mesh(labelPlaneGeo, this.labelMaterial);
    this.labelMesh.position.set(0, 1.05, 0.60);
    this.group.add(this.labelMesh);
  }

  initGoldFlakes() {
    this.flakesGroup = new THREE.Group();
    this.flakes = [];
    const flakeCount = 45;
    const flakeGeo = new THREE.PlaneGeometry(0.04, 0.04);

    for (let i = 0; i < flakeCount; i++) {
      const mesh = new THREE.Mesh(flakeGeo, this.goldFlakeMaterial);
      const px = (Math.random() - 0.5) * 0.9;
      const py = 0.3 + Math.random() * 1.3;
      const pz = (Math.random() - 0.5) * 0.5;

      mesh.position.set(px, py, pz);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.6 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      this.flakes.push({
        mesh,
        origY: py,
        speed: 0.3 + Math.random() * 0.5,
        rotSpeedX: (Math.random() - 0.5) * 2,
        rotSpeedY: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2
      });

      this.flakesGroup.add(mesh);
    }

    this.group.add(this.flakesGroup);
  }

  updateGoldFlakes(time) {
    if (!this.flakes) return;
    this.flakes.forEach(f => {
      f.mesh.position.y = f.origY + Math.sin(time * f.speed + f.phase) * 0.12;
      f.mesh.rotation.x += f.rotSpeedX * 0.01;
      f.mesh.rotation.y += f.rotSpeedY * 0.01;
    });
  }

  // Safe Cross-Browser Rounded Rect
  drawSafeRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  updateLabel() {
    const ctx = this.labelCtx;
    const w = this.labelCanvas.width;
    const h = this.labelCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Label Card Base: Matte obsidian
    ctx.fillStyle = 'rgba(10, 10, 14, 0.92)';
    this.drawSafeRoundedRect(ctx, 40, 40, w - 80, h - 80, 24);
    ctx.fill();

    // Metallic Gold Border (Double line)
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 2;
    this.drawSafeRoundedRect(ctx, 56, 56, w - 112, h - 112, 16);
    ctx.stroke();

    // Corner Ornaments
    this.drawCornerDecor(ctx, 75, 75);
    this.drawCornerDecor(ctx, w - 75, 75, true, false);
    this.drawCornerDecor(ctx, 75, h - 75, false, true);
    this.drawCornerDecor(ctx, w - 75, h - 75, true, true);

    // Ceylon Royal Crest Icon
    ctx.fillStyle = '#e5c158';
    ctx.font = 'bold 36px "Cinzel", "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  CEYLON  ✦', w / 2, 150);

    // Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 68px "Cinzel", "Cormorant Garamond", serif';
    ctx.fillText('PERFUME.LK', w / 2, 240);

    // Divider Line
    const grad = ctx.createLinearGradient(w / 2 - 200, 0, w / 2 + 200, 0);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    grad.addColorStop(0.5, 'rgba(212, 175, 55, 1)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 220, 290);
    ctx.lineTo(w / 2 + 220, 290);
    ctx.stroke();

    // Fragrance Name / Custom Engraving
    ctx.fillStyle = '#f5e6b8';
    ctx.font = '600 52px "Cinzel", "Cormorant Garamond", serif';
    const mainTitle = this.engravedText.toUpperCase();
    ctx.fillText(mainTitle, w / 2, 420);

    // Subtitle / Concentration
    ctx.fillStyle = '#c5a059';
    ctx.font = '400 32px "Inter", "Outfit", sans-serif';
    ctx.fillText(this.subtitleText.toUpperCase(), w / 2, 500);

    // Batch & Origin stamp
    ctx.fillStyle = '#9ca3af';
    ctx.font = '300 24px "Inter", "Outfit", sans-serif';
    ctx.fillText('HAUTE PARFUMERIE • PURE BOTANICAL EXTRACT', w / 2, 620);
    ctx.fillText('HAND-CRAFTED IN SRI LANKA', w / 2, 665);

    // Volume & Proof
    ctx.fillStyle = '#d4af37';
    ctx.font = '500 28px "Cinzel", serif';
    ctx.fillText('100 ML • 80% VOL. • 3.4 FL. OZ.', w / 2, 780);

    // Seal of Authenticity
    ctx.font = '22px "Cinzel", serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
    ctx.fillText('★ ★ ★  ROYAL BOTANICAL RESERVE  ★ ★ ★', w / 2, 880);

    this.labelTexture.needsUpdate = true;
  }

  drawCornerDecor(ctx, x, y, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(0, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(4, 4, 5, 5);
    ctx.restore();
  }

  setFragrance(fragrance) {
    this.currentFragrance = fragrance;
    this.engravedText = fragrance.name;
    this.subtitleText = fragrance.concentration || 'EXTRAIT DE PARFUM';

    const targetColor = new THREE.Color(fragrance.colorScheme.liquid);
    const targetEmissive = new THREE.Color(fragrance.colorScheme.liquidEmissive || 0x111111);

    gsap.to(this.liquidMaterial.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to(this.liquidMaterial.emissive, {
      r: targetEmissive.r,
      g: targetEmissive.g,
      b: targetEmissive.b,
      duration: 1.2,
      ease: 'power2.out'
    });

    if (fragrance.colorScheme.cap) {
      this.setCapMaterial(fragrance.colorScheme.cap);
    }

    this.updateLabel();
  }

  setCapMaterial(materialId) {
    this.currentCapMaterialId = materialId;
    let targetColor = 0xd4af37;
    let roughness = 0.20;
    let metalness = 0.96;

    switch (materialId) {
      case 'obsidian':
        targetColor = 0x121216;
        roughness = 0.12;
        metalness = 0.85;
        break;
      case 'rose-gold':
        targetColor = 0xb76e79;
        roughness = 0.18;
        metalness = 0.94;
        break;
      case 'chrome':
        targetColor = 0xe5e7eb;
        roughness = 0.06;
        metalness = 0.98;
        break;
      case 'gold':
      default:
        targetColor = 0xd4af37;
        roughness = 0.20;
        metalness = 0.96;
        break;
    }

    const col = new THREE.Color(targetColor);
    gsap.to(this.capMaterial.color, {
      r: col.r,
      g: col.g,
      b: col.b,
      duration: 0.8,
      ease: 'power2.out'
    });
    gsap.to(this.capMaterial, {
      roughness,
      metalness,
      duration: 0.8
    });
  }

  setEngraving(text) {
    if (!text || text.trim() === '') {
      this.engravedText = this.currentFragrance ? this.currentFragrance.name : 'PERFUME.LK';
    } else {
      this.engravedText = text.trim();
    }
    this.updateLabel();
  }

  setSize(sizeId) {
    let scale = 1.0;
    if (sizeId === '50ml') scale = 0.85;
    if (sizeId === '200ml') scale = 1.18;

    gsap.to(this.group.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.8,
      ease: 'back.out(1.5)'
    });
  }

  toggleExplodedView() {
    this.isExploded = !this.isExploded;
    const dur = 1.2;
    const ease = 'power3.inOut';

    if (this.isExploded) {
      gsap.to(this.capGroup.position, { y: 4.3, duration: dur, ease });
      gsap.to(this.nozzleMesh.position, { y: 3.4, duration: dur, ease });
      gsap.to(this.collarMesh.position, { y: 3.1, duration: dur, ease });
      gsap.to(this.outerMesh.position, { z: 0.5, duration: dur, ease });
      gsap.to(this.labelMesh.position, { z: 1.15, duration: dur, ease });
      gsap.to(this.liquidMesh.position, { z: -0.4, duration: dur, ease });
      gsap.to(this.tubeMesh.position, { x: 0.6, y: 1.6, duration: dur, ease });
      gsap.to(this.baseMesh.position, { y: -0.4, duration: dur, ease });
    } else {
      gsap.to(this.capGroup.position, { y: 2.95, duration: dur, ease });
      gsap.to(this.nozzleMesh.position, { y: 2.70, duration: dur, ease });
      gsap.to(this.collarMesh.position, { y: 2.48, duration: dur, ease });
      gsap.to(this.outerMesh.position, { z: 0, duration: dur, ease });
      gsap.to(this.labelMesh.position, { z: 0.60, duration: dur, ease });
      gsap.to(this.liquidMesh.position, { z: 0, duration: dur, ease });
      gsap.to(this.tubeMesh.position, { x: 0.02, y: 1.3, duration: dur, ease });
      gsap.to(this.baseMesh.position, { y: 0.15, duration: dur, ease });
    }

    return this.isExploded;
  }

  triggerWobble() {
    gsap.fromTo(
      this.liquidMesh.position,
      { y: 0.95, z: 0.04 },
      { y: 1.0, z: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' }
    );
  }

  getNozzleWorldPosition() {
    const pos = new THREE.Vector3();
    this.group.getWorldPosition(pos);
    const nozzleOffset = new THREE.Vector3(0, 2.7 * this.group.scale.y, 0.1 * this.group.scale.z);
    nozzleOffset.applyEuler(this.group.rotation);
    return pos.add(nozzleOffset);
  }
}
