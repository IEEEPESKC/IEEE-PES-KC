'use client';
import { useState, useEffect } from 'react';

export default function MagazinesAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [lists, setLists] = useState([]);

    useEffect(() => {
        fetch('/api/admin')
            .then(res => res.json())
            .then(data => {
                if (data.magazines) {
                    setLists(data.magazines);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('type', 'magazines');
        if (selectedItem) formData.append('editId', selectedItem.id);

        try {
            const res = await fetch('/api/admin', {
                method: selectedItem ? 'PUT' : 'POST',
                body: formData
            });
            if (res.ok) {
                const { item } = await res.json();
                if (selectedItem) {
                    setLists(lists.map(i => i.id === selectedItem.id ? item : i));
                } else {
                    setLists([item, ...lists]);
                }
                setSelectedItem(null);
                setIsModalOpen(false);
                e.target.reset();
            }
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    const handleDelete = async (index, id) => {
        if (id) {
            await fetch(`/api/admin?type=magazines&id=${id}`, { method: 'DELETE' });
        }
        setLists(lists.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="admin-header">
                <h1>Magazines</h1>
                <p>Publish and manage technical magazines and deep-dives</p>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <i className="ri-search-line"></i>
                    <input type="text" placeholder="Search magazines..." />
                </div>
                <button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    <i className="ri-book-read-line"></i> Upload Magazine
                </button>
            </div>

            <div className="admin-list">
                {lists.map((mag, index) => (
                    <div className="admin-card" key={index}>
                        <div className="admin-card-content">
                            {mag.imageUrl ? (
                                <img src={mag.imageUrl} alt={mag.title} className="admin-list-image" />
                            ) : (
                                <div className="admin-list-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ri-book-open-line" style={{ color: '#888', fontSize: '1.5rem' }}></i>
                                </div>
                            )}
                            <div className="admin-card-info">
                                <h3 style={{ alignItems: 'center' }}>
                                    <i className="ri-book-mark-fill" style={{ color: 'var(--admin-cyprus)', marginRight: '8px' }}></i>
                                    {mag.title}
                                    <span className="admin-badge ms-2">{mag.month} {mag.year}</span>
                                </h3>
                                <div className="admin-card-meta">
                                    <span><i className="ri-text"></i> {mag.subtitle}</span>
                                    <span><i className="ri-hard-drive-2-line"></i> Size: {mag.size}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-card-actions">
                            <button className="admin-btn-text" onClick={() => { setSelectedItem(mag); setIsModalOpen(true); }}>Edit</button>
                            <button className="admin-btn-text" style={{ color: '#dc3545' }} onClick={() => handleDelete(index, mag.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`admin-sidepanel-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className={`admin-sidepanel ${isModalOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="admin-sidepanel-header">
                        <h2>Upload Magazine Issue</h2>
                        <button className="admin-sidepanel-close" onClick={() => setIsModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">
                        <div className="admin-form-group">
                            <label>Magazine Cover Image</label>
                            <div className="admin-file-upload" style={{ padding: '16px' }} onClick={() => document.getElementById('mag-cover-photo').click()}>
                                <i className="ri-image-add-line" style={{ fontSize: '1.5rem' }}></i>
                                <p>Upload Cover Image</p>
                                <input type="file" id="mag-cover-photo" name="image" accept="image/*" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Magazine PDF Document</label>
                            <div className="admin-file-upload" style={{ padding: '16px' }}>
                                <i className="ri-book-3-line" style={{ fontSize: '1.5rem' }}></i>
                                <p>Upload Magazine PDF</p>
                                <input type="file" accept=".pdf" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={selectedItem?.title || ''} className="admin-form-control" placeholder="E.g. Electra Magazine" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Subtitle / Details</label>
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
                            <button type="submit" className="admin-btn-primary">Publish Magazine</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
