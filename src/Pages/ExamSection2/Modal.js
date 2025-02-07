// Modal.js
import React from 'react';
import './Modal.css'; // Add your styles here

const Modal = ({ isOpen, onClose, answers, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select an Answer</h2>
                <div className="answers-list">
                    {answers.map(answer => (
                        <div key={answer.id} className="answer-item" onClick={() => onSelect(answer.id)}>
                            {answer.content.map((line, i) => (
                                <div key={i} className="answer-bullet">{line}</div>
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;