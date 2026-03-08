'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function GalleryAdmin() {
    const {
        items: images,
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
    } = useAdminManager('gallery');

    return (
        <>
            <div className="admin-header">
                <h1>Image Gallery</h1>
                <p>Manage photos explicitly appearing on home page or the specific gallery page</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search images..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-upload-2-line"></i> Upload Images
                </button>
            </div>

            <div className="admin-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {images.map((img, index) => (
                    <div className="admin-card" key={index} style={{ flexDirection: 'column', padding: '16px', alignItems: 'stretch', marginBottom: 0 }}>
                        <div style={{ width: '100%', height: '160px', backgroundColor: '#e0dcd0', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {img.imageUrl ? (
                                <img src={img.imageUrl} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <i className="ri-image-line" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
                            )}
                        </div>
                        <div className="admin-card-info" style={{ marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                                {img.album || img.name}
                                <span className="admin-badge ms-2" style={{ fontSize: '0.65rem' }}>{img.location}</span>
                            </h3>
                            <div className="admin-card-meta" style={{ fontSize: '0.8rem', gap: '12px' }}>
                                <span>{img.date}</span>
                                <span>{img.size}</span>
                                <span>{img.type}</span>
                            </div>
                        </div>
                        <div className="admin-card-actions" style={{ justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                            <button className="admin-btn-text" style={{ padding: '4px' }} onClick={() => { setSelectedItem(img); setIsModalOpen(true); }}>Edit Details</button>
                            <button className="admin-btn-text" style={{ padding: '4px', color: '#dc3545' }} onClick={() => handleDelete(index, img.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>Upload Images</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Gallery Images</label>

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

                        <div className="admin-form-group" style={{ marginTop: '24px' }}>
                            <label>Album/Event Name</label>
                            <input type="text" name="album" defaultValue={selectedItem?.album || ''} className="admin-form-control" placeholder="E.g. Workshop 2026" required />
                        </div>

                        <div className="admin-form-group">
                            <label>Display Location</label>
                            <select name="location" defaultValue={selectedItem?.location || ''} className="admin-form-control" required>
                                <option value="">Select where this image appears...</option>
                                <option value="home">Home Page</option>
                                <option value="gallery">Gallery Page</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">{selectedItem ? 'Save Changes' : 'Upload'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
