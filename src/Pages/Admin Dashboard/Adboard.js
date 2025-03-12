import React, { useState, useEffect } from "react";
import "./Adboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("MGB APPLICANTS");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulating loading time
  }, []);

  const employees = [
    { 
      id: 1, 
      name: "Archieliz Asesor", 
      roles: "Safety Engineer", 
      email: "azizahgmail.com",
      phone: "+63 912 345 6789",
      address: "Burgos, Cagayan de Oro City",
      education: "BSIT, University of Science and Technology of Southern Philippines",
      experience: "15 years in software engineer",
      skills: "Front-end Developer, Back-end Developer"
    },
    { 
      id: 2, 
      name: "Mary Alyssa Bual", 
      roles: "Safety Inspector", 
      email: "maryalyssa@gmail.com",
      phone: "+63 923 456 7890",
      address: "Gusa, Cagayan de Oro City",
      education: "BSIT, University of Science and Technology of Southern Philippines",
      experience: "12 years in inspecting",
      skills: "Inspector, best in investigating"
    },
    { 
      id: 3, 
      name: "Krishallaine Calixtro", 
      roles: "Safety Engineer", 
      email: "krishallaine@gmail.com",
      phone: "+63 934 567 8901",
      address: "Calaanan, Cagayan de Oro City",
      education: "BSIT, University of Science and Technology of Southern Philippines",
      experience: "8 years in engineering",
      skills: "creative, artistic"
    },
    { 
      id: 4, 
      name: "John Michael Calderon", 
      roles: "Safety Inspector", 
      email: "jmcacalds@gmail.com",
      phone: "+63 934 567 8901",
      address: "Agora Lapasan, Cagayan de Oro City",
      education: "BSIT, University of Science and Technology of Southern Philippines",
      experience: "8 years in inspecting",
      skills: "abnormalism expert"
    },
    { 
      id: 5, 
      name: "Krisha Naldo", 
      roles: "Safety Engineer", 
      email: "krishaescarda@gmail.com",
      phone: "+63 934 567 8901",
      address: "Igpit, Opol",
      education: "BSIT, University of Science and Technology of Southern Philippines",
      experience: "20 years in engineering, team leadership",
      skills: "abnormalism expert"
    }
  ];

  const examResults = [
    { id: 1, code: "A001", name: "Archieliz Asesor", type: "SE", examScore: 28, status: "Passed" },
    { id: 2, code: "A002", name: "Mary Alyssa Bual", type: "SI", examScore: 25, status: "Passed" },
    { id: 3, code: "A003", name: "Krishallaine Calixtro", type: "SE", examScore: 29, status: "Passed" },
    { id: 4, code: "A004", name: "John Michael Calderon", type: "SI", examScore: 20, status: "Failed" },
    { id: 5, code: "A005", name: "Krisha Naldo", type: "SE", examScore: 26, status: "Passed" }
  ];

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="earth">
        <div className="earth-loader">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M29.4,-17.4C33.1,1.8,27.6,16.1,11.5,31.6C-4.7,47,-31.5,63.6,-43,56C-54.5,48.4,-50.7,16.6,-41,-10.9C-31.3,-38.4,-15.6,-61.5,-1.4,-61C12.8,-60.5,25.7,-36.5,29.4,-17.4Z" fill="#7CC133"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M31.7,-55.8C40.3,-50,45.9,-39.9,49.7,-29.8C53.5,-19.8,55.5,-9.9,53.1,-1.4C50.6,7.1,43.6,14.1,41.8,27.6C40.1,41.1,43.4,61.1,37.3,67C31.2,72.9,15.6,64.8,1.5,62.2C-12.5,59.5,-25,62.3,-31.8,56.7C-38.5,51.1,-39.4,37.2,-49.3,26.3C-59.1,15.5,-78,7.7,-77.6,0.2C-77.2,-7.2,-57.4,-14.5,-49.3,-28.4C-41.2,-42.4,-44.7,-63,-38.5,-70.1C-32.2,-77.2,-16.1,-70.8,-2.3,-66.9C11.6,-63,23.1,-61.5,31.7,-55.8Z" fill="#7CC133"></path>
          </svg>
        </div>
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo"></h2>
        <nav>
          <ul>
            <li 
              className={activeTab === "MGB APPLICANTS" ? "active" : ""}
              onClick={() => setActiveTab("MGB APPLICANTS")}
            >
              MGB APPLICANTS
            </li>
            <li 
              className={activeTab === "CHECKLIST" ? "active" : ""}
              onClick={() => setActiveTab("CHECKLIST")}
            >
              CHECKLIST
            </li>
            <li 
              className={activeTab === "RESULT EXAM" ? "active" : ""}
              onClick={() => setActiveTab("RESULT EXAM")}
            >
              RESULT EXAM
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {activeTab === "MGB APPLICANTS" && (
          <section className="users-table">
            <h2>List of Applicants for Safety Engineer and Inspector Roles</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roles</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.roles}</td>
                    <td>{employee.email}</td>
                    <td>
                      <button 
                        className="info-icon" 
                        onClick={() => openModal(employee)}
                        aria-label="View details"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {activeTab === "RESULT EXAM" && (
  <section className="exam-results-table">
    <h2>Exam Results</h2>
    <table>
      <thead>
        <tr>
          <th>Code</th> {/* Code column */}
          <th>Name</th>
          <th>Type</th> {/* Type column */}
          <th>Score</th>
          <th>Percentage</th> {/* Add Percentage column */}
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {examResults.map((result) => {
          // Calculate percentage (assuming max score of 30)
          const percentage = ((result.examScore / 30) * 100).toFixed(2);

          return (
            <tr key={result.id}>
              <td>{result.code}</td> {/* Code column */}
              <td>{result.name}</td>
              <td>{result.type}</td> {/* Type column */}
              <td>{result.examScore}</td>
              <td>{percentage}%</td> {/* Percentage column */}
              <td>{result.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </section>
)}
        {activeTab !== "MGB APPLICANTS" && activeTab !== "RESULT EXAM" && (
          <section className="content-placeholder">
            <header>
              <h1>{activeTab}</h1>
            </header>
            <p>Content for {activeTab} coming soon...</p>
          </section>
        )}
      </main>
      
      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Applicant Details</h2>
              <button 
                className="close-button" 
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedEmployee.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{selectedEmployee.roles}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedEmployee.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedEmployee.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{selectedEmployee.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Education:</span>
                <span className="detail-value">{selectedEmployee.education}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Experience:</span>
                <span className="detail-value">{selectedEmployee.experience}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Skills:</span>
                <span className="detail-value">{selectedEmployee.skills}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
