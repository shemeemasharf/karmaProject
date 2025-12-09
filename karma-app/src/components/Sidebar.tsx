import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes, FileText, LogOut, Sparkles } from "lucide-react";
import './Sidebar.css';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, onLogout }) => {
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (!isExpanded && window.innerWidth > 1024) {
      onToggle();
    }
  };
  
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (isExpanded && window.innerWidth > 1024) {
        onToggle();
      }
    }, 300);
  };
  
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
 
        {isExpanded && <h3 className="sidebar-title">Karma</h3>}
      </div>

      <ul className="menu">
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={22} className="icon" />
            {isExpanded && <span className="menu-text">Dashboard</span>}
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/items" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <Boxes size={22} className="icon" />
            {isExpanded && <span className="menu-text">Items</span>}
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <FileText size={22} className="icon" />
            {isExpanded && <span className="menu-text">Reports</span>}
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} className="icon" />
          {isExpanded && <span className="menu-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;