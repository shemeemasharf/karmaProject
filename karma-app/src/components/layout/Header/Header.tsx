import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      background: '#fff',
      padding: '16px 24px',
      borderBottom: '1px solid #e8e8e8'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Dashboard</h1>
    </header>
  );
};

export default Header;