import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const pages = {
  'ad_events': dynamic(() => import('../ad_events')),
  'ad_announcements': dynamic(() => import('../ad_announcements')),
  'ad_gallery': dynamic(() => import('../ad_gallery')),
  'ad_execom': dynamic(() => import('../ad_execom')),
  'ad_chapters': dynamic(() => import('../ad_chapters')),
  'ad_awards': dynamic(() => import('../ad_awards')),
  'ad_recognitions': dynamic(() => import('../ad_recognitions')),
  'ad_newsletters': dynamic(() => import('../ad_newsletters')),
  'ad_magazines': dynamic(() => import('../ad_magazines')),
};

export default async function DynamicAdPage({ params }) {
    let slug = '';
    
    // Support both older Next.js (sync params) and newer Next.js (async params)
    const resolvedParams = await params;
    if (resolvedParams && resolvedParams.slug) {
        slug = resolvedParams.slug;
    } else if (params && params.slug) {
        slug = params.slug;
    }

    const Component = pages[slug];
    if (!Component) return notFound();
    return <Component />;
}
