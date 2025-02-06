import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SafetyRole.css'; // Import the CSS file

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

            {/* Main container */}
            <div className="safety-role-container">
                <h1>{role === 'Engineer' ? 'Safety Engineer' : 'Safety Inspector'}</h1>
                <h2>Please choose an action:</h2>
                <div className="button-group">
                    <button onClick={() => handleButtonClick('New')}>New</button>
                    <button onClick={() => handleButtonClick('Existing')}>Existing</button>
                </div>
                <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
            </div>

            {/* Footer */}
            <footer className="footer">© 2025 Mines and Geosciences Bureau</footer>
        </div>
    );
};

export default SafetyRole;

