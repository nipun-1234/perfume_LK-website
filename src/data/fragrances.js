import oudImg from '../assets/images/oud-ceylon-noir.jpg';
import nilManelImg from '../assets/images/nil-manel-elixir.jpg';
import galleFortImg from '../assets/images/galle-fort-imperial.jpg';
import nuwaraEliyaImg from '../assets/images/nuwara-eliya-mist.jpg';
import kandyAmberImg from '../assets/images/kandy-sacred-amber.jpg';

export const FRAGRANCES = [
  {
    id: 'oud-ceylon-noir',
    name: 'Oud Ceylon Noir',
    subtitle: 'Extract of Wild Adam\'s Peak Aquilaria & Smoked Cinnamon',
    family: 'Woody & Oriental',
    badge: 'Signature Extract',
    priceLKR: 38500,
    priceUSD: 125,
    volume: '100ml / 3.4 FL. OZ. Extrait de Parfum',
    concentration: 'Extrait de Parfum (32% Oil)',
    rating: 4.9,
    reviewsCount: 148,
    image: oudImg,
    colorScheme: {
      liquid: 0xc67d26,      // Deep Amber Gold
      liquidEmissive: 0x3d1f05,
      glassTint: 0xffffff,
      cap: 'gold',
      ambientGlow: 'rgba(212, 175, 55, 0.45)',
      bgGradient: 'radial-gradient(circle at center, rgba(198, 125, 38, 0.15) 0%, rgba(8, 8, 10, 0.95) 70%)'
    },
    description: 'An opulent, enigmatic masterpiece distilled from rare Sri Lankan wild agarwood, harvested in the misty rainforests surrounding Adam\'s Peak, blended with Ceylon royal cinnamon bark and dark bourbon vanilla.',
    notes: {
      top: [
        { name: 'Ceylon Cinnamon Bark', icon: 'sparkles', desc: 'Warm, spicy and aromatic, hand-peeled in Matara' },
        { name: 'Bergamot of Calabria', icon: 'sun', desc: 'Sparkling citrus opening with sun-drenched brightness' },
        { name: 'Pink Peppercorn', icon: 'flame', desc: 'Vibrant rosy warmth and sparkling piquancy' }
      ],
      heart: [
        { name: 'Wild Ceylon Aquilaria Oud', icon: 'gem', desc: 'Resinous, smoky, deeply spiritual dark wood' },
        { name: 'Kandy Sandalwood', icon: 'tree-pine', desc: 'Creamy, velvety heart wood from sacred groves' },
        { name: 'Black Saffron', icon: 'flower-2', desc: 'Golden exotic richness with leathery undertones' }
      ],
      base: [
        { name: 'Smoked Bourbon Vanilla', icon: 'cookie', desc: 'Rich, caramelized warmth lingering for 24+ hours' },
        { name: 'Ambergris Infusion', icon: 'waves', desc: 'Salty ocean depth providing unmatched longevity' },
        { name: 'Dark Leather & Vetiver', icon: 'shield', desc: 'Earthy, aristocratic grounding finish' }
      ]
    },
    performance: {
      longevity: '16+ Hours',
      sillage: 'Enormous',
      intensity: 95,
      season: 'Evening & Special Occasion'
    }
  },
  {
    id: 'nil-manel-elixir',
    name: 'Nil Manel Elixir',
    subtitle: 'Sacred Blue Waterlily & Monsoon Rain Petals',
    family: 'Aquatic & Floral',
    badge: 'National Heritage',
    priceLKR: 32000,
    priceUSD: 105,
    volume: '100ml / 3.4 FL. OZ. Eau de Parfum',
    concentration: 'Eau de Parfum (24% Oil)',
    rating: 4.8,
    reviewsCount: 112,
    image: nilManelImg,
    colorScheme: {
      liquid: 0x1a73e8,      // Sapphire Blue
      liquidEmissive: 0x071e3d,
      glassTint: 0xf0f8ff,
      cap: 'chrome',
      ambientGlow: 'rgba(59, 130, 246, 0.4)',
      bgGradient: 'radial-gradient(circle at center, rgba(26, 115, 232, 0.15) 0%, rgba(8, 8, 10, 0.95) 70%)'
    },
    description: 'Inspired by Sri Lanka\'s national flower, the sacred Blue Waterlily (Nil Manel). A divine crystalline bouquet captured after morning rainfall on the ancient lotus ponds of Anuradhapura.',
    notes: {
      top: [
        { name: 'Dewy Lotus Water', icon: 'droplet', desc: 'Crisp, aquatic morning freshness' },
        { name: 'White Pear & Mandarin', icon: 'sun', desc: 'Juicy, radiant fruit essence' },
        { name: 'Sea Salt Breeze', icon: 'wind', desc: 'Ozone-rich coastal mineral breeze' }
      ],
      heart: [
        { name: 'Sacred Ceylon Blue Lily', icon: 'flower', desc: 'Ethereal, hypnotic, sweet aquatic floral core' },
        { name: 'White Sambac Jasmine', icon: 'sparkles', desc: 'Night-blooming, intoxicating white petals' },
        { name: 'Green Cardamom', icon: 'leaf', desc: 'Subtle spicy zest elevating the floral heart' }
      ],
      base: [
        { name: 'White Cedarwood', icon: 'tree-pine', desc: 'Clean, modern woody structure' },
        { name: 'Silk Musk', icon: 'cloud', desc: 'Soft skin-scent veil of pure luxury' },
        { name: 'Clear Amber', icon: 'gem', desc: 'Luminous warmth that anchors the water notes' }
      ]
    },
    performance: {
      longevity: '10-12 Hours',
      sillage: 'Moderate to Strong',
      intensity: 78,
      season: 'Daytime, Spring & Summer'
    }
  },
  {
    id: 'galle-fort-imperial',
    name: 'Galle Fort Imperial',
    subtitle: 'Colonial Spiced Rum, Tobacco Leaf & Coastal Amber',
    family: 'Spicy & Boozy Leather',
    badge: 'Bestseller',
    priceLKR: 36000,
    priceUSD: 118,
    volume: '100ml / 3.4 FL. OZ. Extrait de Parfum',
    concentration: 'Extrait de Parfum (28% Oil)',
    rating: 5.0,
    reviewsCount: 194,
    image: galleFortImg,
    colorScheme: {
      liquid: 0xa84a13,      // Rich Cognac / Copper
      liquidEmissive: 0x331202,
      glassTint: 0xfffcf5,
      cap: 'rose-gold',
      ambientGlow: 'rgba(217, 119, 6, 0.4)',
      bgGradient: 'radial-gradient(circle at center, rgba(168, 74, 19, 0.15) 0%, rgba(8, 8, 10, 0.95) 70%)'
    },
    description: 'A tribute to the 16th-century ramparts of Galle Fort. Evoking sea breezes carrying cargo of aged spiced island rum, dried Ceylon tobacco leaves, roasted tonka bean, and warm maritime leather.',
    notes: {
      top: [
        { name: 'Aged Ceylon Arrack & Rum', icon: 'wine', desc: 'Warm boozy opening with caramelized molasses' },
        { name: 'Nutmeg & Clove Bud', icon: 'sparkles', desc: 'Rich spice trade warmth from spice gardens' },
        { name: 'Bitter Orange Peel', icon: 'sun', desc: 'Vibrant Mediterranean-style citrus note' }
      ],
      heart: [
        { name: 'Cured Golden Tobacco', icon: 'flame', desc: 'Sweet, smoky leaves cured in sun' },
        { name: 'Ceylon Cardamom Supreme', icon: 'leaf', desc: 'Queen of spices with cool camphoraceous glow' },
        { name: 'Orris Butter', icon: 'gem', desc: 'Powdery, ultra-luxurious root extract' }
      ],
      base: [
        { name: 'Warm Vintage Leather', icon: 'shield', desc: 'Rich antique saddle leather accord' },
        { name: 'Roasted Tonka Bean', icon: 'cookie', desc: 'Almond-vanilla warmth with smoky facets' },
        { name: 'Coastal Driftwood & Patchouli', icon: 'tree-pine', desc: 'Weathered wood kissed by salt air' }
      ]
    },
    performance: {
      longevity: '14+ Hours',
      sillage: 'Heavy & Magnetic',
      intensity: 90,
      season: 'All-Year Evening / Signature'
    }
  },
  {
    id: 'nuwara-eliya-mist',
    name: 'Nuwara Eliya Mist',
    subtitle: 'Golden Silver Tips Tea, Bergamot & Alpine Moss',
    family: 'Green & Fresh Tea',
    badge: 'Highland Reserve',
    priceLKR: 29500,
    priceUSD: 98,
    volume: '100ml / 3.4 FL. OZ. Eau de Parfum',
    concentration: 'Eau de Parfum (22% Oil)',
    rating: 4.9,
    reviewsCount: 88,
    image: nuwaraEliyaImg,
    colorScheme: {
      liquid: 0x2e7d32,      // Emerald Green
      liquidEmissive: 0x092b0c,
      glassTint: 0xf4fff4,
      cap: 'obsidian',
      ambientGlow: 'rgba(34, 197, 94, 0.4)',
      bgGradient: 'radial-gradient(circle at center, rgba(46, 125, 50, 0.15) 0%, rgba(8, 8, 10, 0.95) 70%)'
    },
    description: 'Captured in the crisp, 6,000-foot altitudes of Little England. Hand-plucked Silver Tips white tea infused with dew-kissed bergamot, damp highland cypress, and morning mountain mist.',
    notes: {
      top: [
        { name: 'Ceylon Silver Tips Tea', icon: 'coffee', desc: 'Ultra-rare imperial tea bud infusion' },
        { name: 'Highland Bergamot', icon: 'sun', desc: 'Sparkling, refreshing zesty lift' },
        { name: 'Crisp Morning Ozone', icon: 'wind', desc: 'Pure mountain air after a night chill' }
      ],
      heart: [
        { name: 'Green Fig Leaves', icon: 'leaf', desc: 'Verdant, milky green freshness' },
        { name: 'Highland Wild Rose', icon: 'flower', desc: 'Subtle, delicate mountain floral touch' },
        { name: 'Ginger Root', icon: 'sparkles', desc: 'Crisp spicy energy invigorating the blend' }
      ],
      base: [
        { name: 'Ceylon Cypress & Pine', icon: 'tree-pine', desc: 'Highland conifer wood aroma' },
        { name: 'Alpine Oakmoss', icon: 'cloud', desc: 'Earthy, velvety forest floor depth' },
        { name: 'Clean White Amber', icon: 'gem', desc: 'Crisp, lingering crystalline drydown' }
      ]
    },
    performance: {
      longevity: '9-11 Hours',
      sillage: 'Moderate',
      intensity: 70,
      season: 'Daily Wear & Executive Meetings'
    }
  },
  {
    id: 'kandy-sacred-amber',
    name: 'Kandy Sacred Amber',
    subtitle: 'Golden Frankincense, Temple Jasmine & Royal Benzoin',
    family: 'Amber & Incense',
    badge: 'Artisanal Batch',
    priceLKR: 34500,
    priceUSD: 112,
    volume: '100ml / 3.4 FL. OZ. Extrait de Parfum',
    concentration: 'Extrait de Parfum (30% Oil)',
    rating: 4.9,
    reviewsCount: 104,
    image: kandyAmberImg,
    colorScheme: {
      liquid: 0xd97706,      // Royal Golden Amber
      liquidEmissive: 0x451a03,
      glassTint: 0xfffaed,
      cap: 'gold',
      ambientGlow: 'rgba(245, 158, 11, 0.4)',
      bgGradient: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.15) 0%, rgba(8, 8, 10, 0.95) 70%)'
    },
    description: 'The sacred aroma of royal processions along the Lake of Kandy. Golden incense resins burning at sunset, enriched with sweet temple Frangipani, creamy benzoin, and holy myrrh.',
    notes: {
      top: [
        { name: 'Sweet Temple Frangipani', icon: 'flower-2', desc: 'Tropical creamy floral greeting' },
        { name: 'Golden Tangerine', icon: 'sun', desc: 'Sunlit citrus warmth' },
        { name: 'Wild Coriander', icon: 'sparkles', desc: 'Aromatic spicy accent' }
      ],
      heart: [
        { name: 'Sacred Frankincense Tears', icon: 'flame', desc: 'Smoky, meditative resinous elegance' },
        { name: 'Ceylon Royal Champaca', icon: 'flower', desc: 'Heady, regal golden magnolia flower' },
        { name: 'Holy Myrrh', icon: 'gem', desc: 'Ancient balsamic warmth' }
      ],
      base: [
        { name: 'Siam Benzoin Resin', icon: 'cookie', desc: 'Rich, sweet balsamic vanilla glow' },
        { name: 'Royal Ambergris Accord', icon: 'waves', desc: 'Golden eternal sillage' },
        { name: 'Velvet Labdanum', icon: 'shield', desc: 'Deep leathery amber foundation' }
      ]
    },
    performance: {
      longevity: '15+ Hours',
      sillage: 'Strong & Warm',
      intensity: 88,
      season: 'Fall, Winter & Formal Dinners'
    }
  }
];

