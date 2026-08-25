'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swiper from 'swiper';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from API
    useEffect(() => {
        fetch('/api/admin')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setEvents(data.data.events || []);
                    setAnnouncements(data.data.announcements || []);
                    setGallery(data.data.gallery || []);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching home data:", err);
                setEvents([]);
                setAnnouncements([]);
                setGallery([]);
                setIsLoading(false);
            });
    }, []);

    // Initialize scripts after data loads
    useEffect(() => {
        if (isLoading) return;

        const initScripts = () => {
            // Initialize AOS
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 50
            });

            // Hero cursor-reactive glow (desktop pointer only)
            const heroSection = document.getElementById('hero');
            const heroGlow = document.getElementById('heroGlow');
            let heroGlowRaf = null;
            const handleHeroPointerMove = (e) => {
                if (heroGlowRaf) return;
                heroGlowRaf = requestAnimationFrame(() => {
                    const rect = heroSection.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    heroGlow.style.setProperty('--mx', `${x}%`);
                    heroGlow.style.setProperty('--my', `${y}%`);
                    heroGlowRaf = null;
                });
            };
            if (heroSection && heroGlow && window.matchMedia('(hover: hover)').matches) {
                heroSection.addEventListener('mousemove', handleHeroPointerMove);
            }

            // Upcoming Events Swiper
            const upcomingSlides = document.querySelectorAll('.upcoming-events-swiper .swiper-slide');
            if (upcomingSlides.length > 0) {
                new Swiper('.upcoming-events-swiper', {
                    modules: [Pagination, Autoplay, EffectFade],
                    slidesPerView: 1,
                    autoplay: { delay: 3500, disableOnInteraction: false },
                    pagination: { el: '.upcoming-swiper-pagination', clickable: true },
                    loop: upcomingSlides.length > 1,
                    effect: 'fade',
                    fadeEffect: { crossFade: true }
                });
            }

            // Recent Events Swiper
            const recentSlides = document.querySelectorAll('.recent-events-swiper .swiper-slide');
            if (recentSlides.length > 0) {
                new Swiper('.recent-events-swiper', {
                    modules: [Pagination, Autoplay],
                    slidesPerView: 1,
                    spaceBetween: 20,
                    breakpoints: {
                        768: { slidesPerView: 2, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                        1200: { slidesPerView: 4, spaceBetween: 24 }
                    },
                    autoplay: { delay: 4000, disableOnInteraction: false },
                    pagination: { el: '.recent-events-pagination', clickable: true },
                    loop: recentSlides.length > 3,
                });
            }

            // Gallery Marquee Scroll Effect — infinite, wraps seamlessly, driven by page scroll position
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const handleMarqueeScroll = () => {
                if (prefersReducedMotion) return;
                const marquee = document.querySelector('.marquee-container');
                if (marquee) {
                    const halfWidth = marquee.scrollWidth / 2;
                    if (halfWidth > 0) {
                        const offset = (window.scrollY * 0.6) % halfWidth;
                        marquee.style.transform = `translateX(${-offset}px)`;
                    }
                }
            };
            if (!prefersReducedMotion) {
                window.addEventListener('scroll', handleMarqueeScroll, { passive: true });
                window.addEventListener('resize', handleMarqueeScroll, { passive: true });
                handleMarqueeScroll();
            }

            // Gallery Preview Logic
            let galleryTimer;
            const modal = document.getElementById('galleryPreview');
            const img = document.getElementById('previewImg');
            const timerBar = document.getElementById('previewTimer');

            const openGalleryPreview = (imgSrc) => {
                if (!img || !modal || !timerBar) return;
                img.src = imgSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                timerBar.style.transition = 'none';
                timerBar.style.width = '100%';

                setTimeout(() => {
                    timerBar.style.transition = 'width 10s linear';
                    timerBar.style.width = '0%';
                }, 50);

                clearTimeout(galleryTimer);
                galleryTimer = setTimeout(closeGalleryPreview, 10000);
            };

            const closeGalleryPreview = () => {
                if (!modal) return;
                modal.classList.remove('active');
                document.body.style.overflow = '';
                clearTimeout(galleryTimer);
            };

            if (modal) modal.onclick = closeGalleryPreview;

            document.querySelectorAll('.gallery-card').forEach(card => {
                card.addEventListener('click', () => {
                    const imgElement = card.querySelector('img');
                    if (imgElement) openGalleryPreview(imgElement.src);
                });
            });

            const closeBtn = document.querySelector('.gallery-preview-close');
            if (closeBtn) closeBtn.addEventListener('click', closeGalleryPreview);

            return () => {
                window.removeEventListener('scroll', handleMarqueeScroll);
                window.removeEventListener('resize', handleMarqueeScroll);
                if (heroSection) heroSection.removeEventListener('mousemove', handleHeroPointerMove);
                if (heroGlowRaf) cancelAnimationFrame(heroGlowRaf);
            };
        };

        const timer = setTimeout(initScripts, 300);
        return () => clearTimeout(timer);
    }, [isLoading, events, gallery, announcements]);

    // Helper function to categorize events
    const getCategorizedEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const recent = [];

        events.forEach(event => {
            const evDate = new Date(event.date);
            evDate.setHours(0, 0, 0, 0);

            if (evDate > today) {
                upcoming.push(event);
            } else {
                recent.push(event);
            }
        });

        return { upcoming, recent };
    };

    const { upcoming, recent } = getCategorizedEvents();

    // Fallback Data
    const fallbackAnnouncements = [
        { date: "March 15, 2026", title: "Call for Papers: Power Systems Conference 2026", description: "Submit your research papers for the upcoming international conference on power systems." },
        { date: "March 10, 2026", title: "New Student Chapter Launched at CET", description: "Welcoming the newest addition to our growing student chapter network." },
        { date: "March 1, 2026", title: "Membership Drive 2026 Begins", description: "Join IEEE PES Kerala Chapter and get exclusive benefits." }
    ];

    const displayAnnouncements = announcements.length > 0 ? announcements : fallbackAnnouncements;

    const galleryImages = [
        { img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "IEEE PES Conference 2025" },
        { img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Workshop on Smart Grids" },
        { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Technical Seminar Series" },
        { img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Student Chapter Meeting" },
        { img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Industry Expert Talk" },
        { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Networking Event" },
    ];

    const displayGallery = gallery.length > 0 ? gallery.map(g => ({ img: g.imageUrl || g.url, title: g.title || g.name })) : galleryImages;

    return (
        <>
            <style jsx global>{`
                :root {
                    --pes-green: #659b45;
                    --pes-dark: #1a1a1a;
                    --pes-light: #f8f9fa;
                    --pes-white: #ffffff;
                    --pes-gray: #666666;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Link styles */
                a {
                    color: var(--pes-green);
                    text-decoration: none;
                    transition: color 0.2s ease-out;
                }

                a:hover {
                    color: #4a7833;
                }

                /* IEEE PES Theme: Hero Section — minimal, typography-led, cursor-reactive */
                .hero-section {
                    width: 100%;
                    position: relative;
                    background: #0a0f09;
                    min-height: min(86vh, 720px);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    cursor: default;
                }

                .hero-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(480px circle at var(--mx, 50%) var(--my, 40%), rgba(101, 155, 69, 0.22), transparent 65%);
                    transition: opacity 300ms ease-out;
                    pointer-events: none;
                }

                @media (max-width: 767px), (hover: none) {
                    .hero-glow { display: none; }
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 840px;
                    padding: 40px;
                    color: white;
                }

                .hero-title {
                    font-size: clamp(2.5rem, 5.4vw + 1rem, 5.25rem);
                    font-weight: 800;
                    color: white;
                    line-height: 1.02;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.035em;
                    text-wrap: balance;
                }

                .hero-title span {
                    color: var(--pes-green);
                }

                .hero-subtitle {
                    font-size: clamp(1rem, 0.4vw + 0.9rem, 1.2rem);
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.65;
                    margin-bottom: 2.5rem;
                    max-width: 580px;
                    font-weight: 400;
                }

                .hero-btn {
                    padding: 14px 30px;
                    font-weight: 600;
                    border-radius: 4px;
                    transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 180ms cubic-bezier(0.23, 1, 0.32, 1), background-color 180ms ease-out, border-color 180ms ease-out;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                }

                .hero-btn:active {
                    transform: scale(0.97);
                }

                .btn-primary-custom {
                    background-color: var(--pes-green);
                    color: white;
                    box-shadow: 0 4px 14px rgba(101, 155, 69, 0.3);
                }

                .btn-primary-custom:hover {
                    background-color: #75ad52;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 22px rgba(101, 155, 69, 0.4);
                }

                .btn-primary-custom i {
                    transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
                }

                .btn-primary-custom:hover i {
                    transform: translateX(3px);
                }

                .btn-secondary-custom {
                    background-color: transparent;
                    color: white;
                    border: 1.5px solid rgba(255, 255, 255, 0.3);
                }

                .btn-secondary-custom:hover {
                    background-color: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.7);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .hero-section { min-height: min(90vh, 600px); }
                    .hero-content { padding: 30px 24px; }
                }

                /* Cards & Components */
                .card {
                    background: white;
                    border-radius: 4px;
                    border: 1px solid #e0e0e0;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                .card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
                }

                .card img {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    display: block;
                }

                .card:hover img {
                    transform: scale(1.05);
                }

                /* Gallery & Event Cards */
                .gallery-card {
                    transition: all 0.3s ease-out;
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                    background: white;
                    border: 1px solid #e0e0e0;
                }

                .gallery-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
                }

                .gallery-img {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .gallery-card:hover .gallery-img {
                    transform: scale(1.08);
                }

                /* Responsive gallery image heights */
                @media (min-width: 1024px) {
                    .gallery-card > div:first-child {
                        height: 220px !important;
                    }
                }

                @media (min-width: 768px) and (max-width: 1023px) {
                    .gallery-card > div:first-child {
                        height: 200px !important;
                    }
                }

                @media (min-width: 600px) and (max-width: 767px) {
                    .gallery-card > div:first-child {
                        height: 180px !important;
                    }
                }

                @media (max-width: 599px) {
                    .gallery-card > div:first-child {
                        height: 160px !important;
                    }
                }

                .event-card-hover {
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                }

                .event-card-hover:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
                }

                .event-card-img {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }

                .event-card-hover:hover .event-card-img {
                    transform: scale(1.05);
                }

                /* Preview Modal */
                .gallery-preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(8, 10, 8, 0.92);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    opacity: 0;
                    transition: opacity 220ms cubic-bezier(0.23, 1, 0.32, 1);
                }

                .gallery-preview-modal.active {
                    display: flex;
                    opacity: 1;
                }

                .gallery-preview-content {
                    position: relative;
                    max-width: 92%;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transform: scale(0.96);
                    opacity: 0;
                    transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1), opacity 260ms cubic-bezier(0.23, 1, 0.32, 1);
                }

                .gallery-preview-modal.active .gallery-preview-content {
                    transform: scale(1);
                    opacity: 1;
                }

                .gallery-preview-content img {
                    max-width: 100%;
                    max-height: 72vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    display: block;
                }

                .preview-caption {
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    margin-top: 18px;
                    text-align: center;
                    max-width: 80ch;
                }

                .gallery-preview-close {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    transition: background-color 180ms ease-out, transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
                    z-index: 2;
                }

                .gallery-preview-close:hover {
                    background: rgba(255, 255, 255, 0.18);
                }

                .gallery-preview-close:active {
                    transform: scale(0.92);
                }

                .preview-nav {
                    position: fixed;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    color: white;
                    font-size: 1.4rem;
                    cursor: pointer;
                    transition: background-color 180ms ease-out, transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
                    z-index: 2;
                }

                .preview-nav:hover {
                    background: rgba(255, 255, 255, 0.18);
                }

                .preview-nav:active {
                    transform: translateY(-50%) scale(0.92);
                }

                .preview-nav-prev { left: 24px; }
                .preview-nav-next { right: 24px; }

                @media (max-width: 767px) {
                    .preview-nav { display: none; }
                }

                .preview-timer-container {
                    position: relative;
                    margin-top: 14px;
                    width: min(320px, 60vw);
                    height: 3px;
                    background: rgba(255, 255, 255, 0.18);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .preview-timer-bar {
                    height: 100%;
                    background: var(--pes-green);
                    width: 100%;
                }

                /* Section Spacing */
                .section-padding {
                    padding: 60px 24px;
                }

                @media (max-width: 768px) {
                    .section-padding {
                        padding: 40px 16px;
                    }
                }

                @media (max-width: 480px) {
                    .section-padding {
                        padding: 30px 12px;
                    }
                }

                /* Gallery Responsiveness */
                .gallery-section {
                    overflow: hidden;
                }

                .marquee-container {
                    display: flex;
                    flex-wrap: nowrap;
                    overflow: visible;
                    padding-left: 24px;
                    will-change: transform;
                }

                .gallery-card {
                    flex-shrink: 0;
                    transition: all 0.3s ease-out;
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                    background: white;
                    border: 1px solid #e0e0e0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                .gallery-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
                }

                /* Desktop: 320px cards */
                @media (min-width: 1024px) {
                    .gallery-card {
                        width: 320px;
                    }
                }

                /* Tablet: 280px cards */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .gallery-card {
                        width: 280px;
                    }
                    .marquee-container {
                        gap: 20px;
                    }
                }

                /* Small tablets & large phones: 240px cards */
                @media (min-width: 600px) and (max-width: 767px) {
                    .gallery-card {
                        width: 240px;
                    }
                    .marquee-container {
                        gap: 16px;
                        padding-left: 16px;
                    }
                }

                /* Mobile: 200px cards with responsive adjustment */
                @media (max-width: 599px) {
                    .gallery-card {
                        width: 200px;
                    }
                    .marquee-container {
                        gap: 12px;
                        padding-left: 12px;
                    }
                    .gallery-section {
                        padding: 30px 0 !important;
                    }
                    .gallery-section .container {
                        padding: 0 16px;
                    }
                }
            `}</style>

            <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

            <div className="box-layout">
                <Navbar />

                {/* Hero Section — minimal, cursor-reactive, typography-led */}
                <div id="hero" className="hero-section">
                    <div className="hero-glow" id="heroGlow"></div>

                    <div className="container">
                        <div className="hero-content" data-aos="fade-up" data-aos-duration="700">
                            <h1 className="hero-title">
                                Empowering the future of <span>power &amp; energy</span>
                            </h1>
                            <p className="hero-subtitle">
                                IEEE PES Kerala Chapter brings together engineers, researchers, and students advancing technology for humanity — through technical excellence, mentorship, and community in the energy sector.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link href="/pages/membership-benefits" className="hero-btn btn-primary-custom">
                                    Become a Member <i className="ri-arrow-right-line"></i>
                                </Link>
                                <Link href="/pages/upcoming-events" className="hero-btn btn-secondary-custom">
                                    Explore Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>



                {/* About Message Section */}
                <div className="container py-5 mt-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="py-2" data-aos="fade-up">
                                <p style={{ textAlign: "justify", fontSize: "1.1rem", lineHeight: "1.8", color: '#444' }}>
                                    The <strong>IEEE PES Kerala Chapter</strong> was founded in 1999 with just 12 members and has since grown into one of the most recognized chapters in the world. It won the Outstanding Chapter Award in 2012 and the PES Membership Growth Award in 2013, and claimed first place in the IEEE PES Chapters Website Contest the same year. Membership surpassed 1,200 by 2017, elevating it to large chapter status. Its mission is to be the leading provider of scientific and engineering knowledge on electric power and energy for the betterment of society. With 50+ Student Branch Chapters and numerous technical events, it remains a highly active and award-winning chapter under the IEEE Kerala Section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Section */}
                <div className="container pb-5">
                    <div className="row g-4 pt-3">
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="p-4 p-md-5 rounded-4 border bg-white shadow-sm h-100 position-relative mt-4" style={{ transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="position-absolute top-0 start-0 translate-middle ms-5 bg-white p-2 rounded-circle shadow-sm" style={{ marginTop: '-4px' }}>
                                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="ri-eye-line fs-3" style={{ color: 'var(--pes-green)' }}></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mt-3 mb-3" style={{ color: '#0f172a' }}>Our Vision</h3>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.7' }}>
                                    To be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and the preferred professional development source for our members.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                            <div className="p-4 p-md-5 rounded-4 border bg-white shadow-sm h-100 position-relative mt-4" style={{ transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="position-absolute top-0 start-0 translate-middle ms-5 bg-white p-2 rounded-circle shadow-sm" style={{ marginTop: '-4px' }}>
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="ri-rocket-2-line fs-3 text-primary"></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mt-3 mb-3" style={{ color: '#0f172a' }}>Our Mission</h3>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.7' }}>
                                    To foster technological innovation and excellence for the benefit of humanity by providing high-quality publications, engaging conferences, and valuable educational programs in power and energy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Announcements & Upcoming Events Section */}
                <div className="container my-5">
                    <div className="row align-items-stretch g-4">
                        {/* Announcements */}
                        <div className="col-lg-6" data-aos="fade-up">
                            <div className="p-4 p-md-5 rounded border bg-white shadow-sm h-100" style={{ borderTop: "4px solid var(--pes-green)" }}>
                                <h4 className="mb-4 fw-bold d-flex align-items-center gap-2">
                                    <i className="ri-megaphone-line text-success"></i>
                                    Announcements
                                </h4>
                                <ul className="list-unstyled">
                                    {displayAnnouncements.slice(0, 3).map((ann, idx) => (
                                        <li className={`mb-4 pb-3 ${idx < 2 ? 'border-bottom' : ''}`} key={idx}>
                                            <small className="text-secondary fw-bold text-uppercase d-block mb-2">
                                                {isNaN(Date.parse(ann.date)) ? ann.date : new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </small>
                                            <h5 className="fw-bold mt-1 mb-2">
                                                <Link href={ann.link || "#"} className="text-dark text-decoration-none hover-green">
                                                    {ann.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small mb-2">{ann.description || ann.details}</p>
                                            <Link href={ann.link || "#"} className="text-success small fw-bold text-decoration-none">
                                                Read More →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Upcoming Events Carousel */}
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="rounded overflow-hidden shadow-lg position-relative h-100" style={{ backgroundColor: 'var(--pes-green)', minHeight: '450px' }}>
                                <div className="position-absolute top-0 end-0 bg-dark text-white px-3 py-2 m-3 rounded shadow" style={{ fontSize: '0.85rem', zIndex: 10 }}>
                                    <i className="ri-calendar-event-line me-2"></i>Upcoming Events
                                </div>

                                <div className="swiper upcoming-events-swiper h-100 w-100">
                                    <div className="swiper-wrapper h-100">
                                        {upcoming.length > 0 ? (
                                            upcoming.map((evt, idx) => (
                                                <div className="swiper-slide h-100" key={idx}>
                                                    <div className="h-100 d-flex flex-column bg-white">
                                                        <div style={{ height: '260px', overflow: 'hidden' }}>
                                                            <img
                                                                src={evt.imageUrl || "/images/ieee-images/Events/pesgre_event.png"}
                                                                alt={evt.title}
                                                                className="w-100 h-100 object-fit-cover"
                                                            />
                                                        </div>
                                                        <div className="p-4 d-flex flex-column justify-content-center flex-grow-1">
                                                            <div className="mb-2">
                                                                <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--pes-green)', fontSize: '0.75rem' }}>
                                                                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <h3 className="h5 fw-bold mb-2 text-dark">{evt.title}</h3>
                                                            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {evt.description || evt.details || "Join us for this exciting event."}
                                                            </p>
                                                            <Link
                                                                href={evt.link || evt.url || "#"}
                                                                className="fw-bold text-decoration-none mt-auto d-inline-block"
                                                                style={{ color: 'var(--pes-green)' }}
                                                            >
                                                                Learn More →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="swiper-slide h-100">
                                                <div className="h-100 d-flex flex-column bg-white">
                                                    <div style={{ height: '260px', overflow: 'hidden' }}>
                                                        <img
                                                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                                            alt="Upcoming Event"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <div className="p-4 d-flex flex-column justify-content-center flex-grow-1">
                                                        <div className="mb-2">
                                                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--pes-green)', fontSize: '0.75rem' }}>Coming Soon</span>
                                                        </div>
                                                        <h3 className="h5 fw-bold mb-2 text-dark">Smart Grid Symposium 2026</h3>
                                                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                                            Join industry experts for an in-depth exploration of cutting-edge smart grid technologies.
                                                        </p>
                                                        <Link href="/pages/upcoming-events" className="fw-bold text-decoration-none mt-auto d-inline-block" style={{ color: 'var(--pes-green)' }}>
                                                            Learn More →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="upcoming-swiper-pagination swiper-pagination position-absolute w-100" style={{ bottom: '15px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Events Section */}
                <div className="container my-5 py-5 bg-light rounded-4">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="fw-bold fs-1 text-dark mb-3">
                            Recent <span style={{ color: 'var(--pes-green)' }}>Events</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                            Explore our latest workshops, seminars, and networking events
                        </p>
                    </div>

                    <div className="swiper recent-events-swiper pb-5 position-relative px-2">
                        <div className="swiper-wrapper">
                            {(recent.length > 0 ? recent : [
                                { title: "Workshop on Renewable Energy Systems", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-18", desc: "Comprehensive training on solar and wind energy integration." },
                                { title: "Power Electronics Seminar", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-15", desc: "Advanced topics in power conversion and control systems." },
                                { title: "Student Chapter Technical Meet", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-12", desc: "Networking event for student members across Kerala." },
                                { title: "Industry Expert Talk Series", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-08", desc: "Insights from leading professionals in the power sector." }
                            ]).map((event, idx) => (
                                <div className="swiper-slide h-auto" key={idx}>
                                    <Link href={event.link || event.url || "#"} className="card h-100 border-0 text-decoration-none event-card-hover" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                            <img src={event.img || event.imageUrl || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={event.title} className="w-100 h-100 object-fit-cover event-card-img" />
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column bg-white">
                                            <div className="mb-3">
                                                <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h4 className="card-title fw-bold fs-6 text-dark mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3rem' }}>
                                                {event.title}
                                            </h4>
                                            <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {event.desc || event.description || "Highlights from this impactful IEEE PES event."}
                                            </p>
                                            <span className="fw-bold mt-auto d-inline-block small" style={{ color: 'var(--pes-green)' }}>
                                                View Details →
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="recent-events-pagination swiper-pagination position-absolute w-100" style={{ bottom: '0px' }}></div>
                    </div>
                </div>

                {/* Gallery Section */}
                <section className="gallery-section position-relative py-5 mt-4" style={{ background: 'linear-gradient(to bottom, #f8fafb, #ffffff)' }}>
                    <div className="container mb-5">
                        <div className="text-center" data-aos="fade-up">
                            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>
                                Event <span style={{ color: 'var(--pes-green)' }}>Gallery</span>
                            </h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: '1.6' }}>
                                Glimpses from our conferences, workshops, and community gatherings
                            </p>
                        </div>
                    </div>

                    <div className="position-relative">
                        <div className="position-absolute top-0 start-0" style={{ width: 'clamp(40px, 10%, 80px)', height: '100%', background: 'linear-gradient(to right, #f8fafb, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
                        <div className="position-absolute top-0 end-0" style={{ width: 'clamp(40px, 10%, 80px)', height: '100%', background: 'linear-gradient(to left, #ffffff, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>

                        <div className="overflow-hidden py-3">
                            <div className="marquee-container" style={{ paddingRight: '24px' }}>
                                {[...displayGallery, ...displayGallery].map((item, idx) => (
                                    <div key={idx} className="gallery-card rounded-4" data-title={item.title}>
                                        <div style={{ height: '220px', overflow: 'hidden' }}>
                                            <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover gallery-img" />
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '14px', opacity: 0.6 }}>
                            Click on any image to preview • Auto-scrolling
                        </p>
                    </div>
                </section>

                {/* Join IEEE PES CTA Section */}
                <div className="container py-4 my-3 position-relative" data-aos="fade-up">
                    <div className="rounded-4 overflow-hidden shadow-lg position-relative p-5 text-center" style={{ background: 'linear-gradient(135deg, #020b14 0%, #001f3f 100%)' }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 171, 132, 0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 98, 155, 0.15), transparent 50%)',
                            zIndex: 0
                        }}></div>
                        
                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <h2 className="display-5 fw-bold text-white mb-3">Elevate Your Engineering Career</h2>
                            <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '700px' }}>
                                Join the IEEE Power & Energy Society today to unlock exclusive resources, networking opportunities, and professional development in the energy sector.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noreferrer" className="btn btn-lg rounded-pill fw-bold text-white px-5 py-3 shadow hero-btn" style={{ backgroundColor: 'var(--pes-green)' }}>
                                    Join IEEE PES Now
                                </a>
                                <Link href="/pages/membership-benefits" className="btn btn-lg rounded-pill fw-bold px-4 py-3 text-white hero-btn-outline border-white border-opacity-25" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white !important' }}>
                                    Discover Benefits
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About IEEE and PES Section (Exact Requested Markup) */}
                <div className="vc_row wpb_row vc_row-fluid mt-4 mb-5 pb-5">
                    <div className="wpb_column vc_column_container vc_col-sm-12">
                        <div className="vc_column-inner text-center">
                            <div className="wpb_wrapper container">
                                <h3 className="fw-bold" style={{ marginBottom: "20px", display: "inline-block", padding: "12px 35px", border: "3px solid var(--pes-green)", color: "var(--pes-green)", fontSize: "1.4rem", textTransform: "uppercase" }}>
                                    About IEEE and PES
                                </h3>
                                <div className="row text-start mt-5">
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 p-md-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is IEEE?</h4>
                                            <p className="mb-5 text-muted lh-lg">
                                                IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
                                            </p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership/join/index.html?WT.mc_id=hc_join" title="Join IEEE" target="_blank" rel="noreferrer" style={{ borderRadius: "0px", borderWidth: "2px" }}>
                                                Join IEEE
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 p-md-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is the IEEE Power &amp; Energy Society?</h4>
                                            <p className="mb-5 text-muted lh-lg">
                                                The mission of IEEE Power &amp; Energy Society is to be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and preferred professional development source of its members.
                                            </p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMPE031&amp;refProd=MEMPE031" title="Join IEEE PES" target="_blank" rel="noreferrer" style={{ borderRadius: "0px", borderWidth: "2px" }}>
                                                Join IEEE PES
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

                {/* Gallery Preview Modal */}
                <div className="gallery-preview-modal" id="galleryPreview">
                    <div className="gallery-preview-content">
                        <div className="gallery-preview-close" role="button" aria-label="Close preview">
                            <i className="ri-close-line"></i>
                        </div>
                        {/* impeccable-disable broken-image - src populated dynamically when user clicks gallery items */}
                        <img id="previewImg" alt="Preview" style={{ display: 'block' }} />
                        <div className="preview-timer-container">
                            <div className="preview-timer-bar" id="previewTimer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}