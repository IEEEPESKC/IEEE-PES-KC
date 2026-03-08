import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import Image from 'next/image';

export const metadata = {
    title: 'Past Events | IEEE PES Kerala Chapter',
    description: 'A look back at events organized by IEEE PES Kerala Chapter.',
};

const pastEvents = [
    { img: '/images/ieee-images/recent_1.png', title: 'Power System Protection Workshop', date: 'Jan 2025', venue: 'GEC Barton Hill', desc: 'A comprehensive hands-on session on modern power system protection techniques.' },
    { img: '/images/ieee-images/recent_2.png', title: 'IEEE PES Day 2025 Celebrations', date: 'Feb 2025', venue: 'State-wide Virtual', desc: 'Celebrating the spirit of Power & Energy Society with state-wide virtual events and competitions.' },
    { img: '/images/ieee-images/Gallery/gallery_1.png', title: 'AKPESSC 2024', date: 'Nov 2024', venue: 'Kozhikode', desc: 'The All Kerala Power & Energy Society Student Congress — a grand gathering of 500+ students.' },
    { img: '/images/ieee-images/Gallery/gallery_2.png', title: 'Intellect 2024 — State Quiz', date: 'Oct 2024', venue: 'Ernakulam', desc: 'State-level technical quiz that challenged the brightest engineering minds across Kerala.' },
    { img: '/images/ieee-images/Gallery/gallery_3.png', title: 'Women in Power (WoW) 2024', date: 'Sep 2024', venue: 'Trivandrum', desc: 'A flagship event empowering women engineers in the energy sector.' },
    { img: '/images/ieee-images/Gallery/gallery_4.png', title: 'Industrial Visit — KSEB', date: 'Aug 2024', venue: 'Kochi', desc: 'Members visited KSEB facilities to understand live grid operations and power distribution.' },
];

export default function PastEventsPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Past Events"
                subtitle="Our Journey"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Events' }, { label: 'Past Events' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Looking Back</span>
                        <h2 className="section-title mt-3">Events We&apos;ve Organized</h2>
                        <p className="section-desc">A collection of memorable events that have shaped our community over the years.</p>
                    </div>

                    <div className="row g-4">
                        {pastEvents.map((e, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="event-card">
                                    <div className="event-card-image">
                                        <Image src={e.img} alt={e.title} width={640} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-card-body">
                                        <div>
                                            <span className="event-date"><i className="bi bi-calendar-check"></i> {e.date}</span>
                                            <h3 style={{ fontSize: '1.1rem' }}>{e.title}</h3>
                                            <p className="event-venue"><i className="bi bi-geo-alt-fill"></i> {e.venue}</p>
                                            <p style={{ color: '#666', fontSize: 14 }}>{e.desc}</p>
                                        </div>
                                        <span className="btn-register" style={{ cursor: 'default', opacity: 0.7 }}>Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
