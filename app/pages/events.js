'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import styles from './Events.module.css';

// -----------------------------------------------------------------------------
// Flagship Events Data
// -----------------------------------------------------------------------------
// Flagship Events Data (The Two Premier Flagships: AKPS & ICEBERG)
// -----------------------------------------------------------------------------
const FLAGSHIP_EVENTS = [
    {
        id: 'akps-flagship',
        title: 'AKPS — All Kerala PES Student Congress',
        edition: 'Annual Student Flagship',
        tag: 'Student Congress',
        badge: 'Annual Flagship',
        isGreen: true,
        desc: 'The pinnacle annual statewide congress of the IEEE PES Kerala Chapter, bringing together delegates from 50+ Student Branch Chapters across Kerala. AKPS unites aspiring power engineers, researchers, and pioneers for leadership conclaves, high-impact paper tracks, hands-on simulation bootcamps, and clean-energy innovation challenges.',
        date: 'Annual Statewide Flagship',
        time: 'Multi-Day Residential Summit',
        mode: 'In-Person (Statewide Gathering)',
        venue: 'Host IEEE Student Branch Chapters Across Kerala',
        organizers: 'IEEE PES Kerala Chapter in association with Host IEEE PES SBCs',
        location: 'Statewide Host Campus',
        imageUrl: '/images/ieee-images/Flagships/akpessc_flagship_1770434008791.png',
        linkText: 'Explore AKPS',
        speakers: [
            { name: 'IEEE PES Kerala Chapter Execom', role: 'Leadership & Student Activities Committee' },
            { name: 'National Industry Mentors', role: 'Power Sector & Clean Tech Specialists' }
        ],
        description: 'AKPS (All Kerala PES Student Congress) stands as the beacon of student technical excellence and youth leadership within the IEEE Kerala Section. Built on the core motto "Connect. Collaborate. Lead.", each edition provides a high-energy platform for student branch chapters to exchange ideas, showcase cutting-edge engineering projects, and undergo intensive technical training in modern power grids and renewable systems.',
        fullDetails: 'The congress features an extensive lineup: hands-on simulation workshops (OpenDSS, MATLAB/Simulink, renewable feeder design), keynote addresses from senior power utility engineers, national technical paper presentations, the PES Student Leadership Training (SLT) forum, and the presentation of the prestigious IEEE PES Kerala Chapter Annual Student Branch Awards.'
    },
    {
        id: 'iceberg-flagship',
        title: 'ICEBERG — Innovation Conclave on Energy Breakthroughs & Resilient Grids',
        edition: 'Biennial Technical Conclave',
        tag: 'Research & Industry Flagship',
        badge: 'Premier Conclave',
        isDark: true, // Featured Dark Card matching reference mockup
        desc: 'ICEBERG is the signature technical symposium of the IEEE PES Kerala Chapter, dedicated to unveiling "what lies beneath the surface" of the modern power transition. The conclave convenes global researchers, utility leaders, and innovators to tackle deep-tier challenges in grid resilience, AI-driven dispatch, green hydrogen, and high-penetration renewables.',
        date: 'Signature Technical Conclave',
        time: 'Comprehensive Symposium Tracks',
        mode: 'Hybrid (In-Person & Virtual Technical Tracks)',
        venue: 'Premier Research & Convention Hub, Kerala',
        organizers: 'IEEE PES Kerala Chapter & Industry-Academia Advisory Board',
        location: 'Kerala, India',
        imageUrl: '/images/ieee-images/Events/smartgrid_event.png',
        linkText: 'Discover ICEBERG',
        speakers: [
            { name: 'Global Energy Pioneers & PES Fellows', role: 'International Keynote Speakers' },
            { name: 'Power Utility Leadership', role: 'Grid Modernization & Energy Storage Experts' }
        ],
        description: 'Conceived to address the hidden technical and economic complexities beneath the clean energy transformation, ICEBERG serves as the chapter’s premier research-to-practice bridge. The symposium brings together power utility directors, academic researchers, and clean-tech entrepreneurs to explore next-generation grid stability and decentralized energy systems.',
        fullDetails: 'Key tracks include smart inverter topologies, wide-area monitoring and phasor measurement units (PMUs), machine learning for fault classification and early asset failure prevention, decentralized microgrids with high EV charging penetration, green hydrogen economics, and mission-critical cybersecurity for electrical utility infrastructure.'
    }
];

