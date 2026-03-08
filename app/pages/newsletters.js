'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data) {
                    if (result.data.newsletters) setNewsletters(result.data.newsletters);
                    if (result.data.magazines) setMagazines(result.data.magazines);
                }
            } catch (error) {
                console.error("Error fetching publications data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderPublicationCard = (item, iconClass = "ri-file-text-line") => (
        <div className="col-md-6" key={item.id || item.title}>
            <div className="update-box d-flex gap-4 align-items-start">
                <div className="icon-box flex-shrink-0" style={{ width: 56, height: 56, borderRadius: 16, fontSize: 24, overflow: 'hidden', padding: item.imageUrl ? 0 : '', background: item.imageUrl ? '#fff' : '' }}>
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <i className={iconClass}></i>
                    )}
                </div>
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                        <h4 style={{ fontSize: '1rem', color: 'var(--header-color)', marginBottom: 6 }}>{item.title}</h4>
                        <span style={{ background: 'rgba(8,145,38,0.08)', color: 'var(--pes-green)', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                            {item.date || item.month || 'Published'}
                        </span>
                    </div>
                    <p style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>{item.desc || item.description}</p>
                    <div className="d-flex gap-3 align-items-center">
                        <span style={{ color: '#999', fontSize: 13 }}><i className="ri-file-pdf-line me-1"></i>PDF</span>
                        {item.pdfUrl ? (
                            <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="btn-view-all" style={{ padding: '6px 16px', fontSize: 12 }}>
                                Download <i className="ri-download-line"></i>
                            </a>
                        ) : (
                            <span className="btn-view-all" style={{ padding: '6px 16px', fontSize: 12, opacity: 0.5, cursor: 'not-allowed' }}>
                                Not Available
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <PageLayout>
            <PageBanner
                title="Publications"
                subtitle="Stay Informed"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Publications' }]}
            />

            <section className="section-padding">
                <div className="container">

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Newsletters Section */}
                            <div className="section-header mb-5">
                                <span className="section-badge">Newsletters</span>
                                <h2 className="section-title mt-3">Chapter Newsletters</h2>
                                <p className="section-desc">Stay updated with our newsletters covering events, achievements, and technical insights.</p>
                            </div>

                            <div className="row g-4 mb-5 pb-4 border-bottom">
                                {newsletters.length > 0 ? newsletters.map((n) => renderPublicationCard(n, 'ri-file-text-line')) : (
                                    <div className="col-12 text-center py-4">
                                        <p className="text-muted">No newsletters available currently.</p>
                                    </div>
                                )}
                            </div>

                            {/* Magazines Section */}
                            <div className="section-header mb-5 mt-5">
                                <span className="section-badge">Magazines</span>
                                <h2 className="section-title mt-3">Chapter Magazines</h2>
                                <p className="section-desc">Deep dives into technical topics and comprehensive chapter reports in our magazines.</p>
                            </div>

                            <div className="row g-4 mb-5">
                                {magazines.length > 0 ? magazines.map((m) => renderPublicationCard(m, 'ri-book-read-line')) : (
                                    <div className="col-12 text-center py-4">
                                        <p className="text-muted">No magazines available currently.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Subscribe CTA */}
                    <div className="cta-content-wrapper mb-5" style={{ borderRadius: 24 }}>
                        <div className="cta-text">
                            <span className="cta-badge">Subscribe</span>
                            <h3>Get Publications in Your Inbox</h3>
                            <p>Never miss an edition. Subscribe to receive new newsletters and magazines directly by email.</p>
                        </div>
                        <div className="cta-actions">
                            <a href="mailto:ieeepes.kerala@ieee.org?subject=Publication Subscription" className="btn-cta-primary">Subscribe <i className="ri-mail-send-line"></i></a>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
