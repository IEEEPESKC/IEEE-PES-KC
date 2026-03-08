import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export const metadata = {
    title: 'Initiatives | IEEE PES Kerala Chapter',
    description: 'Programs and initiatives by IEEE PES Kerala Chapter.',
};

const initiatives = [
    {
        icon: 'ri-graduation-cap-line',
        title: 'Student Activities',
        desc: 'Training programs, workshops, and competitions for students to enhance their skills in power systems, renewable energy, and smart grids.',
        items: ['Technical Workshops', 'Paper Presentations', 'Project Expos', 'Hackathons'],
    },
    {
        icon: 'ri-briefcase-4-line',
        title: 'Professional Development',
        desc: 'Certification courses, webinars, and industry talks for professionals to stay updated with the latest trends in the power and energy sector.',
        items: ['Industry Certification Courses', 'Webinars & Talks', 'Mentorship Programs', 'Leadership Training'],
    },
    {
        icon: 'ri-building-line',
        title: 'Industry Collaboration',
        desc: 'Partnerships with power utilities, renewable energy companies, and research institutions for knowledge transfer and innovation.',
        items: ['Industry Visits', 'Joint Research Projects', 'Internship Facilitation', 'MoU Partnerships'],
    },
    {
        icon: 'ri-leaf-line',
        title: 'Sustainability Programs',
        desc: 'Community outreach programs that spread awareness about renewable energy, energy efficiency, and sustainable development.',
        items: ['Green Energy Walks', 'Solar Awareness Camps', 'EV Webinars', 'Energy Audits'],
    },
    {
        icon: 'ri-women-line',
        title: 'WoW – Women in Power',
        desc: 'Dedicated programs empowering women engineers to lead and excel in the energy transition through specialized workshops and networking.',
        items: ['Mentorship Sessions', 'Leadership Workshops', 'Tech-HER Program', 'Networking Events'],
    },
    {
        icon: 'ri-award-line',
        title: 'Intellect – State Quiz',
        desc: 'Our premier state-level technical quiz challenging the brightest minds in power engineering from across Kerala.',
        items: ['Quiz Competitions', 'Paper Presentations', 'Technical Debates', 'Expert Panels'],
    },
];

export default function InitiativesPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Initiatives"
                subtitle="Our Programs"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Activities' }, { label: 'Initiatives' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Programs</span>
                        <h2 className="section-title mt-3">What We Do</h2>
                        <p className="section-desc">A comprehensive set of programs designed to empower every member — from students to seasoned professionals.</p>
                    </div>
                    <div className="row g-4">
                        {initiatives.map((item, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="initiative-card" style={{ height: '100%' }}>
                                    <i className={item.icon} style={{ fontSize: 36, color: 'var(--pes-green)', display: 'block', marginBottom: 16 }}></i>
                                    <h4 style={{ color: 'var(--header-color)', marginBottom: 12 }}>{item.title}</h4>
                                    <p style={{ color: '#666', marginBottom: 16 }}>{item.desc}</p>
                                    <ul style={{ paddingLeft: 18, color: '#555' }}>
                                        {item.items.map((li, j) => <li key={j} style={{ marginBottom: 4, fontSize: 14 }}>{li}</li>)}
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
