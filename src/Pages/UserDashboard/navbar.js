import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StatusbyTrackingCode } from '../Services/ChecklistStatusService';
import './navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = ({
  activePage,
  handleDashboardClick,
  handleChecklistClick,
  handleExamClick,
  handleHomeClick,
  handleApplicationClick,
  handlePermitClick,
  trackingCode
}) => {
  const [expanded, setExpanded] = useState(true);
  const [latestStatus, setLatestStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLatestStatus = async (code) => {
    setIsLoadingStatus(true);
    setStatusError(null);
    try {
      const result = await StatusbyTrackingCode(code);
      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Sort data newest first by created_at
        const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestStatus(sortedData[0].status);
      } else {
        setLatestStatus(null);
      }
    } catch (error) {
      setStatusError(error.message || 'Failed to fetch status');
      setLatestStatus(null);
    } finally {
      setIsLoadingStatus(false);
    }
  };
  useEffect(() => {
    if (trackingCode) {
      fetchLatestStatus(trackingCode);
    }
  }, [trackingCode]);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  // Custom handler for exam click that passes tracking code
  const onExamClick = () => {
    // Get tracking code from props or location state
    const currentTrackingCode = trackingCode || location.state?.trackingNumber || location.state?.trackingCodeData?.tracking_code;
    
    if (currentTrackingCode) {
      navigate(`/safety/inspector/existing/exam_list`, {
        state: { 
          trackingCodeData: { tracking_code: currentTrackingCode },
          showNavbar: true
        }
      });
    }
    
    // Still call the original handler if provided
    if (handleExamClick) {
      handleExamClick();
    }
  };
  
  // Custom handler for checklist click
  const onChecklistClick = () => {
    // Get tracking code from props or location state
    const currentTrackingCode = trackingCode || location.state?.trackingNumber || location.state?.trackingCodeData?.tracking_code;
    
    if (window.location.pathname.includes('exam_list')) {
      // We're on the exam list page, need to navigate to dashboard first
      navigate(`/safety/inspector/dashboard`, {
        state: { 
          trackingCodeData: { tracking_code: currentTrackingCode },
          showChecklist: true  // Signal to show checklist on load
        }
      });
    } else {
      // We're already on a page with the modal capability, just call the handler
      if (handleChecklistClick) {
        handleChecklistClick();
      }
    }
  };
  
  // Custom handler for application click
  const onApplicationClick = () => {
    // Get tracking code from props or location state
    const currentTrackingCode = trackingCode || location.state?.trackingNumber || location.state?.trackingCodeData?.tracking_code;
    
    if (window.location.pathname.includes('exam_list')) {
      // We're on the exam list page, need to navigate to dashboard first
      navigate(`/safety/inspector/dashboard`, {
        state: { 
          trackingCodeData: { tracking_code: currentTrackingCode },
          showApplication: true  // Signal to show application on load
        }
      });
    } else {
      // We're already on a page with the modal capability, just call the handler
      if (handleApplicationClick) {
        handleApplicationClick();
      }
    }
  };

  // Custom handler for application click
  const onPermitClick = () => {
    // Get tracking code from props or location state
    const currentTrackingCode = trackingCode || location.state?.trackingNumber || location.state?.trackingCodeData?.tracking_code;
    
    if (window.location.pathname.includes('exam_list')) {
      // We're on the exam list page, need to navigate to dashboard first
      navigate(`/safety/inspector/dashboard`, {
        state: { 
          trackingCodeData: { tracking_code: currentTrackingCode },
          showApplication: true  // Signal to show application on load
        }
      });
    } else {
      // We're already on a page with the modal capability, just call the handler
      if (handlePermitClick) {
        handlePermitClick();
      }
    }
  };
  
  return (
    <div className={`mgb-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle button */}
      <div className="mgb-sidebar-toggle-button" onClick={toggleSidebar}>
        <i className={`fas ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </div>
      
      {/* Organization header - only visible when expanded */}
      {expanded && (
        <div className="mgb-sidebar-org-header">
          <div className="org-logo"></div>
          <div className="org-info">
          </div>
        </div>
      )}
      
      {/* Navigation menu */}
      <nav className="mgb-sidebar-nav-menu">
        <ul>
          {/* Dashboard item */}
          <li
            className={activePage === 'dashboard' ? 'active' : ''}
            onClick={handleDashboardClick}
          >
            <div className="mgb-sidebar-nav-icon mgb-sidebar-dashboard-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            {expanded && <span>Dashboard</span>}
          </li>
          
          {/* Checklist item */}
          <li
            className={activePage === 'checklist' ? 'active' : ''}
            onClick={onChecklistClick}
          >
            <div className="mgb-sidebar-nav-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            {expanded && <span>Checklist</span>}
          </li>
          
          {/* Exam item - Now uses our custom handler */}
          <li
            className={activePage === 'exam' ? 'active' : ''}
            onClick={onExamClick}
          >
            <div className="mgb-sidebar-nav-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            {expanded && <span>Access Exam</span>}
          </li>
          
          {/* Application item - Now uses custom handler */}
          <li
            className={activePage === 'application' ? 'active' : ''}
            onClick={onApplicationClick}
          >
            <div className="mgb-sidebar-nav-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            {expanded && <span>Application</span>}
          </li>

          {/*Permit Item*/}
          {/* Permit item shown only if latestStatus is 'approved' */}
          {latestStatus === 'approved' && (
            <li
              className={activePage === 'permit' ? 'active' : ''}
              onClick={onPermitClick}
            >
              <div className="mgb-sidebar-nav-icon">
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              {expanded && <span>Permit</span>}
            </li>
          )}
          
          {/* Home item */}

          <li
            className={activePage === 'home' ? 'active' : ''}
            onClick={handleHomeClick}
          >
            <div className="mgb-sidebar-nav-icon mgb-sidebar-home-icon">
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