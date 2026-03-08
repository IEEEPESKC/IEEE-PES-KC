'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <header>
            {/* Top Bar */}
            <div className="header-top-bar">
                <div className="container-fluid px-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                            <a href="https://www.ieee.org/" target="_blank" rel="noreferrer"><i className="fa-solid fa-house me-1"></i> IEEE.org</a>
                            <a href="https://ieeexplore.ieee.org/" target="_blank" rel="noreferrer" className="topBar-item-border">IEEE Xplore</a>
                            <a href="https://standards.ieee.org/" target="_blank" rel="noreferrer" className="topBar-item-border d-none d-md-inline">IEEE Standards</a>
                            <a href="https://ieeekerala.org/" target="_blank" rel="noreferrer" className="topBar-item-border d-none d-lg-inline">IEEE Kerala Section</a>
                            <a href="https://ieeeindiacouncil.org/" target="_blank" rel="noreferrer" className="topBar-item-border d-none d-lg-inline">IEEE India Council</a>
                            <a href="https://ieee-pes.org/" target="_blank" rel="noreferrer" className="topBar-item-border d-none d-lg-inline">IEEE PES</a>
                        </div>
                        <div className="social-icons-header d-none d-md-block">
                            <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="https://www.instagram.com/ieeepeskerala/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://www.facebook.com/ieeepeskerala" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="https://twitter.com/ieeepeskerala" target="_blank" rel="noreferrer" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
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
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link href="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">About</a>
                                <ul className="dropdown-menu">
                                    <li><Link href="app/(pages)/about/page.js" className="dropdown-item">About IEEE PES</Link></li>
                                    <li><Link href="/vision-mission" className="dropdown-item">Vision &amp; Mission</Link></li>
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
                                    <li><Link href="/student-branches" className="dropdown-item">Student Branch Chapters</Link></li>
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
                                    <li><Link href="/membership-benefits" className="dropdown-item">Membership Benefits</Link></li>
                                    <li><a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noreferrer" className="dropdown-item">Join IEEE</a></li>
                                    <li><a href="https://ieee-pes.org/membership/" target="_blank" rel="noreferrer" className="dropdown-item">Join IEEE PES</a></li>
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
                    <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noreferrer" className="btn-green d-none d-lg-inline-flex">
                        Join IEEE <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </nav>
        </header>
    );
}
