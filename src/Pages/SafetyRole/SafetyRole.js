// src/pages/SafetyRole/SafetyRole.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SafetyRole.css'; // Import the CSS file

const SafetyRole = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    const handleButtonClick = (actionType) => {
        if (actionType === 'New') {
            // Navigate to the application form for the selected role
            navigate(`/safety/${role}/new`);
        } else if (actionType === 'Existing'){
            // Navigate to the application form for the selected role
            navigate(`/safety/${role}/existing`);
        }
    };

    return (
        <div className="safety-role-container">
            <h1>{role === 'Engineer' ? 'Safety Engineer' : 'Safety Inspector'}</h1>
            <h2>Please choose an action:</h2>
            <div>
                <button onClick={() => handleButtonClick('New')}>New</button>
                <button onClick={() => handleButtonClick('Existing')}>Existing</button>
            </div>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default SafetyRole;