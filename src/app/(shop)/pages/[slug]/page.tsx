import ContentPageLayout from '@/components/layout/ContentPageLayout';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DynamicContentPage({ params }: Props) {
  // ⚠️ Await params in Next.js 15
  const { slug } = await params;
  
  // Verify it exists first
  const page = await prisma.contentPage.findUnique({
    where: { slug }
  });

  if (!page) notFound();

  // Reuse your robust layout
  return <ContentPageLayout slug={slug} />;
}