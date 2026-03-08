import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import Link from 'next/link';

export const metadata = {
    title: 'Membership Benefits | IEEE PES Kerala Chapter',
    description: 'Benefits of joining IEEE PES Kerala Chapter.',
};

const benefits = [
    { icon: 'ri-book-read-line', title: 'IEEE Xplore Access', desc: 'Access millions of technical documents, journals, and research publications from the world\'s largest repository of engineering knowledge.' },
    { icon: 'ri-team-line', title: 'Global Networking', desc: 'Connect with 45,000+ IEEE PES members worldwide and build meaningful professional relationships with industry experts.' },
    { icon: 'ri-briefcase-4-line', title: 'Career Growth', desc: 'Exclusive access to workshops, webinars, and technical certifications that directly boost your career in the power sector.' },
    { icon: 'ri-coupon-2-line', title: 'Member Perks', desc: 'Special discounts on IEEE conferences, publications, and member-only grants and fellowships.' },
    { icon: 'ri-award-line', title: 'Recognition', desc: 'Prestigious awards and recognition programs for professional and student excellence within the chapter.' },
    { icon: 'ri-flashlight-line', title: 'Leadership Opportunities', desc: 'Volunteer roles and leadership positions to build soft skills and make a lasting impact on the engineering community.' },
];

const plans = [
    { title: 'Student Member', price: '~₹2,000', per: '/year', features: ['IEEE Membership', 'PES Member Access', 'Student Events', 'PES Publications'], highlight: false },
    { title: 'Professional Member', price: '~₹8,000', per: '/year', features: ['Full IEEE Membership', 'PES Grade Membership', 'All Chapter Benefits', 'Voting Rights', 'Awards Eligibility'], highlight: true },
    { title: 'Life Member', price: 'One-time', per: '', features: ['Lifetime IEEE Access', 'All Member Benefits', 'No Annual Renewal', 'Senior Grade Consideration'], highlight: false },
];

export default function MembershipBenefitsPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Membership Benefits"
                subtitle="Join Us"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Membership' }, { label: 'Benefits' }]}
            />

            {/* Benefits */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Why Join</span>
                        <h2 className="section-title mt-3">What You Get as a Member</h2>
                        <p className="section-desc">Join the world&apos;s leading power engineering society and unlock a world of opportunities.</p>
                    </div>
                    <div className="row g-4">
                        {benefits.map((b, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="benefit-card">
                                    <i className={b.icon}></i>
                                    <div>
                                        <h4>{b.title}</h4>
                                        <p>{b.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Plans */}
            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Membership Types</span>
                        <h2 className="section-title mt-3">Choose Your Plan</h2>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {plans.map((p, i) => (
                            <div key={i} className="col-md-4">
                                <div className="update-box text-center" style={{ borderTop: p.highlight ? '4px solid var(--pes-green)' : '4px solid transparent' }}>
                                    {p.highlight && <span className="section-badge mb-3 d-inline-block">Most Popular</span>}
                                    <h3 style={{ color: 'var(--header-color)', fontWeight: 800 }}>{p.title}</h3>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--pes-green)', lineHeight: 1, margin: '16px 0 4px' }}>{p.price}</div>
                                    <div style={{ color: '#999', fontSize: 14, marginBottom: 24 }}>{p.per}</div>
                                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left' }}>
                                        {p.features.map((f, j) => (
                                            <li key={j} style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: 15 }}>
                                                <i className="ri-check-line me-2" style={{ color: 'var(--pes-green)', fontWeight: 700 }}></i>{f}
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noreferrer" className={p.highlight ? 'btn-green' : 'btn-base-color'} style={{ display: 'inline-flex' }}>
                                        Join Now <i className="ri-arrow-right-line ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