export const CAP_MATERIALS = [
  {
    id: 'gold',
    name: '24K Brushed Gold',
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.95,
    previewColor: '#d4af37',
    desc: 'Hand-brushed solid brass with 24K gold electroplating'
  },
  {
    id: 'obsidian',
    name: 'Obsidian Black Onyx',
    color: 0x111115,
    roughness: 0.15,
    metalness: 0.85,
    previewColor: '#1a1a24',
    desc: 'High-gloss diamond-polished obsidian composite'
  },
  {
    id: 'rose-gold',
    name: 'Ceylon Rose Gold',
    color: 0xb76e79,
    roughness: 0.22,
    metalness: 0.92,
    previewColor: '#b76e79',
    desc: 'Warm copper-infused rose gold satin finish'
  },
  {
    id: 'chrome',
    name: 'Mirror Liquid Platinum',
    color: 0xe5e7eb,
    roughness: 0.08,
    metalness: 0.98,
    previewColor: '#e5e7eb',
    desc: 'Flawless mirror-finished platinum rhodium'
  }
];

export const BOTTLE_SIZES = [
  { id: '50ml', label: '50 ml / 1.7 FL. OZ.', multiplier: 0.65, badge: 'Voyage Edition' },
  { id: '100ml', label: '100 ml / 3.4 FL. OZ.', multiplier: 1.0, badge: 'Grand Flacon (Standard)' },
  { id: '200ml', label: '200 ml / 6.8 FL. OZ.', multiplier: 1.75, badge: 'Masterpiece Decanter' }
];

