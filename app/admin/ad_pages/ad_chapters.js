'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function ChaptersAdmin() {
    const {
        items: chapters,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        setSelectedItem,
        handleSubmit,
        handleDelete
    } = useAdminManager('chapters');

    return (
        <>
            <div className="admin-header">
                <h1>SB Chapters</h1>
                <p>Manage and track PES student branches in Kerala</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search chapters..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-building-3-line"></i> Add Chapter
                </button>
            </div>

            <div className="admin-list">
                {chapters.map((sb, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            <h3>{sb.name}</h3>
                            <div className="admin-card-meta">
                                <span><i className="ri-mail-line"></i> {sb.email}</span>
                                <span><i className="ri-group-line"></i> {sb.members} members</span>
                            </div>
                            {(sb.counselor || sb.advisor || sb.chair) && (
                                <div className="admin-card-meta" style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                                    {sb.chair && <span><i className="ri-user-star-line"></i> Chair: {sb.chair}</span>}
                                    {sb.counselor && <span><i className="ri-user-heart-line"></i> Counselor: {sb.counselor}</span>}
                                </div>
                            )}
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(sb); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, sb.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>{selectedItem ? 'Edit Student Branch' : 'Add Student Branch'}</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Chapter Name</label>
                            <input type="text" name="name" defaultValue={selectedItem?.name || ''} className="admin-form-control" placeholder="E.g. National Institute of Technology SB" required />
                        </div>
                        <div className="admin-form-group">
                            <label>SB Contact Email</label>
                            <input type="email" name="email" defaultValue={selectedItem?.email || ''} className="admin-form-control" placeholder="sb@example.edu" required />
                        </div>

                        <div className="admin-form-group">
                            <label>Total Membership Count</label>
                            <input type="number" name="members" className="admin-form-control" defaultValue={selectedItem?.members || '0'} required />
                        </div>

                        <div className="admin-form-group">
                            <label>SB Counselor Name (Optional)</label>
                            <input type="text" name="counselor" defaultValue={selectedItem?.counselor || ''} className="admin-form-control" placeholder="Name of SB Counselor" />
                        </div>

                        <div className="admin-form-group">
                            <label>SBC Advisor Name (Optional)</label>
                            <input type="text" name="advisor" defaultValue={selectedItem?.advisor || ''} className="admin-form-control" placeholder="Name of SBC Advisor" />
                        </div>

                        <div className="admin-form-group">
                            <label>SB/SBC Chair Name (Optional)</label>
                            <input type="text" name="chair" defaultValue={selectedItem?.chair || ''} className="admin-form-control" placeholder="Name of SB/SBC Chair" />
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">{selectedItem ? 'Save Changes' : 'Submit Chapter'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
