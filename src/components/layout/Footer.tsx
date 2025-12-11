import { getFooterSettings } from '@/lib/actions/settings';
import FooterClient from './FooterClient';

// Fallback data
const DEFAULT_FOOTER_LINKS = [
  { title: "Shop", links: [{ name: "Living Room", href: "/search?category=living-room" }] },
  { title: "Help", links: [{ name: "Contact", href: "/contact" }] }
];

export default async function Footer() {
  const settings: any = await getFooterSettings();
  
  // 1. Ensure columns exist
  let footerData = DEFAULT_FOOTER_LINKS;
  if (settings.columns && Array.isArray(settings.columns) && settings.columns.length > 0) {
    footerData = settings.columns.map((col: any) => ({
      title: col.title,
      links: col.links.map((l: any) => ({
        name: l.label,
        href: l.url,
      }))
    }));
  }

  // 2. Ensure socials exist (Default to empty object if null)
  // If you want them to ALWAYS show for testing, add dummy links here:
  // const socialLinks = settings.social || { instagram: '#', facebook: '#' }; 
  const socialLinks = settings.social || {};

  return <FooterClient data={footerData} socials={socialLinks} />;
}