import React, { useState, useEffect } from "react";
import "./Adboard.css";
import "./ImprovedDashboard.css";
import ChecklistView from "../Checklist/ChecklistView";
import TrackingDocumentView from "../TrackingDocument/TrackingDocumentView";
import { useNavigate } from "react-router-dom";
import { get_notes } from "../Services/LoginService";
import { ExamResults as fetchExamResults } from "../Services/examService";
import { fetchUserData } from "../Services/safetyService";
import PaginationArrow from "../Admin Dashboard/PaginationArrow";
import { fetchChecklistStatus } from "../Services/ChecklistStatusService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("MGB APPLICANTS");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [safetySearchQuery, setSafetySearchQuery] = useState('');
  const [checklistSearchQuery, setChecklistSearchQuery] = useState('');
  const [examSearchQuery, setExamSearchQuery] = useState('');

  const [mgbApplicantsPage, setMgbApplicantsPage] = useState(1);
  const [checklistPage, setChecklistPage] = useState(1);
  const [examResultsPage, setExamResultsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage]= useState(5);

  const [checklist, setChecklist] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [userData, setUserData] = useState([]);
  const [checklistStatus, setChecklistStatus] = useState([]);

  const [showApplicationView, setShowApplicationView] = useState(false);
  const [selectedApplicationTrackingCode, setSelectedApplicationTrackingCode] = useState('');
  const [selectedApplicationRole, setSelectedApplicationRole] = useState('');
  
  // ChecklistView state
  const [showChecklistView, setShowChecklistView] = useState(false);
  const [selectedChecklistTrackingCode, setSelectedChecklistTrackingCode] = useState('');
  const [selectedChecklistRole, setSelectedChecklistRole] = useState('');
  const [checklistKey, setChecklistKey] = useState(0); // Add a key to force re-render

  console.log("Checklist:", checklist);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await fetchExamResults();
        setExamResults(results); 
        console.log(("Fetch Exam Results:", results))
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserData(); 
        setUserData(user); 
        console.log("Fetch User Data:", user);
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChecklistStatusData = async () => {
     try {
       const checklistStatus = await fetchChecklistStatus();
       setChecklistStatus(checklistStatus);
       console.log("Fetch Checklist Status:", checklistStatus);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   fetchChecklistStatusData();
 }, []);

 useEffect(() => {
  if (Array.isArray(userData) && userData.length > 0) {
    const statusMap = checklistStatus.reduce((acc, item) => {
      if (item?.checklist_info?.tracking_code) {
        acc[item.checklist_info.tracking_code] = item.status;
      }
      return acc;
    }, {});


    // Map userData to create a checklist summary with status
    const derivedChecklist = userData.map(user => {
      const status = statusMap[user.tracking_code] || "Pending";
      return {
        trackingCode: user.tracking_code,
        name: user.name,
        appliedRole: user.role,
        email: user.email,
        action: status
      };
    });
    
    setChecklist(derivedChecklist);
    console.log("Derived checklist:", derivedChecklist);
  }
}, [userData, checklistStatus]); // Add checklistStatus as a dependency


  const openModal = (employee) => {
    setShowApplicationView(false);
    setShowChecklistView(false);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  // Simplified function to open checklist
  const openChecklistView = (role, trackingCode) => {
    // If there's already a checklist showing for a different item
    if (showChecklistView) {
      // First hide the current checklist
      setShowChecklistView(false);
      
      // Then after a brief delay, show the new one
      setTimeout(() => {
        setSelectedChecklistRole(role);
        setSelectedChecklistTrackingCode(trackingCode);
        setChecklistKey(prev => prev + 1); // Increment key to force fresh mount
        setShowChecklistView(true);
      }, 50);
    } else {
      // If no checklist is currently showing, just show it directly
      setSelectedChecklistRole(role);
      setSelectedChecklistTrackingCode(trackingCode);
      setShowChecklistView(true);
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login");
  };
  
  const handlePageChange = (newPage) => {
    if (activeTab === "MGB APPLICANTS") {
      setMgbApplicantsPage(newPage);
    } else if (activeTab === "CHECKLIST") {
      setChecklistPage(newPage);
    } else if (activeTab === "RESULT EXAM") {
      setExamResultsPage(newPage);
    }
    // Scroll to top of the table when page changes
    document.querySelector('.data-table').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Filter logic
  const filteredUserData = Array.isArray(userData) ? userData.filter(user => 
    user.tracking_code?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
    user.name?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
    user.role?.toLowerCase().includes(safetySearchQuery.toLowerCase())
  ) : [];
  
  const filteredExamResults = Array.isArray(examResults) ? examResults.filter(exam => 
    exam.tracking_code && typeof exam.tracking_code === 'string' && 
    exam.tracking_code.toLowerCase().includes(examSearchQuery.toLowerCase())
  ) : [];

  useEffect(() => {
    if (showApplicationView || showChecklistView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showApplicationView, showChecklistView]);

  return (
    <>
      <div className="dashboard-container">
        {error && <div className="error-banner">{error}</div>}
        
        <aside className="sidebar">
          <div className="logo-container">
            <h2 className="logo"></h2>
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li 
                className={activeTab === "MGB APPLICANTS" ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActiveTab("MGB APPLICANTS"); 
                  setSafetySearchQuery('');
                  setChecklistSearchQuery('');
                  setExamSearchQuery('');
                }}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">MGB APPLICANTS</span>
              </li>
              
              <li 
                className={activeTab === "CHECKLIST" ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActiveTab("CHECKLIST"); 
                  setSafetySearchQuery('');
                  setChecklistSearchQuery('');
                  setExamSearchQuery('');
                }}
              >
                <span className="nav-icon">✓</span>
                <span className="nav-text">Checklist</span>
              </li>
              
              <li 
                className={activeTab === "RESULT EXAM" ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActiveTab("RESULT EXAM"); 
                  setSafetySearchQuery('');
                  setChecklistSearchQuery('');
                  setExamSearchQuery('');
                }}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Result Exam</span>
              </li>
            </ul>
          </nav>
          
          <div className="sidebar-footer">
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              <span className="logout-icon">⎋</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
          
        <main className="main-content">
          <div className="content-header">
            <h1>{activeTab}</h1>
            {activeTab === "MGB APPLICANTS" && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={safetySearchQuery}
                  onChange={(e) => setSafetySearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            )}
            {activeTab === "CHECKLIST" && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search checklist..."
                  value={checklistSearchQuery}
                  onChange={(e) => setChecklistSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            )}
            {activeTab === "RESULT EXAM" && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search exam results..."
                  value={examSearchQuery}
                  onChange={(e) => setExamSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            )}
          </div>
          
          {activeTab === "MGB APPLICANTS" && Array.isArray(userData) && (
            <div className="pagination-container">
            <PaginationArrow 
              currentPage={mgbApplicantsPage} 
              onPageChange={handlePageChange}
              hasMorePages={mgbApplicantsPage * itemsPerPage < userData.length}
            />
          </div>
          )}

          {activeTab === "MGB APPLICANTS" && (
            <section className="data-card">
              <div className="card-header">
                <h2>Safety Engineer and Inspector Applicants</h2>
              </div>
              <div className="table-responsive">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tracking Code</th>
                      <th>Name</th>
                      <th>Roles</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Array.isArray(userData) && userData
                          .filter(user => 
                           user.tracking_code?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
                           user.name?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
                           user.role?.toLowerCase().includes(safetySearchQuery.toLowerCase())
                      )
                      .slice((mgbApplicantsPage - 1) * itemsPerPage, mgbApplicantsPage * itemsPerPage)
                      .map((employee) => (
                        <tr key={employee.id || employee.tracking_code}>
                          <td>{employee.tracking_code}</td>
                          <td>{employee.name}</td>
                          <td><span className="role-badge">{employee.role}</span></td>
                          <td>{employee.email}</td>
                          <td className="action-cell">
                            {selectedApplicationTrackingCode !== employee.tracking_code && (
                              <button 
                                className="action-button view-button"
                                onClick={() => { 
                                  setShowApplicationView(true); 
                                  setSelectedApplicationRole(employee.role); 
                                  setSelectedApplicationTrackingCode(employee.tracking_code);
                                }}
                              >
                                View Application
                              </button>
                            )}
                            
                            
                            {selectedApplicationTrackingCode === employee.tracking_code && (
                              <button 
                                className="action-button close-button"
                                onClick={() => { 
                                  setShowApplicationView(false); 
                                  setSelectedApplicationRole(''); 
                                  setSelectedApplicationTrackingCode(''); 
                                }}
                              >
                                Close Application
                              </button>
                            )}
                            
                            <button 
                              className="action-button checklist-button"
                              onClick={() => { 
                                setActiveTab("CHECKLIST"); 
                                setChecklistSearchQuery(employee.tracking_code); 
                              }}
                            >
                              View Checklist
                            </button>
                            
                            <button 
                              className="action-button exam-button"
                              onClick={() => { 
                                setActiveTab("RESULT EXAM"); 
                                setExamSearchQuery(employee.tracking_code); 
                              }}
                            >
                              View Exam
                            </button>
                            
                            <button 
                              className="info-button" 
                              onClick={() => openModal(employee)}
                              aria-label="View details"
                            >
                              ℹ️
                            </button>
                            
                          </td>
                        </tr>
                      ))}
                      
                    {Array.isArray(userData) && userData.filter(user => 
                      user.tracking_code?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
                      user.name?.toLowerCase().includes(safetySearchQuery.toLowerCase()) || 
                      user.role?.toLowerCase().includes(safetySearchQuery.toLowerCase())
                    ).length === 0 && (
                      <tr>
                        <td colSpan="5" className="no-results">No matching applicants found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              </div>
            </section>
          )}
              
            {activeTab === "CHECKLIST" && (
            <>
              <div className="pagination-container" style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 100
              }}>
                <PaginationArrow 
                currentPage={checklistPage} 
                onPageChange={handlePageChange}
                hasMorePages={checklistPage * itemsPerPage < checklist.length}
              />
              </div>
              
              <section className="data-card">
                <div className="card-header">
                  <h2>Application Checklist</h2>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tracking Code</th>
                        <th>Name</th>
                        <th>Applied Role</th>
                        <th>Status / Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklist
                        .filter(item =>
                          item.name.toLowerCase().includes(checklistSearchQuery.toLowerCase()) ||
                          item.trackingCode.toLowerCase().includes(checklistSearchQuery.toLowerCase())
                        )
                        .slice((checklistPage - 1) * itemsPerPage, checklistPage * itemsPerPage)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{item.trackingCode}</td>
                            <td>{item.name}</td>
                            <td><span className="role-badge">{item.appliedRole}</span></td>
                            <td>
                              <span className={`status-badge status-${item.action.toLowerCase()}`}>
                                {item.action}
                              </span>
                              
                              <button
                                className="action-button view-button"
                                onClick={() => openChecklistView(item.appliedRole, item.trackingCode)}
                              >
                                View Checklist
                              </button>
                            </td>
                          </tr>
                        ))}
                      
                      {checklist.filter(item =>
                        item.name.toLowerCase().includes(checklistSearchQuery.toLowerCase()) ||
                        item.trackingCode.toLowerCase().includes(checklistSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="4" className="no-results">No matching checklist items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

        {activeTab === "RESULT EXAM" && (
        <>
          <div className="pagination-container" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 100
          }}>
            <PaginationArrow 
            currentPage={examResultsPage} 
            onPageChange={handlePageChange}
            hasMorePages={examResultsPage * itemsPerPage < examResults.length}
          />
          </div>
          
          <section className="data-card">
            <div className="card-header">
              <h2>Exam Results</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking Code</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(examResults) && examResults
                    .filter(exam => 
                      exam.tracking_code && typeof exam.tracking_code === 'string' && 
                      exam.tracking_code.toLowerCase().includes(examSearchQuery.toLowerCase())
                    )
                    .slice((examResultsPage - 1) * itemsPerPage, examResultsPage * itemsPerPage)
                    .map((result) => {
                      const details = result.details || {};
                      const { examName, mc_score, score, mc_results, passing_score, passed } = details;

                      return (
                        <tr key={result.id || result.tracking_code}>
                          <td>{result.tracking_code}</td>
                          <td>{examName || 'N/A'}</td> 
                          <td>{result.score}</td>
                          <td>{mc_score || mc_results}%</td> 
                          <td>
                            <span className={`status-badge status-${passed ? 'passed' : 'failed'}`}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    
                  {Array.isArray(examResults) && examResults.filter(exam => 
                    exam.tracking_code && typeof exam.tracking_code === 'string' && 
                    exam.tracking_code.toLowerCase().includes(examSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-results">No matching exam results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
          
          {activeTab !== "MGB APPLICANTS" && activeTab !== "RESULT EXAM" && activeTab !== "CHECKLIST" && (
            <section className="content-placeholder">
              <header>
                <h1>{activeTab}</h1>
              </header>
              <p>Content for {activeTab} coming soon...</p>
            </section>
          )}
        </main>
      </div>
      
      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Applicant Details</h2>
              <button 
                className="modal-close-button" 
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedEmployee.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{selectedEmployee.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedEmployee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedEmployee.contactNo || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedEmployee.address || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Education:</span>
                  <span className="detail-value">OnGoing_Test</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">OnGoing_Test</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Skills:</span>
                  <span className="detail-value">OnGoing_Test</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}  

     {/* Application View Overlay */}
      {showApplicationView && (
        <div className="document-overlay">
          <div className="document-overlay-content">
            <button 
              className="document-overlay-close-button"
              onClick={() => { 
                setShowApplicationView(false); 
                setSelectedApplicationRole(''); 
                setSelectedApplicationTrackingCode(''); 
              }}
            >
              ×
            </button>
            <div className="document-overlay-header">
              <h2>Application Document - {selectedApplicationTrackingCode}</h2>
              <p>Role: {selectedApplicationRole}</p>
            </div>
            <div className="document-content-wrapper">
              <TrackingDocumentView 
                role={selectedApplicationRole} 
                trackingcode={selectedApplicationTrackingCode}
              />
            </div>
          </div>
        </div>
      )}

      {/* ChecklistView - Let the component handle its own display */}
      {showChecklistView && (
        <ChecklistView 
          key={checklistKey} // Add key to force remounting
          role={selectedChecklistRole} 
          trackingcode={selectedChecklistTrackingCode}
        />
      )}
    </>
  );
};

export default Dashboard;