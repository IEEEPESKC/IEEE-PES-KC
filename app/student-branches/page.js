import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export const metadata = {
    title: 'Student Branch Chapters | IEEE PES Kerala Chapter',
    description: 'Student Branch Chapters of IEEE PES under the Kerala Section.',
};

const branches = [
    { name: 'GEC Barton Hill', location: 'Thiruvananthapuram', status: 'Active' },
    { name: 'NIT Calicut', location: 'Kozhikode', status: 'Active' },
    { name: 'College of Engineering Trivandrum (CET)', location: 'Thiruvananthapuram', status: 'Active' },
    { name: 'Government Engineering College Thrissur', location: 'Thrissur', status: 'Active' },
    { name: 'Model Engineering College', location: 'Ernakulam', status: 'Active' },
    { name: 'CUSAT', location: 'Ernakulam', status: 'Active' },
    { name: 'TKM College of Engineering', location: 'Kollam', status: 'Active' },
    { name: 'College of Engineering Vadakara', location: 'Kozhikode', status: 'Active' },
];

export default function StudentBranchesPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Student Branch Chapters"
                subtitle="Activities"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Activities' }, { label: 'Student Branches' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Chapters</span>
                        <h2 className="section-title mt-3">Our Student Community</h2>
                        <p className="section-desc">50+ student branch chapters across Kerala driving technical excellence at the grassroots level.</p>
                    </div>

                    {/* Stats */}
                    <div className="row g-4 mb-5 text-center">
                        {[
                            { icon: 'ri-building-2-line', val: '50+', label: 'Student Branches' },
                            { icon: 'ri-group-line', val: '1500+', label: 'Student Members' },
                            { icon: 'ri-map-pin-2-line', val: '14', label: 'Districts Covered' },
                        ].map((s, i) => (
                            <div key={i} className="col-4">
                                <i className={s.icon} style={{ fontSize: 36, color: 'var(--pes-green)' }}></i>
                                <h3 style={{ fontWeight: 800, color: 'var(--header-color)', margin: '8px 0 4px' }}>{s.val}</h3>
                                <p style={{ color: '#666', fontSize: 14 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Branch List */}
                    <div className="row g-4">
                        {branches.map((b, i) => (
                            <div key={i} className="col-md-6 col-lg-3">
                                <div className="initiative-card">
                                    <i className="ri-school-line" style={{ fontSize: 28, color: 'var(--pes-green)', marginBottom: 12, display: 'block' }}></i>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{b.name}</h4>
                                    <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}><i className="ri-map-pin-line"></i> {b.location}</p>
                                    <span style={{ background: 'rgba(8,145,38,0.1)', color: 'var(--pes-green)', borderRadius: 50, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                                        {b.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
