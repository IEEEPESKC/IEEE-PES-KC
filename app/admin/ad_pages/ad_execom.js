'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function ExecomAdmin() {
    const {
        items: members,
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
    } = useAdminManager('execom');

    // Grouping logic
    const groupedMembers = members.reduce((acc, member) => {
        const cat = member.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(member);
        return acc;
    }, {});

    return (
        <>
            <div className="admin-header">
                <h1>Execom</h1>
                <p>Manage Executive Committee members and roles</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search members..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-user-add-line"></i> Add Member
                </button>
            </div>

            <div className="admin-list">
                {Object.keys(groupedMembers).sort().map((category) => (
                    <div key={category} className="admin-category-section" style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--admin-cyprus)', borderBottom: '2px solid #ddd', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {category}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {groupedMembers[category].map((member, index) => (
                                <div className="admin-card" key={member.id} style={{ marginBottom: 0 }}>
                                    <div className="admin-card-content">
                                        {member.imageUrl ? (
                                            <img src={member.imageUrl} alt={member.name} className="admin-list-image" style={{ borderRadius: '50%' }} />
                                        ) : (
                                            <div className="admin-list-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                                <i className="ri-user-line" style={{ color: '#888', fontSize: '1.5rem' }}></i>
                                            </div>
                                        )}
                                        <div className="admin-card-info">
                                            <h3>
                                                {member.name}
                                                <span className="admin-badge">{member.role}</span>
                                            </h3>
                                            <div className="admin-card-meta">
                                                <span><i className="ri-mail-line"></i> {member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-card-actions">
                                        <button className="admin-btn-text" onClick={() => { setSelectedItem(member); setIsModalOpen(true); }}>Edit</button>
                                        <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, member.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>{selectedItem ? 'Edit Member' : 'Add Execom Member'}</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Execom Category</label>
                            <select name="category" defaultValue={selectedItem?.category || ''} className="admin-form-control" required>
                                <option value="">Select a category...</option>
                                <option value="professionals">Professionals</option>
                                <option value="slt">SLT</option>
                                <option value="gsac">GSAC</option>
                                <option value="yp">YP</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Profile Image</label>
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
                                    <input type="file" name="image" className="admin-form-control" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" defaultValue={selectedItem?.name || ''} className="admin-form-control" placeholder="Dr. John Doe" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Position / Role</label>
                            <input type="text" name="role" defaultValue={selectedItem?.role || ''} className="admin-form-control" placeholder="E.g. Secretary" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Contact Email</label>
                            <input type="email" name="email" defaultValue={selectedItem?.email || ''} className="admin-form-control" placeholder="example@ieee.org" required />
                        </div>
                        <div className="admin-form-group">
                            <label>LinkedIn Profile URL</label>
                            <input type="text" name="linkedin" defaultValue={selectedItem?.linkedin || ''} className="admin-form-control" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">{selectedItem ? 'Save Changes' : 'Add Member'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
