'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/pages/about' },
    { name: 'EXCOM', path: '/pages/execom' },
    { name: 'ACTIVITIES', path: '/pages/initiatives' },
    { name: 'EVENTS', path: '/pages/upcoming-events' },
    { name: 'MEMBERSHIP', path: '/pages/membership-benefits' },
    { name: 'GALLERY', path: '/pages/gallery' },
    { name: 'RESOURCES', path: '/pages/resources' },
    { name: 'NEWSLETTERS', path: '/pages/newsletters' },
    { name: 'CONTACT', path: '/pages/contact' },
];

const DRAWER_TRANSITION_MS = 300;

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
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
        <header className={styles.navbarContainer} role="banner">
            {/* IEEE Global Ribbon */}
            <div className={styles.ieeeRibbon}>
                <ul className={styles.ribbonLinks}>
                    <li><a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer">IEEE.org</a></li>
                    <li><a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener noreferrer">IEEE <em>Xplore</em></a></li>
                    <li><a href="https://standards.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Standards</a></li>
                    <li><a href="https://spectrum.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Spectrum</a></li>
                    <li><a href="https://www.ieee.org/sitemap.html" target="_blank" rel="noopener noreferrer">More Sites</a></li>
                </ul>
            </div>

            {/* Main Navbar */}
            <div className={styles.mainNav}>
                <div className={styles.logoContainer}>
                    <Link href="/" title="IEEE PES Kerala Chapter">
                        <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={250} height={70} style={{ objectFit: 'contain' }} className={styles.logoImage} />
                    </Link>
                </div>

                <ul className={styles.navLinks}>
                    {NAV_LINKS.map(link => (
                        <li key={link.path}>
                            <Link href={link.path} className={pathname === link.path ? styles.active : ''}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                    JOIN IEEE <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </a>

                <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </button>
            </div>

            {/* Mobile right-side drawer — dismiss via backdrop tap, Escape, or swiping left */}
            <div
                className={`${styles.navBackdrop} ${isMenuOpen ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            ></div>
            <nav
                ref={drawerRef}
                className={`${styles.mobileDrawer} ${isMenuOpen ? styles.active : ''}`}
                aria-hidden={!isMenuOpen}
                role="navigation"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <ul className={styles.mobileNavList}>
                    {NAV_LINKS.map(link => (
                        <li key={link.path}>
                            <Link
                                href={link.path}
                                className={pathname === link.path ? styles.active : ''}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className={styles.joinBtn} onClick={() => setIsMenuOpen(false)}>
                            JOIN IEEE <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
