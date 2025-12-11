// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- HELPERS ---
const getUnsplash = (term: string) =>
  `https://images.unsplash.com/photo-${term}?auto=format&fit=crop&w=800&q=80`;
const SIZE_CHART_URL =
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80&text=Size+Chart';

// --- DATA ---
const PRODUCTS = [
  // --- LIVING ROOM ---
  {
    name: 'Cloud Modular Sectional Sofa',
    description:
      'Experience floating-on-air comfort with our deep-seated modular sectional. Upholstered in premium performance fabric that is stain-resistant and durable.',
    price: 89999,
    stock: 10,
    subSlug: 'sofas-seating',
    isFeatured: true,
    story:
      'Designed by artisans in Jaipur, this sofa was inspired by the monsoon clouds. The fabric is hand-stitched to ensure every seam tells a story of precision.',
    materialOrigin: 'Cotton from Gujarat, Frame from Assam Teak',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
  {
    name: 'Mid-Century Velvet Armchair',
    description:
      'A statement piece for any room. Solid wood legs with gold caps, paired with lush emerald green velvet upholstery.',
    price: 24500,
    stock: 15,
    subSlug: 'sofas-seating',
    isFeatured: false,
    story: 'This chair pays homage to the 1950s Bombay Art Deco movement.',
    materialOrigin: 'Mysore Silk Velvet',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e994826720d2?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
  {
    name: 'Oak Minimalist Coffee Table',
    description:
      'Handcrafted from solid oak with a matte finish. Features a lower shelf for magazines and remotes.',
    price: 12999,
    stock: 20,
    subSlug: 'coffee-side-tables',
    isFeatured: false,
    story: 'Carved from a single fallen oak tree to ensure grain consistency.',
    materialOrigin: 'Sustainable Oak Forest, Himachal',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
  {
    name: 'Industrial TV Media Unit',
    description:
      'Black metal frame with reclaimed wood surfaces. Fits TVs up to 65 inches with ample cable management.',
    price: 18500,
    stock: 8,
    subSlug: 'tv-units',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
      'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
  // --- BEDROOM ---
  {
    name: 'Royal Tufted King Bed',
    description:
      'Sleep like royalty. High winged headboard with deep button tufting in a neutral beige linen fabric.',
    price: 45000,
    stock: 5,
    subSlug: 'beds',
    isFeatured: true,
    story: 'Hand-tufted by third-generation craftsmen.',
    materialOrigin: 'Linen from Belgium',
    images: [
      'https://images.unsplash.com/photo-1505693416388-b0346ef4174d?w=800&q=80',
      'https://images.unsplash.com/photo-1522771753035-4a50423a5a63?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
  {
    name: 'Orthopedic Memory Foam Mattress',
    description:
      '10-inch triple layer memory foam with cooling gel technology. Medium-firm support.',
    price: 15999,
    stock: 50,
    subSlug: 'mattresses',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
      SIZE_CHART_URL,
    ],
  },
];

// --- MAIN SEED FUNCTION ---
async function main() {
  console.log('🌱 Starting V3 Refined Seed...');

  // 1. Ensure Categories Exist & Update Images
  const taxonomy = [
    {
      name: 'Living Room',
      slug: 'living-room',
      img: '1555041469-a586c61ea9bc',
      subs: ['Sofas & Seating', 'Coffee & Side Tables', 'TV Units', 'Storage'],
    },
    {
      name: 'Bedroom',
      slug: 'bedroom',
      img: '1505693416388-b0346ef4174d',
      subs: ['Beds', 'Mattresses', 'Wardrobes', 'Bedside Tables'],
    },
    {
      name: 'Dining & Kitchen',
      slug: 'dining-kitchen',
      img: '1617806118233-18e1de247200',
      subs: ['Dining Sets', 'Chairs & Benches', 'Bar Furniture'],
    },
    {
      name: 'Office',
      slug: 'office',
      img: '1524758631624-e2822e304c36',
      subs: ['Office Chairs', 'Office Desks', 'Study Tables'],
    },
    {
      name: 'Kids & Outdoor',
      slug: 'kids-outdoor',
      img: '1596178065887-1198b6148b2c',
      subs: ['Kids Beds & Storage', 'Study for Kids'],
    },
    {
      name: 'Décor',
      slug: 'decor',
      img: '1513519245088-0e12902e5a38',
      subs: ['Lighting', 'Rugs & Carpets', 'Wall Decor & Mirrors'],
    },
  ];

  for (const cat of taxonomy) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: getUnsplash(cat.img) },
      create: { name: cat.name, slug: cat.slug, image: getUnsplash(cat.img) },
    });

    for (const sub of cat.subs) {
      const subSlug = sub
        .toLowerCase()
        .replace(/ & /g, '-')
        .replace(/ /g, '-');
      const existingSub = await prisma.subCategory.findFirst({
        where: { slug: subSlug },
      });
      if (!existingSub) {
        await prisma.subCategory.create({
          data: { name: sub, slug: subSlug, categoryId: category.id },
        });
      }
    }
  }

  // 2. Get or Create Seller
  let storeId: string | undefined;

  // Try to find ANY seller first
  const existingSeller = await prisma.user.findFirst({
    where: { role: 'SELLER' },
    include: { store: true },
  });

  if (existingSeller && existingSeller.store) {
    storeId = existingSeller.store.id;
  } else {
    console.log('Creating Default Seller...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Seed Seller',
        email: 'seed@seller.com',
        password: hashedPassword,
        role: 'SELLER',
      },
    });
    const store = await prisma.store.create({
      data: {
        name: 'Woodsphere Direct',
        slug: 'woodsphere-direct',
        userId: user.id,
        status: 'ACTIVE',
      },
    });
    storeId = store.id;
  }

  // 3. Insert Products
  console.log('Creating Products...');

  // Optional: Clear old products to avoid duplicates during dev
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  for (const p of PRODUCTS) {
    const subCategory = await prisma.subCategory.findFirst({
      where: { slug: p.subSlug },
    });

    if (!subCategory) {
      console.warn(`Skipping ${p.name}: SubCategory ${p.subSlug} not found`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: p.images,
        isFeatured: p.isFeatured,
        storeId: storeId!,
        subCategoryId: subCategory.id,
        // New Fields
        story: p.story || 'Crafted with passion.',
        materialOrigin: p.materialOrigin || 'Ethically Sourced',
      },
    });
  }

  // 4. Setup Site Settings (Hero Banner + Header Config)
  await prisma.siteSettings.upsert({
    where: { id: 'config' },
    update: {
      headerConfig: {
        logoText: 'Woodsphere.',
        logoImage: '',
        navigation: [
          {
            label: 'Living',
            slug: 'living-room',
            icon: 'Weekend',
            subs: [
              { label: 'Sofas', slug: 'sofas-seating' },
              { label: 'Coffee Tables', slug: 'coffee-side-tables' },
              { label: 'TV Units', slug: 'tv-units' },
            ],
          },
          {
            label: 'Bedroom',
            slug: 'bedroom',
            icon: 'Bed',
            subs: [
              { label: 'Beds', slug: 'beds' },
              { label: 'Mattresses', slug: 'mattresses' },
              { label: 'Wardrobes', slug: 'wardrobes' },
            ],
          },
          {
            label: 'Dining',
            slug: 'dining-kitchen',
            icon: 'TableBar',
            subs: [
              { label: 'Dining Sets', slug: 'dining-sets' },
              { label: 'Chairs', slug: 'chairs-benches' },
            ],
          },
          {
            label: 'Office',
            slug: 'office',
            icon: 'Chair',
            subs: [
              { label: 'Office Chairs', slug: 'office-chairs' },
              { label: 'Desks', slug: 'office-desks' },
            ],
          },
          {
            label: 'Kids',
            slug: 'kids-outdoor',
            icon: 'ChildCare',
            subs: [{ label: 'Kids Beds', slug: 'kids-beds-storage' }],
          },
          {
            label: 'Décor',
            slug: 'decor',
            icon: 'LocalFlorist',
            subs: [
              { label: 'Lighting', slug: 'lighting' },
              { label: 'Rugs', slug: 'rugs-carpets' },
            ],
          },
          {
            label: 'Sale',
            slug: 'sale',
            icon: 'LocalOffer',
            isSale: true,
            subs: [],
          },
        ],
      },
    },
    create: {
      id: 'config',
      heroConfig: {
        heading: 'Crafting the future of your home.',
        subHeading:
          'Discover a world where sustainable materials meet timeless design.',
        imageUrl:
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop',
        ctaText: 'Shop Collection',
        ctaLink: '/search',
      },
      headerConfig: {
        logoText: 'Woodsphere.',
        logoImage: '', // Optional
        navigation: [
          {
            label: 'Living',
            slug: 'living-room',
            icon: 'Weekend',
            subs: [
              { label: 'Sofas', slug: 'sofas-seating' },
              { label: 'Coffee Tables', slug: 'coffee-side-tables' },
              { label: 'TV Units', slug: 'tv-units' },
            ],
          },
          {
            label: 'Bedroom',
            slug: 'bedroom',
            icon: 'Bed',
            subs: [
              { label: 'Beds', slug: 'beds' },
              { label: 'Mattresses', slug: 'mattresses' },
              { label: 'Wardrobes', slug: 'wardrobes' },
            ],
          },
          {
            label: 'Dining',
            slug: 'dining-kitchen',
            icon: 'TableBar',
            subs: [
              { label: 'Dining Sets', slug: 'dining-sets' },
              { label: 'Chairs', slug: 'chairs-benches' },
            ],
          },
          {
            label: 'Office',
            slug: 'office',
            icon: 'Chair',
            subs: [
              { label: 'Office Chairs', slug: 'office-chairs' },
              { label: 'Desks', slug: 'office-desks' },
            ],
          },
          {
            label: 'Kids',
            slug: 'kids-outdoor',
            icon: 'ChildCare',
            subs: [{ label: 'Kids Beds', slug: 'kids-beds-storage' }],
          },
          {
            label: 'Décor',
            slug: 'decor',
            icon: 'LocalFlorist',
            subs: [
              { label: 'Lighting', slug: 'lighting' },
              { label: 'Rugs', slug: 'rugs-carpets' },
            ],
          },
          {
            label: 'Sale',
            slug: 'sale',
            icon: 'LocalOffer',
            isSale: true,
            subs: [],
          },
        ],
      },
    },
  });

  console.log('✅ V3 Data Injected Successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
