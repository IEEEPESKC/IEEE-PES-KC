import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';

export const metadata = {
    title: 'Resources | IEEE PES Kerala Chapter',
    description: 'Technical resources, publications, and learning materials from IEEE PES Kerala Chapter.',
};

const resources = [
    {
        category: 'Technical Papers',
        icon: 'ri-file-text-line',
        items: [
            { title: 'Smart Grid Technologies in Kerala', type: 'PDF', link: 'https://ieeexplore.ieee.org/' },
            { title: 'Renewable Energy Integration Challenges', type: 'PDF', link: 'https://ieeexplore.ieee.org/' },
            { title: 'Power System Protection Basics', type: 'PDF', link: 'https://ieeexplore.ieee.org/' },
        ],
    },
    {
        category: 'Presentation Slides',
        icon: 'ri-slideshow-line',
        items: [
            { title: 'Introduction to IEEE PES', type: 'PPTX', link: '#' },
            { title: 'Smart Grid Workshop Slides 2025', type: 'PPTX', link: '#' },
            { title: 'EV & Energy Storage Overview', type: 'PPTX', link: '#' },
        ],
    },
    {
        category: 'Learning Materials',
        icon: 'ri-book-open-line',
        items: [
            { title: 'Power Engineering Fundamentals', type: 'Link', link: 'https://ieeexplore.ieee.org/' },
            { title: 'IEEE PES Online Courses', type: 'Link', link: 'https://ieee-pes.org/education/' },
            { title: 'Smart Grid Resource Hub', type: 'Link', link: 'https://smartgrid.ieee.org/' },
        ],
    },
    {
        category: 'Standards & Guides',
        icon: 'ri-clipboard-line',
        items: [
            { title: 'IEEE Std 1547 – Interconnection', type: 'Link', link: 'https://standards.ieee.org/' },
            { title: 'IEEE Std 2030 – Smart Grid', type: 'Link', link: 'https://standards.ieee.org/' },
            { title: 'IEEE Std 693 – Seismic Design', type: 'Link', link: 'https://standards.ieee.org/' },
        ],
    },
];

export default function ResourcesPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Resources"
                subtitle="Knowledge Hub"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Resources</span>
                        <h2 className="section-title mt-3">Technical Resources & Learning</h2>
                        <p className="section-desc">A curated collection of resources for students, professionals, and researchers in the power engineering domain.</p>
                    </div>

                    {/* IEEE Xplore CTA */}
                    <div className="cta-content-wrapper mb-5" style={{ borderRadius: 24 }}>
                        <div className="cta-text">
                            <span className="cta-badge">IEEE Xplore</span>
                            <h3>Access 5M+ Technical Documents</h3>
                            <p>As an IEEE member, you get access to the world&apos;s largest digital library of engineering knowledge.</p>
                        </div>
                        <div className="cta-actions">
                            <a href="https://ieeexplore.ieee.org/" target="_blank" rel="noreferrer" className="btn-cta-primary">Open IEEE Xplore <i className="ri-external-link-line"></i></a>
                        </div>
                    </div>

                    <div className="row g-4">
                        {resources.map((cat, i) => (
                            <div key={i} className="col-md-6">
                                <div className="update-box">
                                    <div className="update-box-title">
                                        <i className={cat.icon}></i>
                                        <h3>{cat.category}</h3>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {cat.items.map((item, j) => (
                                            <li key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                                <span style={{ fontSize: 15 }}>{item.title}</span>
                                                <a href={item.link} target="_blank" rel="noreferrer" className="btn-view-all" style={{ padding: '6px 16px', fontSize: 12 }}>
                                                    {item.type} <i className="ri-arrow-right-line"></i>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
