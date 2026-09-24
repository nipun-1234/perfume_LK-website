import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';
import { FRAGRANCES, CAP_MATERIALS, BOTTLE_SIZES, SCENT_QUIZ_QUESTIONS } from './data/fragrances.js';
import { PerfumeScene } from './three/PerfumeScene.js';
import { luxuryAudio } from './utils/audio.js';

// Safe Lucide Icon Renderer
function renderIcons(options = {}) {
  try {
    createIcons({
      icons,
      nameAttr: 'data-lucide',
      attrs: { class: 'lucide-icon' },
      ...options
    });
  } catch (err) {
    console.warn('Lucide icon rendering notice:', err);
  }
}

// Application State
const state = {
  currency: 'LKR', // 'LKR' or 'USD'
  rateLKRtoUSD: 308,
  selectedFragrance: FRAGRANCES[0],
  selectedCap: CAP_MATERIALS[0],
  selectedSize: BOTTLE_SIZES[1], // 100ml default
  customEngraving: 'OUD CEYLON NOIR',
  cart: [],
  discountMultiplier: 1.0,
  quizCurrentStep: 0,
  quizAnswers: [],
  soundOn: true
};

// 3D Scenes
let heroScene = null;
let studioScene = null;

// Currency Formatter
function formatPrice(lkrAmount, usdAmount) {
  if (state.currency === 'USD') {
    const usd = usdAmount || Math.round(lkrAmount / state.rateLKRtoUSD);
    return `$${usd.toLocaleString()}`;
  }
  return `Rs. ${lkrAmount.toLocaleString()}`;
}

// Global Toast System
window.showToast = function(message, icon = 'sparkles') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i data-lucide="${icon}" style="color: var(--gold-light); flex-shrink: 0;"></i>
    <span style="font-size: 0.88rem; font-weight: 500;">${message}</span>
  `;
  container.appendChild(toast);
  renderIcons({ root: toast });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// Initialize 3D Viewports
function init3DScenes() {
  try {
    const heroCanvas = document.getElementById('hero3dCanvas');
    if (heroCanvas) {
      heroScene = new PerfumeScene(heroCanvas);
      heroScene.setFragrance(state.selectedFragrance);
    }
  } catch (err) {
    console.error('Failed to initialize Hero 3D Scene:', err);
  }

  try {
    const studioCanvas = document.getElementById('studio3dCanvas');
    if (studioCanvas) {
      studioScene = new PerfumeScene(studioCanvas);
      studioScene.setFragrance(state.selectedFragrance);
    }
  } catch (err) {
    console.error('Failed to initialize Studio 3D Scene:', err);
  }
}

// Render Studio Blend Pills
function renderStudioBlends() {
  const grid = document.getElementById('blendSelectorGrid');
  if (!grid) return;

  grid.innerHTML = FRAGRANCES.map(f => {
    const isActive = f.id === state.selectedFragrance.id;
    const colorHex = '#' + f.colorScheme.liquid.toString(16).padStart(6, '0');
    return `
      <div class="blend-pill ${isActive ? 'active' : ''}" data-id="${f.id}">
        <div class="blend-color-dot" style="background-color: ${colorHex}; box-shadow: 0 0 10px ${colorHex}80;"></div>
        <div class="blend-pill-info">
          <span class="blend-pill-name">${f.name}</span>
          <span class="blend-pill-family">${f.family}</span>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.blend-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.dataset.id;
      const found = FRAGRANCES.find(f => f.id === id);
      if (found) {
        selectFragrance(found);
        luxuryAudio.playGlassChime();
      }
    });
  });
}

