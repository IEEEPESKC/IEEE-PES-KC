'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';
import Image from 'next/image';
import Link from 'next/link';

export default function PastEventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.events) {
                    const pastEvents = result.data.events.filter(e => {
                        const tags = Array.isArray(e.tags) ? e.tags : (typeof e.tags === 'string' ? e.tags.split(',').map(t => t.trim()) : []);
                        return tags.some(t => {
                            const tl = t.toLowerCase();
                            return tl === 'past' || tl === 'recent' || tl === 'past event' || tl === 'recent event' || tl === 'past events' || tl === 'recent events';
                        });
                    });
                    setEvents(pastEvents);
                }
            } catch (error) {
                console.error("Error fetching events data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    return (
        <PageLayout>
            <PageBanner
                title="Past Events"
                subtitle="Our Journey"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Events' }, { label: 'Past Events' }]}
            />

            <section className="section-padding">
                <div className="container">

                    <div className="section-header mb-5 text-center">
                        <span className="section-badge">Looking Back</span>
                        <h2 className="section-title mt-3">Events We've Organized</h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '600px' }}>A collection of memorable events that have shaped our community over the years.</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row g-4 mb-4">
                                {events.length > 0 ? events.slice(0, visibleCount).map((e, i) => (
                                    <div key={i} className="col-md-6 col-lg-4">
                                        <div className="event-card">
                                            <div className="event-card-image">
                                                {e.imageUrl ? (
                                                    <Image src={e.imageUrl} alt={e.title} width={640} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="ri-image-line" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="event-card-body">
                                                <div>
                                                    <span className="event-date"><i className="bi bi-calendar-check"></i> {e.date || 'TBA'}</span>
                                                    <h3 style={{ fontSize: '1.1rem' }}>{e.title}</h3>
                                                    <p className="event-venue"><i className="bi bi-geo-alt-fill"></i> {e.venue || 'TBA'}</p>
                                                    <p style={{ color: '#666', fontSize: 14 }}>{e.description || e.desc}</p>
                                                </div>
                                                <span className="btn-register" style={{ cursor: 'default', opacity: 0.7 }}>Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-12 text-center py-5">
                                        <p className="text-muted">No past events are available currently.</p>
                                    </div>
                                )}
                            </div>

                            {visibleCount < events.length && (
                                <div className="text-center mb-5">
                                    <button onClick={handleLoadMore} className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold">
                                        Load More Events <i className="ri-arrow-down-line ms-1"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="text-center mt-5 pt-4 border-top">
                        <Link href="/pages/upcoming-events" className="btn btn-outline-success px-4 py-2 rounded-pill fw-bold">
                            View Upcoming Events <i className="ri-arrow-right-line ms-1"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