export const SCENT_QUIZ_QUESTIONS = [
  {
    id: 'vibe',
    title: 'What atmosphere captivates your senses most?',
    subtitle: 'Select the landscape that reflects your inner aura',
    options: [
      {
        label: 'A sacred rainforest mist and ancient spice markets at dusk',
        icon: 'flame',
        preferredFragrance: 'oud-ceylon-noir'
      },
      {
        label: 'Sunrise over tranquil lotus ponds and ocean breezes',
        icon: 'droplet',
        preferredFragrance: 'nil-manel-elixir'
      },
      {
        label: 'A historic coastal fortress with spiced rum and antique leather',
        icon: 'wine',
        preferredFragrance: 'galle-fort-imperial'
      },
      {
        label: 'Crisp mountain heights, misty tea gardens and dew-kissed air',
        icon: 'leaf',
        preferredFragrance: 'nuwara-eliya-mist'
      }
    ]
  },
  {
    id: 'intensity',
    title: 'How do you prefer your fragrance presence (Sillage)?',
    subtitle: 'From intimate whispers to commanding room-filling signatures',
    options: [
      {
        label: 'Commanding & Unforgettable: I want a rich sillage that turns heads',
        icon: 'sparkles',
        preferredFragrance: 'oud-ceylon-noir'
      },
      {
        label: 'Warm & Alluring: Magnetic when people lean in close',
        icon: 'heart',
        preferredFragrance: 'galle-fort-imperial'
      },
      {
        label: 'Refined & Meditative: Elegant, serene and spiritually grounding',
        icon: 'gem',
        preferredFragrance: 'kandy-sacred-amber'
      },
      {
        label: 'Clean, Crisp & Uplifting: Fresh, invigorating, high-energy presence',
        icon: 'wind',
        preferredFragrance: 'nuwara-eliya-mist'
      }
    ]
  },
  {
    id: 'occasion',
    title: 'When will this fragrance accompany you?',
    subtitle: 'Define the prime moments for your bespoke blend',
    options: [
      {
        label: 'Black-tie galas, grand evenings and signature moments',
        icon: 'crown',
        preferredFragrance: 'oud-ceylon-noir'
      },
      {
        label: 'Romantic twilight dinners and intimate rendezvous',
        icon: 'moon',
        preferredFragrance: 'galle-fort-imperial'
      },
      {
        label: 'Executive meetings, luxury travel and daytime sophistication',
        icon: 'compass',
        preferredFragrance: 'nuwara-eliya-mist'
      },
      {
        label: 'Everyday elegance & tropical resort leisure',
        icon: 'sun',
        preferredFragrance: 'nil-manel-elixir'
      }
    ]
  }
];
