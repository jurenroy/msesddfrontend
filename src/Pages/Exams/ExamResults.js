import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ExamResults.css';

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { role } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('finalExamResults');
    
    try {
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } else {
        setError('No exam results found. Please complete the exam.');
      }
    } catch (err) {
      setError('Error parsing exam results.');
    } finally {
      setLoading(false);
    }
  }, []);

  const renderSectionResults = (section, sectionNumber) => {
    if (!section) return null;

    return (
      <div className="section-results">
        <h3>Section {sectionNumber} Details</h3>
        <div className="result-summary">
          <div className="result-item">
            <span className="result-label">Total Questions:</span>
            <span className="result-value">
              {section.totalQuestions || section.questions?.length || 'N/A'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Score:</span>
            <span className="result-value">
              {Math.round(section.score || 0)}%
            </span>
          </div>
        </div>

        {sectionNumber === 2 && section.results && (
          <div className="detailed-results">
            <h4>Detailed Matching Results</h4>
            {section.results.map((result, index) => (
              <div 
                key={index} 
                className={`result-detail ${result.correct ? 'correct' : 'incorrect'}`}
              >
                <span className="result-question">
                  {result.question?.content || 'Question'}
                </span>
                <span className="result-status">
                  {result.correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="container">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="container error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate(`/${role}/exam`)}
          className="button back-to-exam-button"
        >
          Return to Exam
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container error-container">
        <h2>No Results Available</h2>
        <button 
          onClick={() => navigate(`/${role}/exam`)}
          className="button back-to-exam-button"
        >
          Return to Exam
        </button>
      </div>
    );
  }

  return (
    <div className="container results-page">
      <h1 className={`exam-result-header ${results.passed ? 'passed' : 'failed'}`}>
        {results.passed ? 'Exam Passed' : 'Exam Not Passed'}
      </h1>

      <div className="overall-results">
        <div className="result-item">
          <span className="result-label">Total Score:</span>
          <span className="result-value">
            {Math.round(results.combinedScore)}%
          </span>
        </div>
        <div className="result-item">
          <span className="result-label">Status:</span>
          <span className={`result-status ${results.passed ? 'success' : 'failure'}`}>
            {results.passed ? 'Passed' : 'Not Passed'}
          </span>
        </div>
      </div>

      {renderSectionResults(results.section1, 1)}
      {renderSectionResults(results.section2, 2)}

      <div className="results-actions">
        <button 
          onClick={() => navigate(`/safety/${role}/existing`)}
          className="button primary-button"
        >
          Return to 
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;