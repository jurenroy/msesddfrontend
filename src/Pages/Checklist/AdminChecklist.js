import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import mgbxImage from '../../Assets/mgbx.png';

const AdminChecklist = ({ trackingcode }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch application tracking data
        const trackingResponse = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}`);
        setTrackingData(trackingResponse.data);
        
        // Fetch checklist data
        const checklistResponse = await axios.get(`${API_BASE_URL}api/checklist/${trackingcode}`);
        setChecklist(checklistResponse.data);
        
        setError(null);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        console.error(err);
      }
    };

    fetchData();
  }, [trackingcode]);

  // Function to toggle compliance status (Yes/No)
  const toggleCompliance = (fieldName) => {
    if (!checklist) return;
    
    setChecklist(prev => ({
      ...prev,
      [`${fieldName}_compliance`]: prev[`${fieldName}_compliance`] === 'yes' ? 'no' : 'yes'
    }));
  };

  // Function to update remarks
  const updateRemarks = (fieldName, value) => {
    setChecklist(prev => ({
      ...prev,
      [`${fieldName}_remarks`]: value
    }));
  };

  // Function to handle saving the admin updates
  const handleSaveChecklist = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}api/admin/checklist/${trackingcode}`, checklist);
      alert('Admin checklist updates saved successfully!');
    } catch (err) {
      setError('Error saving checklist: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Function to view uploaded files
  const handleViewFile = (media) => {
    if (!media) return;
    const url = `${API_BASE_URL}${media}`;
    window.open(url, '_blank');
  };

  if (!trackingData || !checklist) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading application data...</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // Admin UI for document compliance and remarks
  const DocumentReviewItem = ({ label, fieldName }) => (
    <tr>
      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
        <strong>{label}</strong>
        {checklist[fieldName] && (
          <button 
            onClick={() => handleViewFile(checklist[fieldName])}
            style={{
              marginLeft: '10px',
              padding: '2px 8px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            View File
          </button>
        )}
      </td>
      <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'center' }}>
        <button 
          onClick={() => toggleCompliance(fieldName)}
          style={{
            padding: '5px 10px',
            backgroundColor: checklist[`${fieldName}_compliance`] === 'yes' ? '#4CAF50' : '#f0f0f0',
            color: checklist[`${fieldName}_compliance`] === 'yes' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          YES
        </button>
      </td>
      <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'center' }}>
        <button 
          onClick={() => toggleCompliance(fieldName)}
          style={{
            padding: '5px 10px',
            backgroundColor: checklist[`${fieldName}_compliance`] === 'no' ? '#f44336' : '#f0f0f0',
            color: checklist[`${fieldName}_compliance`] === 'no' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          NO
        </button>
      </td>
      <td style={{ border: '1px solid #ddd', padding: '5px' }}>
        <input
          type="text"
          value={checklist[`${fieldName}_remarks`] || ''}
          onChange={(e) => updateRemarks(fieldName, e.target.value)}
          placeholder="Add remarks..."
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        />
      </td>
    </tr>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: '#0066cc', 
        color: 'white', 
        padding: '15px', 
        borderRadius: '5px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Admin Review Panel - Safety {trackingData.role?.toUpperCase()}'s Permit</h2>
        <span>Tracking Code: {trackingcode}</span>
      </div>

      {/* Applicant Info Panel */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px', 
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={mgbxImage} alt="logo" style={{ width: '80px', height: 'auto' }} />
          <div>
            <h3 style={{ margin: '0 0 10px 0' }}>Applicant Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><strong>Name:</strong> {trackingData.name}</div>
              <div><strong>Contact:</strong> {trackingData.contactNo}</div>
              <div><strong>Address:</strong> {trackingData.address}</div>
              <div><strong>Date:</strong> {trackingData.date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Review Table */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Document Review</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ width: '40%', border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Document</th>
              <th style={{ width: '10%', border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>Yes</th>
              <th style={{ width: '10%', border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>No</th>
              <th style={{ width: '40%', border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#eaf1fb' }}>
              <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                Mandatory Acceptance Requirements
              </td>
            </tr>
            
            <DocumentReviewItem 
              label="Duly filled application form" 
              fieldName="application_form" 
            />
            
            <DocumentReviewItem 
              label="College Diploma" 
              fieldName="college_diploma" 
            />
            
            <DocumentReviewItem 
              label="High School Diploma" 
              fieldName="highschool_diploma" 
            />
            
            <DocumentReviewItem 
              label="Other Credentials" 
              fieldName="other_credentials" 
            />
            
            <DocumentReviewItem 
              label="Present Employment Certificate" 
              fieldName="present_employment" 
            />
            
            <DocumentReviewItem 
              label="Previous Employment Certificate" 
              fieldName="previous_employment" 
            />
            
            <DocumentReviewItem 
              label="Latest Photo (2x2)" 
              fieldName="latest_photo" 
            />
            
            <tr style={{ backgroundColor: '#eaf1fb' }}>
              <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                Other Requirements
              </td>
            </tr>
            
            <DocumentReviewItem 
              label="Endorsement Letter (Contractor)" 
              fieldName="endorsement_contractor" 
            />
            
            <DocumentReviewItem 
              label="Endorsement Letter (Safety Manager)" 
              fieldName="endorsement_safety_manager" 
            />
            
            <DocumentReviewItem 
              label="OSH Training - New Application" 
              fieldName="osh_new" 
            />
            
            <DocumentReviewItem 
              label="OSH Training - Renewal" 
              fieldName="osh_renewal" 
            />
            
            <DocumentReviewItem 
              label="Previous Permit (for renewal)" 
              fieldName="renewal_permit" 
            />
            
            <DocumentReviewItem 
              label="Accident Report" 
              fieldName="proof_accident_report" 
            />
            
            <DocumentReviewItem 
              label="Safety Inspection Report" 
              fieldName="proof_safety_inspection" 
            />
            
            <DocumentReviewItem 
              label="OSH Committee Report" 
              fieldName="proof_osh_committee" 
            />
            
            <DocumentReviewItem 
              label="OSH Program" 
              fieldName="proof_osh_program" 
            />
            
            <DocumentReviewItem 
              label={`Other Reports: ${checklist.other_reports_description || '(Not specified)'}`}
              fieldName="proof_other_reports" 
            />
          </tbody>
        </table>
      </div>

      {/* Evaluation Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        <div>
          <h3>Initial Evaluationx</h3>
          <textarea
            value={checklist.initial_evaluation || ''}
            onChange={(e) => setChecklist(prev => ({ ...prev, initial_evaluation: e.target.value }))}
            placeholder="Add your initial evaluation comments here..."
            style={{
              width: '100%',
              height: '120px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        <div>
          <h3>Reviewed By</h3>
          <textarea
            value={checklist.reviewed_by || ''}
            onChange={(e) => setChecklist(prev => ({ ...prev, reviewed_by: e.target.value }))}
            placeholder="Enter reviewer name and position..."
            style={{
              width: '100%',
              height: '120px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          View Full Checklist
        </button>
        <div>
          <button
            onClick={handleSaveChecklist}
            disabled={saving}
            style={{
              padding: '10px 20px',
              backgroundColor: saving ? '#999' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {saving ? 'Saving...' : 'Save Review'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#e74c3c', 
          padding: '10px 15px', 
          margin: '20px 0', 
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {error}
        </div>
      )}

      {/* Modal for viewing the full checklist */}
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
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'auto',
            padding: '20px'
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              backgroundColor: '#0066cc',
              color: 'white',
              marginBottom: '15px',
              borderRadius: '4px'
            }}>
              <h3 style={{ margin: 0 }}>Full Checklist View</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <iframe 
              src={`${window.location.origin}/checklist/${trackingcode}`}
              style={{
                width: '100%',
                height: '70vh',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              title="Full Checklist View"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChecklist;