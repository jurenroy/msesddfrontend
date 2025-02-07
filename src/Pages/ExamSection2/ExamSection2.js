import React, { useState } from 'react';
import Modal from './Modal';
import "./ExamSection2.css";

export default function MatchingExercise() {
    const questions = [
        { id: 'q1', letter: 'A', content: 'Leadership and Administration', correct: 'e' },
        { id: 'q2', letter: 'B', content: 'Organizational Rules', correct: 'b' },
        { id: 'q3', letter: 'C', content: 'Management and Employee Training', correct: 'f' },
        { id: 'q4', letter: 'D', content: 'Good Housekeeping', correct: 'g' },
        { id: 'q5', letter: 'E', content: 'Health Control and Services', correct: 'e' },
        { id: 'q6', letter: 'F', content: 'Personal Protective Equipment (PPE)', correct: 'a' },
        { id: 'q7', letter: 'G', content: 'Monitoring and Reporting', correct: 'c' },
        { id: 'q8', letter: 'H', content: 'Environmental Risk Management including an Emergency Response and Preparedness Program', correct: 'd' },
        { id: 'q9', letter: 'I', content: 'Occupational Health and Safety Management', correct: 'i' }
    ];

    const initialAnswers = [
        { id: 'a', content: ['• Safety Harness', '• Face Mask', '• Face Shield'] },
        { id: 'b', content: ['• Safety & Health Signages', '• Safety and Health Manual', '• General Safety and Health Rules & Regulations'] },
        { id: 'c', content: ['• Planned Inspection', '• Accident/Incident Investigation & Analysis', '• Safety and Health Reporting Requirements'] },
        { id: 'd', content: ['• Evaluation of People and Designation of Command Control Area', '• Emergency Response Team', '• Emergency Drills'] },
        { id: 'e', content: ['• Meetings (CSHC, Departmental & Pep Talk)', '• Safety and Health Incentives', '• Provision of Worker\'s Welfare Facilities'] },
        { id: 'f', content: ['• Employee\'s Orientation and Re-orientation', '• Visitors Orientation/Induction', '• Work permit system, risk assessment, evaluation and control Trainings'] },
        { id: 'g', content: ['• 5 S System', '• Systematic Sorting and Filling', '• Dust Control, Solid waste & Hazardous control Management'] },
        { id: 'h', content: ['• Safety & Health Policy Statement', '• Safety and Health office', '• Central Safety and Health Committee'] },
        { id: 'i', content: ['• Pre-placement, Periodic or Annual, Return to work examination', '• Occupational Health Services & Facilities', '• Medical Surveillance for early detection and management'] }
    ];

    const [userAnswers, setUserAnswers] = useState({});
    const [availableAnswers, setAvailableAnswers] = useState(initialAnswers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [filteredAvailableAnswers, setFilteredAvailableAnswers] = useState([]);

    const handleOpenModal = (questionId) => {
        setCurrentQuestionId(questionId);
        const filteredAnswers = availableAnswers.filter(answer => 
            !Object.values(userAnswers).includes(answer.id)
        );
        setFilteredAvailableAnswers(filteredAnswers);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentQuestionId(null);
    };

    const handleSelectAnswer = (answerId) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionId]: answerId
        }));
        setAvailableAnswers(prev => prev.filter(a => a.id !== answerId));
        handleCloseModal();
    };

    const handleRemoveAnswer = (e, questionId, answerId) => {
        e.stopPropagation(); // Prevent modal from opening
        // Find the answer to return to available answers
        const answerToReturn = initialAnswers.find(a => a.id === answerId);
        // Add it back to available answers
        setAvailableAnswers(prev => [...prev, answerToReturn]);
        // Remove from user answers
        const newUserAnswers = { ...userAnswers };
        delete newUserAnswers[questionId];
        setUserAnswers(newUserAnswers);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="container">
            <h1 className="title">Match the Activities at the Key Elements of the SHP</h1>
            
            <div className="exercise-grid">
                <div className="questions-container">
                    <h2 className="section-title">Activities</h2>
                    {questions.map((question) => (
                        <div key={question.id} className="question-box">
                            <div className="question-header">
                                <div className="letter-badge">{question.letter}</div>
                                <div className="question-content">{question.content}</div>
                            </div>
                            <div 
                                className={`drop-zone ${userAnswers[question.id] ? 'filled' : ''}`}
                                onClick={() => !userAnswers[question.id] && handleOpenModal(question.id)}
                            >
                                {userAnswers[question.id] ? (
                                    <div className="answer-wrapper">
                                        <button 
                                            className="remove-button"
                                            onClick={(e) => handleRemoveAnswer(e, question.id, userAnswers[question.id])}
                                        >
                                            ×
                                        </button>
                                        <div className="answer-content">
                                            {initialAnswers.find(a => a.id === userAnswers[question.id])?.content.map((line, i) => (
                                                <div key={i} className="answer-bullet">{line}</div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="drop-placeholder">
                                        <div className="drop-placeholder-icon">📥</div>
                                        Drop answer here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="answers-container">
                    <h2 className="section-title">Key Elements</h2>
                    {availableAnswers.map((answer) => (
                        <div key={answer.id} className="answer-card">
                            <div className="answer-content">
                                {answer.content.map((line, i) => (
                                    <div key={i} className="answer-bullet">{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-container">
                <button className="button submit-button">Submit</button>
                <button type="button" className="existing-tracking-back-button" onClick={handleBack}>Back</button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                answers={filteredAvailableAnswers}
                onSelect={handleSelectAnswer} 
            />
        </div>
    );
}