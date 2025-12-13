import { getFooterSettings } from '@/lib/actions/settings';
import { prisma } from '@/lib/prisma';
import FooterClient from './FooterClient';

// 1. Static Shop Links
const SHOP_LINKS = [
  { name: "Living Room", href: "/category/living-room" },
  { name: "Bedroom", href: "/category/bedroom" },
  { name: "Dining", href: "/category/dining-kitchen" },
  { name: "Office", href: "/category/office" },
  { name: "Decor", href: "/category/decor" },
  { name: "Sale", href: "/search?sale=true" },
];

export default async function Footer() {
  // 2. Fetch Data
  const [settings, pages] = await Promise.all([
    getFooterSettings(),
    prisma.contentPage.findMany({ orderBy: { title: 'asc' } })
  ]);

  const getPagesByCat = (cat: string) => 
    pages.filter(p => p.category === cat || p.category === cat.replace('FOOTER_', ''))
         .map(p => ({ name: p.title, href: `/pages/${p.slug}` }));

  // 3. System Columns (The Base)
  let systemColumns = [
    {
      title: "Shop",
      links: SHOP_LINKS
    },
    {
      title: "Help & Support",
      links: [
        ...getPagesByCat('FOOTER_HELP'),
        { name: "Contact Us", href: "/contact-us" },
        { name: "Track Order", href: "/track-order" }
      ]
    },
    {
      title: "Company",
      links: [
        ...getPagesByCat('FOOTER_COMPANY'),
        { name: "Stores", href: "/stores" }
      ]
    },
    {
      title: "Legal",
      links: getPagesByCat('FOOTER_LEGAL')
    }
  ];

  // 4. Process & Deduplicate Manual Columns
  // @ts-ignore
  const manualColumnsSetting = settings?.columns || [];
  const extraColumns: any[] = [];

  manualColumnsSetting.forEach((mCol: any) => {
      // Get manual links + dynamic placement links for this specific column
      const manualLinks = mCol.links.map((l: any) => ({ name: l.label, href: l.url }));
      const dynamicLinks = pages
          .filter(p => p.category === `FOOTER_COL:${mCol.title}`)
          .map(p => ({ name: p.title, href: `/pages/${p.slug}` }));

      const incomingLinks = [...manualLinks, ...dynamicLinks];

      // Check for System Column Match
      const systemMatch = systemColumns.find(sc => sc.title.toLowerCase().trim() === mCol.title.toLowerCase().trim());

      if (systemMatch) {
          // 🧠 SMART DEDUPLICATION
          // Only add links that do NOT already exist in the system column
          incomingLinks.forEach(link => {
             const isDuplicate = systemMatch.links.some(
                 sysLink => sysLink.href === link.href || sysLink.name === link.name
             );
             
             if (!isDuplicate) {
                 systemMatch.links.push(link);
             }
          });
      } else {
          // If unique column, just add it (but remove duplicates inside itself)
          const uniqueLinks = incomingLinks.filter((link, index, self) =>
              index === self.findIndex((t) => (
                  t.href === link.href && t.name === link.name
              ))
          );

          extraColumns.push({
              title: mCol.title,
              links: uniqueLinks
          });
      }
  });

  const finalFooterData = [...systemColumns, ...extraColumns];
  // @ts-ignore
  const socialLinks = settings?.social || {};

  return <FooterClient data={finalFooterData} socials={socialLinks} />;
}