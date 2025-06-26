import React, { useState, useEffect } from 'react';
import './ApprovalModal.css';
import { StatusbyTrackingCode } from "../Services/ChecklistStatusService";

const ApprovalModal = ({ 
  isOpen, 
  onClose, 
  status = 'pending', 
  trackingCode, 
  approvalDate, 
  safetyName,
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString());
  const [actualApprovalDate, setActualApprovalDate] = useState(approvalDate || '');
  const [notifications, setNotifications] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && trackingCode) {
      setIsLoading(true);
      
      // Helper function to get a readable message for each status
      const getStatusMessage = (status) => {
        switch (status) {
          case 'approved':
            return "Application approved";
          case 'rejected':
            return "Application rejected";
          case 'pending':
            return "Application under review";
          case 'in-progress':
            return "Documentation review in progress";
          case 'received':
            return "Application received and processing started";
          default:
            return `Status updated to: ${status}`;
        }
      };
      
      // Helper function to set default notifications if API call fails - moved inside useEffect
      const setDefaultNotifications = () => {
        setNotifications([
          {
            date: status === 'approved' ? actualApprovalDate || approvalDate || new Date().toLocaleDateString() : new Date().toLocaleDateString(),
            message: status === 'approved' ? "Application approved" : "Application under review",
            status: status,
            admin: "System"
          },
          {
            date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(), // 3 days ago
            message: "Documentation review completed",
            status: "in-progress",
            admin: "System"
          },
          {
            date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(), // 5 days ago
            message: "Application received and processing started",
            status: "received",
            admin: "System"
          }
        ]);
      };
      
      const fetchStatusData = async () => {
        try {
          // Call the service function with the tracking code
          const result = await StatusbyTrackingCode(trackingCode);
          
          if (result.success && result.data && Array.isArray(result.data)) {
            // Format the approval date from the API response
            if (result.data.length > 0 && result.data[0].status === 'approved') {
              // Convert the ISO date string to a readable date format
              const apiApprovalDate = new Date(result.data[0].created_at).toLocaleDateString();
              setActualApprovalDate(apiApprovalDate);
              console.log(result.data)
            }
            
            // Transform the API response data into timeline items
            const statusHistory = result.data.map(item => ({
              date: new Date(item.created_at).toLocaleDateString(),
              message: getStatusMessage(item.status),
              status: item.status,
              admin: "System" // You might want to replace this with actual admin data if available
            }));
            
            // Sort by date (newest first)
            statusHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Get the most recent status
            const latestStatus = statusHistory.length > 0 ? statusHistory[0] : null;
            
            if (latestStatus) {
              // Update the current status
              setCurrentStatus(latestStatus.status);
              setLastUpdated(latestStatus.date);
              
              // Set the notifications with the actual status history
              setNotifications(statusHistory);
            } else {
              // Fallback to default values if no history found
              setDefaultNotifications();
            }
          } else {
            // Fallback to simulated data if API call fails or returns unexpected data
            setDefaultNotifications();
          }
        } catch (error) {
          console.error("Error fetching approval status:", error);
          setDefaultNotifications();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStatusData();
    }
  }, [isOpen, trackingCode, status, approvalDate, actualApprovalDate]); // Added actualApprovalDate as dependency

  // Helper function moved inside useEffect above
  const getStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return "Application approved";
      case 'rejected':
        return "Application rejected";
      case 'pending':
        return "Application under review";
      case 'in-progress':
        return "Documentation review in progress";
      case 'received':
        return "Application received and processing started";
      default:
        return `Status updated to: ${status}`;
    }
  };

  if (!isOpen) return null;

  // Format the created_at date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    // If it's already a formatted date string, return as is
    if (!/^\d{4}-\d{2}-\d{2}T/.test(dateString)) return dateString;
    
    // Format the ISO date string
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="safety-approval-modal-overlay">
      <div className="safety-approval-modal">
        <div className="safety-approval-modal-header">
          <h2>SAFETY APPLICATION {currentStatus.toUpperCase()} STATUS</h2>
          <button className="safety-approval-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="safety-approval-modal-content">
          {isLoading ? (
            <div className="safety-approval-loading">
              <p>Loading status information...</p>
            </div>
          ) : (
            <>
              <div className={`safety-approval-icon ${currentStatus === 'approved' ? '' : 'safety-pending'}`}>
                <i className={`fas ${currentStatus === 'approved' ? 'fa-check-circle' : 'fa-hourglass-half'}`}></i>
              </div>
              
              <div className="safety-approval-status-banner">
                <span className={`safety-status-badge safety-status-${currentStatus}`}>
                  {currentStatus === 'approved' ? 'APPROVED' : 'UNDER REVIEW'}
                </span>
                <span className="safety-status-updated">Last Updated: {lastUpdated}</span>
              </div>
              
              <p className="safety-approval-greeting">Dear {safetyName || 'Applicant'},</p>
              
              {currentStatus === 'approved' ? (
                <>
                  <p>We are pleased to inform you that your safety application with tracking code <strong>{trackingCode}</strong> has been <span className="safety-status-approved">APPROVED</span>.</p>
                  <p><strong>Approval Date:</strong> {formatDate(actualApprovalDate)}</p>
                  <p>We are pleased to inform you that your submitted documentation has met all the required safety standards and regulatory requirements.</p>
                  <p>You may now proceed to the Mines and Geosciences Bureau Region X office to complete the payment transaction.</p>
                    <p>Please retain this information for your records.</p> 
                </>
              ) : ( 
                <>
                  <p>Your safety application with tracking code <strong>{trackingCode}</strong> is currently <span className="safety-status-pending">UNDER REVIEW</span>.</p>
                  <p><strong>Submission Date:</strong> {formatDate(approvalDate)}</p>
                  <p>Our team is carefully evaluating your submission to ensure all safety requirements are met. The typical review process takes 7-10 business days.</p>
                  <p>You will receive notification once the review process is complete.</p>
                </>
              )}
              
              <div className="safety-approval-notification-section">
                <button 
                  className="safety-approval-history-toggle" 
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <i className={`fas ${showHistory ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  {showHistory ? 'Hide Status History' : 'View Status History'}
                </button>
                
                {showHistory && (
                  <div className="safety-approval-history">
                    <h3>Application Status History</h3>
                    <div className="safety-approval-timeline">
                      {notifications.map((notification, index) => (
                        <div key={index} className="safety-approval-timeline-item">
                          <div className="safety-approval-timeline-marker">
                            <i className={`fas ${
                              notification.status === 'approved' ? 'fa-check-circle' :
                              notification.status === 'in-progress' ? 'fa-clipboard-list' :
                              notification.status === 'received' ? 'fa-file-import' : 'fa-hourglass-half'
                            }`}></i>
                          </div>
                          <div className="safety-approval-timeline-content">
                            <p className="safety-approval-timeline-date">{notification.date}</p>
                            <p className="safety-approval-timeline-message">{notification.message}</p>
                            {notification.admin && <p className="safety-approval-timeline-admin">By: {notification.admin}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="safety-approval-contact">
                If you have any questions about the review process or need to provide additional information, please contact our support team at <a href="mailto:mgbxmsesddbot@gmail.com">mgbxmsesddbot@gmail.com</a> or call us at <strong>09364561197</strong>.
              </p>
              
              <p className="safety-approval-signature">
                Best regards,<br />
                Mines Safety Environment and Development Division
              </p>
            </>
          )}
        </div>
        
        <div className="safety-approval-modal-footer">
          <button className="safety-approval-modal-button primary" onClick={onClose}>Close</button>
          {currentStatus !== 'approved' && !isLoading && (
            <button className="safety-approval-modal-button secondary">
              <i className="fas fa-question-circle"></i> Inquire About Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;