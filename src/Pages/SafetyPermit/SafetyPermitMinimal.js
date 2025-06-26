import React from 'react';

const SafetyPermitMinimal = () => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body, html {
            visibility: visible !important;
            height: auto !important;
          }
          #root, .print-container {
            display: block !important;
            visibility: visible !important;
            height: auto !important;
            overflow: visible !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>

      <div className="print-container" role="document" aria-label="Minimal print test document" style={{ margin: '20px', padding: '10px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
        <h1>Temporary Safety Inspector Permit</h1>
        <p>This is a simple minimal text for print test.</p>
        <button onClick={handlePrint} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Print</button>
      </div>
    </>
  );
};

export default SafetyPermitMinimal;