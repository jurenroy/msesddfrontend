import React, { useState } from 'react';
import './navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = ({
  activePage,
  handleDashboardClick,
  handleChecklistClick,
  handleExamClick,
  handleHomeClick
}) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle button */}
      <div className="toggle-button" onClick={toggleSidebar}>
        <i className={`fas ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </div>
      
      {/* Organization header - only visible when expanded */}
      {expanded && (
        <div className="org-header">
          <div className="org-logo"></div>
          <div className="org-info">
          </div>
        </div>
      )}
      
      {/* Navigation menu */}
      <nav className="nav-menu">
        <ul>
          {/* Dashboard item */}
          <li
            className={activePage === 'dashboard' ? 'active' : ''}
            onClick={handleDashboardClick}
          >
            <div className="nav-icon dashboard-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            {expanded && <span>Dashboard</span>}
          </li>
          
          {/* Checklist item */}
          <li
            className={activePage === 'checklist' ? 'active' : ''}
            onClick={handleChecklistClick}
          >
            <div className="nav-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            {expanded && <span>Checklist</span>}
          </li>
          
          {/* Exam item */}
          <li
            className={activePage === 'exam' ? 'active' : ''}
            onClick={handleExamClick}
          >
            <div className="nav-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            {expanded && <span>Access Exam</span>}
          </li>
          
          {/* Home item */}
          <li 
            className={activePage === 'home' ? 'active' : ''}
            onClick={handleHomeClick}
          >
            <div className="nav-icon home-icon">
              <i className="fas fa-home"></i>
            </div>
            {expanded && <span>Home</span>}
          </li>
        </ul>
      </nav>
      

        </div>
  );
};

export default Navbar;