// Render Cap Material Options
function renderCapMaterials() {
  const row = document.getElementById('capMaterialsRow');
  if (!row) return;

  row.innerHTML = CAP_MATERIALS.map(c => {
    const isActive = c.id === state.selectedCap.id;
    return `
      <div class="cap-pill ${isActive ? 'active' : ''}" data-id="${c.id}" title="${c.desc}">
        <div class="cap-swatch" style="background-color: ${c.previewColor};"></div>
        <span class="cap-name">${c.name.split(' ')[0]}</span>
      </div>
    `;
  }).join('');

  row.querySelectorAll('.cap-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.dataset.id;
      const found = CAP_MATERIALS.find(c => c.id === id);
      if (found) {
        selectCap(found);
        luxuryAudio.playClick();
      }
    });
  });
}

// Select Fragrance Handler
function selectFragrance(fragrance) {
  state.selectedFragrance = fragrance;
  state.customEngraving = fragrance.name.toUpperCase();

  const engInput = document.getElementById('engravingInput');
  if (engInput) engInput.value = fragrance.name.toUpperCase();

  const blendSub = document.getElementById('selectedBlendFamily');
  if (blendSub) blendSub.textContent = fragrance.family;

  const labelBadge = document.getElementById('activeBottleLabel');
  if (labelBadge) labelBadge.textContent = `${fragrance.name} • ${state.selectedCap.name}`;

  const heroPhoto = document.getElementById('heroFeaturedPhoto');
  if (heroPhoto) {
    heroPhoto.style.opacity = '0.4';
    heroPhoto.src = fragrance.image;
    heroPhoto.alt = `${fragrance.name} Haute Flacon`;
    setTimeout(() => {
      heroPhoto.style.opacity = '1';
    }, 100);
  }

  const heroGlow = document.getElementById('heroPhotoGlow');
  if (heroGlow) {
    heroGlow.style.background = fragrance.colorScheme.ambientGlow;
  }

  const heroBadgeText = document.getElementById('heroPhotoBadgeText');
  if (heroBadgeText) {
    heroBadgeText.textContent = `${fragrance.badge} • ${fragrance.concentration}`;
  }

  const hint = document.getElementById('heroCanvasHint');
  const btnPhoto = document.getElementById('heroViewPhotoBtn');
  if (hint && btnPhoto && btnPhoto.classList.contains('active')) {
    hint.textContent = `Haute Photography • ${fragrance.name}`;
  }

  if (heroScene) heroScene.setFragrance(fragrance);
  if (studioScene) studioScene.setFragrance(fragrance);

  renderStudioBlends();
  renderNotesPyramid();
  updateStudioPrice();
  window.showToast(`Selected blend: ${fragrance.name}`, 'gem');
}

// Hero View Switcher (3D vs Haute Photography)
function setupHeroViewSwitch() {
  const btn3d = document.getElementById('heroView3dBtn');
  const btnPhoto = document.getElementById('heroViewPhotoBtn');
  const canvas3d = document.getElementById('hero3dCanvas');
  const photoShowcase = document.getElementById('heroPhotoShowcase');
  const hint = document.getElementById('heroCanvasHint');

  if (!btn3d || !btnPhoto) return;

  btn3d.addEventListener('click', () => {
    btn3d.classList.add('active');
    btnPhoto.classList.remove('active');
    if (canvas3d) canvas3d.style.display = 'block';
    if (photoShowcase) photoShowcase.style.display = 'none';
    if (hint) hint.textContent = 'Interactive 360° Studio • Click Spritz for Mist';
    if (heroScene) heroScene.onResize();
    luxuryAudio.playClick();
  });

  btnPhoto.addEventListener('click', () => {
    btnPhoto.classList.add('active');
    btn3d.classList.remove('active');
    if (canvas3d) canvas3d.style.display = 'none';
    if (photoShowcase) photoShowcase.style.display = 'flex';
    if (hint) hint.textContent = `Haute Photography • ${state.selectedFragrance.name}`;
    luxuryAudio.playClick();
  });
}

// Select Cap Handler
function selectCap(cap) {
  state.selectedCap = cap;

  const capLabel = document.getElementById('selectedCapLabel');
  if (capLabel) capLabel.textContent = cap.name;

  const labelBadge = document.getElementById('activeBottleLabel');
  if (labelBadge) labelBadge.textContent = `${state.selectedFragrance.name} • ${cap.name}`;

  if (heroScene) heroScene.setCapMaterial(cap.id);
  if (studioScene) studioScene.setCapMaterial(cap.id);

  renderCapMaterials();
}

