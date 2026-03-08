import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';

export const metadata = {
    title: 'Newsletters | IEEE PES Kerala Chapter',
    description: 'IEEE PES Kerala Chapter newsletters and publications.',
};

const newsletters = [
    { title: 'PES Kerala Newsletter – Q4 2025', date: 'Dec 2025', desc: 'Year-end edition covering AKPESSC 2025, WoW program highlights, and the upcoming AGM 2026.', size: '2.4 MB' },
    { title: 'PES Kerala Newsletter – Q3 2025', date: 'Sep 2025', desc: 'Special focus on renewable energy initiatives and Intellect 2025 quiz results.', size: '1.9 MB' },
    { title: 'PES Kerala Newsletter – Q2 2025', date: 'Jun 2025', desc: 'PES Day 2025 celebrations, Smart Grid workshop coverage, and member spotlights.', size: '2.1 MB' },
    { title: 'PES Kerala Newsletter – Q1 2025', date: 'Mar 2025', desc: 'AGM 2025 recap, new execom introduction, and plans for the year ahead.', size: '1.7 MB' },
    { title: 'PES Kerala Newsletter – Q4 2024', date: 'Dec 2024', desc: 'Annual report, chapter achievements, and milestones of 2024.', size: '3.2 MB' },
    { title: 'PES Kerala Newsletter – Q3 2024', date: 'Sep 2024', desc: 'Mid-year roundup of events and chapter highlights.', size: '2.0 MB' },
];

export default function NewslettersPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Newsletters"
                subtitle="Stay Informed"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Newsletters' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Publications</span>
                        <h2 className="section-title mt-3">Chapter Newsletters</h2>
                        <p className="section-desc">Stay updated with our quarterly newsletters covering events, achievements, and technical insights.</p>
                    </div>

                    {/* Subscribe CTA */}
                    <div className="cta-content-wrapper mb-5" style={{ borderRadius: 24 }}>
                        <div className="cta-text">
                            <span className="cta-badge">Subscribe</span>
                            <h3>Get Newsletters in Your Inbox</h3>
                            <p>Never miss an edition. Subscribe to receive new newsletters directly by email.</p>
                        </div>
                        <div className="cta-actions">
                            <a href="mailto:ieeepes.kerala@ieee.org?subject=Newsletter Subscription" className="btn-cta-primary">Subscribe <i className="ri-mail-send-line"></i></a>
                        </div>
                    </div>

                    <div className="row g-4">
                        {newsletters.map((n, i) => (
                            <div key={i} className="col-md-6">
                                <div className="update-box d-flex gap-4 align-items-start">
                                    <div className="icon-box flex-shrink-0" style={{ width: 56, height: 56, borderRadius: 16, fontSize: 24 }}>
                                        <i className="ri-file-text-line"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                                            <h4 style={{ fontSize: '1rem', color: 'var(--header-color)', marginBottom: 6 }}>{n.title}</h4>
                                            <span style={{ background: 'rgba(8,145,38,0.08)', color: 'var(--pes-green)', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{n.date}</span>
                                        </div>
                                        <p style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>{n.desc}</p>
                                        <div className="d-flex gap-3 align-items-center">
                                            <span style={{ color: '#999', fontSize: 13 }}><i className="ri-file-download-line me-1"></i>{n.size}</span>
                                            <a href="#" className="btn-view-all" style={{ padding: '6px 16px', fontSize: 12 }}>
                                                Download PDF <i className="ri-download-line"></i>
                                            </a>
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
