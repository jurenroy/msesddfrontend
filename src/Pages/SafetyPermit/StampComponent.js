// StampComponent.jsx
import React from 'react';

const StampComponent = ({ date, time }) => {
  const containerStyle = {
    border: '3px solid #000000',
    padding: '1px 2px',
    width: '280px',
    textAlign: 'center',
    fontFamily: "'Courier New', Courier, monospace",
    letterSpacing: '0.05em',
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    position: 'absolute', // Positioning for the stamp
    bottom: '50px', // Adjust as needed
    right: '20px', // Adjust as needed
    visibility: 'visible',
    opacity: '50%'
  };

  const releasedStyle = {
    fontSize: '2rem',
    fontWeight: '900',
    margin: '1px',
    letterSpacing: '0.15em',
    visibility: 'visible'
  };

  const headerStyle = {
    fontSize: '0.9rem',
    margin: '1px 0',
    textTransform: 'uppercase',
    lineHeight: '1.2',
    visibility: 'visible'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    marginTop: '1px',
    visibility: 'visible'
  };

  return (
    <>
      <style>{`
        @media print {
          .stamp-container {
            visibility: visible !important; /* Ensure stamp is visible */
            position: absolute; /* Maintain positioning */
            bottom: 50px; /* Adjust as needed */
            right: 20px; /* Adjust as needed */
          }
        }
      `}</style>
    <div style={containerStyle} aria-label="Official stamp">
      <div style={headerStyle}>
        MINES AND GEOSCIENCES BUREAU REGIONAL OFFICE NO. X<br />
        MINE SAFETY, ENVIRONMENT AND
        SOCIAL DEVELOPMENT DIVISION
      </div>
      <div style={releasedStyle}>RELEASED</div>
      <div>
        <div style={labelStyle}>DATE: {date}</div>
        <div style={labelStyle}>TIME: {time}</div>
      </div>
    </div>
    </>
  );
};

export default StampComponent;