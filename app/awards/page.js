import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export const metadata = {
    title: 'Awards | IEEE PES Kerala Chapter',
    description: 'Awards and recognition programs by IEEE PES Kerala Chapter.',
};

const awards = [
    {
        icon: 'ri-medal-line',
        title: 'Outstanding Professional Award',
        desc: 'Recognizes IEEE PES members who have demonstrated exceptional professional contributions to the power and energy sector in Kerala.',
        eligibility: 'Senior IEEE PES Members',
        freq: 'Annual',
    },
    {
        icon: 'ri-trophy-line',
        title: 'Best Student Branch Chapter Award',
        desc: 'Presented to the student branch chapter that has shown outstanding performance in technical activities, membership growth, and community impact.',
        eligibility: 'All Student Branches',
        freq: 'Annual',
    },
    {
        icon: 'ri-star-line',
        title: 'Best Student Volunteer Award',
        desc: 'Recognizes a student member who has gone above and beyond in volunteering and contributing to the chapter&apos;s activities.',
        eligibility: 'IEEE PES Student Members',
        freq: 'Annual',
    },
    {
        icon: 'ri-lightbulb-line',
        title: 'Best Technical Paper Award',
        desc: 'Awarded to the best research paper presented at AKPESSC or other chapter-organized conferences.',
        eligibility: 'Student Presenters',
        freq: 'Per Event',
    },
    {
        icon: 'ri-user-star-line',
        title: 'Young Professional Award',
        desc: 'Acknowledges the remarkable contributions of young IEEE PES members (≤ 35 years) to the engineering community.',
        eligibility: 'Young Professionals ≤ 35 yrs',
        freq: 'Annual',
    },
];

export default function AwardsPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Awards &amp; Recognition"
                subtitle="Excellence Matters"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Activities' }, { label: 'Awards' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Recognition</span>
                        <h2 className="section-title mt-3">Celebrating Excellence</h2>
                        <p className="section-desc">Our awards program celebrates the achievements of members who make an outstanding difference.</p>
                    </div>

                    {/* Nominations CTA */}
                    <div className="cta-content-wrapper mb-5" style={{ borderRadius: 24 }}>
                        <div className="cta-text">
                            <span className="cta-badge">Nominations Open</span>
                            <h3>Submit Your Nomination</h3>
                            <p>Nominations for the 2025–2026 cycle are now open. Deadline: March 15, 2026.</p>
                        </div>
                        <div className="cta-actions">
                            <a href="mailto:ieeepes.kerala@ieee.org" className="btn-cta-primary">Nominate Now <i className="ri-arrow-right-line"></i></a>
                        </div>
                    </div>

                    <div className="row g-4">
                        {awards.map((a, i) => (
                            <div key={i} className="col-md-6">
                                <div className="update-box d-flex gap-4" style={{ alignItems: 'flex-start' }}>
                                    <div className="icon-box flex-shrink-0" style={{ width: 60, height: 60, fontSize: 26, borderRadius: 16 }}>
                                        <i className={a.icon}></i>
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--header-color)', marginBottom: 8 }}>{a.title}</h4>
                                        <p style={{ color: '#666', fontSize: 15, marginBottom: 12 }}>{a.desc}</p>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <span style={{ background: '#f0f0f0', borderRadius: 50, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
                                                <i className="ri-group-line me-1"></i>{a.eligibility}
                                            </span>
                                            <span style={{ background: 'rgba(8,145,38,0.08)', color: 'var(--pes-green)', borderRadius: 50, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
                                                <i className="ri-calendar-line me-1"></i>{a.freq}
                                            </span>
                                        </div>
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
