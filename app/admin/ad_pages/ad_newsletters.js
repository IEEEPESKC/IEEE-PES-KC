'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function NewslettersAdmin() {
    const {
        items: lists,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        setSelectedItem,
        handleSubmit,
        handleDelete
    } = useAdminManager('newsletters');

    return (
        <>
            <div className="admin-header">
                <h1>Newsletters</h1>
                <p>Publish and manage chapter newsletters</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search newsletters..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-file-upload-line"></i> Upload Newsletter
                </button>
            </div>

            <div className="admin-list">
                {lists.map((file, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            {file.imageUrl ? (
                                <img src={file.imageUrl} alt={file.title} className="admin-list-image" />
                            ) : (
                                <div className="admin-list-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ri-file-text-line" style={{ color: '#888', fontSize: '1.5rem' }}></i>
                                </div>
                            )}
                            <div className="admin-card-info">
                                <h3 style={{ alignItems: 'center' }}>
                                    <i className="ri-file-pdf-2-fill" style={{ color: '#e24036', marginRight: '8px' }}></i>
                                    {file.title}
                                    <span className="admin-badge ms-2">{file.month} {file.year}</span>
                                </h3>
                                <div className="admin-card-meta">
                                    <span><i className="ri-text"></i> {file.subtitle}</span>
                                    <span><i className="ri-hard-drive-2-line"></i> Size: {file.size}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(file); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, file.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>Upload Newsletter PDF</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Newsletter Cover Image</label>
                            <div className="admin-file-upload" style={{ padding: '16px' }} onClick={() => document.getElementById('nl-cover-photo').click()}>
                                <i className="ri-image-add-line" style={{ fontSize: '1.5rem' }}></i>
                                <p>Upload Cover Image</p>
                                <input type="file" id="nl-cover-photo" name="image" accept="image/*" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Newsletter PDF File</label>
                            <div className="admin-file-upload" style={{ padding: '16px' }}>
                                <i className="ri-file-pdf-line" style={{ fontSize: '1.5rem' }}></i>
                                <p>Upload PDF Document</p>
                                <input type="file" accept=".pdf" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={selectedItem?.title || ''} className="admin-form-control" placeholder="E.g. Q2 Chapter Newsletter" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Subtitle</label>
                            <input type="text" name="subtitle" defaultValue={selectedItem?.subtitle || ''} className="admin-form-control" placeholder="Brief subtitle about contents" />
                        </div>

                        <div className="admin-form-group" style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Month</label>
                                <select name="month" defaultValue={selectedItem?.month || ''} className="admin-form-control" required>
                                    <option value="">Select an option...</option>
                                    <option value="january">January</option>
                                    <option value="february">February</option>
                                    <option value="march">March</option>
                                    <option value="april">April</option>
                                    <option value="may">May</option>
                                    <option value="june">June</option>
                                    <option value="july">July</option>
                                    <option value="august">August</option>
                                    <option value="september">September</option>
                                    <option value="october">October</option>
                                    <option value="november">November</option>
                                    <option value="december">December</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Year</label>
                                <input type="number" name="year" className="admin-form-control" defaultValue="2026" required />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>URL (External Link / Redirect)</label>
                            <input type="text" name="url" defaultValue={selectedItem?.url || ''} className="admin-form-control" placeholder="https://..." />
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">Upload Newsletter</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
