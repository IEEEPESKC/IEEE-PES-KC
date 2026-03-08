import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import Link from 'next/link';

export const metadata = {
    title: 'Announcements | IEEE PES Kerala Chapter',
    description: 'Latest announcements from IEEE PES Kerala Chapter.',
};

const announcements = [
    { tag: 'NEW', tagColor: '#089126', title: 'Call for Volunteers 2026', date: 'Feb 10, 2026', desc: 'Join the IEEE PES Kerala Web Team and Creative Team. Apply by Feb 20. Send your CV to ieeepes.kerala@ieee.org.' },
    { tag: 'IMPORTANT', tagColor: '#e63946', title: 'Best Student Branch Results', date: 'Feb 5, 2026', desc: 'The annual PES SB Performance results are out. Check your branch ranking on the IEEE PES Kerala portal.' },
    { tag: 'UPCOMING', tagColor: '#f4a261', title: 'Execom Training Session', date: 'Jan 28, 2026', desc: 'Mandatory training for all newly elected SB Execom members on Feb 25, 2026 at 10 AM via Google Meet.' },
    { tag: 'UPDATE', tagColor: '#457b9d', title: 'Awards Nominations Open', date: 'Jan 20, 2026', desc: 'Submit nominations for the Outstanding Professional Award and Best Student Volunteer Award by March 15.' },
    { tag: 'INFO', tagColor: '#6c757d', title: 'Chapter Membership Drive', date: 'Jan 15, 2026', desc: 'Exclusive benefits for members joining this month. Refer a friend and earn recognition points!' },
    { tag: 'INFO', tagColor: '#6c757d', title: 'AGM 2026 Registration Open', date: 'Jan 10, 2026', desc: 'Registrations for Annual General Meeting 2026 are now open. Limited seats. Register at tinyurl.com/ieeepeskc-agm2026.' },
];

export default function AnnouncementsPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Announcements"
                subtitle="Notice Board"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Announcements' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Latest</span>
                        <h2 className="section-title mt-3">All Announcements</h2>
                        <p className="section-desc">Stay up to date with the latest news, calls, and updates from IEEE PES Kerala Chapter.</p>
                    </div>

                    <div className="row g-4">
                        {announcements.map((a, i) => (
                            <div key={i} className="col-12">
                                <div className="update-box d-flex gap-4 align-items-start">
                                    <div className="flex-shrink-0 text-center" style={{ minWidth: 80 }}>
                                        <span style={{ background: a.tagColor, color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', display: 'inline-block' }}>
                                            {a.tag}
                                        </span>
                                        <div style={{ color: '#999', fontSize: 12, marginTop: 6 }}>{a.date}</div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 style={{ color: 'var(--header-color)', marginBottom: 8, fontSize: '1.05rem' }}>{a.title}</h4>
                                        <p style={{ color: '#666', margin: 0 }}>{a.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5">
                        <p style={{ color: '#999', fontSize: 14 }}>
                            For older announcements, please email us at{' '}
                            <a href="mailto:ieeepes.kerala@ieee.org" style={{ color: 'var(--pes-green)', fontWeight: 600 }}>ieeepes.kerala@ieee.org</a>
                        </p>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
