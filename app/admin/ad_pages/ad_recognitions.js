'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function RecognitionsAdmin() {
    const {
        items: recognitions,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        setSelectedItem,
        tempImages,
        newPreviews,
        handleFileChange,
        removeImage,
        handleSubmit,
        handleDelete
    } = useAdminManager('recognitions');

    return (
        <>
            <div className="admin-header">
                <h1>Recognitions</h1>
                <p>Awards and recognitions explicitly given to IEEE PES Kerala Chapter</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search recognitions..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-medal-line"></i> Add Recognition
                </button>
            </div>

            <div className="admin-list">
                {recognitions.map((rec, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            <h3>
                                <i className="ri-medal-fill" style={{ color: 'gold', marginRight: '8px' }}></i>
                                {rec.title}
                                <span className="admin-badge ms-2">{rec.year}</span>
                                {rec.url && (
                                    <a href={rec.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', color: 'var(--admin-cyprus)', fontSize: '1.2rem' }}>
                                        <i className="ri-external-link-line"></i>
                                    </a>
                                )}
                            </h3>
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(rec); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, rec.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>{selectedItem ? 'Edit Recognition' : 'Add Recognition'}</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Recognition Images</label>

                            <div className="admin-image-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                                {tempImages.map((img, i) => (
                                    <div key={`temp-${i}`} style={{ position: 'relative', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img, false)}
                                            style={{ position: 'absolute', top: 0, right: 0, background: '#fa5252', color: 'white', border: 'none', width: '20px', height: '20px', padding: 0, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <i className="ri-subtract-line"></i>
                                        </button>
                                    </div>
                                ))}

                                {newPreviews.map((img, i) => (
                                    <div key={`new-${i}`} style={{ position: 'relative', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #74c0fc' }}>
                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img, true)}
                                            style={{ position: 'absolute', top: 0, right: 0, background: '#fa5252', color: 'white', border: 'none', width: '20px', height: '20px', padding: 0, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <i className="ri-subtract-line"></i>
                                        </button>
                                    </div>
                                ))}

                                <label style={{ height: '60px', border: '2px dashed #004643', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#004643', fontSize: '1.5rem' }}>
                                    <i className="ri-add-line"></i>
                                    <input type="file" name="image" multiple className="admin-form-control" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label>Recognition Title</label>
                            <input type="text" name="title" defaultValue={selectedItem?.title || ''} className="admin-form-control" placeholder="E.g. Outstanding Chapter Award" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Recognition Year</label>
                            <input type="text" name="year" defaultValue={selectedItem?.year || ''} className="admin-form-control" placeholder="E.g. 2025" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Details</label>
                            <textarea name="details" defaultValue={selectedItem?.details || ''} className="admin-form-control" rows="3" placeholder="Additional context about the recognition..."></textarea>
                        </div>
                        <div className="admin-form-group">
                            <label>Reference URL (Optional)</label>
                            <input type="text" name="url" defaultValue={selectedItem?.url || ''} className="admin-form-control" placeholder="https://..." />
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">{selectedItem ? 'Save Changes' : 'Add Recognition'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
