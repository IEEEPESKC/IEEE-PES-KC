'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [popup, setPopup] = useState(null);

    const closePopup = () => setPopup(null);

    const showUndo = (title, message, onUndo) => {
        setPopup({ type: 'warning undo', title, message, onConfirm: onUndo });
    };

    const showSuccess = (title, message) => {
        setPopup({ type: 'success', title, message });
    };

    const showConfirm = (title, message, onConfirm) => {
        setPopup({ type: 'danger confirm', title, message, onConfirm });
    };

    const handleUndo = async (count) => {
        const formData = new FormData();
        formData.append('type', 'undo');
        formData.append('count', count);
        const res = await fetch('/api/admin', { method: 'POST', body: formData });
        if (res.ok) window.location.reload();
    };

    const handlePublish = async () => {
        const res = await fetch('/api/admin?type=publish', { method: 'DELETE' });
        if (res.ok) {
            setPopup({ type: 'success', title: 'Site Updated', message: 'All changes have been successfully published and a new checkpoint created.' });
        }
    };

    const showEditLog = async () => {
        try {
            const res = await fetch('/api/admin');
            const data = await res.json();
            const log = data._editLog || [];
            if (log.length === 0) {
                setPopup({ type: 'success', title: 'Already Up-to-Date', message: 'The website is already reflecting the latest information. No pending edits found.' });
            } else {
                setPopup({ type: 'log', title: 'Recent Edit Log', log });
            }
        } catch {
            setPopup({ type: 'success', title: 'Site Updated', message: 'All changes have been published successfully.' });
        }
    };

    const navItems = [
        { name: 'Events', path: '/admin/ad_pages/ad_events', icon: 'ri-calendar-event-line' },
        { name: 'Announcements', path: '/admin/ad_pages/ad_announcements', icon: 'ri-notification-3-line' },
        { name: 'Image Gallery', path: '/admin/ad_pages/ad_gallery', icon: 'ri-image-line' },
        { name: 'Execom', path: '/admin/ad_pages/ad_execom', icon: 'ri-team-line' },
        { name: 'Chapters', path: '/admin/ad_pages/ad_chapters', icon: 'ri-building-line' },
        { name: 'Awards', path: '/admin/ad_pages/ad_awards', icon: 'ri-award-line' },
        { name: 'Recognitions', path: '/admin/ad_pages/ad_recognitions', icon: 'ri-medal-line' },
        { name: 'Newsletters', path: '/admin/ad_pages/ad_newsletters', icon: 'ri-file-text-line' },
        { name: 'Magazines', path: '/admin/ad_pages/ad_magazines', icon: 'ri-book-open-line' }
    ];

    return (
        <>
            <div className="admin-sidebar">
                <Link href="/" className="admin-brand" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <h2>IEEE PES</h2>
                    <p>Kerala Chapter</p>
                </Link>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`admin-nav-item ${pathname === item.path || (pathname === '/admin' && item.path === '/admin/ad_pages/ad_events') ? 'active' : ''}`}
                        >
                            <i className={item.icon}></i>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="admin-actions" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', padding: '0 16px', marginBottom: '8px', letterSpacing: '1px' }}>Quick Actions</div>
                    <button className="admin-action-btn" onClick={() => showUndo('Undo Modification', 'Revert the most recent change to the site?', () => handleUndo(1))}>
                        <i className="ri-arrow-go-back-line"></i> Undo Last
                    </button>
                    <button className="admin-action-btn" onClick={() => showUndo('History Rollback', 'Roll back the last 5 changes made?', () => handleUndo(5))}>
                        <i className="ri-history-line"></i> Undo Last 5
                    </button>
                    <button className="admin-action-btn" onClick={() => showUndo('Extended Undo', 'Roll back the last 10 changes?', () => handleUndo(10))}>
                        <i className="ri-history-line"></i> Undo Last 10
                    </button>
                    <button className="admin-action-btn" onClick={() => showUndo('Deep Snapshot', 'Roll back the last 20 changes?', () => handleUndo(20))}>
                        <i className="ri-history-line"></i> Undo Last 20
                    </button>
                    <button className="admin-action-btn danger" onClick={() => showConfirm('Clear Changes', 'Completely erase all pending modifications and revert to last checkpoint?', async () => {
                        await fetch('/api/admin?type=clear', { method: 'DELETE' });
                        window.location.reload();
                    })}>
                        <i className="ri-delete-bin-line"></i> Clear Changes
                    </button>
                    <button className="admin-action-btn primary" onClick={showEditLog}>
                        <i className="ri-upload-cloud-2-line"></i> Update Site
                    </button>
                </div>

                <div className="admin-footer">
                    Admin Panel v1.0
                </div>
            </div>

            <div className={`admin-glass-overlay ${popup ? 'active' : ''}`} onClick={(e) => {
                if (e.target === e.currentTarget && !popup?.type.includes('confirm') && !popup?.type.includes('undo')) closePopup();
            }}>
                {popup && (
                    <div className={`admin-glass-popup ${popup.type}`} style={popup.type === 'log' ? { maxWidth: '480px', textAlign: 'left' } : {}}>
                        {popup.type === 'success' ? (
                            <i className="ri-checkbox-circle-line popup-icon" style={{ display: 'block', textAlign: 'center', color: '#28a745' }}></i>
                        ) : popup.type === 'log' ? (
                            <i className="ri-history-line popup-icon" style={{ display: 'block', textAlign: 'center', color: 'var(--admin-cyprus)' }}></i>
                        ) : popup.type.includes('confirm') ? (
                            <i className="ri-error-warning-line popup-icon" style={{ display: 'block', textAlign: 'center', color: '#dc3545' }}></i>
                        ) : (
                            <i className="ri-information-line popup-icon" style={{ display: 'block', textAlign: 'center', color: '#f0ad4e' }}></i>
                        )}
                        <h3 style={{ textAlign: 'center' }}>{popup.title}</h3>

                        {popup.type === 'log' ? (
                            <>
                                {popup.log.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#888' }}>No edits have been made yet.</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', maxHeight: '240px', overflowY: 'auto' }}>
                                        {popup.log.map((entry, i) => (
                                            <li key={i} style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,70,67,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                                <span>
                                                    <strong style={{ color: 'var(--admin-cyprus)', textTransform: 'capitalize' }}>{entry.type}</strong>
                                                    {' — '}{entry.title}
                                                </span>
                                                <span style={{ color: '#999', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                                    {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="admin-list-actions" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                    <button className="admin-glass-btn cancel" onClick={closePopup}>Close</button>
                                    <button className="admin-glass-btn confirm" onClick={() => handlePublish()}>Apply Updates</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p style={{ textAlign: 'center' }}>{popup.message}</p>
                                <div className="admin-glass-actions" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                    {popup.type.includes('confirm') ? (
                                        <>
                                            <button className="admin-glass-btn cancel" onClick={closePopup}>No, Cancel</button>
                                            <button className="admin-glass-btn confirm danger" onClick={() => { popup.onConfirm(); closePopup(); }}>Yes, Clear Data</button>
                                        </>
                                    ) : popup.type.includes('undo') ? (
                                        <>
                                            <button className="admin-glass-btn cancel" onClick={closePopup}>No</button>
                                            <button className="admin-glass-btn confirm" style={{ backgroundColor: '#f0ad4e' }} onClick={() => { popup.onConfirm(); closePopup(); }}>Yes, Undo</button>
                                        </>
                                    ) : (
                                        <button className="admin-glass-btn confirm" onClick={closePopup}>Acknowledge</button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
