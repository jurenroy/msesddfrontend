import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchExamQuestions, ValidateExamAnswers } from "../Services/examService";
import usePreventActions from "../components/PreventOperations";
import "./StartExam.css";

const ExamForm = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const trackingCode = location.state?.trackingCode;
  usePreventActions();

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMatching, setShowMatching] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [examCompleted, setExamCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetchExamQuestions(examId);
        console.log("Fetched Exam Data:", response);
        console.log("Tracking Code:", trackingCode);
        setExamData(response);
        
        // Initialize timer if there's a time limit
        if (response.time_limit) {
          setTimeRemaining(response.time_limit * 60); // Convert minutes to seconds
        }
        
        // Initialize userAnswers object with empty values for each question
        const initialAnswers = {};
        
        // Initialize multiple choice answers
        response.questions.forEach(question => {
          if (question.answers) { // Only for multiple choice questions
            initialAnswers[question.id] = null;
          }
        });
        
        // Initialize matching question answers
        if (response.matching_questions && response.matching_questions.length > 0) {
          response.matching_questions.forEach(question => {
            initialAnswers[`matching_${question.id}`] = {};
          });
        }
        
        setUserAnswers(initialAnswers);
      } catch (err) {
        console.error("Error fetching exam data:", err);
        setError(err.message || "Failed to fetch exam data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || !examData || examCompleted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, examData, examCompleted]);

  // Format time remaining as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle user selecting an answer for multiple choice
  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted || examCompleted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  // Handle matching answers
  const handleMatchingSelect = (questionId, promptId, optionId) => {
    if (submitted || examCompleted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [`matching_${questionId}`]: {
        ...prev[`matching_${questionId}`],
        [promptId]: optionId
      }
    }));
  };

  // Handle Next Section button click
  const handleNextSection = () => {
    setShowMatching(true);
  };

  // Get multiple choice questions
  const getMultipleChoiceQuestions = () => {
    return examData.questions.filter(q => q.answers && q.answers.length > 0);
  };

  // Prepare data for submission
  const prepareSubmissionData = () => {
    const mcQuestions = [];
    
    // Process multiple-choice questions
    getMultipleChoiceQuestions().forEach(question => {
      const selectedAnswerId = userAnswers[question.id];
      let selectedAnswerText = null;
      
      if (selectedAnswerId) {
        const selectedAnswer = question.answers.find(answer => answer.id === selectedAnswerId);
        selectedAnswerText = selectedAnswer ? selectedAnswer.choices : null;
      }
      
      mcQuestions.push({
        question_id: question.id,
        question: question.text,
        selectedAnswer: selectedAnswerText
      });
    });
    
    // Process matching questions
    const matchingAnswers = [];
    if (examData.matching_questions) {
      examData.matching_questions.forEach(question => {
        const matchingKey = `matching_${question.id}`;
        if (userAnswers[matchingKey]) {
          Object.entries(userAnswers[matchingKey]).forEach(([promptId, selectedOptionId]) => {
            matchingAnswers.push({
              question_id: parseInt(question.id),
              prompt_id: parseInt(promptId),
              selected_answer_id: parseInt(selectedOptionId)
            });
          });
        }
      });
    }
    
    return {
      examId: examId,
      trackingCode: trackingCode,
      exam_type: examData.exam_type,
      questions: mcQuestions,
      matching_questions: matchingAnswers
    };
  };

  const handleSubmit = async () => {
    if (examCompleted) return;
    
    if (showMatching && examData.matching_questions && examData.matching_questions.length > 0) {
      const allMatchingAnswered = examData.matching_questions.every(q => 
        userAnswers[`matching_${q.id}`] && Object.keys(userAnswers[`matching_${q.id}`]).length > 0
      );
      
      if (!allMatchingAnswered) {
        console.warn("Not all matching questions have been answered");
      }
    }
    
    const submissionData = prepareSubmissionData();
    console.log("Submission data:", submissionData);
    
    try {
      const result = await ValidateExamAnswers(submissionData);
      
      setScore(result.combinedScore?.toFixed(1) || 0);
      setSubmitted(true);
      setExamCompleted(true);
      
      console.log("Exam submitted successfully", result);
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError(err.message || "Failed to submit exam. Please try again.");
    }
  };
  
  const handleBackToList = () => {
    navigate(-1); 
  };

  if (loading) {
    return (
      <div className="exam-loading">
        <div className="spinner"></div>
        <p>Loading exam questions...</p>
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

  // Render the form
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
      
      <div className="exam-container">
        <h1 className="exam-title">{examData.title}</h1>
        <p className="exam-description">{examData.description}</p>
        
        {timeRemaining !== null && (
          <div className="timer">
            <span>Time Remaining: {formatTime(timeRemaining)}</span>
          </div>
        )}
        
        {submitted ? (
          <div className="exam-result">
            <h2>Exam Completed</h2>
            <p>Your score: {score}%</p>
            <p className={score >= examData.required_score_to_pass ? "passed" : "failed"}>
              {score >= examData.required_score_to_pass ? "Passed" : "Failed"}
            </p>
            <button onClick={handleBackToList} className="back-button">
              Back to Exams
            </button>
          </div>
        ) : (
          <div className="exam-questions">
            <h2>Questions</h2>
            
            {/* Multiple Choice Section */}
            {!showMatching && examData.exam_type !== "matching" && (
              <div className="multiple-choice-section">
                {getMultipleChoiceQuestions().map((question) => (
                  <div key={question.id} className="question">
                    <h3>{question.text}</h3>
                    <div className="answers">
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="answer">
                          <label>
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={answer.id}
                              checked={userAnswers[question.id] === answer.id}
                              onChange={() => handleAnswerSelect(question.id, answer.id)}
                              disabled={submitted || examCompleted}
                            />
                            {answer.choices}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Show Next Section button if we have matching questions */}
                {!showMatching && examData.matching_questions && examData.matching_questions.length > 0 && (
                  <button className="next-button" onClick={handleNextSection}>
                    Next Section
                  </button>
                )}
                
                {/* Show Submit button if we don't have matching questions */}
                {(examData.exam_type !== "mixed" || !examData.matching_questions || examData.matching_questions.length === 0) && (
                  <button className="submit-button" onClick={handleSubmit}>
                    Submit
                  </button>
                )}
              </div>
            )}
            
            {/* Matching Section */}
            {(showMatching || examData.exam_type === "matching") && examData.matching_questions && (
              <div className="matching-section">
                <h2>Matching Questions</h2>
                
                {examData.matching_questions.map((question) => (
                  <div key={question.id} className="matching-question">
                    <h3>{question.letter}. {question.content}</h3>
                    <div className="matching-options">
                      {question.pairs.map((pair) => (
                        <div key={pair.id} className="matching-pair">
                          <span className="pair-prompt">{pair.question}. </span>
                          <select
                            value={userAnswers[`matching_${question.id}`]?.[pair.question] || ""}
                            onChange={(e) => handleMatchingSelect(
                              question.id,
                              pair.question,
                              e.target.value
                            )}
                            disabled={submitted || examCompleted}
                          >
                            <option value="">Select an option</option>
                            {/* Map through all matching options */}
                            {examData.matching_questions.map((q) => (
                              <option key={q.id} value={q.id}>
                                {q.letter}. {q.content}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="button-container">
                  <button className="back-button" onClick={() => setShowMatching(false)}>
                    Previous Section
                  </button>
                  <button className="submit-button" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamForm;