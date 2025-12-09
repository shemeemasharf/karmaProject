import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './AddItemPage.css';

interface ItemFormData {
  name: string;
  description: string;
}

const AddItemPage: React.FC = () => {
  const [item, setItem] = useState<ItemFormData>({ name: '', description: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!item.name.trim() || !item.description.trim()) {
      alert('Please enter both name and description');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      await apiClient.post('/Items', item, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Item added successfully!');
      navigate('/items');
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/items');
  };

  return (
    <div className="add-item-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={handleCancel}
          type="button"
        >
          ← Back to Items
        </button>
        <h1 className="page-title">Add New Item</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              placeholder="Enter item description"
              rows={4}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !item.name.trim() || !item.description.trim()}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;