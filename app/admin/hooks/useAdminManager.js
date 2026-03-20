'use client';
import { useState, useEffect } from 'react';

export default function useAdminManager(type) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    fetch('admin/api/admin')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data[type]) {
          setItems(data.data[type]);
        }
      })
      .catch(err => console.error(`Error fetching ${type}:`, err));
  }, [type]);
  
  useEffect(() => {
    if (selectedItem) {
      // Check for images array or single imageUrl
      if (selectedItem.images && selectedItem.images.length) {
        setTempImages(selectedItem.images);
      } else if (selectedItem.imageUrl) {
        setTempImages([selectedItem.imageUrl]);
      } else {
        setTempImages([]);
      }
    } else {
      setTempImages([]);
    }
    setNewPreviews([]);
  }, [selectedItem]);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };
  
  const removeImage = (url, isLocal) => {
    if (isLocal) {
      setNewPreviews(prev => prev.filter(img => img !== url));
    } else {
      setTempImages(prev => prev.filter(img => img !== url));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const formData = new FormData(e.target);
    formData.append('type', type);
    
    if (selectedItem) {
      formData.append('editId', selectedItem.id);
      if (tempImages.length > 0) {
        formData.append('keptImages', JSON.stringify(tempImages));
      }
    }
    
    // Add files from newPreviews
    // This requires that files are attached to the input
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
      for (let file of fileInput.files) {
        formData.append('image', file);
      }
    }
    
    try {
      const res = await fetch('admin/api/admin', {
        method: selectedItem ? 'PUT' : 'POST',
        body: formData
      });
      
      if (res.ok) {
        const { item } = await res.json();
        if (selectedItem) {
          setItems(prev => prev.map(i => i.id === selectedItem.id ? item : i));
        } else {
          setItems(prev => [item, ...prev]);
        }
        setSelectedItem(null);
        setIsModalOpen(false);
        e.target.reset();
        setTempImages([]);
        setNewPreviews([]);
      } else {
        const error = await res.json();
        console.error('Upload failed:', error);
      }
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (index, id) => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        const res = await fetch(`admin/api/admin?type=${type}&id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setItems(prev => prev.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };
  
  const openModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  
  return {
    items,
    setItems,
    selectedItem,
    setSelectedItem,
    isModalOpen,
    setIsModalOpen,
    tempImages,
    newPreviews,
    handleFileChange,
    removeImage,
    handleSubmit,
    handleDelete,
    openModal,
    closeModal,
    uploading,
  };
}