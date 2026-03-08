import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';
import Image from 'next/image';

export const metadata = {
    title: 'Gallery | IEEE PES Kerala Chapter',
    description: 'Photo gallery from IEEE PES Kerala Chapter events and activities.',
};

const galleryImages = [
    { src: '/images/ieee-images/Gallery/gallery_1.png', caption: 'Knowledge Sharing Sessions' },
    { src: '/images/ieee-images/Gallery/gallery_2.png', caption: 'Hands-on Workshops' },
    { src: '/images/ieee-images/Gallery/gallery_3.png', caption: 'Volunteer Gatherings' },
    { src: '/images/ieee-images/Gallery/gallery_4.png', caption: 'Industrial Visits' },
    { src: '/images/ieee-images/recent_1.png', caption: 'Power System Workshop' },
    { src: '/images/ieee-images/recent_2.png', caption: 'PES Day Celebrations' },
    { src: '/images/ieee-images/Flagships/akpessc_flagship_1770434008791.png', caption: 'AKPESSC 2025' },
    { src: '/images/ieee-images/Flagships/intellect_flagship_1770434044351.png', caption: 'Intellect Quiz 2025' },
    { src: '/images/ieee-images/Flagships/wow_flagship_1770434024340.png', caption: 'WoW – Women in Power' },
];

export default function GalleryPage() {
    return (
        <PageLayout>
            <PageBanner
                title="Gallery"
                subtitle="Memories"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="section-header mb-5">
                        <span className="section-badge">Photos</span>
                        <h2 className="section-title mt-3">Moments That Matter</h2>
                        <p className="section-desc">A visual journey through our impactful events, workshops, and community activities.</p>
                    </div>

                    <div className="row g-4">
                        {galleryImages.map((img, i) => (
                            <div key={i} className="col-6 col-md-4 col-lg-3">
                                <div className="gallery-card">
                                    <div className="gallery-image-wrapper">
                                        <Image src={img.src} alt={img.caption} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="gallery-caption">
                                        <h4 style={{ fontSize: '0.9rem' }}>{img.caption}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
