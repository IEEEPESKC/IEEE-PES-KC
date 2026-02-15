'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
    useEffect(() => {
        // Helper to load AOS/Swiper if they are global
        const initScripts = () => {
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true
            });

            // Marquee Scroll Effect
            window.addEventListener('scroll', () => {
                const marquee = document.querySelector('.marquee-wrapper');
                if (marquee) {
                    const scrollPos = window.scrollY;
                    marquee.style.transform = `translateX(${-scrollPos * 1.8}px)`;
                }
            });

            // Initialize Swiper
            const swiper = new Swiper('.gallery-swiper', {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    576: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 }
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                loop: true
            });

            // Initialize Update Carousels
            new Swiper('.upcoming-update-swiper', {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 15,
                autoplay: { delay: 4000 },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                loop: true
            });

            new Swiper('.recent-update-swiper', {
                modules: [Navigation, Autoplay],
                slidesPerView: 1,
                spaceBetween: 15,
                autoplay: { delay: 5000 },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                loop: true
            });

            // Initialize Flagship Swipers
            new Swiper('.akpessc-swiper', {
                modules: [Navigation, Pagination],
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.akpessc-swiper .swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.akpessc-swiper .swiper-button-next',
                    prevEl: '.akpessc-swiper .swiper-button-prev',
                },
            });

            const headerSwiper = new Swiper('.header-swiper', {
                modules: [EffectFade],
                effect: 'fade',
                fadeEffect: { crossFade: true },
                allowTouchMove: false,
            });

            const flagshipSwiper = new Swiper('.dynamic-flagship-swiper', {
                modules: [Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.dynamic-flagship-swiper .swiper-pagination',
                    clickable: true,
                },
            });

            // Sync header with content
            flagshipSwiper.on('slideChange', function () {
                headerSwiper.slideTo(flagshipSwiper.realIndex);
            });

            // Gallery Preview Logic
            let galleryTimer;
            const modal = document.getElementById('galleryPreview');
            const img = document.getElementById('previewImg');
            const timerBar = document.getElementById('previewTimer');

            function openGalleryPreview(imgSrc) {
                if (!img || !modal || !timerBar) return;
                img.src = imgSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Reset and start timer bar
                timerBar.style.transition = 'none';
                timerBar.style.width = '100%';

                setTimeout(() => {
                    timerBar.style.transition = 'width 10s linear';
                    timerBar.style.width = '0%';
                }, 50);

                clearTimeout(galleryTimer);
                galleryTimer = setTimeout(closeGalleryPreview, 10000);
            }

            function closeGalleryPreview() {
                if (!modal) return;
                modal.classList.remove('active');
                document.body.style.overflow = '';
                clearTimeout(galleryTimer);
            }

            // Close on background click
            if (modal) modal.onclick = closeGalleryPreview;

            // Attach clicks to gallery cards
            document.querySelectorAll('.gallery-card').forEach(card => {
                card.addEventListener('click', () => {
                    const imgElement = card.querySelector('img');
                    if (imgElement) {
                        openGalleryPreview(imgElement.src);
                    }
                });
            });

            // High-Performance 144fps 3D Interpolated Tilt
            const heroSection = document.querySelector('.hero-section');
            const heroIsland = document.querySelector('.hero-island');

            if (heroSection && heroIsland) {
                let targetX = 0, targetY = 0;
                let currentX = 0, currentY = 0;
                const easing = 0.08;
                let rafId = null;

                function updateTilt() {
                    currentX += (targetX - currentX) * easing;
                    currentY += (targetY - currentY) * easing;

                    heroIsland.style.transform = `rotateY(${currentX.toFixed(3)}deg) rotateX(${currentY.toFixed(3)}deg)`;

                    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                        rafId = requestAnimationFrame(updateTilt);
                    } else {
                        rafId = null;
                        heroIsland.style.transform = `rotateY(${targetX}deg) rotateX(${targetY}deg)`;
                    }
                }

                heroSection.addEventListener('mousemove', (e) => {
                    const { clientX, clientY } = e;
                    const { innerWidth, innerHeight } = window;
                    targetX = (clientX / innerWidth - 0.5) * 20;
                    targetY = (clientY / innerHeight - 0.5) * -20;
                    if (!rafId) rafId = requestAnimationFrame(updateTilt);
                }, { passive: true });

                heroSection.addEventListener('mouseleave', () => {
                    targetX = 0; targetY = 0;
                    if (!rafId) rafId = requestAnimationFrame(updateTilt);
                }, { passive: true });
            }


            // Fix for removed inline onclick
            const closeBtn = document.querySelector('.gallery-preview-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeGalleryPreview);
            }
        };

        // Slight delay to ensure external scripts are loaded
        const timer = setTimeout(initScripts, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="box-layout">
                {/* Header */}
                <header>
                    {/* Top Bar */}
                    <div className="header-top-bar">
                        <div className="container-fluid px-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div>
                                    <a href="https://www.ieee.org/" target="_blank"><i className="fa-solid fa-house me-1"></i>
                                        IEEE.org</a>
                                    <a href="https://ieeexplore.ieee.org/" target="_blank" className="topBar-item-border">IEEE
                                        Xplore</a>
                                    <a href="https://standards.ieee.org/" target="_blank"
                                        className="topBar-item-border d-none d-md-inline">IEEE Standards</a>
                                    <a href="https://ieeekerala.org/" target="_blank"
                                        className="topBar-item-border d-none d-lg-inline">IEEE Kerala Section</a>
                                    <a href="https://ieeeindiacouncil.org/" target="_blank"
                                        className="topBar-item-border d-none d-lg-inline">IEEE India Council</a>
                                    <a href="https://ieee-pes.org/" target="_blank"
                                        className="topBar-item-border d-none d-lg-inline">IEEE PES</a>
                                </div>
                                <div className="social-icons-header d-none d-md-block">
                                    <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank"><i
                                        className="fa-brands fa-linkedin-in"></i></a>
                                    <a href="https://www.instagram.com/ieeepeskerala/" target="_blank"><i
                                        className="fa-brands fa-instagram"></i></a>
                                    <a href="https://www.facebook.com/ieeepeskerala" target="_blank"><i
                                        className="fa-brands fa-facebook-f"></i></a>
                                    <a href="https://twitter.com/ieeepeskerala" target="_blank"><i
                                        className="fa-brands fa-x-twitter"></i></a>
                                    <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank"><i
                                        className="fa-brands fa-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid px-4">
                            <Link className="navbar-brand" href="/">
                                <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={120} height={40} style={{ objectFit: 'contain' }} />
                            </Link>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link href="/" className="nav-link active">Home</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">About</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/about" className="dropdown-item">About IEEE PES</Link></li>
                                            <li><Link href="/vision-mission" className="dropdown-item">Vision & Mission</Link></li>
                                            <li><Link href="/history" className="dropdown-item">History</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Execom</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/execom" className="dropdown-item">Executive Committee</Link></li>
                                            <li><Link href="/past-execom" className="dropdown-item">Past Execom</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Activities</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/student-branches" className="dropdown-item">Student Branch
                                                Chapters</Link></li>
                                            <li><Link href="/initiatives" className="dropdown-item">Initiatives</Link></li>
                                            <li><Link href="/awards" className="dropdown-item">Awards</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Events</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/upcoming-events" className="dropdown-item">Upcoming Events</Link></li>
                                            <li><Link href="/past-events" className="dropdown-item">Past Events</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Membership</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/membership-benefits" className="dropdown-item">Membership Benefits</Link>
                                            </li>
                                            <li><a href="https://www.ieee.org/membership/join/index.html" target="_blank"
                                                className="dropdown-item">Join IEEE</a></li>
                                            <li><a href="https://ieee-pes.org/membership/" target="_blank"
                                                className="dropdown-item">Join IEEE PES</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/gallery" className="nav-link">Gallery</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/resources" className="nav-link">Resources</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/newsletters" className="nav-link">Newsletters</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/contact" className="nav-link">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                            <a href="https://www.ieee.org/membership/join/index.html" target="_blank"
                                className="btn-green d-none d-lg-inline-flex">
                                Join IEEE <i className="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-island" data-aos="zoom-in" data-aos-duration="800">
                        <video autoPlay muted loop playsInline className="hero-video-bg" preload="auto">
                            <source src="images/ieee-images/Video/Herovideo.mp4" type="video/mp4" />
                        </video>
                        <div className="hero-overlay"></div>

                        <div className="hero-container-inner">

                            <h1 data-aos="fade-up" data-aos-delay="200">
                                <span className="chapter-name">IEEE PES</span> Kerala Chapter
                            </h1>
                            <p className="lead" data-aos="fade-up" data-aos-delay="350">
                                Advancing technology for humanity through technical excellence, professional development,
                                and community-driven energy solutions across the Kerala section.
                            </p>

                            <div className="hero-buttons" data-aos="fade-up" data-aos-delay="500">
                                <Link href="/about" className="btn-glass btn-glass-primary">
                                    Our Legacy <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link href="/upcoming-events" className="btn-glass">
                                    Join Mission <i className="fa-solid fa-bolt"></i>
                                </Link>
                            </div>        </div>

                        <div className="hero-stats-bar" data-aos="fade-up" data-aos-delay="650">
                            <div className="stat-card">
                                <div className="stat-item">
                                    <h3>1900+</h3>
                                    <p>Members</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-item">
                                    <h3>50+</h3>
                                    <p>Chapters</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-item">
                                    <h3>100+</h3>
                                    <p>Events</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-item">
                                    <h3>26+</h3>
                                    <p>Years</p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            {/* Fixed Socials */}
            <div className="hero-socials-vertical" data-aos="fade-up" data-aos-delay="1500">
                <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank" rel="noreferrer"
                    className="social-link-v" aria-label="LinkedIn">
                    <i className="ri-linkedin-fill"></i>
                </a>
                <a href="https://www.facebook.com/ieeepeskerala" target="_blank" rel="noreferrer" className="social-link-v"
                    aria-label="Facebook">
                    <i className="ri-facebook-fill"></i>
                </a>
                <a href="https://www.instagram.com/ieeepeskerala/" target="_blank" rel="noreferrer"
                    className="social-link-v" aria-label="Instagram">
                    <i className="ri-instagram-line"></i>
                </a>
                <a href="https://twitter.com/ieeepeskerala" target="_blank" rel="noreferrer" className="social-link-v"
                    aria-label="X (Twitter)">
                    <i className="ri-twitter-x-line"></i>
                </a>
                <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank" rel="noreferrer"
                    className="social-link-v" aria-label="WhatsApp Channel">
                    <i className="ri-whatsapp-line"></i>
                </a>
                <div className="social-line"></div>
            </div>
        </section >

            {/* Marquee Section */ }
            < div className = "marquee-section" >
                <div className="marquee-wrapper">
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                    <div className="marquee-text">IEEE PES KERALA CHAPTER</div>
                </div>
                </div >

        <section className="quick-updates-section">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-badge">Live Updates</span>
                    <h2 className="section-title">Latest & Upcoming</h2>
                    <p className="section-desc">Stay informed with the most recent happenings and future opportunities in
                        the
                        PES Kerala community.</p>
                </div>
                <div className="row g-4">
                    {/* Upcoming Events Carousel */}
                    <div className="col-lg-6">
                        <div className="update-box h-100" data-aos="fade-right">
                            <div className="update-box-title">
                                <i className="ri-calendar-event-line"></i>
                                <h4>Upcoming Events</h4>
                            </div>
                            <div className="swiper update-swiper upcoming-update-swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Events/agm2026.png" alt="AGM 2026" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>AGM 2026 - Annual General Meeting</h5>
                                                <div className="update-desc">
                                                    The IEEE PES Kerala Chapter warmly invites all members to be part of
                                                    the Annual General Meeting 2026. Reflect, Reconnect, Reignite.
                                                </div>
                                                <a href="https://tinyurl.com/ieeepeskc-agm2026" target="_blank"
                                                    className="btn-register mb-3">Register Now</a>
                                                <p className="text-muted small mb-0"><i className="ri-map-pin-line"></i> Kochi |
                                                    <i className="ri-time-line"></i> 1 Feb
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Events/pesgre_event.png" alt="PESGRE" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>PESGRE 2026 - International Conference</h5>
                                                <div className="update-desc">
                                                    The premier international conference on Power Electronics, Smart
                                                    Grid and Renewable Energy (PESGRE) returns to Kerala.
                                                </div>
                                                <a href="#" className="btn-register mb-3">Register Now</a>
                                                <p className="text-muted small mb-0"><i className="ri-map-pin-line"></i>
                                                    Trivandrum | <i className="ri-time-line"></i> 15-18 Feb</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Events/smartgrid_event.png" alt="Workshop" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>Smart Grid Workshop & Training</h5>
                                                <div className="update-desc">
                                                    Master the future of power systems with our hands-on Smart Grid
                                                    workshop. Industry certification included.
                                                </div>
                                                <a href="#" className="btn-register mb-3">Register Now</a>
                                                <p className="text-muted small mb-0"><i className="ri-map-pin-line"></i> NIT
                                                    Calicut | <i className="ri-time-line"></i> 10 Mar</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-button-next"></div>
                                <div className="swiper-button-prev"></div>
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Events Carousel */}
                    <div className="col-lg-6">
                        <div className="update-box h-100" data-aos="fade-left">
                            <div className="update-box-title">
                                <i className="ri-history-line"></i>
                                <h4>Recent Events</h4>
                            </div>
                            <div className="swiper update-swiper recent-update-swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/recent_1.png" alt="Workshop" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>Power System Protection Workshop</h5>
                                                <div className="update-desc">
                                                    A comprehensive hands-on session on modern power system protection
                                                    techniques held at GEC Barton Hill.
                                                </div>
                                                <p className="text-muted small mb-0">Held at GEC Barton Hill</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/recent_2.png" alt="Seminar" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>IEEE PES Day 2025 Celebrations</h5>
                                                <div className="update-desc">
                                                    Celebrating the spirit of Power & Energy Society with state-wide
                                                    virtual events and competitions.
                                                </div>
                                                <p className="text-muted small mb-0">State-wide virtual events</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-button-next"></div>
                                <div className="swiper-button-prev"></div>
                            </div>
                        </div>
                    </div>

                    {/* Announcements Notice Board (Full Width Below) */}
                    <div className="col-12">
                        <div className="update-box" data-aos="fade-up" data-aos-delay="100">
                            <div className="update-box-title">
                                <i className="ri-notification-3-line"></i>
                                <h4>Announcements</h4>
                            </div>
                            <ul className="notice-board">
                                <li className="notice-item">
                                    <div className="notice-date">NEW</div>
                                    <div className="notice-content">
                                        <h6>Call for Volunteers 2026</h6>
                                        <p>Join the IEEE PES Kerala Web Team and Creative Team. Apply by Feb 20.
                                        </p>
                                    </div>
                                </li>
                                <li className="notice-item">
                                    <div className="notice-date">IMPORTANT</div>
                                    <div className="notice-content">
                                        <h6>Best Student Branch Results</h6>
                                        <p>The annual PES SB Performance results are out. Check your ranking.
                                        </p>
                                    </div>
                                </li>
                                <li className="notice-item">
                                    <div className="notice-date">UPCOMING</div>
                                    <div className="notice-content">
                                        <h6>Execom Training Session</h6>
                                        <p>Mandatory training for all newly elected SB Execom members on Feb 25.
                                        </p>
                                    </div>
                                </li>
                                <li className="notice-item">
                                    <div className="notice-date">UPDATE</div>
                                    <div className="notice-content">
                                        <h6>Awards Nominations Open</h6>
                                        <p>Submit nominations for the Outstanding Professional Award by March
                                            15.</p>
                                    </div>
                                </li>
                                <li className="notice-item">
                                    <div className="notice-date">INFO</div>
                                    <div className="notice-content">
                                        <h6>Chapter Membership Drive</h6>
                                        <p>Exclusive benefits for members joining this month. Refer a friend!
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <div className="view-all-announcements">
                                <Link href="/announcements" className="btn-view-all">
                                    View All Announcements <i className="ri-arrow-right-line"></i>
                                </Link>
                            </div>        </div>
                    </div>
                </div>
            </div>
        </div>
                </section >
        {/* About Section */ }
        < section className = "about-section" >
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="about-image-wrapper">
                            <Image src="/images/ieee-images/about_modern.png" alt="Engineering Innovation" width={600} height={400} style={{ width: '100%', height: 'auto' }} />
                            <div className="about-experience-badge" data-aos="zoom-in" data-aos-delay="400">
                                <h4>15+</h4>
                                <p>Years of Impact</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 about-content" data-aos="fade-left">
                        <span className="section-badge">About IEEE PES Kerala</span>
                        <h2>Powering the Future of Energy</h2>
                        <p className="lead">
                            As a premier chapter of the IEEE Power & Energy Society, we are at the forefront of the
                            global transition to sustainable energy. We empower our members through knowledge,
                            innovation, and a shared commitment to a greener planet.
                        </p>
                        <div className="row g-4 mt-2 mb-5">
                            <div className="col-md-6">
                                <div className="about-info-card">
                                    <div className="icon-box">
                                        <i className="ri-lightbulb-flash-line"></i>
                                    </div>
                                    <h5>Our Vision</h5>
                                    <p>To be the driving force behind the technological advancements that define the
                                        future
                                        of the power industry.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="about-info-card">
                                    <div className="icon-box">
                                        <i className="ri-shield-flash-line"></i>
                                    </div>
                                    <h5>Our Mission</h5>
                                    <p>To drive global collaboration in power electronics and energy science for the
                                        benefit of humanity.</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-4 flex-wrap">
                            <Link href="/about" className="btn-base-color">
                                Our Story <i className="fa-solid fa-arrow-right ms-2"></i>
                            </Link>
                            <Link href="/student-branches"
                                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-700">
                                Explore Student Branches
                            </Link>
                        </div>        </div>
                </div>
            </div>
                    </div >
                </section >





        {/* Message from Chair */ }
        < section className = "chair-section section-padding" >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="chair-message" data-aos="fade-up">
                            <div className="section-badge mb-3">Message from Chair</div>
                            <h4>Welcome to IEEE PES Kerala Chapter</h4>
                            <p>
                                It is my privilege to serve as the Chair of the IEEE Power and Energy Society (PES)
                                Kerala Chapter. Our chapter stands at the intersection of innovation, research, and
                                real-world impact—bringing together passionate students, professionals, and researchers
                                who are shaping the future of power and energy systems.
                            </p>
                            <p>
                                Through workshops, technical talks, conferences, and outreach programs, we aim to create
                                opportunities that inspire creativity, nurture leadership, and empower our members to
                                address real-world challenges in the power and energy sector. I warmly invite every
                                member to actively engage, share ideas, and lead initiatives.
                            </p>
                            <div className="chair-info">
                                <div className="chair-avatar">
                                    <Image src="/images/ieee-images/BobyPhilp.jpeg" alt="Dr. Boby Philip" width={80} height={80} style={{ objectFit: 'cover' }} />
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
                </section >

        {/* Initiatives Section */ }
        < section className = "initiatives-section section-padding" >
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-badge">Our Programs</span>
                    <h2 className="section-title">Initiatives</h2>
                    <p className="section-desc">IEEE PES Kerala offers various programs to support technical advancement in
                        power and energy</p>
                </div>
                <div className="row g-4">
                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                        <div className="initiative-card">
                            <h3><i className="bi bi-mortarboard-fill"></i> Student Activities</h3>
                            <p>Training programs, workshops, and competitions for students to enhance their skills in
                                power systems, renewable energy, and smart grids.</p>
                        </div>
                    </div>
                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="150">
                        <div className="initiative-card">
                            <h3><i className="bi bi-briefcase-fill"></i> Professional Development</h3>
                            <p>Certification courses, webinars, and industry talks for professionals to stay updated
                                with latest trends in power and energy sector.</p>
                        </div>
                    </div>
                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="initiative-card">
                            <h3><i className="bi bi-building"></i> Industry Collaboration</h3>
                            <p>Partnerships with power utilities, renewable energy companies, and research institutions
                                for knowledge transfer and innovation.</p>
                        </div>
                    </div>
                </div>
            </div>
                </section >

        {/* Flagships Section */ }
        < section className = "flagships-section" >
            <div className="container">
                <div className="section-header text-center" data-aos="fade-up">
                    <span className="section-badge">Flagship Events</span>
                    <h2 className="section-title">Our Premier Flagships</h2>
                    <p className="section-desc">Witness the largest and most impactful gatherings organized by IEEE PES
                        Kerala Chapter</p>
                </div>

                <div className="row g-4">
                    {/* Left: AKPESSC */}
                    <div className="col-lg-7">
                        <div className="flagship-box" data-aos="fade-right">
                            <div className="flagship-title-area">
                                <i className="ri-flashlight-line"></i>
                                <h3 className="m-0 fw-800" style={{ fontSize: '1.3rem', color: 'var(--header-color)' }}>AKPESSC
                                </h3>
                            </div>
                            <div className="swiper flagship-swiper akpessc-swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Flagships/akpessc_flagship_1770434008791.png" alt="AKPESSC" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>AKPESSC 2025 - State Student Congress</h5>
                                                <div className="update-desc">
                                                    The All Kerala Power & Energy Society Student Congress is our crown
                                                    jewel event, bringing together hundreds of students for technical
                                                    excellence and networking. ⚡🎓<br /><br />
                                                    Witness the largest gathering of PES enthusiasts in Kerala with
                                                    keynote
                                                    sessions from industrial giants.
                                                </div>
                                                <a href="#" className="btn-register mb-3">Register Now</a>
                                                <p className="text-muted small mb-0"><i className="ri-map-pin-line"></i> TBD |
                                                    <i className="ri-calendar-line"></i> Annual
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Gallery/gallery_1.png" alt="AKPESSC Highlights" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>Industry Interface & Workshops</h5>
                                                <div className="update-desc">
                                                    Bridging the gap between academia and industry with keynote sessions
                                                    from global energy leaders and interactive workshops.
                                                </div>
                                                <p className="text-muted small mb-0"><i className="ri-group-line"></i> 500+
                                                    Participants</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-pagination"></div>
                                <div className="swiper-button-next"></div>
                                <div className="swiper-button-prev"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dynamic Flagships */}
                    <div className="col-lg-5">
                        <div className="flagship-box" data-aos="fade-left">
                            <div className="flagship-title-area">
                                <i className="ri-star-line"></i>
                                <div className="dynamic-header-container">
                                    <div className="swiper header-swiper">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide header-item-slide">WOW</div>
                                            <div className="swiper-slide header-item-slide">Intellect</div>
                                            <div className="swiper-slide header-item-slide">PES Day Celebrations</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper flagship-swiper dynamic-flagship-swiper">
                                <div className="swiper-wrapper">
                                    {/* WOW Group */}
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card mb-3">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Flagships/wow_flagship_1770434024340.png" alt="WOW" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>Women in Power - Leadership</h5>
                                                <div className="update-desc">
                                                    Empowering women engineers to lead the energy transition through
                                                    specialized workshops.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-body p-3">
                                                <h6>Tech-HER Workshop</h6>
                                                <p className="small text-muted mb-0">Coding and hardware session for female
                                                    members.</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Intellect Group */}
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card mb-3">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/Flagships/intellect_flagship_1770434044351.png" alt="Intellect" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>State Level Quiz 2026</h5>
                                                <div className="update-desc">
                                                    Our premier technical quiz challenging the brightest minds.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-body p-3">
                                                <h6>Paper Presentations</h6>
                                                <p className="small text-muted mb-0">Showcase your research and innovations.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* PES Day Group */}
                                    <div className="swiper-slide">
                                        <div className="swiper-update-card mb-3">
                                            <div className="swiper-update-img">
                                                <Image src="/images/ieee-images/recent_1.png" alt="PES Day Celebrations" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div className="swiper-update-body">
                                                <h5>PES Day Flagship Event</h5>
                                                <div className="update-desc">
                                                    Celebrating global IEEE PES accomplishments in Kerala.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-update-card">
                                            <div className="swiper-update-body p-3">
                                                <h6>Green Energy Walk</h6>
                                                <p className="small text-muted mb-0">Public outreach for clean energy
                                                    awareness.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </section >

        {/* Events Section */ }
        < section className = "events-section" >
                    <div className="container-fluid px-md-5 px-4">
                        <div className="row mb-5 align-items-end">
                            <div className="col-lg-8" data-aos="fade-right">
                                <span className="section-badge" style={{ background: 'rgba(8, 145, 38, 0.2)', color: 'white' }}>Upcoming
                                    Events</span>
                                <h2 className="section-title mb-0" style={{ fontSize: '3rem', color: 'var(--header-color)' }}>Don't Miss
                                    Our Events</h2>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0" data-aos="fade-left">
                                <Link href="/upcoming-events" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-700"
                                    style={{ borderWidth: '2px' }}>
                                    View All Events <i className="fa-solid fa-arrow-right ms-2"></i>
                                </Link>
                            </div>        </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-4 col-lg-3" data-aos="zoom-in" data-aos-delay="100">
                                <div className="event-card">
                                    <div className="event-card-image">
                                        <Image src="/images/ieee-images/Events/agm2026.png" alt="Annual General Meeting 2026" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-card-body">
                                        <div>
                                            <span className="event-date"><i className="bi bi-calendar-check"></i> 1 Feb 2026</span>
                                            <h3>Annual General Meeting 2026</h3>
                                            <div className="event-desc">
                                                ✨ Reflect. Reconnect. Reignite.✨<br /><br />
                                                The IEEE PES Kerala Chapter warmly invites all members to be part of the Annual
                                                General Meeting 2026 — a key milestone where we reflect on our journey,
                                                celebrate achievements, and set the course for the year ahead.<br /><br />
                                                📅 Date: 1st February 2026<br />
                                                🕙 Time: 10 am<br />
                                                📍 Venue: IEEE Kochi Section Office<br />
                                                🔗 Register now:<br />
                                                👉 https://tinyurl.com/ieeepeskc-agm2026<br /><br />
                                                Your presence matters. Let’s come together to carry forward the vision, passion,
                                                and excellence that define IEEE PES Kerala Chapter. 💚⚡<br /><br />
                                                #IEEEPES #IEEEPESKerala #AGM2026 #PowerAndEnergy #TogetherWeLead
                                            </div>
                                            <div className="read-more-btn"><i className="ri-add-line"></i> Read More Content</div>
                                            <p className="event-venue mb-1"><i className="bi bi-geo-alt-fill"></i> Kochi Section Office
                                            </p>
                                            <p className="event-venue mb-3"><i className="bi bi-clock"></i> 10:00 AM</p>
                                        </div>
                                        <a href="https://tinyurl.com/ieeepeskc-agm2026" target="_blank"
                                            className="btn-register">Register Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-3" data-aos="zoom-in" data-aos-delay="200">
                                <div className="event-card">
                                    <div className="event-card-image">
                                        <Image src="/images/ieee-images/Events/pesday_event.png" alt="IEEE PES Day" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-card-body">
                                        <div>
                                            <span className="event-date"><i className="bi bi-calendar-check"></i> 28 Feb 2026</span>
                                            <h3>IEEE PES Day</h3>
                                            <div className="event-desc">
                                                Celebrating the global impact of IEEE PES! Join our chapter's flagship
                                                celebration featuring technical workshops, student competitions, and networking
                                                with energy professionals. ⚡🌍
                                            </div>
                                            <div className="read-more-btn"><i className="ri-add-line"></i> Read More Content</div>
                                            <p className="event-venue"><i className="bi bi-geo-alt-fill"></i> IIT Palakkad</p>
                                        </div>
                                        <a href="#" className="btn-register">Register Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-3" data-aos="zoom-in" data-aos-delay="300">
                                <div className="event-card">
                                    <div className="event-card-image">
                                        <Image src="/images/ieee-images/Events/smartgrid_event.png" alt="Smart Grid Workshop" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-card-body">
                                        <div>
                                            <span className="event-date"><i className="bi bi-calendar-check"></i> 10 Mar 2026</span>
                                            <h3>Smart Grid Workshop</h3>
                                            <div className="event-desc">
                                                An intensive hands-on session focusing on Smart Grid infrastructure, IoT in
                                                power systems, and the future of grid management. Perfect for students and
                                                early-career engineers. 💡🏗️
                                            </div>
                                            <div className="read-more-btn"><i className="ri-add-line"></i> Read More Content</div>
                                            <p className="event-venue"><i className="bi bi-geo-alt-fill"></i> NIT Calicut</p>
                                        </div>
                                        <a href="#" className="btn-register">Register Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-md-none d-lg-block" data-aos="zoom-in" data-aos-delay="400">
                                <div className="event-card">
                                    <div className="event-card-image">
                                        <Image src="/images/ieee-images/Events/renewable_event.png" alt="Renewable Energy Webinar" width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-card-body">
                                        <div>
                                            <span className="event-date"><i className="bi bi-calendar-check"></i> 18 Mar 2026</span>
                                            <h3>Renewable Energy Webinar</h3>
                                            <p className="event-venue"><i className="bi bi-geo-alt-fill"></i> Online</p>
                                        </div>
                                        <a href="#" className="btn-register">Register Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </section >

        {/* Image Gallery Preview */ }
        < section className = "gallery-section section-padding" >
            <div className="container-fluid px-md-5 px-4">
                <div className="row mb-5 align-items-end">
                    <div className="col-lg-8" data-aos="fade-right">
                        <span className="section-badge">Gallery</span>
                        <h2 className="section-title">Image Gallery</h2>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0" data-aos="fade-left">
                        <Link href="/gallery" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-700">
                            View All Gallery <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>

                <div className="swiper gallery-swiper" data-aos="fade-up">
                    <div className="swiper-wrapper">
                        {/* Slide 1 */}
                        <div className="swiper-slide">
                            <div className="gallery-card">
                                <div className="gallery-image-wrapper">
                                    <Image src="/images/ieee-images/Gallery/gallery_1.png" alt="Technical Talk" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="gallery-caption">
                                    <h3>Knowledge Sharing Sessions</h3>
                                </div>
                            </div>
                        </div>
                        {/* Slide 2 */}
                        <div className="swiper-slide">
                            <div className="gallery-card">
                                <div className="gallery-image-wrapper">
                                    <Image src="/images/ieee-images/Gallery/gallery_2.png" alt="Workshop" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="gallery-caption">
                                    <h3>Hands-on Workshops</h3>
                                </div>
                            </div>
                        </div>
                        {/* Slide 3 */}
                        <div className="swiper-slide">
                            <div className="gallery-card">
                                <div className="gallery-image-wrapper">
                                    <Image src="/images/ieee-images/Gallery/gallery_3.png" alt="Volunteer Meet" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="gallery-caption">
                                    <h3>Volunteer Gatherings</h3>
                                </div>
                            </div>
                        </div>
                        {/* Slide 4 */}
                        <div className="swiper-slide">
                            <div className="gallery-card">
                                <div className="gallery-image-wrapper">
                                    <Image src="/images/ieee-images/Gallery/gallery_4.png" alt="Industrial Visit" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="gallery-caption">
                                    <h3>Industrial Visits</h3>
                                </div>
                            </div>
                        </div>
                        {/* Slide 5 (Repeat or more if needed) */}
                        <div className="swiper-slide">
                            <div className="gallery-card">
                                <div className="gallery-image-wrapper">
                                    <Image src="/images/ieee-images/Gallery/gallery_1.png" alt="Seminar" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="gallery-caption">
                                    <h3>Annual General Meetings</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add Pagination */}
                    <div className="swiper-pagination"></div>
                    {/* Add Navigation */}
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
            </div>
                </section >


        {/* Benefits & Join Section Wrapper */ }
        < div className = "benefits-join-wrapper" style = {{ background: '#f8fafc' }
}>

    {/* Benefits Section */ }
    < section className = "benefits-section" >
        <div className="container">
            <div className="section-header">
                <span className="section-badge">Why Join Us</span>
                <h2 className="section-title">Membership Benefits</h2>
                <p className="section-desc">Unlock exclusive perks and opportunities by becoming a member of IEEE
                    PES Kerala Chapter.</p>
            </div>

            <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-book-read-line"></i>
                        <div>
                            <h5>IEEE Xplore Access</h5>
                            <p>Access millions of technical documents and research publications.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-team-line"></i>
                        <div>
                            <h5>Networking</h5>
                            <p>Connect with global industry experts and energy professionals.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-briefcase-4-line"></i>
                        <div>
                            <h5>Career Growth</h5>
                            <p>Exclusive workshops, webinars, and technical certifications.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-coupon-2-line"></i>
                        <div>
                            <h5>Member Perks</h5>
                            <p>Special discounts on conferences and technical grants.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-award-line"></i>
                        <div>
                            <h5>Recognition</h5>
                            <p>Prestigious awards for professional and student excellence.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="benefit-card">
                        <i className="ri-flashlight-line"></i>
                        <div>
                            <h5>Leadership</h5>
                            <p>Volunteer opportunities to lead global energy initiatives.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                    </section >

                </div >

    {/* Full Width CTA Section */ }
    < section className = "cta-section" >
        <div className="container">
            <div className="cta-content-wrapper">
                <div className="cta-text">
                    <span className="cta-badge">Get Started</span>
                    <h2>Ready to Power Your Future?</h2>
                    <p>Join the world's largest forum for sharing the latest technological developments in the
                        electric power industry.</p>
                </div>
                <div className="cta-actions">
                    <a href="https://ieee-pes.org/membership/" target="_blank" className="btn-cta-primary">
                        Join PES Now <i className="ri-arrow-right-line"></i>
                    </a>
                    <a href="https://www.ieee.org/membership/join/index.html" target="_blank" className="btn-cta-secondary">
                        Join IEEE
                    </a>
                </div>
            </div>
        </div>
                </section >

    {/* Footer */ }
    < footer className = "footer" >
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-4 col-md-6">
                                <div className="footer-brand">
                                    <Image src="/images/ieee-images/PESKC.png" alt="IEEE PES Kerala" width={150} height={50} style={{ objectFit: 'contain' }} />
                                    <p>The IEEE Power and Energy Society Kerala Chapter is dedicated to advancing technology for
                                        the benefit of humanity through power and energy innovation.</p>
                                    <div className="footer-social">
                                        <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank"
                                            aria-label="LinkedIn">
                                            <i className="ri-linkedin-fill"></i>
                                        </a>
                                        <a href="https://www.facebook.com/ieeepeskerala" target="_blank" aria-label="Facebook">
                                            <i className="ri-facebook-fill"></i>
                                        </a>
                                        <a href="https://www.instagram.com/ieeepeskerala/" target="_blank" aria-label="Instagram">
                                            <i className="ri-instagram-line"></i>
                                        </a>
                                        <a href="https://twitter.com/ieeepeskerala" target="_blank" aria-label="X (Twitter)">
                                            <i className="ri-twitter-x-line"></i>
                                        </a>
                                        <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank"
                                            aria-label="WhatsApp Channel">
                                            <i className="ri-whatsapp-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-6">
                                <h6 className="footer-heading">Quick Links</h6>
                    <ul className="footer-links">
                        <li><Link href="/upcoming-events">Upcoming Events</Link></li>
                        <li><Link href="/student-branches">Student Branches</Link></li>
                        <li><Link href="/execom">Execom</Link></li>
                        <li><Link href="/gallery">Gallery</Link></li>
                        <li><Link href="/resources">Resources</Link></li>
                        <li><Link href="/newsletters">Newsletters</Link></li>
                        <li><Link href="/awards">Awards</Link></li>
                    </ul>            </div>
                            <div className="col-lg-2 col-md-6 col-6">
                                <h6 className="footer-heading">Get Started</h6>
                                <ul className="footer-links">
                                    <li><a href="https://www.ieee.org/" target="_blank">IEEE</a></li>
                                    <li><a href="https://ieee-pes.org/" target="_blank">IEEE PES</a></li>
                        <li><a href="https://ieeekerala.org/" target="_blank">IEEE Kerala Section</a></li>
                        <li><Link href="/membership-benefits">Membership Benefits</Link></li>
                    </ul>            </div>
                            <div className="col-lg-4 col-md-6">
                                <h6 className="footer-heading">Contact Info</h6>
                                <ul className="footer-links footer-contact">
                                    <li>
                                        <i className="bi bi-envelope-fill"></i>
                                        <a href="mailto:ieeepes.kerala@ieee.org">ieeepes.kerala@ieee.org</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-telephone-fill"></i>
                                        <a href="tel:+919446189453">+91 94461 89453</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <span>HarmonIEEE, 1st Floor, Cherian's Square, Thiruvananthapuram, Kerala 695001</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p>© 2025 <a href="https://ieeekerala.org/" target="_blank">IEEE Kerala Section</a>. All
                                        rights reserved.</p>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <p>Web Team - IEEE PES Kerala Chapter</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer >

    {/* Gallery Preview Modal */ }
    < div className = "gallery-preview-modal" id = "galleryPreview" >
        <div className="gallery-preview-content" >
            <div className="gallery-preview-close" >
                <i className="ri-close-line"></i>
            </div>
            <img src="" id="previewImg" alt="Preview" />
            <div className="preview-timer-container">
                <div className="preview-timer-bar" id="previewTimer"></div>
            </div>
        </div>
                </div >
            </div >

    {/* Bootstrap JS */ }

        </div >
    </>
);
}
