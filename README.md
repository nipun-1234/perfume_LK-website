# 🌸 Perfume.lk — Luxury 3D Fragrance Experience

**Perfume.lk** is a world-class, high-performance 3D web experience for Sri Lanka's premier luxury haute perfumery house. It showcases Ceylon's finest artisanal fragrances through real-time WebGL visuals, interactive bottle customization, an immersive scent-notes explorer, a bespoke scent finder, and a refined shopping experience.

---

## ✨ Overview

Perfume.lk blends cinematic 3D visuals with a luxury-inspired interface to reimagine online fragrance shopping. From a fully customizable crystal bottle to a Ceylon-botanical scent pyramid, every interaction is designed to feel tactile, sensory, and premium.

---

## 🌟 Key Features

- 🧴 **Interactive 3D Perfume Bottle** — high-poly crystal bottle with realistic glass refraction, 360° drag rotation, and mouse parallax
- ✨ **Real-Time Bottle Customization** — live fragrance blend, liquid tint, and bottle size (50ml / 100ml) changes
- 🎨 **Custom Cap Finishes** — Brushed Gold, Obsidian Onyx, Rose Gold, and Chrome
- ✍️ **Personalized Engraving** — live canvas-texture name engraving on the bottle glass
- 💨 **Interactive Spray Effects** — 3D particle mist bursts with velocity/dissipation physics and synced audio
- 🌿 **Scent Pyramid & Ingredient Explorer** — interactive Top / Heart / Base notes with Sri Lankan botanicals (Ceylon Cinnamon, Blue Lotus, Sandalwood)
- 🎯 **Bespoke Scent Finder Quiz** — a 3-step sensory quiz matching personality to a signature Ceylon blend
- 🛍️ **Haute Collection & Shopping Cart** — filterable catalog, quick 3D preview, slide-out cart, and coupon support
- 💱 **Dual Currency** — instant LKR ⇄ USD toggle
- 🔊 **Web Audio Sensory Feedback** — synthesized spray mist, glass chime, and luxury click sounds (no external audio assets)
- 📱 **Fully Responsive** — optimized for desktop, tablet, and mobile
- ⚡ **Optimized WebGL Performance** — built for a smooth 60fps experience

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Build Tool | Vite |
| 3D / WebGL | Three.js |
| Animation | GSAP |
| Icons | Lucide Icons |
| Graphics | HTML Canvas |
| Audio | Web Audio API |
| Styling | Glassmorphism + Luxury Dark UI |
| Currency | LKR / USD |

---

## 🎨 Design Concept

The visual identity draws on **Ceylon Haute Parfumerie** aesthetics:

- **Obsidian Black** `#08080a`
- **Champagne Gold** `#d4af37`
- Frosted glass surfaces and ambient glow
- Luxury serif typography (Cormorant / Cinzel) for headings
- Modern geometric body typography (Inter / Outfit)
- Floating particle effects and studio-style lighting

---

## 🧪 Featured Fragrances

- Ceylon Royal Oud
- Ceylon Spiced Vanilla
- Nil Manel Lotus
- Kandy Amber
- Galle Fort Breeze

---

## 🚀 Experience Flow

```
Hero
  ↓
3D Bespoke Bottle Studio
  ↓
Scent Pyramid & Ingredient Explorer
  ↓
Haute Fragrance Collection
  ↓
Bespoke Scent Finder
  ↓
Luxury Cart & Checkout
```

---

## 📁 Project Structure

```
3d-website/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── styles/
│   │   └── main.css
│   ├── three/
│   │   ├── PerfumeScene.js        # Scene setup, lighting, reflections, particles
│   │   ├── BottleModel.js         # Procedural crystal bottle, materials, engraving
│   │   ├── MistParticleSystem.js  # Spray mist particle physics
│   │   └── NotesVisualizer3D.js   # Scent pyramid / orbital note nodes
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── StudioCustomizer.js
│   │   ├── ScentPyramid.js
│   │   ├── ProductCatalog.js
│   │   ├── ScentFinderQuiz.js
│   │   ├── CartDrawer.js
│   │   └── Footer.js
│   ├── utils/
│   │   └── audio.js                # Web Audio synthesized sound effects
│   └── data/
│       └── fragrances.js           # Product & fragrance data
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 3d-website

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## ✅ Verification & Testing

**Build Verification**
- `npm run build` completes without module or syntax errors
- `npm run dev` starts a clean local dev server

**Manual & Interactive Testing**
- 3D bottle rendering, rotation, zoom, and mouse parallax
- Real-time customization: liquid color transitions, cap finish changes, live label engraving
- Spray mist particle animation with synced Web Audio effect
- Scent Finder quiz flow and recommendation accuracy
- Cart functionality: add/remove items, LKR ⇄ USD conversion, promo code `CEYLON10`
- Responsive layout across desktop and mobile viewports

---

## 📜 License

This project is proprietary to Perfume.lk. All rights reserved.
Developed By Nipun Sudusinghe.

---

<p align="center">Crafted with ✨ for the art of Ceylon fragrance.</p>
