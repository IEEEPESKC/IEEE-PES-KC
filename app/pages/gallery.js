'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageBanner from '../components/PageBanner';
import Image from 'next/image';

export default function GalleryPage() {
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.gallery) {
                    setGalleryImages(result.data.gallery);
                }
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <PageLayout>
            <PageBanner
                title="Gallery"
                subtitle="Memories"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
            />

            <section className="section-padding">
                <div className="container">


                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {galleryImages.length > 0 ? galleryImages.map((img, i) => (
                                <div key={i} className="col-6 col-md-4 col-lg-3">
                                    <div className="gallery-card">
                                        <div className="gallery-image-wrapper">
                                            <Image src={img.imageUrl} alt={img.title || 'Gallery Image'} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="gallery-caption">
                                            <h4 style={{ fontSize: '0.9rem' }}>{img.title || 'PES Event'}</h4>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12 text-center py-5">
                                    <p className="text-muted">No images found in the gallery.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PageLayout>
    );
}
