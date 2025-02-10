import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SafetyRole.css';

const SafetyRole = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    
    // Apply different background classes based on role
    const pageClass = role === 'Engineer' ? 'safety-role-page-engineer' : 'safety-role-page-inspector';
    
    const handleButtonClick = (actionType) => {
        navigate(`/safety/${role}/${actionType.toLowerCase()}`);
    };
    
    return (
        <div className={pageClass}>
            {/* Navbar with logo and text */}
            <nav className="navbar">
                <h2>Mines and Geosciences Bureau</h2>
            </nav>
            
            {/* Back to Home button */}
            <button className="back-home-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
            
            {/* Main container */}
            <div className="safety-role-container">
                <h2>{role === 'Engineer' ? 'Safety Engineer' : 'Safety Inspector'}</h2>
                <h1>Please choose an action:</h1>
                <div className="button-group">
                    <button onClick={() => handleButtonClick('New')}>New</button>
                    <button onClick={() => handleButtonClick('Existing')}>Existing</button>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="footer">© 2025 Mines and Geosciences Bureau</footer>
        </div>
    );
};

export default SafetyRole;