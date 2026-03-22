'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

            const headerSwiperEl = document.querySelector('.header-swiper');
            let headerSwiper = null;
            if (headerSwiperEl) {
                headerSwiper = new Swiper('.header-swiper', {
                    modules: [EffectFade],
                    effect: 'fade',
                    fadeEffect: { crossFade: true },
                    allowTouchMove: false,
                });
            }

            // Initialize main Hero Slider (Flagship)
            const flagSwiperEl = document.querySelector('.flag-swiper');
            if (flagSwiperEl) {
                const flagshipSwiper = new Swiper('.flag-swiper', {
                    modules: [Navigation, Pagination, Autoplay],
                    slidesPerView: 1,
                    spaceBetween: 30,
                    autoplay: { delay: 6000, disableOnInteraction: false },
                    pagination: { el: '.flag-swiper .swiper-pagination', clickable: true },
                    navigation: { nextEl: '.flag-swiper .swiper-button-next', prevEl: '.flag-swiper .swiper-button-prev' },
                    on: {
                        slideChange: function () {
                            if (headerSwiper) {
                                headerSwiper.slideTo(this.activeIndex);
                            }
                        }
                    }
                });

                const playBtn = document.querySelector('.hero-play-btn');
                const pauseBtn = document.querySelector('.hero-pause-btn');
                if (playBtn && pauseBtn) {
                    playBtn.addEventListener('click', () => {
                        flagshipSwiper.autoplay.start();
                        playBtn.style.opacity = '1';
                        pauseBtn.style.opacity = '0.5';
                    });
                    pauseBtn.addEventListener('click', () => {
                        flagshipSwiper.autoplay.stop();
                        pauseBtn.style.opacity = '1';
                        playBtn.style.opacity = '0.5';
                    });
                    
                    if (flagshipSwiper.autoplay.running) {
                        playBtn.style.opacity = '1';
                        pauseBtn.style.opacity = '0.5';
                    } else {
                        pauseBtn.style.opacity = '1';
                        playBtn.style.opacity = '0.5';
                    }
                }
            }

            // Initialize Upcoming Events Slider
            const upcomingSwiperEl = document.querySelector('.upcoming-events-swiper');
            if (upcomingSwiperEl) {
                new Swiper('.upcoming-events-swiper', {
                    modules: [Pagination, Autoplay],
                    slidesPerView: 1,
                    autoplay: { delay: 4000, disableOnInteraction: false },
                    pagination: { el: '.upcoming-swiper-pagination', clickable: true },
                    loop: true,
                });
            }

            // Animated Counters Logic
            const counters = document.querySelectorAll('.counter');
            if (counters.length > 0) {
                const animateCounter = (counter) => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString('en-US');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString('en-US');
                        }
                    };
                    updateCounter();
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                counters.forEach(counter => observer.observe(counter));
            }
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

    const galleryVideos = [
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Future of Grid Modernization - IEEE PES Webinar", views: "3.2K", time: "2 days ago", duration: "1:05:20" },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Renewable Energy Integration Challenges and Solutions", views: "5.1K", time: "1 week ago", duration: "45:30" },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Smart Grid Technologies & Applications for 2026", views: "2.8K", time: "3 weeks ago", duration: "52:15" },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "IEEE PES Women in Power Leadership Panel Discussion", views: "1.9K", time: "1 month ago", duration: "1:15:00" },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Electric Vehicle Charging Infrastructure: The Next Decade", views: "4.5K", time: "2 months ago", duration: "38:45" }
    ];

    return(
        <>
        <div className="box-layout">
            {/* Header Components Imported Globally */}
            <Navbar />

            {/* Hero Section — cmte.ieee.org Slideshow Style */}
            <div id="hero" className="hero-section position-relative overflow-hidden" style={{ minHeight: '100svh' }}>
                <style dangerouslySetInnerHTML={{__html: `
                    #hero .slide {
                        min-height: 100svh;
                        background-size: cover;
                        background-position: center center;
                        display: flex;
                        align-items: center;
                        position: relative;
                    }
                    #hero .slide::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%);
                    }
                    #hero .slide .inner-content {
                        position: relative;
                        z-index: 2;
                        color: white;
                    }
                    #hero .slide .inner-content h1 {
                        font-size: clamp(1.8rem, 4vw, 3.2rem);
                        font-weight: 800;
                        line-height: 1.2;
                        margin-bottom: 1rem;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.6);
                    }
                    #hero .slide .inner-content h2 {
                        font-size: clamp(1rem, 2vw, 1.4rem);
                        font-weight: 300;
                        margin-bottom: 2rem;
                        opacity: 0.95;
                        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
                    }
                    #hero .flag-swiper .swiper-button-next,
                    #hero .flag-swiper .swiper-button-prev {
                        color: white;
                        background: rgba(255,255,255,0.15);
                        backdrop-filter: blur(8px);
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        border: 1px solid rgba(255,255,255,0.3);
                    }
                    #hero .flag-swiper .swiper-button-next::after,
                    #hero .flag-swiper .swiper-button-prev::after {
                        font-size: 16px;
                        font-weight: 900;
                    }
                    #hero .hero-play-pause {
                        position: absolute;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 20;
                        display: flex;
                        gap: 12px;
                    }
                    #hero .hero-play-pause button {
                        width: 46px;
                        height: 46px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255,255,255,0.4);
                        color: white;
                        font-size: 1.1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: background 0.3s, opacity 0.3s;
                    }
                    #hero .hero-play-pause button:hover {
                        background: rgba(255,255,255,0.35);
                    }
                    @media (max-width: 768px) {
                        #hero .slide { height: 100svh !important; min-height: 100svh !important; }
                        #hero .slide .inner-content { 
                            padding-top: 2.5rem !important; 
                            padding-bottom: 2.5rem !important; 
                            margin: 0 1rem;
                            background: rgba(0,0,0,0.75) !important;
                            border: 1px solid rgba(255,255,255,0.1);
                        }
                        #hero .slide .inner-content h1 { font-size: 1.9rem; margin-bottom: 0.75rem; }
                        #hero .slide .inner-content h2 { font-size: 1.05rem; margin-bottom: 1.5rem; }
                        #hero .flag-swiper .swiper-button-next,
                        #hero .flag-swiper .swiper-button-prev { display: none; }
                        #hero .hero-play-pause { bottom: 20px; button { width: 40px; height: 40px; } }
                        #hero .btn { width: 100%; display: block; font-size: 1rem !important; }
                    }
                `}} />

                {/* Swiper Hero Slides */}
                <div className="swiper flag-swiper h-100" style={{ width: '100%', minHeight: '100svh' }}>
                    <div className="swiper-wrapper h-100">
                        {/* Slide 1 */}
                        <div className="swiper-slide h-100">
                            <div className="slide h-100 w-100" style={{ backgroundImage: 'url(https://cmte.ieee.org/pes-template/wp-content/uploads/sites/78/2019/12/shutterstock_773069344-slide.jpg)' }}>
                                <div className="container h-100 text-center text-lg-start">
                                    <div className="row h-100 align-items-center">
                                        {/* Empty left column for template accuracy */}
                                        <div className="d-none d-lg-block col-lg-6"></div>
                                        <div className="col-12 col-md-10 mx-auto mx-lg-0 col-lg-6">
                                            <div className="inner-content py-5 px-3 px-lg-5" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                                                <h1 className="mb-3">Join the Award-Winning IEEE PES Boston Chapter</h1>
                                                <h2 className="mb-4">Network with over 500 engineering professionals in the Boston metro area</h2>
                                                <a href="/membership" className="btn btn-lg text-uppercase fw-bold px-4 py-3" style={{ backgroundColor: 'var(--pes-green)', color: 'white', border: 'none', borderRadius: 0, fontSize: '0.9rem', letterSpacing: '1px' }}>Learn More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Slide 2 */}
                        <div className="swiper-slide h-100">
                            <div className="slide h-100 w-100" style={{ backgroundImage: 'url(https://cmte.ieee.org/pes-template/wp-content/uploads/sites/78/2019/12/shutterstock_681206938-slider.jpg)', backgroundPosition: 'center' }}>
                                <div className="container h-100 text-center text-lg-start">
                                    <div className="row h-100 align-items-center">
                                        <div className="col-12 col-md-10 mx-auto mx-lg-0 col-lg-6">
                                            <div className="inner-content py-5 px-3 px-lg-5" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                                                <h1 className="mb-3">Get Involved</h1>
                                                <h2 className="mb-4">Come to Our Next Meeting: January 21st, 2020</h2>
                                                <a href="/events" className="btn btn-lg text-uppercase fw-bold px-4 py-3" style={{ backgroundColor: 'var(--pes-green)', color: 'white', border: 'none', borderRadius: 0, fontSize: '0.9rem', letterSpacing: '1px' }}>See Calendar</a>
                                            </div>
                                        </div>
                                        <div className="d-none d-lg-block col-lg-6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Swiper Nav */}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                </div>

                {/* Play / Pause */}
                <div className="hero-play-pause">
                    <button className="hero-play-btn" title="Play slideshow">
                        <i className="ri-play-fill ms-1"></i>
                    </button>
                    <button className="hero-pause-btn" title="Pause slideshow">
                        <i className="ri-pause-fill"></i>
                    </button>
                </div>
            </div>

            <div className="container pt-5">
                <div className="vc_row-full-width vc_clearfix"></div>
                <div className="vc_row wpb_row vc_row-fluid vc_custom_1564497980118 mt-5 mb-5">
                    <div className="wpb_column vc_column_container vc_col-sm-12">
                        <div className="vc_column-inner">
                            <div className="wpb_wrapper">
                                <div className="wpb_text_column wpb_content_element">
                                    <div className="wpb_wrapper">
                                        <p style={{ textAlign: "justify", fontSize: "1.1rem" }}>The <strong>Boston Chapter of the Power and Energy Society</strong> consists of roughly 500 members including power engineering professionals, students, and associates in and around the Boston area. Our chapter provides high quality technical meetings and technical courses to our members and non-members alike. Some of the topics that have been covered recently in our technical meetings include Grid Modernization, Energy Markets, Substation Automation and Arc Flash Safety. We also offer CEU/PDH accredited courses for continuing education in topics such as Energy Storage, Microgrids, Distributed Generation, Symmetrical Components, Equipment Testing and Commissioning, and Distribution and Substation Engineering.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vc_row wpb_row vc_row-fluid row mb-5 mt-5 pt-4 align-items-stretch">
                    <div className="wpb_column vc_column_container vc_col-sm-12 col-md-6 mb-4 mb-md-0">
                        <div className="vc_column-inner h-100">
                            <div className="wpb_wrapper p-5 rounded border bg-white shadow-sm h-100" style={{ borderTop: "4px solid var(--pes-green) !important" }}>
                                <h4 className="mb-4 fw-bold">Recent Posts &amp; Updates</h4>
                                <div className="posts">
                                    <ul className="list-unstyled">
                                        <li className="mb-4 pb-3 border-bottom">
                                            <small className="text-secondary fw-bold text-uppercase">December 15, 2025</small>
                                            <h5 className="fw-bold mt-1"><a href="#" className="text-dark text-decoration-none">Annual General Meeting 2025 Successfully Concludes</a></h5>
                                            <p className="text-muted small mb-2">Our year-end meeting brought together top professionals to discuss grid modernization.</p>
                                            <a href="#" className="text-success small fw-bold text-decoration-none">Read More &rarr;</a>
                                        </li>
                                        <li className="mb-4 pb-3 border-bottom">
                                            <small className="text-secondary fw-bold text-uppercase">November 2, 2025</small>
                                            <h5 className="fw-bold mt-1"><a href="#" className="text-dark text-decoration-none">New Student Chapter Inaugurated at Local University</a></h5>
                                            <p className="text-muted small mb-2">Excited to welcome the newest technical student branch into the PES family.</p>
                                            <a href="#" className="text-success small fw-bold text-decoration-none">Read More &rarr;</a>
                                        </li>
                                        <li>
                                            <small className="text-secondary fw-bold text-uppercase">October 18, 2025</small>
                                            <h5 className="fw-bold mt-1"><a href="#" className="text-dark text-decoration-none">Call for Papers: 2026 Transmission Conference</a></h5>
                                            <p className="text-muted small mb-2">Submit your abstracts for the upcoming regional conference.</p>
                                            <a href="#" className="text-success small fw-bold text-decoration-none">Read More &rarr;</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="wpb_column vc_column_container vc_col-sm-12 col-md-6">
                        <div className="vc_column-inner h-100 rounded overflow-hidden shadow-sm d-flex flex-column justify-content-center" style={{ backgroundImage: 'url(https://cmte.ieee.org/pes-template/wp-content/uploads/sites/78/2019/12/shutterstock_1033701589-slice.jpg)', backgroundPosition: 'center center', backgroundSize: 'cover', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
                            <div className="wpb_wrapper text-center w-100 position-relative z-index-2 px-4 py-5 h-100 d-flex align-items-center justify-content-center">
                                <a className="btn btn-primary btn-block btn-lg shadow fs-4 fw-bold p-4 w-100 d-flex align-items-center justify-content-center" href="#" title="Stay Up To Date: Join Our Mailing List" style={{ whiteSpace: 'normal', borderRadius: '0', backgroundColor: 'var(--pes-green)', border: 'none', minHeight: '120px' }}>Stay Up To Date:<br />Join Our Mailing List</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="spotlight" className="vc_row wpb_row vc_row-fluid split-screen mt-5 mb-5 container mx-auto">
                <div className="row w-100 m-0">
                    <div className="split-screen-content left wpb_column vc_column_container vc_col-sm-6 col-md-6 pe-md-5">
                        <div className="vc_column-inner">
                            <div className="wpb_wrapper">
                                <h2 style={{ textAlign: "left" }} className="vc_custom_heading vc_do_custom_heading section-title mb-4 fw-bold">In the Spotlight</h2>

                                <h3 style={{ color: "#111111", textAlign: "left" }} className="vc_custom_heading vc_do_custom_heading h4 mt-0 fw-bold">What to Watch in AI Delivery, Medical Device Cybersecurity and Digital Therapeutics</h3>
                                <div className="wpb_text_column wpb_content_element mb-4">
                                    <div className="wpb_wrapper text-muted">
                                        <p><span style={{ fontWeight: 400 }}>As 2026 moves ahead, the Global Healthcare &amp; Life Sciences Practice of the IEEE Standards Association has identified three trends that stand out for their impact on the delivery and security of care as well as the evolving ecosystem of medical-grade digital therapeutics.</span></p>
                                        <p><a className="arrow-link fw-bold text-success text-decoration-none" href="https://standards.ieee.org/beyond-standards/2026-healthcare-and-life-sciences-trends-what-to-watch-in-ai-delivery-medical-device-cybersecurity-and-digital-therapeutics/" rel="noopener">2026 Healthcare and Life Sciences Trends &rarr;</a></p>
                                    </div>
                                </div>

                                <div className="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text mt-4 mb-4">
                                    <hr style={{ borderColor: '#d9d9d6', borderWidth: '2px', opacity: 0.5 }} />
                                </div>

                                <h3 style={{ textAlign: "left", color: "#111111" }} className="vc_custom_heading vc_do_custom_heading h4 mt-0 fw-bold">Age-Appropriate Design and Child Digital Well-Being</h3>
                                <div className="wpb_text_column wpb_content_element mb-4">
                                    <div className="wpb_wrapper text-muted">
                                        <p>IEEE SA, with UNICEF and the Greek Ministry of Digital Governance, hosted a <a href="https://publicadministration.desa.un.org/wsis20">UN WSIS+20</a> High-Level Meeting <a href="#">Side Event</a> on Designing Responsibly, focusing on age-appropriate standards in the Digital Era.</p>
                                        <p><a className="arrow-link fw-bold text-success text-decoration-none" href="https://standards.ieee.org/beyond-standards/ge-appropriate-design-and-child-digital-well-being/">Key Takeaways from the WSIS+20 Side Event &rarr;</a></p>
                                    </div>
                                </div>

                                <div className="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text mt-4 mb-4">
                                    <hr style={{ borderColor: '#d9d9d6', borderWidth: '2px', opacity: 0.5 }} />
                                </div>

                                <h3 style={{ textAlign: "left", color: "#111111" }} className="vc_custom_heading vc_do_custom_heading h4 mt-0 fw-bold">Share Your Idea to Strengthen Trust in AI</h3>
                                <div className="wpb_text_column wpb_content_element mb-4">
                                    <div className="wpb_wrapper text-muted">
                                        <p>IEEE SA joined the Global Trust Challenge to help move ideas about trustworthy AI into real-world testing and implementation. Individuals and teams are invited to submit proposals and explore ideas with expert guidance, prototyping, and live pilots.</p>
                                        <p><a className="arrow-link fw-bold text-success text-decoration-none" href="http://www.globalchallenge.ai/" target="_blank" rel="noopener noreferrer">Learn More or Submit a Proposal &rarr;</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right wpb_column vc_column_container vc_col-sm-6 col-md-6 vc_col-has-fill rounded overflow-hidden shadow-lg p-0" style={{ position: 'relative', backgroundColor: 'var(--pes-green)' }}>
                        <div className="position-absolute top-0 end-0 bg-dark text-white px-3 py-1 m-3 rounded shadow" style={{ fontSize: '0.85rem', zIndex: 10, opacity: 0.9 }}>
                            <i className="ri-calendar-event-line me-2"></i>Upcoming Events
                        </div>
                        <div className="swiper upcoming-events-swiper h-100 w-100 position-relative">
                            <div className="swiper-wrapper h-100">
                                {upcoming.length > 0 ? (
                                    upcoming.map((evt, idx) => (
                                        <div className="swiper-slide h-100 text-bg-dark" key={idx}>
                                            <div className="vc_column-inner h-100 p-0">
                                                <div className="wpb_wrapper h-100 d-flex flex-column">
                                                    <div className="wpb_single_image wpb_content_element vc_align_center mb-0" style={{ height: '350px', overflow: 'hidden' }}>
                                                        <figure className="wpb_wrapper vc_figure m-0 h-100">
                                                            <div className="vc_single_image-wrapper vc_box_border_grey h-100">
                                                                <Image src={evt.imageUrl || "/images/ieee-images/Events/pesgre_event.png"} alt={evt.title} width={1920} height={1080} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                        </figure>
                                                    </div>
                                                    <div className="p-4 p-md-5 d-flex flex-column justify-content-center flex-grow-1 text-white bg-transparent">
                                                        <h3 style={{ textAlign: "left", color: "white" }} className="vc_custom_heading vc_do_custom_heading h3 text-white mt-0 mb-3 fw-bold">
                                                            {evt.title}
                                                        </h3>
                                                        <div className="wpb_text_column wpb_content_element mb-4 text-white" style={{ opacity: 0.9 }}>
                                                            <div className="wpb_wrapper">
                                                                <p className="text-white">{evt.description || evt.details || "Join us for our next featured event."}</p>
                                                                <p className="mt-4"><a className="arrow-link text-white fw-bold text-decoration-none border-bottom pb-1" href={evt.link || evt.url || "#"} target="_blank" rel="noopener noreferrer"><span className="arrow-icon">Learn More &rarr;</span></a></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="swiper-slide h-100">
                                        <div className="vc_column-inner h-100 p-0">
                                            <div className="wpb_wrapper h-100 d-flex flex-column">
                                                <div className="wpb_single_image wpb_content_element vc_align_center mb-0" style={{ height: '350px', overflow: 'hidden' }}>
                                                    <figure className="wpb_wrapper vc_figure m-0 h-100">
                                                        <div className="vc_single_image-wrapper vc_box_border_grey h-100">
                                                            <img src="https://standards.ieee.org/wp-content/uploads/2026/03/Childrens-Data_Tablets_1920x1080.jpg" alt="Events" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="p-4 p-md-5 d-flex flex-column justify-content-center flex-grow-1 text-white">
                                                    <h3 style={{ textAlign: "left", color: "white" }} className="vc_custom_heading vc_do_custom_heading h3 text-white mt-0 mb-3 fw-bold">
                                                        Enabling Trustworthy Digital Experiences for Children
                                                    </h3>
                                                    <div className="wpb_text_column wpb_content_element mb-4 text-white" style={{ opacity: 0.9 }}>
                                                        <div className="wpb_wrapper">
                                                            <p>Today, one in three people online is under the age of 18, but the original design of most digital technologies did not anticipate the use of those technologies by children. Therefore, there is an urgent need to address the vulnerabilities...</p>
                                                            <p className="mt-4"><a className="arrow-link text-white fw-bold text-decoration-none border-bottom pb-1" href="https://standards.ieee.org/" target="_blank" rel="noopener noreferrer"><span className="arrow-icon">Learn More &rarr;</span></a></p>
                                                        </div>
                                                    </div>
                                                </div>
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

            {/* Old Stay Up To Date full-width banner was removed and integrated above */}

            {/* Latest Videos Gallery */}
            <section className="latest-videos-section position-relative" style={{ padding: '80px 0', background: 'linear-gradient(to bottom, #fcfcfc, #ffffff)', overflow: 'hidden' }}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .marquee-container {
                            animation: scroll-left 40s linear infinite;
                            display: flex;
                            width: max-content;
                        }
                        .marquee-container:hover {
                            animation-play-state: paused;
                        }
                        @keyframes scroll-left {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-50%)); }
                        }
                        .video-card:hover .video-img { transform: scale(1.05); }
                        .video-card:hover .play-overlay { opacity: 1 !important; }
                        .video-card:hover .video-title { color: var(--pes-green) !important; }
                    `}} />
                <div className="container">
                    <div className="text-center mb-5 pb-3">
                        <h2 className="fw-bold fs-1 text-dark mb-3">Latest <span style={{ color: 'var(--pes-green)' }}>Videos</span></h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>Check out the newest tutorials, player reviews, and gameplay tips</p>
                    </div>
                </div>

                <div className="position-relative">
                    <div className="position-absolute top-0 start-0 z-3" style={{ width: '120px', height: '100%', background: 'linear-gradient(to right, #fcfcfc, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
                    <div className="position-absolute top-0 end-0 z-3" style={{ width: '120px', height: '100%', background: 'linear-gradient(to left, #ffffff, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>

                    <div className="overflow-hidden">
                        <div className="marquee-container" style={{ gap: '24px', paddingRight: '24px' }}>
                            {[...galleryVideos, ...galleryVideos].map((video, idx) => (
                                <a key={idx} href={video.url} target="_blank" rel="noopener noreferrer" className="video-card flex-shrink-0 text-decoration-none" style={{ width: '340px', cursor: 'pointer' }}>
                                    <div className="video-thumbnail position-relative rounded-4 overflow-hidden mb-3 shadow-sm border border-light" style={{ aspectRatio: '16/9' }}>
                                        <img src={video.img} alt="Video" className="w-100 h-100 object-fit-cover video-img" style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        <div className="play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.3s' }}>
                                            <div className="play-btn rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #e52d27 0%, #b31217 100%)' }}>
                                                <i className="ri-play-fill text-white fs-1 ms-1"></i>
                                            </div>
                                        </div>
                                        <div className="duration position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded bg-dark text-white fw-medium" style={{ fontSize: '12px', opacity: 0.85 }}>{video.duration}</div>
                                    </div>
                                    <h3 className="fs-6 fw-bold text-dark video-title pe-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5', transition: 'color 0.3s' }}>{video.title}</h3>
                                    <div className="d-flex align-items-center gap-4 text-secondary mt-2" style={{ fontSize: '13px' }}>
                                        <span className="d-flex align-items-center gap-1"><i className="ri-eye-line fs-6"></i> {video.views}</span>
                                        <span className="d-flex align-items-center gap-1"><i className="ri-time-line fs-6"></i> {video.time}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-muted mt-5 mb-0 fw-medium" style={{ fontSize: '14px', opacity: 0.6, letterSpacing: '0.5px' }}>Auto-scrolling - Hover to pause</p>
                </div>
            </section>

            <div className="container mb-5 pb-5 mt-5 pt-4">
                <div className="vc_row wpb_row vc_row-fluid vc_custom_1575574049069" style={{ paddingBottom: '80px' }}>
                    <div className="wpb_column vc_column_container vc_col-sm-12">
                        <div className="vc_column-inner">
                            <div className="wpb_wrapper text-center">
                                <h3 className="fw-bold" style={{ marginBottom: "40px", display: 'inline-block', padding: '12px 35px', border: '3px solid var(--pes-green)', color: 'var(--pes-green)', fontSize: '1.4rem', textTransform: 'uppercase' }}>IEEE PES Boston Chapter Chairs</h3>
                                <div className="row mt-5">
                                    <div className="col-md-4 text-center mb-4">
                                        <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green) !important" }}>
                                            <div className="card-body p-4 pt-5" style={{ borderTop: '6px solid var(--pes-green)' }}>
                                                <h4 className="fw-bold mb-1">Subhadarshi Sarkar</h4>
                                                <p className="text-secondary fw-bold mb-3">Chair</p>
                                                <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>Transmission Planning Engineer, National Grid<br />Ph.D IOWA State University<br />B.S Bengal Engineering and Science University, India<br />Member IEEE, PES</p>
                                                <a href="#" className="mt-3 d-inline-block"><i className="ri-mail-line fs-2 text-success"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center mb-4">
                                        <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green) !important" }}>
                                            <div className="card-body p-4 pt-5" style={{ borderTop: '6px solid var(--pes-green)' }}>
                                                <h4 className="fw-bold mb-1">Souresh Mukherjee</h4>
                                                <p className="text-secondary fw-bold mb-3">Vice-Chair</p>
                                                <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>Engineer, Asset Management Distribution and SubTransmission NE, National Grid<br />M.S. Michigan Technological University<br />B.Tech West Bengal University of Technology, India<br />Member IEEE, PES</p>
                                                <a href="#" className="mt-3 d-inline-block"><i className="ri-mail-line fs-2 text-success"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center mb-4">
                                        <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green) !important" }}>
                                            <div className="card-body p-4 pt-5" style={{ borderTop: '6px solid var(--pes-green)' }}>
                                                <h4 className="fw-bold mb-1">Babak Enayati</h4>
                                                <p className="text-secondary fw-bold mb-3">Chair - Emeritus</p>
                                                <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>Lead Engineer, Research Development and Demonstration, Utility of the Future, National Grid<br />PhD Clarkson University, MSc Isfahan University of Tech, BSc. Tabriz University<br />Senior Member IEEE, PES, IEEE Standards Committee</p>
                                                <a href="#" className="mt-3 d-inline-block"><i className="ri-mail-line fs-2 text-success"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vc_row wpb_row vc_row-fluid mt-4">
                    <div className="wpb_column vc_column_container vc_col-sm-12">
                        <div className="vc_column-inner text-center">
                            <div className="wpb_wrapper">
                                <h3 className="fw-bold" style={{ marginBottom: "20px", display: 'inline-block', padding: '12px 35px', border: '3px solid var(--pes-green)', color: 'var(--pes-green)', fontSize: '1.4rem', textTransform: 'uppercase' }}>About IEEE and PES</h3>
                                <div className="row text-start mt-5">
                                    <div className="col-md-6 mb-4">
                                        <div className="p-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is IEEE?</h4>
                                            <p className="mb-5 text-muted lh-lg">IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.</p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership/join/index.html?WT.mc_id=hc_join" title="Join IEEE" target="_blank" rel="noreferrer" style={{ borderRadius: '0', borderWidth: '2px' }}>Join IEEE</a>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="p-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is the IEEE Power &amp; Energy Society?</h4>
                                            <p className="mb-5 text-muted lh-lg">The mission of IEEE Power &amp; Energy Society is to be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and preferred professional development source of its members.</p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMPE031&refProd=MEMPE031" title="Join IEEE PES" target="_blank" rel="noreferrer" style={{ borderRadius: '0', borderWidth: '2px' }}>Join IEEE PES</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Global Component */}
            <Footer />

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
