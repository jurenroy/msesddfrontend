import React, { useEffect } from 'react';
import './Modal.css'; // Add your styles here

const Modal = ({ isOpen, onClose, examData, onTakeExam }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !examData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{examData.title}</h2>
        <p>Description: {examData.description}</p>
        <p>Time Limit: {examData.time_limit} minutes</p>
        <p>Required Score to Pass: {examData.required_score_to_pass}%</p>
        <div className="modal-buttons">
          <button onClick={onTakeExam}>Take Exam</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>  
    </div>
  );
};

export default Modal;