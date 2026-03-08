'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdPagesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/ad_pages/ad_events');
  }, [router]);
  return null;
}
