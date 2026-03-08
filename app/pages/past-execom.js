'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';
import Image from 'next/image';

const CATEGORY_ORDER = [
    { id: 'professionals', label: 'Professional Members as Office Bearers' },
    { id: 'yp', label: 'Young Professionals' },
    { id: 'gsac', label: 'Graduate Student Activities Committee' },
    { id: 'slt', label: 'Student Leadership Team' }
];

export default function PastExecomPage() {
    const [pastMembers, setPastMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.execom) {
                    const filtered = result.data.execom.filter(m => m.status === 'past');
                    setPastMembers(filtered);
                }
            } catch (error) {
                console.error("Error fetching past execom data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Group members by year and then category
    const groupedByYearAndCategory = pastMembers.reduce((acc, member) => {
        const year = member.year || 'Unknown Year';
        if (!acc[year]) acc[year] = {};

        const cat = member.category || 'professionals';
        if (!acc[year][cat]) acc[year][cat] = [];
        acc[year][cat].push(member);

        return acc;
    }, {});

    // Sort years descending
    const sortedYears = Object.keys(groupedByYearAndCategory).sort((a, b) => b.localeCompare(a));

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
                title="Past Executive Committees"
                subtitle="Our Legacy"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Execom', href: '/pages/execom' }, { label: 'Past Execom' }]}
            />

            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <span className="section-badge">History</span>
                        <h2 className="section-title mt-3">Previous Leadership Teams</h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '600px' }}>
                            Honoring the dedicated professionals and volunteers who built our chapter into what it is today.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : sortedYears.length > 0 ? (
                        sortedYears.map((year) => (
                            <div key={year} className="mb-5 pb-5 border-bottom">
                                <h3 className="text-center mb-5" style={{ color: 'var(--pes-green)', fontWeight: 800, fontSize: '2rem' }}>{year}</h3>

                                {CATEGORY_ORDER.map(({ id, label }) => {
                                    const members = groupedByYearAndCategory[year][id];
                                    if (!members || members.length === 0) return null;
                                    return (
                                        <div key={id} className="mb-5">
                                            <h4 className="text-center mb-4" style={{ color: 'var(--header-color)', fontWeight: 600, fontSize: '1.25rem' }}>{label}</h4>
                                            <div className="row g-4 justify-content-center">
                                                {members.map((m, i) => renderMemberCard(m, i))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {Object.keys(groupedByYearAndCategory[year])
                                    .filter(c => !CATEGORY_ORDER.find(o => o.id === c))
                                    .map(cat => (
                                        <div key={cat} className="mb-5">
                                            <h4 className="text-center mb-4" style={{ color: 'var(--header-color)', fontWeight: 600, fontSize: '1.25rem', textTransform: 'capitalize' }}>{cat}</h4>
                                            <div className="row g-4 justify-content-center">
                                                {groupedByYearAndCategory[year][cat].map((m, i) => renderMemberCard(m, i))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No past executive committee records found.</p>
                        </div>
                    )}
                </div>
            </section>
        </PageLayout>
    );
}
