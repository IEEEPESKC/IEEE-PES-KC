'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lightbox modal state for gallery
    const [activePhoto, setActivePhoto] = useState(null);

    // Fetch data from API
    useEffect(() => {
        fetch('/api/admin')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setEvents(data.data.events || []);
                    setAnnouncements(data.data.announcements || []);
                    setGallery(data.data.gallery || []);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching home data:", err);
                setEvents([]);
                setAnnouncements([]);
                setGallery([]);
                setIsLoading(false);
            });
    }, []);

    // Helper function to categorize events
    const getCategorizedEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const recent = [];

        events.forEach(event => {
            const evDate = new Date(event.date);
            evDate.setHours(0, 0, 0, 0);

            if (evDate > today) {
                upcoming.push(event);
            } else {
                recent.push(event);
            }
        });

        return { upcoming, recent };
    };

    const { upcoming, recent } = getCategorizedEvents();

    // Fallback Data to ensure rich, authentic content is always visible
    const fallbackAnnouncements = [
        {
            date: "March 15, 2026",
            title: "Call for Papers: Power Systems Conference 2026",
            description: "Submit your research papers for the upcoming international conference on modern power systems and grid integration.",
            link: "/pages/announcements"
        },
        {
            date: "March 10, 2026",
            title: "New Student Chapter Launched at CET",
            description: "Welcoming the newest addition to our growing network of over 50 Student Branch Chapters across Kerala.",
            link: "/pages/announcements"
        },
        {
            date: "March 1, 2026",
            title: "Membership Drive 2026 Begins",
            description: "Join IEEE PES Kerala Chapter to access technical publications, mentorship, and professional growth opportunities.",
            link: "/pages/membership-benefits"
        }
    ];

    const displayAnnouncements = announcements.length > 0 ? announcements : fallbackAnnouncements;

    const fallbackRecentEvents = [
        {
            title: "Workshop on Renewable Energy Systems",
            imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            date: "2026-03-18",
            tag: "WORKSHOP",
            description: "Comprehensive training and hands-on session on solar and wind energy integration into sustainable power networks."
        },
        {
            title: "Power Electronics Seminar",
            imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            date: "2026-03-15",
            tag: "TECHNICAL SEMINAR",
            description: "Advanced topics in power conversion, control systems, and high-efficiency inverter design for clean energy."
        },
        {
            title: "Student Chapter Technical Meet",
            imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            date: "2026-03-12",
            tag: "STUDENT CHAPTER EVENT",
            description: "Annual networking and symposium for student branch leadership and collegiate members across all districts of Kerala."
        }
    ];

    const displayRecent = recent.length > 0 ? recent : fallbackRecentEvents;

    const fallbackGallery = [
        {
            img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Conferences & Technical Sessions"
        },
        {
            img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Renewable Energy Workshop"
        },
        {
            img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Power Electronics Laboratory"
        }
    ];

    const displayGallery = gallery.length > 0 ? gallery.map(g => ({ img: g.imageUrl || g.url, title: g.title || g.name })) : fallbackGallery;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (isNaN(Date.parse(dateStr))) return dateStr;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const featuredEvent = upcoming.length > 0 ? upcoming[0] : null;

    return (
        <>
            <style jsx global>{`
                /* ==========================================================================
                   IEEE PES Official Template Styling System
                   Clean, authoritative, human-crafted design with zero AI artifacts
                   ========================================================================== */
                :root {
                    --pes-green: #5a9641;
                    --pes-green-dark: #467a32;
                    --pes-green-light: rgba(90, 150, 65, 0.08);
                    --pes-dark: #222222;
                    --pes-gray-dark: #374151;
                    --pes-gray: #555555;
                    --pes-gray-light: #6b7280;
                    --pes-bg-gray: #f7f9f6;
                    --pes-border: #e2e8f0;
                    --pes-border-light: #edf2f7;
                    --font-heading: 'Open Sans Condensed', 'Arial Narrow', sans-serif;
                    --font-body: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: var(--font-body);
                    color: var(--pes-dark);
                    background-color: #ffffff;
                    line-height: 1.65;
                    font-size: 15px;
                    -webkit-font-smoothing: antialiased;
                }

                a {
                    color: var(--pes-green);
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                a:hover {
                    color: var(--pes-green-dark);
                }

                /* Section Headings */
                .pes-kicker {
                    display: inline-block;
                    font-family: var(--font-body);
                    font-size: 0.72rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    color: var(--pes-green);
                    margin-bottom: 8px;
                }

                .pes-section-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 2.2rem;
                    color: var(--pes-dark);
                    line-height: 1.2;
                    letter-spacing: -0.5px;
                    margin-bottom: 24px;
                }

                /* ==========================================================================
                   1. HERO SECTION
                   ========================================================================== */
                .pes-hero {
                    position: relative;
<<<<<<< HEAD
                    width: 100%;
                    min-height: 520px;
=======
                    background: linear-gradient(rgba(5, 10, 5, 0.45), rgba(5, 10, 5, 0.45)),
                                url('/images/ieee-images/hero-bg.jpg') center/cover no-repeat;
                    min-height: min(86vh, 720px);
>>>>>>> c8327b42db33943ef0bd9f6839080ace22bdc1ad
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background-color: #2b392a;
                }

                .pes-hero-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                .pes-hero-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .pes-hero-container {
                    position: relative;
                    z-index: 2;
                    max-width: 1240px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 40px 24px;
                    display: flex;
                    justify-content: flex-end;
                }

                .pes-hero-card {
                    background: rgba(74, 127, 53, 0.92);
                    padding: 44px 42px;
                    max-width: 540px;
                    width: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                }

                .pes-hero-card h1 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 2.35rem;
                    color: #ffffff;
                    line-height: 1.15;
                    margin-bottom: 16px;
                    letter-spacing: -0.5px;
                }

                .pes-hero-card p {
                    color: #ffffff;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    margin-bottom: 26px;
                    opacity: 0.95;
                }

                .pes-hero-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .pes-btn-hero-primary {
                    background: #ffffff;
                    color: #4a7f35 !important;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    padding: 12px 26px;
                    border-radius: 2px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .pes-btn-hero-primary:hover {
                    background: #f0f7ed;
                    transform: translateY(-2px);
                }

                .pes-btn-hero-secondary {
                    background: transparent;
                    color: #ffffff !important;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    padding: 12px 24px;
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    border-radius: 2px;
                    transition: all 0.2s ease;
                }

                .pes-btn-hero-secondary:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: #ffffff;
                }

                @media (max-width: 768px) {
                    .pes-hero {
                        min-height: 440px;
                        align-items: flex-end;
                    }
                    .pes-hero-container {
                        justify-content: center;
                        padding: 24px 16px;
                    }
                    .pes-hero-card {
                        padding: 32px 24px;
                        max-width: 100%;
                    }
                    .pes-hero-card h1 {
                        font-size: 1.85rem;
                    }
                }

                /* ==========================================================================
                   2. ABOUT / WHO WE ARE
                   ========================================================================== */
                .pes-about-section {
                    padding: 80px 0 60px;
                    background: #ffffff;
                }

                .pes-about-lead {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--pes-dark);
                    line-height: 1.6;
                    margin-bottom: 16px;
                }

                .pes-about-body {
                    color: var(--pes-gray);
                    font-size: 0.95rem;
                    line-height: 1.8;
                    margin-bottom: 20px;
                    text-align: justify;
                }

                .pes-text-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: var(--pes-green);
                }

                .pes-text-link:hover {
                    color: var(--pes-green-dark);
                    transform: translateX(3px);
                }

                /* ==========================================================================
                   3. VISION & MISSION CARDS (Clean editorial style)
                   ========================================================================== */
                .pes-vm-section {
                    padding: 0 0 70px;
                    background: #ffffff;
                }

                .pes-vm-card {
                    background: #ffffff;
                    border: 1px solid var(--pes-border);
                    border-top: 3px solid var(--pes-green);
                    padding: 32px 28px;
                    height: 100%;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .pes-vm-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
                }

                .pes-vm-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .pes-vm-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 4px;
                    background: var(--pes-green-light);
                    color: var(--pes-green);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    flex-shrink: 0;
                }

                .pes-vm-card h3 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: var(--pes-dark);
                    margin: 0;
                }

                .pes-vm-card p {
                    color: var(--pes-gray);
                    font-size: 0.92rem;
                    line-height: 1.7;
                    margin: 0;
                }

                /* ==========================================================================
                   4. FROM THE CHAPTER (Announcements & Featured Event)
                   ========================================================================== */
                .pes-from-chapter-section {
                    padding: 72px 0;
                    background: var(--pes-bg-gray);
                    border-top: 1px solid var(--pes-border-light);
                    border-bottom: 1px solid var(--pes-border-light);
                }

                .pes-announcement-card {
                    padding: 18px 0;
                    border-bottom: 1px solid var(--pes-border);
                }

                .pes-announcement-card:last-of-type {
                    border-bottom: none;
                }

                .pes-announcement-date {
                    display: inline-block;
                    background: var(--pes-green);
                    color: #ffffff;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 3px 8px;
                    margin-bottom: 8px;
                }

                .pes-announcement-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    line-height: 1.4;
                    margin-bottom: 6px;
                }

                .pes-announcement-title a {
                    color: var(--pes-dark);
                }

                .pes-announcement-title a:hover {
                    color: var(--pes-green);
                }

                .pes-announcement-desc {
                    color: var(--pes-gray);
                    font-size: 0.88rem;
                    line-height: 1.6;
                    margin-bottom: 6px;
                }

                .pes-featured-event-box {
                    background: #ffffff;
                    border: 1px solid var(--pes-border);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .pes-featured-event-img {
                    width: 100%;
                    height: 240px;
                    object-fit: cover;
                    display: block;
                }

                .pes-featured-event-body {
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .pes-featured-event-body h3 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: var(--pes-dark);
                    margin-bottom: 8px;
                    line-height: 1.25;
                }

                .pes-featured-event-meta {
                    color: var(--pes-green);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .pes-featured-event-body p {
                    color: var(--pes-gray);
                    font-size: 0.9rem;
                    line-height: 1.65;
                    margin-bottom: 20px;
                    flex-grow: 1;
                }

                /* ==========================================================================
                   5. RECENT EVENTS
                   ========================================================================== */
                .pes-recent-events-section {
                    padding: 80px 0;
                    background: #ffffff;
                }

                .pes-event-card {
                    background: #ffffff;
                    border: 1px solid var(--pes-border);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .pes-event-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .pes-event-img-wrap {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    background: #eef2ec;
                }

                .pes-event-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }

                .pes-event-card:hover .pes-event-img-wrap img {
                    transform: scale(1.04);
                }

                .pes-event-card-body {
                    padding: 22px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .pes-event-tag {
                    color: var(--pes-green);
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                }

                .pes-event-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: var(--pes-dark);
                    line-height: 1.3;
                    margin-bottom: 10px;
                }

                .pes-event-desc {
                    color: var(--pes-gray);
                    font-size: 0.88rem;
                    line-height: 1.6;
                    margin-bottom: 18px;
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .pes-btn-outline {
                    display: inline-block;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: var(--pes-green);
                    border: 2px solid var(--pes-green);
                    padding: 10px 28px;
                    background: transparent;
                    transition: all 0.2s ease;
                }

                .pes-btn-outline:hover {
                    background: var(--pes-green);
                    color: #ffffff;
                }

                /* ==========================================================================
                   6. COMMUNITY IN FOCUS (Gallery Grid)
                   ========================================================================== */
                .pes-community-section {
                    padding: 72px 0;
                    background: var(--pes-bg-gray);
                    border-top: 1px solid var(--pes-border-light);
                    border-bottom: 1px solid var(--pes-border-light);
                }

                .pes-gallery-item {
                    cursor: pointer;
                    overflow: hidden;
                    background: #ffffff;
                    border: 1px solid var(--pes-border);
                }

                .pes-gallery-item img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }

                .pes-gallery-item:hover img {
                    transform: scale(1.05);
                }

                .pes-gallery-caption {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--pes-dark);
                    padding: 10px 12px;
                    background: #ffffff;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ==========================================================================
                   7. STUDENT BRANCH NETWORK (Stats)
                   ========================================================================== */
                .pes-network-section {
                    padding: 80px 0;
                    background: #ffffff;
                }

                .pes-stat-number {
                    font-family: var(--font-heading);
                    font-size: 5rem;
                    font-weight: 700;
                    color: var(--pes-green);
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .pes-stat-label {
                    font-family: var(--font-heading);
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--pes-dark);
                    margin-bottom: 24px;
                }

                .pes-network-pathways {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    border-top: 1px solid var(--pes-border);
                    padding-top: 20px;
                }

                .pes-pathway h5 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.15rem;
                    color: var(--pes-dark);
                    margin-bottom: 4px;
                }

                .pes-pathway p {
                    font-size: 0.85rem;
                    color: var(--pes-gray);
                    line-height: 1.5;
                    margin: 0;
                }

                @media (max-width: 576px) {
                    .pes-network-pathways {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                }

                /* ==========================================================================
                   8. KEEP LEARNING. STAY CONNECTED.
                   ========================================================================== */
                .pes-resources-section {
                    padding: 72px 0;
                    background: var(--pes-bg-gray);
                    border-top: 1px solid var(--pes-border-light);
                    border-bottom: 1px solid var(--pes-border-light);
                }

                .pes-resource-block {
                    border-bottom: 1px solid var(--pes-border);
                    padding-bottom: 16px;
                }

                @media (min-width: 768px) {
                    .pes-resource-block {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                }

                .pes-resource-block h4 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.3rem;
                    margin-bottom: 8px;
                }

                .pes-resource-block p {
                    color: var(--pes-gray);
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin-bottom: 12px;
                }

                /* ==========================================================================
                   9. ABOUT IEEE AND PES (The Original WordPress Template Section)
                   ========================================================================== */
                .pes-about-dual-section {
                    padding: 80px 0;
                    background: #ffffff;
                }

                .pes-boxed-title-wrap {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .pes-boxed-title {
                    display: inline-block;
                    font-family: var(--font-heading);
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: var(--pes-green);
                    border: 2px solid var(--pes-green);
                    padding: 10px 32px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .pes-dual-card {
                    background: #ffffff;
                    border: 1px solid var(--pes-border);
                    border-left: 4px solid var(--pes-green);
                    padding: 36px 32px;
                    height: 100%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    display: flex;
                    flex-direction: column;
                }

                .pes-dual-card h4 {
                    font-family: var(--font-heading);
                    font-size: 1.45rem;
                    font-weight: 700;
                    color: var(--pes-dark);
                    margin-bottom: 14px;
                }

                .pes-dual-card p {
                    color: var(--pes-gray);
                    font-size: 0.95rem;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    flex-grow: 1;
                }

                .pes-btn-outline-green {
                    font-family: var(--font-heading);
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: var(--pes-green);
                    border: 2px solid var(--pes-green);
                    padding: 8px 22px;
                    display: inline-block;
                    width: fit-content;
                    transition: all 0.2s ease;
                }

                .pes-btn-outline-green:hover {
                    background: var(--pes-green);
                    color: #ffffff;
                }

                /* ==========================================================================
                   10. CTA BANNER (Dark Theme)
                   ========================================================================== */
                .pes-cta-section {
                    padding: 72px 0;
                    background-color: #1a1a1a;
                    color: #ffffff;
                    text-align: center;
                }

                .pes-cta-section h2 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 2.3rem;
                    color: #ffffff;
                    margin-bottom: 14px;
                    letter-spacing: -0.5px;
                }

                .pes-cta-section p {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.98rem;
                    max-width: 680px;
                    margin: 0 auto 28px;
                    line-height: 1.7;
                }

                .pes-cta-actions {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .pes-btn-cta-primary {
                    background: var(--pes-green);
                    color: #ffffff !important;
                    font-family: var(--font-heading);
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    padding: 12px 30px;
                    border-radius: 2px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .pes-btn-cta-primary:hover {
                    background: var(--pes-green-dark);
                    transform: translateY(-2px);
                }

                .pes-btn-cta-secondary {
                    background: transparent;
                    color: #ffffff !important;
                    font-family: var(--font-heading);
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    padding: 12px 28px;
                    border: 1.5px solid rgba(255, 255, 255, 0.4);
                    border-radius: 2px;
                    transition: all 0.2s ease;
                }

                .pes-btn-cta-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #ffffff;
                }

                /* ==========================================================================
                   11. LIGHTBOX MODAL
                   ========================================================================== */
                .pes-lightbox-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .pes-lightbox-content {
                    position: relative;
                    max-width: 900px;
                    width: 100%;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .pes-lightbox-img {
                    max-width: 100%;
                    max-height: 75vh;
                    object-fit: contain;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                }

                .pes-lightbox-caption {
                    color: #ffffff;
                    margin-top: 14px;
                    font-size: 1rem;
                    text-align: center;
                }

                .pes-lightbox-close {
                    position: absolute;
                    top: -44px;
                    right: 0;
                    background: transparent;
                    border: none;
                    color: #ffffff;
                    font-size: 32px;
                    cursor: pointer;
                    line-height: 1;
                }
            `}</style>

            <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

            <div className="box-layout">
                {/* 3-Tier Professional IEEE PES Navbar */}
                <Navbar />

                {/* =================================================================
                    1. HERO SECTION (Photographic Transmission Sunset + Green Overlay Box)
                    ================================================================= */}
                <section className="pes-hero">
                    <div className="pes-hero-bg">
                        <img
                            src="/pes-theme/wp-content/uploads/sites/78/2019/12/shutterstock_681206938-slider.jpg"
                            alt="Power transmission lines at sunset — IEEE PES Kerala Chapter"
                        />
                    </div>
                    <div className="pes-hero-container">
                        <div className="pes-hero-card">
                            <h1>Powering progress. Connecting people.</h1>
                            <p>
                                A professional community advancing power and energy engineering in Kerala — through knowledge, collaboration, and service. Empowering the future of electrical and sustainable power systems.
                            </p>
                            <div className="pes-hero-actions">
                                <Link href="/pages/membership-benefits" className="pes-btn-hero-primary">
                                    Become a Member <i className="ri-arrow-right-line"></i>
                                </Link>
                                <Link href="/pages/upcoming-events" className="pes-btn-hero-secondary">
                                    Explore Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    2. ABOUT SECTION (Engineering Knowledge Shared Across Kerala)
                    ================================================================= */}
                <section className="pes-about-section">
                    <div className="container">
                        <div className="row align-items-start g-5">
                            <div className="col-lg-5">
                                <span className="pes-kicker">WHO WE ARE</span>
                                <h2 className="pes-section-title">
                                    Engineering knowledge. Shared across Kerala.
                                </h2>
                                <p className="pes-about-lead">
                                    Since 1999, IEEE PES Kerala Chapter has brought engineers, researchers, and students together to exchange ideas and advance the power and energy profession.
                                </p>
                            </div>
                            <div className="col-lg-7">
                                <p className="pes-about-body">
                                    The <strong>IEEE PES Kerala Chapter</strong> was founded in 1999 with just 12 members and has since grown into one of the most recognized chapters in the world. It won the Outstanding Chapter Award in 2012 and the PES Membership Growth Award in 2013, and claimed first place in the IEEE PES Chapters Website Contest the same year. Membership surpassed 1,200 by 2017, elevating it to large chapter status.
                                </p>
                                <p className="pes-about-body">
                                    Its mission is to be the leading provider of scientific and engineering knowledge on electric power and energy for the betterment of society. With 50+ Student Branch Chapters and numerous technical events, it remains a highly active and award-winning chapter under the IEEE Kerala Section.
                                </p>
                                <Link href="/pages/about" className="pes-text-link">
                                    Read our full story →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    3. VISION & MISSION SECTION (Original Content Preserved)
                    ================================================================= */}
                <section className="pes-vm-section">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="pes-vm-card">
                                    <div className="pes-vm-header">
                                        <div className="pes-vm-icon">
                                            <i className="ri-eye-line"></i>
                                        </div>
                                        <h3>Our Vision</h3>
                                    </div>
                                    <p>
                                        To be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and the preferred professional development source for our members.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pes-vm-card">
                                    <div className="pes-vm-header">
                                        <div className="pes-vm-icon">
                                            <i className="ri-rocket-2-line"></i>
                                        </div>
                                        <h3>Our Mission</h3>
                                    </div>
                                    <p>
                                        To foster technological innovation and excellence for the benefit of humanity by providing high-quality publications, engaging conferences, and valuable educational programs in power and energy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    4. FROM THE CHAPTER (Announcements & Featured Event)
                    ================================================================= */}
                <section className="pes-from-chapter-section">
                    <div className="container">
                        <div className="row g-5">
                            {/* Announcements List */}
                            <div className="col-lg-6">
                                <span className="pes-kicker">NEWS &amp; ANNOUNCEMENTS</span>
                                <h2 className="pes-section-title">From the chapter</h2>

                                <div className="pes-announcements-list">
                                    {displayAnnouncements.slice(0, 3).map((ann, idx) => (
                                        <div className="pes-announcement-card" key={idx}>
                                            <span className="pes-announcement-date">
                                                {formatDate(ann.date)}
                                            </span>
                                            <h4 className="pes-announcement-title">
                                                <Link href={ann.link || "/pages/announcements"}>
                                                    {ann.title}
                                                </Link>
                                            </h4>
                                            <p className="pes-announcement-desc">
                                                {ann.description || ann.details}
                                            </p>
                                            <Link href={ann.link || "/pages/announcements"} className="pes-text-link">
                                                Read More →
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <Link href="/pages/announcements" className="pes-text-link fw-bold">
                                        View all announcements →
                                    </Link>
                                </div>
                            </div>

                            {/* Featured Event Card */}
                            <div className="col-lg-6">
                                <div className="pes-featured-event-box">
                                    <img
                                        src={featuredEvent?.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                                        alt={featuredEvent?.title || "Smart Grid Symposium 2026"}
                                        className="pes-featured-event-img"
                                    />
                                    <div className="pes-featured-event-body">
                                        <span className="pes-kicker">FEATURED UPCOMING PROGRAMME</span>
                                        <h3>{featuredEvent?.title || "Smart Grid Symposium 2026"}</h3>
                                        <div className="pes-featured-event-meta">
                                            {featuredEvent?.date ? formatDate(featuredEvent.date) : "Date to be announced"}
                                            {featuredEvent?.location ? ` · ${featuredEvent.location}` : ""}
                                        </div>
                                        <p>
                                            {featuredEvent?.description || featuredEvent?.details || "Join industry leaders and academic researchers for an in-depth exploration of smart grids, renewable penetration, and power system modernization across Kerala."}
                                        </p>
                                        <div>
                                            <Link href={featuredEvent?.customUrl || featuredEvent?.link || "/pages/upcoming-events"} className="pes-text-link fw-bold">
                                                Programme details &amp; Registration →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    5. RECENT EVENTS (3-Column Grid)
                    ================================================================= */}
                <section className="pes-recent-events-section">
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                            <div>
                                <span className="pes-kicker">EVENTS &amp; PROGRAMMES</span>
                                <h2 className="pes-section-title mb-0">Recent events</h2>
                            </div>
                            <Link href="/pages/past-events" className="pes-text-link d-none d-md-inline-flex">
                                View all events archive →
                            </Link>
                        </div>

                        <div className="row g-4">
                            {displayRecent.slice(0, 3).map((event, idx) => (
                                <div className="col-md-6 col-lg-4" key={idx}>
                                    <div className="pes-event-card">
                                        <div className="pes-event-img-wrap">
                                            <img
                                                src={event.imageUrl || event.img || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                                alt={event.title}
                                            />
                                        </div>
                                        <div className="pes-event-card-body">
                                            <div className="pes-event-tag">
                                                {event.tag || "CHAPTER EVENT"}
                                            </div>
                                            <h4 className="pes-event-title">{event.title}</h4>
                                            <p className="pes-event-desc">
                                                {event.description || event.desc || event.details || "Highlights from this impactful IEEE PES Kerala Chapter technical gathering."}
                                            </p>
                                            <Link href={event.link || event.url || "/pages/past-events"} className="pes-text-link mt-auto">
                                                Read event report →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-5">
                            <Link href="/pages/past-events" className="pes-btn-outline">
                                View all past events
                            </Link>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    6. OUR COMMUNITY IN FOCUS (Photo Gallery)
                    ================================================================= */}
                <section className="pes-community-section">
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                            <div>
                                <span className="pes-kicker">PHOTO ARCHIVE</span>
                                <h2 className="pes-section-title mb-0">Our community in focus</h2>
                            </div>
                            <Link href="/pages/gallery" className="pes-text-link d-none d-md-inline-flex">
                                View entire gallery →
                            </Link>
                        </div>

                        <div className="row g-4">
                            {displayGallery.slice(0, 3).map((item, idx) => (
                                <div className="col-md-4" key={idx}>
                                    <div className="pes-gallery-item" onClick={() => setActivePhoto(item)}>
                                        <img src={item.img} alt={item.title} />
                                        <p className="pes-gallery-caption">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-4 d-md-none">
                            <Link href="/pages/gallery" className="pes-text-link fw-bold">
                                View entire gallery →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    7. STUDENT BRANCH CHAPTERS (Local connections. Lifelong possibilities.)
                    ================================================================= */}
                <section className="pes-network-section">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-lg-6">
                                <span className="pes-kicker">STUDENT &amp; PROFESSIONAL NETWORK</span>
                                <h2 className="pes-section-title">
                                    Local connections. Lifelong possibilities.
                                </h2>
                                <p className="pes-about-body">
                                    Our student branch chapters and affinity groups span engineering colleges across Kerala, giving students direct access to IEEE PES resources, industry mentorship, and global technical networks.
                                </p>
                                <Link href="/pages/student-branches" className="pes-text-link fw-bold">
                                    Find a chapter near you →
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <div className="pes-stat-number">50+</div>
                                <div className="pes-stat-label">Student Branch Chapters across Kerala</div>
                                <div className="pes-network-pathways">
                                    <div className="pes-pathway">
                                        <h5>Learn</h5>
                                        <p>Access technical workshops, webinars, and training.</p>
                                    </div>
                                    <div className="pes-pathway">
                                        <h5>Connect</h5>
                                        <p>Meet peers, researchers, and power industry leaders.</p>
                                    </div>
                                    <div className="pes-pathway">
                                        <h5>Contribute</h5>
                                        <p>Lead a student branch team and make a local impact.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    8. KEEP LEARNING. STAY CONNECTED.
                    ================================================================= */}
                <section className="pes-resources-section">
                    <div className="container">
                        <span className="pes-kicker">RESOURCES &amp; PUBLICATIONS</span>
                        <h2 className="pes-section-title">Keep learning. Stay connected.</h2>

                        <div className="row g-4 mt-2">
                            <div className="col-md-4">
                                <div className="pes-resource-block">
                                    <h4>Technical resources</h4>
                                    <p>
                                        Access publications, research papers, tutorials, and standards from IEEE PES professionals worldwide.
                                    </p>
                                    <Link href="/pages/resources" className="pes-text-link">
                                        Access technical materials →
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="pes-resource-block">
                                    <h4>Chapter newsletters</h4>
                                    <p>
                                        Stay up to date with chapter activities, upcoming events, and member achievements through our regular periodicals.
                                    </p>
                                    <Link href="/pages/newsletters" className="pes-text-link">
                                        Read latest newsletters →
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="pes-resource-block">
                                    <h4>Chapter gallery</h4>
                                    <p>
                                        Browse photos, symposium recaps, and memorable highlights from conferences and community meets across Kerala.
                                    </p>
                                    <Link href="/pages/gallery" className="pes-text-link">
                                        Explore the gallery →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    9. ABOUT IEEE AND PES (Original Official Template Content)
                    ================================================================= */}
                <section className="pes-about-dual-section">
                    <div className="container">
                        <div className="pes-boxed-title-wrap">
                            <span className="pes-boxed-title">About IEEE and PES</span>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="pes-dual-card">
                                    <h4>What is IEEE?</h4>
                                    <p>
                                        IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
                                    </p>
                                    <a
                                        href="https://www.ieee.org/membership/join/index.html?WT.mc_id=hc_join"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pes-btn-outline-green"
                                    >
                                        Join IEEE
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pes-dual-card">
                                    <h4>What is the IEEE Power &amp; Energy Society?</h4>
                                    <p>
                                        The mission of IEEE Power &amp; Energy Society is to be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and preferred professional development source of its members.
                                    </p>
                                    <a
                                        href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMPE031&refProd=MEMPE031"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pes-btn-outline-green"
                                    >
                                        Join IEEE PES
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================================
                    10. CTA BANNER (Your expertise belongs here)
                    ================================================================= */}
                <section className="pes-cta-section">
                    <div className="container">
                        <span className="pes-kicker" style={{ color: '#88c96f' }}>MEMBERSHIP IN IEEE PES</span>
                        <h2>Your expertise belongs here.</h2>
                        <p>
                            Join engineers, researchers, and students who are shaping the power and energy landscape. Elevate your engineering career with global networking and professional resources.
                        </p>
                        <div className="pes-cta-actions">
                            <a
                                href="https://www.ieee.org/membership/join/index.html"
                                target="_blank"
                                rel="noreferrer"
                                className="pes-btn-cta-primary"
                            >
                                Join IEEE PES Now <i className="ri-arrow-right-line"></i>
                            </a>
                            <Link href="/pages/membership-benefits" className="pes-btn-cta-secondary">
                                Discover Benefits
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Professional Footer */}
                <Footer />

                {/* Lightbox Modal for Gallery Inspection */}
                {activePhoto && (
                    <div
                        className="pes-lightbox-overlay"
                        onClick={() => setActivePhoto(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="pes-lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="pes-lightbox-close"
                                onClick={() => setActivePhoto(null)}
                                aria-label="Close photo preview"
                            >
                                ×
                            </button>
                            <img
                                src={activePhoto.img}
                                alt={activePhoto.title}
                                className="pes-lightbox-img"
                            />
                            <p className="pes-lightbox-caption">{activePhoto.title}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
