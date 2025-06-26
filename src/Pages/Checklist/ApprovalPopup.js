import React, { useState, useRef, useEffect } from 'react';

const ApprovalPopup = ({ isOpen, onApprove, onCancel, error, orNumber }) => {
  const [inputOrNumber, setInputOrNumber] = useState(orNumber); // State to hold OR Number input
  const modalRef = useRef(null);

  // Close popup if click outside modal content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onCancel]);

  // Close popup if Escape key pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  const handleApproveClick = () => {
    if (!inputOrNumber.trim()) {
      alert('OR Number is required.');
      return;
    }
    onApprove(inputOrNumber);
    setInputOrNumber(''); // Reset after approving
  };

  useEffect(() => {
    setInputOrNumber(orNumber); // Update input when orNumber prop changes
  }, [orNumber]);

  if (!isOpen) return null; // Do not render if not open

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div ref={modalRef} style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        width: 400,
        maxWidth: '90%',
        padding: 20,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Approve Application {inputOrNumber}</h3>

        <label htmlFor="orInput" style={{ fontWeight: 'bold', marginBottom: 5 }}>OR Number:</label>
        <input
          id="orInput"
          type="text"
          value={inputOrNumber}
          onChange={(e) => setInputOrNumber(e.target.value)}
          placeholder="Enter OR Number"
          style={{
            padding: 8,
            fontSize: 14,
            borderRadius: 4,
            border: '1px solid #ccc',
            marginBottom: 10,
            width: '100%',
            boxSizing: 'border-box'
          }}
          required
          autoFocus
        />

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={handleApproveClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745', // Green for approve
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Approve
          </button>
          <button
            onClick={() => {
              setInputOrNumber('');
              onCancel();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545', // Red for cancel
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPopup;