// Select Size Handler
function setupSizeSelectors() {
  const pills = document.querySelectorAll('.size-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const sizeId = pill.dataset.size;
      const found = BOTTLE_SIZES.find(s => s.id === sizeId);
      if (found) {
        state.selectedSize = found;
        if (heroScene) heroScene.setSize(sizeId);
        if (studioScene) studioScene.setSize(sizeId);
        updateStudioPrice();
        luxuryAudio.playClick();
      }
    });
  });
}

// Engraving Input Handler
function setupEngravingInput() {
  const input = document.getElementById('engravingInput');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const text = e.target.value;
    state.customEngraving = text;

    if (heroScene) heroScene.setEngraving(text);
    if (studioScene) studioScene.setEngraving(text);
  });
}

// Update Studio Configurator Price
function updateStudioPrice() {
  const baseLKR = state.selectedFragrance.priceLKR;
  const baseUSD = state.selectedFragrance.priceUSD;
  const mult = state.selectedSize.multiplier;

  const totalLKR = Math.round(baseLKR * mult);
  const totalUSD = Math.round(baseUSD * mult);

  const priceEl = document.getElementById('studioPriceDisplay');
  if (priceEl) {
    priceEl.textContent = formatPrice(totalLKR, totalUSD);
  }
}

// Render Scent Pyramid (Odyssey)
function renderNotesPyramid() {
  const container = document.getElementById('notesPyramidContainer');
  const fragName = document.getElementById('activePyramidFragranceName');
  if (!container) return;

  const f = state.selectedFragrance;
  if (fragName) fragName.textContent = f.name;

  const tiers = [
    {
      tier: 'Top Notes (Head)',
      badge: 'First 15-30 Mins',
      desc: 'Immediate sensory greeting',
      notes: f.notes.top
    },
    {
      tier: 'Heart Notes (Heart)',
      badge: 'Hours 2 to 6',
      desc: 'The soul & character of the perfume',
      notes: f.notes.heart
    },
    {
      tier: 'Base Notes (Soul)',
      badge: 'Lasts 12-24+ Hours',
      desc: 'The enduring botanical memory & sillage',
      notes: f.notes.base
    }
  ];

  container.innerHTML = `
    <div class="odyssey-layout">
      <!-- Active Bottle Showcase Card -->
      <div class="pyramid-bottle-showcase">
        <span class="product-card-badge">${f.badge}</span>
        <div class="bottle-glow-disc" style="background: ${f.colorScheme.ambientGlow}; width: 220px; height: 220px;"></div>
        <img src="${f.image}" alt="${f.name}" class="pyramid-bottle-img" loading="lazy" onerror="this.src='/images/${f.id}.jpg'">
        <div style="margin-top: 0.5rem;">
          <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #ffffff;">${f.name}</h3>
          <p style="font-size: 0.78rem; color: var(--gold-light); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 0.2rem;">${f.family}</p>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.6rem; max-width: 270px; line-height: 1.5;">${f.description}</p>
        </div>
        <button class="btn-luxury-gold" id="pyramidExploreBtn" style="padding: 0.75rem 1.4rem; font-size: 0.8rem; margin-top: 0.6rem; width: 100%;">
          <i data-lucide="sparkles"></i>
          <span>Customize in 3D Atelier</span>
        </button>
      </div>

      <!-- Notes Tiers -->
      <div class="pyramid-tiers-wrapper">
        ${tiers.map(t => `
          <div class="pyramid-tier">
            <div class="tier-header">
              <div class="tier-title-wrap">
                <span class="tier-badge">${t.badge}</span>
                <h3 class="tier-title">${t.tier}</h3>
              </div>
              <span class="tier-duration">${t.desc}</span>
            </div>
            <div class="notes-grid">
              ${t.notes.map(n => `
                <div class="note-item-card">
                  <div class="note-item-icon">
                    <i data-lucide="${n.icon || 'sparkles'}"></i>
                  </div>
                  <h4 class="note-item-name">${n.name}</h4>
                  <p class="note-item-desc">${n.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  renderIcons({ root: container });

  document.getElementById('pyramidExploreBtn')?.addEventListener('click', () => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Render Haute Collection Grid
function renderCollection(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = filter === 'all' 
    ? FRAGRANCES 
    : FRAGRANCES.filter(f => f.family.toLowerCase().includes(filter.toLowerCase()));

  grid.innerHTML = filtered.map(f => {
    const colorHex = '#' + f.colorScheme.liquid.toString(16).padStart(6, '0');
    return `
      <div class="product-card" data-id="${f.id}">
        <span class="product-card-badge">${f.badge}</span>
        
        <div class="product-visual-box">
          <div class="bottle-glow-disc" style="background: ${f.colorScheme.ambientGlow};"></div>
          <img src="${f.image}" alt="${f.name}" class="product-card-img" loading="lazy" onerror="this.src='/images/${f.id}.jpg'">
        </div>

        <div class="product-card-info">
          <span class="product-family">${f.family}</span>
          <h3 class="product-title">${f.name}</h3>
          <p class="product-desc">${f.description}</p>

          <div class="product-meta-row">
            <div>
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Concentration</span>
              <span style="font-size: 0.8rem; color: var(--gold-light); font-weight: 500;">${f.concentration}</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Price</span>
              <span class="product-price">${formatPrice(f.priceLKR, f.priceUSD)}</span>
            </div>
          </div>

          <div class="product-actions-row">
            <button class="btn-luxury-gold add-to-bag-btn" data-id="${f.id}" style="padding: 0.75rem 1.2rem; font-size: 0.82rem;">
              <i data-lucide="shopping-bag"></i>
              <span>Add to Bag</span>
            </button>
            <button class="btn-luxury-glass load-3d-btn" data-id="${f.id}" title="Load in 3D Atelier" style="padding: 0.75rem 1rem;">
              <i data-lucide="eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderIcons({ root: grid });

  grid.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const fragrance = FRAGRANCES.find(f => f.id === id);
      if (fragrance) {
        addToCart({
          fragrance,
          size: BOTTLE_SIZES[1],
          cap: CAP_MATERIALS[0],
          engraving: fragrance.name.toUpperCase()
        });
      }
    });
  });

  grid.querySelectorAll('.load-3d-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const fragrance = FRAGRANCES.find(f => f.id === id);
      if (fragrance) {
        selectFragrance(fragrance);
        document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
        window.showToast(`Loaded ${fragrance.name} in 3D Atelier`, 'sparkles');
      }
    });
  });
}

