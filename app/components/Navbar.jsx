'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
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
                    <div id="mobile-menu" className="col-sm-2 col-xs-2 col-2 d-sm-none">
                        <button><i className="fa fa-bars" aria-hidden="true"></i> <span>MENU</span></button>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 col-8" id="logo" role="logo">
                        <Link href="/" title="IEEE PES Kerala Chapter" className="d-flex align-items-center">
                            <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={320} height={100} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-12 text-end text-right d-none d-md-block d-flex align-items-center justify-content-end" id="search">
                        <div className="row search-block justify-content-end w-100 mt-3 mt-md-0">
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 col-12 logo-ieee-block">
                                <a href="https://www.ieee.org/" target="_blank" id="logo-ieee" rel="noreferrer"><img src="/pes-theme/images/logo-ieee.png" alt="IEEE" className="lazyload img-fluid" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="main-nav" className="d-none d-md-block hidden-sm hidden-xs pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-12" role="navigation">
                            <ul id="nav" className="d-flex justify-content-center align-items-center list-unstyled mb-0" style={{ flexWrap: 'wrap', gap: '5px' }}>
                                <li className="menu-item py-2 px-2"><Link href="/" style={{ textDecoration: 'none' }}>Home</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/about" style={{ textDecoration: 'none' }}>About</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/execom" style={{ textDecoration: 'none' }}>Execom</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/initiatives" style={{ textDecoration: 'none' }}>Activities</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/upcoming-events" style={{ textDecoration: 'none' }}>Events</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/membership-benefits" style={{ textDecoration: 'none' }}>Membership</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/gallery" style={{ textDecoration: 'none' }}>Gallery</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/resources" style={{ textDecoration: 'none' }}>Resources</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/newsletters" style={{ textDecoration: 'none' }}>Newsletters</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/contact" style={{ textDecoration: 'none' }}>Contact</Link></li>
                                <li className="menu-item py-2 px-2"><a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>Join IEEE</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
