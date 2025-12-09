import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../api/apiClient';
import { Item } from '../types/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ReportsPage.css';

const ReportPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.get<Item[]>('/Items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (err) {
      alert('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Items Report', 14, 22);
    doc.setFontSize(12);

    const tableColumn = ['ID', 'Name', 'Description'];
    const tableRows: any[] = [];

    filteredItems.forEach(item => {
      const itemData = [item.id, item.name, item.description];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('items_report.pdf');
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1 className="report-title">Reports</h1>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name..."
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
          <button className="pdf-btn" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.name}</td>
                  <td>{i.description}</td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan={3}>
                  {searchTerm ? 'No items found matching your search.' : 'No items available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {searchTerm && (
          <div className="search-info">
            Showing {filteredItems.length} of {items.length} items
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;