// Setup Collection Filter Tabs
function setupCollectionFilters() {
  const filterBtns = document.querySelectorAll('#collectionFilterBar .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderCollection(filter);
      luxuryAudio.playClick();
    });
  });
}

// Scent Diagnostic Quiz
function renderQuiz() {
  const container = document.getElementById('quizQuestionContent');
  const progressFill = document.getElementById('quizProgressFill');
  if (!container) return;

  const currentStep = state.quizCurrentStep;
  const totalSteps = SCENT_QUIZ_QUESTIONS.length;

  if (currentStep >= totalSteps) {
    progressFill.style.width = '100%';
    
    const counts = {};
    state.quizAnswers.forEach(ans => {
      counts[ans] = (counts[ans] || 0) + 1;
    });
    let bestId = 'oud-ceylon-noir';
    let max = 0;
    for (const [id, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        bestId = id;
      }
    }
    const match = FRAGRANCES.find(f => f.id === bestId) || FRAGRANCES[0];

    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#f5d061', '#d4af37', '#ffffff', '#c5a059']
    });

    luxuryAudio.playSuccessShimmer();

    container.innerHTML = `
      <div class="quiz-result-box">
        <div style="width: 220px; height: 220px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--gold-border-bright); box-shadow: 0 0 35px ${match.colorScheme.ambientGlow}; margin-bottom: 0.5rem;">
          <img src="${match.image}" alt="${match.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <span class="section-tag">Your Ceylon Scent Destiny</span>
        <h3 class="section-title" style="font-size: 2.2rem;">${match.name}</h3>
        <p style="color: var(--gold-light); font-style: italic; font-size: 1.1rem;">"${match.subtitle}"</p>
        <p style="color: var(--text-secondary); max-width: 540px; font-size: 0.95rem; line-height: 1.7;">
          ${match.description}
        </p>

        <div style="display: flex; gap: 1rem; align-items: center; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
          <button class="btn-luxury-gold" id="quizLoad3dBtn">
            <i data-lucide="sparkles"></i>
            <span>Load in 3D Atelier & Customize</span>
          </button>
          <button class="btn-luxury-glass" id="quizRetakeBtn">
            <i data-lucide="rotate-ccw"></i>
            <span>Retake Scent Quiz</span>
          </button>
        </div>
      </div>
    `;

    renderIcons({ root: container });

    document.getElementById('quizLoad3dBtn')?.addEventListener('click', () => {
      selectFragrance(match);
      document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('quizRetakeBtn')?.addEventListener('click', () => {
      state.quizCurrentStep = 0;
      state.quizAnswers = [];
      renderQuiz();
    });

    return;
  }

  const q = SCENT_QUIZ_QUESTIONS[currentStep];
  progressFill.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;

  container.innerHTML = `
    <h3 class="quiz-question-title">${q.title}</h3>
    <p class="quiz-question-sub">${q.subtitle} (Step ${currentStep + 1} of ${totalSteps})</p>
    
    <div class="quiz-options-grid">
      ${q.options.map((opt, idx) => `
        <button class="quiz-opt-btn" data-fragrance="${opt.preferredFragrance}">
          <div class="quiz-opt-icon">
            <i data-lucide="${opt.icon || 'sparkles'}"></i>
          </div>
          <span style="font-size: 0.92rem; font-weight: 500; line-height: 1.5;">${opt.label}</span>
        </button>
      `).join('')}
    </div>
  `;

  renderIcons({ root: container });

  container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pref = btn.dataset.fragrance;
      state.quizAnswers.push(pref);
      state.quizCurrentStep++;
      luxuryAudio.playClick();
      renderQuiz();
    });
  });
}

