import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './UserDash.css';
import Checklist from '../Checklist/ChecklistView';
import ExamList from '../Exams/ExamList';
import Navbar from './navbar';

const UserDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, trackingCode: paramTrackingCode } = useParams();
  const [activePage, setActivePage] = useState('dashboard');
  const [showChecklist, setShowChecklist] = useState(false);
  const [showExam, setShowExam] = useState(false);
  
  const trackingCode = location.state?.trackingNumber || 
                      location.state?.trackingCodeData?.tracking_code || 
                      paramTrackingCode || 
                      "12345";
  
  // Effect to automatically switch to Checklist after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChecklist(true);
    }, 10000); 

    return () => clearTimeout(timer);
  }, []); 
    
  const handleExamClick = () => {
    setActivePage('exam');
    setShowExam(true);
    setShowChecklist(false);
  };
    
  const handleChecklistClick = () => {
    setActivePage('checklist');
    setShowChecklist(true);
    setShowExam(false);
  };
  
  const handleDashboardClick = () => {
    setActivePage('dashboard');
    setShowChecklist(false);
    setShowExam(false);
  };
  
  const handleHomeClick = () => {
    // Directly navigate to the home route using '/'
    navigate('/');
  };
  
  // Content components for different pages
  const renderContent = () => {
    // Show checklist when explicitly requested or when auto-triggered
    if (showChecklist) {
      return <Checklist role={role || "inspector"} trackingcode={trackingCode} />;
    }
    
    // Show exam when requested
    if (showExam) {
      return <ExamList role={role || "inspector"} trackingCode={trackingCode} />;
    }
    
    // Otherwise, show the regular content based on activePage
    switch(activePage) {
      case 'checklist':
        return (
          <>
            <h2 className="user-dash-title">Safety Inspector - Checklist View</h2>
            <div className="user-dash-announcement">
              <div className="user-dash-announcement-header">
                <h3>CHECKLIST INFORMATION</h3>
                <div className="user-dash-bell">
                  <i className="fas fa-clipboard-check"></i>
                </div>
              </div>
              <div className="user-dash-announcement-content">
                <p>Please click "View Checklist" to access the inspector checklist for tracking code: <strong>{trackingCode}</strong></p>
                <button 
                  className="action-button view-button"
                  onClick={() => setShowChecklist(true)}
                >
                  <i className="fas fa-clipboard-list"></i> View Checklist
                </button>
              </div>
            </div>
          </>
        );
      case 'exam':
        return (
          <>
            <h2 className="user-dash-title">Safety Inspector - Exam Access</h2>
            <div className="user-dash-announcement">
              <div className="user-dash-announcement-header">
                <h3>EXAM INFORMATION</h3>
                <div className="user-dash-bell">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              </div>
              <div className="user-dash-announcement-content">
                <p>Welcome to the Safety Inspector Examination portal. Please click the button below to access the exam list for tracking code: <strong>{trackingCode}</strong></p>
                <button 
                  className="action-button view-button"
                  onClick={() => setShowExam(true)}
                >
                  <i className="fas fa-graduation-cap"></i> View Exam List
                </button>
              </div>
            </div>
          </>
        );
        default: 
        return (
          <>
            <div className="dashboard-header">
              <h2 className="user-dash-title">Safety {role} - Dashboard</h2>
              <p className="tracking-code"><strong>Current Tracking Code:</strong> {trackingCode}</p>
            </div>
            <div className="user-dash-announcement">
              <div className="user-dash-announcement-header">
                <h3>IMPORTANT ANNOUNCEMENT</h3>
                <div className="user-dash-bell">
                  <i className="fas fa-bell"></i>
                </div>
              </div>
              <div className="user-dash-announcement-content">
                <p>Dear {trackingCode}, the Safety {role} Exam is now accessible online. Qualified candidates can register and take the exam through our official examination portal in the left sidebar menu.</p>
              </div>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="user-dash-container">
      {/* Header */}
      <header className="user-dash-header">
        <div className="user-dash-logo"></div>
        <div className="user-dash-org">
          <h1>MGB</h1>
          <p>Mines and Geosciences Bureau</p>
        </div>
      </header>
      
      {/* Main Content Area with Navbar and Content */}
      <div className="user-dash-content">
        {/* Use the Navbar component */}
        <Navbar 
          activePage={activePage} 
          handleDashboardClick={handleDashboardClick}
          handleChecklistClick={handleChecklistClick}
          handleHomeClick={handleHomeClick}
          handleExamClick={handleExamClick}
        />
        
        {/* Content Area */}
        <div className="user-dash-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDash;