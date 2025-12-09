// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- PRODUCT DATA ---
const products = [
  // Living Room
  {
    name: "Cloud Sectional Sofa",
    description: "Modular sectional sofa with deep seats and ultra-soft fabric.",
    price: 89999.00,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80"],
    subSlug: "sofas-seating",
    isFeatured: true
  },
  {
    name: "Mid-Century Walnut Coffee Table",
    description: "Solid walnut wood coffee table with glass top and brass legs.",
    price: 15499.00,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80"],
    subSlug: "coffee-side-tables",
    isFeatured: false
  },
  {
    name: "Minimalist Oak TV Unit",
    description: "Low profile TV console with ample storage and cable management.",
    price: 22999.00,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80"],
    subSlug: "tv-units",
    isFeatured: false
  },
  
  // Bedroom
  {
    name: "Luxe Tufted King Bed",
    description: "Velvet tufted headboard with hydraulic storage base.",
    price: 45000.00,
    stock: 4,
    images: ["https://images.unsplash.com/photo-1505693416388-b0346ef4174d?auto=format&fit=crop&q=80"],
    subSlug: "beds",
    isFeatured: true
  },
  {
    name: "Orthopedic Memory Foam Mattress",
    description: "10-inch memory foam mattress with cooling gel technology.",
    price: 18999.00,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80"],
    subSlug: "mattresses",
    isFeatured: false
  },
  
  // Dining
  {
    name: "Scandi 6-Seater Dining Set",
    description: "Minimalist dining table with 6 ergonomic chairs.",
    price: 35999.00,
    stock: 3,
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80"],
    subSlug: "dining-sets",
    isFeatured: true
  },
  
  // Office
  {
    name: "ErgoPro Office Chair",
    description: "High-back mesh chair with lumbar support and adjustable armrests.",
    price: 12500.00,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80"],
    subSlug: "office-chairs",
    isFeatured: true
  },
  {
    name: "Standing Desk Converter",
    description: "Adjustable height desk converter for healthier work habits.",
    price: 8999.00,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1595515106967-1b0895318725?auto=format&fit=crop&q=80"],
    subSlug: "office-desks",
    isFeatured: false
  },
  
  // Decor
  {
    name: "Industrial Floor Lamp",
    description: "Matte black metal floor lamp with adjustable head.",
    price: 4500.00,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1513506003013-d3c5240f55a1?auto=format&fit=crop&q=80"],
    subSlug: "lighting",
    isFeatured: false
  },
  {
    name: "Abstract Geometric Rug",
    description: "Hand-woven wool rug with modern geometric patterns.",
    price: 6999.00,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1575414723225-b873f2fd74be?auto=format&fit=crop&q=80"],
    subSlug: "rugs-carpets",
    isFeatured: false
  }
];

async function main() {
  console.log('🌱 Starting Product Seed...');

  // 1. Clear existing products (optional, for clean slate)
  await prisma.product.deleteMany();

  // 2. Loop and Insert
  for (const product of products) {
    // Find the subcategory ID based on the slug
    const subCategory = await prisma.subCategory.findFirst({
      where: { slug: product.subSlug }
    });

    if (!subCategory) {
      console.warn(`⚠️ SubCategory not found for slug: ${product.subSlug}. Skipping product: ${product.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        subCategoryId: subCategory.id,
        isFeatured: product.isFeatured
      }
    });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log('🎉 Product Seeding Completed.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });