import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';

export const metadata = {
    title: 'About IEEE PES Kerala Chapter',
    description: 'Learn about the IEEE Power and Energy Society Kerala Chapter — our history, leadership, and mission.',
};

export default function AboutPage() {
    return (
        <PageLayout>
            <PageBanner
                title="About IEEE PES Kerala"
                subtitle="About Us"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <span className="section-badge">Who We Are</span>
                            <h2 className="section-title mt-3">IEEE PES Kerala Chapter</h2>
                            <p className="mt-3">
                                The IEEE Power and Energy Society (PES) Kerala Chapter is one of the most active chapters under the IEEE Kerala Section. We bring together engineers, researchers,
                                students, and industry professionals who are passionate about the future of power and energy systems.
                            </p>
                            <p className="mt-3">
                                Founded with a commitment to technical excellence, our chapter conducts workshops, seminars, conferences, and community programs that align with the global
                                vision of IEEE PES — to be the leading provider of scientific and engineering information on electric power and energy.
                            </p>
                            <p className="mt-3">
                                From smart grids to renewable energy, from student competitions to professional certifications, IEEE PES Kerala Chapter is at the forefront of shaping
                                the future of energy in the region.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-4">
                                {[
                                    { icon: 'ri-group-line', title: '1900+ Members', desc: 'A thriving community of engineers and students across Kerala' },
                                    { icon: 'ri-building-2-line', title: '50+ Chapters', desc: 'Student and professional branch chapters across Kerala' },
                                    { icon: 'ri-calendar-check-line', title: '100+ Events', desc: 'Technical events, workshops, and competitions every year' },
                                    { icon: 'ri-trophy-line', title: '26+ Years', desc: 'Serving the power and energy community since 1999' },
                                ].map((item, i) => (
                                    <div key={i} className="col-6">
                                        <div className="about-info-card">
                                            <div className="icon-box"><i className={item.icon}></i></div>
                                            <h5>{item.title}</h5>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chair Message */}
            <section className="chair-section section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="chair-message">
                                <div className="section-badge mb-3">Message from Chair</div>
                                <h3>Welcome to IEEE PES Kerala Chapter</h3>
                                <p className="mt-3">
                                    It is my privilege to serve as the Chair of the IEEE Power and Energy Society (PES) Kerala Chapter. Our chapter stands at the intersection of innovation,
                                    research, and real-world impact — bringing together passionate students, professionals, and researchers who are shaping the future of power and energy systems.
                                </p>
                                <p className="mt-3">
                                    I warmly invite every member to actively engage, share ideas, and lead initiatives that make a real difference in the energy landscape of our region.
                                </p>
                                <div className="chair-info mt-4">
                                    <div className="chair-avatar">
                                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--pes-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>
                                            <i className="ri-user-line"></i>
                                        </div>
                                    </div>
                                    <div className="chair-details">
                                        <h5>Dr. Boby Philip</h5>
                                        <p>Chair, IEEE PES Kerala Chapter</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
