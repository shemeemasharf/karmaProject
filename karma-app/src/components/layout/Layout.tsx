import React, { useState } from 'react';

import './Layout.css';
import Sidebar from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Start collapsed

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="layout-container">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        onToggle={toggleSidebar} // This will be called on hover
        onLogout={onLogout}
      />
      <div className={`main-content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;