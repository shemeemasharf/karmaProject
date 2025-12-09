import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Item } from '../types/types';
import './ItemPage.css';

const ItemPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const fetchItems = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.get<Item[]>('/Items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      alert('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleDelete = async (id: number): Promise<void> => {
    const confirmDelete = window.confirm('Are you sure to delete this item?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token') || '';
      await apiClient.delete(`/Items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i.id !== id));
      alert('Item deleted successfully');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleUpdate = async (id: number): Promise<void> => {
    const updatedName = prompt('Enter new name');
    const updatedDesc = prompt('Enter new description');

    if (!updatedName || !updatedDesc) return;

    try {
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.put<Item>(
        `/Items/${id}`,
        { name: updatedName, description: updatedDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(items.map(i => (i.id === id ? response.data : i)));
      alert('Item updated successfully');
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const navigateToAddItem = (): void => {
    navigate('/items/add');
  };

  return (
    <div className="items-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Items</h1>
          {searchTerm && (
            <div className="search-info">
              Found {filteredItems.length} of {items.length} items
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            className="add-btn"
            onClick={navigateToAddItem}
          >
            + Add New Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p className="empty-title">
            {searchTerm ? 'No items found matching your search.' : 'No items found.'}
          </p>
          <p className="empty-subtitle">
            {searchTerm ? 'Try a different search term.' : 'Add your first item to get started!'}
          </p>
          {searchTerm ? (
            <button 
              className="clear-search-btn-large"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          ) : (
            <button 
              className="add-btn"
              onClick={navigateToAddItem}
            >
              Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(i => (
                <tr key={i.id}>
                  <td className="id-cell">{i.id}</td>
                  <td className="name-cell">{i.name}</td>
                  <td className="desc-cell">{i.description}</td>
                <td className="actions">
  <div className="action-buttons">
    <button 
      className="update-btn" 
      onClick={() => handleUpdate(i.id)}
    >
       Update
    </button>
    <button 
      className="delete-btn" 
      onClick={() => handleDelete(i.id)}
    >
       Delete
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemPage;