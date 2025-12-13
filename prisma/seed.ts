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
// Using a standard, reliable format for Unsplash content images
const getUnsplash = (term: string) =>
  `https://images.unsplash.com/photo-${term}?auto=format&fit=crop&w=800&q=80`;

// FIX: Using a reliable Unsplash image for the generic size chart placeholder
const SIZE_CHART_URL =
  'https://images.unsplash.com/photo-1542861205-d1430c51b75c?auto=format&fit=crop&w=800&q=80&text=Size+Chart';

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
      // Working Sofa Images
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1618220054915-d1acb1952573?w=800&q=80',
      'https://images.unsplash.com/photo-1596541223130-5d31a73cb6cf?w=800&q=80',
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
      // FIX: Replaced broken link with working chair image
      'https://images.unsplash.com/photo-1567016376408-0226e43cb32a?w=800&q=80', 
      'https://images.unsplash.com/photo-1582582877994-081e7d23d858?w=800&q=80',
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
      // FIX: Replaced broken links with known working bed images
      'https://images.unsplash.com/photo-1578401311032-2d2975c742c3?w=800&q=80',
      'https://images.unsplash.com/photo-1586738980387-9d7e35b0266f?w=800&q=80',
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
      img: '1555041469-a586c61ea9bc', // Sofa image
      subs: ['Sofas & Seating', 'Coffee & Side Tables', 'TV Units', 'Storage'],
    },
    {
      name: 'Bedroom',
      slug: 'bedroom',
      // FIX: Replaced broken image ID with working bedroom image ID
      img: '1583847841793-13847895e69e', 
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
              { label: 'Bar Furniture', slug: 'bar-furniture' },
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
              { label: 'Bar Furniture', slug: 'bar-furniture' },
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

  console.log("📝 Seeding Content Pages...");

  const SUPPORT_PAGES = [
    {
      slug: "returns-refunds",
      title: "Returns & Refunds",
      category: "HELP",
      content: `
        <h2>Hassle-Free Returns</h2>
        <p>We want you to love your Woodsphere purchase. If you're not completely satisfied, you can return most items within 7 days of delivery.</p>
        <h3>Eligibility</h3>
        <ul>
          <li>Items must be in original condition.</li>
          <li>Custom-made furniture is non-returnable.</li>
        </ul>
        <h3>Refund Process</h3>
        <p>Once we receive your item, inspecting it takes 2-3 business days. Refunds are processed to your original payment method within 5-7 business days.</p>
      `
    },
    {
      slug: "shipping-delivery",
      title: "Shipping & Delivery",
      category: "HELP",
      content: `
        <h2>Delivery Information</h2>
        <p>We offer free standard shipping on all orders above ₹5000.</p>
        <h3>Estimated Timelines</h3>
        <ul>
          <li><strong>Metro Cities:</strong> 3-5 Business Days</li>
          <li><strong>Rest of India:</strong> 7-10 Business Days</li>
        </ul>
      `
    },
    {
      slug: "warranty-assembly",
      title: "Warranty & Assembly",
      category: "HELP",
      content: `
        <h2>Woodsphere Warranty</h2>
        <p>All our furniture comes with a standard 1-year warranty against manufacturing defects.</p>
        <h2>Assembly Services</h2>
        <p>We provide free expert assembly for Beds, Wardrobes, and Dining Sets at the time of delivery.</p>
      `
    },
    {
      slug: "faqs",
      title: "Frequently Asked Questions",
      category: "HELP",
      content: `
        <h3>Do you ship internationally?</h3>
        <p>Currently, we only ship within India.</p>
        <h3>Can I customize the fabric?</h3>
        <p>Yes! Visit our 'Custom Orders' page for more details on bespoke furniture.</p>
      `
    }
  ];

  for (const page of SUPPORT_PAGES) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: {}, // Don't overwrite if exists (preserves admin edits)
      create: page
    });
  }

  const COMPANY_PAGES = [
    {
      slug: "about-us",
      title: "About Woodsphere",
      category: "COMPANY",
      content: `
        <h2>Designed for Living. Built for Life.</h2>
        <p>Woodsphere began with a simple idea: furniture shouldn't just fill a space; it should define it. Born in 2024, we bridge the gap between artisanal craftsmanship and modern digital convenience.</p>
        <p>We partner directly with master carpenters across India, cutting out middlemen to bring you premium teak and oak furniture at honest prices.</p>
        <h3>Our Mission</h3>
        <p>To make sustainable, heirloom-quality furniture accessible to every modern Indian home.</p>
      `
    },
    {
      slug: "careers",
      title: "Join Our Team",
      category: "COMPANY",
      content: `
        <h2>Build the Future of Furniture</h2>
        <p>We are always looking for passionate designers, developers, and logistics experts.</p>
        <h3>Open Positions</h3>
        <ul>
          <li><strong>Senior Product Designer</strong> - Bangalore (On-site)</li>
          <li><strong>Full Stack Engineer</strong> - Remote</li>
          <li><strong>Supply Chain Manager</strong> - Delhi (Hybrid)</li>
        </ul>
        <p>Send your portfolio to <strong>careers@woodsphere.com</strong></p>
      `
    },
    {
      slug: "sustainability",
      title: "Sustainability & Materials",
      category: "COMPANY",
      content: `
        <h2>Conscious Craftsmanship</h2>
        <p>We believe in responsible luxury. 100% of our wood is sourced from government-certified sustainable plantations.</p>
        <h3>Zero Plastic Packaging</h3>
        <p>We have eliminated single-use plastics from our delivery chain, opting for recycled honeycomb paper and biodegradable wraps.</p>
      `
    },
    {
        slug: "affiliate-program",
        title: "Affiliate Program",
        category: "COMPANY",
        content: `
          <h2>Partner with Us</h2>
          <p>Are you an interior designer or home decor influencer? Join the Woodsphere Affiliate Program and earn 10% commission on every sale.</p>
          <p>Contact <strong>partners@woodsphere.com</strong> to apply.</p>
        `
    }
  ];

  const LEGAL_PAGES = [
    {
      slug: "terms-conditions",
      title: "Terms & Conditions",
      category: "LEGAL",
      content: `
        <p><strong>Last Updated: Dec 2025</strong></p>
        <p>Welcome to Woodsphere. By accessing our website, you agree to be bound by these terms.</p>
        <h3>1. Use of Services</h3>
        <p>You must be at least 18 years old to use our services. Account security is your responsibility.</p>
        <h3>2. Pricing & Payments</h3>
        <p>Prices are inclusive of GST. We reserve the right to change prices without notice.</p>
      `
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      category: "LEGAL",
      content: `
        <h2>Your Privacy Matters</h2>
        <p>We collect only the information necessary to process your order and improve your experience.</p>
        <h3>Data We Collect</h3>
        <ul>
          <li>Contact Information (Name, Email, Phone)</li>
          <li>Shipping Address</li>
          <li>Payment History (we do not store card details)</li>
        </ul>
      `
    },
    {
      slug: "cancellation-policy",
      title: "Cancellation Policy",
      category: "LEGAL",
      content: `
        <h2>Order Cancellations</h2>
        <p>You can cancel your order within 24 hours of placement for a full refund.</p>
        <p>After 24 hours, a processing fee of 5% may apply as our artisans begin material allocation immediately.</p>
        <p>Orders cannot be cancelled once shipped.</p>
      `
    },
    {
      slug: "cookie-policy",
      title: "Cookie Policy",
      category: "LEGAL",
      content: `
        <p>We use cookies to personalize content and analyze our traffic. By using our site, you consent to our use of cookies.</p>
      `
    }
  ];

  // Combine all pages
  const ALL_PAGES = [...SUPPORT_PAGES, ...COMPANY_PAGES, ...LEGAL_PAGES];

  for (const page of ALL_PAGES) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: {}, 
      create: page
    });
  }

  console.log("✅ Content Pages Seeded.");

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