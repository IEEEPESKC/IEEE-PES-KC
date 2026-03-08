import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import Image from 'next/image';

export const metadata = {
    title: 'Executive Committee | IEEE PES Kerala Chapter',
    description: 'Meet the 2025–2026 Executive Committee of IEEE PES Kerala Chapter.',
};

const execomMembers = [
    { name: 'Dr. Boby Philip', role: 'Chair', img: '/images/ieee-images/BobyPhilp.jpeg' },
    { name: 'TBD', role: 'Vice Chair', img: null },
    { name: 'TBD', role: 'Secretary', img: null },
    { name: 'TBD', role: 'Treasurer', img: null },
    { name: 'TBD', role: 'Student Activities Chair', img: null },
    { name: 'TBD', role: 'Industry Relations Chair', img: null },
    { name: 'TBD', role: 'Membership Development Chair', img: null },
    { name: 'TBD', role: 'Technical Activities Chair', img: null },
];

export default function ExecomPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Executive Committee"
                subtitle="2025 – 2026"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Execom' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Leadership</span>
                        <h2 className="section-title mt-3">Meet Our Team</h2>
                        <p className="section-desc">Dedicated volunteers driving the chapter&apos;s mission forward.</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {execomMembers.map((m, i) => (
                            <div key={i} className="col-6 col-md-4 col-lg-3">
                                <div className="execom-card text-center">
                                    <div className="execom-avatar">
                                        {m.img ? (
                                            <Image src={m.img} alt={m.name} width={100} height={100} style={{ objectFit: 'cover', borderRadius: '50%', width: 100, height: 100 }} />
                                        ) : (
                                            <div className="execom-avatar-placeholder">
                                                <i className="ri-user-line"></i>
                                            </div>
                                        )}
                                    </div>
                                    <h4>{m.name}</h4>
                                    <p>{m.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
