'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
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

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.mobileActive : ''}`}>
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            {link.external ? (
                                <a 
                                    href={link.path} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link 
                                    href={link.path} 
                                    className={pathname === link.path ? styles.active : ''}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </li>
                    ))}
                    
                    {/* Show join button inside mobile menu when active */}
                    {isMenuOpen && (
                        <li>
                            <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                                JOIN IEEE <i className="fa fa-arrow-right" aria-hidden="true"></i>
                            </a>
                        </li>
                    )}
                </ul>

                {/* Desktop Join Button */}
                <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                    JOIN IEEE <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </a>

                <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={isMenuOpen ? "fa fa-times" : "fa fa-bars"} aria-hidden="true"></i>
                </button>
            </div>
        </header>
    );
}
