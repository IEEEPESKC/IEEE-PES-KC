import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Upcoming Events | IEEE PES Kerala Chapter',
    description: 'Upcoming events organized by IEEE PES Kerala Chapter.',
};

const events = [
    {
        img: '/images/ieee-images/Events/agm2026.png',
        title: 'Annual General Meeting 2026',
        date: '1 Feb 2026',
        venue: 'Kochi Section Office',
        desc: 'Join us for the Annual General Meeting 2026 — Reflect, Reconnect, Reignite.',
        link: 'https://tinyurl.com/ieeepeskc-agm2026',
    },
    {
        img: '/images/ieee-images/Events/pesgre_event.png',
        title: 'PESGRE 2026',
        date: '15–18 Feb 2026',
        venue: 'Trivandrum',
        desc: 'International Conference on Power Electronics, Smart Grid and Renewable Energy.',
        link: '#',
    },
    {
        img: '/images/ieee-images/Events/smartgrid_event.png',
        title: 'Smart Grid Workshop',
        date: '10 Mar 2026',
        venue: 'NIT Calicut',
        desc: 'Hands-on workshop on Smart Grid infrastructure and IoT in power systems. Industry certification included.',
        link: '#',
    },
    {
        img: '/images/ieee-images/Events/pesday_event.png',
        title: 'IEEE PES Day 2026',
        date: '28 Feb 2026',
        venue: 'IIT Palakkad',
        desc: 'Celebrating the global impact of IEEE PES with workshops, competitions, and networking.',
        link: '#',
    },
    {
        img: '/images/ieee-images/Events/renewable_event.png',
        title: 'Renewable Energy Webinar',
        date: '18 Mar 2026',
        venue: 'Online',
        desc: 'A deep-dive into the latest advancements in renewable energy technologies and policy.',
        link: '#',
    },
];

export default function UpcomingEventsPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Upcoming Events"
                subtitle="Events"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Events' }, { label: 'Upcoming Events' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Don&apos;t Miss Out</span>
                        <h2 className="section-title mt-3">Upcoming Events</h2>
                        <p className="section-desc">Conferences, workshops, webinars, and competitions — stay connected and grow with us.</p>
                    </div>

                    <div className="row g-4">
                        {events.map((e, i) => (
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
                                        <a href={e.link} target="_blank" rel="noreferrer" className="btn-register">Register Now</a>
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
