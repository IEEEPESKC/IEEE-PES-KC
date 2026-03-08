'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function AwardsAdmin() {
    const {
        items: awards,
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
    } = useAdminManager('awards');

    return (
        <>
            <div className="admin-header">
                <h1>Awards</h1>
                <p>Manage individuals/branches receiving awards</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search awards..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-award-fill"></i> Add Award Winner
                </button>
            </div>

            <div className="admin-list">
                {awards.map((award, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            {award.imageUrl ? (
                                <img src={award.imageUrl} alt={award.winner} className="admin-list-image" />
                            ) : (
                                <div className="admin-list-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ri-award-line" style={{ color: '#888', fontSize: '1.5rem' }}></i>
                                </div>
                            )}
                            <div className="admin-card-info">
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--admin-cyprus)', fontWeight: 'bold' }}>{award.winner}</span>
                                    {award.position && <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '8px' }}>({award.position})</span>}
                                </h3>
                                <div className="admin-card-meta">
                                    <span style={{ display: 'block', marginBottom: '4px' }}>
                                        <i className="ri-award-fill" style={{ color: 'gold' }}></i> <strong>{award.awardName}</strong>
                                    </span>
                                    <span style={{ fontSize: '0.9rem', color: '#444' }}><i className="ri-file-info-line"></i> {award.details}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(award); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, award.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>{selectedItem ? 'Edit Award' : 'Add Award Detail'}</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Award Name</label>
                            <input type="text" name="awardName" defaultValue={selectedItem?.awardName || ''} className="admin-form-control" placeholder="E.g. Outstanding Volunteer Award" required />
                        </div>
                        <div className="admin-form-group" style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Winner Name</label>
                                <input type="text" name="winner" defaultValue={selectedItem?.winner || ''} className="admin-form-control" placeholder="E.g. John Doe / CET SB" required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Winner Position (Optional)</label>
                                <input type="text" name="position" defaultValue={selectedItem?.position || ''} className="admin-form-control" placeholder="E.g. Chair" />
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label>Award Photos</label>
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
                            <label>Award Details</label>
                            <textarea name="details" defaultValue={selectedItem?.details || ''} className="admin-form-control" rows="3" placeholder="Context and details of the award..." required></textarea>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">{selectedItem ? 'Save Changes' : 'Add Award'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
