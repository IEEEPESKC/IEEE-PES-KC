import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';

export const metadata = {
    title: 'Past Execom | IEEE PES Kerala Chapter',
    description: 'Past Executive Committees of IEEE PES Kerala Chapter.',
};

const pastExecoms = [
    { year: '2023 – 2024', chair: 'TBD', secretary: 'TBD', treasurer: 'TBD' },
    { year: '2021 – 2022', chair: 'TBD', secretary: 'TBD', treasurer: 'TBD' },
    { year: '2019 – 2020', chair: 'TBD', secretary: 'TBD', treasurer: 'TBD' },
    { year: '2017 – 2018', chair: 'TBD', secretary: 'TBD', treasurer: 'TBD' },
];

export default function PastExecomPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Past Executive Committees"
                subtitle="Our Legacy"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Execom', href: '/pages/execom' }, { label: 'Past Execom' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">History</span>
                        <h2 className="section-title mt-3">Previous Leadership Teams</h2>
                        <p className="section-desc">Honoring those who built our chapter into what it is today.</p>
                    </div>

                    <div className="row g-4">
                        {pastExecoms.map((e, i) => (
                            <div key={i} className="col-md-6">
                                <div className="update-box">
                                    <h4 style={{ color: 'var(--pes-green)', fontWeight: 700, marginBottom: 16 }}>{e.year}</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li className="d-flex gap-3 mb-2"><span style={{ fontWeight: 600, minWidth: 100 }}>Chair</span><span>{e.chair}</span></li>
                                        <li className="d-flex gap-3 mb-2"><span style={{ fontWeight: 600, minWidth: 100 }}>Secretary</span><span>{e.secretary}</span></li>
                                        <li className="d-flex gap-3"><span style={{ fontWeight: 600, minWidth: 100 }}>Treasurer</span><span>{e.treasurer}</span></li>
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
