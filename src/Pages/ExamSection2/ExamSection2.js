import React, { useState } from 'react';
import "./ExamSection2.css";
import { useNavigate } from 'react-router-dom';

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
      {
        id: 'a',
        content: [
          '• Safety Harness',
          '• Face Mask',
          '• Face Shield'
        ]
      },
      {
        id: 'b',
        content: [
          '• Safety & Health Signages',
          '• Safety and Health Manual',
          '• General Safety and Health Rules & Regulations'
        ]
      },
      {
        id: 'c',
        content: [
          '• Planned Inspection',
          '• Accident/Incident Investigation & Analysis',
          '• Safety and Health Reporting Requirements'
        ]
      },
      {
        id: 'd',
        content: [
          '• Evaluation of People and Designation of Command Control Area',
          '• Emergency Response Team',
          '• Emergency Drills'
        ]
      },
      {
        id: 'e',
        content: [
          '• Meetings (CSHC, Departmental & Pep Talk)',
          '• Safety and Health Incentives',
          '• Provision of Worker\'s Welfare Facilities'
        ]
      },
      {
        id: 'f',
        content: [
          '• Employee\'s Orientation and Re-orientation',
          '• Visitors Orientation/Induction',
          '• Work permit system, risk assessment, evaluation and control Trainings'
        ]
      },
      {
        id: 'g',
        content: [
          '• 5 S System',
          '• Systematic Sorting and Filling',
          '• Dust Control, Solid waste & Hazardous control Management'
        ]
      },
      {
        id: 'h',
        content: [
          '• Safety & Health Policy Statement',
          '• Safety and Health office',
          '• Central Safety and Health Committee'
        ]
      },
      {
        id: 'i',
        content: [
          '• Pre-placement, Periodic or Annual, Return to work examination',
          '• Occupational Health Services & Facilities',
          '• Medical Surveillance for early detection and management'
        ]
      }
    ];

    const [userAnswers, setUserAnswers] = useState({});
    const [availableAnswers, setAvailableAnswers] = useState(initialAnswers);
    const [draggedAnswer, setDraggedAnswer] = useState(null);

    const handleDragStart = (e, answerId, fromDropZone = false) => {
        setDraggedAnswer({ id: answerId, fromDropZone });
        e.dataTransfer.setData('text/plain', answerId);
        e.dataTransfer.setData('fromDropZone', String(fromDropZone));
    };

    const handleDragEnd = () => {
        setDraggedAnswer(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, questionId) => {
        e.preventDefault();
        const answerId = e.dataTransfer.getData('text/plain');
        const fromDropZone = e.dataTransfer.getData('fromDropZone') === 'true';
        
        // If the answer is coming from another drop zone
        if (fromDropZone) {
            const oldQuestionId = Object.keys(userAnswers).find(key => userAnswers[key] === answerId);
            
            // Remove from old question
            if (oldQuestionId) {
                const newUserAnswers = { ...userAnswers };
                delete newUserAnswers[oldQuestionId];
                setUserAnswers(newUserAnswers);
            }
        } else {
            // Remove from available answers if it's coming from the answers container
            setAvailableAnswers(prev => prev.filter(a => a.id !== answerId));
        }

        // Add to new question
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleDropBack = (e) => {
        e.preventDefault();
        const answerId = e.dataTransfer.getData('text/plain');
        const fromDropZone = e.dataTransfer.getData('fromDropZone') === 'true';

        if (fromDropZone) {
            // Find the answer data
            const answerData = initialAnswers.find(a => a.id === answerId);
            
            // Add back to available answers
            setAvailableAnswers(prev => [...prev, answerData]);
            
            // Remove from user answers
            const newUserAnswers = { ...userAnswers };
            const questionId = Object.keys(newUserAnswers).find(key => newUserAnswers[key] === answerId);
            if (questionId) {
                delete newUserAnswers[questionId];
                setUserAnswers(newUserAnswers);
            }
        }
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
                                <div className="letter-badge">
                                    {question.letter}
                                </div>
                                <div className="question-content">
                                    {question.content}
                                </div>
                            </div>
                            <div
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, question.id)}
                                className={`drop-zone ${userAnswers[question.id] ? 'filled' : ''}`}
                            >
                                {userAnswers[question.id] ? (
                                    <div 
                                        className="answer-content"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, userAnswers[question.id], true)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        {initialAnswers.find(a => a.id === userAnswers[question.id])?.content.map((line, i) => (
                                            <div key={i} className="answer-bullet">{line}</div>
                                        ))}
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

                <div 
                    className="answers-container"
                    onDragOver={handleDragOver}
                    onDrop={handleDropBack}
                >
                    <h2 className="section-title">Key Elements</h2>
                    {availableAnswers.map((answer) => (
                        <div
                            key={answer.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, answer.id)}
                            onDragEnd={handleDragEnd}
                            className={`answer-card ${draggedAnswer?.id === answer.id ? 'dragging' : ''}`}
                        >
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
        </div>
    );
}