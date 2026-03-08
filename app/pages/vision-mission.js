import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';

export const metadata = {
    title: 'Vision & Mission | IEEE PES Kerala Chapter',
    description: 'The vision and mission of IEEE Power and Energy Society Kerala Chapter.',
};

export default function VisionMissionPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Vision &amp; Mission"
                subtitle="Our Direction"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/pages/about' }, { label: 'Vision & Mission' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="about-info-card" style={{ height: '100%' }}>
                                <div className="icon-box" style={{ width: 70, height: 70, fontSize: 32, marginBottom: 24 }}>
                                    <i className="ri-eye-line"></i>
                                </div>
                                <h3 style={{ color: 'var(--header-color)', marginBottom: 20 }}>Our Vision</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    To be the leading forum in Kerala for sharing scientific and engineering information on electric power and energy — driving a sustainable, reliable, and
                                    affordable energy future for all.
                                </p>
                                <ul className="mt-4" style={{ paddingLeft: 20, color: '#555' }}>
                                    <li className="mb-2">Foster innovation in smart grid and renewable energy technologies</li>
                                    <li className="mb-2">Promote interdisciplinary collaboration across academia and industry</li>
                                    <li className="mb-2">Champion sustainability and clean energy transitions in Kerala</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-card" style={{ height: '100%' }}>
                                <div className="icon-box" style={{ width: 70, height: 70, fontSize: 32, marginBottom: 24 }}>
                                    <i className="ri-rocket-line"></i>
                                </div>
                                <h3 style={{ color: 'var(--header-color)', marginBottom: 20 }}>Our Mission</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    To advance the science, technology, and practice of electric power and energy for the benefit of humanity by organizing impactful programs, developing
                                    professional skills, and fostering a culture of excellence.
                                </p>
                                <ul className="mt-4" style={{ paddingLeft: 20, color: '#555' }}>
                                    <li className="mb-2">Deliver high-quality technical workshops and conferences</li>
                                    <li className="mb-2">Support students and young professionals in their career journeys</li>
                                    <li className="mb-2">Build strong industry-academia partnerships</li>
                                    <li className="mb-2">Recognize and reward excellence in the power and energy domain</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mt-5 pt-4">
                        <div className="section-header">
                            <span className="section-badge">What We Stand For</span>
                            <h2 className="section-title mt-3">Core Values</h2>
                        </div>
                        <div className="row g-4 mt-2">
                            {[
                                { icon: 'ri-lightbulb-line', title: 'Innovation', desc: 'We embrace new ideas and technologies to advance the power sector.' },
                                { icon: 'ri-shield-check-line', title: 'Integrity', desc: 'We act with honesty, transparency, and professionalism.' },
                                { icon: 'ri-team-line', title: 'Collaboration', desc: 'We believe in the power of working together across disciplines.' },
                                { icon: 'ri-leaf-line', title: 'Sustainability', desc: 'We are committed to a greener, cleaner energy future.' },
                            ].map((v, i) => (
                                <div key={i} className="col-md-6 col-lg-3">
                                    <div className="initiative-card text-center">
                                        <i className={v.icon} style={{ fontSize: 36, color: 'var(--pes-green)', display: 'block', marginBottom: 16 }}></i>
                                        <h4>{v.title}</h4>
                                        <p>{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
