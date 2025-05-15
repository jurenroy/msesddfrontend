import { useState, useEffect } from 'react';
import './NotifSubmit.css';

export default function NotifSubmit() {
  const [show, setShow] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Progressive animation sequence
    if (show) {
      const timer1 = setTimeout(() => setAnimationStage(1), 600);
      const timer2 = setTimeout(() => setAnimationStage(2), 1200);
      const timer3 = setTimeout(() => setAnimationStage(3), 1800);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [show]);
  
  const handleClose = () => {
    setShow(false);
  };
  
  const handleGoHome = () => {
    // Navigate to homepage
    window.location.href = '/';
  };
  
  if (!show) return null;
  
  return (
    <div className="notif-wrapper notif-centered">
      <div className={`notif-container notif-larger ${!show ? 'hidden' : ''}`}>
        <div className="notif-inner">
          <button 
            className="notif-close-button"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </button>
          
          <div className="notif-content">
            <div className="notif-icon-wrapper">
              <div className="notif-success-circle">
                <div className={`notif-icon-container ${animationStage >= 0 ? 'visible' : 'hidden'}`}>
                  <svg className="notif-check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path className="animate-checkmark" d="M9 12L11 14L15 10" />
                    <circle className="animate-circle" cx="12" cy="12" r="10" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="notif-text-container">
              <h2 className={`notif-title ${animationStage >= 1 ? 'visible' : 'hidden'}`}>
                Application Submitted Successfully!
              </h2>
              
              <p className={`notif-message ${animationStage >= 2 ? 'visible' : 'hidden'}`}>
                Please check your email for your tracking code. You will receive updates about your application status.
              </p>
              
            </div>
          </div>
          
          <div className={`notif-button-container ${animationStage >= 3 ? 'visible' : 'hidden'}`}>
            <button className="notif-home-button hover-glow" onClick={handleGoHome}>
              <svg className="notif-home-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Homepage
            </button>
          </div>
          
          {/* Animated progress bar for auto-dismiss */}
          <div className="notif-progress-bar">
            <div className="notif-progress-inner"></div>
          </div>
        </div>
      </div>
    </div>
  );
}