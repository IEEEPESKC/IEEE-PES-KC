import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';

export const metadata = {
    title: 'History | IEEE PES Kerala Chapter',
    description: 'The history and milestones of IEEE Power and Energy Society Kerala Chapter.',
};

const milestones = [
    { year: '1999', title: 'Chapter Founded', desc: 'IEEE PES Kerala Chapter was established under the IEEE Kerala Section, marking the beginning of a new era in power engineering.' },
    { year: '2005', title: 'First AKPESSC', desc: 'The inaugural All Kerala Power & Energy Society Student Congress brought together students from across the state.' },
    { year: '2010', title: 'Growing Network', desc: 'Chapter expanded to over 20 student branch chapters across Kerala colleges and universities.' },
    { year: '2015', title: 'Best Chapter Award', desc: 'Recognized as one of the best IEEE PES chapters in the Asia Pacific region for outstanding activities.' },
    { year: '2018', title: 'Smart Grid Focus', desc: 'Launched dedicated programs on Smart Grid, IoT in power systems, and renewable energy integration.' },
    { year: '2020', title: 'Digital Transition', desc: 'Successfully transitioned all programs to virtual formats during the pandemic, reaching a wider audience than ever.' },
    { year: '2022', title: '1900+ Members', desc: 'Crossed the milestone of 1900 active members, reflecting the growing interest in power engineering across Kerala.' },
    { year: '2025', title: 'New Horizons', desc: 'Launched new initiatives on EV, energy storage, and green hydrogen, with industry partnerships across Kerala.' },
];

export default function HistoryPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Our History"
                subtitle="Since 1999"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'History' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Milestones</span>
                        <h2 className="section-title mt-3">Our Journey Through the Years</h2>
                        <p className="section-desc">From a small group of passionate engineers to one of Kerala&apos;s most impactful technical communities.</p>
                    </div>

                    <div className="timeline">
                        {milestones.map((m, i) => (
                            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <span className="timeline-year">{m.year}</span>
                                    <h4>{m.title}</h4>
                                    <p>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
