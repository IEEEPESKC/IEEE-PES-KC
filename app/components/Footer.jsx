import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-brand">
                            <Image src="/images/ieee-images/PESKC.png" alt="IEEE PES Kerala" width={150} height={50} style={{ objectFit: 'contain' }} />
                            <p>The IEEE Power and Energy Society Kerala Chapter is dedicated to advancing technology for the benefit of humanity through power and energy innovation.</p>
                            <div className="footer-social">
                                <a href="https://www.linkedin.com/company/ieee-pes-kerala/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
                                <a href="https://www.facebook.com/ieeepeskerala" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
                                <a href="https://www.instagram.com/ieeepeskerala/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
                                <a href="https://twitter.com/ieeepeskerala" target="_blank" rel="noreferrer" aria-label="X (Twitter)"><i className="ri-twitter-x-line"></i></a>
                                <a href="https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I" target="_blank" rel="noreferrer" aria-label="WhatsApp Channel"><i className="ri-whatsapp-line"></i></a>
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
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-6 col-6">
                        <h4 className="footer-heading">Get Started</h4>
                        <ul className="footer-links">
                            <li><a href="https://www.ieee.org/" target="_blank" rel="noreferrer">IEEE</a></li>
                            <li><a href="https://ieee-pes.org/" target="_blank" rel="noreferrer">IEEE PES</a></li>
                            <li><a href="https://ieeekerala.org/" target="_blank" rel="noreferrer">IEEE Kerala Section</a></li>
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
                            <p>© 2025 <a href="https://ieeekerala.org/" target="_blank" rel="noreferrer">IEEE Kerala Section</a>. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p>Web Team - IEEE PES Kerala Chapter</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
