'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export default function AwardsPage() {
    const [awards, setAwards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.awards) {
                    setAwards(result.data.awards);
                }
            } catch (error) {
                console.error("Error fetching awards data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <PageLayout>
            <PageBanner
                title="Awards & Recognition"
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

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {awards.length > 0 ? awards.map((a, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="update-box d-flex gap-4" style={{ alignItems: 'flex-start' }}>
                                        <div className="icon-box flex-shrink-0" style={{ width: 60, height: 60, fontSize: 26, borderRadius: 16 }}>
                                            <i className={a.icon || 'ri-medal-line'}></i>
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'var(--header-color)', marginBottom: 8 }}>{a.name || a.title}</h4>
                                            <p style={{ color: '#666', fontSize: 15, marginBottom: 12 }}>{a.desc || a.description}</p>
                                            <div className="d-flex gap-3 flex-wrap">
                                                <span style={{ background: '#f0f0f0', borderRadius: 50, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
                                                    <i className="ri-group-line me-1"></i>{a.eligibility || 'All Members'}
                                                </span>
                                                <span style={{ background: 'rgba(8,145,38,0.08)', color: 'var(--pes-green)', borderRadius: 50, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
                                                    <i className="ri-calendar-line me-1"></i>{a.freq || 'Annual'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12 text-center py-5">
                                    <p className="text-muted">No awards available currently.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PageLayout>
    );
}
