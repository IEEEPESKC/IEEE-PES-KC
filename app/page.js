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
import { useState } from 'react';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
  console.log('Fetching data from /api/admin');
  fetch('/api/admin')
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Received data:', data);
      // The API returns { success: true, data: {...} }
      if (data.success && data.data) {
        setEvents(data.data.events || []);
        setAnnouncements(data.data.announcements || []);
        setGallery(data.data.gallery || []);
      } else {
        // Fallback to empty arrays
        setEvents([]);
        setAnnouncements([]);
        setGallery([]);
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Error fetching home data:", err);
      // Set empty arrays on error so the page still renders
      setEvents([]);
      setAnnouncements([]);
      setGallery([]);
      setIsLoading(false);
    });
}, []);

    useEffect(() => {
        if (isLoading) return;
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

            // Destroy existing swipers to recreate them with new dynamic content if necessary
            // Note: Simple loop/re-init is usually fine with React if handled correctly

            // Initialize Swiper
            new Swiper('.gallery-swiper', {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: '.gallery-swiper .swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.gallery-swiper .swiper-button-next',
                    prevEl: '.gallery-swiper .swiper-button-prev',
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
                loop: document.querySelectorAll('.gallery-swiper .swiper-slide').length > 4
            });

            // Initialize Update Carousels
            new Swiper('.upcoming-update-swiper', {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 15,
                autoplay: { delay: 4000 },
                pagination: { el: '.upcoming-update-swiper .swiper-pagination', clickable: true },
                navigation: { nextEl: '.upcoming-update-swiper .swiper-button-next', prevEl: '.upcoming-update-swiper .swiper-button-prev' },
                loop: document.querySelectorAll('.upcoming-update-swiper .swiper-slide').length > 1
            });

            new Swiper('.recent-update-swiper', {
                modules: [Navigation, Autoplay],
                slidesPerView: 1,
                spaceBetween: 15,
                autoplay: { delay: 5000 },
                navigation: { nextEl: '.recent-update-swiper .swiper-button-next', prevEl: '.recent-update-swiper .swiper-button-prev' },
                loop: document.querySelectorAll('.recent-update-swiper .swiper-slide').length > 1
            });

            // Initialize Flagship Swipers
            new Swiper('.akpessc-swiper', {
                modules: [Navigation, Pagination],
                slidesPerView: 1,
                spaceBetween: 30,
                loop: document.querySelectorAll('.akpessc-swiper .swiper-slide').length > 1,
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
                loop: document.querySelectorAll('.dynamic-flagship-swiper .swiper-slide').length > 1,
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

            const closeBtn = document.querySelector('.gallery-preview-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeGalleryPreview);
            }

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
        };

        const timer = setTimeout(initScripts, 500);
        return () => clearTimeout(timer);
    }, [isLoading, events, gallery, announcements]);

    const getCategorizedEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const recent = [];
        const past = [];

        events.forEach(event => {
            const evDate = new Date(event.date);
            evDate.setHours(0, 0, 0, 0);

            if (evDate > today) {
                upcoming.push(event);
            } else {
                const diffTime = Math.abs(today - evDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) {
                    recent.push(event);
                } else {
                    past.push(event);
                }
            }
        });

        return { upcoming, recent, past };
    };

    const { upcoming, recent, past } = getCategorizedEvents();
    const akpesscEvents = events.filter(e => e.tag?.toLowerCase().includes('akpessc'));
    const wowEvents = events.filter(e => e.tag?.toLowerCase().includes('wow'));
    const displayEventsCards = [...recent, ...past].slice(0, 4);

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
                                    <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank" aria-label="LinkedIn"><i
                                        className="fa-brands fa-linkedin-in"></i></a>
                                    <a href="https://www.instagram.com/ieeepeskerala/" target="_blank" aria-label="Instagram"><i
                                        className="fa-brands fa-instagram"></i></a>
                                    <a href="https://www.facebook.com/ieeepeskerala" target="_blank" aria-label="Facebook"><i
                                        className="fa-brands fa-facebook-f"></i></a>
                                    <a href="https://twitter.com/ieeepeskerala" target="_blank" aria-label="Twitter"><i
                                        className="fa-brands fa-x-twitter"></i></a>
                                    <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank" aria-label="WhatsApp"><i
                                        className="fa-brands fa-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid px-4">
                            <Link className="navbar-brand d-flex align-items-center" href="/">
                                <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={120} height={40} style={{ objectFit: 'contain' }} />
                                <span className="ms-2 fw-bold" style={{ color: 'var(--header-color)', fontSize: '1.2rem' }}>IEEE PES Kerala</span>
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
                                            <li><Link href="/pages/about" className="dropdown-item">About IEEE PES</Link></li>
                                            <li><Link href="/pages/vision-mission" className="dropdown-item">Vision & Mission</Link></li>
                                            <li><Link href="/pages/history" className="dropdown-item">History</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Execom</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/pages/execom" className="dropdown-item">Executive Committee</Link></li>
                                            <li><Link href="/pages/past-execom" className="dropdown-item">Past Execom</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Activities</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/pages/student-branches" className="dropdown-item">Student Branch
                                                Chapters</Link></li>
                                            <li><Link href="/pages/initiatives" className="dropdown-item">Initiatives</Link></li>
                                            <li><Link href="/pages/awards" className="dropdown-item">Awards</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Events</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/pages/upcoming-events" className="dropdown-item">Upcoming Events</Link></li>
                                            <li><Link href="/pages/past-events" className="dropdown-item">Past Events</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Membership</a>
                                        <ul className="dropdown-menu">
                                            <li><Link href="/pages/membership-benefits" className="dropdown-item">Membership Benefits</Link>
                                            </li>
                                            <li><a href="https://www.ieee.org/membership/join/index.html" target="_blank"
                                                className="dropdown-item">Join IEEE</a></li>
                                            <li><a href="https://ieee-pes.org/membership/" target="_blank"
                                                className="dropdown-item">Join IEEE PES</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/gallery" className="nav-link">Gallery</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/resources" className="nav-link">Resources</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/newsletters" className="nav-link">Newsletters</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/contact" className="nav-link">Contact</Link>
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
                                <Link href="/pages/about" className="btn-glass btn-glass-primary">
                                    Our Legacy <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link href="/pages/upcoming-events" className="btn-glass">
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
                </section>

                {/* Marquee Section */}
                <div className="marquee-section">
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
                </div>

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
                                        <h3>Upcoming Events</h3>
                                    </div>
                                    <div className="swiper update-swiper upcoming-update-swiper">
                                        <div className="swiper-wrapper">
                                            {upcoming.length > 0 ? upcoming.map((event, idx) => (
                                                <div className="swiper-slide" key={idx}>
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-img">
                                                            <Image src={event.imageUrl || "/images/ieee-images/Events/pesgre_event.png"} alt={event.title} width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="swiper-update-body">
                                                            <h4>{event.title}</h4>
                                                            <div className="update-desc">
                                                                {event.description || event.details || "No description provided."}
                                                            </div>
                                                            {event.link || event.url ? (
                                                                <a href={event.link || event.url} target="_blank" className="btn-register mb-3">Register Now</a>
                                                            ) : (
                                                                <Link href="/pages/upcoming-events" className="btn-register mb-3">Learn More</Link>
                                                            )}
                                                            <p className="text-muted small mb-0">
                                                                <i className="ri-map-pin-line"></i> {event.location || "Online"} |
                                                                <i className="ri-time-line"></i> {new Date(event.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="swiper-slide">
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-body text-center p-5">
                                                            <p>No upcoming events currently scheduled.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                        <h3>Recent Events</h3>
                                    </div>
                                    <div className="swiper update-swiper recent-update-swiper">
                                        <div className="swiper-wrapper">
                                            {recent.length > 0 ? recent.map((event, idx) => (
                                                <div className="swiper-slide" key={idx}>
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-img">
                                                            <Image src={event.imageUrl || "/images/ieee-images/recent_1.png"} alt={event.title} width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="swiper-update-body">
                                                            <h4>{event.title}</h4>
                                                            <div className="update-desc">
                                                                {event.description || event.details || "Recent successful event."}
                                                            </div>
                                                            <p className="text-muted small mb-0">Held on {new Date(event.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="swiper-slide">
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-body text-center p-5">
                                                            <p>No recent events recorded in the last 30 days.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                        <h3>Announcements</h3>
                                    </div>
                                    <ul className="notice-board">
                                        {announcements.length > 0 ? announcements.map((ann, idx) => (
                                            <li className="notice-item" key={idx}>
                                                <div className="notice-date">{ann.tag || "NEW"}</div>
                                                <div className="notice-content">
                                                    <h6>{ann.title}</h6>
                                                    <p>{ann.description || ann.details}</p>
                                                    {ann.url && (
                                                        <a href={ann.url} target="_blank" className="notice-link mt-2 d-inline-block" style={{ fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                                                            Learn More <i className="ri-arrow-right-up-line"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        )) : (
                                            <li className="notice-item">
                                                <div className="notice-content text-center w-100 p-4">
                                                    <p>No active announcements at the moment.</p>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="view-all-announcements">
                                        <Link href="/pages/announcements" className="btn-view-all">
                                            View All Announcements <i className="ri-arrow-right-line"></i>
                                        </Link>
                                    </div>        </div>
                            </div>
                        </div>
                    </div>

                </section>
                {/* About Section */}
                <section className="about-section">
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
                                    <Link href="/pages/about" className="btn-base-color">
                                        Our Story <i className="fa-solid fa-arrow-right ms-2"></i>
                                    </Link>
                                    <Link href="/pages/student-branches"
                                        className="btn btn-outline-primary px-4 py-2 rounded-pill fw-700">
                                        Explore Student Branches
                                    </Link>
                                </div>        </div>
                        </div>
                    </div>
                </section>





                {/* Message from Chair */}
                <section className="chair-section section-padding">
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
                </section>

                {/* Initiatives Section */}
                <section className="initiatives-section section-padding">
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
                </section>

                {/* Flagships Section */}
                <section className="flagships-section">
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
                                            {akpesscEvents.length > 0 ? akpesscEvents.map((event, idx) => (
                                                <div className="swiper-slide" key={idx}>
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-img">
                                                            <Image src={event.imageUrl || "/images/ieee-images/Flagships/akpessc_flagship_1770434008791.png"} alt={event.title} width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="swiper-update-body">
                                                            <h5>{event.title}</h5>
                                                            <div className="update-desc">
                                                                {event.description || event.details}
                                                            </div>
                                                            {event.link || event.url ? (
                                                                <a href={event.link || event.url} target="_blank" className="btn-register mb-3">Register Now</a>
                                                            ) : (
                                                                <Link href="/pages/upcoming-events" className="btn-register mb-3">Learn More</Link>
                                                            )}
                                                            <p className="text-muted small mb-0"><i className="ri-map-pin-line"></i> {event.location || "TBD"} |
                                                                <i className="ri-calendar-line"></i> {event.date ? new Date(event.date).toLocaleDateString() : "Annual"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="swiper-slide">
                                                    <div className="swiper-update-card">
                                                        <div className="swiper-update-img">
                                                            <Image src="/images/ieee-images/Flagships/akpessc_flagship_1770434008791.png" alt="AKPESSC" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="swiper-update-body">
                                                            <h5>AKPESSC - All Kerala Power & Energy Society Student Congress</h5>
                                                            <p>Our premier flagship event for students across Kerala.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                                    {wowEvents.map((_, i) => <div className="swiper-slide header-item-slide" key={i}>WOW</div>)}
                                                    {events.filter(e => e.tag?.toLowerCase().includes('intellect')).map((_, i) => <div className="swiper-slide header-item-slide" key={i}>Intellect</div>)}
                                                    {events.filter(e => e.tag?.toLowerCase().includes('pes day')).map((_, i) => <div className="swiper-slide header-item-slide" key={i}>PES Day</div>)}
                                                    {(wowEvents.length === 0 && events.filter(e => e.tag?.toLowerCase().includes('intellect')).length === 0 && events.filter(e => e.tag?.toLowerCase().includes('pes day')).length === 0) && (
                                                        <>
                                                            <div className="swiper-slide header-item-slide">WOW</div>
                                                            <div className="swiper-slide header-item-slide">Intellect</div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper flagship-swiper dynamic-flagship-swiper">
                                        <div className="swiper-wrapper">
                                            {[
                                                ...wowEvents,
                                                ...events.filter(e => e.tag?.toLowerCase().includes('intellect')),
                                                ...events.filter(e => e.tag?.toLowerCase().includes('pes day'))
                                            ].length > 0 ? [
                                                ...wowEvents,
                                                ...events.filter(e => e.tag?.toLowerCase().includes('intellect')),
                                                ...events.filter(e => e.tag?.toLowerCase().includes('pes day'))
                                            ].map((event, idx) => (
                                                <div className="swiper-slide" key={idx}>
                                                    <div className="swiper-update-card mb-3">
                                                        <div className="swiper-update-img">
                                                            <Image src={event.imageUrl || "/images/ieee-images/Flagships/wow_flagship_1770434024340.png"} alt={event.title} width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="swiper-update-body">
                                                            <h5>{event.title}</h5>
                                                            <div className="update-desc">
                                                                {event.description || event.details}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <>
                                                    <div className="swiper-slide">
                                                        <div className="swiper-update-card mb-3">
                                                            <div className="swiper-update-img">
                                                                <Image src="/images/ieee-images/Flagships/wow_flagship_1770434024340.png" alt="WOW" width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <div className="swiper-update-body">
                                                                <h5>Women in Power</h5>
                                                                <p>Empowering women engineers to lead the energy transition.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="swiper-pagination"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section className="events-section">
                    <div className="container-fluid px-md-5 px-4">
                        <div className="row mb-5 align-items-end">
                            <div className="col-lg-8" data-aos="fade-right">
                                <span className="section-badge" style={{ background: 'rgba(8, 145, 38, 0.2)', color: 'white' }}>Upcoming
                                    Events</span>
                                <h2 className="section-title mb-0" style={{ fontSize: '3rem', color: 'var(--header-color)' }}>Don't Miss
                                    Our Events</h2>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0" data-aos="fade-left">
                                <Link href="/pages/upcoming-events" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-700"
                                    style={{ borderWidth: '2px' }}>
                                    View All Events <i className="fa-solid fa-arrow-right ms-2"></i>
                                </Link>
                            </div>        </div>
                        <div className="row g-4">
                            {displayEventsCards.length > 0 ? displayEventsCards.map((event, idx) => (
                                <div className="col-md-4 col-lg-3" key={idx} data-aos="zoom-in" data-aos-delay={(idx + 1) * 100}>
                                    <div className="event-card">
                                        <div className="event-card-image">
                                            <Image src={event.imageUrl || "/images/ieee-images/Events/agm2026.png"} alt={event.title} width={640} height={640} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="event-card-body">
                                            <div>
                                                <span className="event-date"><i className="bi bi-calendar-check"></i> {new Date(event.date).toLocaleDateString()}</span>
                                                <h3>{event.title}</h3>
                                                <div className="event-desc">
                                                    {event.description || event.details}
                                                </div>
                                                <div className="read-more-btn"><i className="ri-add-line"></i> Read More Content</div>
                                                <p className="event-venue mb-1"><i className="bi bi-geo-alt-fill"></i> {event.location || "Online"}</p>
                                            </div>
                                            {event.link || event.url ? (
                                                <a href={event.link || event.url} target="_blank" className="btn-register">Register Now</a>
                                            ) : (
                                                <Link href="/pages/upcoming-events" className="btn-register">Learn More</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12 text-center p-5">
                                    <p>Check back soon for more exciting events!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Image Gallery Preview */}
                <section className="gallery-section section-padding">
                    <div className="container-fluid px-md-5 px-4">
                        <div className="row mb-5 align-items-end">
                            <div className="col-lg-8" data-aos="fade-right">
                                <span className="section-badge">Gallery</span>
                                <h2 className="section-title">Image Gallery</h2>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0" data-aos="fade-left">
                                <Link href="/pages/gallery" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-700">
                                    View All Gallery <i className="fa-solid fa-arrow-right ms-2"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="swiper gallery-swiper" data-aos="fade-up">
                            <div className="swiper-wrapper">
                                {gallery.length > 0 ? gallery.map((item, idx) => (
                                    <div className="swiper-slide" key={idx}>
                                        <div className="gallery-card">
                                            <div className="gallery-image-wrapper">
                                                <Image src={item.imageUrl || "/images/ieee-images/Gallery/gallery_1.png"} alt={item.title || "Gallery Image"} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div className="gallery-caption">
                                                <h3>{item.title || item.category || "Chapter Event"}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    [1, 2, 3, 4].map((i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="gallery-card">
                                                <div className="gallery-image-wrapper">
                                                    <Image src={`/images/ieee-images/Gallery/gallery_${i}.png`} alt="Gallery" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Add Pagination */}
                            <div className="swiper-pagination"></div>
                            {/* Add Navigation */}
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                        </div>
                    </div>
                </section>


                {/* Benefits & Join Section Wrapper */}
                <div className="benefits-join-wrapper" style={{ background: '#f8fafc' }}>

                    {/* Benefits Section */}
                    <section className="benefits-section">
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
                    </section>
                </div>

                {/* Full Width CTA Section */}
                                <section className="cta-section">
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
                                </section>

                                {/* Footer */}
                                <footer className="footer">
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
                                                <h4 className="footer-heading">Quick Links</h4>
                                                <ul className="footer-links">
                                                    <li><Link href="/pages/upcoming-events">Upcoming Events</Link></li>
                                                    <li><Link href="/pages/student-branches">Student Branches</Link></li>
                                                    <li><Link href="/pages/execom">Execom</Link></li>
                                                    <li><Link href="/pages/gallery">Gallery</Link></li>
                                                    <li><Link href="/pages/resources">Resources</Link></li>
                                                    <li><Link href="/pages/newsletters">Newsletters</Link></li>
                                                    <li><Link href="/pages/awards">Awards</Link></li>
                                                    <li><Link href="/admin" className="admin-footer-link">Admin Dashboard</Link></li>
                                                </ul>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-6">
                                                <h4 className="footer-heading">Get Started</h4>
                                                <ul className="footer-links">
                                                    <li><a href="https://www.ieee.org/" target="_blank">IEEE</a></li>
                                                    <li><a href="https://ieee-pes.org/" target="_blank">IEEE PES</a></li>
                                                    <li><a href="https://ieeekerala.org/" target="_blank">IEEE Kerala Section</a></li>
                                                    <li><Link href="/pages/membership-benefits">Membership Benefits</Link></li>
                                                </ul>
                                            </div>
                                            <div className="col-lg-4 col-md-6">
                                                <h4 className="footer-heading">Contact Info</h4>
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
                                                        <span>HarmonIEEE, 1st Floor, Cherian&apos;s Square, Thiruvananthapuram, Kerala 695001</span>
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
                                </footer>

                                {/* Gallery Preview Modal */}
                <div className="gallery-preview-modal" id="galleryPreview">
                    <div className="gallery-preview-content">
                        <div className="gallery-preview-close">
                            <i className="ri-close-line"></i>
                        </div>
                        <img src={null} id="previewImg" alt="Preview" />
                        <div className="preview-timer-container">
                            <div className="preview-timer-bar" id="previewTimer"></div>
                        </div>
                    </div>
                </div>

                {/* Bootstrap JS */}

            </div>
        </>
    );
}
