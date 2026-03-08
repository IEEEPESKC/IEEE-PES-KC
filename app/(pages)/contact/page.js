'use client';
import PageLayout from '../../components/PageLayout';
import PageBanner from '../../components/PageBanner';
import { useState } from 'react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
    }

    const contactDetails = [
        { icon: 'ri-mail-line', label: 'Email', value: 'ieeepes.kerala@ieee.org', link: 'mailto:ieeepes.kerala@ieee.org' },
        { icon: 'ri-phone-line', label: 'Phone', value: '+91 94461 89453', link: 'tel:+919446189453' },
        { icon: 'ri-map-pin-2-line', label: 'Address', value: 'HarmonIEEE, 1st Floor, Cherian\'s Square, Thiruvananthapuram, Kerala 695001', link: null },
    ];

    const socials = [
        { icon: 'ri-linkedin-fill', label: 'LinkedIn', link: 'https://www.linkedin.com/company/ieee-pes-kerala/' },
        { icon: 'ri-instagram-line', label: 'Instagram', link: 'https://www.instagram.com/ieeepeskerala/' },
        { icon: 'ri-facebook-fill', label: 'Facebook', link: 'https://www.facebook.com/ieeepeskerala' },
        { icon: 'ri-twitter-x-line', label: 'X (Twitter)', link: 'https://twitter.com/ieeepeskerala' },
        { icon: 'ri-whatsapp-line', label: 'WhatsApp', link: 'https://whatsapp.com/channel/0029VajmXb82ER6ZqI0P8R1I' },
    ];

    return (
        <PageLayout>
            <PageBanner
                title="Contact Us"
                subtitle="Get in Touch"
                breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            />

            <section className="section-padding">
                <div className="container">
                    <div className="row g-5">
                        {/* Info */}
                        <div className="col-lg-4">
                            <h3 style={{ color: 'var(--header-color)', marginBottom: 24 }}>Reach Out to Us</h3>
                            <p style={{ color: '#666', marginBottom: 32 }}>
                                Whether you have a question, a collaboration idea, or want to volunteer — we&apos;d love to hear from you. Our team typically responds within 2 business days.
                            </p>

                            <div className="d-flex flex-column gap-4 mb-4">
                                {contactDetails.map((c, i) => (
                                    <div key={i} className="d-flex gap-3 align-items-start">
                                        <div className="icon-box flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 14, fontSize: 22 }}>
                                            <i className={c.icon}></i>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 4 }}>{c.label}</div>
                                            {c.link ? <a href={c.link} style={{ color: 'var(--header-color)', fontWeight: 500 }}>{c.value}</a> : <span style={{ color: 'var(--header-color)' }}>{c.value}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p style={{ fontWeight: 700, marginBottom: 12 }}>Follow us on Social Media</p>
                                <div className="d-flex gap-2 flex-wrap">
                                    {socials.map((s, i) => (
                                        <a key={i} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label} className="social-link-v" style={{ width: 44, height: 44, fontSize: 18 }}>
                                            <i className={s.icon}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="col-lg-8">
                            {submitted ? (
                                <div className="update-box text-center" style={{ padding: 60 }}>
                                    <i className="ri-checkbox-circle-line" style={{ fontSize: 64, color: 'var(--pes-green)', display: 'block', marginBottom: 16 }}></i>
                                    <h3 style={{ color: 'var(--header-color)' }}>Message Sent!</h3>
                                    <p style={{ color: '#666' }}>Thank you for reaching out. We&apos;ll get back to you within 2 business days.</p>
                                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-green mt-3" style={{ border: 'none', cursor: 'pointer' }}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="update-box">
                                    <h3 style={{ color: 'var(--header-color)', marginBottom: 24 }}>Send a Message</h3>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block' }} htmlFor="name">Your Name *</label>
                                            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 15, outline: 'none' }} placeholder="John Doe" />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block' }} htmlFor="email">Email Address *</label>
                                            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 15, outline: 'none' }} placeholder="you@email.com" />
                                        </div>
                                        <div className="col-12">
                                            <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block' }} htmlFor="subject">Subject *</label>
                                            <input id="subject" name="subject" type="text" required value={form.subject} onChange={handleChange}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 15, outline: 'none' }} placeholder="e.g. Collaboration Inquiry" />
                                        </div>
                                        <div className="col-12">
                                            <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block' }} htmlFor="message">Message *</label>
                                            <textarea id="message" name="message" rows={6} required value={form.message} onChange={handleChange}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 15, outline: 'none', resize: 'vertical' }} placeholder="Write your message here..." />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn-green" style={{ border: 'none', cursor: 'pointer', fontSize: 15 }}>
                                                Send Message <i className="ri-send-plane-line ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
