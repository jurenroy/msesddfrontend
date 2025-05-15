import React, { useState, useEffect } from 'react';
import { fetchExamList } from "../Services/examService";
import Modal from '../components/Modals/Modal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../UserDashboard/navbar';  // Import Navbar
import './Examlist.css';

const ExamListComponent = () => { 
  const { role } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tracking code from multiple possible sources
  const trackingCode = location.state?.trackingCodeData?.tracking_code || 
                      location.state?.trackingCode || 
                      location.state?.trackingNumber;
                      
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [activePage, setActivePage] = useState('exam');

  useEffect(() => {
    // Redirect if no tracking code
    if (!trackingCode) {
      navigate('/');
      return;
    }

    const fetchExams = async () => {
      try {
        const data = await fetchExamList(); 
        setExamData(data || []);
        console.log('Current tracking code:', trackingCode);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [trackingCode, navigate]);

  // Navigation handlers
  const handleDashboardClick = () => {
    navigate(`/safety/${role}/dashboard`, {
      state: { trackingCodeData: { tracking_code: trackingCode } }
    });
  };

  const handleChecklistClick = () => {
    navigate(`/safety/${role}/checklist`, {
      state: { trackingCodeData: { tracking_code: trackingCode } }
    });
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleExamClick = () => {
    // Already on exam page, no need to navigate
    setActivePage('exam');
  };

  const handleApplicationClick = () => {
    navigate(`/safety/${role}/application`, {
      state: { trackingCodeData: { tracking_code: trackingCode } }
    });
  };

  // Rest of your existing handlers
  const handleExamItemClick = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleTakeExam = () => {
    if (selectedExam) {
      navigate(`/safety/${role}/existing/exam/${selectedExam.id}`, {
        state: { 
          trackingCode,
          trackingCodeData: { tracking_code: trackingCode }
        }
      });
    }
    handleCloseModal();
  };

  // Loading and error states remain the same
  if (loading) {
    return (
      <div className="exam-loader">
        <div className="spinner"></div>
        <p>Loading exam data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

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
        <Navbar 
          activePage={activePage}
          handleDashboardClick={handleDashboardClick}
          handleChecklistClick={handleChecklistClick}
          handleHomeClick={handleHomeClick}
          handleExamClick={handleExamClick}
          handleApplicationClick={handleApplicationClick}
          trackingCode={trackingCode}
        />

        <div className="user-dash-main">
          <div className="exam-container">
            <header className="exam-header">
              <h1>Available Exams</h1>
              <p className="tracking-code">Tracking Code: {trackingCode}</p>
            </header>

            <div className="exam-list">
              {examData.length === 0 ? (
                <div className="exam-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" x2="8" y1="13" y2="13"/>
                    <line x1="16" x2="8" y1="17" y2="17"/>
                    <line x1="10" x2="8" y1="9" y2="9"/>
                  </svg>
                  <p>No exams available at the moment</p>
                </div>
              ) : (
                examData.map((exam) => (
                  <div 
                    key={exam.id} 
                    className="exam-card" 
                    onClick={() => handleExamItemClick(exam)}
                  >
                    <div className="exam-card-content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="exam-icon">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="exam-title">{exam.title}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="exam-chevron">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))
              )}
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              examData={selectedExam}
              onTakeExam={handleTakeExam}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamListComponent;