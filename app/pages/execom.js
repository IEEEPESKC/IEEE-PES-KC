'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORY_ORDER = [
    { id: 'professionals', label: 'Professional Members as Office Bearers' },
    { id: 'yp', label: 'Young Professionals' },
    { id: 'gsac', label: 'Graduate Student Activities Committee' },
    { id: 'slt', label: 'Student Leadership Team' }
];

export default function ExecomPage() {
    const [currentMembers, setCurrentMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.execom) {
                    const filtered = result.data.execom.filter(m => !m.status || m.status === 'current');
                    setCurrentMembers(filtered);
                }
            } catch (error) {
                console.error("Error fetching execom data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupedMembers = currentMembers.reduce((acc, member) => {
        const cat = member.category || 'professionals';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(member);
        return acc;
    }, {});

    const otherCategories = Object.keys(groupedMembers).filter(
        c => !CATEGORY_ORDER.find(o => o.id === c)
    );

    const renderMemberCard = (m, i) => (
        <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="execom-card">
                <div className="execom-avatar">
                    {m.imageUrl ? (
                        <Image src={m.imageUrl} alt={m.name} width={180} height={180} style={{ objectFit: 'cover' }} />
                    ) : (
                        <div className="execom-avatar-placeholder">
                            <i className="ri-user-3-line"></i>
                        </div>
                    )}
                </div>
                <h4>{m.name}</h4>
                <p>{m.role}</p>

                <div className="execom-social">
                    {m.email && (
                        <a href={`mailto:${m.email}`} title="Email">
                            <i className="ri-mail-line"></i>
                        </a>
                    )}
                    {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <i className="ri-linkedin-fill"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <PageLayout>
            <PageBanner
                title="Executive Committee"
                subtitle="2025 – 2026"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Execom' }]}
            />

            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <span className="section-badge">Leadership</span>
                        <h2 className="section-title mt-3">2025–2026 Executive Committee</h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '600px' }}>
                            Dedicated professionals and volunteers driving the innovation and excellence of IEEE PES Kerala Chapter.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : currentMembers.length > 0 ? (
                        <>
                            {CATEGORY_ORDER.map(({ id, label }) => {
                                if (!groupedMembers[id] || groupedMembers[id].length === 0) return null;
                                return (
                                    <div key={id} className="mb-5">
                                        <h3 className="text-center mb-4" style={{ color: 'var(--pes-green)', fontWeight: 800 }}>{label}</h3>
                                        <div className="row g-4 justify-content-center">
                                            {groupedMembers[id].map((m, i) => renderMemberCard(m, i))}
                                        </div>
                                    </div>
                                );
                            })}

                            {otherCategories.map(cat => (
                                <div key={cat} className="mb-5">
                                    <h3 className="text-center mb-4" style={{ color: 'var(--pes-green)', fontWeight: 800, textTransform: 'capitalize' }}>
                                        {cat}
                                    </h3>
                                    <div className="row g-4 justify-content-center">
                                        {groupedMembers[cat].map((m, i) => renderMemberCard(m, i))}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Executive committee members will be updated soon.</p>
                        </div>
                    )}

                    <div className="text-center mt-5 pt-4 border-top">
                        <Link href="/pages/past-execom" className="btn btn-outline-success px-4 py-2 rounded-pill fw-bold" style={{ fontSize: '0.9rem' }}>
                            View Past Executive Committees <i className="ri-history-line ms-1"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
