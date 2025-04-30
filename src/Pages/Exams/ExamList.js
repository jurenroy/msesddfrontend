import React, { useState, useEffect } from 'react';
import { fetchExamList } from "../Services/examService";
import Modal from '../components/Modals/Modal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './Examlist.css';

const ExamListComponent = () => { 
  const { role, trackingCode: paramTrackingCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const trackingCode = location.state?.trackingCodeData?.tracking_code || paramTrackingCode;
  
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
 

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await fetchExamList(); 
        setExamData(data || []);
        console.log(trackingCode) // Ensure data is an array even if null
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleTakeExam = () => {
    if (selectedExam) {
      navigate(`/safety/${role}/existing/exam/${selectedExam.id}`,{state: {trackingCode}
      });
    }
    handleCloseModal(); 
  };

  // Render loading state
  if (loading) {
    return (
      <div className="exam-loader">
        <div className="spinner"></div>
        <p>Loading exam data...</p>
      </div>
    );
  }

  // Render error state
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

  // Render empty state
  if (!examData.length) {
    return (
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
    );
  }

  return (
    <div className="exam-container">
      <header className="exam-header">
        <h1>Available Exams</h1>
      </header>

      <div className="exam-list">
        {examData.map((exam) => (
          <div 
            key={exam.id} 
            className="exam-card" 
            onClick={() => handleExamClick(exam)}
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
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        examData={selectedExam}
        onTakeExam={handleTakeExam}
      />
    </div>
  );
};

export default ExamListComponent;