'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/pages/about', label: 'About' },
    { href: '/pages/execom', label: 'Execom' },
    { href: '/pages/initiatives', label: 'Activities' },
    { href: '/pages/upcoming-events', label: 'Events' },
    { href: '/pages/membership-benefits', label: 'Membership' },
    { href: '/pages/gallery', label: 'Gallery' },
    { href: '/pages/resources', label: 'Resources' },
    { href: '/pages/newsletters', label: 'Newsletters' },
    { href: '/pages/contact', label: 'Contact' },
];

const DRAWER_TRANSITION_MS = 300;

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const drawerRef = useRef(null);
    const dragState = useRef({ startX: 0, startY: 0, deltaX: 0, dragging: false, intentChecked: false, startTime: 0 });

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    const resetDrawerInlineStyle = () => {
        if (!drawerRef.current) return;
        drawerRef.current.style.transition = '';
        drawerRef.current.style.transform = '';
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        dragState.current = { startX: touch.clientX, startY: touch.clientY, deltaX: 0, dragging: false, intentChecked: false, startTime: Date.now() };
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - dragState.current.startX;
        const deltaY = touch.clientY - dragState.current.startY;

        if (!dragState.current.intentChecked) {
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;
            dragState.current.intentChecked = true;
            dragState.current.dragging = Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0;
        }

        if (!dragState.current.dragging) return;
        const clampedX = Math.min(0, deltaX);
        dragState.current.deltaX = clampedX;

        if (drawerRef.current) {
            drawerRef.current.style.transition = 'none';
            drawerRef.current.style.transform = `translateX(${clampedX}px)`;
        }
        e.preventDefault();
    };

    const handleTouchEnd = () => {
        if (!dragState.current.dragging) return;
        const elapsed = Math.max(1, Date.now() - dragState.current.startTime);
        const deltaX = dragState.current.deltaX;
        const velocity = Math.abs(deltaX) / elapsed;
        const drawerWidth = drawerRef.current ? drawerRef.current.offsetWidth : 360;
        const shouldClose = Math.abs(deltaX) > drawerWidth * 0.3 || velocity > 0.5;

        if (drawerRef.current) {
            drawerRef.current.style.transition = `transform ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.23, 1, 0.32, 1)`;
            drawerRef.current.style.transform = shouldClose ? 'translateX(-100%)' : 'translateX(0)';
        }

        if (shouldClose) {
            setTimeout(() => {
                setIsMenuOpen(false);
                resetDrawerInlineStyle();
            }, DRAWER_TRANSITION_MS);
        } else {
            setTimeout(resetDrawerInlineStyle, DRAWER_TRANSITION_MS);
        }

        dragState.current.dragging = false;
    };

    return (
        <>
            <style jsx global>{`
                :root {
                    --pes-green: #659b45;
                    --pes-dark: #1a1a1a;
                    --pes-light: #f8f9fa;
                }

                .site-header {
                    background: white;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                /*
                 * The legacy pes-theme stylesheet (a WordPress theme carry-over,
                 * still loaded globally for its fonts/icons) sets
                 * header#header #main-nav to position:absolute, width:100vw,
                 * height:200vh at max-width:991px. It is normally hidden by
                 * Bootstrap's display:none-important utility class, but Bootstrap
                 * loads from an external CDN while the theme CSS loads same-origin,
                 * so on a slow or blocked network the theme rule can win first and
                 * float the nav on top of the logo and hero. Neutralize it here
                 * with a same-specificity, important, network-independent rule
                 * (this stylesheet ships inline with the page).
                 */
                @media (max-width: 991px) {
                    header#header #main-nav {
                        display: none !important;
                        position: static !important;
                        width: auto !important;
                        height: auto !important;
                        inset: auto !important;
                    }
                }

                #meta-nav {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    border-bottom: 1px solid #e5e5e5;
                    padding: 8px 0;
                }

                #meta-nav ul {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                #meta-nav a {
                    font-size: 12px;
                    color: #666;
                    text-decoration: none;
                    transition: all 0.3s ease-out;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                #meta-nav a:hover {
                    color: var(--pes-green);
                    transform: translateX(2px);
                }

                #logo-search {
                    padding: 12px 0;
                }

                #logo {
                    display: flex;
                    align-items: center;
                }

                #logo a {
                    transition: opacity 0.3s ease-out;
                }

                #logo a:hover {
                    opacity: 0.85;
                }

                #logo img {
                    max-height: 70px;
                    width: auto;
                }

                /* Main Navigation */
                #main-nav {
                    border-top: 1px solid #e5e5e5;
                    background: white;
                }

                #nav {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .menu-item {
                    position: relative;
                    margin: 0;
                }

                .menu-item a {
                    display: block;
                    padding: 12px 16px;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--pes-dark);
                    text-decoration: none;
                    transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    position: relative;
                }

                .menu-item a::after {
                    content: '';
                    position: absolute;
                    bottom: 8px;
                    left: 16px;
                    right: 16px;
                    height: 2px;
                    background: var(--pes-green);
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .menu-item a:hover {
                    color: var(--pes-green);
                }

                .menu-item a:hover::after {
                    transform: scaleX(1);
                    transform-origin: left;
                }

                /* Mobile Menu Styling */
                #mobile-menu button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--pes-dark);
                    padding: 8px 12px;
                    transition: all 0.3s ease-out;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                #mobile-menu button:hover {
                    color: var(--pes-green);
                }

                /* Hamburger Animation */
                .fa-bars {
                    display: inline-block;
                    width: 20px;
                    height: 14px;
                    position: relative;
                    transition: transform 0.3s ease-out;
                }

                #mobile-menu button:hover .fa-bars {
                    transform: scale(1.1);
                }

                /* Mobile Navigation Menu */
                #main-nav {
                    transition: all 0.3s ease-out;
                }

                /* Right-side slide-in drawer */
                .nav-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 15, 9, 0.5);
                    z-index: 998;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 300ms ease-out;
                }

                .nav-backdrop.active {
                    opacity: 1;
                    pointer-events: auto;
                }

                .mobile-drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: min(340px, 85vw);
                    background: white;
                    z-index: 999;
                    overflow-y: auto;
                    transform: translateX(100%);
                    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: -12px 0 40px rgba(0, 0, 0, 0.18);
                    padding: 88px 28px 32px;
                    touch-action: pan-y;
                }

                .mobile-drawer.active {
                    transform: translateX(0);
                }

                .mobile-nav-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .mobile-nav-list .menu-item {
                    width: 100%;
                    border-bottom: 1px solid #f0f0f0;
                }

                .mobile-nav-list .menu-item a {
                    padding: 14px 0;
                    font-size: 16px;
                    color: var(--pes-dark);
                    display: block;
                }

                .mobile-nav-list .menu-item a::after {
                    display: none;
                }

                .mobile-nav-list .menu-item a:hover {
                    background: linear-gradient(90deg, var(--pes-green) 0%, transparent 100%);
                    padding-left: 12px;
                    color: var(--pes-green);
                }

                #social-links-mobile {
                    display: flex;
                    gap: 16px;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #f0f0f0;
                }

                #social-links-mobile a {
                    color: var(--pes-green);
                    font-size: 18px;
                    transition: all 0.3s ease-out;
                    text-decoration: none;
                }

                #social-links-mobile a:hover {
                    transform: scale(1.2) translateY(-3px);
                }

                .ieee-logo {
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #f0f0f0;
                    display: block;
                }

                @media (max-width: 768px) {
                    #logo img {
                        max-height: 55px;
                    }

                    #logo-search {
                        padding: 10px 0;
                    }

                    .menu-item a {
                        padding: 12px 12px;
                        font-size: 14px;
                    }

                    #meta-nav ul {
                        gap: 12px;
                        font-size: 11px;
                    }

                    #mobile-menu button {
                        font-size: 12px;
                    }

                    .mobile-drawer {
                        padding: 78px 22px 28px;
                    }
                }

                /* Search button */
                .toggle-search {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    font-size: 12px;
                    color: var(--pes-dark);
                    padding: 8px;
                    transition: all 0.3s ease-out;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }

                .toggle-search:hover {
                    color: var(--pes-green);
                }

                .toggle-search:hover i {
                    transform: scale(1.1) rotate(15deg);
                }

                .toggle-search i {
                    transition: transform 0.3s ease-out;
                }
            `}</style>

            <header id="header" className="site-header" role="banner">
            <div id="meta-nav" className="hidden-xs d-none d-sm-block">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-12">
                            <ul id="meta">
                                <li><a href="https://www.ieee.org/" target="_blank" rel="noreferrer">IEEE.org</a></li>
                                <li><a href="http://ieeexplore.ieee.org/" target="_blank" rel="noreferrer">IEEE <em>Xplore</em> Digital Library</a></li>
                                <li><a href="http://standards.ieee.org/" target="_blank" rel="noreferrer">IEEE Standards</a></li>
                                <li><a href="http://spectrum.ieee.org/" target="_blank" rel="noreferrer">IEEE Spectrum</a></li>
                                <li><a href="https://www.ieee.org/sitemap.html" target="_blank" rel="noreferrer">More Sites</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row align-items-center" id="logo-search">
                    <div id="mobile-menu" className={`col-sm-2 col-xs-2 col-2 d-lg-none ${isMenuOpen ? 'active' : ''}`}>
                        <button onClick={() => setIsMenuOpen(true)}>
                            <i className="fa fa-bars" aria-hidden="true"></i> <span>MENU</span>
                        </button>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 col-8" id="logo" role="logo">
                        <Link href="/" title="IEEE PES Kerala Chapter" className="d-flex align-items-center">
                            <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={320} height={100} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-12 text-end text-right d-none d-lg-flex align-items-center justify-content-end" id="search">
                        <div className="row search-block justify-content-end w-100 mt-3 mt-md-0">
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 col-12 logo-ieee-block">
                                <a href="https://www.ieee.org/" target="_blank" id="logo-ieee" rel="noreferrer"><img src="/pes-theme/images/logo-ieee.png" alt="IEEE" className="lazyload img-fluid" /></a>
                            </div>
                        </div>
                    </div>
                    <div id="mobile-search" className="col-sm-2 col-xs-2 col-2 d-lg-none text-end text-right">
                        <button className="toggle-search"><span>SEARCH</span> <i className="fa fa-search" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>

            {/* Desktop navigation */}
            <div id="main-nav" className="d-none d-lg-block">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-12" role="navigation">
                            <ul id="nav" className="list-unstyled mb-0 d-flex justify-content-center align-items-center" style={{ flexWrap: 'wrap', gap: '5px' }}>
                                {NAV_LINKS.map(link => (
                                    <li className="menu-item py-2 px-2" key={link.href}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                                <li className="menu-item py-2 px-2">
                                    <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer">Join IEEE</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile right-side drawer — dismiss via backdrop tap, Escape, or swiping left */}
            <div
                className={`nav-backdrop d-lg-none ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            ></div>
            <nav
                ref={drawerRef}
                className={`mobile-drawer d-lg-none ${isMenuOpen ? 'active' : ''}`}
                aria-hidden={!isMenuOpen}
                role="navigation"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <ul className="mobile-nav-list">
                    {NAV_LINKS.map(link => (
                        <li className="menu-item py-2 px-2" key={link.href}>
                            <Link href={link.href} onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
                        </li>
                    ))}
                    <li className="menu-item py-2 px-2">
                        <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Join IEEE</a>
                    </li>
                </ul>

                <a href="https://www.ieee.org/" target="_blank" rel="noreferrer" className="ieee-logo">
                    <img src="/pes-theme/images/logo-ieee.png" alt="IEEE Logo" className="img-fluid" style={{ maxWidth: '140px' }} />
                </a>
                <div id="social-links-mobile">
                    <a href="https://ieee-collabratec.ieee.org/" className="ico-collabratec" target="_blank" rel="noreferrer"></a>
                    <a href="https://lnkd.in/gkDTj47k" target="_blank" rel="noreferrer"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                    <a href="https://lnkd.in/gSJJzeUA" target="_blank" rel="noreferrer"><i className="fa fa-facebook" aria-hidden="true"></i></a>
                    <a href="https://lnkd.in/gncy6jUc" target="_blank" rel="noreferrer"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
                    <a href="https://lnkd.in/gqyuMs_F" target="_blank" rel="noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                    <a href="https://lnkd.in/gVR7dmtZ" target="_blank" rel="noreferrer"><i className="fa fa-whatsapp" aria-hidden="true"></i></a>
                </div>
            </nav>
        </header>
        </>
    );
}
