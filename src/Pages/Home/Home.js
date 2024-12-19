// src/pages/Home/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Home = () => {
    const navigate = useNavigate();

    const handleRoleClick = (role) => {
        // Navigate to the SafetyRole component with the role only
        navigate(`/safety/${role}`); // No action specified
    };

    return (
        <div className="home-container">
            <h1>This is the homepage:</h1>
            <div>
                <button onClick={() => handleRoleClick('Engineer')}>Safety Engineer</button>
                <button onClick={() => handleRoleClick('Inspector')}>Safety Inspector</button>
            </div>
        </div>
    );
};

export default Home;