// -----------------------------------------------------------------------------
// Recent Events Data Featuring Posters from /posters
// -----------------------------------------------------------------------------
const RECENT_EVENTS = [
    {
        id: 'powernexus-vol-1',
        title: 'POWERNEXUS — Online Webinar Series (Volume 1)',
        subtitle: 'Power System and the Power Grid',
        category: 'Webinar Series',
        badge: 'Webinar',
        date: 'July 10, 2026',
        time: 'Evening Session',
        mode: 'Online (Webex / Google Meet)',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES SBC CEAL in collaboration with IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Satish Saini, BSEE, SMIEEE, P.Eng.', role: 'Utilities Industry Specialist, HEXstream; Chairman, IEEE Smart Grid R&D' },
            { name: 'Dr. Boby Philip', role: 'Chairperson, IEEE PES Kerala Chapter (Chief Guest)' },
            { name: 'Canbing Li', role: 'IEEE PES Region 10 Representative, Asia & Pacific (Chief Guest)' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094226.png',
        description: 'POWERNEXUS Volume 1 featured a dedicated four-session series covering the fundamentals of energy and power systems, modern grid operations, intelligent systems, and emerging career opportunities in the power domain. Inaugurated virtually on 10 July 2026.',
        fullDetails: 'The inaugural session celebrated the launch of POWERNEXUS with distinguished addresses from Region 10 and Chapter leadership. The curriculum covers power system operation, stability, smart grid communication networks, and the transition toward decarbonized power infrastructures.'
    },
    {
        id: 'solar-farm-lecture',
        title: 'International Lecture Series: Optimal Solar Farm Site Selection',
        subtitle: 'A Multi-Criteria Framework for Optimal Solar Farm Site Selection',
        category: 'Lecture Series',
        badge: 'International',
        date: 'July 10, 2026',
        time: '06:00 PM IST',
        mode: 'Online (Google Meet)',
        venue: 'Google Meet Platform',
        organizers: 'IEEE PES Kerala Chapter, IEEE SB CET, IEEE SB ASIET & VJEC',
        speakers: [
            { name: 'Dr. Vishnu Suresh', role: 'Assistant Professor, Faculty of Electrical Engineering, Wrocław University of Science and Technology, Poland' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094312.png',
        description: 'Explored the application of GIS-based multi-criteria decision-making approaches for identifying suitable geographical locations for utility-scale solar farms.',
        fullDetails: 'The session highlighted how intelligent decision-making and spatial analysis contribute to more efficient, cost-effective, and sustainable renewable energy planning. Dr. Suresh demonstrated real-world case studies combining solar irradiance maps, terrain inclination, and grid proximity.'
    },
    {
        id: 'wow-startup-scale',
        title: 'Women of Wisdom 7.0 — Building a Startup: From Idea to Scale',
        subtitle: 'WOW 7.0 Session 3',
        category: 'Talk Session',
        badge: 'WOW 7.0',
        date: 'July 13, 2026',
        time: '07:30 PM IST Onwards',
        mode: 'Online',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES Kerala Chapter, IEEE WiP Kerala, IEEE WIE AG Kerala & IEEE PES SBC TKMCE',
        speakers: [
            { name: 'Mariyam Vidhu', role: 'Co-Founder, Crink.App' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094327.png',
        description: 'Focused on transforming early concepts into scalable technology ventures, tracing key stages of ideation, product-market validation, growth hacking, and venture scaling.',
        fullDetails: 'Mariyam Vidhu engaged participants with practical lessons on founder resilience, market testing, intellectual property, and raising capital while encouraging students to pursue entrepreneurial pathways beyond traditional campus recruiting.'
    },
    {
        id: 'beyond-the-grid',
        title: 'Beyond the Grid — Exploring AI in Modern Power Systems',
        subtitle: 'Two-Part Technical Webinar Series',
        category: 'Webinar Series',
        badge: 'AI & Grid',
        date: 'July 25 & Aug 1, 2026',
        time: '08:30 PM - 09:30 PM',
        mode: 'Online',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES MEA SB & IEEE PES SBC JECC in collaboration with IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Sreshtamol K G', role: 'Senior Research Fellow, School of AI, Amrita Vishwa Vidyapeetham (Chapter 01)' },
            { name: 'Dr. Rahul Satheesh', role: 'Assistant Professor (Sr. Gd.), School of AI, Amrita Vishwa Vidyapeetham (Chapter 02)' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094346.png',
        description: 'A two-chapter technical journey examining the transformative role of Artificial Intelligence in modern smart-grid operation, predictive maintenance, and adaptive network control.',
        fullDetails: 'Chapter 01 (July 25) introduced machine learning architectures for load forecasting and voltage stability. Chapter 02 (August 1) focused on deep reinforcement learning, stochastic system dynamics, and intelligent automation across next-generation energy networks.'
    },
    {
        id: 'ai-smart-energy-systems',
        title: 'AI-Driven Smart Energy Systems: Transforming the Future Grid',
        subtitle: 'Technical Talk Series — Session 1',
        category: 'Technical Talk',
        badge: 'Intelligence',
        date: 'August 24, 2026',
        time: '07:00 PM - 08:00 PM',
        mode: 'Online',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES Kerala Chapter in association with GSAC, IEEE Kerala Section',
        speakers: [
            { name: 'Dr. Muthukumari S.', role: 'Post-Doctoral Research Fellow, Amrita Vishwa Vidyapeetham, Coimbatore' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094403.png',
        description: 'Delivered an analytical exploration into how intelligent algorithmic architectures optimize decentralized power grids, electric vehicle charging loads, and green energy forecasting.',
        fullDetails: 'The session provided scholars, PG, and UG researchers a high-level view of how cutting-edge predictive algorithms maintain grid frequency stability during high-penetration renewable events.'
    },
    {
        id: 'womplexity-science',
        title: 'Women Shaping the Future of Complexity Science (WOMPLEXITY)',
        subtitle: 'WOW 7.0 Session 4',
        category: 'Talk Session',
        badge: 'WOW 7.0',
        date: 'August 12, 2026',
        time: '02:30 PM IST',
        mode: 'Online (Google Meet)',
        venue: 'Google Meet Platform',
        organizers: 'College of Engineering Attingal, IEEE PES Kerala Chapter & IEEE Women in Power',
        speakers: [
            { name: 'Dr. G. Cigdem Yalcin', role: 'Associate Professor, Physics Department, Istanbul University, Turkey' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094411.png',
        description: 'Investigated the fascinating intersection of women leadership, creative thinking, and complexity science within nonlinear physics and complex energy networks.',
        fullDetails: 'Dr. Yalcin inspired students to embrace curiosity, mathematical imagination, and cross-disciplinary inquiry to model emergent phenomena and build resilient societal systems.'
    },
    {
        id: 'biorise-renewable',
        title: 'BioRise — Future of Renewable Energy in the Indian Grid',
        subtitle: 'Talk Session on Biofuel Day',
        category: 'Talk Session',
        badge: 'Renewables',
        date: 'August 13, 2026',
        time: '07:00 PM - 08:00 PM',
        mode: 'Online',
        venue: 'Virtual Platform',
        organizers: 'IEEE FISAT SB, IEEE PES SBC FISAT & IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Dr. Sobha Manakkal', role: 'Professor, Dept. of EEE, Nehru College of Engineering & Research Centre' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094426.png',
        description: 'Examined opportunities and stability challenges of integrating biofuels and hybrid renewables into the evolving national electrical grid.',
        fullDetails: 'Organized in connection with World Biofuel Day, the lecture highlighted the transition away from fossil baseload generation and evaluated the technical requisites for balancing intermittent renewable feeder networks.'
    },
    {
        id: 'confluence-motor-drives',
        title: 'Confluence 3.0 — Motor Drives for Autonomous Vehicles',
        subtitle: 'Workshop #1: Live Hardware Demonstration',
        category: 'Workshops',
        badge: 'Hardware Demo',
        date: 'September 01, 2026',
        time: '02:00 PM - 04:00 PM',
        mode: 'In-Person (Live Demo)',
        venue: 'Power Electronics Lab, Second Floor, KE Block, RSET',
        organizers: 'IEEE PES, IEEE SB RSET & IBS Software',
        speakers: [
            { name: 'Dr. Tony George', role: 'Director, Tolarix Innovations (OPC) Private Ltd' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094459.png',
        description: 'An immersive live laboratory demonstration unveiling the design, control algorithms, and inverter modulation topologies powering autonomous electric vehicles.',
        fullDetails: 'Conducted under the Confluence 3.0 Industry-Academia Summit, participants witnessed direct hardware testing of motor controllers, regenerative braking loops, and thermal monitoring circuits.'
    },
    {
        id: 'ball-bearing-fault',
        title: 'Automating Induction Motor Bearing Fault Classification with Deep Learning',
        subtitle: 'Technical Talk Series — Session 2',
        category: 'Technical Talk',
        badge: 'Deep Learning',
        date: 'September 07, 2026',
        time: '07:00 PM - 08:00 PM',
        mode: 'Online',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES Kerala Chapter in association with GSAC, IEEE Kerala Section',
        speakers: [
            { name: 'Dr. Karan Kumar K.', role: 'Post-Doctoral Research Fellow, Amrita Vishwa Vidyapeetham, Coimbatore' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094511.png',
        description: 'Focused on vibration signal analysis, automated fault feature extraction, and convolutional neural networks for early diagnosis of ball-bearing defects in industrial motors.',
        fullDetails: 'Dr. Karan Kumar discussed advanced spectral signal processing and how non-invasive AI diagnostics avert catastrophic machine failures in automated industrial plants.'
    },
    {
        id: 'intelligence-we-are-forgetting',
        title: 'The Intelligence We Are Forgetting — Talk Session',
        subtitle: 'Real-world Perspectives Beyond Academic Curriculum',
        category: 'Talk Session',
        badge: 'Human & Tech',
        date: 'September 14, 2026',
        time: '04:00 PM - 05:00 PM',
        mode: 'In-Person',
        venue: 'EEE Seminar Hall, Jyothi Engineering College (JECC)',
        organizers: 'IEEE PES SBC JECC, IEEE SB JECC, IEEE PES Kerala Chapter & IEEE WiP',
        speakers: [
            { name: 'Dr. Gayathri Padmanabhan', role: 'Associate Professor, Dept. of AI & Data Science, Jyothi Engineering College' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094522.png',
        description: 'A deeply reflective session exploring the profound human dimensions of intelligence — empathy, artistic insight, and lateral creativity — alongside modern computational power.',
        fullDetails: 'Drawing from Dr. Padmanabhan’s multifaceted experience in classical arts, theatre, and AI research, the talk emphasized cultivating holistic problem-solving in young engineers.'
    },
    {
        id: 'opendss-workshop',
        title: 'OpenDSS Skill Development Workshop (3-Day Bootcamp)',
        subtitle: 'Learn. Simulate. Optimize. Modern Distribution Analysis',
        category: 'Workshops',
        badge: 'Bootcamp',
        date: 'September 19, 20 & 21, 2026',
        time: '07:00 PM - 08:30 PM IST',
        mode: 'Online (Hands-on Lab)',
        venue: 'Simulation Environment',
        organizers: 'IEEE PES Kerala Chapter in association with IEEE Young Professionals – PES',
        speakers: [
            { name: 'Ms. Swathi Krishna', role: 'Power System Modeling & OpenDSS Specialist' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094534.png',
        description: 'Hands-on training introducing OpenDSS script syntax, radial distribution power flow analysis, and time-series simulations with distributed PV and battery storage systems.',
        fullDetails: 'Engineers and student researchers developed complete feeder models from scratch, testing voltage drop mitigation and hosting-capacity limits under renewable penetration.'
    },
    {
        id: 'hydrogen-fuel-cells',
        title: 'Expert Lecture on Hydrogen & Fuel Cells — VSSC / ISRO',
        subtitle: 'The Context, Technology, History and Future',
        category: 'Lecture Series',
        badge: 'Space & Energy',
        date: 'September 16, 2026',
        time: '02:45 PM',
        mode: 'In-Person',
        venue: 'Multi Purpose Hall (MPH), Indian Institute of Space Science and Technology (IIST), Trivandrum',
        organizers: 'IEEE PES IIST Student Branch Chapter & IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Dr. Shaneeth M.', role: 'Group Director, Energy Systems Group, VSSC, ISRO, Trivandrum' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094550.png',
        description: 'A prestigious scientific exposition on the chemistry, aerospace reliability, and future terrestrial applications of hydrogen fuel cells by ISRO energy leadership.',
        fullDetails: 'Dr. Shaneeth surveyed polymer electrolyte membrane (PEM) fuel cells, hydrogen storage safety, green hydrogen production through electrolysis, and India’s National Green Hydrogen Mission.'
    },
    {
        id: 'ev-journey-50k',
        title: 'Practical Electric Car Journey: 50,000+ km Across India',
        subtitle: 'Outdoor Demonstration & Real-World Case Studies',
        category: 'Workshops',
        badge: 'EV & Demo',
        date: 'September 18, 2026',
        time: '10:00 AM - 01:00 PM',
        mode: 'In-Person & Live Demo',
        venue: 'Outdoor Campus Grounds, RSET',
        organizers: 'IEEE PES RSET Student Branch in association with RSET',
        speakers: [
            { name: 'Mr. Sushil Reddy', role: 'Founder, The Sun Pedal Ride; Guinness World Record Holder' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094611.png',
        description: 'Live electric vehicle outdoor testing and engineering breakdown based on a grueling 50,000+ km pan-India EV expedition, analyzing range realities and charging grids.',
        fullDetails: 'Students inspected the vehicle subsystems, battery degradation metrics under Indian climatic extremes, and discussed the highway fast-charging infrastructure roadmap.'
    },
    {
        id: 'wow-ai-mind',
        title: 'WOW 7.0 — Mastering the Human Mind, Architecting the AI Mind',
        subtitle: 'Amplifying Human Potential for a Global Future',
        category: 'Talk Session',
        badge: 'WOW 7.0',
        date: 'September 29, 2026',
        time: '07:30 PM IST Onwards',
        mode: 'Online (Google Meet)',
        venue: 'Google Meet Platform',
        organizers: 'IEEE PES Kerala Chapter, IEEE WiP, IEEE WIE AG & IEEE PES CUSAT SBC',
        speakers: [
            { name: 'Aisha Nazia', role: 'FIFA MASTER Graduate; International Sports Management Consultant' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094621.png',
        description: 'An international leadership discourse on aligning human emotional intelligence, executive decision-making, and ethical artificial intelligence architecture.',
        fullDetails: 'Aisha Nazia challenged attendees to safeguard personal values, intuition, and communication prowess as foundational anchors while architecting scalable AI tools.'
    },
    {
        id: 'slt-sbc-meetup-2026',
        title: 'SLT, SBC, Leadership Representatives & Advisors Meetup 2026',
        subtitle: 'A Strategic Forum for Student Leadership & Faculty Advisors',
        category: 'Leadership Meetup',
        badge: 'State Summit',
        date: 'September 26, 2026',
        time: '09:30 AM - 03:00 PM',
        mode: 'In-Person Leadership Forum',
        venue: 'Carmel College of Engineering & Technology (CCET), Alappuzha, Kerala',
        organizers: 'IEEE PES Kerala Chapter & IEEE PES SBC CCET',
        speakers: [
            { name: 'Er. Harikumar K. P.', role: 'Vice-Chair, IEEE PES Kerala Chapter' },
            { name: 'Dr. Sarath K. S.', role: 'Head of Dept., EEE, CCET Alappuzha' },
            { name: 'Dr. Rahul Satheesh', role: 'Secretary, IEEE PES Kerala Chapter' },
            { name: 'Vishnu S.', role: 'Treasurer, IEEE PES Kerala Chapter' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094631.png',
        description: 'Concluded an impactful gathering of 25 PES Student Branch Chapters and 85 student leaders, charting the strategic roadmap for year-round student branch sustainability.',
        fullDetails: 'Discussions rallied around membership retention, faculty mentorship pipelines, collaborative inter-college flagship events, and grooming junior volunteers for leadership succession.'
    },
    {
        id: 'powernexus-guests',
        title: 'POWERNEXUS Distinguished Guests Address',
        subtitle: 'Canbing Li & Dr. Boby Philip Launch Addresses',
        category: 'Webinar Series',
        badge: 'Inauguration',
        date: 'July 10, 2026',
        time: '06:00 PM IST',
        mode: 'Online (Webex / Google Meet)',
        venue: 'Virtual Platform',
        organizers: 'IEEE PES SBC CEAL & IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Canbing Li', role: 'IEEE PES Region 10 Representative, Asia & Pacific' },
            { name: 'Dr. Boby Philip', role: 'Chairperson, IEEE PES Kerala Chapter' }
        ],
        imageUrl: '/posters/Screenshot 2026-11-20 094242.png',
        description: 'Special addresses delivered by Region 10 leadership and Chapter Chair during the inaugural ceremony of POWERNEXUS, outlining key technological frontiers for student engineers.',
        fullDetails: 'The session brought together faculty advisors and collegiate leaders across Kerala, emphasizing collaborative cross-border research and technical community empowerment.'
    },
    {
        id: 'hpsbcp-achievement',
        title: 'HPSBCP 2025 Achievement — 35 PES SBCs Win $9,395',
        subtitle: 'IEEE PES High Performing Student Branch Chapter Program',
        category: 'Achievement',
        badge: 'State Honor',
        date: 'Annual Milestone 2025-2026',
        time: 'State-wide',
        mode: 'In-Person & Online',
        venue: 'Kerala Section State-wide',
        organizers: 'IEEE PES Kerala Chapter',
        speakers: [
            { name: 'IEEE PES Kerala Chapter Execom', role: 'Student Activities Committee' }
        ],
        imageUrl: '/images/ieee-images/Gallery/gallery_1.png',
        description: '35 IEEE PES Student Branch Chapters across Kerala were recognized in the global HPSBCP 2025, securing a collective sum of $9,395 for exemplary technical and humanitarian initiatives.',
        fullDetails: 'This historic milestone is a testament to the passionate leadership of student volunteers throughout Kerala, demonstrating unmatched community impact, workshops, conferences, and technical member retention.'
    },
    {
        id: 'watts-the-answer-2',
        title: 'WATTS THE ANSWER 2.0 — Powering Knowledge for a Sustainable Future',
        subtitle: 'Quiz Competition on SDG 7 (Affordable & Clean Energy)',
        category: 'Competitions & Quizzes',
        badge: 'Quiz',
        date: 'August 14, 2026',
        time: 'College Hours',
        mode: 'In-Person',
        venue: 'Simulation Lab, Dept. of EEE, Rajagiri School of Engineering & Technology (RSET)',
        organizers: 'IEEE PES SB RSET in collaboration with IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Winners: Quizards', role: '1st Place — Athul Krishna B & Vaishakh Menon (S5-CSBS)' },
            { name: '2nd Place: Mohens', role: 'Angelin Lopez & Nayan Krishna (S5-IT)' },
            { name: '3rd Place: Blitz433', role: 'Jovit Jerry & Joyal Thenamkodath (S5-CSBS)' }
        ],
        imageUrl: '/images/ieee-images/Events/agm2026.png',
        description: 'A vibrant inter-departmental quiz championship focused on United Nations Sustainable Development Goal 7, testing acumen in solar PV, grid storage, and global energy diplomacy.',
        fullDetails: 'The second edition celebrated intellectual rigor and clean-energy awareness, recognizing top student duos with certificates and prizes distributed during the ceremony.'
    },
    {
        id: 'appeec-2026',
        title: 'IEEE PES Members at APPEEC 2026 Singapore',
        subtitle: '18th Asia-Pacific Power and Energy Engineering Conference',
        category: 'Conference Delegation',
        badge: 'International',
        date: 'August 24–27, 2026',
        time: 'Multi-Day Conference',
        mode: 'In-Person',
        venue: 'Marina Bay Sands, Singapore',
        organizers: 'IEEE PES Asia-Pacific / IEEE PES Kerala Chapter',
        speakers: [
            { name: 'Dr. Rahul Satheesh', role: 'Secretary, IEEE PES Kerala Chapter' },
            { name: 'Naufal N.', role: 'Research Activities Coordinator, IEEE PES Kerala Chapter' },
            { name: 'Alpha M. M.', role: 'Member, PES SBC College of Engineering Trivandrum (CET)' }
        ],
        imageUrl: '/images/ieee-images/Gallery/gallery_2.png',
        description: 'Chapter members represented Kerala at the prestigious APPEEC 2026 in Singapore, authoring and presenting groundbreaking papers on microgrids and frequency control.',
        fullDetails: 'Presented research included open-end winding transformer microgrids, learning-augmented supervisory energy management for inland mini-grids, and robust load frequency control under stochastic delays.'
    },
    {
        id: 'apj-kalam-quiz',
        title: 'Dr. APJ Abdul Kalam Energy Quiz 2026',
        subtitle: 'College Level Quiz Competition',
        category: 'Competitions & Quizzes',
        badge: 'Quiz',
        date: 'September 11, 2026',
        time: 'College Hours',
        mode: 'In-Person',
        venue: 'Rajagiri Valley Campus, Kakkanad, Ernakulam',
        organizers: 'KSEB Engineers’ Association, IEEE PES RSET SB & RSET ELUXTRA',
        speakers: [
            { name: 'Parvathy M', role: '1st Prize Winner (S7 EEE)' },
            { name: 'Aliyas Lius Kurian', role: '2nd Prize Winner (S7 EEE)' },
            { name: 'Er. Priyesh C V', role: 'Asst. Executive Engineer, SLDC Kalamassery, KSEB (Chief Guest)' }
        ],
        imageUrl: '/images/ieee-images/Events/agm_2026.png',
        description: 'Organized in memory of Dr. APJ Abdul Kalam, testing engineering undergraduates on power sector reforms, grid transmission benchmarks, and clean energy policy.',
        fullDetails: 'Er. Priyesh C V distributed the honors and provided an insider look into the operations of Kerala State Load Dispatch Centre (SLDC) managing statewide load curves.'
    }
];

export default function EventsPage() {
    const [activeModalEvent, setActiveModalEvent] = useState(null);
    const scrollTrackRef = useRef(null);

    // Scroll carousel left/right
    const handleScroll = (direction) => {
        if (!scrollTrackRef.current) return;
        const scrollAmount = direction === 'left' ? -340 : 340;
        scrollTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <PageLayout>
            <div className={styles.eventsPage}>

                {/* =================================================================
                    1. HERO SECTION (Outline Display Heading + Organic Photo Collage)
                    ================================================================= */}
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <div className={styles.heroGrid}>
                            
                            {/* Left Column: Hero Text */}
                            <div className={styles.heroLeft}>
                                <h1 className={styles.heroOutlineHeading}>
                                    Explore and<br />
                                    Discover the<br />
                                    Events
                                </h1>
                                <h2 className={styles.heroSubHeading}>That Shape Tomorrow</h2>
                                <p className={styles.heroDescription}>
                                    Step into a world of experiences designed to spark curiosity and fuel growth. 
                                    Our events bring together passionate minds, powerful ideas, and opportunities to 
                                    learn, lead, and create. Discover how each moment contributes to a vibrant tech 
                                    community built on inspiration, empowerment, and innovation.
                                </p>
                                <a 
                                    href="#recent-showcase" 
                                    className={styles.heroBtn}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('recent-showcase')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Learn More <i className="ri-arrow-down-line"></i>
                                </a>
                            </div>

                            {/* Right Column: Organic Photo Mosaic Collage */}
                            <div className={styles.heroRight}>
                                <div className={styles.collageContainer}>
                                    
                                    {/* Top Left: Chapter Leadership and Advisors Meetup with #IEEE letters */}
                                    <div 
                                        className={`${styles.collageCard} ${styles.cCard1}`}
                                        title="Click to view full photo: Leadership & Advisors Meetup"
                                        onClick={() => setActiveModalEvent({
                                            title: 'Executive Committee & Advisor Delegation — CCET Alappuzha',
                                            badge: 'Leadership Meetup',
                                            date: 'September 26, 2026',
                                            mode: 'In-Person Delegation',
                                            venue: 'Carmel College of Engineering and Technology',
                                            organizers: 'IEEE PES Kerala Chapter',
                                            speakers: [
                                                { name: 'Er. Harikumar K. P.', role: 'Vice-Chair, IEEE PES Kerala Chapter' },
                                                { name: 'Dr. Sarath K. S.', role: 'Faculty Advisor & HOD EEE, CCET' }
                                            ],
                                            imageUrl: '/events_top/Screenshot 2026-11-20 103555.png',
                                            description: 'Executive committee members, faculty counsellors, and student branch chapter chairs in front of the iconic #IEEE 3D letters at Carmel College of Engineering and Technology during the annual advisors meetup.',
                                            fullDetails: 'The council reviewed key milestones including HPSBCP global awards, regional workshops, and strategic roadmaps for collegiate PES chapters across Kerala.'
                                        })}
                                    >
                                        <img 
                                            src="/events_top/Screenshot 2026-11-20 103555.png" 
                                            alt="IEEE PES Kerala Leadership Delegation at CCET" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Top Right: Delegates & Research in Lab */}
                                    <div 
                                        className={`${styles.collageCard} ${styles.cCard2}`}
                                        title="Click to view: Power & Renewables Research"
                                        onClick={() => setActiveModalEvent({
                                            title: 'Power Systems & Renewables Research Team',
                                            badge: 'Hands-on Research',
                                            date: 'Ongoing Initiative',
                                            mode: 'Hardware & Simulation Lab',
                                            venue: 'PES Research Labs, Kerala',
                                            organizers: 'IEEE PES Kerala Chapter SBCs',
                                            imageUrl: '/images/ieee-images/Gallery/gallery_2.png',
                                            description: 'Engineering delegates and researchers collaborating on renewable energy hardware testbeds, wind turbine simulations, and microgrid converters.',
                                            fullDetails: 'Hands-on experimentation with power converters, battery energy storage systems, and real-time oscilloscopes.'
                                        })}
                                    >
                                        <img 
                                            src="/images/ieee-images/Gallery/gallery_2.png" 
                                            alt="Delegates at Research Bench" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Center Large: Grand Group Photo at CCET with #IEEE letters */}
                                    <div 
                                        className={`${styles.collageCard} ${styles.cCardCenter}`}
                                        title="Click to view full photo: All Kerala PES Student Leadership Meetup"
                                        onClick={() => setActiveModalEvent({
                                            title: 'IEEE PES Kerala Chapter — Student Leadership & SBC Meetup 2026',
                                            badge: 'Statewide Gathering',
                                            date: 'September 26, 2026',
                                            mode: 'In-Person (Statewide Gathering)',
                                            venue: 'Carmel College of Engineering and Technology (CCET), Alappuzha',
                                            organizers: 'IEEE PES Kerala Chapter in association with CCET',
                                            speakers: [
                                                { name: 'Er. Harikumar K. P.', role: 'Vice-Chair, IEEE PES Kerala Chapter' },
                                                { name: 'Dr. Sarath K. S.', role: 'HOD, EEE Department, CCET' },
                                                { name: 'Dr. Rahul Satheesh', role: 'Secretary, IEEE PES Kerala Chapter' },
                                                { name: 'Vishnu S.', role: 'Treasurer, IEEE PES Kerala Chapter' }
                                            ],
                                            imageUrl: '/events_top/Screenshot 2026-11-20 103621.png',
                                            description: 'The IEEE PES Kerala Chapter successfully organized the SLT, SBC, Leadership Representatives & Advisors Meetup 2026 at Carmel College of Engineering and Technology (CCET), Alappuzha. Bringing together 85 student delegates and representatives from 25 IEEE PES Student Branch Chapters, the forum laid the groundwork for statewide collaboration and year-round technical engagement.',
                                            fullDetails: 'Discussions centered on student branch growth, retention of active members, mentorship pipelines, and collective leadership. Concluding with the theme "Connect. Collaborate. Lead.", the meetup reinforced the commitment to nurturing active and sustainable IEEE PES communities across Kerala.'
                                        })}
                                    >
                                        <img 
                                            src="/events_top/Screenshot 2026-11-20 103621.png" 
                                            alt="IEEE PES Kerala Chapter Student Leadership & SBC Meetup 2026 at CCET" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Middle Right: Interactive Round Circle Discussion at CCET */}
                                    <div 
                                        className={`${styles.collageCard} ${styles.cCardAuditorium}`}
                                        title="Click to view: Interactive Round-Circle Discussion"
                                        onClick={() => setActiveModalEvent({
                                            title: 'Interactive Round-Circle Leadership & Strategy Session',
                                            badge: 'Leadership Forum',
                                            date: 'September 26, 2026',
                                            mode: 'Interactive Workshop',
                                            venue: 'Seminar Hall, CCET Alappuzha',
                                            organizers: 'IEEE PES Kerala Chapter',
                                            imageUrl: '/events_top/Screenshot 2026-11-20 103603.png',
                                            description: 'Student branch leaders, counsellors, and advisors engage in an interactive circle forum discussing best practices for organizing high-impact technical initiatives, membership drives, and industrial collaborations.',
                                            fullDetails: 'Participants exchanged successful practices, addressed operational hurdles, and established inter-collegiate partnerships across Kerala student branches.'
                                        })}
                                    >
                                        <img 
                                            src="/events_top/Screenshot 2026-11-20 103603.png" 
                                            alt="Interactive Discussion Session at CCET" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Small Floating Thumbnail: Technical Lab */}
                                    <div className={`${styles.collageCard} ${styles.cCardThumb1}`}>
                                        <img 
                                            src="/posters/Screenshot 2026-11-20 094459.png" 
                                            alt="Workshop Lab Poster" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Small Floating Thumbnail: WOW Seminar */}
                                    <div className={`${styles.collageCard} ${styles.cCardThumb2}`}>
                                        <img 
                                            src="/posters/Screenshot 2026-11-20 094327.png" 
                                            alt="WOW Seminar Poster" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                    {/* Bottom Right: Wispr Flow Workshop Group Photo */}
                                    <div 
                                        className={`${styles.collageCard} ${styles.cCardThumb3}`}
                                        title="Click to view: Wispr Flow & Technical Innovation Group"
                                        onClick={() => setActiveModalEvent({
                                            title: 'Technical Innovation & AI Workshop Session',
                                            badge: 'Technical Workshop',
                                            date: 'Recent Chapter Session',
                                            mode: 'Interactive Tech Lab',
                                            venue: 'Academic Auditorium',
                                            organizers: 'IEEE PES Kerala Chapter',
                                            imageUrl: '/events_top/Screenshot 2026-11-20 103536.png',
                                            description: 'Scholars, student researchers, and developers participating in an intensive tech session on emerging AI tools, machine learning applications, and workflow automation in power engineering.',
                                            fullDetails: 'Participants engaged with live demonstrations, problem-solving workshops, and interactive tech discussions.'
                                        })}
                                    >
                                        <img 
                                            src="/events_top/Screenshot 2026-11-20 103536.png" 
                                            alt="Wispr Flow Workshop Group" 
                                            className={styles.collageImg} 
                                        />
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* =================================================================
                    2. OUR FLAGSHIP EVENTS SECTION
                    ================================================================= */}
                <section className={styles.flagshipSection} id="flagship-events">
                    <div className={styles.container}>
                        
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitleGolden}>Our Flagship Events</h2>
                            <p className={styles.sectionDesc}>
                                Our flagship events represent the core of our community&apos;s innovation, leadership, 
                                and growth. These signature programs bring together learners, creators, and industry 
                                leaders to share knowledge, collaborate, and shape the future of technology. They stand 
                                as milestones that define our mission and inspire excellence year after year.
                            </p>
                        </div>

                        <div className={styles.flagshipGrid}>
                            {FLAGSHIP_EVENTS.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`${styles.flagshipCard} ${item.isDark ? styles.flagshipCardDark : ''}`}
                                >
                                    <div>
                                        <div className={styles.flagshipCardTop}>
                                            <span className={`${styles.flagshipBadge} ${item.isGreen ? styles.flagshipBadgeGreen : ''}`}>
                                                {item.tag}
                                            </span>
                                            <span className={styles.flagshipEdition}>{item.edition}</span>
                                        </div>
                                        <h3 className={styles.flagshipCardTitle}>{item.title}</h3>
                                        <p className={styles.flagshipCardDesc}>{item.desc}</p>
                                    </div>
                                    <div className={styles.flagshipCardFooter}>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                            <i className="ri-map-pin-line me-1"></i> {item.location}
                                        </span>
                                        <button 
                                            className={styles.flagshipCardLink}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                            onClick={() => setActiveModalEvent(item)}
                                        >
                                            {item.linkText} <i className="ri-arrow-right-line"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* =================================================================
                    3. NEWSLETTER HIGHLIGHT STATS
                    ================================================================= */}
                <div className={styles.container}>
                    <div className={styles.statsBar}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>19+</span>
                            <span className={styles.statLabel}>Major Events Hosted</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>35</span>
                            <span className={styles.statLabel}>High Performing SBCs</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>$9,395</span>
                            <span className={styles.statLabel}>HPSBCP Global Grants</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>50,000+</span>
                            <span className={styles.statLabel}>km Electric Mobility Demo</span>
                        </div>
                    </div>
                </div>

                {/* =================================================================
                    4. RECENT EVENTS (POSTER REEL / CAROUSEL)
                    ================================================================= */}
                <section className={styles.eventsShowcaseSection} id="recent-showcase">
                    <div className={styles.container}>
                        
                        <div className={styles.showcaseTopRow}>
                            <div>
                                <h2 className={styles.sectionTitleCaps}>RECENT EVENTS</h2>
                                <p className={styles.sectionDesc}>
                                    Explore our recent technical sessions, workshops, webinar series, and student 
                                    initiatives across Kerala. Each program brought together passionate minds, domain 
                                    experts, and volunteers to advance power and energy engineering. Click on any poster 
                                    to view full event highlights, recordings, and speaker details.
                                </p>
                            </div>
                        </div>

                        {/* Horizontal Poster Carousel */}
                        <div className={styles.reelContainer}>
                            <button 
                                className={`${styles.carouselArrow} ${styles.arrowLeft}`}
                                onClick={() => handleScroll('left')}
                                aria-label="Scroll Left"
                            >
                                <i className="ri-arrow-left-s-line"></i>
                            </button>
                            <button 
                                className={`${styles.carouselArrow} ${styles.arrowRight}`}
                                onClick={() => handleScroll('right')}
                                aria-label="Scroll Right"
                            >
                                <i className="ri-arrow-right-s-line"></i>
                            </button>

                            <div ref={scrollTrackRef} className={styles.scrollTrack}>
                                {RECENT_EVENTS.map((ev) => (
                                    <div 
                                        key={ev.id} 
                                        className={styles.posterCard}
                                        onClick={() => setActiveModalEvent(ev)}
                                        title={`${ev.title} — Click to view details`}
                                    >
                                        <img 
                                            src={ev.imageUrl} 
                                            alt={ev.title} 
                                            className={styles.posterImg} 
                                        />
                                        <div className={styles.posterHoverOverlay}>
                                            <span className={styles.posterHoverBtn}>
                                                View Event <i className="ri-arrow-right-line ms-1"></i>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* =================================================================
                    5. LIGHTBOX / EVENT DETAILS MODAL
                    ================================================================= */}
                {activeModalEvent && (
                    <div 
                        className={styles.modalBackdrop}
                        onClick={() => setActiveModalEvent(null)}
                    >
                        <div 
                            className={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className={styles.modalCloseBtn}
                                onClick={() => setActiveModalEvent(null)}
                                aria-label="Close Modal"
                            >
                                <i className="ri-close-line"></i>
                            </button>

                            <div className={styles.modalImageBanner}>
                                <img 
                                    src={activeModalEvent.imageUrl} 
                                    alt={activeModalEvent.title} 
                                    className={styles.modalImg} 
                                />
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.modalHeaderRow}>
                                    <span className={styles.modalBadge}>{activeModalEvent.badge}</span>
                                    <span className={styles.modalDate}>
                                        <i className="ri-calendar-line"></i> {activeModalEvent.date} {activeModalEvent.time ? `• ${activeModalEvent.time}` : ''}
                                    </span>
                                </div>

                                <h3 className={styles.modalTitle}>{activeModalEvent.title}</h3>

                                <div className={styles.modalMetaGrid}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Mode &amp; Venue</span>
                                        <span className={styles.metaVal}>{activeModalEvent.mode} ({activeModalEvent.venue})</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Organizers</span>
                                        <span className={styles.metaVal}>{activeModalEvent.organizers}</span>
                                    </div>
                                    {activeModalEvent.speakers?.length > 0 && (
                                        <div className={styles.metaItem} style={{ gridColumn: 'span 2' }}>
                                            <span className={styles.metaLabel}>Speaker / Key Guest</span>
                                            {activeModalEvent.speakers.map((spk, idx) => (
                                                <span key={idx} className={styles.metaVal} style={{ display: 'block', marginTop: idx > 0 ? '4px' : '0' }}>
                                                    <strong>{spk.name}</strong> — <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{spk.role}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <h4 className={styles.modalDescHeading}>Event Overview</h4>
                                <p className={styles.modalDescText}>{activeModalEvent.description}</p>
                                
                                {activeModalEvent.fullDetails && (
                                    <>
                                        <h4 className={styles.modalDescHeading}>Highlights &amp; Impact</h4>
                                        <p className={styles.modalDescText}>{activeModalEvent.fullDetails}</p>
                                    </>
                                )}

                                <div className={styles.modalActionFooter}>
                                    <button 
                                        className={styles.modalPrimaryBtn}
                                        onClick={() => setActiveModalEvent(null)}
                                    >
                                        Close Event View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </PageLayout>
    );
}
