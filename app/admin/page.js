'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const router = useRouter();

    // Default redirect to events
    useEffect(() => {
        router.replace('/admin/ad_pages/ad_events');
    }, [router]);

    return null;
}
