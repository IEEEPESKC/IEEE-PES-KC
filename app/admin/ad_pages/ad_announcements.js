'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function AnnouncementsAdmin() {
    const {
        items,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        setSelectedItem,
        handleSubmit,
        handleDelete
    } = useAdminManager('announcements');

    const isArchived = (deadline) => {
        if (!deadline) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        return today > deadlineDate;
    };

    return (
        <>
            <div className="admin-header">
                <h1>Announcements</h1>
                <p>Broadcast updates to the chapter members</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search announcements..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-add-line"></i> Create Announcement
                </button>
            </div>

            <div className="admin-list">
                {items.map((item, index) => {
                    const archived = isArchived(item.deadline);
                    return (
                        <div className="admin-card" key={index} style={{ opacity: archived ? 0.6 : 1 }}>
                            <div className="admin-card-content">
                                <h3>
                                    {item.title}
                                    <span className={`admin-badge ${archived ? 'danger' : ''}`}>
                                        {archived ? 'Archived' : item.tag}
                                    </span>
                                </h3>
                                <div className="admin-card-meta">
                                    <span><i className="ri-calendar-line"></i> Posted: {item.date || 'N/A'}</span>
                                    <span><i className="ri-time-line"></i> Deadline: {item.deadline || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="admin-card-actions">
                                <button className="admin-btn-text" onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}>Edit</button>
                                <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, item.id)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>Create Announcement</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Announcement Tag</label>
                            <select name="tag" defaultValue={selectedItem?.tag || ''} className="admin-form-control" required>
                                <option value="">Select a tag...</option>
                                <option value="new">New</option>
                                <option value="important">Important</option>
                                <option value="archived">Archived</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="closes_soon">Closes Soon</option>
                                <option value="stay_tuned">Stay Tuned</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={selectedItem?.title || ''} className="admin-form-control" placeholder="Short headline" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Subtitle / Description</label>
                            <textarea name="subtitle" defaultValue={selectedItem?.subtitle || ''} className="admin-form-control" rows="2" placeholder="Brief subtitle..."></textarea>
                        </div>
                        <div className="admin-form-group">
                            <label>Target URL Action</label>
                            <input type="text" name="url" defaultValue={selectedItem?.url || ''} className="admin-form-control" placeholder="https://..." />
                        </div>
                        <div className="admin-form-group">
                            <label>Deadline / Expiration</label>
                            <input type="date" name="deadline" defaultValue={selectedItem?.deadline || ''} className="admin-form-control" required />
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">Publish</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
