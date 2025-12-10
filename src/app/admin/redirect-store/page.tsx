import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function StoreRedirectPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // 1. Find the store slug for the logged-in user
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { slug: true }
  });

  // 2. Redirect logic
  if (store?.slug) {
    // Send to public store page
    redirect(`/store/${store.slug}`);
  } else {
    // If no store found, send to registration
    redirect('/sell');
  }
}