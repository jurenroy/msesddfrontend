import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import mgbxImage from '../../Assets/mgbx.png';

const ChecklistView = ({ role, trackingcode }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [notarizedFiles, setNotarizedFiles] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState({});
  const [adminEvaluation, setAdminEvaluation] = useState("");
  const [adminReviewer, setAdminReviewer] = useState("");
  const [complianceStatus, setComplianceStatus] = useState({});
  const modalRef = useRef(null);

  const isAdmin = window.location.pathname.includes('/admin');
  console.log("Is admin:", isAdmin);    

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}`);
        setTrackingData(response.data);
        setError(null);
        console.log(response.data);
      } catch (err) {
        setError('Error fetching tracking data.');
        console.error(err);
      }
    };

    fetchTrackingData();
  }, [trackingcode]);

  useEffect(() => {
    const fetchNotarizedFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}/notarized-files/`);
        setNotarizedFiles(response.data);
        setError(null);
        console.log(response.data);
      } catch (err) {
        setError('Error fetching Notarized Files.');
        console.error(err);
      }
    };

    fetchNotarizedFiles();
  }, [trackingcode]);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/checklist/${trackingcode}`);
        const checklistData = response.data;
        setChecklist(response.data);
        
        
        const initialRemarks = {};
        const initialComplianceStatus = {};

        const fieldswithRemarks = [
          'application_form',
          'college_diploma',
          'highschool_diploma',
          'other_credentials',
          'present_employment',
          'previous_employment',
          'latest_photo',
          'endorsement_contractor',
          'endorsement_safety_manager',
          'osh_new',
          'osh_renewal',
          'renewal_permit',
          'proof_safety_inspection',
          'proof_osh_committee',
          'proof_osh_program'
        ];

        fieldswithRemarks.forEach(field => {
          const remarksKey = `${field}_remarks`;
          if (checklistData[remarksKey]) {
            initialRemarks[field] = checklistData[remarksKey];
          }

          const complianceKey = `${field}_compliance`;
          if (checklistData[complianceKey] !== undefined) {
            initialComplianceStatus[field] = checklistData[complianceKey] ? "yes" : "no";
          }
        });

        setAdminRemarks(initialRemarks);
        setComplianceStatus(initialComplianceStatus);

        if (checklistData.initial_evaluation) {
          setAdminEvaluation(checklistData.initial_evaluation);
        }

        if (checklistData.reviewed_by) {
          setAdminReviewer(checklistData.reviewed_by);
        }
        setError(null);
        console.log("naa dri ang mga files",response.data);
        setIsModalOpen(true);
      } catch (err) {
        setError('Error fetching checklist.');
        console.error(err);
      }
    };

    fetchChecklist();
  }, [trackingcode, setAdminEvaluation, setAdminReviewer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen]);


  const handleClick = (media) => {
    if (!media) return;
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const mediaPath = media.startsWith('/') ? media : `/${media}`;
    const url = `${baseUrl}${mediaPath}`;

    window.open(url, '_blank');
};


const handleFileUpload = async (e, fieldName) => {
  if (isAdmin) return; // Block uploads for admin users

  const file = e.target.files[0];
  if (!file) return;

  setUploading(prev => ({ ...prev, [fieldName]: true }));

  try {
    const formData = new FormData();
    // Append the file with the actual field name from the model
    formData.append(fieldName, file);
    
    const response = await axios.put(
      `${API_BASE_URL}api/checklist/${trackingcode}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Update the local state with the returned file URL
    setChecklist(prev => ({
      ...prev,
      [fieldName]: response.data[fieldName]
    }));

    setError(null);
  } catch (err) {
    setError(`Error uploading file: ${err.message}`);
    console.error(err);
  } finally {
    setUploading(prev => ({ ...prev, [fieldName]: false }));
  }
};

  const toggleCompliance = (field, status) => {
    if (!isAdmin) return;
  
    setComplianceStatus(prev => {
      const newStatus = {...prev};
      newStatus[field] = prev[field] === status ? null : status;
      return newStatus;
    });
  };
  
  const handleAdminSave = async () => {
    if (!isAdmin) return;
  
    try {
      // Only include the fields we specifically want to update
      const updatedData = {
        // Only include these fields from the form
        initial_evaluation: adminEvaluation,
        reviewed_by: adminReviewer,
        tracking_code: trackingcode,
      };
  
      // Add compliance status fields that were explicitly set
      Object.keys(complianceStatus).forEach(field => {
        if (complianceStatus[field] !== null) {
          const complianceKey = `${field}_compliance`;
          updatedData[complianceKey] = complianceStatus[field] === "yes";
        }
      });
  
      // Add remarks fields that were explicitly set
      Object.keys(adminRemarks).forEach(field => {
        if (adminRemarks[field] !== undefined && adminRemarks[field] !== "") {
          const remarksKey = `${field}_remarks`;
          updatedData[remarksKey] = adminRemarks[field];
        }
      });
  
      console.log("Saving updated checklist:", updatedData); 
  
      const response = await axios.put(
        `${API_BASE_URL}api/checklist/${trackingcode}/`, 
        updatedData
      );
  
      if (response.data) {
        // Update the specific fields in the UI that we changed
        setChecklist(prevChecklist => ({
          ...prevChecklist,
          initial_evaluation: response.data.initial_evaluation,
          reviewed_by: response.data.reviewed_by,
          ...Object.keys(complianceStatus)
            .filter(field => complianceStatus[field] !== null)
            .reduce((acc, field) => {
              const complianceKey = `${field}_compliance`;
              if (response.data[complianceKey] !== undefined) {
                acc[complianceKey] = response.data[complianceKey];
              }
              return acc;
            }, {}),
          ...Object.keys(adminRemarks)
            .filter(field => adminRemarks[field] !== undefined && adminRemarks[field] !== "")
            .reduce((acc, field) => {
              const remarksKey = `${field}_remarks`;
              if (response.data[remarksKey] !== undefined) {
                acc[remarksKey] = response.data[remarksKey];
              }
              return acc;
            }, {})
        }));
        alert('Checklist evaluation saved successfully!');
      } else {
        alert('Checklist evaluation saved successfully!');
      }
    } catch (err) {
      console.error("Error saving admin evaluation:", err);
      setError('Error saving admin evaluation: ' + (err.response?.data?.message || err.message));
      alert('Error saving evaluation: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleSaveChecklist = async () => {
    alert('Checklist saved successfully!');
  };
  const ComplianceCell = ({ field }) => {
    const complianceValue = complianceStatus[field] || 
                           (checklist && checklist[`${field}_compliance`] !== undefined ? 
                            (checklist[`${field}_compliance`] ? "yes" : "no") : null);
    
    const isYes = complianceValue === "yes";
    const isNo = complianceValue === "no";
  
    return (
      <>
        <td onClick={() => isAdmin && toggleCompliance(field, "yes")} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '8px', 
              textAlign: 'center', 
              color: isYes ? 'green' : '#ccc', 
              fontWeight: isYes ? 'bold' : 'normal', 
              cursor: isAdmin ? 'pointer' : 'default', 
              backgroundColor: isYes ? '#f0fff0' : 'transparent' 
            }}>
          {isYes ? '✔' : '✔'} {/* Show checkmark if yes */}
        </td>
        <td onClick={() => isAdmin && toggleCompliance(field, "no")} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '8px', 
              textAlign: 'center', 
              color: isNo ? 'red' : '#ccc', 
              fontWeight: isNo ? 'bold' : 'normal', 
              cursor: isAdmin ? 'pointer' : 'default', 
              backgroundColor: isNo ? '#fff0f0' : 'transparent' 
            }}>
          {isNo ? '✖' : '✖'} {/* Show X if no */}
        </td>
      </>
    );
  };
  
  const RemarksCell = ({ field, adminRemarks, setAdminRemarks }) => {
  const remarksKey = `${field}_remarks`;
  const textareaRef = useRef(null);
  
  // Use useEffect to maintain focus after state changes
  useEffect(() => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [adminRemarks[field]]);

  return (
    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
      {isAdmin ? (
        <textarea
          ref={textareaRef}
          value={adminRemarks[field] || ""}
          onChange={(e) => {
            setAdminRemarks(prev => ({
              ...prev,
              [field]: e.target.value
            }));
          }}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '80px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical',
            outline: 'none'
          }}
          placeholder="Enter remarks"
        />
      ) : (
        <p style={{ margin: 0 }}>
          {(adminRemarks[field] || checklist[`${field}_remarks`] || 'No remarks provided.')}
        </p>
      )}
    </td>
  );
};
  const textareaStyle = {
    ".textarea-remarks": {
      width: "100%",
      minHeight: "80px",
      resize: "vertical",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "8px",
      fontSize: "14px",
    },
    ".otherstable": {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      margin: "3px 0"
    },
    ".otherstable input[type='text']": {
      width: "150px",
      marginLeft: "5px",
      fontSize: "12px",
      height: "20px",
      padding: "0 5px",
      border: "1px solid #ccc",
      borderRadius: "3px"
    }
  };
  
  const FileUploadItem = ({ label, fieldName, existingFile }) => (
    <p style={{ margin: '3px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      • {label}
      {!isAdmin && (
        <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
          <label htmlFor={`file-${fieldName}`} style={{
            padding: '5px 10px',
            backgroundColor: '#0066cc',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '5px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'inline-block'
          }}>
            CHOOSE FILE
          </label>
          <input 
            type="file" 
            id={`file-${fieldName}`}
            onChange={(e) => handleFileUpload(e, fieldName)}
            style={{ 
              width: '0.1px',
              height: '0.1px',
              opacity: 0,
              overflow: 'hidden',
              position: 'absolute',
              zIndex: '-1'
            }}
          />
          {uploading[fieldName] && 
            <span style={{ 
              marginLeft: '5px', 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#ff6600'
            }}>
              Uploading...
            </span>
          }
        </span>
      )}
      <span 
        onClick={existingFile ? () => handleClick(existingFile) : null} 
        style={{
          cursor: existingFile ? 'pointer' : 'default', 
          fontWeight: 'bold', 
          marginLeft: '10px',
          fontSize: '14px',
          color: existingFile ? '#0066cc' : '#999',
          padding: '3px 8px',
          backgroundColor: existingFile ? '#f0f7ff' : '#f5f5f5',
          borderRadius: '3px',
          border: existingFile ? '1px solid #cce5ff' : '1px solid #ddd',
          display: existingFile || isAdmin ? 'inline-block' : 'none'
        }}>
        {existingFile ? 'VIEW FILE' : (isAdmin ? 'NO DOCUMENT' : '')}
      </span>
    </p>
  );

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}> 
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div 
            ref={modalRef}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '90vh',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0066cc',
              borderRadius: '8px 8px 0 0',
              color: 'white'
            }}>
              <h3 style={{ margin: 0, fontWeight: 'bold' }}>Checklist of Requirements</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body with Scrollable Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              {/* A4 Container */}
              <div className="a4-container" style={{
                backgroundColor: 'white',
                width: '210mm',
                minHeight: '297mm',
                padding: '15mm',
                margin: '0 auto',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                borderRadius: '2px'
              }}>
                {trackingData && checklist && (
                  <div>
                    <div style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <img src={mgbxImage} alt="logo" style={{ width: '100px', height: 'auto', marginTop: '-30px' }} />
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <h5 style={{ marginTop: '-30px', marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>CHECKLIST OF REQUIREMENTS</h5>
                          <h5 style={{ marginTop: '0px', fontSize: '16px', fontWeight: 'bold' }}>SAFETY {role.toUpperCase()}'S PERMIT APPLICATION</h5>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      width: '100%', 
                      marginTop: '20px', 
                      fontSize: '14px',
                      backgroundColor: '#f9f9f9',
                      padding: '15px',
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px', fontWeight: 'bold' }}>NAME OF APPLICANT</p>
                        <p style={{ marginRight: '10px', fontWeight: 'bold' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.name}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px', fontWeight: 'bold' }}>ADDRESS</p>
                        <p style={{ marginRight: '10px', fontWeight: 'bold' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.address}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px', fontWeight: 'bold' }}>CONTACT NO.</p>
                        <p style={{ marginRight: '10px', fontWeight: 'bold' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.contactNo}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px', fontWeight: 'bold' }}>DATE</p>
                        <p style={{ marginRight: '10px', fontWeight: 'bold' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.date}</p>
                      </div>
                    </div>
                    
                    {/* Table content starts here */}
                    <div style={{ marginTop: '20px', fontSize: '12px' }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse', 
                        textAlign: 'left',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ width: '55%', border: '1px solid #ddd', padding: '10px' }}>DOCUMENTS REQUIRED</th>
                            <th colSpan="2" style={{ textAlign: 'center', border: '1px solid #ddd', padding: '10px' }}>
                              <p style={{ margin: '0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>COMPLIANCE</p>
                              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '-10px', marginBottom: '-25px' }}>
                                <p style={{ marginTop:'10px', marginBottom: '15px' }}>YES</p>
                                <p style={{ fontSize: '15px', marginTop: '10px', fontWeight: 'bold', color: '#888'   }}>|</p>
                                <p style={{ marginTop:'10px', marginBottom: '15px' }}>NO</p>
                              </div>
                            </th>
                            <th style={{ width: '30%', border: '1px solid #ddd', padding: '10px' }}>REMARKS</th>
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: 'justify' }}>
                          <tr style={{ backgroundColor: '#eaf1fb' }}>
                            <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ marginTop: '0', marginBottom: '0', fontWeight: 'bold' }}>Mandatory Acceptance Requirements</p>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}> 
                              <div>
                                <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Duly filled-up Application Form</p>
                                <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                  <FileUploadItem 
                                    label="Duly filled application form" 
                                    fieldName="application_form" 
                                    existingFile={checklist.application_form} 
                                  />
                                </div>
                              </div>
                            </td>
                            <ComplianceCell field="application_form" />
                            <RemarksCell field="application_form" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks}
                            />
                          </tr>
                          <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Certified photocopy of college diploma or high school diploma, or pertinent credentials, as the case may be;</p>
                              <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                <FileUploadItem 
                                  label="College Diploma - Certified by school registrar" 
                                  fieldName="college_diploma" 
                                  existingFile={checklist.college_diploma}
                                />
                                <FileUploadItem 
                                  label="High School Diploma - Certified by school registrar" 
                                  fieldName="highschool_diploma" 
                                  existingFile={checklist.high_school_diploma} 
                                />
                                <FileUploadItem 
                                  label="Other pertinent credentials - Photocopy (if any)" 
                                  fieldName="other_credentials" 
                                  existingFile={checklist.other_credentials} 
                                />
                              </div>
                            </td>
                            <ComplianceCell field="college_diploma" />
                            <RemarksCell field="college_diploma" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Certificate of employment (present and previous), signed under oath; (Indicate name, position and date of appointment at present position using the official letter head of the company)</p>
                              <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                <FileUploadItem 
                                  label="Present employer (duly notarized)" 
                                  fieldName="present_employment" 
                                  existingFile={checklist.present_employer_notarized} 
                                />
                                <FileUploadItem 
                                  label="Previous employer" 
                                  fieldName="previous_employment" 
                                  existingFile={checklist.previous_employment} 
                                />
                              </div>
                            </td>
                            <ComplianceCell field="present_employment" />
                            <RemarksCell field="present_employment" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Latest photograph, 2 inches X 2 inches</p>
                              <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                <FileUploadItem 
                                  label="White background" 
                                  fieldName="latest_photo" 
                                  existingFile={checklist.latest_photo} 
                                />
                              </div>
                            </td>
                            <ComplianceCell field="latest_photo" />
                            <RemarksCell field="latest_photo" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Registration/Application Fee:</p>
                              <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                <FileUploadItem 
                                  label={`Permanent Safety ${role} - 1,500 (valid for 3 years)`} 
                                  fieldName="fee_permanent" 
                                  existingFile={checklist.fee_permanent} 
                                />
                                <FileUploadItem 
                                  label={`Temporary Safety ${role} - 1,000 (Valid for 1 year)`}
                                  fieldName="fee_temporary" 
                                  existingFile={checklist.fee_temporary} 
                                />
                              </div>
                            </td>
                            <ComplianceCell field="fee" />
                            <RemarksCell field="fee" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                         
                          <tr style={{ backgroundColor: '#eaf1fb' }}>
                            <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Other Requirements </p>
                            </td>
                          </tr>
                          
                          <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0', fontWeight: 'bold' }}>Endorsement Letter</p>
                              <div style={{ marginLeft: '15px', fontSize: '12px' }}>
                                <FileUploadItem
                                  label="Official from contractor/permittee/lessee/permit holder"
                                  fieldName="endorsement_contractor"
                                  existingFile={checklist.endorsement_contractor}
                                />
                                <FileUploadItem
                                  label="Safety Manager if applicant from service contractor"
                                  fieldName="endorsement_safety_manager"
                                  existingFile={checklist.endorsement_safety_manager}
                                />
                              </div>
                            </td>
                            <ComplianceCell field="endorsement" />
                            <RemarksCell field="endorsement" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>

                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0' }}>
                                <span style={{ fontWeight: 'bold' }}>Photocopy of certificates Occupational Safety and Health (OSH) trainings/seminars</span> sponsored by Bureau and/or other recognized institution.
                              </p>
                              <div style={{ marginLeft: '15px', fontSize: '11px' }}>
                                <FileUploadItem
                                  label="New application - at least 40 hours training"
                                  fieldName="osh_new"
                                  existingFile={checklist.osh_new}
                                />
                                <FileUploadItem
                                  label="Renewal Application - At least 16 hours per year or 48 hours of training for 3 years"
                                  fieldName="osh_renewal"
                                  existingFile={checklist.osh_renewal}
                                />
                              </div>
                            </td>
                            <ComplianceCell field="osh_new" />
                            <RemarksCell field="osh_new" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0' }}>
                                For renewal application <span style={{ fontWeight: 'bold' }}>a photocopy of Safety Engineer's Permit</span> last issued
                              </p>
                              <div style={{ marginLeft: '15px', fontSize: '11px' }}>
                                <FileUploadItem
                                  label="Previous permit"
                                  fieldName="renewal_permit"
                                  existingFile={checklist.renewal_permit}
                                />
                              </div>
                            </td>
                            <ComplianceCell field="renewal_permit" />
                            <RemarksCell field="renewal_permit" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <p style={{ margin: '3px 0' }}>
                                <span style={{ fontWeight: 'bold' }}>For New and Renewal:</span> Proof/s of accomplishment or participation in OSH (at least one of the following).
                              </p>
                              <div style={{ marginLeft: '15px', fontSize: '11px' }}>
                                <FileUploadItem
                                  label="Accident Report"
                                  fieldName="proof_safety_inspection"
                                  existingFile={checklist.proof_safety_inspection}
                                />
                                <FileUploadItem
                                  label="OSH committee report"
                                  fieldName="proof_osh_committee"
                                  existingFile={checklist.proof_osh_committee}
                                />
                                <FileUploadItem
                                  label="OSH/SHP program prepared/implemented"
                                  fieldName="proof_osh_program"
                                  existingFile={checklist.proof_osh_program}
                                />
                                
                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', margin: '3px 0' }}>
                                  <span>• Other reports prepared by the applicant, please specify: </span>
                                  {!isAdmin ? (
                                    <input
                                      type="text"
                                      value={checklist.other_reports_description || ''}
                                      onChange={(e) => {
                                        setChecklist(prev => ({
                                          ...prev,
                                          other_reports_description: e.target.value
                                        }));
                                      }}
                                      style={{ 
                                        width: '120px', 
                                        marginLeft: '5px', 
                                        fontSize: '10px', 
                                        height: '16px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        padding: '2px 5px'
                                      }}
                                    />
                                  ) : (
                                    <span style={{ marginLeft: '5px', fontSize: '10px' }}>
                                      {checklist.other_reports_description || '(Not specified)'}
                                    </span>
                                  )}
                                  {!isAdmin && (
                                    <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                      <label htmlFor="file-proof_other_reports" style={{
                                        padding: '3px 8px',
                                        backgroundColor: '#0066cc',
                                        color: 'white',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        margin: '5px 0',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        display: 'inline-block'
                                      }}>
                                        CHOOSE FILE
                                      </label>
                                      <input 
                                        type="file" 
                                        id="file-proof_other_reports"
                                        onChange={(e) => handleFileUpload(e, 'proof_other_reports')}
                                        style={{ 
                                          width: '0.1px',
                                          height: '0.1px',
                                          opacity: 0,
                                          overflow: 'hidden',
                                          position: 'absolute',
                                          zIndex: '-1'
                                        }}
                                      />
                                      {uploading['proof_other_reports'] && 
                                        <span style={{ 
                                          marginLeft: '5px', 
                                          fontSize: '15px', 
                                          fontWeight: 'bold',
                                          color: '#ff6600'
                                        }}>
                                          Uploading...
                                        </span>
                                      }
                                    </span>
                                  )}
                                  {checklist.proof_other_reports && 
                                    <span 
                                      onClick={() => handleClick(checklist.proof_other_reports)} 
                                      style={{
                                        cursor: 'pointer', 
                                        fontWeight: 'bold', 
                                        textDecoration: 'underline', 
                                        marginLeft: '10px',
                                        fontSize: '15px',
                                        color: '#0066cc',
                                        padding: '2px 6px',
                                        backgroundColor: '#f0f7ff',
                                        borderRadius: '3px',
                                        border: '1px solid #cce5ff'
                                      }}>
                                      VIEW FILE
                                    </span>
                                  }
                                </div>
                              </div>
                            </td>
                            <ComplianceCell field="proof_other_reports" />
                            <RemarksCell field="proof_other_reports" 
                            adminRemarks={adminRemarks} 
                            setAdminRemarks={setAdminRemarks} 
                            />
                          </tr>
                          <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                              INITIAL EVALUATION
                            </td>
                            <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold'}}>
                              REVIEWED BY:
                            </td>
                          </tr>
                          <tr>
                          <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', height: '80px' }}>
  {isAdmin ? (
    <textarea
      value={adminEvaluation}
      onChange={(e) => setAdminEvaluation(e.target.value)}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '80px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        resize: 'vertical' // Allow vertical resizing
      }}
      placeholder="Enter your evaluation here..."
    />
  ) : (
    <p style={{ margin: 0 }}>{checklist.initial_evaluation || 'No evaluation provided.'}</p>
  )}
</td>
<td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', height: '80px' }}>
  {isAdmin ? (
    <input
      type="text"
      value={adminReviewer}
      onChange={(e) => setAdminReviewer(e.target.value)}
      style={{
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px'
      }}
      placeholder="Enter reviewer name"
    />
  ) : (
    <p style={{ margin: 0 }}>{checklist.reviewed_by || 'Not reviewed yet.'}</p>
  )}
</td>
                          </tr>
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'right', padding: '10px' }}>
                              {isAdmin && (
                                <button 
                                  onClick={handleAdminSave}
                                  style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginTop: '10px'
                                  }}
                                >
                                  Save Evaluation
                                </button>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          {error}
        </div>
      )}

      {!isModalOpen && (
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          Open Checklist
        </button>
      )}
    </div>
  );
};

export default ChecklistView;