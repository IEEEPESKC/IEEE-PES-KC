'use client';
import { useState, useEffect } from 'react';
import useAdminManager from '../hooks/useAdminManager';

export default function EventsAdmin() {
    const {
        items: events,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        setSelectedItem,
        tempImages,
        newPreviews,
        handleFileChange,
        removeImage,
        handleSubmit,
        handleDelete,
        openModal,
        closeModal
    } = useAdminManager('events');

    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (selectedItem) {
            setIsOnline(selectedItem.location === 'Online');
        } else {
            setIsOnline(false);
        }
    }, [selectedItem]);

    return (
        <>
            <div className="admin-header">
                <h1>Events</h1>
                <p>Manage and organize chapter events</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search events..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-add-line"></i> Add Event
                </button>
            </div>

            <div className="admin-list">
                {events.map((event, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.title} className="admin-list-image" />
                            ) : (
                                <div className="admin-list-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ri-image-line" style={{ color: '#888', fontSize: '1.5rem' }}></i>
                                </div>
                            )}
                            <div className="admin-card-info">
                                <h3>
                                    {event.title}
                                    <span className="admin-badge">{event.status}</span>
                                </h3>
                                <div className="admin-card-meta">
                                    <span><i className="ri-calendar-line"></i> {event.date}</span>
                                    <span><i className="ri-map-pin-line"></i> {event.location}</span>
                                    <span><i className="ri-price-tag-3-line"></i> {event.tag}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(event); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, event.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>{selectedItem ? 'Edit Event' : 'Add New Event'}</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Event Images</label>

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
                            <label>Event Title</label>
                            <input type="text" name="title" defaultValue={selectedItem?.title || ''} className="admin-form-control" placeholder="Event Name" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea name="description" defaultValue={selectedItem?.description || ''} className="admin-form-control" rows="4" placeholder="Detailed event description..." style={{ whiteSpace: 'pre-wrap' }}></textarea>
                        </div>
                        <div className="admin-form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ marginBottom: 0 }}>Location</label>
                                <label style={{ marginBottom: 0, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} style={{ marginRight: '6px' }} />
                                    Online Event
                                </label>
                            </div>
                            {isOnline ? (
                                <input type="hidden" name="location" value="Online" />
                            ) : (
                                <input type="text" name="location" defaultValue={selectedItem?.location || ''} className="admin-form-control" placeholder="E.g. Kochi, Kerala" required />
                            )}
                        </div>
                        <div className="admin-form-group" style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Date</label>
                                <input type="date" name="date" defaultValue={selectedItem?.date || ''} className="admin-form-control" required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Time (Optional)</label>
                                <input type="time" name="time" defaultValue={selectedItem?.time || ''} className="admin-form-control" />
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label>Custom URL (Paste Link)</label>
                            <input type="text" name="customUrl" defaultValue={selectedItem?.customUrl || ''} className="admin-form-control" placeholder="https://example.com" />
                        </div>
                        <div className="admin-form-group">
                            <label>Or Internal Redirection</label>
                            <select name="url" defaultValue={selectedItem?.url || ''} className="admin-form-control">
                                <option value="">Select Redirection...</option>
                                <option value="home">Home Page</option>
                                <option value="upcoming">Events (Upcoming)</option>
                                <option value="past">Events (Past)</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Event Tag</label>
                            <select name="tag" defaultValue={selectedItem?.tag || ''} className="admin-form-control" required>
                                <option value="">Select a tag...</option>
                                <option value="akpessc">AKPESSC</option>
                                <option value="wow">WOW</option>
                                <option value="pes_day">PES Day Events</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="admin-btn-primary">Save Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
