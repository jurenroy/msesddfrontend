import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ExistingApplication.css";
import API_BASE_URL from "../../config";

const ExistingApplication = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState("");

  const handleInputChange = (e) => {
    const newTrackingNumber = e.target.value;
    setTrackingNumber(newTrackingNumber);
    
    // Ensure warning is hidden as soon as any text is entered
    if (newTrackingNumber.trim() !== '') {
      setShowWarning(false);
    }
  };

  const handleTrack = async () => {
    if (trackingNumber.trim() === '') {
      setWarningMessage("Please input Tracking code!");
      setWarningType("input-error"); 
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/safety/${trackingNumber}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      
      // Check if role matches
      if (role === jsonData.role) {
        setWarningMessage("Tracking code verified successfully!");
        setWarningType("success-message");
        setShowWarning(true);
        
        setTimeout(() => {
          setShowWarning(false);
          navigate(`/safety/${role}/dashboard`, {
            state: { trackingNumber }
          });
        }, 2000);
      } else {
        // If role doesn't match, show warning with specific message
        setWarningMessage(`Invalid role. Please select ${jsonData.role}`);
        setWarningType("input-error");
        setShowWarning(true);
        
        setTimeout(() => {
          setShowWarning(false);
        }, 3000);
      }
    } catch (err) {
      setWarningMessage("Wrong Tracking Code!");
      setWarningType("network-error"); 
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Check tracking number before submission
    if (trackingNumber.trim() === '') {
      setWarningMessage("Please input Tracking code!");
      setWarningType("input-error");
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }

    setError("");
    setData(null);
    setShowWarning(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/safety/${trackingNumber}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
      
      // Check if role matches
      if (role === jsonData.role) {
        setWarningMessage("Tracking code verified successfully!");
        setWarningType("success-message");
        setShowWarning(true);
        
        setTimeout(() => {
          setShowWarning(false);
          navigate(`/safety/${jsonData.role}/existing/${jsonData.tracking_code}`);
        }, 2000);
      } else {
        // If role doesn't match, show warning with specific message
        setWarningMessage(`Invalid role. Please select ${jsonData.role}`);
        setWarningType("input-error");
        setShowWarning(true);
        
        setTimeout(() => {
          setShowWarning(false);
        }, 3000);
      }
    } catch (err) {
      setWarningMessage("Wrong Tracking Code!");
      setWarningType("network-error"); 
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };
  const handleBack = () => {
    navigate('/');
  };


  return (
    <div className="existing-application-page">
      <div className="orbital-background">
        <div className="orbital orbit-1"></div>
        <div className="orbital orbit-2"></div>
        <div className="orbital orbit-3"></div>
      </div>
      
      <div className="glass-card">
        <div className="card-header">
    
          <h1 className="page-title">
            {role === "Engineer" ? "Safety Engineer" : "Safety Inspector"} - 
            Existing Application
          </h1>
        </div>
        
        <div className="card-content">
          <form onSubmit={handleSubmit} className="tracking-form">
            <div className="input-group">
              <label htmlFor="tracking-input">Tracking Number</label>
              <input
                id="tracking-input"
                type="text"
                className="tracking-input"
                value={trackingNumber}
                onChange={handleInputChange}
                placeholder="Enter your tracking code"
              />
            </div>
            
            {error && <div className="tracking-error">{error}</div>}
            
            <div className="buttons-container">
              <button 
                type="button" 
                className="action-button track-button"
                onClick={handleTrack}
              >
                Enter Tracking Code
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showWarning && (
        <div className="notification-container">
          <div className={`notification ${warningType}`}>
            {warningType === "success-message" ? (
              <svg className="notification-icon success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="notification-icon warning-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <p className="notification-message">{warningMessage}</p>
            <div className="notification-progress"></div>
          </div>
        </div>
      )}
      
      <footer className="app-footer">
        © 2025 Mines and Geosciences Bureau
      </footer>
    </div>
  );
};

export default ExistingApplication;