// Shopping Cart Management
function addToCart(customItem) {
  const fragrance = customItem.fragrance;
  const size = customItem.size;
  const cap = customItem.cap;
  const engraving = customItem.engraving || fragrance.name.toUpperCase();

  const priceLKR = Math.round(fragrance.priceLKR * size.multiplier);
  const priceUSD = Math.round(fragrance.priceUSD * size.multiplier);

  const cartItemId = `${fragrance.id}-${size.id}-${cap.id}-${engraving}`;

  const existing = state.cart.find(i => i.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      cartItemId,
      fragranceId: fragrance.id,
      name: fragrance.name,
      image: fragrance.image,
      sizeLabel: size.label,
      capName: cap.name,
      engraving,
      priceLKR,
      priceUSD,
      quantity: 1
    });
  }

  updateCartUI();
  openCartDrawer();
  luxuryAudio.playSuccessShimmer();
  window.showToast(`Added ${fragrance.name} (${size.id}) to your bag!`, 'shopping-bag');
}

function updateCartUI() {
  const badge = document.getElementById('cartCountBadge');
  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotalDisplay');

  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.textContent = totalCount;

  if (!list) return;

  if (state.cart.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.4;"></i>
        <p style="font-size: 1rem; font-weight: 500;">Your fragrance bag is empty</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Explore our 3D atelier and craft your bespoke flacon.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0, 0);
    renderIcons({ root: list });
    return;
  }

  let totalLKR = 0;
  let totalUSD = 0;

  list.innerHTML = state.cart.map((item, idx) => {
    const itemTotalLKR = item.priceLKR * item.quantity;
    const itemTotalUSD = item.priceUSD * item.quantity;
    totalLKR += itemTotalLKR;
    totalUSD += itemTotalUSD;

    return `
      <div class="cart-item">
        <div class="cart-item-preview" style="padding: 0; overflow: hidden;">
          <img src="${item.image || '/images/oud-ceylon-noir.jpg'}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm);">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-engraving">Engraving: "${item.engraving}"</span>
          <span class="cart-item-details">${item.sizeLabel} • ${item.capName}</span>
          <span class="cart-item-price">${formatPrice(item.priceLKR, item.priceUSD)} × ${item.quantity}</span>
        </div>
        <button class="cart-item-remove" data-index="${idx}" title="Remove Item">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
  }).join('');

  renderIcons({ root: list });

  const discountedLKR = Math.round(totalLKR * state.discountMultiplier);
  const discountedUSD = Math.round(totalUSD * state.discountMultiplier);

  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(discountedLKR, discountedUSD);
  }

  list.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      state.cart.splice(idx, 1);
      updateCartUI();
      luxuryAudio.playClick();
    });
  });
}

function openCartDrawer() {
  document.getElementById('cartOverlay')?.classList.add('active');
  document.getElementById('cartDrawer')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.getElementById('cartDrawer')?.classList.remove('active');
}

// Promo Code System
function setupPromoCode() {
  const btn = document.getElementById('applyPromoBtn');
  const input = document.getElementById('promoCodeInput');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (code === 'CEYLON10') {
      state.discountMultiplier = 0.9;
      updateCartUI();
      window.showToast('✦ 10% Royal Heritage Discount Applied!', 'check-circle');
      luxuryAudio.playSuccessShimmer();
    } else if (code === '') {
      window.showToast('Please enter a valid promo code.', 'alert-circle');
    } else {
      window.showToast('Invalid promo code. Try "CEYLON10"', 'alert-triangle');
    }
  });
}

// Spritzer & Exploded Anatomy Handlers
function setupSpritzerAndStudioTools() {
  const triggerSpray = () => {
    if (heroScene) heroScene.sprayMist();
    if (studioScene) studioScene.sprayMist();
    luxuryAudio.playSpraySound();
    window.showToast(`✦ Spritzed ${state.selectedFragrance.name} — Pure Botanical Mist`, 'spray-can');
  };

  document.getElementById('heroSpritzerBtn')?.addEventListener('click', triggerSpray);
  document.getElementById('studioSpritzBtn')?.addEventListener('click', triggerSpray);

  // Exploded / Anatomy view button
  const explodeBtn = document.getElementById('studioExplodeBtn');
  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      if (studioScene) {
        const isExp = studioScene.toggleExplodedView();
        explodeBtn.classList.toggle('active', isExp);
        luxuryAudio.playGlassChime();
        window.showToast(isExp ? '✦ Anatomy View: Separated Crystal Flacon' : '✦ Sealed Crystal Flacon', 'layers');
      }
    });
  }

  document.getElementById('studioResetBtn')?.addEventListener('click', () => {
    if (studioScene) studioScene.rotateToFront();
    luxuryAudio.playClick();
  });

  let spinning = true;
  document.getElementById('studioSpinBtn')?.addEventListener('click', () => {
    spinning = !spinning;
    if (studioScene) studioScene.autoRotate = spinning;
    window.showToast(spinning ? '360° Auto-Rotation Enabled' : 'Auto-Rotation Paused', 'rotate-cw');
    luxuryAudio.playClick();
  });
}

// Discovery Box Order Handler
function setupDiscoveryVault() {
  const btn = document.getElementById('orderDiscoveryBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    state.cart.push({
      cartItemId: 'discovery-vault-coffret',
      fragranceId: 'vault',
      name: 'The Ceylon Discovery Vault (5× 5ml Extraits)',
      image: '/images/ceylon-discovery-vault.jpg',
      sizeLabel: '5× 5ml Coffret Presentation',
      capName: '24K Gold Pocket Atomizers',
      engraving: 'ROYAL DISCOVERY SET',
      priceLKR: 18500,
      priceUSD: 60,
      quantity: 1
    });

    updateCartUI();
    openCartDrawer();
    luxuryAudio.playSuccessShimmer();
    window.showToast('✦ Added Ceylon Discovery Vault to your bag!', 'gift');
  });
}

// Add Bespoke Flacon to Cart CTA
function setupStudioAddToCart() {
  const btn = document.getElementById('addCustomToBagBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    addToCart({
      fragrance: state.selectedFragrance,
      size: state.selectedSize,
      cap: state.selectedCap,
      engraving: state.customEngraving
    });
  });
}

// Currency Switcher
function setupCurrencyToggle() {
  const btn = document.getElementById('currencyToggle');
  const label = document.getElementById('currencyLabel');
  if (!btn) return;

  btn.addEventListener('click', () => {
    state.currency = state.currency === 'LKR' ? 'USD' : 'LKR';
    if (label) label.textContent = state.currency === 'LKR' ? 'LKR (Rs.)' : 'USD ($)';
    updateStudioPrice();
    renderCollection();
    updateCartUI();
    luxuryAudio.playClick();
    window.showToast(`Currency switched to ${state.currency}`, 'dollar-sign');
  });
}

// Audio Sound Mute Toggle
function setupSoundToggle() {
  const btn = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isEnabled = luxuryAudio.toggle();
    state.soundOn = isEnabled;
    icon.setAttribute('data-lucide', isEnabled ? 'volume-2' : 'volume-x');
    renderIcons({ root: btn });
    window.showToast(isEnabled ? 'Sound Feedback Enabled' : 'Sound Muted', isEnabled ? 'volume-2' : 'volume-x');
  });
}

// Checkout Button & Confetti Order Confirmation
function setupCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) {
      window.showToast('Please add items to your fragrance bag first.', 'alert-circle');
      return;
    }

    confetti({
      particleCount: 190,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#f5d061', '#d4af37', '#ffffff', '#a84a13', '#1a73e8']
    });

    luxuryAudio.playSuccessShimmer();

    const orderId = 'LK-' + Math.floor(100000 + Math.random() * 900000);
    closeCartDrawer();

    setTimeout(() => {
      alert(`✦ THANK YOU FOR YOUR LUXURY ORDER ✦\n\nOrder Ref: ${orderId}\nYour bespoke Ceylon artisanal flacon is being hand-crafted and prepared for insured express delivery.\n\nA tracking code has been dispatched to your private concierge.`);
      state.cart = [];
      updateCartUI();
    }, 400);
  });
}

// Navigation links scroll spy & active state
function setupNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    l.addEventListener('click', (e) => {
      links.forEach(lnk => lnk.classList.remove('active'));
      l.classList.add('active');
    });
  });

  document.getElementById('cartTrigger')?.addEventListener('click', openCartDrawer);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);
}

// DOM Content Loaded / Boot
document.addEventListener('DOMContentLoaded', () => {
  renderIcons();
  init3DScenes();
  renderStudioBlends();
  renderCapMaterials();
  setupSizeSelectors();
  setupEngravingInput();
  updateStudioPrice();
  renderNotesPyramid();
  renderCollection('all');
  setupCollectionFilters();
  renderQuiz();
  setupPromoCode();
  setupSpritzerAndStudioTools();
  setupHeroViewSwitch();
  setupDiscoveryVault();
  setupStudioAddToCart();
  setupCurrencyToggle();
  setupSoundToggle();
  setupCheckout();
  setupNavigation();
  updateCartUI();

  setTimeout(() => {
    window.showToast('✦ Welcome to Perfume.lk — Ceylon Haute Parfumerie', 'sparkles');
  }, 1000);
});
