import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const pages = {
  'about': dynamic(() => import('../about')),
  'announcements': dynamic(() => import('../announcements')),
  'awards': dynamic(() => import('../awards')),
  'contact': dynamic(() => import('../contact')),
  'execom': dynamic(() => import('../execom')),
  'gallery': dynamic(() => import('../gallery')),
  'history': dynamic(() => import('../history')),
  'initiatives': dynamic(() => import('../initiatives')),
  'membership-benefits': dynamic(() => import('../membership-benefits')),
  'newsletters': dynamic(() => import('../newsletters')),
  'past-events': dynamic(() => import('../past-events')),
  'past-execom': dynamic(() => import('../past-execom')),
  'resources': dynamic(() => import('../resources')),
  'student-branches': dynamic(() => import('../student-branches')),
  'upcoming-events': dynamic(() => import('../upcoming-events')),
  'vision-mission': dynamic(() => import('../vision-mission')),
};

export default async function DynamicPublicPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const Component = pages[slug];
    if (!Component) return notFound();
    return <Component />;
}
