import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './UserDash.css';
import Checklist from '../Checklist/ChecklistView';
import ExamList from '../Exams/ExamList';
import Navbar from './navbar';
import TrackingDocumentView from "../TrackingDocument/TrackingDocumentView";
import ApprovalModal from './ApprovalModal';

const UserDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, trackingCode: paramTrackingCode } = useParams();
  const [activePage, setActivePage] = useState('dashboard');
  const [showChecklist, setShowChecklist] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approvalDate: "May 8, 2025",
    adminName: "Admin Officer",
    lastUpdated: "May 8, 2025"
  });

  // Application view state variables
  const [showApplicationView, setShowApplicationView] = useState(false);
  const [selectedApplicationTrackingCode, setSelectedApplicationTrackingCode] = useState('');
  const [selectedApplicationRole, setSelectedApplicationRole] = useState('');
  
  // Approval modal state variables
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('pending'); // 'approved' or 'pending'
  
  const trackingCode = location.state?.trackingNumber || 
                      location.state?.trackingCodeData?.tracking_code || 
                      paramTrackingCode || 
                      "12345";


useEffect(() => {
  // Check if we need to show specific content based on navigation state
  if (location.state?.showApplication) {
    setActivePage('application');
    setShowApplication(true);
    setShowChecklist(false);
    setShowExam(false);
  } else if (location.state?.showChecklist) {
    setActivePage('checklist');
    setShowChecklist(true);
    setShowApplication(false);
    setShowExam(false);
  }
}, [location.state]);

  useEffect(() => {
    if (showApplicationView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showApplicationView]);
    
  const handleExamClick = () => {
    setActivePage('exam');
    setShowExam(true);
    setShowChecklist(false);
    setShowApplication(false);
  };
    
  const handleChecklistClick = () => {
    setActivePage('checklist');
    setShowChecklist(true);
    setShowExam(false);
    setShowApplication(false);
  };
  
  const handleDashboardClick = () => {
    setActivePage('dashboard');
    setShowChecklist(false);
    setShowExam(false);
    setShowApplication(false);
  };
  
  const handleApplicationClick = () => {
    setActivePage('application');
    setShowApplication(true);
    setShowChecklist(false);
    setShowExam(false);
  };
  
  const handleHomeClick = () => {
    // Directly navigate to the home route using '/'
    navigate('/');
  };
  
  // Function to open application view
  const handleViewApplication = () => {
    setShowApplicationView(true);
    setSelectedApplicationRole(role || "inspector");
    setSelectedApplicationTrackingCode(trackingCode);
  };
  
  // Functions to handle approval modal
  const openApprovalModal = (status) => {
    setApprovalStatus(status);
    setIsApprovalModalOpen(true);
  };
  
  const closeApprovalModal = () => {
    setIsApprovalModalOpen(false);
  };
  
  // Content components for different pages
  const renderContent = () => {
    if (showChecklist) {
      return <Checklist role={role || "inspector"} trackingcode={trackingCode} />;
    }
    
    if (showExam) {
      return <ExamList role={role || "inspector"} trackingCode={trackingCode} />;
    }
    
    // Show application when requested
    if (showApplication) {
      return (
        <div className="application-container">
          <h2>Application Management</h2>
          <div className="application-info">
            <p>Tracking Code: <strong>{trackingCode}</strong></p>
            <div className="application-status">
              <h3>Application Status</h3>
              <div className="status-item">
                <span className="status-label">Current Status</span>
                <span className="status-value">Under Review</span>
              </div>
              <div className="status-item">
                <span className="status-label">Submission Date</span>
                <span className="status-value">May 3, 2025</span>
              </div>
              <div className="status-item">
                <span className="status-label">Estimated Completion</span>
                <span className="status-value">May 15, 2025</span>
              </div>
            </div>
            <div className="application-actions">
              <button 
                className="application-button"
                onClick={handleViewApplication}
              >
                <i className="fas fa-edit"></i> View Application
              </button>
              <button 
                className="application-button status-check-button"
                onClick={() => openApprovalModal('pending')}
              >
                <i className="fas fa-clipboard-check"></i> Check Status
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Otherwise, show the regular content based on activePage
    switch(activePage) {
  
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

      case 'application':
        return (
          <>
            <h2 className="user-dash-title">Safety Inspector - Application Management</h2>
            <div className="user-dash-announcement">
              <div className="user-dash-announcement-header">
                <h3>APPLICATION INFORMATION</h3>
                <div className="user-dash-bell">
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
              <div className="user-dash-announcement-content">
                <p>You can manage your safety inspector application with tracking code: <strong>{trackingCode}</strong></p>
                <div className="action-buttons">
                  <button 
                    className="action-button view-button"
                    onClick={() => setShowApplication(true)}
                  >
                    <i className="fas fa-file-alt"></i> View Application
                  </button>
                  <button 
                    className="action-button status-button"
                    onClick={() => openApprovalModal('pending')}
                  >
                    <i className="fas fa-clipboard-check"></i> Check Status
                  </button>
                </div>
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
            
            {/* Two-column layout for dashboard content */}
            <div className="dashboard-columns">
              {/* Announcement Card */}
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
              
              {/* Approval Status Card */}
              <div className="status-card">
                <div className="status-card-header">
                  <h3>APPROVAL STATUS</h3>
                  <div className="status-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
                <div className="status-card-content">
                  <div className="status-badge approved">
                    <i className="fas fa-check-circle"></i> Approved
                  </div>
                  
                  <div className="status-details">
                    <div className="status-item">
                      <span className="status-label">Approval Date</span>
                      <span className="status-value">{approvalData.approvalDate}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Approved By</span>
                      <span className="status-value">{approvalData.adminName}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Last Updated</span>
                      <span className="status-value">{approvalData.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="status-actions">
                    <button 
                      className="action-button approval-status-button"
                      onClick={() => openApprovalModal('approved')}
                    >
                      <i className="fas fa-search"></i> View Details
                    </button>
                  </div>
                </div>
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
          handleApplicationClick={handleApplicationClick}
          trackingCode={trackingCode}
        />
        
        {/* Content Area */}
        <div className="user-dash-main">
          {renderContent()}
        </div>
      </div>

      {/* Application View Overlay */}
      {showApplicationView && (
        <div className="document-overlay">
          <div className="document-overlay-content">
            <button 
              className="document-overlay-close-button"
              onClick={() => { 
                setShowApplicationView(false); 
                setSelectedApplicationRole(''); 
                setSelectedApplicationTrackingCode(''); 
              }}
            >
              ×
            </button>
            <div className="document-overlay-header">
              <h2>Application Document - {selectedApplicationTrackingCode}</h2>
              <p>Role: {selectedApplicationRole}</p>
            </div>
            <div className="document-content-wrapper">
              <TrackingDocumentView 
                role={selectedApplicationRole} 
                trackingcode={selectedApplicationTrackingCode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      <ApprovalModal 
        isOpen={isApprovalModalOpen}
        onClose={closeApprovalModal}
        status={approvalStatus}
        trackingCode={trackingCode}
        approvalDate="May 8, 2025"
        safetyName={`Applicant ${trackingCode}`}
      />
    </div>
  );
};

export default UserDash;